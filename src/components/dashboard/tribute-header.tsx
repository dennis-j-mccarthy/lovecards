"use client"

import { useState } from "react"
import { formatDate } from "@/lib/utils"
import { EditTributeModal } from "./edit-tribute-modal"

interface TributeHeaderProps {
  tributeId: string
  honoredName: string
  relationship: string | null
  tributeMessage: string | null
  birthDate: string | null
  passingDate: string | null
  location: string | null
  shipToName: string | null
  shipToAddress: string | null
  shipToCity: string | null
  shipToState: string | null
  shipToZip: string | null
}

export function TributeHeader({
  tributeId,
  honoredName,
  relationship,
  tributeMessage,
  birthDate,
  passingDate,
  location,
  shipToName,
  shipToAddress,
  shipToCity,
  shipToState,
  shipToZip,
}: TributeHeaderProps) {
  const [showEdit, setShowEdit] = useState(false)

  return (
    <>
      <div className="mb-8">
        <p className="text-xs tracking-[2px] uppercase text-[#800020] mb-1">
          {relationship}
        </p>
        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-normal text-[#111827]">{honoredName}</h1>
          <button
            onClick={() => setShowEdit(true)}
            className="text-gray-300 hover:text-[#800020] transition-colors"
            aria-label="Edit Love Card Box"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
        </div>
        {(birthDate || passingDate) && (
          <p className="text-sm text-gray-400 mt-2">
            {birthDate ? formatDate(new Date(birthDate)) : ""}
            {birthDate && passingDate ? " — " : ""}
            {passingDate ? formatDate(new Date(passingDate)) : ""}
          </p>
        )}
      </div>

      {showEdit && (
        <EditTributeModal
          tributeId={tributeId}
          initial={{
            honoredName,
            relationship,
            tributeMessage,
            birthDate: birthDate ? new Date(birthDate).toISOString().split("T")[0] : null,
            location,
            shipToName,
            shipToAddress,
            shipToCity,
            shipToState,
            shipToZip,
          }}
          onClose={() => setShowEdit(false)}
        />
      )}
    </>
  )
}
