"use client"

import { useState } from "react"

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="flex-shrink-0 text-xs border border-[#e5e7eb] px-3 py-2 text-gray-500 hover:border-[#800020] hover:text-[#800020] transition-colors"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  )
}
