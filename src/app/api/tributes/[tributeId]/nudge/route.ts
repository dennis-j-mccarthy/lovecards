import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { sendNudgeEmail } from "@/lib/resend"
import { absoluteUrl } from "@/lib/utils"
import { z } from "zod"

const nudgeSchema = z.object({
  emailIds: z.array(z.string()).min(1).max(50),
})

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
    include: { contributions: { select: { id: true } } },
  })

  if (!tribute) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const body = await req.json()
  const parsed = nudgeSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { emailIds } = parsed.data
  const purchaserName = session.user.name ?? "Someone special"

  // Fetch the invite emails to nudge
  const inviteEmails = await prisma.inviteEmail.findMany({
    where: {
      id: { in: emailIds },
      tributeId: params.tributeId,
    },
  })

  // For each, find their invite token to reconstruct the URL
  const results = await Promise.allSettled(
    inviteEmails.map(async (invite: { toEmail: string; toName: string | null }) => {
      // Find the token created for this email
      const token = await prisma.inviteToken.findFirst({
        where: { tributeId: params.tributeId, email: invite.toEmail },
        orderBy: { createdAt: "desc" },
      })

      if (!token) {
        throw new Error(`No token found for ${invite.toEmail}`)
      }

      const tributeUrl = absoluteUrl(
        `/tribute/${tribute.slug}/contribute?token=${token.token}`
      )

      await sendNudgeEmail({
        toEmail: invite.toEmail,
        toName: invite.toName ?? undefined,
        honoredName: tribute.honoredName,
        purchaserName,
        tributeUrl,
        contributionCount: tribute.contributions.length,
      })

      return { email: invite.toEmail, success: true }
    })
  )

  const sent = results.filter((r) => r.status === "fulfilled").length
  const failed = results.filter((r) => r.status === "rejected").length

  return NextResponse.json({ sent, failed })
}
