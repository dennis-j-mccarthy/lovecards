"use client"

import { useState } from "react"
import { useLiveContributions } from "@/hooks/use-live-contributions"
import type { PublicContribution } from "@/types/tribute"
import { ContributionGallery } from "@/components/tribute/contribution-gallery"
import { LiveFeedTicker } from "./live-feed-ticker"

interface DashboardLiveFeedProps {
  tributeId: string
  initialContributions: PublicContribution[]
}

export function DashboardLiveFeed({
  tributeId,
  initialContributions,
}: DashboardLiveFeedProps) {
  const [allContributions] = useState<PublicContribution[]>(
    initialContributions
  )

  const { newArrivals, dismissArrival, connected } = useLiveContributions(tributeId)

  // Merge new arrivals into all contributions
  const merged = [
    ...allContributions,
    ...newArrivals.filter(
      (n) => !allContributions.some((c) => c.id === n.id)
    ),
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-normal text-[#111827]">
          Contributions
          <span className="ml-2 text-sm text-gray-400">({merged.length})</span>
        </h2>
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              connected ? "bg-green-400" : "bg-[#ccc]"
            }`}
          />
          <span className="text-xs text-gray-400">
            {connected ? "Live" : "Connecting..."}
          </span>
        </div>
      </div>

      <ContributionGallery
        initialContributions={merged}
        tributeId={tributeId}
        isOwner={true}
      />

      <LiveFeedTicker newArrivals={newArrivals} onDismiss={dismissArrival} />
    </div>
  )
}
