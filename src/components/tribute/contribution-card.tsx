import type { PublicContribution } from "@/types/tribute"
import { formatDate } from "@/lib/utils"
import Image from "next/image"

interface ContributionCardProps {
  contribution: PublicContribution
  isOwner?: boolean
  onHide?: (id: string) => void
}

export function ContributionCard({
  contribution,
  isOwner,
  onHide,
}: ContributionCardProps) {
  const isAnon = contribution.isAnonymous
  const name = isAnon ? "Anonymous" : contribution.contributorName ?? "A friend"

  if (isAnon) {
    return (
      <div className="border border-[#2d2d2d] bg-[#1a1a1a] flex flex-col items-center justify-center min-h-[200px] p-6 text-center">
        <div className="w-8 h-1 bg-[#444] mb-4" />
        <p className="text-[#555] text-xs tracking-[2px] uppercase">Anonymous</p>
        <p className="text-[#444] text-xs mt-2">This contributor chose to remain private</p>
      </div>
    )
  }

  return (
    <div className="border border-[#d4c5a9] bg-white p-5 flex flex-col gap-3 fade-in-up">
      {contribution.photoUrl && (
        <div className="relative w-full h-48 overflow-hidden">
          <Image
            src={contribution.photoUrl}
            alt={`Photo from ${name}`}
            fill
            className="object-cover"
          />
        </div>
      )}

      {contribution.message && (
        <blockquote className="text-sm leading-relaxed text-[#2d2d2d] font-serif italic">
          &ldquo;{contribution.message}&rdquo;
        </blockquote>
      )}

      <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#f0e8d8]">
        <p className="text-xs tracking-[1px] uppercase text-[#8b7355]">— {name}</p>
        <p className="text-xs text-[#bbb]">
          {formatDate(contribution.createdAt)}
        </p>
      </div>

      {isOwner && onHide && (
        <button
          onClick={() => onHide(contribution.id)}
          className="text-xs text-[#ccc] hover:text-red-400 transition-colors self-end"
        >
          Hide
        </button>
      )}
    </div>
  )
}
