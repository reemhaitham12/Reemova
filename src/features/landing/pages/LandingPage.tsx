import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Sparkles,
  ArrowRight,
  UserCheck,
  QrCode,
  FileText,
  Palette,
  Download,
  ExternalLink,
  Globe,
  Link2,
  Mail,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'

interface DemoTheme {
  id: string
  name: string
  bannerClass: string
  accentColor: string
  badgeClass: string
  buttonClass: string
  avatarBorder: string
}

const DEMO_THEMES: DemoTheme[] = [
  {
    id: 'indigo',
    name: 'Modern Indigo',
    bannerClass: 'from-indigo-600 via-indigo-500 to-purple-600',
    accentColor: 'text-indigo-600',
    badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    buttonClass: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    avatarBorder: 'border-indigo-100',
  },
  {
    id: 'emerald',
    name: 'Emerald Tech',
    bannerClass: 'from-emerald-600 via-teal-500 to-cyan-600',
    accentColor: 'text-emerald-600',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    buttonClass: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    avatarBorder: 'border-emerald-100',
  },
  {
    id: 'slate',
    name: 'Minimal Dark',
    bannerClass: 'from-slate-800 via-slate-700 to-zinc-900',
    accentColor: 'text-slate-900',
    badgeClass: 'bg-slate-100 text-slate-800 border-slate-300',
    buttonClass: 'bg-slate-900 hover:bg-slate-800 text-white',
    avatarBorder: 'border-slate-200',
  },
  {
    id: 'sunset',
    name: 'Sunset Coral',
    bannerClass: 'from-amber-500 via-orange-500 to-rose-500',
    accentColor: 'text-rose-600',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    buttonClass: 'bg-rose-600 hover:bg-rose-700 text-white',
    avatarBorder: 'border-rose-100',
  },
]

