'use client'

import { useEffect, useState } from 'react'
import { FileUploadZone } from '@/components/FileUploadZone'
import { FileCard } from '@/components/FileCard'
import { Notification } from '@/components/Notification'
import { ProgressBar } from '@/components/ProgressBar'
import { FileData } from '@/lib/types'

type Particle = {
  left: string
  top: string
  delay: string
  duration: string
}

export default function Home() {
  const [files, setFiles] = useState<FileData[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [notification, setNotification] = useState('')
  const [particles, setParticles] = useState<Particle[]>([])

  // Load files from localStorage on mount
  useEffect(() => {
    const savedFiles = localStorage.getItem('vaultSync24Files')
    if (savedFiles) {
      setFiles(JSON.parse(savedFiles))
    }

    // Generate particle positions
    const newParticles = Array.from({ length: 12 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 6}s`,
      duration: `${6 + Math.random() * 4}s`,
    }))
    setParticles(newParticles)
  }, [])

  // Save files to localStorage whenever files change
  useEffect(() => {
    localStorage.setItem('vaultSync24Files', JSON.stringify(files))
  }, [files])

  // Clean up expired files every minute
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      setFiles(prev => prev.filter(file => file.expiresAt > now))
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  const showNotification = (message: string) => {
    setNotification(message)
    setTimeout(() => setNotification(''), 3000)
  }

  const handleFileUpload = async (uploadedFiles: File[]) => {
    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i)
      await new Promise(resolve => setTimeout(resolve, 150))
    }

    const newFiles: FileData[] = uploadedFiles.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      url: URL.createObjectURL(file), // Replace with Firebase URL in production
      uploadedAt: Date.now(),
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    }))

    setFiles(prev => [...prev, ...newFiles])
    setIsUploading(false)
    setUploadProgress(0)
    showNotification(`✅ ${uploadedFiles.length} file(s) uploaded successfully!`)
  }

  const handleDeleteFile = (fileId: number) => {
    setFiles(prev => prev.filter(file => file.id !== fileId))
    showNotification('🗑️ File deleted successfully!')
  }

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link)
    showNotification('🔗 Link copied to clipboard!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600">
      {/* Floating particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {particles.map((p, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full animate-float"
            style={{
              left: p.left,
              top: p.top,
              animationDelay: p.delay,
              animationDuration: p.duration,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
              🚀 VaultSync24
            </h1>
            <p className="text-xl text-white/90 drop-shadow-md">
              Secure file sharing with 24-hour temporary links
            </p>
          </div>

          {/* Notification */}
          {notification && (
            <Notification message={notification} onClose={() => setNotification('')} />
          )}

          {/* Upload Zone */}
          <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-8 mb-8 border border-white/20 shadow-2xl">
            <FileUploadZone onFileUpload={handleFileUpload} isUploading={isUploading} />

            {isUploading && (
              <div className="mt-6">
                <ProgressBar progress={uploadProgress} />
                <p className="text-center text-white mt-3 font-medium">
                  Uploading... {uploadProgress}%
                </p>
              </div>
            )}
          </div>

          {/* Files List */}
          {files.length > 0 && (
            <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-8 border border-white/20 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center drop-shadow-md">
                📂 Your Files ({files.length})
              </h2>

              <div className="grid gap-4 md:grid-cols-2">
                {files.map(file => (
                  <FileCard
                    key={file.id}
                    file={file}
                    onDelete={handleDeleteFile}
                    onCopyLink={handleCopyLink}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="text-center mt-12 text-white/70">
            <p className="drop-shadow-md">🔒 All files are automatically deleted after 24 hours</p>
            <p className="mt-2 drop-shadow-md">Built with ❤️ for secure file sharing</p>
            <p className="mt-2 drop-shadow-md">@2025 Kennedy Banda. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
