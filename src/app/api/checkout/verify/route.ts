import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const sessionId = req.nextUrl.searchParams.get("session_id")
  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 })
  }

  const payment = await prisma.payment.findFirst({
    where: {
      stripeCheckoutSessionId: sessionId,
      userId: session.user.id,
      status: "COMPLETED",
    },
  })

  if (!payment) {
    return NextResponse.json(
      { error: "Payment not found or not completed" },
      { status: 404 }
    )
  }

  return NextResponse.json({ paymentId: payment.id })
}
