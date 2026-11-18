import type { PlatformType } from '../types'

export type PlatformCategory =
  | 'Professional & Career'
  | 'Developer & Programming'
  | 'Design & Creative'
  | 'Content & Publishing'
  | 'Academic & Research'
  | 'Social Media'
  | 'Communication'
  | 'Personal'

export interface PlatformConfig {
  id: PlatformType
  name: string
  category: PlatformCategory
  placeholder: string
  domainPrefix?: string
  description?: string
}

export const PLATFORM_CATALOG: PlatformConfig[] = [
  // 1. Professional & Career (3)
  {
    id: 'linkedin',
    name: 'LinkedIn',
    category: 'Professional & Career',
    placeholder: 'https://linkedin.com/in/username',
    domainPrefix: 'linkedin.com/in/',
  },
  {
    id: 'indeed',
    name: 'Indeed',
    category: 'Professional & Career',
    placeholder: 'https://profile.indeed.com/p/...',
  },
  {
    id: 'wuzzuf',
    name: 'Wuzzuf',
    category: 'Professional & Career',
    placeholder: 'https://wuzzuf.net/me/...',
  },

  // 2. Developer & Programming (5)
  {
    id: 'github',
    name: 'GitHub',
    category: 'Developer & Programming',
    placeholder: 'https://github.com/username',
    domainPrefix: 'github.com/',
  },
  {
    id: 'gitlab',
    name: 'GitLab',
    category: 'Developer & Programming',
    placeholder: 'https://gitlab.com/username',
  },
  {
    id: 'bitbucket',
    name: 'Bitbucket',
    category: 'Developer & Programming',
    placeholder: 'https://bitbucket.org/username',
  },
  {
    id: 'stackoverflow',
    name: 'Stack Overflow',
    category: 'Developer & Programming',
    placeholder: 'https://stackoverflow.com/users/...',
  },
  {
    id: 'codepen',
    name: 'CodePen',
    category: 'Developer & Programming',
    placeholder: 'https://codepen.io/username',
  },

  // 3. Design & Creative (3)
  {
    id: 'behance',
    name: 'Behance',
    category: 'Design & Creative',
    placeholder: 'https://behance.net/username',
  },
  {
    id: 'dribbble',
    name: 'Dribbble',
    category: 'Design & Creative',
    placeholder: 'https://dribbble.com/username',
  },
  {
    id: 'adobe-portfolio',
    name: 'Adobe Portfolio',
    category: 'Design & Creative',
    placeholder: 'https://username.myportfolio.com',
  },

  // 4. Content & Publishing (4)
  {
    id: 'youtube',
    name: 'YouTube',
    category: 'Content & Publishing',
    placeholder: 'https://youtube.com/@channel',
  },
  {
    id: 'medium',
    name: 'Medium',
    category: 'Content & Publishing',
    placeholder: 'https://medium.com/@username',
  },
  {
    id: 'devto',
    name: 'Dev.to',
    category: 'Content & Publishing',
    placeholder: 'https://dev.to/username',
  },
  {
    id: 'hashnode',
    name: 'Hashnode',
    category: 'Content & Publishing',
    placeholder: 'https://hashnode.com/@username',
  },

  // 5. Academic & Research (4)
  {
    id: 'google-scholar',
    name: 'Google Scholar',
    category: 'Academic & Research',
    placeholder: 'https://scholar.google.com/citations?user=...',
  },
  {
    id: 'researchgate',
    name: 'ResearchGate',
    category: 'Academic & Research',
    placeholder: 'https://researchgate.net/profile/...',
  },
  {
    id: 'orcid',
    name: 'ORCID',
    category: 'Academic & Research',
    placeholder: 'https://orcid.org/0000-0000-0000-0000',
  },
  {
    id: 'kaggle',
    name: 'Kaggle',
    category: 'Academic & Research',
    placeholder: 'https://kaggle.com/username',
  },

  // 6. Social Media (5)
  {
    id: 'facebook',
    name: 'Facebook',
    category: 'Social Media',
    placeholder: 'https://facebook.com/username',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    category: 'Social Media',
    placeholder: 'https://instagram.com/username',
  },
  {
    id: 'twitter',
    name: 'X (Twitter)',
    category: 'Social Media',
    placeholder: 'https://x.com/username',
  },
  {
    id: 'threads',
    name: 'Threads',
    category: 'Social Media',
    placeholder: 'https://threads.net/@username',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    category: 'Social Media',
    placeholder: 'https://tiktok.com/@username',
  },

  // 7. Communication (4)
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    category: 'Communication',
    placeholder: '+1234567890 or https://wa.me/...',
  },
  {
    id: 'telegram',
    name: 'Telegram',
    category: 'Communication',
    placeholder: 'https://t.me/username',
  },
  {
    id: 'discord',
    name: 'Discord',
    category: 'Communication',
    placeholder: 'https://discord.gg/... or discord.com/users/...',
  },
  {
    id: 'email',
    name: 'Email',
    category: 'Communication',
    placeholder: 'alex@example.com or mailto:alex@example.com',
  },

  // 8. Personal (3)
  {
    id: 'portfolio',
    name: 'Portfolio',
    category: 'Personal',
    placeholder: 'https://alex-portfolio.dev',
    description: 'Dedicated portfolio showcasing projects, skills, and work',
  },
  {
    id: 'personal-website',
    name: 'Personal Website',
    category: 'Personal',
    placeholder: 'https://alexmorgan.com',
    description: 'General personal or professional homepage',
  },
  {
    id: 'custom',
    name: 'Custom Link',
    category: 'Personal',
    placeholder: 'https://example.com/custom-link',
    description: 'Any external profile, publication, or service',
  },
]

export const PLATFORM_CATEGORIES: PlatformCategory[] = [
  'Professional & Career',
  'Developer & Programming',
  'Design & Creative',
  'Content & Publishing',
  'Academic & Research',
  'Social Media',
  'Communication',
  'Personal',
]

export function getPlatformConfig(platform: PlatformType): PlatformConfig {
  const found = PLATFORM_CATALOG.find((p) => p.id === platform)
  if (found) return found
  return {
    id: platform,
    name: platform,
    category: 'Personal',
    placeholder: 'https://...',
  }
}
