"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"

export default function CheckoutPage() {
  const { isLoaded, isSignedIn } = useUser()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (isLoaded && !isSignedIn) {
    router.push("/sign-in?redirect_url=/checkout")
    return null
  }

  async function handleCheckout() {
    setLoading(true)
    setError(null)

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
    <div className="bg-white px-6 py-16">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-normal text-[#111827] mb-4">
            Start a Love Card Box
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            A beautifully printed collection of cards from everyone who
            loves them — packaged in a keepsake box.
          </p>
        </div>

        {/* What you get */}
        <div className="border border-[#e5e7eb] p-6 mb-6">
          <ul className="space-y-3 text-sm text-[#1f2937]">
            {[
              "Unlimited contributors via email or shareable link",
              "Text messages, photos, or both per contribution",
              "Each contribution printed as a beautiful individual card",
              "Professionally printed on premium card stock",
              "Packaged in a branded keepsake box",
              "Optional anonymous contributions",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-[#800020] mt-0.5">✦</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Price */}
        <div className="flex items-baseline justify-between mb-6 px-1">
          <span className="text-sm text-gray-500">Love Card Box</span>
          <span className="text-2xl font-normal text-[#111827]">$49</span>
        </div>

        {error && (
          <div className="mb-4 p-3 border border-red-200 bg-red-50 text-red-700 text-sm text-center">
            {error}
          </div>
        )}

        <button
          onClick={handleCheckout}
          disabled={loading || !isLoaded}
          className="w-full bg-[#111827] text-white py-4 text-sm tracking-[1px] uppercase hover:bg-[#333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Redirecting to payment..." : "Continue to Payment"}
        </button>

        <p className="text-xs text-gray-400 text-center mt-4">
          Secure payment via Stripe. You&apos;ll create your Love Card Box after checkout.
        </p>

        {(process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_DEMO_MODE === "true") && (
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
            disabled={loading || !isLoaded}
            className="w-full mt-3 border border-dashed border-[#800020] text-[#800020] py-3 text-xs tracking-[1px] uppercase hover:bg-[#fdf2f4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Skip Payment (Dev Only)
          </button>
        )}
      </div>
    </div>
  )
}
