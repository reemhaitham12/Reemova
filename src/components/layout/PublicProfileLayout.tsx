import { Outlet, Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'

export function PublicProfileLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="py-6 text-center">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-600 shadow-xs transition hover:border-indigo-300 hover:text-indigo-600"
        >
          <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
          <span>Powered by <strong className="font-brand font-semibold text-slate-800">Reemova</strong> &bull; Create your card</span>
        </Link>
      </footer>
    </div>
  )
}
