"use client"

/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { StepProgression } from "@/components/dashboard/step-progression"

interface Contribution {
  id: string
  contributorName: string | null
  message: string | null
  citationSource: string | null
  photoUrl: string | null
  isAnonymous: boolean
}

interface TributeData {
  status: string
  pdfUrl: string | null
  honoredName: string
  contributions: Contribution[]
}

function PrintCard({ contribution }: { contribution: Contribution }) {
  const name = contribution.isAnonymous
    ? "Anonymous"
    : contribution.contributorName ?? "A friend"
  const hasCitation = !!contribution.citationSource

  return (
    <div className="bg-white border border-[#e5e7eb] rounded-lg p-4 flex flex-col h-full relative overflow-hidden">
      {/* Decorative corner lines */}
      <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#fce7eb] rounded-tl-sm" />
      <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#fce7eb] rounded-tr-sm" />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#fce7eb] rounded-bl-sm" />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#fce7eb] rounded-br-sm" />

      {/* Decorative top line */}
      <div className="w-8 h-0.5 bg-[#800020] opacity-30 mx-auto mb-3" />

      {/* Message */}
      <div className="flex-1 flex flex-col justify-center px-1">
        {contribution.message && (
          <p className="text-xs leading-relaxed text-[#1f2937] font-serif italic text-center">
            &ldquo;{contribution.message.length > 180
              ? contribution.message.slice(0, 180) + "..."
              : contribution.message}&rdquo;
          </p>
        )}
        {hasCitation && (
          <p className="text-[10px] text-gray-400 text-center mt-1.5 font-serif">
            — {contribution.citationSource}
          </p>
        )}
        {contribution.photoUrl && (
          <div className="w-full h-16 mt-2 overflow-hidden rounded">
            <img
              src={contribution.photoUrl}
              alt="Photo"
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      {/* Decorative bottom line */}
      <div className="w-8 h-0.5 bg-[#800020] opacity-30 mx-auto mt-3 mb-2" />

      {/* Attribution */}
      <p className="text-[10px] text-center text-gray-400 tracking-wide">
        {hasCitation ? `Shared by ${name}` : `— ${name}`}
      </p>
    </div>
  )
}

function EmptyCard() {
  return (
    <div className="bg-gray-50 border border-dashed border-[#e5e7eb] rounded-lg p-4 flex items-center justify-center h-full">
      <p className="text-[10px] text-gray-300 italic">Empty</p>
    </div>
  )
}

export default function GeneratePage() {
  const params = useParams()
  const tributeId = params.tributeId as string

  const [tributeData, setTributeData] = useState<TributeData | null>(null)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [agreedToDisclaimer, setAgreedToDisclaimer] = useState(false)

  const CARDS_PER_PAGE = 9

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/tributes/${tributeId}`)
        const data = await res.json()
        setTributeData({
          status: data.status,
          pdfUrl: data.pdfUrl,
          honoredName: data.honoredName,
          contributions: data.contributions ?? [],
        })
      } catch {
        // ignore
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 5000)
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

      setTributeData((prev) => prev ? { ...prev, status: "GENERATING" } : prev)
    } catch (err) {
      setError((err as Error).message)
      setGenerating(false)
    }
  }

  if (!tributeData) {
    return (
      <div className="min-h-screen bg-[#fafafa]">
        <StepProgression tributeId={tributeId} activeStep={3} />
        <div className="text-center py-20">
          <p className="text-sm text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  const { contributions, status } = tributeData
  const isGenerating = status === "GENERATING"
  const isCompleted = status === "COMPLETED"

  const totalPages = Math.max(1, Math.ceil(contributions.length / CARDS_PER_PAGE))
  const pageContributions = contributions.slice(
    currentPage * CARDS_PER_PAGE,
    (currentPage + 1) * CARDS_PER_PAGE
  )

  // Pad to 9 for grid
  const gridCards = [...pageContributions]
  while (gridCards.length < CARDS_PER_PAGE) {
    gridCards.push(null as unknown as Contribution)
  }

  const GENERATION_STEPS = [
    { label: "Reviewing contributions", done: isGenerating || isCompleted },
    { label: "Laying out your cards", done: isGenerating || isCompleted },
    { label: "Sending to printer", done: isCompleted },
    { label: "Order submitted!", done: isCompleted },
  ]

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <StepProgression tributeId={tributeId} activeStep={3} />

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">
        {!isGenerating && !isCompleted && (
          <>
            <div className="text-center mb-10">
              <img
                src="/hero-center.png"
                alt="Love Cards keepsake box"
                className="w-48 h-48 object-cover rounded-2xl mx-auto mb-6 shadow-lg"
              />
              <p className="text-xs tracking-[3px] uppercase text-[#800020] mb-3">
                Preview Your Cards
              </p>
              <h1 className="text-3xl font-normal text-[#111827] mb-2">
                {contributions.length} cards for {tributeData.honoredName}
              </h1>
              <p className="text-gray-500 text-sm">
                Review how your cards will look when printed. Each page holds 9 cards.
              </p>
            </div>

            {/* Page navigation */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mb-6">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                  disabled={currentPage === 0}
                  className="px-3 py-1.5 text-xs font-medium border border-[#e5e7eb] rounded-lg bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  &larr; Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                      currentPage === i
                        ? "bg-[#800020] text-white"
                        : "bg-white border border-[#e5e7eb] text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={currentPage === totalPages - 1}
                  className="px-3 py-1.5 text-xs font-medium border border-[#e5e7eb] rounded-lg bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Next &rarr;
                </button>
              </div>
            )}

            {/* 3x3 card grid — print preview */}
            <div className="max-w-4xl mx-auto bg-white border border-[#e5e7eb] rounded-xl shadow-sm p-6 mb-8">
              <div className="text-xs text-gray-400 text-center mb-4">
                Page {currentPage + 1} of {totalPages}
              </div>
              <div className="grid grid-cols-3 gap-3" style={{ aspectRatio: "8.5/11" }}>
                {gridCards.map((contribution, i) =>
                  contribution ? (
                    <PrintCard key={contribution.id} contribution={contribution} />
                  ) : (
                    <EmptyCard key={`empty-${i}`} />
                  )
                )}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="max-w-2xl mx-auto">
              <div className="border border-[#e5e7eb] bg-white rounded-xl p-5 mb-6">
                <p className="text-xs tracking-[2px] uppercase text-[#800020] mb-2">
                  Please Note
                </p>
                <p className="text-xs text-gray-500 leading-relaxed mb-4">
                  As the purchaser, you are entirely responsible for reviewing all
                  contributions for accuracy, including spelling, grammar, and content.
                  Under no circumstances will we be able to reprint cards once an order
                  has been submitted. Please review carefully before proceeding.
                </p>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedToDisclaimer}
                    onChange={(e) => setAgreedToDisclaimer(e.target.checked)}
                    className="w-4 h-4 mt-0.5 accent-[#800020]"
                  />
                  <span className="text-sm text-[#1f2937]">
                    I have reviewed all cards and accept responsibility for their content.
                  </span>
                </label>
              </div>

              {error && (
                <div className="mb-6 p-3 border border-red-200 bg-red-50 text-red-700 text-sm rounded-xl">
                  {error}
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={generating || !agreedToDisclaimer}
                className="w-full bg-[#111827] text-white py-4 text-sm tracking-[1px] uppercase rounded-lg hover:bg-[#333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generating ? "Submitting..." : "Send to Printer"}
              </button>

              <p className="text-xs text-gray-400 text-center mt-4">
                This may take 1–3 minutes depending on the number of contributions.
              </p>

              <div className="mt-6 text-center">
                <Link
                  href={`/dashboard/${tributeId}`}
                  className="text-sm text-[#800020] hover:text-[#111827] transition-colors"
                >
                  &larr; Go back and review contributions
                </Link>
              </div>
            </div>
          </>
        )}

        {isGenerating && (
          <div className="max-w-md mx-auto text-center py-20">
            <p className="text-xs tracking-[3px] uppercase text-[#800020] mb-4">
              Processing Your Order
            </p>
            <h1 className="text-3xl font-normal text-[#111827] mb-10">
              Sending to Printer
            </h1>
            <div className="flex flex-col items-center gap-4">
              {GENERATION_STEPS.map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      step.done
                        ? "border-[#800020] bg-[#800020]"
                        : "border-[#e5e7eb]"
                    }`}
                  >
                    {step.done && <span className="text-white text-xs">✓</span>}
                  </div>
                  <p className={`text-sm ${step.done ? "text-[#111827]" : "text-gray-300"}`}>
                    {step.label}
                  </p>
                  {i === 2 && !isCompleted && (
                    <span className="text-xs text-[#800020] animate-pulse">
                      Processing...
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {isCompleted && (
          <div className="max-w-lg mx-auto text-center py-20">
            <p className="text-4xl mb-4">✦</p>
            <h2 className="text-2xl font-normal text-[#111827] mb-2">
              Thank You So Much for Your Order
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-8">
              We look forward to helping you share this keepsake with your loved one.
            </p>

            <div className="border border-[#e5e7eb] bg-white rounded-xl p-6 space-y-5 mb-8 text-left">
              <div>
                <p className="text-xs tracking-[2px] uppercase text-[#800020] mb-2">
                  What Happens Next
                </p>
                <ul className="space-y-3 text-sm text-[#1f2937]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#800020] mt-0.5">✦</span>
                    <span>
                      Each contribution is professionally printed on premium card stock,
                      individually cut and finished with care.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#800020] mt-0.5">✦</span>
                    <span>
                      Your cards are placed in a beautiful branded keepsake box,
                      ready to be opened and treasured.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#800020] mt-0.5">✦</span>
                    <span>
                      Standard shipping is included — expect delivery within
                      <strong> 4 business days</strong>.
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {tributeData.pdfUrl && (
              <div className="mb-6">
                <a
                  href={tributeData.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block border border-[#e5e7eb] text-[#800020] px-8 py-3 text-sm tracking-[1px] uppercase rounded-lg hover:bg-[#fdf2f4] transition-colors"
                >
                  Download PDF Preview
                </a>
              </div>
            )}

            <Link
              href={`/dashboard/${tributeId}`}
              className="inline-block bg-[#111827] text-white px-10 py-4 text-sm tracking-[1px] uppercase rounded-lg hover:bg-[#333] transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