export function LandingPage() {
  const [selectedTheme, setSelectedTheme] = useState<DemoTheme>(DEMO_THEMES[0])

  const scrollToDemo = () => {
    const demoElement = document.getElementById('live-demo')
    if (demoElement) {
      demoElement.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const highlights = [
    {
      icon: <UserCheck className="h-6 w-6 text-indigo-600" />,
      title: 'Digital Personal Card',
      description: 'Your bio, title, and identity unified in a sleek, responsive card design.',
    },
    {
      icon: <FileText className="h-6 w-6 text-indigo-600" />,
      title: 'CV & Resume Download',
      description: 'Provide visitors and recruiters with instant one-click access to your verified PDF CV.',
    },
    {
      icon: <Palette className="h-6 w-6 text-indigo-600" />,
      title: 'Real-Time Customization',
      description: 'Personalize card colors, accent tones, and links with instant live preview.',
    },
    {
      icon: <QrCode className="h-6 w-6 text-indigo-600" />,
      title: 'Shareable Link & QR',
      description: 'Share your card via a clean /u/username URL and scannable QR code.',
    },
  ]

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-20 lg:px-8">
      {/* Hero Section */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
          <Sparkles className="h-3.5 w-3.5" />
          <span><span className="font-brand font-bold">Reemova</span> Digital Personal Cards</span>
        </div>

        {/* Main Tagline */}
        <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
          Your Professional Card, <br className="hidden sm:inline" />
          <span className="text-indigo-600">Made Easy.</span>
        </h1>

        {/* Supporting Message */}
        <p className="mx-auto mt-4 max-w-2xl text-lg font-medium text-slate-800 sm:text-xl">
          Create your personal card. Customize it. Share it.
        </p>

        {/* Explanation */}
        <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
          <span className="font-brand font-semibold text-slate-800">Reemova</span> helps students, fresh graduates, and developers build clean digital personal cards.
          Showcase your headline, bio, portfolio links, and PDF resume behind one memorable link and QR code.
        </p>

        {/* Hero Actions */}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/register">
            <Button size="lg" className="w-full sm:w-auto">
              Create Your Card
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={scrollToDemo}
            className="w-full sm:w-auto"
          >
            View Live Demo
          </Button>
        </div>
      </div>

      {/* Live Demo Section */}
      <section id="live-demo" className="mt-20 scroll-mt-24">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-0.5 text-xs font-semibold text-amber-800">
              Interactive Demo Showcase
            </span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Experience the <span className="font-brand font-bold text-indigo-600">Reemova</span> Personal Card
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">
              This is a live interactive simulation of a published card. Click the style presets below to test instant customization.
            </p>

            {/* Interactive Theme Switcher */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs font-medium text-slate-500">Theme Preset:</span>
              {DEMO_THEMES.map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setSelectedTheme(theme)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                    selectedTheme.id === theme.id
                      ? `${theme.badgeClass} ring-2 ring-indigo-500 ring-offset-1 font-semibold`
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {selectedTheme.id === theme.id && <CheckCircle2 className="h-3.5 w-3.5" />}
                  {theme.name}
                </button>
              ))}
            </div>
          </div>

          {/* Realistic Demo Card */}
          <div className="mt-10 flex justify-center">
            <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl transition-all duration-300">
              {/* Dynamic Theme Banner */}
              <div
                className={`h-28 bg-gradient-to-r ${selectedTheme.bannerClass} transition-colors duration-300`}
              />

              <div className="relative px-6 pb-6">
                {/* Header row with Avatar and QR pill */}
                <div className="-mt-14 mb-4 flex items-end justify-between">
                  <div
                    className={`flex h-24 w-24 shrink-0 aspect-square items-center justify-center overflow-hidden rounded-[12px] border-4 border-white bg-slate-900 text-2xl font-bold text-white shadow-md ring-2 ${selectedTheme.avatarBorder}`}
                    style={{ aspectRatio: '1 / 1', borderRadius: '12px' }}
                  >
                    SL
                  </div>
                  <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 shadow-xs">
                    <QrCode className="h-3.5 w-3.5 text-slate-500" />
                    <span>reemova.me/u/sara</span>
                  </div>
                </div>

                {/* Profile Information */}
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-slate-900">Sara Lin</h3>
                    <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-700">
                      Demo Profile
                    </span>
                  </div>
                  <p className={`text-sm font-medium ${selectedTheme.accentColor}`}>
                    Frontend Engineer & UI Specialist
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    Crafting accessible, high-performance web interfaces and design systems. CS graduate passionate about modern TypeScript, React, and UX architecture.
                  </p>
                </div>

                {/* CV Download Simulation Button */}
                <div className="mt-5">
                  <button
                    type="button"
                    onClick={() =>
                      alert('Demo Notice: This is a preview simulation. Full CV upload and downloads will be enabled in Phase 5.')
                    }
                    className={`flex w-full items-center justify-center gap-2 rounded-lg py-2.5 px-4 text-xs font-semibold shadow-xs transition-colors ${selectedTheme.buttonClass}`}
                  >
                    <Download className="h-4 w-4" />
                    Download Resume / CV (PDF)
                  </button>
                </div>

                {/* Social & Contact Links */}
                <div className="mt-5 space-y-2">
                  <p className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                    Connect & Portfolio
                  </p>
                  <div className="flex flex-col gap-2">
                    <a
                      href="https://github.com"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                    >
                      <span className="flex items-center gap-2">
                        <Link2 className="h-3.5 w-3.5 text-slate-500" />
                        github.com/saralin-dev
                      </span>
                      <ExternalLink className="h-3 w-3 text-slate-400" />
                    </a>
                    <a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                    >
                      <span className="flex items-center gap-2">
                        <Globe className="h-3.5 w-3.5 text-slate-500" />
                        linkedin.com/in/saralin
                      </span>
                      <ExternalLink className="h-3 w-3 text-slate-400" />
                    </a>
                    <a
                      href="mailto:sara@example.com"
                      className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                    >
                      <span className="flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5 text-slate-500" />
                        sara@example.com
                      </span>
                      <ExternalLink className="h-3 w-3 text-slate-400" />
                    </a>
                  </div>
                </div>

                {/* Disclaimer pill */}
                <div className="mt-5 rounded-lg border border-dashed border-slate-200 bg-slate-50/70 p-2 text-center text-[11px] text-slate-500">
                  Interactive preview only &bull; Not a published user account
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="mt-16">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((item, idx) => (
            <Card key={idx} className="flex flex-col items-start p-5 transition-shadow hover:shadow-md">
              <div className="rounded-lg bg-indigo-50 p-2.5">{item.icon}</div>
              <h3 className="mt-4 font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-1 text-sm text-slate-500">{item.description}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
