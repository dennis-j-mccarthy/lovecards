"use client"

import { useState } from "react"
import Link from "next/link"
import type { PublicContribution } from "@/types/tribute"
import { ContributionForm } from "@/components/tribute/contribution-form"
import { ContributionCard } from "@/components/tribute/contribution-card"

interface ContributionSubmitPageProps {
  tributeId: string
  tributeSlug: string
  honoredName: string
  token: string
  allowAnonymous: boolean
  initialContributions: PublicContribution[]
}

export function ContributionSubmitPage({
  tributeId,
  tributeSlug,
  honoredName,
  token,
  allowAnonymous,
  initialContributions,
}: ContributionSubmitPageProps) {
  const [submitted, setSubmitted] = useState(false)
  const [contributions, setContributions] =
    useState<PublicContribution[]>(initialContributions)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  async function handleSuccess() {
    setSubmitted(true)
    // Refresh contributions
    try {
      const res = await fetch(
        `/api/tributes/${tributeId}/contributions?token=${token}`
      )
      if (res.ok) {
        const data = await res.json()
        setContributions(data)
      }
    } catch {
      // ignore
    }
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <div className="border-b border-[#e5e7eb] px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <Link href="/">
              <img src="/logo.png" alt="Love Cards" className="h-[200px]" />
            </Link>
          </div>
          <p className="text-xs tracking-[4px] uppercase text-[#800020] mb-1">
            Write a Card for
          </p>
          <h1 className="text-3xl font-normal text-[#111827]">{honoredName}</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <div>
            {submitted ? (
              <div className="text-center py-10">
                <p className="text-4xl mb-4">✦</p>
                <h2 className="text-xl font-normal text-[#111827] mb-3">
                  Thank you
                </h2>
                <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                  Your message for {honoredName} has been added.
                  It will be printed as a beautiful card in their keepsake box.
                </p>
                <Link
                  href={`/tribute/${tributeSlug}`}
                  className="text-sm text-[#800020] hover:underline"
                >
                  View all contributions →
                </Link>
              </div>
            ) : (
              <>
                <h2 className="text-lg font-normal text-[#111827] mb-6">
                  Your Contribution
                </h2>
                <ContributionForm
                  tributeId={tributeId}
                  token={token}
                  honoredName={honoredName}
                  allowAnonymous={allowAnonymous}
                  onSuccess={handleSuccess}
                />
              </>
            )}
          </div>

          {/* Gallery preview — scrollable list */}
          <div>
            <h2 className="text-lg font-normal text-[#111827] mb-4">
              What Others Wrote
              <span className="ml-2 text-sm text-gray-400">
                ({contributions.length})
              </span>
            </h2>
            {contributions.length === 0 ? (
              <div className="text-center py-16 border border-[#e5e7eb] border-dashed">
                <p className="text-[#800020] text-xs tracking-[2px] uppercase mb-2">
                  No contributions yet
                </p>
                <p className="text-gray-400 text-sm">
                  Be the first to share your memories
                </p>
              </div>
            ) : (
              <div
                className="overflow-y-auto space-y-2 pr-2"
                style={{ maxHeight: 1300 }}
              >
                {contributions.map((c) => (
                  <ContributionCard
                    key={c.id}
                    contribution={c}
                    isOwner={false}
                    isExpanded={expandedId === c.id}
                    onToggle={() => setExpandedId((prev) => prev === c.id ? null : c.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
