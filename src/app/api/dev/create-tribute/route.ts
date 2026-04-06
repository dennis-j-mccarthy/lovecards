import { NextResponse } from "next/server"
import { getDbUserId } from "@/lib/user"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"

// DEV ONLY — bypasses Stripe to create a tribute for testing
export async function POST() {
  const userId = await getDbUserId()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Create a test payment record
  const payment = await prisma.payment.create({
    data: {
      userId,
      stripeCheckoutSessionId: `dev_test_${Date.now()}`,
      stripePaymentIntentId: `dev_pi_${Date.now()}`,
      amount: 9900,
      status: "COMPLETED",
    },
  })

  // Create a test tribute
  const tribute = await prisma.tribute.create({
    data: {
      userId,
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
