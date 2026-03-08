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
      <div className="text-center py-16 border border-[#d4c5a9] border-dashed">
        <p className="text-[#8b7355] text-xs tracking-[2px] uppercase mb-2">
          No contributions yet
        </p>
        <p className="text-[#999] text-sm">
          Share the invitation link to start collecting memories
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {contributions.map((contribution) => (
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
  )
}
