import React from 'react'
import type { PlatformType } from '../../types'
import {
  Code2,
  Globe,
  Mail,
  MessageCircle,
  Briefcase,
  BookOpen,
  FileText,
  Video,
  AtSign,
  GraduationCap,
  Microscope,
  Award,
  Link2,
} from 'lucide-react'

interface BrandIconProps {
  className?: string
  style?: React.CSSProperties
}

// Custom inline SVG icons for platforms with specific branding
export function LinkedInIcon({ className = 'h-4 w-4', style }: BrandIconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2m1.4 9.74v-8.37H5.06v8.37h2.8z" />
    </svg>
  )
}

export function GitHubIcon({ className = 'h-4 w-4', style }: BrandIconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}

export function GitLabIcon({ className = 'h-4 w-4', style }: BrandIconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="m22.65 14.39-8.32-8.33a2.3 2.3 0 0 0-3.26 0L2.75 14.39a1.15 1.15 0 0 0-.1.28L1.13 20.3a.6.6 0 0 0 .76.71l5.48-1.85 4.35 2.5a.61.61 0 0 0 .56 0l4.35-2.5 5.48 1.85a.6.6 0 0 0 .76-.71l-1.52-5.63a1.15 1.15 0 0 0-.7-.73z" />
    </svg>
  )
}

export function StackOverflowIcon({ className = 'h-4 w-4', style }: BrandIconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.986 21.865v-6.404h2.134V24H1.84v-8.539h2.133v6.404h15.013zM6.111 19.731H16.8v-2.134H6.111v2.134zm.256-4.661l10.373 2.164.44-2.088-10.373-2.164-.44 2.088zm1.536-4.646l9.539 4.793.955-1.9-9.539-4.793-.955 1.9zm3.504-4.512l7.747 7.378 1.468-1.542-7.747-7.378-1.468 1.542zm5.795-5.912l-1.848 1.066 5.568 9.155 1.848-1.066-5.568-9.155z" />
    </svg>
  )
}

export function TwitterIcon({ className = 'h-4 w-4', style }: BrandIconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

export function FacebookIcon({ className = 'h-4 w-4', style }: BrandIconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

export function InstagramIcon({ className = 'h-4 w-4', style }: BrandIconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

export function YouTubeIcon({ className = 'h-4 w-4', style }: BrandIconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

export function BehanceIcon({ className = 'h-4 w-4', style }: BrandIconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22 7h-7v2h7V7zm1.726 10c-.442 1.297-2.029 3-4.971 3-3.469 0-5.5-2.64-5.5-5.69 0-3.18 2.05-5.31 5.38-5.31 3.57 0 5.179 2.58 4.979 6H16.2c.07 1.54 1.11 2.45 2.61 2.45 1.11 0 1.95-.56 2.24-1.45h2.676zM16.2 13h4.63c-.15-1.44-1.04-2.1-2.28-2.1-1.39 0-2.24.78-2.35 2.1zM8.34 11.23c.89-.48 1.41-1.33 1.41-2.43 0-2.06-1.55-3.8-4.25-3.8H0v14h5.75c3.08 0 4.75-1.84 4.75-4.22 0-1.63-.83-2.92-2.16-3.55zm-5.34-4.2h2.55c1.32 0 2.04.75 2.04 1.83 0 1.17-.8 1.95-2.08 1.95H3V7.03zm2.75 9.97H3v-4.14h2.85c1.47 0 2.3.83 2.3 2.1 0 1.22-.84 2.04-2.4 2.04z" />
    </svg>
  )
}

export function DribbbleIcon({ className = 'h-4 w-4', style }: BrandIconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 0 1 1.93 5.312c-.405-.08-2.155-.41-4.25-.19-.115-.27-.24-.54-.375-.81a17.38 17.38 0 0 0 2.695-4.312zm-3.95-1.545a15.42 15.42 0 0 1-2.49 4.025c-2.31-.76-4.59-.96-4.99-.99a8.61 8.61 0 0 1 7.48-3.035zM5.385 7.43c.41.03 2.51.21 4.7 1.01-1.04 2.76-2.22 5.37-2.43 5.82a8.536 8.536 0 0 1-2.27-6.83zm2.14 8.79c.2-.44 1.35-2.97 2.4-5.71 1.88.22 3.8.54 4.19.61-.41 1.14-.94 2.44-1.59 3.75-2.09.9-3.94 1.27-5 1.35zm6.575 1.46c.64-1.28 1.16-2.54 1.56-3.66 1.76-.14 3.3.16 3.65.23a8.53 8.53 0 0 1-5.21 3.43zm-2.02 1.05c1.07-.12 2.76-.51 4.7-1.39a19.46 19.46 0 0 1-1.36 2.37 8.53 8.53 0 0 1-3.34-.98z" />
    </svg>
  )
}

export function TelegramIcon({ className = 'h-4 w-4', style }: BrandIconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
    </svg>
  )
}

export function DiscordIcon({ className = 'h-4 w-4', style }: BrandIconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  )
}

