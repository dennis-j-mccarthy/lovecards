"use client"

import { useState, useEffect, useRef } from "react"
import { useUser, useClerk } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { UserAvatar } from "@/components/ui/user-avatar"
import { useUpload } from "@/hooks/use-upload"

export default function AccountPage() {
  const { user, isLoaded, isSignedIn } = useUser()
  const { signOut } = useClerk()
  const { uploadFile } = useUpload()
  const router = useRouter()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [image, setImage] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in?redirect_url=/account")
    }
  }, [isLoaded, isSignedIn, router])

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/account")
      if (res.ok) {
        const data = await res.json()
        setName(data.name ?? "")
        setEmail(data.email ?? "")
        setImage(data.image ?? null)
      }
    }
    if (isSignedIn) load()
  }, [isSignedIn])

  async function handleSave() {
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name || undefined, email: email || undefined }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(typeof data.error === "string" ? data.error : "Update failed")
      }
      await user?.reload()
      setMessage({ type: "success", text: "Profile updated" })
    } catch (err) {
      setMessage({ type: "error", text: (err as Error).message })
    } finally {
      setSaving(false)
    }
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setMessage(null)
    try {
      const url = await uploadFile(file)

      // Update user profile with new image URL
      const res = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: url }),
      })
      if (!res.ok) throw new Error("Failed to save avatar")
      const data = await res.json()
      setImage(data.image)
      await user?.reload()
      setMessage({ type: "success", text: "Avatar updated" })
    } catch (err) {
      setMessage({ type: "error", text: (err as Error).message })
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  async function handleRemoveAvatar() {
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: null }),
      })
      if (!res.ok) throw new Error("Failed to remove avatar")
      setImage(null)
      await user?.reload()
      setMessage({ type: "success", text: "Avatar removed" })
    } catch (err) {
      setMessage({ type: "error", text: (err as Error).message })
    } finally {
      setSaving(false)
    }
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    )
  }

  if (!isSignedIn) return null

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-200 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/">
            <img src="/logo.png" alt="Love Cards" className="h-16" />
          </Link>
          <Link
            href="/dashboard"
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">My Account</h1>

        {message && (
          <div
            className={`mb-6 p-3 rounded-lg text-sm ${
              message.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Avatar Section */}
        <div className="mb-10">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-4">
            Profile Photo
          </p>
          <div className="flex items-center gap-6">
            <UserAvatar
              name={name}
              email={email}
              image={image}
              size="xl"
            />
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="block text-sm font-medium text-[#800020] hover:text-[#5c0018] disabled:opacity-50"
              >
                {uploading ? "Uploading..." : image ? "Change photo" : "Upload photo"}
              </button>
              {image && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  disabled={saving}
                  className="block text-sm text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                >
                  Remove photo
                </button>
              )}
              <p className="text-xs text-gray-400">
                JPG, PNG, or WebP. Displayed as a circle.
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Name & Email */}
        <div className="space-y-6 mb-10">
          <div>
            <label
              htmlFor="name"
              className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full border border-gray-200 bg-white px-4 py-3 text-sm rounded-lg outline-none focus:border-[#800020] focus:ring-1 focus:ring-[#800020]"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full border border-gray-200 bg-white px-4 py-3 text-sm rounded-lg outline-none focus:border-[#800020] focus:ring-1 focus:ring-[#800020]"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#800020] text-white px-6 py-2.5 text-sm font-medium rounded-lg hover:bg-[#5c0018] transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

          <button
            onClick={() => signOut({ redirectUrl: "/" })}
            className="text-sm text-gray-400 hover:text-red-500 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}
