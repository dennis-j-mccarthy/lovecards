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
    { label: "Analyzing contributions", done: isGenerating || isCompleted },
    { label: "Claude is designing your layout", done: isGenerating || isCompleted },
    { label: "Rendering PDF", done: isCompleted },
    { label: "Cards ready!", done: isCompleted },
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
          Card Generation
        </p>
        <h1 className="text-3xl font-normal text-[#1a1a1a] mb-4">
          {isCompleted ? "Your Cards Are Ready" : "Generate Your Cards"}
        </h1>

        {!isGenerating && !isCompleted && (
          <>
            <p className="text-[#666] text-sm leading-relaxed mb-8 max-w-md mx-auto">
              Claude will arrange all contributions into beautiful 3×3 grid layouts on
              8.5×11 inch pages, then generate a print-ready PDF.
            </p>

            {error && (
              <div className="mb-6 p-3 border border-red-200 bg-red-50 text-red-700 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={generating}
              className="bg-[#1a1a1a] text-white px-10 py-4 text-sm tracking-[1px] uppercase hover:bg-[#333] transition-colors disabled:opacity-50"
            >
              {generating ? "Starting..." : "Generate Cards"}
            </button>

            <p className="text-xs text-[#999] mt-4">
              This may take 1–3 minutes depending on the number of contributions.
            </p>
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

        {isCompleted && tributeStatus?.pdfUrl && (
          <div className="mt-8 space-y-4">
            <p className="text-[#666] text-sm">
              Your tribute cards have been generated and are ready to download.
            </p>
            <a
              href={tributeStatus.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#1a1a1a] text-white px-10 py-4 text-sm tracking-[1px] uppercase hover:bg-[#333] transition-colors"
            >
              Download PDF
            </a>
            <p className="text-xs text-[#999]">
              Share this PDF with your print shop or we can arrange printing for you.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
