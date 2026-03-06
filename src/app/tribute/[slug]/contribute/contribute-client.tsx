"use client"

import { useState } from "react"
import Link from "next/link"
import type { PublicContribution } from "@/types/tribute"
import { ContributionForm } from "@/components/tribute/contribution-form"
import { ContributionGallery } from "@/components/tribute/contribution-gallery"

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
    <div className="min-h-screen bg-[#faf9f7]">
      {/* Header */}
      <div className="border-b border-[#d4c5a9] px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs tracking-[4px] uppercase text-[#8b7355] mb-1">
            Share a Memory
          </p>
          <h1 className="text-3xl font-normal text-[#1a1a1a]">{honoredName}</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <div>
            {submitted ? (
              <div className="text-center py-10">
                <p className="text-4xl mb-4">✦</p>
                <h2 className="text-xl font-normal text-[#1a1a1a] mb-3">
                  Thank you
                </h2>
                <p className="text-sm text-[#666] mb-6 leading-relaxed">
                  Your memory of {honoredName} has been added to the tribute.
                  It will be included in the printed card collection.
                </p>
                <Link
                  href={`/tribute/${tributeSlug}`}
                  className="text-sm text-[#8b7355] hover:underline"
                >
                  View all contributions →
                </Link>
              </div>
            ) : (
              <>
                <h2 className="text-lg font-normal text-[#1a1a1a] mb-6">
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

          {/* Gallery preview */}
          <div>
            <h2 className="text-lg font-normal text-[#1a1a1a] mb-6">
              Memories from Others
              <span className="ml-2 text-sm text-[#999]">
                ({contributions.length})
              </span>
            </h2>
            <ContributionGallery
              initialContributions={contributions}
              tributeId={tributeId}
              isOwner={false}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
