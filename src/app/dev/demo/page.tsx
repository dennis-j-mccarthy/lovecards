"use client"

import { useState } from "react"

const SCENARIOS = [
  {
    id: "buyer-fresh",
    title: "Fresh Buyer",
    description:
      "Start from the tribute creation form (post-payment). Fill in who you're honoring, then land on the dashboard.",
    color: "#e8785e",
  },
  {
    id: "buyer-with-tribute",
    title: "Buyer with Tribute",
    description:
      "Jump straight to the dashboard with a pre-created tribute. Explore invite, design, and generate pages.",
    color: "#e6a644",
  },
  {
    id: "contributor",
    title: "Contributor",
    description:
      "Open the contributor form in a new tab. Experience writing a message as someone who received an invite link.",
    color: "#5ba887",
  },
  {
    id: "post-purchase",
    title: "Post-Purchase (with contributions)",
    description:
      "Dashboard with a tribute that already has 6 contributions. Test the live feed, review, and card generation.",
    color: "#6b8fd4",
  },
]

export default function DemoPage() {
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [contributeUrl, setContributeUrl] = useState<string | null>(null)

  async function startDemo(scenario: string) {
    setLoading(scenario)
    setError(null)

    try {
      const res = await fetch("/api/dev/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario }),
      })

      const text = await res.text()
      let data
      try {
        data = JSON.parse(text)
      } catch {
        throw new Error(`Server returned non-JSON: ${text.slice(0, 200)}`)
      }

      if (!res.ok) throw new Error(data.error ?? `Demo setup failed (${res.status})`)

      if (scenario === "contributor" && data.contributeUrl) {
        setContributeUrl(data.contributeUrl)
        window.open(data.contributeUrl, "_blank")
        setLoading(null)
      } else if (data.redirectUrl) {
        // Don't clear loading — we're navigating away
        window.location.href = data.redirectUrl
      } else {
        throw new Error("No redirect URL returned")
      }
    } catch (err) {
      console.error("Demo error:", err)
      setError((err as Error).message)
      setLoading(null)
    }
  }

  async function clearDemo() {
    setLoading("clear")
    setError(null)
    try {
      await fetch("/api/dev/demo", { method: "DELETE" })
      setContributeUrl(null)
    } catch (err) {
      console.error("Clear error:", err)
      setError((err as Error).message)
    }
    setLoading(null)
  }

  return (
    <div className="min-h-screen bg-[#faf9f7] px-6 py-16">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs tracking-[3px] uppercase text-[#8b7355] mb-2">
            Dev Only
          </p>
          <h1 className="text-3xl font-normal text-[#1a1a1a] mb-2">
            Demo Mode
          </h1>
          <p className="text-sm text-[#666]">
            Simulate the full Love Cards experience with fake auth and payments.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 border border-red-200 bg-red-50 text-red-700 text-sm text-center">
            {error}
          </div>
        )}

        <div className="grid gap-4">
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => startDemo(s.id)}
              disabled={loading !== null}
              className="text-left border p-5 transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                borderColor: s.color,
                borderLeftWidth: 4,
                background: loading === s.id ? "#f5f0e8" : "white",
              }}
            >
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-base font-semibold" style={{ color: s.color }}>
                  {s.title}
                </h3>
                {loading === s.id && (
                  <span className="text-xs text-[#999]">Setting up...</span>
                )}
              </div>
              <p className="text-sm text-[#666] leading-relaxed">{s.description}</p>
            </button>
          ))}
        </div>

        {contributeUrl && (
          <div className="mt-6 p-4 border border-[#5ba887] bg-[#f0faf5] text-sm">
            <p className="font-medium text-[#479474] mb-1">Contributor link ready</p>
            <a
              href={contributeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#5ba887] underline break-all"
            >
              {contributeUrl}
            </a>
          </div>
        )}

        <div className="mt-10 pt-6 border-t border-[#e5e0d5] text-center">
          <button
            onClick={clearDemo}
            disabled={loading !== null}
            className="text-xs tracking-[1px] uppercase text-[#999] hover:text-[#666] transition-colors disabled:opacity-50"
          >
            {loading === "clear" ? "Clearing..." : "Clear Demo Data"}
          </button>
        </div>
      </div>
    </div>
  )
}
