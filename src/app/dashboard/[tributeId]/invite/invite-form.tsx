"use client"

import { useState } from "react"
import { CopyButton } from "@/components/dashboard/copy-button"
import { StepProgression } from "@/components/dashboard/step-progression"

interface Recipient {
  email: string
  name: string
  cellPhone: string
  phone: string
}

interface PendingInvitee {
  id: string
  email: string
  name: string | null
  cellPhone: string | null
  phone: string | null
  sentAt: string
}

interface CompletedInvitee {
  id: string
  email: string
  name: string | null
  cellPhone: string | null
  phone: string | null
  sentAt: string
}

interface InviteFormProps {
  tributeId: string
  shareUrl: string | null
  pendingInvitees?: PendingInvitee[]
  completedInvitees?: CompletedInvitee[]
}

export function InviteForm({ tributeId, shareUrl, pendingInvitees = [], completedInvitees = [] }: InviteFormProps) {
  const [recipients, setRecipients] = useState<Recipient[]>([
    { email: "", name: "", cellPhone: "", phone: "" },
  ])
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<{ sent: number; failed: number } | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Nudge state
  const [nudging, setNudging] = useState<Set<string>>(new Set())
  const [nudged, setNudged] = useState<Set<string>>(new Set())
  const [nudgeAllLoading, setNudgeAllLoading] = useState(false)

  function addRecipient() {
    setRecipients((prev) => [...prev, { email: "", name: "", cellPhone: "", phone: "" }])
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
    const valid = recipients.filter((r) => r.email.trim() && r.cellPhone.trim())
    if (valid.length === 0) {
      setError("Please add at least one recipient with an email and cell phone number")
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
      setRecipients([{ email: "", name: "", cellPhone: "", phone: "" }])
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSending(false)
    }
  }

  async function handleNudge(emailIds: string[]) {
    try {
      const res = await fetch(`/api/tributes/${tributeId}/nudge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailIds }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? "Failed to send nudge")
      }
      return true
    } catch {
      return false
    }
  }

  async function nudgeOne(id: string) {
    setNudging((prev) => new Set(prev).add(id))
    const ok = await handleNudge([id])
    setNudging((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
    if (ok) {
      setNudged((prev) => new Set(prev).add(id))
    }
  }

  async function nudgeAll() {
    const ids = pendingInvitees.filter((p) => !nudged.has(p.id)).map((p) => p.id)
    if (ids.length === 0) return
    setNudgeAllLoading(true)
    const ok = await handleNudge(ids)
    setNudgeAllLoading(false)
    if (ok) {
      setNudged(new Set(ids))
    }
  }

  const unnudgedCount = pendingInvitees.filter((p) => !nudged.has(p.id)).length

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <StepProgression tributeId={tributeId} activeStep={1} />
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">
        <h1 className="text-2xl font-normal text-[#111827] mb-2">
          Invite People to Contribute
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Send personalized email invitations, or share the link directly via text, social, or anywhere else.
        </p>

        {/* Shareable link */}
        {shareUrl && (
          <div className="border border-[#e5e7eb] bg-white p-4 mb-8">
            <p className="text-xs tracking-[2px] uppercase text-[#800020] mb-2">
              Shareable Link
            </p>
            <p className="text-xs text-gray-400 mb-3">
              Anyone with this link can contribute — no account needed.
            </p>
            <div className="flex items-center gap-3">
              <p className="flex-1 text-sm text-gray-500 truncate bg-white border border-[#e8e0d4] px-3 py-2 rounded">
                {shareUrl}
              </p>
              <CopyButton text={shareUrl} />
            </div>
          </div>
        )}

        {/* Pending invitees — nudge section */}
        {pendingInvitees.length > 0 && (
          <div className="border border-[#e5e7eb] bg-white p-4 mb-8">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs tracking-[2px] uppercase text-[#800020] mb-1">
                  Waiting for Response
                </p>
                <p className="text-xs text-gray-400">
                  {pendingInvitees.length} {pendingInvitees.length === 1 ? "person" : "people"} invited but haven&apos;t contributed yet
                </p>
              </div>
              {unnudgedCount > 1 && (
                <button
                  onClick={nudgeAll}
                  disabled={nudgeAllLoading}
                  className="text-xs border border-[#e5e7eb] text-[#800020] px-3 py-1.5 hover:bg-[#fdf2f4] transition-colors disabled:opacity-50"
                >
                  {nudgeAllLoading ? "Sending..." : `Nudge All (${unnudgedCount})`}
                </button>
              )}
            </div>
            <div className="space-y-2">
              {pendingInvitees.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 py-2 border-t border-[#f0ebe3] first:border-t-0"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#111827] truncate">
                      {p.name ? `${p.name} (${p.email})` : p.email}
                    </p>
                    <p className="text-xs text-gray-400">
                      Invited {new Date(p.sentAt).toLocaleDateString()}
                      {p.cellPhone && ` · ${p.cellPhone}`}
                      {p.phone && ` · ${p.phone}`}
                    </p>
                  </div>
                  {nudged.has(p.id) ? (
                    <span className="text-xs text-green-600">Nudge sent</span>
                  ) : (
                    <button
                      onClick={() => nudgeOne(p.id)}
                      disabled={nudging.has(p.id)}
                      className="text-xs border border-[#e5e7eb] text-[#800020] px-3 py-1.5 hover:bg-[#fdf2f4] transition-colors disabled:opacity-50"
                    >
                      {nudging.has(p.id) ? "Sending..." : "Nudge"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completed invitees */}
        {completedInvitees.length > 0 && (
          <div className="border border-[#e5e7eb] bg-white rounded-xl p-4 mb-8">
            <p className="text-xs tracking-[2px] uppercase text-green-600 mb-1">
              Contributed
            </p>
            <p className="text-xs text-gray-400 mb-3">
              {completedInvitees.length} {completedInvitees.length === 1 ? "person has" : "people have"} submitted cards
            </p>
            <div className="space-y-2">
              {completedInvitees.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 py-2 border-t border-[#f0ebe3] first:border-t-0"
                >
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#111827] truncate">
                      {p.name ? `${p.name} (${p.email})` : p.email}
                    </p>
                    <p className="text-xs text-gray-400">
                      Invited {new Date(p.sentAt).toLocaleDateString()}
                      {p.cellPhone && ` · ${p.cellPhone}`}
                    </p>
                  </div>
                  <span className="text-xs text-green-600 font-medium">Done</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-[#e8e0d4] pt-8 mb-8">
          <p className="text-xs tracking-[2px] uppercase text-[#800020] mb-4">
            {pendingInvitees.length > 0 ? "Invite More People" : "Send Email Invitations"}
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

          <div className="space-y-4 mb-6">
            {recipients.map((r, i) => (
              <div key={i} className="flex items-center gap-3">
                <input
                  type="email"
                  placeholder="Email address *"
                  value={r.email}
                  onChange={(e) => updateRecipient(i, "email", e.target.value)}
                  className="flex-1 border border-[#e5e7eb] bg-white px-4 py-3 text-sm outline-none focus:border-[#800020]"
                />
                <input
                  type="text"
                  placeholder="Name (optional)"
                  value={r.name}
                  onChange={(e) => updateRecipient(i, "name", e.target.value)}
                  className="w-32 border border-[#e5e7eb] bg-white px-4 py-3 text-sm outline-none focus:border-[#800020]"
                />
                <input
                  type="tel"
                  placeholder="Cell phone *"
                  value={r.cellPhone}
                  onChange={(e) => updateRecipient(i, "cellPhone", e.target.value)}
                  className="w-36 border border-[#e5e7eb] bg-white px-4 py-3 text-sm outline-none focus:border-[#800020]"
                />
                <input
                  type="tel"
                  placeholder="Phone (optional)"
                  value={r.phone}
                  onChange={(e) => updateRecipient(i, "phone", e.target.value)}
                  className="w-36 border border-[#e5e7eb] bg-white px-4 py-3 text-sm outline-none focus:border-[#800020]"
                />
                {recipients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRecipient(i)}
                    className="text-gray-300 hover:text-red-400 transition-colors text-lg leading-none"
                  >
                    &times;
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addRecipient}
            className="text-sm text-[#800020] hover:underline mb-8 block"
          >
            + Add another person
          </button>

          <button
            onClick={handleSend}
            disabled={sending}
            className="w-full bg-[#111827] text-white py-4 text-sm tracking-[1px] uppercase hover:bg-[#333] transition-colors disabled:opacity-50"
          >
            {sending ? "Sending Invitations..." : "Send Invitations"}
          </button>
        </div>
      </div>
    </div>
  )
}
