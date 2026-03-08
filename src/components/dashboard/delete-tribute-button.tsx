"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface DeleteTributeButtonProps {
  tributeId: string
}

export function DeleteTributeButton({ tributeId }: DeleteTributeButtonProps) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    try {
      const res = await fetch(`/api/tributes/${tributeId}`, {
        method: "DELETE",
      })
      if (res.ok) {
        router.push("/dashboard")
      }
    } catch {
      // ignore
    } finally {
      setDeleting(false)
    }
  }

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="text-sm text-[#ccc] hover:text-red-400 transition-colors"
      >
        Delete this tribute
      </button>
    )
  }

  return (
    <div className="flex items-center gap-3 border border-red-200 bg-red-50 px-4 py-3">
      <p className="text-sm text-red-600 flex-1">
        This will permanently delete the tribute and all contributions. This cannot be undone.
      </p>
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="text-sm bg-red-500 text-white px-4 py-1.5 hover:bg-red-600 transition-colors disabled:opacity-40 flex-shrink-0"
      >
        {deleting ? "Deleting..." : "Delete Forever"}
      </button>
      <button
        onClick={() => setConfirming(false)}
        className="text-sm text-[#999] hover:text-[#666] transition-colors flex-shrink-0"
      >
        Cancel
      </button>
    </div>
  )
}
