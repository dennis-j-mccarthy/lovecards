import { NextRequest, NextResponse } from "next/server"
import { getDbUser } from "@/lib/user"
import { prisma } from "@/lib/prisma"
import { sendInviteEmail } from "@/lib/resend"
import { absoluteUrl } from "@/lib/utils"
import { z } from "zod"

const inviteSchema = z.object({
  recipients: z.array(
    z.object({
      email: z.string().email(),
      name: z.string().optional(),
      cellPhone: z.string().min(1, "Cell phone is required").max(20),
      phone: z.string().max(20).optional(),
    })
  ).min(1).max(50),
})

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
  const purchaserName = user.name ?? "Someone special"

  const results = await Promise.allSettled(
    recipients.map(async ({ email, name, cellPhone, phone }) => {
      // Create a unique token for this email
      const tokenRecord = await prisma.inviteToken.create({
        data: {
          tributeId: params.tributeId,
          email,
          cellPhone,
          phone: phone || null,
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
          toCellPhone: cellPhone,
          toPhone: phone || null,
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
