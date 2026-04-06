"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export function CreateTestTributeButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)
    try {
      const res = await fetch("/api/dev/create-tribute", { method: "POST" })
      const data = await res.json()
      if (data.tributeId) {
        router.push(`/dashboard/${data.tributeId}`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="inline-block border border-dashed border-[#800020] text-[#800020] px-6 py-2 text-xs tracking-[1px] uppercase hover:bg-[#fdf2f4] transition-colors disabled:opacity-50"
    >
      {loading ? "Creating..." : "⚡ Create Test Love Card Box (Dev Only)"}
    </button>
  )
}
