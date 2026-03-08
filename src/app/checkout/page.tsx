"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

export default function CheckoutPage() {
  const { status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (status === "unauthenticated") {
    router.push("/sign-in?callbackUrl=/checkout")
    return null
  }

  async function handleCheckout() {
    setLoading(true)
    setError(null)

    // In dev mode, go to mock checkout instead of real Stripe
    if (process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
      router.push("/dev/mock-checkout")
      return
    }

    try {
      const res = await fetch("/api/checkout", { method: "POST" })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error ?? "Checkout failed")
      if (data.url) window.location.href = data.url
    } catch (err) {
      setError((err as Error).message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <p className="text-xs tracking-[3px] uppercase text-[#8b7355] mb-2">
            Love Cards
          </p>
          <h1 className="text-3xl font-normal text-[#1a1a1a] mb-4">
            Start a Card Box
          </h1>
          <p className="text-[#666] text-sm leading-relaxed">
            A beautifully printed collection of tribute cards from everyone who
            loved them — packaged in a keepsake box.
          </p>
        </div>

        {/* What you get */}
        <div className="border border-[#d4c5a9] p-6 mb-6">
          <ul className="space-y-3 text-sm text-[#2d2d2d]">
            {[
              "Unlimited contributors via email or shareable link",
              "Text messages, photos, or both per contribution",
              "Each contribution printed as a beautiful individual card",
              "Professionally printed on premium card stock",
              "Packaged in a branded keepsake box",
              "Optional anonymous contributions",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-[#8b7355] mt-0.5">✦</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Price */}
        <div className="flex items-baseline justify-between mb-6 px-1">
          <span className="text-sm text-[#666]">Memorial Tribute Box</span>
          <span className="text-2xl font-normal text-[#1a1a1a]">$49</span>
        </div>

        {error && (
          <div className="mb-4 p-3 border border-red-200 bg-red-50 text-red-700 text-sm text-center">
            {error}
          </div>
        )}

        <button
          onClick={handleCheckout}
          disabled={loading || status === "loading"}
          className="w-full bg-[#1a1a1a] text-white py-4 text-sm tracking-[1px] uppercase hover:bg-[#333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Redirecting to payment..." : "Continue to Payment"}
        </button>

        <p className="text-xs text-[#999] text-center mt-4">
          Secure payment via Stripe. You&apos;ll create your tribute after checkout.
        </p>

        {process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_DEMO_MODE === "true" && (
          <button
            onClick={async () => {
              setLoading(true)
              setError(null)
              try {
                const res = await fetch("/api/dev/demo", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ scenario: "buyer-fresh" }),
                })
                const data = await res.json()
                if (!res.ok) throw new Error(data.error ?? "Demo failed")
                if (data.redirectUrl) window.location.href = data.redirectUrl
              } catch (err) {
                setError((err as Error).message)
                setLoading(false)
              }
            }}
            disabled={loading || status === "loading"}
            className="w-full mt-3 border border-dashed border-[#8b7355] text-[#8b7355] py-3 text-xs tracking-[1px] uppercase hover:bg-[#f5f0e8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Skip Payment (Dev Only)
          </button>
        )}
      </div>
    </div>
  )
}
