const CURRENT_YEAR = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white py-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
        <p className="text-xs text-slate-500">
          &copy; {CURRENT_YEAR} <span className="font-brand font-semibold text-slate-700">Reemova</span>. Your Professional Card, Made Easy.
        </p>
        <div className="flex gap-6 text-xs text-slate-500">
          <span className="font-medium text-slate-600">Phase 1: Foundation Baseline</span>
        </div>
      </div>
    </footer>
  )
}

