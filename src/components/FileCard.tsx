/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState, useEffect } from 'react'
import { Download, Link2, Trash2, Clock } from 'lucide-react'
import { FileCardProps } from '@/lib/types'
import { formatFileSize, formatTimeRemaining, generateShareableLink, getFileIcon, isFileExpired } from '@/lib/utils'
import { cn } from '@/lib/utils'

export function FileCard({ file, onDelete, onCopyLink }: FileCardProps) {
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [expired, setExpired] = useState(false)

  useEffect(() => {
    const updateTimer = () => {
      const remaining = file.expiresAt - Date.now()
      
      if (remaining <= 0) {
        setExpired(true)
        setTimeRemaining(0)
        return
      }
      
      setTimeRemaining(remaining)
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [file.expiresAt])

  const handleDownload = () => {
    if (expired) return
    
    // Create download link
    const link = document.createElement('a')
    link.href = file.url
    link.download = file.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleCopyLink = () => {
    if (expired) return
    onCopyLink(generateShareableLink(file.id))
  }

  const progressPercentage = (timeRemaining / (24 * 60 * 60 * 1000)) * 100

  return (
    <div className={cn(
      'backdrop-blur-lg bg-white/10 rounded-xl p-6 border border-white/20 shadow-lg transition-all duration-300',
      'hover:transform hover:-translate-y-1 hover:shadow-2xl',
      expired && 'opacity-60 hover:transform-none hover:translate-y-0'
    )}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <span className="text-2xl flex-shrink-0">{getFileIcon(file.name)}</span>
          <div className="min-w-0 flex-1">
            <h4 className="font-semibold text-white truncate" title={file.name}>
              {file.name}
            </h4>
            <p className="text-white/60 text-sm">{formatFileSize(file.size)}</p>
          </div>
        </div>
        
        <button
          onClick={() => onDelete(file.id)}
          className="text-white/60 hover:text-red-400 transition-colors p-1 rounded hover:bg-red-500/20"
          title="Delete file"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Status */}
      {expired ? (
        <div className="text-center py-6">
          <div className="text-red-400 font-semibold flex items-center justify-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Link Expired</span>
          </div>
          <p className="text-white/50 text-sm mt-2">
            This file is no longer available for download
          </p>
        </div>
      ) : (
        <>
          {/* Time Remaining */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white/70 text-sm flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>Time Remaining</span>
              </span>
              <span className="font-bold text-lg bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                {formatTimeRemaining(timeRemaining)}
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-1000 ease-out"
                style={{ width: `${Math.max(0, Math.min(100, progressPercentage))}%` }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={handleDownload}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-2 shadow-lg hover:shadow-green-500/25"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
            
            <button
              onClick={handleCopyLink}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-2 shadow-lg hover:shadow-blue-500/25"
            >
              <Link2 className="w-4 h-4" />
              <span>Copy Link</span>
            </button>
          </div>

          {/* Upload Time */}
          <p className="text-white/40 text-xs text-center mt-3">
            Uploaded {new Date(file.uploadedAt).toLocaleString()}
          </p>
        </>
      )}
    </div>
  )
}