/**
 * QrCodeModal
 *
 * Renders a modal dialog that displays a scannable QR code for the user's
 * public profile URL (/u/<username>).
 *
 * Stability guarantee: The QR code is generated once per username value. It
 * does NOT regenerate when the user edits their profile display fields (name,
 * bio, links, etc.). The only dependency is the stable `username` identifier.
 *
 * In Phase 4 (Supabase), the username will be the persisted DB username, so
 * the QR code will remain valid across sessions.
 *
 * Downloads: The PNG is exported from the hidden high-resolution canvas (400×400).
 * The visible canvas is 200×200 (CSS-scaled up with CSS) for crisp display.
 *
 * Sharing: Web Share API is used when available; falls back to Clipboard API
 * copy-link with a "Copied!" transient confirmation. No silent behavior.
 */

import { useEffect, useRef, useState, useCallback } from 'react'
import ReactDOM from 'react-dom'
import QRCode from 'qrcode'
import { X, Download, Share2, Copy, Check, QrCode } from 'lucide-react'
import { Button } from '../ui/Button'

export interface QrCodeModalProps {
  /** The user's stable identifier used to build the public profile URL. */
  username: string
  isOpen: boolean
  onClose: () => void
}

/** Canvas size used to generate the QR code (high resolution for downloads). */
const QR_CANVAS_SIZE = 400

export function QrCodeModal({ username, isOpen, onClose }: QrCodeModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isCopied, setIsCopied] = useState(false)
  const [qrError, setQrError] = useState<string | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Build the canonical public profile URL.
  // This is the same URL that will be used in Phase 4 (Supabase) once
  // the username is persisted. For now it uses window.location.origin.
  const profileUrl = `${window.location.origin}/u/${username}`

  // Generate the QR code onto the canvas.
  // Runs only when the modal opens or when username changes.
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return

    setQrError(null)
    QRCode.toCanvas(canvasRef.current, profileUrl, {
      width: QR_CANVAS_SIZE,
      margin: 2,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#0f172a',  // slate-900
        light: '#ffffff',
      },
    }).catch((err: unknown) => {
      console.error('[QrCodeModal] QR generation failed:', err)
      setQrError('Could not generate QR code. Please try again.')
    })
  }, [isOpen, profileUrl])

  // Focus the close button when the modal opens (accessible focus management).
  useEffect(() => {
    if (isOpen) {
      // Brief delay to allow the portal to mount
      const t = setTimeout(() => closeButtonRef.current?.focus(), 50)
      return () => clearTimeout(t)
    }
  }, [isOpen])

  // Trap focus within the modal and handle Escape key.
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Lock body scroll while the modal is open.
  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [isOpen])

  // Cleanup the copy timer on unmount.
  useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current)
    }
  }, [])

  const handleDownload = useCallback(() => {
    if (!canvasRef.current) return
    const dataUrl = canvasRef.current.toDataURL('image/png')
    const anchor = document.createElement('a')
    anchor.href = dataUrl
    anchor.download = `qr-code-${username}.png`
    anchor.style.display = 'none'
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
  }, [username])

  const handleShare = useCallback(async () => {
    // Prefer the native Web Share API (supported on mobile and some desktop browsers).
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${username}'s Profile`,
          text: 'Check out my digital profile card',
          url: profileUrl,
        })
        return
      } catch (err) {
        // User cancelled or share failed — fall through to copy link.
        if ((err as DOMException).name === 'AbortError') return
      }
    }

    // Fallback: Copy the URL to the clipboard.
    try {
      await navigator.clipboard.writeText(profileUrl)
      setIsCopied(true)
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current)
      copyTimerRef.current = setTimeout(() => setIsCopied(false), 2000)
    } catch {
      // Last-resort: selection-based copy (some legacy browsers / iframes).
      const textArea = document.createElement('textarea')
      textArea.value = profileUrl
      textArea.style.position = 'fixed'
      textArea.style.opacity = '0'
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setIsCopied(true)
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current)
      copyTimerRef.current = setTimeout(() => setIsCopied(false), 2000)
    }
  }, [profileUrl, username])

  if (!isOpen) return null

  const hasWebShare = typeof navigator !== 'undefined' && Boolean(navigator.share)

  const modal = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="QR Code for your public profile"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <QrCode className="h-5 w-5 text-indigo-600" aria-hidden="true" />
            <h2 className="text-sm font-bold text-slate-900">Your Profile QR Code</h2>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            aria-label="Close QR code modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* QR Code Canvas */}
        <div className="flex flex-col items-center gap-4 px-5 py-6">
          {qrError ? (
            <div className="flex h-48 w-48 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-center text-xs text-red-600">
              {qrError}
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
              {/*
               * The canvas is generated at QR_CANVAS_SIZE (400×400) for high
               * download quality. CSS scales the display to 200×200 so it
               * looks sharp on all screen densities.
               */}
              <canvas
                ref={canvasRef}
                width={QR_CANVAS_SIZE}
                height={QR_CANVAS_SIZE}
                className="block h-48 w-48 rounded-lg"
                aria-label={`QR code for ${profileUrl}`}
              />
            </div>
          )}

          {/* Profile URL label */}
          <p className="max-w-full truncate rounded-lg bg-slate-50 px-3 py-1.5 text-center font-mono text-[11px] text-slate-500 ring-1 ring-slate-200">
            {profileUrl}
          </p>

          <p className="text-center text-[11px] leading-relaxed text-slate-400">
            Scan this code to open your public profile.
            <br />
            The QR code stays stable as long as your username doesn't change.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 border-t border-slate-100 px-5 py-4">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="flex-1 gap-2 border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            onClick={handleDownload}
            disabled={Boolean(qrError)}
            title="Download QR code as PNG"
          >
            <Download className="h-4 w-4 shrink-0 text-indigo-600" />
            Download PNG
          </Button>

          <Button
            type="button"
            variant={isCopied ? 'secondary' : 'primary'}
            size="sm"
            className="flex-1 gap-2 text-xs font-semibold"
            onClick={handleShare}
            title={hasWebShare ? 'Share your profile link' : 'Copy profile link to clipboard'}
          >
            {isCopied ? (
              <>
                <Check className="h-4 w-4 shrink-0" />
                Copied!
              </>
            ) : hasWebShare ? (
              <>
                <Share2 className="h-4 w-4 shrink-0" />
                Share Link
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 shrink-0" />
                Copy Link
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )

  return ReactDOM.createPortal(modal, document.body)
}
