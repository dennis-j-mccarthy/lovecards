"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface EditTributeModalProps {
  tributeId: string
  initial: {
    honoredName: string
    relationship: string | null
    tributeMessage: string | null
    birthDate: string | null
    location: string | null
    shipToName: string | null
    shipToAddress: string | null
    shipToCity: string | null
    shipToState: string | null
    shipToZip: string | null
  }
  onClose: () => void
}

export function EditTributeModal({ tributeId, initial, onClose }: EditTributeModalProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    honoredName: initial.honoredName,
    relationship: initial.relationship ?? "",
    tributeMessage: initial.tributeMessage ?? "",
    birthDate: initial.birthDate ?? "",
    location: initial.location ?? "",
    shipToName: initial.shipToName ?? "",
    shipToAddress: initial.shipToAddress ?? "",
    shipToCity: initial.shipToCity ?? "",
    shipToState: initial.shipToState ?? "",
    shipToZip: initial.shipToZip ?? "",
  })

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch(`/api/tributes/${tributeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          honoredName: form.honoredName,
          relationship: form.relationship || null,
          tributeMessage: form.tributeMessage || null,
          birthDate: form.birthDate || null,
          location: form.location || null,
          shipToName: form.shipToName || null,
          shipToAddress: form.shipToAddress || null,
          shipToCity: form.shipToCity || null,
          shipToState: form.shipToState || null,
          shipToZip: form.shipToZip || null,
        }),
      })
      if (res.ok) {
        router.refresh()
        onClose()
      }
    } catch {
      // ignore
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={onClose}>
      <div
        className="bg-white border border-[#e5e7eb] w-full max-w-md mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-normal text-[#111827] mb-5">Edit Love Card Box</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs tracking-[1px] uppercase text-[#800020] mb-1">
              Honored Name
            </label>
            <input
              type="text"
              value={form.honoredName}
              onChange={(e) => setForm({ ...form, honoredName: e.target.value })}
              className="w-full border border-[#e5e7eb] px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#800020]"
            />
          </div>

          <div>
            <label className="block text-xs tracking-[1px] uppercase text-[#800020] mb-1">
              Relationship
            </label>
            <input
              type="text"
              value={form.relationship}
              onChange={(e) => setForm({ ...form, relationship: e.target.value })}
              className="w-full border border-[#e5e7eb] px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#800020]"
            />
          </div>

          <div>
            <label className="block text-xs tracking-[1px] uppercase text-[#800020] mb-1">
              Message
            </label>
            <textarea
              value={form.tributeMessage}
              onChange={(e) => setForm({ ...form, tributeMessage: e.target.value })}
              rows={3}
              className="w-full border border-[#e5e7eb] px-3 py-2 text-sm bg-white resize-none focus:outline-none focus:border-[#800020]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs tracking-[1px] uppercase text-[#800020] mb-1">
                Birth Date
              </label>
              <input
                type="date"
                value={form.birthDate}
                onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
                className="w-full border border-[#e5e7eb] px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#800020]"
              />
            </div>
            <div>
              <label className="block text-xs tracking-[1px] uppercase text-[#800020] mb-1">
                Location
              </label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full border border-[#e5e7eb] px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#800020]"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-[#e5e7eb] mt-5 pt-4">
          <p className="text-xs tracking-[1px] uppercase text-[#800020] mb-3">Ship To</p>
          <div className="space-y-3">
            <input
              type="text"
              value={form.shipToName}
              onChange={(e) => setForm({ ...form, shipToName: e.target.value })}
              placeholder="Recipient name"
              className="w-full border border-[#e5e7eb] px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#800020]"
            />
            <input
              type="text"
              value={form.shipToAddress}
              onChange={(e) => setForm({ ...form, shipToAddress: e.target.value })}
              placeholder="Street address"
              className="w-full border border-[#e5e7eb] px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#800020]"
            />
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                value={form.shipToCity}
                onChange={(e) => setForm({ ...form, shipToCity: e.target.value })}
                placeholder="City"
                className="w-full border border-[#e5e7eb] px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#800020]"
              />
              <input
                type="text"
                value={form.shipToState}
                onChange={(e) => setForm({ ...form, shipToState: e.target.value })}
                placeholder="State"
                className="w-full border border-[#e5e7eb] px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#800020]"
              />
              <input
                type="text"
                value={form.shipToZip}
                onChange={(e) => setForm({ ...form, shipToZip: e.target.value })}
                placeholder="ZIP"
                className="w-full border border-[#e5e7eb] px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#800020]"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="text-sm text-gray-400 hover:text-gray-500 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !form.honoredName.trim()}
            className="text-sm bg-[#111827] text-white px-4 py-2 hover:bg-[#333] transition-colors disabled:opacity-40"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  )
}
