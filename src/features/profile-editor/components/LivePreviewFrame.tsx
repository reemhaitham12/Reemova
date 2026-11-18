import { Eye, Sparkles } from 'lucide-react'
import type { CardDisplayData } from '../../../types'
import { DigitalPersonalCard } from '../../../components/profile-card/DigitalPersonalCard'

interface LivePreviewFrameProps {
  cardData: CardDisplayData
  username?: string
  onDownloadCv?: () => void
  onViewCv?: () => void
}

export function LivePreviewFrame({
  cardData,
  username = 'alex',
  onDownloadCv,
  onViewCv,
}: LivePreviewFrameProps) {
  return (
    <div className="sticky top-20 flex flex-col items-center">
      {/* Frame Status Bar */}
      <div className="mb-3 flex w-full max-w-md items-center justify-between px-1">
        <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
          <Eye className="h-3.5 w-3.5 text-indigo-600" />
          Live Card Preview
        </span>

        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
          <Sparkles className="h-3 w-3 text-emerald-600" />
          <span>Live Sync Active</span>
        </span>
      </div>

      {/* Reusable Digital Personal Card */}
      <div className="w-full max-w-md">
        <DigitalPersonalCard
          data={cardData}
          username={username}
          onDownloadCv={onDownloadCv}
          onViewCv={onViewCv}
        />
      </div>

      {/* Frame Sub-label */}
      <p className="mt-3 text-center text-[11px] text-slate-400">
        Changes in the editor reflect here immediately in real-time.
      </p>
    </div>
  )
}
