'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Download, Clock, AlertCircle, FileX, Loader2 } from 'lucide-react'
import { formatFileSize, formatTimeRemaining } from '@/lib/utils'

type FileData = {
  id: string
  name: string
  size: number
  type: string
  url: string
  uploadedAt: number
  expiresAt: number
}

export default function DownloadPage() {
  const params = useParams()
  const [file, setFile] = useState<FileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expired, setExpired] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const res = await fetch(`/api/files/${params.fileId}`)

        if (res.status === 410) {
          setExpired(true)
          setLoading(false)
          return
        }

        if (res.status === 503) {
          const data = await res.json()
          setError(data.details || 'Cloud storage not configured')
          setLoading(false)
          return
        }

        if (!res.ok) {
          setError('File not found')
          setLoading(false)
          return
        }

        const data = await res.json()
        setFile(data)
        setTimeRemaining(data.expiresAt - Date.now())
      } catch {
        setError('Failed to load file. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    if (params.fileId) fetchFile()
  }, [params.fileId])

  useEffect(() => {
    if (!file || expired) return

    const interval = setInterval(() => {
      const remaining = file.expiresAt - Date.now()
      if (remaining <= 0) {
        setExpired(true)
        setTimeRemaining(0)
        clearInterval(interval)
      } else {
        setTimeRemaining(remaining)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [file, expired])

  const handleDownload = () => {
    if (file && !expired) {
      window.open(file.url, '_blank')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 flex items-center justify-center p-6">
      <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-8 border border-white/20 shadow-2xl w-full max-w-md">
        {loading && (
          <div className="text-center py-12">
            <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
            <p className="text-white text-lg font-medium">Loading file...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Error</h2>
            <p className="text-white/70">{error}</p>
          </div>
        )}

        {expired && (
          <div className="text-center py-12">
            <Clock className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Link Expired</h2>
            <p className="text-white/70 mb-4">
              This file is no longer available for download.
            </p>
            <p className="text-white/50 text-sm">
              Files are automatically deleted after 24 hours.
            </p>
          </div>
        )}

        {!loading && !error && !expired && file && (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">
                File Ready
              </h1>
              <p className="text-white/70">
                Your file is ready to download
              </p>
            </div>

            <div className="backdrop-blur-lg bg-white/5 rounded-xl p-6 mb-6 border border-white/10">
              <div className="flex items-center space-x-4 mb-4">
                <FileX className="w-10 h-10 text-white/60" />
                <div className="min-w-0 flex-1">
                  <h3 className="text-white font-semibold truncate">{file.name}</h3>
                  <p className="text-white/60 text-sm">{formatFileSize(file.size)}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-white/70 text-sm">
                <span className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>Expires in</span>
                </span>
                <span className="font-semibold text-orange-400">
                  {formatTimeRemaining(timeRemaining)}
                </span>
              </div>
            </div>

            <button
              onClick={handleDownload}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 hover:scale-[1.02] flex items-center justify-center space-x-3 shadow-lg hover:shadow-green-500/25"
            >
              <Download className="w-6 h-6" />
              <span>Download File</span>
            </button>

            <p className="text-white/40 text-xs text-center mt-4">
              Uploaded {new Date(file.uploadedAt).toLocaleString()}
            </p>
          </>
        )}
      </div>
    </div>
  )
}
