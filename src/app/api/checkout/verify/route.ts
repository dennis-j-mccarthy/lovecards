import { NextRequest, NextResponse } from "next/server"
import { getDbUserId } from "@/lib/user"
import { getStripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const userId = await getDbUserId()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const sessionId = req.nextUrl.searchParams.get("session_id")
  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 })
  }

  // Check if payment already exists in DB (e.g. from webhook)
  const existing = await prisma.payment.findFirst({
    where: {
      stripeCheckoutSessionId: sessionId,
      userId,
      status: "COMPLETED",
    },
  })

  if (existing) {
    return NextResponse.json({ paymentId: existing.id })
  }

  // Payment not in DB yet — fetch from Stripe directly and create it
  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Payment not found or not completed" },
        { status: 404 }
      )
    }

    // Verify this session belongs to this user
    if (session.metadata?.userId !== userId) {
      return NextResponse.json(
        { error: "Payment not found or not completed" },
        { status: 404 }
      )
    }

    // Create the payment record (idempotent via upsert)
    const payment = await prisma.payment.upsert({
      where: { stripeCheckoutSessionId: sessionId },
      create: {
        userId,
        stripePaymentIntentId: session.payment_intent as string,
        stripeCheckoutSessionId: sessionId,
        amount: session.amount_total ?? 4900,
        currency: session.currency ?? "usd",
        status: "COMPLETED",
      },
      update: {
        status: "COMPLETED",
      },
    })

    return NextResponse.json({ paymentId: payment.id })
  } catch (err) {
    console.error("Stripe session verify error:", err)
    return NextResponse.json(
      { error: "Payment not found or not completed" },
      { status: 404 }
    )
  }
}
