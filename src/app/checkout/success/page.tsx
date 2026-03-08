"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { Suspense } from "react"

function TributeCreationForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()
  const sessionId = searchParams.get("session_id")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    honoredName: "",
    relationship: "",
    tributeMessage: "",
    birthDate: "",
    location: "",
  })

  // Redirect to sign-in if not authenticated (with session_id preserved)
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/sign-in?callbackUrl=/checkout/success?session_id=${sessionId}`)
    }
  }, [status, router, sessionId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!sessionId) {
      setError("Missing payment session. Please contact support.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Get the payment ID linked to this Stripe session
      const paymentRes = await fetch(`/api/checkout/verify?session_id=${sessionId}`)
      const paymentData = await paymentRes.json()

      if (!paymentRes.ok || !paymentData.paymentId) {
        // Payment webhook may still be processing — retry message
        throw new Error(
          paymentData.error === "Payment not found or not completed"
            ? "Your payment is still processing. Please wait a moment and try again."
            : "Could not verify payment. Please contact support."
        )
      }

      const res = await fetch("/api/tributes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId: paymentData.paymentId, ...form }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Failed to create tribute")

      router.push(`/dashboard/${data.id}`)
    } catch (err) {
      setError((err as Error).message)
      setLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#faf9f7] grid place-items-center">
        <p className="text-sm text-[#999]">Loading...</p>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-[#faf9f7] grid place-items-center px-6">
        <div className="text-center">
          <p className="text-sm text-[#666] mb-4">Redirecting to sign in...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#faf9f7] px-6 py-16">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs tracking-[3px] uppercase text-[#8b7355] mb-2">
            Payment Received ✓
          </p>
          <h1 className="text-3xl font-normal text-[#1a1a1a] mb-2">
            Create Your Tribute
          </h1>
          <p className="text-sm text-[#666]">
            Tell us about the person you&apos;d like to honor
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 border border-red-200 bg-red-50 text-red-700 text-sm">
            <p className="font-medium mb-1">Something went wrong</p>
            <p>{error}</p>
            {error.includes("processing") && (
              <button
                onClick={handleSubmit as unknown as React.MouseEventHandler}
                className="mt-2 text-xs underline"
              >
                Try again
              </button>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs tracking-[2px] uppercase text-[#8b7355] mb-2">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={form.honoredName}
              onChange={(e) => setForm((f) => ({ ...f, honoredName: e.target.value }))}
              placeholder="e.g. Margaret Anne Williams"
              className="w-full border border-[#d4c5a9] bg-white px-4 py-3 text-sm outline-none focus:border-[#8b7355]"
            />
          </div>

          <div>
            <label className="block text-xs tracking-[2px] uppercase text-[#8b7355] mb-2">
              Your Relationship *
            </label>
            <input
              type="text"
              required
              value={form.relationship}
              onChange={(e) => setForm((f) => ({ ...f, relationship: e.target.value }))}
              placeholder="e.g. My grandmother, Our colleague, My dear friend"
              className="w-full border border-[#d4c5a9] bg-white px-4 py-3 text-sm outline-none focus:border-[#8b7355]"
            />
          </div>

          <div>
            <label className="block text-xs tracking-[2px] uppercase text-[#8b7355] mb-2">
              Birth Date
            </label>
            <input
              type="date"
              value={form.birthDate}
              onChange={(e) => setForm((f) => ({ ...f, birthDate: e.target.value }))}
              className="w-full border border-[#d4c5a9] bg-white px-4 py-3 text-sm outline-none focus:border-[#8b7355]"
            />
          </div>

          <div>
            <label className="block text-xs tracking-[2px] uppercase text-[#8b7355] mb-2">
              Location
            </label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
              placeholder="e.g. Portland, Oregon"
              className="w-full border border-[#d4c5a9] bg-white px-4 py-3 text-sm outline-none focus:border-[#8b7355]"
            />
          </div>

          <div>
            <label className="block text-xs tracking-[2px] uppercase text-[#8b7355] mb-2">
              Your Tribute Message *
            </label>
            <textarea
              required
              rows={5}
              value={form.tributeMessage}
              onChange={(e) => setForm((f) => ({ ...f, tributeMessage: e.target.value }))}
              placeholder="Share your own memory or tribute message. This will appear on the first card."
              className="w-full border border-[#d4c5a9] bg-white px-4 py-3 text-sm outline-none focus:border-[#8b7355] resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1a1a1a] text-white py-4 text-sm tracking-[1px] uppercase hover:bg-[#333] transition-colors disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Tribute & Continue"}
          </button>
        </form>

        <p className="text-xs text-[#999] text-center mt-6">
          Signed in as {session?.user?.email}
        </p>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#faf9f7] grid place-items-center">
          <p className="text-sm text-[#999]">Loading...</p>
        </div>
      }
    >
      <TributeCreationForm />
    </Suspense>
  )
}