/**
 * Returns the exact brand or recognizable platform icon for all 31 platforms.
 */
export function getPlatformBrandIcon(platform: PlatformType, className = 'h-4 w-4', style?: React.CSSProperties) {
  switch (platform) {
    // 1. Professional & Career
    case 'linkedin':
      return <LinkedInIcon className={className} style={style} />
    case 'indeed':
      return <Briefcase className={className} style={style} />
    case 'wuzzuf':
      return <Briefcase className={className} style={style} />

    // 2. Developer & Programming
    case 'github':
      return <GitHubIcon className={className} style={style} />
    case 'gitlab':
      return <GitLabIcon className={className} style={style} />
    case 'bitbucket':
      return <Code2 className={className} style={style} />
    case 'stackoverflow':
      return <StackOverflowIcon className={className} style={style} />
    case 'codepen':
      return <Code2 className={className} style={style} />

    // 3. Design & Creative
    case 'behance':
      return <BehanceIcon className={className} style={style} />
    case 'dribbble':
      return <DribbbleIcon className={className} style={style} />
    case 'adobe-portfolio':
      return <Briefcase className={className} style={style} />

    // 4. Content & Publishing
    case 'youtube':
      return <YouTubeIcon className={className} style={style} />
    case 'medium':
      return <BookOpen className={className} style={style} />
    case 'devto':
      return <Code2 className={className} style={style} />
    case 'hashnode':
      return <FileText className={className} style={style} />

    // 5. Academic & Research
    case 'google-scholar':
      return <GraduationCap className={className} style={style} />
    case 'researchgate':
      return <Microscope className={className} style={style} />
    case 'orcid':
      return <Award className={className} style={style} />
    case 'kaggle':
      return <Code2 className={className} style={style} />

    // 6. Social Media
    case 'facebook':
      return <FacebookIcon className={className} style={style} />
    case 'instagram':
      return <InstagramIcon className={className} style={style} />
    case 'twitter':
      return <TwitterIcon className={className} style={style} />
    case 'threads':
      return <AtSign className={className} style={style} />
    case 'tiktok':
      return <Video className={className} style={style} />

    // 7. Communication
    case 'whatsapp':
      return <MessageCircle className={className} style={style} />
    case 'telegram':
      return <TelegramIcon className={className} style={style} />
    case 'discord':
      return <DiscordIcon className={className} style={style} />
    case 'email':
      return <Mail className={className} style={style} />

    // 8. Personal (Portfolio has briefcase/portfolio icon; Personal Website has globe)
    case 'portfolio':
      return <Briefcase className={className} style={style} />
    case 'personal-website':
      return <Globe className={className} style={style} />
    case 'custom':
    default:
      return <Link2 className={className} style={style} />
  }
}
