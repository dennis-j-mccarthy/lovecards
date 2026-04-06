"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

interface DevSignInLinkProps {
  href: string
  className?: string
  children: React.ReactNode
}

export function DevSignInLink({ href, className, children }: DevSignInLinkProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleClick(e: React.MouseEvent) {
    // Option+Click (Mac) / Alt+Click (Windows) = instant dev login
    if (e.altKey) {
      e.preventDefault()
      setLoading(true)
      try {
        const res = await fetch("/api/dev/demo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ scenario: "populated-dashboard" }),
        })
        const data = await res.json()
        if (data.redirectUrl) {
          window.location.href = data.redirectUrl
        }
      } catch {
        // Fall back to normal sign-in
        router.push(href)
      }
      return
    }

    // Normal click = go to sign-in page
    e.preventDefault()
    router.push(href)
  }

  return (
    <a
      href={href}
      onClick={handleClick}
      className={className}
      title="Option+Click to sign in instantly"
    >
      {loading ? "Signing in..." : children}
    </a>
  )
}
