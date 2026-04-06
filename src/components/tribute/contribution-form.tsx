"use client"

/* eslint-disable @next/next/no-img-element */
import { useState, useRef, useCallback, useEffect } from "react"
import { useUpload } from "@/hooks/use-upload"
import Image from "next/image"

function InspirationPopup({ honoredName }: { honoredName: string }) {
  const [open, setOpen] = useState(false)
  const popupRef = useRef<HTMLDivElement>(null)

  const toggle = useCallback(() => setOpen((o) => !o), [])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [open])

  return (
    <div className="relative inline-block" ref={popupRef}>
      <button
        type="button"
        onClick={toggle}
        className="inline-flex items-center gap-2 border border-[#e5e7eb] bg-white px-3 py-1.5 text-xs text-[#800020] hover:bg-[#fdf2f4] hover:border-[#800020] transition-colors"
      >
        <span className="w-4 h-4 rounded-full bg-[#800020] text-white inline-flex items-center justify-center text-[10px] font-bold leading-none">
          ?
        </span>
        What makes a great card?
      </button>

      {open && (
        <div className="absolute left-0 bottom-full mb-2 w-80 bg-white border border-[#e5e7eb] shadow-lg z-50 rounded-sm">
          <div className="flex items-center justify-between px-4 pt-3 pb-2">
            <p className="text-xs tracking-[2px] uppercase text-[#800020] font-medium">
              What Makes a Great Card
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-gray-300 hover:text-gray-500 text-lg leading-none"
            >
              &times;
            </button>
          </div>
          <div className="px-4 pb-4">
            <p className="text-xs text-gray-500 leading-relaxed mb-3">
              The best cards come from the heart. Here are some ideas:
            </p>
            <ul className="space-y-2.5 text-xs text-[#1f2937]">
              <li className="flex items-start gap-1.5">
                <span className="text-[#800020] mt-px flex-shrink-0">&#10045;</span>
                <span>
                  <strong>A favorite memory</strong> &mdash; a moment with{" "}
                  {honoredName} that makes you smile or feel grateful
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#800020] mt-px flex-shrink-0">&#10045;</span>
                <span>
                  <strong>A quote, poem, or passage</strong> &mdash; from a book,
                  a movie, a song &mdash; any words that remind you of them.
                  If you&apos;re quoting someone else, be sure to include who
                  said it. Your name will appear on the card as &ldquo;shared
                  by&rdquo; you.
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#800020] mt-px flex-shrink-0">&#10045;</span>
                <span>
                  <strong>A scripture passage</strong> &mdash; a verse that speaks
                  to your relationship
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#800020] mt-px flex-shrink-0">&#10045;</span>
                <span>
                  <strong>Something you&apos;re looking forward to</strong> &mdash;
                  a trip, a milestone, a tradition you share
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#800020] mt-px flex-shrink-0">&#10045;</span>
                <span>
                  <strong>Something you wouldn&apos;t normally say</strong> &mdash;
                  the words that feel a little too intimate, a little too
                  vulnerable. Those mean the most.
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#800020] mt-px flex-shrink-0">&#10045;</span>
                <span>
                  <strong>A story only you know</strong> &mdash; inside jokes,
                  quiet moments, things that are uniquely yours
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#800020] mt-px flex-shrink-0">&#10045;</span>
                <span>
                  <strong>A photo</strong> &mdash; a picture can say what words
                  can&apos;t. Add your avatar so they know who it&apos;s from,
                  and attach a supporting photo to go with your message.
                </span>
              </li>
            </ul>
            <p className="text-[10px] text-gray-400 mt-3 italic">
              There&apos;s no wrong answer. Write what feels true.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

interface ContributionFormProps {
  tributeId: string
  token: string
  honoredName: string
  allowAnonymous: boolean
  onSuccess: () => void
}

type DraftCard = {
  message: string
  citationSource: string
  photoFile: File | null
  photoPreview: string | null
}

export function ContributionForm({
  tributeId,
  token,
  honoredName,
  allowAnonymous,
  onSuccess,
}: ContributionFormProps) {
  // Shared identity
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [smsOptIn, setSmsOptIn] = useState(false)
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  // Current card composer
  const [message, setMessage] = useState("")
  const [citationSource, setCitationSource] = useState("")
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  // Queue
  const [draftCards, setDraftCards] = useState<DraftCard[]>([])

  // Submission
  const [submitting, setSubmitting] = useState(false)
  const [progress, setProgress] = useState("")
  const [error, setError] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const { uploadFile } = useUpload()

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

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

  function addCard() {
    if (!message.trim() && !photoFile) {
      setError("Add a message, a photo, or both to create a card.")
      return
    }
    setError(null)
    setDraftCards((prev) => [
      ...prev,
      { message: message.trim(), citationSource: citationSource.trim(), photoFile, photoPreview },
    ])
    setMessage("")
    setCitationSource("")
    setPhotoFile(null)
    setPhotoPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  function removeCard(index: number) {
    setDraftCards((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSubmitAll() {
    if (draftCards.length === 0) return
    setSubmitting(true)
    setError(null)

    try {
      // Upload avatar once if provided
      let avatarUrl: string | undefined
      if (avatarFile && !isAnonymous) {
        setProgress("Uploading your avatar...")
        avatarUrl = await uploadFile(avatarFile, token)
      }

      for (let i = 0; i < draftCards.length; i++) {
        const card = draftCards[i]
        setProgress(
          draftCards.length === 1
            ? "Submitting..."
            : `Submitting card ${i + 1} of ${draftCards.length}...`
        )

        let photoUrl: string | undefined
        if (card.photoFile) {
          setProgress(
            draftCards.length === 1
              ? "Uploading photo..."
              : `Uploading photo for card ${i + 1}...`
          )
          photoUrl = await uploadFile(card.photoFile, token)
        }

        const res = await fetch(`/api/tributes/${tributeId}/contributions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contributorName: isAnonymous ? undefined : name || undefined,
            contributorEmail: email || undefined,
            contributorPhone: phone || undefined,
            smsOptIn: phone ? smsOptIn : undefined,
            isAnonymous,
            avatarUrl,
            message: card.message || undefined,
            citationSource: card.citationSource || undefined,
            photoUrl,
          }),
        })

        const data = await res.json()
        if (!res.ok) {
          const msg = typeof data.error === "string" ? data.error : JSON.stringify(data.error)
          throw new Error(msg ?? "Submission failed")
        }
      }

      onSuccess()
    } catch (err) {
      setError((err as Error).message)
      setSubmitting(false)
      setProgress("")
    }
  }

  const totalCards = draftCards.length

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 border border-red-200 bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Shared identity */}
      {!isAnonymous && (
        <div className="space-y-4">
          {/* Avatar */}
          <div>
            <label className="block text-xs tracking-[2px] uppercase text-[#800020] mb-2">
              Your Photo (optional)
            </label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                disabled={submitting}
                className="relative w-16 h-16 rounded-full border-2 border-dashed border-[#e5e7eb] overflow-hidden flex items-center justify-center hover:border-[#800020] transition-colors flex-shrink-0 disabled:opacity-50"
              >
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Your avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="1.5">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 21v-1a6 6 0 0 1 12 0v1" />
                  </svg>
                )}
              </button>
              <p className="text-xs text-gray-400">
                {avatarPreview ? "Click to change" : "This will appear on your cards"}
              </p>
            </div>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>

          <div>
            <label className="block text-xs tracking-[2px] uppercase text-[#800020] mb-2">
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="How you know them"
              disabled={submitting}
              className="w-full border border-[#e5e7eb] bg-white px-4 py-3 text-sm outline-none focus:border-[#800020] disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-xs tracking-[2px] uppercase text-[#800020] mb-2">
              Email (optional, kept private)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              disabled={submitting}
              className="w-full border border-[#e5e7eb] bg-white px-4 py-3 text-sm outline-none focus:border-[#800020] disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-xs tracking-[2px] uppercase text-[#800020] mb-2">
              Phone Number (optional, kept private)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(555) 123-4567"
              disabled={submitting}
              className="w-full border border-[#e5e7eb] bg-white px-4 py-3 text-sm outline-none focus:border-[#800020] disabled:opacity-50"
            />
          </div>

          {phone.trim() && (
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={smsOptIn}
                onChange={(e) => setSmsOptIn(e.target.checked)}
                disabled={submitting}
                className="w-4 h-4 mt-0.5 border-[#e5e7eb] rounded accent-[#800020]"
              />
              <div>
                <p className="text-sm text-[#1f2937]">Text me with reminders or updates</p>
                <p className="text-xs text-gray-400">
                  Standard message rates may apply. We&apos;ll only text about this tribute.
                </p>
              </div>
            </label>
          )}
        </div>
      )}

      {allowAnonymous && (
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
            disabled={submitting}
            className="w-4 h-4 border-[#e5e7eb] rounded accent-[#800020]"
          />
          <div>
            <p className="text-sm text-[#1f2937]">Stay anonymous</p>
            <p className="text-xs text-gray-400">
              Your cards will appear with a private black box in the gallery
            </p>
          </div>
        </label>
      )}

      {/* Queued cards — styled like real contribution cards */}
      {totalCards > 0 && (
        <div className="space-y-4">
          <p className="text-xs tracking-[2px] uppercase text-[#800020]">
            {totalCards} {totalCards === 1 ? "card" : "cards"} ready
          </p>
          <div className="space-y-4">
            {draftCards.map((card, i) => (
              <div
                key={i}
                className="border border-[#e5e7eb] bg-white shadow-sm overflow-hidden rounded-xl"
              >
                {/* Card header */}
                <div className="flex items-center gap-3 p-4 pb-3">
                  {avatarPreview && !isAnonymous ? (
                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-[#e5e7eb]">
                      <img src={avatarPreview} alt="You" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#fdf2f4] flex items-center justify-center flex-shrink-0 border border-[#e5e7eb]">
                      <span className="text-xs font-medium text-[#800020]">
                        {isAnonymous ? "?" : (name || "You").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <p className="text-xs tracking-[1px] uppercase text-[#800020] flex-1">
                    {card.citationSource
                      ? `Shared by ${isAnonymous ? "Anonymous" : name || "You"}`
                      : isAnonymous ? "Anonymous" : name || "You"}
                  </p>
                  {!submitting && (
                    <button
                      type="button"
                      onClick={() => removeCard(i)}
                      className="text-xs text-gray-300 hover:text-red-400 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {/* Card photo */}
                {card.photoPreview && (
                  <div className="w-full h-48 overflow-hidden px-5">
                    <img
                      src={card.photoPreview}
                      alt="Photo"
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                )}

                {/* Card message */}
                <div className="p-5 pt-3">
                  {card.message ? (
                    <div>
                      <blockquote className="text-sm leading-relaxed text-[#1f2937] font-serif italic">
                        &ldquo;{card.message}&rdquo;
                      </blockquote>
                      {card.citationSource && (
                        <p className="text-xs text-gray-400 mt-2 font-serif">
                          — {card.citationSource}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 italic">Photo card</p>
                  )}
                  <div className="pt-3 mt-3 border-t border-[#f0e8d8]">
                    <p className="text-xs text-gray-300">Just now</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Card composer — looks like a card being written */}
      {!submitting && (
        <div className="border border-[#e5e7eb] bg-white shadow-sm overflow-hidden rounded-xl">
          {/* Composer header — like a card header */}
          <div className="flex items-center gap-3 p-4 pb-3 border-b border-[#f0e8d8]">
            {avatarPreview && !isAnonymous ? (
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-[#e5e7eb]">
                <img src={avatarPreview} alt="You" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#fdf2f4] flex items-center justify-center flex-shrink-0 border border-[#e5e7eb]">
                <span className="text-xs font-medium text-[#800020]">
                  {isAnonymous ? "?" : (name || "You").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "✎"}
                </span>
              </div>
            )}
            <div className="flex-1">
              <p className="text-xs tracking-[1px] uppercase text-[#800020]">
                {isAnonymous ? "Anonymous" : name || "Your Card"}
              </p>
            </div>
            <InspirationPopup honoredName={honoredName} />
          </div>

          {/* Photo area */}
          <div className="px-5 pt-4">
            {photoPreview ? (
              <div className="relative mb-3">
                <div className="relative w-full h-48 overflow-hidden rounded">
                  <Image
                    src={photoPreview}
                    alt="Photo preview"
                    fill
                    className="object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={clearPhoto}
                  className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded hover:bg-black/80"
                >
                  Remove
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full border border-dashed border-[#e5e7eb] rounded py-8 text-sm text-gray-400 hover:border-[#800020] hover:text-[#800020] transition-colors mb-3 flex items-center justify-center gap-2"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="m21 15-5-5L5 21" />
                </svg>
                Add a photo (optional)
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

          {/* Message area — styled like the card's italic quote */}
          <div className="px-5 pb-4">
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={1000}
              placeholder={`Write your message for ${honoredName}...`}
              className="w-full border-0 bg-transparent text-sm font-serif italic text-[#1f2937] outline-none resize-none placeholder:text-gray-300 placeholder:not-italic leading-relaxed"
            />
            <p className="text-xs text-gray-300 text-right">
              {message.length}/1000
            </p>
            {message.trim() && (
              <div className="mt-2">
                <input
                  type="text"
                  value={citationSource}
                  onChange={(e) => setCitationSource(e.target.value)}
                  placeholder="Source or author (leave blank if these are your own words)"
                  className="w-full border-0 border-b border-[#e5e7eb] bg-transparent text-xs text-gray-500 outline-none focus:border-[#800020] py-1 placeholder:text-gray-300"
                />
                {citationSource.trim() && (
                  <p className="text-[10px] text-gray-400 mt-1 italic">
                    Card will show as &ldquo;Shared by {isAnonymous ? "Anonymous" : name || "you"}&rdquo;
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Card footer */}
          <div className="px-5 pb-4 pt-2 border-t border-[#f0e8d8]">
            <button
              type="button"
              onClick={addCard}
              className="w-full border border-[#800020] text-[#800020] py-3 text-sm tracking-[1px] uppercase rounded hover:bg-[#800020] hover:text-white transition-colors"
            >
              {totalCards === 0 ? "Add Card" : "Add Another Card"}
            </button>
          </div>
        </div>
      )}

      {/* Submit */}
      {totalCards > 0 && (
        <button
          type="button"
          onClick={handleSubmitAll}
          disabled={submitting}
          className="w-full bg-[#111827] text-white py-4 text-sm tracking-[1px] uppercase hover:bg-[#333] transition-colors disabled:opacity-50"
        >
          {submitting
            ? progress
            : `Submit ${totalCards === 1 ? "Card" : `All ${totalCards} Cards`}`}
        </button>
      )}
    </div>
  )
}
