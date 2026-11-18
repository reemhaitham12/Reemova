import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

export interface LightboxProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  title?: string
  triggerRef?: React.RefObject<HTMLElement | null>
}

export function Lightbox({
  isOpen,
  onClose,
  children,
  title = 'Enlarged Preview',
  triggerRef,
}: LightboxProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const prevFocusedElementRef = useRef<HTMLElement | null>(null)

  // 1. Focus capture & restoration + Scroll lock
  useEffect(() => {
    if (!isOpen) return

    // Save previous active element for restoration
    prevFocusedElementRef.current = (document.activeElement as HTMLElement) || triggerRef?.current || null

    // Lock background scroll
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // Focus close button initially
    const timer = setTimeout(() => {
      closeButtonRef.current?.focus()
    }, 50)

    return () => {
      clearTimeout(timer)
      document.body.style.overflow = originalOverflow

      // Restore focus to triggering element
      if (prevFocusedElementRef.current && typeof prevFocusedElementRef.current.focus === 'function') {
        prevFocusedElementRef.current.focus()
      }
    }
  }, [isOpen, triggerRef])

  // 2. Keyboard listeners: Escape to close & Tab focus trap
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }

      if (e.key === 'Tab') {
        if (!overlayRef.current) return
        const focusableElements = overlayRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (focusableElements.length === 0) return

        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement.focus()
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement.focus()
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  // Ensure click on backdrop closes, but click inside content does not
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) {
      onClose()
    }
  }

  return createPortal(
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 sm:p-6 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="relative flex max-h-[90vh] max-w-4xl flex-col items-center justify-center">
        {/* Floating Close Button */}
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          className="absolute -top-12 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 focus:outline-hidden focus:ring-2 focus:ring-white transition-all cursor-pointer"
          aria-label="Close enlarged preview"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Lightbox Content Container */}
        <div className="overflow-hidden rounded-2xl shadow-2xl transition-all">
          {children}
        </div>
      </div>
    </div>,
    document.body
  )
}
