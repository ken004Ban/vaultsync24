'use client'

import { useEffect } from 'react'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NotificationProps {
  message: string
  type?: 'success' | 'error' | 'info'
  duration?: number
  onClose: () => void
}

export function Notification({ 
  message, 
  type = 'success', 
  duration = 3000, 
  onClose 
}: NotificationProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-400" />
      case 'info':
        return <Info className="w-5 h-5 text-blue-400" />
      default:
        return <CheckCircle className="w-5 h-5 text-green-400" />
    }
  }

  const getColors = () => {
    switch (type) {
      case 'success':
        return 'border-green-400/50 bg-green-500/10'
      case 'error':
        return 'border-red-400/50 bg-red-500/10'
      case 'info':
        return 'border-blue-400/50 bg-blue-500/10'
      default:
        return 'border-green-400/50 bg-green-500/10'
    }
  }

  return (
    <div className={cn(
      'backdrop-blur-lg rounded-xl p-4 mb-6 border shadow-2xl',
      'animate-in slide-in-from-top-5 fade-in duration-300',
      getColors()
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {getIcon()}
          <span className="text-white font-medium">{message}</span>
        </div>
        
        <button
          onClick={onClose}
          className="text-white/60 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}