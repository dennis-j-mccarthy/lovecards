"use client"

import { useState, useEffect } from "react"
import type { PublicContribution } from "@/types/tribute"

interface FeedItem {
  id: string
  contribution: PublicContribution
  key: number
}

interface LiveFeedTickerProps {
  newArrivals: PublicContribution[]
  onDismiss: (id: string) => void
}

export function LiveFeedTicker({ newArrivals, onDismiss }: LiveFeedTickerProps) {
  const [visible, setVisible] = useState<FeedItem[]>([])
  useEffect(() => {
    if (newArrivals.length === 0) return

    newArrivals.forEach((arrival, i) => {
      setTimeout(() => {
        setVisible((prev) => {
          if (prev.some((item) => item.id === arrival.id)) return prev
          const item: FeedItem = {
            id: arrival.id,
            contribution: arrival,
            key: Date.now() + i,
          }
          // Max 4 visible at once
          const next = [...prev, item].slice(-4)
          return next
        })

        // Auto-remove after 6 seconds
        setTimeout(() => {
          setVisible((prev) => prev.filter((item) => item.id !== arrival.id))
          onDismiss(arrival.id)
        }, 6000)
      }, i * 1200) // Stagger by 1.2s
    })
  }, [newArrivals, onDismiss])

  if (visible.length === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm">
      {visible.map((item) => (
        <FeedItemBubble key={item.key} item={item} />
      ))}
    </div>
  )
}

function FeedItemBubble({ item }: { item: FeedItem }) {
  const { contribution } = item
  const name = contribution.isAnonymous
    ? "Someone"
    : contribution.contributorName ?? "A friend"

  const typeLabel =
    contribution.type === "PHOTO"
      ? "shared a photo"
      : contribution.type === "TEXT_AND_PHOTO"
      ? "shared a message & photo"
      : "shared a memory"

  const emoji = contribution.isAnonymous ? "🖤" : "💌"

  return (
    <div className="feed-item-animate bg-white border border-[#e5e7eb] shadow-md px-4 py-3 flex items-center gap-3">
      <span className="text-lg flex-shrink-0">{emoji}</span>
      <p className="text-sm text-[#1f2937]">
        <span className="font-medium">{name}</span>{" "}
        <span className="text-gray-500">{typeLabel}</span>
      </p>
    </div>
  )
}
