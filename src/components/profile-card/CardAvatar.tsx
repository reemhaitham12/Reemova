import { useState, useRef, type KeyboardEvent } from 'react'
import { getInitials } from '../../utils/initials'

interface CardAvatarProps {
  fullName: string
  avatarUrl?: string | null
  onExpand?: () => void
}

export function CardAvatar({ fullName, avatarUrl, onExpand }: CardAvatarProps) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null)
  const avatarRef = useRef<HTMLDivElement>(null)
  const initials = getInitials(fullName)

  const hasImage = Boolean(avatarUrl && failedUrl !== avatarUrl)
  const isClickable = Boolean(onExpand && hasImage)

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!isClickable) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onExpand?.()
    }
  }

  return (
    <div
      ref={avatarRef}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      aria-label={isClickable ? `View enlarged photo for ${fullName || 'profile'}` : undefined}
      onClick={isClickable ? onExpand : undefined}
      onKeyDown={handleKeyDown}
      className={`flex h-24 w-24 shrink-0 aspect-square items-center justify-center overflow-hidden rounded-[12px] border-4 border-white bg-slate-900 text-2xl font-bold text-white shadow-md select-none transition-transform ${
        isClickable ? 'cursor-pointer hover:scale-105 hover:shadow-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500' : ''
      }`}
      style={{ aspectRatio: '1 / 1', borderRadius: '12px' }}
      title={isClickable ? 'Click or press Enter to enlarge photo' : undefined}
    >
      {hasImage ? (
        <img
          src={avatarUrl!}
          alt={fullName || 'Profile Avatar'}
          onError={() => setFailedUrl(avatarUrl || null)}
          className="h-full w-full object-cover pointer-events-none"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  )
}
