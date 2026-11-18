import { useState, useRef, useEffect, useCallback, type PointerEvent } from 'react'
import { ZoomIn, ZoomOut, Check, X, Move } from 'lucide-react'
import { Button } from '../../../components/ui/Button'

export interface ImageCropModalProps {
  imageFile: File | null
  isOpen: boolean
  onConfirm: (croppedBlob: Blob) => void
  onCancel: () => void
}

export function ImageCropModal({
  imageFile,
  isOpen,
  onConfirm,
  onCancel,
}: ImageCropModalProps) {
  const [zoom, setZoom] = useState<number>(1.2)
  const [panX, setPanX] = useState<number>(0) // offset in px
  const [panY, setPanY] = useState<number>(0) // offset in px
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [initialPan, setInitialPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imageLoaded, setImageLoaded] = useState<boolean>(false)
  const imageElementRef = useRef<HTMLImageElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  // Load image when file changes
  useEffect(() => {
    if (!imageFile || !isOpen) {
      return
    }

    const url = URL.createObjectURL(imageFile)
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = url
    img.onload = () => {
      imageElementRef.current = img
      setImageUrl(url)
      setImageLoaded(true)
      setZoom(1.2)
      setPanX(0)
      setPanY(0)
    }

    return () => {
      URL.revokeObjectURL(url)
      imageElementRef.current = null
    }
  }, [imageFile, isOpen])

  // Drag handlers
  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
    setInitialPan({ x: panX, y: panY })
  }

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return
    const dx = e.clientX - dragStart.x
    const dy = e.clientY - dragStart.y
    setPanX(initialPan.x + dx)
    setPanY(initialPan.y + dy)
  }

  const handlePointerUp = () => {
    setIsDragging(false)
  }

  // Draw crop output to an offscreen canvas and export blob
  const handleApplyCrop = useCallback(() => {
    const img = imageElementRef.current
    if (!img) return

    const exportSize = 320 // 320x320 px avatar output
    const canvas = document.createElement('canvas')
    canvas.width = exportSize
    canvas.height = exportSize
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Fill background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, exportSize, exportSize)

    // Calculate scaling to cover crop box (crop box is 240px wide in UI)
    const previewBoxSize = 240
    const scaleFactor = exportSize / previewBoxSize

    // Base dimensions fitting into 240px box
    const minDim = Math.min(img.naturalWidth, img.naturalHeight)
    const baseScale = (previewBoxSize / minDim) * zoom
    const drawWidth = img.naturalWidth * baseScale * scaleFactor
    const drawHeight = img.naturalHeight * baseScale * scaleFactor

    const drawX = exportSize / 2 - drawWidth / 2 + panX * scaleFactor
    const drawY = exportSize / 2 - drawHeight / 2 + panY * scaleFactor

    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight)

    canvas.toBlob(
      (blob) => {
        if (blob) {
          onConfirm(blob)
        }
      },
      'image/jpeg',
      0.92
    )
  }, [panX, panY, zoom, onConfirm])

  if (!isOpen || !imageFile) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="crop-modal-title"
    >
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 id="crop-modal-title" className="text-base font-bold text-slate-900">
              Adjust Profile Photo
            </h3>
            <p className="text-xs text-slate-500">
              Drag to reposition, use slider to zoom, and frame inside the square.
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Crop Viewport */}
        <div className="mt-4 flex flex-col items-center">
          <div
            className="relative h-60 w-60 shrink-0 aspect-square overflow-hidden rounded-[12px] bg-slate-900 shadow-inner select-none cursor-grab active:cursor-grabbing border-2 border-slate-200"
            style={{ aspectRatio: '1 / 1', borderRadius: '12px' }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            {/* Background Image Being Panned / Zoomed */}
            {imageUrl && imageLoaded && (
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{
                  transform: `translate(${panX}px, ${panY}px)`,
                }}
              >
                <img
                  src={imageUrl}
                  alt="Crop Target"
                  className="max-w-none transition-none select-none"
                  style={{
                    transform: `scale(${zoom})`,
                    transformOrigin: 'center center',
                    maxHeight: '240px',
                    maxWidth: '240px',
                    objectFit: 'contain',
                  }}
                  draggable={false}
                />
              </div>
            )}

            {/* Square Avatar Mask Overlay */}
            <div
              className="pointer-events-none absolute inset-0 rounded-[12px] border-4 border-indigo-500/80 shadow-[0_0_0_9999px_rgba(15,23,42,0.65)]"
              style={{ borderRadius: '12px' }}
              aria-hidden="true"
            />

            {/* Pan Hint */}
            <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full bg-slate-950/70 px-2.5 py-0.5 text-[10px] font-medium text-slate-200 backdrop-blur-xs">
              <Move className="h-3 w-3" />
              <span>Drag to move</span>
            </div>
          </div>
        </div>

        {/* Zoom Slider Control */}
        <div className="mt-5 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span className="flex items-center gap-1">
              <ZoomOut className="h-3.5 w-3.5 text-slate-400" />
              <span>Zoom</span>
            </span>
            <span className="font-mono text-slate-500">{(zoom * 100).toFixed(0)}%</span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-indigo-600 focus:outline-hidden"
              aria-label="Avatar Zoom Level"
            />
            <ZoomIn className="h-4 w-4 text-slate-400 shrink-0" />
          </div>
        </div>

        {/* Position Fine-Tuning Controls (Sliders for accessibility) */}
        <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">
              Horizontal: {panX}px
            </label>
            <input
              type="range"
              min={-100}
              max={100}
              value={panX}
              onChange={(e) => setPanX(parseInt(e.target.value, 10))}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-indigo-600"
              aria-label="Avatar Horizontal Pan"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">
              Vertical: {panY}px
            </label>
            <input
              type="range"
              min={-100}
              max={100}
              value={panY}
              onChange={(e) => setPanY(parseInt(e.target.value, 10))}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-indigo-600"
              aria-label="Avatar Vertical Pan"
            />
          </div>
        </div>

        {/* Hidden Canvas for Export */}
        <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

        {/* Actions Row */}
        <div className="mt-6 flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            className="gap-1.5"
            onClick={handleApplyCrop}
            disabled={!imageLoaded}
          >
            <Check className="h-4 w-4" />
            <span>Apply Crop</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
