import { useState, useRef, type ChangeEvent } from 'react'
import {
  Palette,
  Sparkles,
  Upload,
  Trash2,
  ZoomIn,
  Sliders,
  Check,
  Image as ImageIcon,
} from 'lucide-react'
import type { CoverBannerConfig, CoverBannerType } from '../../../types'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { isValidHexColor } from '../../../utils/validators'

export interface CoverBannerFormProps {
  banner?: CoverBannerConfig
  errors: Record<string, string>
  onSetType: (type: CoverBannerType) => void
  onSetSolidColor: (hex: string) => { success: boolean; error?: string }
  onSetGradient: (start: string, end: string) => void
  onSelectImage: (file: File) => { success: boolean; error?: string }
  onUpdateTransform: (options: {
    positionX?: number
    positionY?: number
    zoom?: number
    overlayOpacity?: number
    overlayColor?: string
  }) => void
  onRemoveImage: () => void
}

const BANNER_GRADIENT_PRESETS = [
  { id: 'modern-indigo', label: 'Modern Indigo', start: '#4f46e5', end: '#7c3aed' },
  { id: 'emerald-tech', label: 'Emerald Tech', start: '#059669', end: '#0d9488' },
  { id: 'minimal-dark', label: 'Minimal Dark', start: '#1e293b', end: '#0f172a' },
  { id: 'sunset-coral', label: 'Sunset Coral', start: '#f59e0b', end: '#e11d48' },
  { id: 'ocean-blue', label: 'Ocean Blue', start: '#0284c7', end: '#2563eb' },
  { id: 'royal-violet', label: 'Royal Violet', start: '#7c3aed', end: '#c026d3' },
  { id: 'cyber-amber', label: 'Cyber Amber', start: '#d97706', end: '#b45309' },
]

const SOLID_SWATCHES = [
  '#4f46e5',
  '#059669',
  '#0f172a',
  '#e11d48',
  '#0284c7',
  '#7c3aed',
  '#d97706',
  '#334155',
  '#10b981',
  '#ec4899',
]

