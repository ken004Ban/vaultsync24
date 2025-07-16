import { type ClassValue, clsx } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const formatTimeRemaining = (milliseconds: number): string => {
  const hours = Math.floor(milliseconds / (1000 * 60 * 60))
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000)
  
  if (hours > 0) return `${hours}h ${minutes}m`
  if (minutes > 0) return `${minutes}m ${seconds}s`
  return `${seconds}s`
}

export const generateShareableLink = (fileId: number): string => {
  return `${window.location.origin}/download/${fileId}`
}

export const getFileIcon = (fileName: string): string => {
  const ext = fileName.split('.').pop()?.toLowerCase()
  const icons: Record<string, string> = {
    // Documents
    pdf: '📄',
    doc: '📝',
    docx: '📝',
    txt: '📄',
    rtf: '📄',
    
    // Images
    jpg: '🖼️',
    jpeg: '🖼️',
    png: '🖼️',
    gif: '🖼️',
    svg: '🖼️',
    webp: '🖼️',
    
    // Videos
    mp4: '🎥',
    avi: '🎥',
    mov: '🎥',
    wmv: '🎥',
    flv: '🎥',
    webm: '🎥',
    
    // Audio
    mp3: '🎵',
    wav: '🎵',
    flac: '🎵',
    aac: '🎵',
    ogg: '🎵',
    
    // Archives
    zip: '📦',
    rar: '📦',
    '7z': '📦',
    tar: '📦',
    gz: '📦',
    
    // Code
    js: '📜',
    ts: '📜',
    jsx: '📜',
    tsx: '📜',
    py: '📜',
    java: '📜',
    cpp: '📜',
    html: '📜',
    css: '📜',
    
    // Spreadsheets
    xlsx: '📊',
    xls: '📊',
    csv: '📊',
    
    // Presentations
    ppt: '📺',
    pptx: '📺'
  }
  
  return icons[ext || ''] || '📄'
}

export const isFileExpired = (expiresAt: number): boolean => {
  return Date.now() > expiresAt
}

export const validateFileSize = (file: File, maxSize: number = 50 * 1024 * 1024): boolean => {
  return file.size <= maxSize
}

export const validateFileType = (file: File, allowedTypes: string[] = []): boolean => {
  if (allowedTypes.length === 0) return true
  return allowedTypes.includes(file.type)
}