"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"

interface Recipient {
  email: string
  name: string
}

export default function InvitePage() {
  const params = useParams()
  const tributeId = params.tributeId as string

  const [recipients, setRecipients] = useState<Recipient[]>([
    { email: "", name: "" },
  ])
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<{ sent: number; failed: number } | null>(null)
  const [error, setError] = useState<string | null>(null)

  function addRecipient() {
    setRecipients((prev) => [...prev, { email: "", name: "" }])
  }

  function removeRecipient(i: number) {
    setRecipients((prev) => prev.filter((_, idx) => idx !== i))
  }

  function updateRecipient(i: number, field: keyof Recipient, value: string) {
    setRecipients((prev) =>
      prev.map((r, idx) => (idx === i ? { ...r, [field]: value } : r))
    )
  }

  async function handleSend() {
    const valid = recipients.filter((r) => r.email.trim())
    if (valid.length === 0) {
      setError("Please add at least one email address")
      return
    }

    setSending(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch(`/api/tributes/${tributeId}/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipients: valid }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Failed to send invites")
      setResult(data)
      setRecipients([{ email: "", name: "" }])
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <nav className="border-b border-[#d4c5a9] px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <Link
            href={`/dashboard/${tributeId}`}
            className="text-xs tracking-[2px] uppercase text-[#8b7355]"
          >
            ← Back
          </Link>
          <span className="text-xs text-[#ccc]">|</span>
          <span className="text-xs tracking-[2px] uppercase text-[#666]">
            Invite Contributors
          </span>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-normal text-[#1a1a1a] mb-2">
          Invite People to Contribute
        </h1>
        <p className="text-sm text-[#666] mb-8">
          Each person receives a unique link to share their memory. You can also
          share the general link from your dashboard.
        </p>

        {result && (
          <div className="mb-6 p-4 border border-green-200 bg-green-50 text-green-700 text-sm">
            {result.sent} invitation{result.sent !== 1 ? "s" : ""} sent successfully.
            {result.failed > 0 && ` ${result.failed} failed.`}
          </div>
        )}

        {error && (
          <div className="mb-6 p-3 border border-red-200 bg-red-50 text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-3 mb-6">
          {recipients.map((r, i) => (
            <div key={i} className="flex items-center gap-3">
              <input
                type="email"
                placeholder="Email address *"
                value={r.email}
                onChange={(e) => updateRecipient(i, "email", e.target.value)}
                className="flex-1 border border-[#d4c5a9] bg-white px-4 py-3 text-sm outline-none focus:border-[#8b7355]"
              />
              <input
                type="text"
                placeholder="Name (optional)"
                value={r.name}
                onChange={(e) => updateRecipient(i, "name", e.target.value)}
                className="w-40 border border-[#d4c5a9] bg-white px-4 py-3 text-sm outline-none focus:border-[#8b7355]"
              />
              {recipients.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeRecipient(i)}
                  className="text-[#ccc] hover:text-red-400 transition-colors text-lg leading-none"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addRecipient}
          className="text-sm text-[#8b7355] hover:underline mb-8 block"
        >
          + Add another person
        </button>

        <button
          onClick={handleSend}
          disabled={sending}
          className="w-full bg-[#1a1a1a] text-white py-4 text-sm tracking-[1px] uppercase hover:bg-[#333] transition-colors disabled:opacity-50"
        >
          {sending ? "Sending Invitations..." : "Send Invitations"}
        </button>
      </div>
    </div>
  )
}
