import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getStripe, TRIBUTE_PRICE_CENTS } from "@/lib/stripe"
import { absoluteUrl } from "@/lib/utils"

export async function POST(_req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const checkoutSession = await getStripe().checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: TRIBUTE_PRICE_CENTS,
            product_data: {
              name: "Memorial Tribute Card Box",
              description:
                "A beautifully printed collection of tribute cards in a branded keepsake box.",
            },
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: absoluteUrl(`/checkout/success?session_id={CHECKOUT_SESSION_ID}`),
      cancel_url: absoluteUrl("/"),
      metadata: {
        userId: session.user.id,
      },
      customer_email: session.user.email ?? undefined,
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error("Stripe checkout error:", error)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}
