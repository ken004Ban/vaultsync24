'use client'

import { useState } from 'react'

type UploadResult = {
  url: string
}

type UploadErrorResponse = {
  error: string
  details?: string
}

export function useFileUpload() {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fileUrl, setFileUrl] = useState<string | null>(null)

  const uploadFile = async (file: File) => {
    setUploading(true)
    setError(null)
    setFileUrl(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const isJson = response.headers.get('content-type')?.includes('application/json')
      const data = isJson ? await response.json() : {}

      if (!response.ok) {
        const errorData = data as UploadErrorResponse
        throw new Error(errorData?.error || 'Upload failed')
      }

      const result = data as UploadResult
      setFileUrl(result.url)
      return result.url
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(message)
      return null
    } finally {
      setUploading(false)
    }
  }

  return {
    uploading,
    error,
    fileUrl,
    uploadFile,
  }
}
