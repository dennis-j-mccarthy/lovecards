import { NextRequest, NextResponse } from "next/server"
import { getStripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import Stripe from "stripe"

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId

        if (!userId) {
          console.error("No userId in session metadata", session.id)
          break
        }

        // Idempotency: only create if not already exists
        await prisma.payment.upsert({
          where: { stripeCheckoutSessionId: session.id },
          create: {
            userId,
            stripePaymentIntentId: session.payment_intent as string,
            stripeCheckoutSessionId: session.id,
            amount: session.amount_total ?? 9900,
            currency: session.currency ?? "usd",
            status: "COMPLETED",
          },
          update: {
            status: "COMPLETED",
          },
        })
        break
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        await prisma.payment
          .update({
            where: { stripePaymentIntentId: paymentIntent.id },
            data: { status: "FAILED" },
          })
          .catch(() => {
            // Payment record may not exist yet if webhook fires before upsert
          })
        break
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge
        const paymentIntentId = charge.payment_intent as string
        if (paymentIntentId) {
          await prisma.payment
            .update({
              where: { stripePaymentIntentId: paymentIntentId },
              data: { status: "REFUNDED" },
            })
            .catch(() => {})
        }
        break
      }
    }
  } catch (error) {
    console.error("Webhook handler error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
