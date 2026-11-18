import { Link } from 'react-router-dom'
import { LogIn } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'

export function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
            <LogIn className="h-6 w-6" />
          </div>
          <CardTitle className="mt-4 text-2xl">Welcome back</CardTitle>
          <CardDescription>
            Sign in to manage and edit your profile
          </CardDescription>
        </CardHeader>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
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
            <strong>Phase 1 Preview:</strong> Authentication will be activated in Phase 4 when Supabase is integrated.
          </div>

          <Button type="button" disabled className="w-full">
            Log In (Disabled in Phase 1)
          </Button>

          <p className="text-center text-xs text-slate-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Create an account
            </Link>
          </p>
        </form>
      </Card>
    </div>
  )
}
