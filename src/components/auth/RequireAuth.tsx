/**
 * RequireAuth — route guard for protected pages.
 *
 * While the session is loading (initial app start), shows nothing.
 * If unauthenticated, redirects to /login with the intended destination preserved.
 * If authenticated, renders children.
 */

import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export function RequireAuth() {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    // Prevent flash of redirect while session is being restored
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}
