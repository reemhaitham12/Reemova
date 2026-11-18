import { Link } from 'react-router-dom'
import { LayoutDashboard, Edit3, ExternalLink, QrCode, FileText } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'

export function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Top Banner */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            User Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Overview of your published profile and links
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/editor">
            <Button size="sm">
              <Edit3 className="h-4 w-4" />
              Edit Profile
            </Button>
          </Link>
          <Link to="/u/alex">
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4" />
              View Public Page
            </Button>
          </Link>
        </div>
      </div>

      {/* Status Cards */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Profile Status</p>
              <p className="text-lg font-semibold text-slate-900">Draft / Placeholder</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <QrCode className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Public Link</p>
              <p className="text-sm font-semibold text-indigo-600">/u/alex</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Attached CV</p>
              <p className="text-sm font-semibold text-slate-700">None uploaded</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Action Preview */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
          <CardDescription>
            You are viewing the Phase 1 application shell. Full data synchronization will be implemented in Phases 2 through 4.
          </CardDescription>
        </CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link to="/editor">
            <Button variant="secondary" size="sm">
              Launch Profile Editor Preview
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
