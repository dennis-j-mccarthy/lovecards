"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"

interface TributeStatus {
  status: string
  pdfUrl: string | null
}

export default function GeneratePage() {
  const params = useParams()
  const tributeId = params.tributeId as string

  const [tributeStatus, setTributeStatus] = useState<TributeStatus | null>(null)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Poll for status updates
  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await fetch(`/api/tributes/${tributeId}`)
        const data = await res.json()
        setTributeStatus({ status: data.status, pdfUrl: data.pdfUrl })

        if (data.status === "COMPLETED" || data.status === "ACTIVE") {
          clearInterval(interval)
        }
      } catch {
        // ignore
      }
    }

    checkStatus()
    const interval = setInterval(checkStatus, 3000)
    return () => clearInterval(interval)
  }, [tributeId])

  async function handleGenerate() {
    setGenerating(true)
    setError(null)

    try {
      const res = await fetch(`/api/tributes/${tributeId}/generate`, {
        method: "POST",
      })
      const data = await res.json()

      if (!res.ok && res.status !== 202) {
        throw new Error(data.error ?? "Failed to start generation")
      }

      setTributeStatus((prev) => ({ ...prev!, status: "GENERATING" }))
    } catch (err) {
      setError((err as Error).message)
      setGenerating(false)
    }
  }

  const isGenerating = tributeStatus?.status === "GENERATING"
  const isCompleted = tributeStatus?.status === "COMPLETED"

  const STEPS = [
    { label: "Reviewing contributions", done: isGenerating || isCompleted },
    { label: "Laying out your cards", done: isGenerating || isCompleted },
    { label: "Sending to printer", done: isCompleted },
    { label: "Order submitted!", done: isCompleted },
  ]

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <nav className="border-b border-[#d4c5a9] px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <Link
            href={`/dashboard/${tributeId}`}
            className="text-xs tracking-[2px] uppercase text-[#8b7355]"
          >
            ← Back
          </Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <p className="text-xs tracking-[3px] uppercase text-[#8b7355] mb-4">
          Final Review
        </p>
        <h1 className="text-3xl font-normal text-[#1a1a1a] mb-4">
          {isCompleted ? "Your Order Has Been Submitted" : "Send to Printer"}
        </h1>

        {!isGenerating && !isCompleted && (
          <>
            <p className="text-[#666] text-sm leading-relaxed mb-8 max-w-md mx-auto">
              Once submitted, each contribution will be professionally printed on
              premium card stock, placed in your keepsake box, and shipped directly
              to you. Standard shipping is free — expect delivery within 4 business
              days. Expedited shipping is available for an additional fee.
            </p>

            {error && (
              <div className="mb-6 p-3 border border-red-200 bg-red-50 text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="border border-[#e8e0d4] bg-white p-5 mb-8 max-w-md mx-auto text-left">
              <p className="text-xs tracking-[2px] uppercase text-[#8b7355] mb-2">
                Please Note
              </p>
              <p className="text-xs text-[#666] leading-relaxed">
                As the purchaser, you are entirely responsible for reviewing all
                contributions for accuracy, including spelling, grammar, and content.
                Under no circumstances will we be able to reprint cards once an order
                has been submitted. Please review carefully before proceeding.
              </p>
            </div>

            <button
              onClick={handleGenerate}
              disabled={generating}
              className="bg-[#1a1a1a] text-white px-10 py-4 text-sm tracking-[1px] uppercase hover:bg-[#333] transition-colors disabled:opacity-50"
            >
              {generating ? "Submitting..." : "Send to Printer"}
            </button>

            <p className="text-xs text-[#999] mt-4">
              This may take 1–3 minutes depending on the number of contributions.
            </p>

            <div className="mt-6">
              <Link
                href={`/dashboard/${tributeId}`}
                className="text-sm text-[#8b7355] hover:text-[#1a1a1a] transition-colors"
              >
                ← Go back and review contributions
              </Link>
            </div>
          </>
        )}

        {isGenerating && (
          <div className="mt-10">
            <div className="flex flex-col items-center gap-4">
              {STEPS.map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      step.done
                        ? "border-[#8b7355] bg-[#8b7355]"
                        : "border-[#d4c5a9]"
                    }`}
                  >
                    {step.done && (
                      <span className="text-white text-xs">✓</span>
                    )}
                  </div>
                  <p
                    className={`text-sm ${
                      step.done ? "text-[#1a1a1a]" : "text-[#ccc]"
                    }`}
                  >
                    {step.label}
                  </p>
                  {i === 2 && !isCompleted && (
                    <span className="text-xs text-[#8b7355] animate-pulse">
                      Processing...
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {isCompleted && (
          <div className="mt-8 max-w-lg mx-auto text-left">
            <div className="text-center mb-10">
              <p className="text-4xl mb-4">✦</p>
              <h2 className="text-2xl font-normal text-[#1a1a1a] mb-2">
                Thank You So Much for Your Order
              </h2>
              <p className="text-sm text-[#666] leading-relaxed">
                We look forward to helping you share this keepsake with your loved one.
              </p>
            </div>

            <div className="border border-[#d4c5a9] bg-white p-6 space-y-5 mb-8">
              <div>
                <p className="text-xs tracking-[2px] uppercase text-[#8b7355] mb-2">
                  What Happens Next
                </p>
                <ul className="space-y-3 text-sm text-[#2d2d2d]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#8b7355] mt-0.5">✦</span>
                    <span>
                      Each contribution is professionally printed on premium card stock,
                      individually cut and finished with care.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#8b7355] mt-0.5">✦</span>
                    <span>
                      Your cards are placed in a beautiful branded keepsake box,
                      ready to be opened and treasured.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#8b7355] mt-0.5">✦</span>
                    <span>
                      Standard shipping is included — expect delivery within
                      <strong> 4 business days</strong>.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="border-t border-[#e8e0d4] pt-4">
                <p className="text-sm text-[#666]">
                  Need it sooner?{" "}
                  <a
                    href="mailto:hello@lovecards.dev?subject=Expedited%20Shipping"
                    className="text-[#8b7355] hover:underline"
                  >
                    Expedited shipping is available for an additional fee →
                  </a>
                </p>
              </div>
            </div>

            {tributeStatus?.pdfUrl && (
              <div className="text-center mb-6">
                <a
                  href={tributeStatus.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block border border-[#d4c5a9] text-[#8b7355] px-8 py-3 text-sm tracking-[1px] uppercase hover:bg-[#f5f0e8] transition-colors"
                >
                  Download PDF Preview
                </a>
              </div>
            )}

            <div className="text-center">
              <Link
                href={`/dashboard/${tributeId}`}
                className="inline-block bg-[#1a1a1a] text-white px-10 py-4 text-sm tracking-[1px] uppercase hover:bg-[#333] transition-colors"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
