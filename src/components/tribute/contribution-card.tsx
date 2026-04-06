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
      <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-[#e5e7eb]">
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
    <div className="w-10 h-10 rounded-full bg-[#f0e8d8] flex items-center justify-center flex-shrink-0 border border-[#e5e7eb]">
      <span className="text-xs font-medium text-[#800020]">{initials || "?"}</span>
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
  const hasCitation = !!contribution.citationSource
  const isAccordion = !!onToggle

  // Anonymous — always compact dark box
  if (isAnon) {
    return (
      <div
        className={`border border-[#1f2937] bg-[#111827] flex items-center gap-3 p-4 rounded-xl ${isAccordion ? "cursor-pointer" : ""}`}
        onClick={isAccordion ? onToggle : undefined}
      >
        <div className="w-10 h-10 rounded-full bg-[#333] flex items-center justify-center flex-shrink-0">
          <span className="text-gray-500 text-xs">?</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[#555] text-xs tracking-[2px] uppercase">Anonymous</p>
          {isExpanded && contribution.message ? (
            <>
              <blockquote className="text-sm leading-relaxed text-gray-400 font-serif italic mt-2">
                &ldquo;{contribution.message}&rdquo;
              </blockquote>
              {isOwner && (
                <div className="flex items-center gap-3 mt-3 pt-2 border-t border-[#333]">
                  {onEdit && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setEditMode(true) }}
                      className="text-xs text-gray-500 hover:text-[#aaa] transition-colors"
                    >
                      Edit
                    </button>
                  )}
                  {onHide && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onHide(contribution.id) }}
                      className="text-xs text-gray-500 hover:text-yellow-400 transition-colors"
                    >
                      Hide
                    </button>
                  )}
                  {onDelete && !confirmDelete && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setConfirmDelete(true) }}
                      className="text-xs text-gray-500 hover:text-red-400 transition-colors"
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
                        className="text-xs text-gray-500 hover:text-[#aaa] transition-colors"
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
        className="border border-[#e5e7eb] bg-white flex items-center gap-3 p-4 cursor-pointer hover:bg-white transition-colors rounded-xl"
        onClick={onToggle}
      >
        <AvatarCircle src={contribution.avatarUrl} name={name} />
        <div className="flex-1 min-w-0">
          <p className="text-xs tracking-[1px] uppercase text-[#800020]">
            {hasCitation ? `Shared by ${name}` : name}
          </p>
          <p className="text-sm text-gray-500 mt-0.5 truncate">
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
    <div className="border border-[#e5e7eb] bg-white flex flex-col gap-3 fade-in-up overflow-hidden rounded-xl shadow-sm">
      {/* Clickable header (accordion mode) */}
      {isAccordion && (
        <div
          className="flex items-center gap-3 p-4 pb-0 cursor-pointer"
          onClick={onToggle}
        >
          <AvatarCircle src={contribution.avatarUrl} name={name} />
          <p className="text-xs tracking-[1px] uppercase text-[#800020] flex-1">
            {hasCitation ? `Shared by ${name}` : name}
          </p>
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

      <div className="p-5 pt-4 flex flex-col gap-3">
        {!isAccordion && (
          <div className="flex items-center gap-3 pt-1">
            <AvatarCircle src={contribution.avatarUrl} name={name} />
            <p className="text-xs tracking-[1px] uppercase text-[#800020]">
              {hasCitation ? `Shared by ${name}` : name}
            </p>
          </div>
        )}

        {editMode ? (
          <div className="flex flex-col gap-2">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full border border-[#e5e7eb] rounded p-3 text-sm font-serif italic text-[#1f2937] bg-white resize-none focus:outline-none focus:border-[#800020]"
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
                className="text-xs bg-[#111827] text-white px-3 py-1.5 hover:bg-[#333] transition-colors"
              >
                Save
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setEditText(contribution.message ?? "")
                  setEditMode(false)
                }}
                className="text-xs text-gray-400 hover:text-gray-500 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          contribution.message && (
            <div>
              <blockquote className="text-sm leading-relaxed text-[#1f2937] font-serif italic">
                &ldquo;{contribution.message}&rdquo;
              </blockquote>
              {hasCitation && (
                <p className="text-xs text-gray-400 mt-2 font-serif">
                  — {contribution.citationSource}
                </p>
              )}
            </div>
          )
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

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#f0e8d8]">
          <p className="text-xs text-gray-300">
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
                  className="text-xs text-gray-300 hover:text-[#800020] transition-colors"
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
                  className="text-xs text-gray-300 hover:text-yellow-600 transition-colors"
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
                  className="text-xs text-gray-300 hover:text-red-400 transition-colors"
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
                    className="text-xs text-gray-400 hover:text-gray-500 transition-colors"
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
