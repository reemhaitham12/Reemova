import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { PublicProfileLayout } from './components/layout/PublicProfileLayout'
import { LandingPage } from './features/landing/pages/LandingPage'
import { LoginPage } from './features/auth/pages/LoginPage'
import { RegisterPage } from './features/auth/pages/RegisterPage'
import { DashboardPage } from './features/dashboard/pages/DashboardPage'
import { ProfileEditorPage } from './features/profile-editor/pages/ProfileEditorPage'
import { PublicProfilePage } from './features/public-profile/pages/PublicProfilePage'
import { Button } from './components/ui/Button'

function NotFoundPage() {
  return (
    <div className="flex min-h-[calc(100vh-12rem)] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-extrabold text-slate-900">404</h1>
      <p className="mt-2 text-base text-slate-600">The page you are looking for does not exist.</p>
      <Link to="/" className="mt-6">
        <Button size="sm">Return to Home</Button>
      </Link>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Application Routes */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/editor" element={<ProfileEditorPage />} />
        </Route>

        {/* Independent Public Profile Route */}
        <Route element={<PublicProfileLayout />}>
          <Route path="/u/:username" element={<PublicProfilePage />} />
        </Route>

        {/* Fallback 404 Route */}
        <Route element={<AppLayout />}>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
