import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { isDemo } from "@/lib/demo"

export const runtime = "nodejs"

// DEV ONLY — bypasses Stripe to create a tribute for testing
export async function POST() {
  if (!isDemo()) {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 })
  }

  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Create a test payment record
  const payment = await prisma.payment.create({
    data: {
      userId: session.user.id,
      stripeCheckoutSessionId: `dev_test_${Date.now()}`,
      stripePaymentIntentId: `dev_pi_${Date.now()}`,
      amount: 9900,
      status: "COMPLETED",
    },
  })

  // Create a test tribute
  const tribute = await prisma.tribute.create({
    data: {
      userId: session.user.id,
      paymentId: payment.id,
      honoredName: "Test Person",
      relationship: "Beloved Friend",
      tributeMessage: "A wonderful person loved by all.",
      status: "ACTIVE",
      slug: `test-${Date.now()}`,
    },
  })

  return NextResponse.json({ tributeId: tribute.id })
}
