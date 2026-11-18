import { useState, useRef } from 'react'
import { QrCode } from 'lucide-react'
import type { CardDisplayData } from '../../types'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { CardCoverBanner } from './CardCoverBanner'
import { CardAvatar } from './CardAvatar'
import { CardCvButton } from './CardCvButton'
import { CardSocialLinks } from './CardSocialLinks'
import { Lightbox } from '../ui/Lightbox'
import { QrCodeModal } from './QrCodeModal'
import { cn } from '../../utils/cn'

export interface DigitalPersonalCardProps {
  data: CardDisplayData
  username?: string
  /** Override the default QR code modal with a custom handler. */
  onQrCodeClick?: () => void
  /** @deprecated Download CV is no longer shown on the card; kept for API compatibility. */
  onDownloadCv?: () => void
  onViewCv?: () => void
  className?: string
}

const RADIUS_MAP: Record<'sm' | 'md' | 'lg' | 'xl', string> = {
  sm: 'rounded-md',
  md: 'rounded-lg',
  lg: 'rounded-xl',
  xl: 'rounded-2xl',
}

export function DigitalPersonalCard({
  data,
  username = 'alex',
  onQrCodeClick,
  onViewCv,
  className,
}: DigitalPersonalCardProps) {
  const { theme, fullName, title, bio, avatarUrl, cv, links } = data
  const radiusClass = RADIUS_MAP[theme.colors.borderRadius] || 'rounded-xl'

  // Image Lightbox States
  const [isAvatarLightboxOpen, setIsAvatarLightboxOpen] = useState(false)
  const [isBannerLightboxOpen, setIsBannerLightboxOpen] = useState(false)
  const avatarTriggerRef = useRef<HTMLDivElement>(null)
  const bannerTriggerRef = useRef<HTMLDivElement>(null)

  // QR Code Modal State — controlled internally unless parent overrides with onQrCodeClick
  const [isQrModalOpen, setIsQrModalOpen] = useState(false)
  const handleQrCodeClick = onQrCodeClick ?? (() => setIsQrModalOpen(true))

  return (
    <>
      <Card
        className={cn('w-full max-w-md overflow-hidden p-0 shadow-lg transition-all duration-300', radiusClass, className)}
        style={{
          backgroundColor: theme.colors.cardBackgroundColor,
        }}
      >
        {/* Cover / Header Banner (Click to Enlarge) */}
        <div ref={bannerTriggerRef}>
          <CardCoverBanner
            banner={data.banner}
            theme={theme}
            onExpand={() => setIsBannerLightboxOpen(true)}
          />
        </div>

        <div className="relative px-6 pb-8">
          {/* Avatar and QR Action Row */}
          <div className="-mt-14 mb-4 flex items-end justify-between">
            <div ref={avatarTriggerRef}>
              <CardAvatar
                fullName={fullName}
                avatarUrl={avatarUrl}
                onExpand={avatarUrl ? () => setIsAvatarLightboxOpen(true) : undefined}
              />
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5 bg-white text-slate-700 shadow-xs hover:bg-slate-50 transition-colors"
              onClick={handleQrCodeClick}
            >
              <QrCode className="h-4 w-4" style={{ color: theme.colors.accentColor }} />
              <span>QR Code</span>
            </Button>
          </div>

          {/* User Details */}
          <div>
            <h1
              className="text-xl font-bold tracking-tight"
              style={{ color: theme.colors.textColor }}
            >
              {fullName || 'Your Name'}
            </h1>
            <p
              className="text-sm font-medium"
              style={{ color: theme.colors.accentColor }}
            >
              {title || 'Professional Title'}
            </p>
            {bio ? (
              <p
                className="mt-2 text-xs leading-relaxed"
                style={{ color: theme.colors.textMutedColor }}
              >
                {bio}
              </p>
            ) : null}
          </div>

          {/* CV Action Button (View CV only; Download available via the PDF viewer) */}
          <CardCvButton
            cv={cv}
            accentColor={theme.colors.accentColor}
            onViewCv={onViewCv}
          />

          {/* Social & Professional Links */}
          <CardSocialLinks links={links} accentColor={theme.colors.accentColor} />
        </div>
      </Card>

      {/* Avatar Lightbox */}
      {avatarUrl && (
        <Lightbox
          isOpen={isAvatarLightboxOpen}
          onClose={() => setIsAvatarLightboxOpen(false)}
          title={`Enlarged photo of ${fullName || 'Alex Morgan'}`}
          triggerRef={avatarTriggerRef}
        >
          <div className="bg-slate-900 p-2 sm:p-4 rounded-2xl flex items-center justify-center">
            <img
              src={avatarUrl}
              alt={fullName || 'Avatar'}
              className="max-h-[75vh] max-w-[85vw] sm:max-w-md rounded-xl object-contain shadow-2xl"
              style={{ borderRadius: '12px' }}
            />
          </div>
        </Lightbox>
      )}

      {/* Cover Banner Lightbox */}
      <Lightbox
        isOpen={isBannerLightboxOpen}
        onClose={() => setIsBannerLightboxOpen(false)}
        title="Enlarged Cover Banner"
        triggerRef={bannerTriggerRef}
      >
        <div className="overflow-hidden rounded-2xl shadow-2xl bg-slate-900">
          <CardCoverBanner
            banner={data.banner}
            theme={theme}
            isEnlarged
          />
        </div>
      </Lightbox>

      {/* QR Code Modal — only shown when parent does not override onQrCodeClick */}
      {!onQrCodeClick && (
        <QrCodeModal
          username={username}
          isOpen={isQrModalOpen}
          onClose={() => setIsQrModalOpen(false)}
        />
      )}
    </>
  )
}
