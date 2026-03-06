import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { generateCardLayout, generateFallbackLayout } from "@/lib/anthropic"
import { generateMemorialPDF } from "@/lib/pdf"
import { put } from "@vercel/blob"

export const runtime = "nodejs"
export const maxDuration = 60

export async function POST(
  req: NextRequest,
  { params }: { params: { tributeId: string } }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const tribute = await prisma.tribute.findFirst({
    where: { id: params.tributeId, userId: session.user.id },
    include: {
      contributions: {
        where: { status: "APPROVED", isHidden: false },
        orderBy: { createdAt: "asc" },
      },
      template: true,
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
  runGeneration(params.tributeId, tribute as Parameters<typeof generateCardLayout>[0]).catch(
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
  tribute: Parameters<typeof generateCardLayout>[0]
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

  // Generate PDF
  const pdfBuffer = await generateMemorialPDF(layout, tribute)

  // Upload to Vercel Blob
  const { url } = await put(
    `tributes/${tributeId}/cards-${Date.now()}.pdf`,
    pdfBuffer,
    {
      access: "public",
      contentType: "application/pdf",
    }
  )

  // Mark as completed
  await prisma.tribute.update({
    where: { id: tributeId },
    data: {
      status: "COMPLETED",
      pdfUrl: url,
    },
  })
}
