import { ExternalLink } from 'lucide-react'
import type { ProfileLink } from '../../types'
import { isCompleteLink, sanitizeUrl } from '../../utils/validators'
import { getPlatformBrandIcon } from '../icons/BrandIcons'

interface CardSocialLinksProps {
  links: ProfileLink[]
  accentColor?: string
}

export function CardSocialLinks({ links, accentColor = '#4f46e5' }: CardSocialLinksProps) {
  // Filter out any incomplete link drafts
  const validLinks = links.filter(isCompleteLink)

  if (validLinks.length === 0) {
    return null
  }

  // Sort by order
  const sortedLinks = [...validLinks].sort((a, b) => a.order - b.order)

  return (
    <div className="mt-6 space-y-2.5">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        Links & Profiles
      </h2>

      <div className="space-y-2">
        {sortedLinks.map((link) => {
          const safeHref = sanitizeUrl(link.url, link.platform)
          const isEmail = link.platform === 'email' || safeHref.startsWith('mailto:')
          const displayTitle = link.customLabel || link.title

          return (
            <a
              key={link.id}
              href={safeHref}
              target={isEmail ? undefined : '_blank'}
              rel={isEmail ? undefined : 'noopener noreferrer'}
              className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-600"
              title={displayTitle}
            >
              <div className="flex items-center gap-2.5">
                <span style={{ color: accentColor }}>
                  {getPlatformBrandIcon(link.platform, 'h-4 w-4')}
                </span>
                <span className="truncate max-w-[240px]">{displayTitle}</span>
              </div>
              <ExternalLink className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            </a>
          )
        })}
      </div>
    </div>
  )
}
