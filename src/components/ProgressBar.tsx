'use client'

import { ProgressBarProps } from '@/lib/types'
import { cn } from '@/lib/utils'

export function ProgressBar({ progress, className }: ProgressBarProps) {
  return (
    <div className={cn('w-full bg-white/20 rounded-full h-3 overflow-hidden', className)}>
      <div
        className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-300 ease-out relative overflow-hidden"
        style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
      >
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
      </div>
    </div>
  )
}