"use client"

import { useState } from "react"

export function useUpload() {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function uploadFile(file: File, token?: string): Promise<string> {
    setUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const tokenParam = token ? `?token=${token}` : ""
      const res = await fetch(`/api/upload${tokenParam}`, {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Upload failed")
      }

      const { url } = await res.json()
      return url
    } catch (err) {
      const msg = (err as Error).message
      setError(msg)
      throw err
    } finally {
      setUploading(false)
    }
  }

  return { uploadFile, uploading, error }
}
