"use client"

import { useState, useRef } from "react"
import { useUpload } from "@/hooks/use-upload"
import Image from "next/image"

interface ContributionFormProps {
  tributeId: string
  token: string
  honoredName: string
  allowAnonymous: boolean
  onSuccess: () => void
}

export function ContributionForm({
  tributeId,
  token,
  honoredName,
  allowAnonymous,
  onSuccess,
}: ContributionFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { uploadFile, uploading } = useUpload()

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  function clearPhoto() {
    setPhotoFile(null)
    setPhotoPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!message.trim() && !photoFile) {
      setError("Please add a message, a photo, or both.")
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      let photoUrl: string | undefined
      if (photoFile) {
        photoUrl = await uploadFile(photoFile, token)
      }

      const res = await fetch(`/api/tributes/${tributeId}/contributions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contributorName: isAnonymous ? undefined : name || undefined,
          contributorEmail: email || undefined,
          isAnonymous,
          message: message.trim() || undefined,
          photoUrl,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Submission failed")

      onSuccess()
    } catch (err) {
      setError((err as Error).message)
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-3 border border-red-200 bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}

      {!isAnonymous && (
        <>
          <div>
            <label className="block text-xs tracking-[2px] uppercase text-[#8b7355] mb-2">
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="How you knew them"
              className="w-full border border-[#d4c5a9] bg-white px-4 py-3 text-sm outline-none focus:border-[#8b7355]"
            />
          </div>

          <div>
            <label className="block text-xs tracking-[2px] uppercase text-[#8b7355] mb-2">
              Email (optional, kept private)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full border border-[#d4c5a9] bg-white px-4 py-3 text-sm outline-none focus:border-[#8b7355]"
            />
          </div>
        </>
      )}

      <div>
        <label className="block text-xs tracking-[2px] uppercase text-[#8b7355] mb-2">
          Your Message
        </label>
        <textarea
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={1000}
          placeholder={`Share a memory of ${honoredName}...`}
          className="w-full border border-[#d4c5a9] bg-white px-4 py-3 text-sm outline-none focus:border-[#8b7355] resize-none"
        />
        <p className="text-xs text-[#bbb] text-right mt-1">{message.length}/1000</p>
      </div>

      <div>
        <label className="block text-xs tracking-[2px] uppercase text-[#8b7355] mb-2">
          Add a Photo (optional)
        </label>

        {photoPreview ? (
          <div className="relative">
            <div className="relative w-full h-48">
              <Image
                src={photoPreview}
                alt="Photo preview"
                fill
                className="object-cover border border-[#d4c5a9]"
              />
            </div>
            <button
              type="button"
              onClick={clearPhoto}
              className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 hover:bg-black/80"
            >
              Remove
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full border border-dashed border-[#d4c5a9] py-8 text-sm text-[#999] hover:border-[#8b7355] hover:text-[#8b7355] transition-colors"
          >
            Click to select a photo
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handlePhotoChange}
          className="hidden"
        />
      </div>

      {allowAnonymous && (
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
            className="w-4 h-4 border-[#d4c5a9] rounded accent-[#8b7355]"
          />
          <div>
            <p className="text-sm text-[#2d2d2d]">Stay anonymous</p>
            <p className="text-xs text-[#999]">
              Your contribution will appear with a private black box in the gallery
            </p>
          </div>
        </label>
      )}

      <button
        type="submit"
        disabled={submitting || uploading}
        className="w-full bg-[#1a1a1a] text-white py-4 text-sm tracking-[1px] uppercase hover:bg-[#333] transition-colors disabled:opacity-50"
      >
        {uploading ? "Uploading photo..." : submitting ? "Submitting..." : "Share My Memory"}
      </button>
    </form>
  )
}
