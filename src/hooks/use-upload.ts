"use client"

import { useState } from "react"
import { upload } from "@vercel/blob/client"

export function useUpload() {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function uploadFile(file: File, token?: string): Promise<string> {
    setUploading(true)
    setError(null)

    try {
      const tokenParam = token ? `?token=${token}` : ""
      const { url } = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: `/api/upload${tokenParam}`,
      })
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
