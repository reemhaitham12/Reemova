import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { DigitalPersonalCard } from '../../../components/profile-card/DigitalPersonalCard'
import { THEME_PRESETS, type CardDisplayData } from '../../../types'

export function PublicProfilePage() {
  const { username = 'alex' } = useParams<{ username: string }>()

  // Sample static data for public profile preview
  const profileData: CardDisplayData = {
    fullName: username === 'alex' ? 'Alex Morgan' : `@${username}`,
    title: 'Full-Stack Software Engineer',
    bio: 'Building accessible, high-performance web products with React, TypeScript, and modern backend architectures.',
    avatarUrl: null,
    theme: {
      presetId: 'modern-indigo',
      colors: THEME_PRESETS['modern-indigo'],
    },
    cv: null,
    links: [
      {
        id: 'link-1',
        platform: 'github',
        title: 'GitHub',
        url: 'https://github.com',
        order: 1,
      },
      {
        id: 'link-2',
        platform: 'linkedin',
        title: 'LinkedIn',
        url: 'https://linkedin.com',
        order: 2,
      },
      {
        id: 'link-3',
        platform: 'email',
        title: 'Contact Email',
        url: 'mailto:alex@example.com',
        order: 3,
      },
    ],
  }

  return (
    <div className="flex min-h-[calc(100vh-10rem)] flex-col items-center justify-center px-4 py-12">
      {/* Back navigation */}
      <div className="mb-6 w-full max-w-md">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to <span className="font-brand font-semibold">Reemova</span></span>
        </Link>
      </div>

      {/* Reusable Profile Card Component */}
      <DigitalPersonalCard data={profileData} username={username} />
    </div>
  )
}