export function CoverBannerForm({
  banner,
  errors,
  onSetType,
  onSetSolidColor,
  onSetGradient,
  onSelectImage,
  onUpdateTransform,
  onRemoveImage,
}: CoverBannerFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const bannerType: CoverBannerType = banner?.type || 'gradient'

  // Local state for hex input to allow smooth typing before blur/commit
  const currentSolidHex = banner?.solidColor || '#4f46e5'
  const [hexInput, setHexInput] = useState<string>(currentSolidHex)
  const [hexError, setHexError] = useState<string>('')

  const handleHexChange = (val: string) => {
    setHexInput(val)
    if (isValidHexColor(val)) {
      setHexError('')
      onSetSolidColor(val)
    } else {
      setHexError('Please enter a valid HEX color code (e.g. #4f46e5)')
    }
  }

  const handleSwatchClick = (hex: string) => {
    setHexInput(hex)
    setHexError('')
    onSetSolidColor(hex)
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onSelectImage(file)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-6">
      {/* Mode Selector Tabs */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
          Banner Style Mode
        </label>
        <div className="grid grid-cols-3 gap-2 rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => onSetType('gradient')}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all ${
              bannerType === 'gradient'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Gradient</span>
          </button>

          <button
            type="button"
            onClick={() => onSetType('solid')}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all ${
              bannerType === 'solid'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Palette className="h-3.5 w-3.5" />
            <span>Solid Color</span>
          </button>

          <button
            type="button"
            onClick={() => onSetType('image')}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all ${
              bannerType === 'image'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ImageIcon className="h-3.5 w-3.5" />
            <span>Image</span>
          </button>
        </div>
      </div>

      {/* Mode A: Gradient Presets */}
      {bannerType === 'gradient' && (
        <div className="space-y-4">
          <div>
            <span className="block text-xs font-semibold text-slate-700 mb-2">
              Gradient Presets
            </span>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {BANNER_GRADIENT_PRESETS.map((preset) => {
                const isSelected =
                  banner?.gradientStart === preset.start && banner?.gradientEnd === preset.end

                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => onSetGradient(preset.start, preset.end)}
                    className={`flex items-center justify-between rounded-xl border p-2.5 text-left text-xs font-medium transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/40 text-indigo-900 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="h-7 w-12 rounded-md shadow-inner border border-black/10"
                        style={{
                          background: `linear-gradient(135deg, ${preset.start}, ${preset.end})`,
                        }}
                      />
                      <span>{preset.label}</span>
                    </div>
                    {isSelected && <Check className="h-4 w-4 text-indigo-600" />}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Mode B: Solid Color */}
      {bannerType === 'solid' && (
        <div className="space-y-4">
          <div>
            <span className="block text-xs font-semibold text-slate-700 mb-2">
              Choose Color Swatch
            </span>
            <div className="flex flex-wrap gap-2">
              {SOLID_SWATCHES.map((swatch) => {
                const isSelected =
                  banner?.solidColor?.toLowerCase() === swatch.toLowerCase()
                return (
                  <button
                    key={swatch}
                    type="button"
                    onClick={() => handleSwatchClick(swatch)}
                    className={`relative h-8 w-8 rounded-lg border transition-transform ${
                      isSelected
                        ? 'scale-110 border-slate-900 shadow-md ring-2 ring-indigo-500/50'
                        : 'border-black/10 hover:scale-105'
                    }`}
                    style={{ backgroundColor: swatch }}
                    aria-label={`Select color ${swatch}`}
                  >
                    {isSelected && (
                      <Check className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow-xs" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Color Picker + HEX Input */}
          <div className="flex items-start gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-600">Picker</label>
              <input
                type="color"
                value={isValidHexColor(hexInput) ? hexInput : '#4f46e5'}
                onChange={(e) => handleHexChange(e.target.value)}
                className="h-10 w-14 cursor-pointer rounded-lg border border-slate-200 bg-white p-1"
                aria-label="Color input picker"
              />
            </div>

            <div className="flex-1">
              <Input
                label="HEX Color Code"
                value={hexInput}
                onChange={(e) => handleHexChange(e.target.value)}
                error={hexError || errors.bannerSolid}
                placeholder="#4f46e5"
                maxLength={7}
              />
            </div>
          </div>
        </div>
      )}

      {/* Mode C: Uploaded Image */}
      {bannerType === 'image' && (
        <div className="space-y-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            id="banner-image-file-input"
            onChange={handleFileChange}
          />

          {!banner?.imageUrl ? (
            /* Upload Callout */
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 text-center transition-colors hover:border-indigo-400 hover:bg-indigo-50/20"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-xs text-indigo-600 mb-2">
                <Upload className="h-6 w-6" />
              </div>
              <p className="text-xs font-semibold text-slate-700">
                Click to upload Cover Banner Image
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                Supported formats: JPG, PNG, WEBP (Max 5 MB)
              </p>
            </div>
          ) : (
            /* Controls for current banner image */
            <div className="space-y-4">
              {/* Miniature Banner Preview Box */}
              <div className="relative h-28 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-900 shadow-inner">
                <div
                  className="absolute inset-0 bg-cover bg-no-repeat transition-transform duration-100"
                  style={{
                    backgroundImage: `url(${banner.imageUrl})`,
                    backgroundPosition: `${banner.positionX ?? 50}% ${banner.positionY ?? 50}%`,
                    transform: `scale(${banner.zoom ?? 1})`,
                    transformOrigin: `${banner.positionX ?? 50}% ${banner.positionY ?? 50}%`,
                  }}
                />
                {(banner.overlayOpacity ?? 0) > 0 && (
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundColor: banner.overlayColor || '#000000',
                      opacity: banner.overlayOpacity ?? 0,
                    }}
                  />
                )}
                <div className="absolute top-2 right-2 rounded-full bg-slate-900/80 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-xs">
                  Banner Preview
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-3.5 w-3.5" />
                  <span>Change Image</span>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                  onClick={onRemoveImage}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Remove Image</span>
                </Button>
              </div>

              {/* Pan & Zoom Controls */}
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <Sliders className="h-3.5 w-3.5 text-indigo-600" />
                  <span>Position & Scale</span>
                </div>

                {/* Horizontal Position (X) */}
                <div>
                  <div className="flex justify-between text-[11px] font-medium text-slate-600 mb-1">
                    <span>Horizontal Focus (X)</span>
                    <span className="font-mono">{banner.positionX ?? 50}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={banner.positionX ?? 50}
                    onChange={(e) =>
                      onUpdateTransform({ positionX: parseInt(e.target.value, 10) })
                    }
                    className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-indigo-600"
                    aria-label="Banner Horizontal Position"
                  />
                </div>

                {/* Vertical Position (Y) */}
                <div>
                  <div className="flex justify-between text-[11px] font-medium text-slate-600 mb-1">
                    <span>Vertical Focus (Y)</span>
                    <span className="font-mono">{banner.positionY ?? 50}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={banner.positionY ?? 50}
                    onChange={(e) =>
                      onUpdateTransform({ positionY: parseInt(e.target.value, 10) })
                    }
                    className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-indigo-600"
                    aria-label="Banner Vertical Position"
                  />
                </div>

                {/* Zoom */}
                <div>
                  <div className="flex justify-between text-[11px] font-medium text-slate-600 mb-1">
                    <span className="flex items-center gap-1">
                      <ZoomIn className="h-3 w-3 text-slate-400" />
                      <span>Zoom Level</span>
                    </span>
                    <span className="font-mono">{((banner.zoom ?? 1) * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={2.5}
                    step={0.05}
                    value={banner.zoom ?? 1}
                    onChange={(e) =>
                      onUpdateTransform({ zoom: parseFloat(e.target.value) })
                    }
                    className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-indigo-600"
                    aria-label="Banner Zoom"
                  />
                </div>

                {/* Readability Overlay Opacity */}
                <div>
                  <div className="flex justify-between text-[11px] font-medium text-slate-600 mb-1">
                    <span>Readability Dark Overlay</span>
                    <span className="font-mono">
                      {Math.round((banner.overlayOpacity ?? 0.2) * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={0.8}
                    step={0.05}
                    value={banner.overlayOpacity ?? 0.2}
                    onChange={(e) =>
                      onUpdateTransform({ overlayOpacity: parseFloat(e.target.value) })
                    }
                    className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-indigo-600"
                    aria-label="Banner Overlay Opacity"
                  />
                </div>
              </div>
            </div>
          )}

          {errors.bannerImage && (
            <p className="text-xs font-medium text-rose-600" role="alert">
              {errors.bannerImage}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
