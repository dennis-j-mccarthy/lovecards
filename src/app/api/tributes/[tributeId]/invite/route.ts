import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { sendInviteEmail } from "@/lib/resend"
import { absoluteUrl } from "@/lib/utils"
import { z } from "zod"

const inviteSchema = z.object({
  recipients: z.array(
    z.object({
      email: z.string().email(),
      name: z.string().optional(),
    })
  ).min(1).max(50),
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
  })

  if (!tribute) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const body = await req.json()
  const parsed = inviteSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { recipients } = parsed.data
  const purchaserName = session.user.name ?? "Someone special"

  const results = await Promise.allSettled(
    recipients.map(async ({ email, name }) => {
      // Create a unique token for this email
      const tokenRecord = await prisma.inviteToken.create({
        data: {
          tributeId: params.tributeId,
          email,
          maxUses: 1,
        },
      })

      const tributeUrl = absoluteUrl(
        `/tribute/${tribute.slug}/contribute?token=${tokenRecord.token}`
      )

      const resendResult = await sendInviteEmail({
        toEmail: email,
        toName: name,
        honoredName: tribute.honoredName,
        purchaserName,
        tributeUrl,
      })

      await prisma.inviteEmail.create({
        data: {
          tributeId: params.tributeId,
          toEmail: email,
          toName: name,
          resendId: resendResult?.id,
        },
      })

      return { email, success: true }
    })
  )

  const sent = results.filter((r) => r.status === "fulfilled").length
  const failed = results.filter((r) => r.status === "rejected").length

  return NextResponse.json({ sent, failed })
}
