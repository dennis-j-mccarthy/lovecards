"use client"

import { useState, useCallback } from "react"
import type { PublicContribution } from "@/types/tribute"
import { ContributionCard } from "./contribution-card"

interface ContributionGalleryProps {
  initialContributions: PublicContribution[]
  tributeId: string
  isOwner?: boolean
}

export function ContributionGallery({
  initialContributions,
  tributeId: _tributeId,
  isOwner,
}: ContributionGalleryProps) {
  const [contributions, setContributions] =
    useState<PublicContribution[]>(initialContributions)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"list" | "cards">("cards")
  const [filterName, setFilterName] = useState<string | null>(null)

  // Get unique contributor names for filter pills
  const contributorNames = Array.from(
    new Set(
      contributions
        .map((c) => c.isAnonymous ? "Anonymous" : c.contributorName)
        .filter(Boolean) as string[]
    )
  )

  const filtered = filterName
    ? contributions.filter((c) => {
        const name = c.isAnonymous ? "Anonymous" : c.contributorName
        return name === filterName
      })
    : contributions

  const handleHide = useCallback(
    async (id: string) => {
      try {
        await fetch(`/api/contributions/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isHidden: true }),
        })
        setContributions((prev) => prev.filter((c) => c.id !== id))
      } catch {
        // ignore
      }
    },
    []
  )

  const handleEdit = useCallback(
    async (id: string, message: string) => {
      try {
        const res = await fetch(`/api/contributions/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message }),
        })
        if (res.ok) {
          setContributions((prev) =>
            prev.map((c) => (c.id === id ? { ...c, message } : c))
          )
        }
      } catch {
        // ignore
      }
    },
    []
  )

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        const res = await fetch(`/api/contributions/${id}`, {
          method: "DELETE",
        })
        if (res.ok) {
          setContributions((prev) => prev.filter((c) => c.id !== id))
        }
      } catch {
        // ignore
      }
    },
    []
  )

  const handleToggle = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }, [])

  if (contributions.length === 0) {
    return (
      <div className="text-center py-16 border border-[#e5e7eb] border-dashed rounded-xl">
        <p className="text-[#800020] text-xs tracking-[2px] uppercase mb-2">
          No contributions yet
        </p>
        <p className="text-gray-400 text-sm">
          Share the invitation link to start collecting memories
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Contributor filter pills */}
      {contributorNames.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setFilterName(null)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
              filterName === null
                ? "bg-[#800020] text-white border-[#800020]"
                : "bg-white text-gray-500 border-[#e5e7eb] hover:border-[#800020] hover:text-[#800020]"
            }`}
          >
            All ({contributions.length})
          </button>
          {contributorNames.map((name) => {
            const count = contributions.filter((c) =>
              (c.isAnonymous ? "Anonymous" : c.contributorName) === name
            ).length
            return (
              <button
                key={name}
                onClick={() => setFilterName(filterName === name ? null : name)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                  filterName === name
                    ? "bg-[#800020] text-white border-[#800020]"
                    : "bg-white text-gray-500 border-[#e5e7eb] hover:border-[#800020] hover:text-[#800020]"
                }`}
              >
                {name} ({count})
              </button>
            )
          })}
        </div>
      )}

      {/* View toggle */}
      <div className="flex justify-end mb-4">
        <div className="inline-flex border border-[#e5e7eb] rounded-lg overflow-hidden">
          <button
            onClick={() => setViewMode("cards")}
            className={`px-3 py-1.5 text-xs font-medium transition-colors ${
              viewMode === "cards"
                ? "bg-[#800020] text-white"
                : "bg-white text-gray-500 hover:text-gray-700"
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="inline-block mr-1">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            Cards
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`px-3 py-1.5 text-xs font-medium transition-colors ${
              viewMode === "list"
                ? "bg-[#800020] text-white"
                : "bg-white text-gray-500 hover:text-gray-700"
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="inline-block mr-1">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
            List
          </button>
        </div>
      </div>

      {viewMode === "cards" ? (
        /* Card grid view — all expanded */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((contribution) => (
            <ContributionCard
              key={contribution.id}
              contribution={contribution}
              isOwner={isOwner}
              onHide={isOwner ? handleHide : undefined}
              onEdit={isOwner ? handleEdit : undefined}
              onDelete={isOwner ? handleDelete : undefined}
              isExpanded={true}
            />
          ))}
        </div>
      ) : (
        /* List view — accordion */
        <div className="space-y-2">
          {filtered.map((contribution) => (
            <ContributionCard
              key={contribution.id}
              contribution={contribution}
              isOwner={isOwner}
              onHide={isOwner ? handleHide : undefined}
              onEdit={isOwner ? handleEdit : undefined}
              onDelete={isOwner ? handleDelete : undefined}
              isExpanded={expandedId === contribution.id}
              onToggle={() => handleToggle(contribution.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
