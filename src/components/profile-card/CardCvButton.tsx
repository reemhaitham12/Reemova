import { Eye } from 'lucide-react'
import type { CardCvDisplay } from '../../types'
import { Button } from '../ui/Button'

interface CardCvButtonProps {
  cv?: CardCvDisplay | null
  accentColor?: string
  /** Used in editor context where a local File object is held in memory. */
  onViewCv?: () => void
}

export function CardCvButton({
  cv,
  accentColor = '#4f46e5',
  onViewCv,
}: CardCvButtonProps) {
  // If no CV is attached, do not render anything
  if (!cv) {
    return null
  }

  const handleViewClick = () => {
    if (onViewCv) {
      onViewCv()
      return
    }

    // Public profile with a real persistent remote URL — open in a new tab
    if (cv.fileUrl) {
      window.open(cv.fileUrl, '_blank')
    }
  }

  // Only show the button when there is a real way to view/open the CV
  const hasViewCapability = Boolean(onViewCv || cv.fileUrl)

  if (!hasViewCapability) {
    return null
  }

  return (
    <div className="mt-5">
      <Button
        type="button"
        variant="secondary"
        size="md"
        className="w-full gap-2 border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        onClick={handleViewClick}
        title={`View ${cv.fileName || 'CV'}`}
      >
        <Eye className="h-4 w-4 shrink-0" style={{ color: accentColor }} />
        <span className="truncate">View CV</span>
      </Button>
    </div>
  )
}
