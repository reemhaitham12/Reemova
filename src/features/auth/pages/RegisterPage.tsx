import { Link } from 'react-router-dom'
import { UserPlus } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'

export function RegisterPage() {
  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
            <UserPlus className="h-6 w-6" />
          </div>
          <CardTitle className="mt-4 text-2xl">Create your account</CardTitle>
          <CardDescription>
            Claim your personal handle and publish your profile
          </CardDescription>
        </CardHeader>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Desired Username</label>
            <div className="mt-1 flex rounded-lg shadow-sm">
              <span className="inline-flex items-center rounded-l-lg border border-r-0 border-slate-300 bg-slate-100 px-3 text-xs text-slate-500">
                /u/
              </span>
              <input
                type="text"
                disabled
                placeholder="alex"
                className="w-full rounded-r-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-500 placeholder-slate-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Email Address</label>
            <input
              type="email"
              disabled
              placeholder="you@example.com"
              className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-500 placeholder-slate-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              disabled
              placeholder="••••••••"
              className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-500 placeholder-slate-400 focus:outline-none"
            />
          </div>

          <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
            <strong>Phase 1 Preview:</strong> Account registration will be wired to Supabase Auth in Phase 4.
          </div>

          <Button type="button" disabled className="w-full">
            Register (Disabled in Phase 1)
          </Button>

          <p className="text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Sign In
            </Link>
          </p>
        </form>
      </Card>
    </div>
  )
}
