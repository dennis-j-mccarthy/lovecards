import { NextRequest, NextResponse } from "next/server"
import { getDbUser } from "@/lib/user"
import { prisma } from "@/lib/prisma"
import { generateCardLayout, generateFallbackLayout } from "@/lib/anthropic"
import { generateMemorialPDF } from "@/lib/pdf"
import { writeFile } from "fs/promises"
import path from "path"
import { Resend } from "resend"

export const runtime = "nodejs"
export const maxDuration = 60

const PRINT_JOB_EMAIL = "dennisjmccarthy+lc-printjob@gmail.com"

export async function POST(
  req: NextRequest,
  { params }: { params: { tributeId: string } }
) {
  const user = await getDbUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const tribute = await prisma.tribute.findFirst({
    where: { id: params.tributeId, userId: user.id },
    include: {
      contributions: {
        where: { status: "APPROVED", isHidden: false },
        orderBy: { createdAt: "asc" },
      },
      template: true,
      payment: true,
    },
  })

  if (!tribute) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  if (tribute.status === "GENERATING") {
    return NextResponse.json({ error: "Already generating" }, { status: 409 })
  }

  if (tribute.contributions.length === 0) {
    return NextResponse.json({ error: "No contributions yet" }, { status: 400 })
  }

  // Set status to GENERATING immediately
  await prisma.tribute.update({
    where: { id: params.tributeId },
    data: { status: "GENERATING" },
  })

  // Run generation asynchronously (don't await — return 202 immediately)
  runGeneration(params.tributeId, tribute as Parameters<typeof generateCardLayout>[0], user).catch(
    async (error) => {
      console.error("PDF generation failed:", error)
      await prisma.tribute.update({
        where: { id: params.tributeId },
        data: { status: "ACTIVE" }, // Reset so they can retry
      })
    }
  )

  return NextResponse.json({ status: "generating" }, { status: 202 })
}

async function runGeneration(
  tributeId: string,
  tribute: Parameters<typeof generateCardLayout>[0] & { payment?: { id: string; amount: number; createdAt: Date } },
  user: { id: string; email: string; name: string | null }
) {
  let layout: Awaited<ReturnType<typeof generateCardLayout>>

  try {
    layout = await generateCardLayout(tribute)
  } catch (error) {
    console.error("Claude layout generation failed, using fallback:", error)
    layout = generateFallbackLayout(tribute)
  }

  // Store layout data for potential re-renders
  await prisma.tribute.update({
    where: { id: tributeId },
    data: { cardGenerationData: layout as object },
  })

  // Generate PDF (Puppeteer may not be available locally)
  let pdfBuffer: Buffer | null = null
  let pdfUrl: string | null = null

  try {
    pdfBuffer = await generateMemorialPDF(layout, tribute)
    const filename = `cards-${tributeId}-${Date.now()}.pdf`
    const uploadDir = path.join(process.cwd(), "public", "uploads")
    const filePath = path.join(uploadDir, filename)
    await writeFile(filePath, pdfBuffer)
    pdfUrl = `/uploads/${filename}`
  } catch (pdfError) {
    console.error("PDF generation failed (continuing without PDF):", pdfError)
  }

  // Mark as completed
  await prisma.tribute.update({
    where: { id: tributeId },
    data: {
      status: "COMPLETED",
      ...(pdfUrl ? { pdfUrl } : {}),
    },
  })

  // Send print job email
  try {
    const resend = new Resend(process.env.RESEND_API_KEY!)
    const now = new Date()

    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: PRINT_JOB_EMAIL,
      subject: `Print Job: Love Card Box for ${tribute.honoredName}`,
      html: `
        <h1>New Print Job</h1>
        <h2>Love Card Box for ${tribute.honoredName}</h2>

        <h3>Order Details</h3>
        <table style="border-collapse: collapse; width: 100%; max-width: 500px;">
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Order ID</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${tributeId}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Date</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })} at ${now.toLocaleTimeString("en-US")}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Honored</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${tribute.honoredName}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Cards</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${tribute.contributions.length} cards</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Pages</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${Math.ceil(tribute.contributions.length / 9)} pages (3×3 layout)</td>
          </tr>
        </table>

        <h3>Ship To</h3>
        <table style="border-collapse: collapse; width: 100%; max-width: 500px;">
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Name</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${tribute.shipToName || user.name || "N/A"}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Address</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${tribute.shipToAddress || "N/A"}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">City, State ZIP</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${[tribute.shipToCity, tribute.shipToState].filter(Boolean).join(", ")} ${tribute.shipToZip || ""}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Purchaser Email</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${user.email}</td>
          </tr>
        </table>

        <p style="margin-top: 20px; color: #666;">
          ${pdfBuffer ? "PDF is attached." : "PDF generation was not available — please generate manually."} Please print on premium card stock, cut to size, and package in a Love Cards keepsake box.
        </p>
      `,
      ...(pdfBuffer ? {
        attachments: [
          {
            filename: `love-cards-${tribute.honoredName.toLowerCase().replace(/\s+/g, "-")}.pdf`,
            content: pdfBuffer.toString("base64"),
          },
        ],
      } : {}),
    })

    console.log(`Print job email sent for tribute ${tributeId}`)
  } catch (emailError) {
    console.error("Failed to send print job email:", emailError)
    // Don't fail the generation — the PDF is saved, email is just notification
  }
}
