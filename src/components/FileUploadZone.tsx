'use client'

import { useState, useRef, DragEvent, ChangeEvent } from 'react'
import { Upload, File, Cloud } from 'lucide-react'
import { FileUploadZoneProps } from '@/lib/types'
import { cn } from '@/lib/utils'

export function FileUploadZone({ 
  onFileUpload, 
  isUploading, 
  maxFileSize = 50 * 1024 * 1024, // 50MB
  acceptedFileTypes = []
}: FileUploadZoneProps) {
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    processFiles(files)
  }

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      processFiles(files)
    }
  }

  const processFiles = (files: File[]) => {
    // Filter out files that are too large
    const validFiles = files.filter(file => {
      if (file.size > maxFileSize) {
        alert(`File ${file.name} is too large. Maximum size is ${maxFileSize / 1024 / 1024}MB`)
        return false
      }
      return true
    })

    if (validFiles.length > 0) {
      onFileUpload(validFiles)
    }
  }

  const handleClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click()
    }
  }

  return (
    <div
      className={cn(
        'relative rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 border-2 border-dashed',
        'hover:scale-[1.02] hover:shadow-xl',
        dragOver 
          ? 'border-green-400 bg-green-500/10 scale-[1.02]' 
          : 'border-white/30 bg-gradient-to-br from-white/10 to-white/5',
        isUploading && 'pointer-events-none opacity-75 cursor-not-allowed'
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileSelect}
        accept={acceptedFileTypes.join(',')}
        disabled={isUploading}
      />
      
      <div className="flex flex-col items-center space-y-4">
        {/* Icon */}
        <div className={cn(
          'p-6 rounded-full transition-all duration-300',
          dragOver ? 'bg-green-500/20' : 'bg-white/10',
          isUploading && 'animate-pulse'
        )}>
          {isUploading ? (
            <Cloud className="w-12 h-12 text-white animate-bounce" />
          ) : dragOver ? (
            <Upload className="w-12 h-12 text-green-400" />
          ) : (
            <File className="w-12 h-12 text-white" />
          )}
        </div>

        {/* Text */}
        <div>
          <h3 className="text-2xl font-semibold text-white mb-2">
            {isUploading 
              ? 'Uploading files...' 
              : dragOver 
                ? 'Drop files here!' 
                : 'Drop files here or click to browse'
            }
          </h3>
          
          <p className="text-white/70 text-lg">
            {isUploading 
              ? 'Please wait while we process your files' 
              : 'Files will be available for 24 hours'
            }
          </p>

          <p className="text-white/50 text-sm mt-2">
            Maximum file size: {maxFileSize / 1024 / 1024}MB
          </p>
        </div>

        {/* Features */}
        <div className="flex items-center space-x-6 text-sm text-white/60 pt-4">
          <div className="flex items-center space-x-2">
            <span>🔒</span>
            <span>Secure</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>⚡</span>
            <span>Fast</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>🕐</span>
            <span>24h Expiry</span>
          </div>
        </div>
      </div>

      {/* Loading overlay */}
      {isUploading && (
        <div className="absolute inset-0 rounded-2xl bg-black/20 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            <span className="text-white font-medium">Processing...</span>
          </div>
        </div>
      )}
    </div>
  )
}