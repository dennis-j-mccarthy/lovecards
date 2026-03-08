/* eslint-disable @next/next/no-img-element */
"use client"

import { useState } from "react"
import type { PublicContribution } from "@/types/tribute"
import { formatDate } from "@/lib/utils"

interface ContributionCardProps {
  contribution: PublicContribution
  isOwner?: boolean
  onHide?: (id: string) => void
  onEdit?: (id: string, message: string) => void
  onDelete?: (id: string) => void
  isExpanded?: boolean
  onToggle?: () => void
}

function AvatarCircle({ src, name }: { src?: string | null; name: string }) {
  if (src) {
    return (
      <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-[#d4c5a9]">
        <img src={src} alt={name} className="w-full h-full object-cover" />
      </div>
    )
  }
  // Initials fallback
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
  return (
    <div className="w-10 h-10 rounded-full bg-[#f0e8d8] flex items-center justify-center flex-shrink-0 border border-[#d4c5a9]">
      <span className="text-xs font-medium text-[#8b7355]">{initials || "?"}</span>
    </div>
  )
}

export function ContributionCard({
  contribution,
  isOwner,
  onHide,
  onEdit,
  onDelete,
  isExpanded = false,
  onToggle,
}: ContributionCardProps) {
  const [editMode, setEditMode] = useState(false)
  const [editText, setEditText] = useState(contribution.message ?? "")
  const [confirmDelete, setConfirmDelete] = useState(false)

  const isAnon = contribution.isAnonymous
  const name = isAnon ? "Anonymous" : contribution.contributorName ?? "A friend"
  const isAccordion = !!onToggle

  // Anonymous — always compact dark box
  if (isAnon) {
    return (
      <div
        className={`border border-[#2d2d2d] bg-[#1a1a1a] flex items-center gap-3 p-4 ${isAccordion ? "cursor-pointer" : ""}`}
        onClick={isAccordion ? onToggle : undefined}
      >
        <div className="w-10 h-10 rounded-full bg-[#333] flex items-center justify-center flex-shrink-0">
          <span className="text-[#666] text-xs">?</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[#555] text-xs tracking-[2px] uppercase">Anonymous</p>
          {isExpanded && contribution.message ? (
            <>
              <blockquote className="text-sm leading-relaxed text-[#888] font-serif italic mt-2">
                &ldquo;{contribution.message}&rdquo;
              </blockquote>
              {isOwner && (
                <div className="flex items-center gap-3 mt-3 pt-2 border-t border-[#333]">
                  {onEdit && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setEditMode(true) }}
                      className="text-xs text-[#666] hover:text-[#aaa] transition-colors"
                    >
                      Edit
                    </button>
                  )}
                  {onHide && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onHide(contribution.id) }}
                      className="text-xs text-[#666] hover:text-yellow-400 transition-colors"
                    >
                      Hide
                    </button>
                  )}
                  {onDelete && !confirmDelete && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setConfirmDelete(true) }}
                      className="text-xs text-[#666] hover:text-red-400 transition-colors"
                    >
                      Delete
                    </button>
                  )}
                  {confirmDelete && (
                    <>
                      <span className="text-xs text-red-400">Sure?</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); onDelete!(contribution.id) }}
                        className="text-xs text-red-400 font-medium hover:text-red-300 transition-colors"
                      >
                        Yes
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setConfirmDelete(false) }}
                        className="text-xs text-[#666] hover:text-[#aaa] transition-colors"
                      >
                        No
                      </button>
                    </>
                  )}
                </div>
              )}
            </>
          ) : (
            <p className="text-[#444] text-xs mt-1 truncate">
              {contribution.message ? `"${contribution.message.slice(0, 80)}..."` : "Private contribution"}
            </p>
          )}
        </div>
        {isAccordion && (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#555"
            strokeWidth="2"
            className={`flex-shrink-0 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        )}
      </div>
    )
  }

  // Collapsed view
  if (isAccordion && !isExpanded) {
    return (
      <div
        className="border border-[#d4c5a9] bg-white flex items-center gap-3 p-4 cursor-pointer hover:bg-[#faf9f7] transition-colors"
        onClick={onToggle}
      >
        <AvatarCircle src={contribution.avatarUrl} name={name} />
        <div className="flex-1 min-w-0">
          <p className="text-xs tracking-[1px] uppercase text-[#8b7355]">{name}</p>
          <p className="text-sm text-[#666] mt-0.5 truncate">
            {contribution.message
              ? `"${contribution.message.slice(0, 80)}${contribution.message.length > 80 ? "..." : ""}"`
              : contribution.photoUrl
                ? "Shared a photo"
                : ""}
          </p>
        </div>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#bbb"
          strokeWidth="2"
          className="flex-shrink-0"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    )
  }

  // Expanded view (or non-accordion full view)
  return (
    <div className="border border-[#d4c5a9] bg-white flex flex-col gap-3 fade-in-up overflow-hidden">
      {/* Clickable header (accordion mode) */}
      {isAccordion && (
        <div
          className="flex items-center gap-3 p-4 pb-0 cursor-pointer"
          onClick={onToggle}
        >
          <AvatarCircle src={contribution.avatarUrl} name={name} />
          <p className="text-xs tracking-[1px] uppercase text-[#8b7355] flex-1">{name}</p>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#bbb"
            strokeWidth="2"
            className="flex-shrink-0 rotate-180 transition-transform duration-200"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      )}

      <div className="p-5 pt-0 flex flex-col gap-3">
        {!isAccordion && (
          <div className="flex items-center gap-3 pt-1">
            <AvatarCircle src={contribution.avatarUrl} name={name} />
            <p className="text-xs tracking-[1px] uppercase text-[#8b7355]">{name}</p>
          </div>
        )}

        {contribution.photoUrl && (
          <div className="w-full h-48 overflow-hidden -mx-5 px-5">
            <img
              src={contribution.photoUrl}
              alt={`Photo from ${name}`}
              className="w-full h-full object-cover rounded"
            />
          </div>
        )}

        {editMode ? (
          <div className="flex flex-col gap-2">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full border border-[#d4c5a9] rounded p-3 text-sm font-serif italic text-[#2d2d2d] bg-[#faf9f7] resize-none focus:outline-none focus:border-[#8b7355]"
              rows={4}
              maxLength={1000}
              onClick={(e) => e.stopPropagation()}
            />
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  if (onEdit && editText.trim()) {
                    onEdit(contribution.id, editText.trim())
                  }
                  setEditMode(false)
                }}
                className="text-xs bg-[#1a1a1a] text-white px-3 py-1.5 hover:bg-[#333] transition-colors"
              >
                Save
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setEditText(contribution.message ?? "")
                  setEditMode(false)
                }}
                className="text-xs text-[#999] hover:text-[#666] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          contribution.message && (
            <blockquote className="text-sm leading-relaxed text-[#2d2d2d] font-serif italic">
              &ldquo;{contribution.message}&rdquo;
            </blockquote>
          )
        )}

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#f0e8d8]">
          <p className="text-xs text-[#bbb]">
            {formatDate(contribution.createdAt)}
          </p>
          {isOwner && (
            <div className="flex items-center gap-3">
              {onEdit && !editMode && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setEditText(contribution.message ?? "")
                    setEditMode(true)
                  }}
                  className="text-xs text-[#bbb] hover:text-[#8b7355] transition-colors"
                >
                  Edit
                </button>
              )}
              {onHide && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onHide(contribution.id)
                  }}
                  className="text-xs text-[#bbb] hover:text-yellow-600 transition-colors"
                >
                  Hide
                </button>
              )}
              {onDelete && !confirmDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setConfirmDelete(true)
                  }}
                  className="text-xs text-[#bbb] hover:text-red-400 transition-colors"
                >
                  Delete
                </button>
              )}
              {confirmDelete && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-red-400">Are you sure?</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete!(contribution.id)
                    }}
                    className="text-xs text-red-500 font-medium hover:text-red-400 transition-colors"
                  >
                    Yes, delete
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setConfirmDelete(false)
                    }}
                    className="text-xs text-[#999] hover:text-[#666] transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
