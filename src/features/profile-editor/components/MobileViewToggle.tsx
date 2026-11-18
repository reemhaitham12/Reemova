import { Edit3, Eye } from 'lucide-react'

export type MobileEditorView = 'edit' | 'preview'

interface MobileViewToggleProps {
  activeView: MobileEditorView
  onToggle: (view: MobileEditorView) => void
}

export function MobileViewToggle({ activeView, onToggle }: MobileViewToggleProps) {
  return (
    <div className="mb-4 flex items-center justify-center lg:hidden">
      <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1 shadow-2xs">
        <button
          type="button"
          onClick={() => onToggle('edit')}
          className={`flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-semibold transition-all ${
            activeView === 'edit'
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Edit3 className="h-3.5 w-3.5" />
          <span>Edit Details</span>
        </button>

        <button
          type="button"
          onClick={() => onToggle('preview')}
          className={`flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-semibold transition-all ${
            activeView === 'preview'
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Eye className="h-3.5 w-3.5" />
          <span>Live Preview</span>
        </button>
      </div>
    </div>
  )
}
