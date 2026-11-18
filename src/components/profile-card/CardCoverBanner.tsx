import type { KeyboardEvent } from 'react'
import type { ProfileThemeConfig, CoverBannerConfig } from '../../types'

interface CardCoverBannerProps {
  theme: ProfileThemeConfig
  banner?: CoverBannerConfig
  onExpand?: () => void
  isEnlarged?: boolean
}

export function CardCoverBanner({
  theme,
  banner,
  onExpand,
  isEnlarged = false,
}: CardCoverBannerProps) {
  const { bannerGradientStart, bannerGradientEnd } = theme.colors
  const bannerType = banner?.type || 'gradient'
  const isClickable = Boolean(onExpand && !isEnlarged)
  const heightClass = isEnlarged ? 'h-72 sm:h-96 w-[90vw] max-w-3xl' : 'h-28 w-full'

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!isClickable) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onExpand?.()
    }
  }

  // If image mode is selected and an image URL is present
  if (bannerType === 'image' && banner?.imageUrl) {
    const posX = banner.positionX ?? 50
    const posY = banner.positionY ?? 50
    const zoom = isEnlarged ? 1 : (banner.zoom ?? 1)
    const overlayOpacity = banner.overlayOpacity ?? 0
    const overlayColor = banner.overlayColor || '#000000'

    return (
      <div
        role={isClickable ? 'button' : undefined}
        tabIndex={isClickable ? 0 : undefined}
        aria-label={isClickable ? 'View enlarged cover banner' : undefined}
        onClick={isClickable ? onExpand : undefined}
        onKeyDown={handleKeyDown}
        className={`relative ${heightClass} overflow-hidden bg-slate-900 ${
          isClickable ? 'cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-indigo-500' : ''
        }`}
        title={isClickable ? 'Click or press Enter to enlarge banner' : undefined}
      >
        {/* Banner Image with pan and zoom transform */}
        <div
          className="absolute inset-0 bg-cover bg-no-repeat transition-transform duration-150"
          style={{
            backgroundImage: `url(${banner.imageUrl})`,
            backgroundPosition: `${posX}% ${posY}%`,
            transform: `scale(${zoom})`,
            transformOrigin: `${posX}% ${posY}%`,
          }}
        />
        {/* Readability Overlay */}
        {overlayOpacity > 0 && (
          <div
            className="absolute inset-0 transition-opacity duration-150 pointer-events-none"
            style={{
              backgroundColor: overlayColor,
              opacity: overlayOpacity,
            }}
          />
        )}
      </div>
    )
  }

  // If solid color mode
  if (bannerType === 'solid') {
    const solidColor = banner?.solidColor || bannerGradientStart
    return (
      <div
        role={isClickable ? 'button' : undefined}
        tabIndex={isClickable ? 0 : undefined}
        aria-label={isClickable ? 'View enlarged cover banner' : undefined}
        onClick={isClickable ? onExpand : undefined}
        onKeyDown={handleKeyDown}
        className={`${heightClass} transition-all duration-300 ${
          isClickable ? 'cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-indigo-500' : ''
        }`}
        style={{ backgroundColor: solidColor }}
        title={isClickable ? 'Click or press Enter to enlarge banner' : undefined}
      />
    )
  }

  // Default: Gradient mode
  const gradStart = banner?.gradientStart || bannerGradientStart
  const gradEnd = banner?.gradientEnd || bannerGradientEnd

  return (
    <div
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      aria-label={isClickable ? 'View enlarged cover banner' : undefined}
      onClick={isClickable ? onExpand : undefined}
      onKeyDown={handleKeyDown}
      className={`${heightClass} transition-all duration-300 ${
        isClickable ? 'cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-indigo-500' : ''
      }`}
      style={{
        background: `linear-gradient(135deg, ${gradStart}, ${gradEnd})`,
      }}
      title={isClickable ? 'Click or press Enter to enlarge banner' : undefined}
    />
  )
}
