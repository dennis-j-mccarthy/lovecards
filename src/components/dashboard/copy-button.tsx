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
      className="flex-shrink-0 text-xs border border-[#d4c5a9] px-3 py-2 text-[#666] hover:border-[#8b7355] hover:text-[#8b7355] transition-colors"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  )
}
