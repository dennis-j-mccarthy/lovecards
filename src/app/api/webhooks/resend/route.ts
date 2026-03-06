import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  const body = await req.json()

  // Resend sends email events like "email.opened"
  if (body.type === "email.opened" && body.data?.email_id) {
    await prisma.inviteEmail
      .updateMany({
        where: { resendId: body.data.email_id, openedAt: null },
        data: { openedAt: new Date() },
      })
      .catch(() => {})
  }

  return NextResponse.json({ received: true })
}
