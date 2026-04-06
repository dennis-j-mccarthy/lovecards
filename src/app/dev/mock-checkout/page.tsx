"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function MockCheckoutPage() {
  const router = useRouter()
  const [processing, setProcessing] = useState(false)

  async function handlePay() {
    setProcessing(true)
    // Simulate a brief processing delay
    await new Promise((r) => setTimeout(r, 1500))

    // Trigger the buyer-fresh scenario which creates the payment and redirects
    try {
      const res = await fetch("/api/dev/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario: "buyer-fresh" }),
      })
      const data = await res.json()
      if (data.redirectUrl) {
        router.push(data.redirectUrl)
      }
    } catch {
      setProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f9fc] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Stripe-like header */}
        <div className="bg-[#111827] text-white p-6 rounded-t-lg">
          <img src="/logo.png" alt="Love Cards" className="h-12 mb-1" />
          <p className="text-2xl font-light">$49.00</p>
          <p className="text-sm text-gray-400 mt-1">Love Card Box</p>
        </div>

        {/* Card form */}
        <div className="bg-white border border-[#e0e0e0] border-t-0 p-6 rounded-b-lg shadow-lg">
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm text-gray-500 mb-1.5">Email</label>
              <div className="border border-[#d0d0d0] rounded px-3 py-2.5 bg-[#fafafa] text-sm text-[#333]">
                demo@lovecards.dev
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-1.5">Card information</label>
              <div className="border border-[#d0d0d0] rounded overflow-hidden">
                <div className="flex items-center px-3 py-2.5 bg-[#fafafa]">
                  <span className="text-sm text-[#333] flex-1">4242 4242 4242 4242</span>
                  <div className="flex gap-1">
                    <div className="w-8 h-5 bg-[#1a1f71] rounded-sm" />
                    <div className="w-8 h-5 bg-[#eb001b] rounded-sm opacity-60" />
                  </div>
                </div>
                <div className="flex border-t border-[#d0d0d0]">
                  <div className="flex-1 px-3 py-2.5 bg-[#fafafa] text-sm text-[#333] border-r border-[#d0d0d0]">
                    12 / 28
                  </div>
                  <div className="flex-1 px-3 py-2.5 bg-[#fafafa] text-sm text-[#333]">
                    123
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-1.5">Cardholder name</label>
              <div className="border border-[#d0d0d0] rounded px-3 py-2.5 bg-[#fafafa] text-sm text-[#333]">
                Demo User
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-1.5">Country or region</label>
              <div className="border border-[#d0d0d0] rounded px-3 py-2.5 bg-[#fafafa] text-sm text-[#333]">
                United States
              </div>
            </div>
          </div>

          <button
            onClick={handlePay}
            disabled={processing}
            className="w-full bg-[#0570de] text-white py-3 rounded-md text-sm font-medium hover:bg-[#0462c7] transition-colors disabled:opacity-70"
          >
            {processing ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Processing...
              </span>
            ) : (
              "Pay $49.00"
            )}
          </button>

          <div className="flex items-center justify-center gap-1.5 mt-4">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            <p className="text-xs text-gray-400">
              Demo mode — no real charge
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
