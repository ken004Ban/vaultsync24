export interface FileData {
    id: string
    name: string
    size: number
    type?: string
    url: string
    storagePath?: string
    uploadedAt: number
    expiresAt: number
  }
  
  export interface UploadProgress {
    progress: number
    isUploading: boolean
  }
  
  export interface NotificationProps {
    message: string
    type?: 'success' | 'error' | 'info'
    duration?: number
  }
  
  export interface FileUploadZoneProps {
    onFileUpload: (files: File[]) => void
    isUploading: boolean
    maxFileSize?: number
    acceptedFileTypes?: string[]
  }
  
  export interface FileCardProps {
    file: FileData
    onDelete: (fileId: string) => void
    onCopyLink: (link: string) => void
  }
  
  export interface ProgressBarProps {
    progress: number
    className?: string
  }