import { useRef, useState, type ChangeEvent } from 'react'
import { FileText, Upload, Trash2, Download, Eye, AlertCircle, CheckCircle2 } from 'lucide-react'
import type { CardCvDisplay } from '../../../types'
import { Button } from '../../../components/ui/Button'
import { validatePdfFile } from '../../../utils/validators'

export interface CvUploadFormProps {
  cv?: CardCvDisplay | null
  localCvFile: File | null
  errors: Record<string, string>
  onSelectCv: (file: File) => Promise<{ success: boolean; error?: string }>
  onRemoveCv: () => void
  onDownloadCv: () => { success: boolean; message?: string }
  onViewCv: () => { success: boolean; fallbackRequired?: boolean; message?: string }
}

export function CvUploadForm({
  cv,
  localCvFile,
  errors,
  onSelectCv,
  onRemoveCv,
  onDownloadCv,
  onViewCv,
}: CvUploadFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [statusNotice, setStatusNotice] = useState<string>('')
  const [fallbackPrompt, setFallbackPrompt] = useState<string | null>(null)
  const [localError, setLocalError] = useState<string>('')
  const [isValidating, setIsValidating] = useState(false)

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Quick synchronous check first (MIME / extension / size)
      const validation = validatePdfFile(file)
      if (!validation.valid) {
        setLocalError(validation.error || 'Invalid PDF file.')
        if (fileInputRef.current) fileInputRef.current.value = ''
        return
      }

      setLocalError('')
      setStatusNotice('')
      setFallbackPrompt(null)
      setIsValidating(true)

      // Full async check including %PDF- signature verification
      const result = await onSelectCv(file)
      setIsValidating(false)

      if (!result.success && result.error) {
        setLocalError(result.error)
      }
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleViewClick = () => {
    setFallbackPrompt(null)
    const res = onViewCv()
    if (!res.success) {
      if (res.fallbackRequired) {
        setFallbackPrompt(res.message || 'Viewing is unavailable in this browser.')
      } else if (res.message) {
        setStatusNotice(res.message)
      }
    }
  }

  const handleDownloadClick = () => {
    const res = onDownloadCv()
    if (!res.success && res.message) {
      setStatusNotice(res.message)
    } else {
      setStatusNotice('Downloading original PDF document…')
      setTimeout(() => setStatusNotice(''), 2500)
    }
  }

  const activeCvError = errors.cv || localError

  return (
    <div className="space-y-6">
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="sr-only"
        id="cv-file-input"
        onChange={handleFileChange}
      />

      {cv ? (
        /* CV Details Card */
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* File Info */}
            <div className="flex items-start gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                <FileText className="h-6 w-6" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900 break-all">
                    {cv.fileName}
                  </h4>
                  <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                    PDF
                  </span>
                </div>

                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  {cv.fileSizeFormatted && <span>{cv.fileSizeFormatted}</span>}
                  <span>&bull;</span>
                  <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                    <CheckCircle2 className="h-3 w-3" />
                    {localCvFile ? 'Document Loaded' : 'Draft Resume'}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {/* View CV — opens new tab with reliable blob URL */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={handleViewClick}
                disabled={!localCvFile || isValidating}
                title={localCvFile ? `View ${cv.fileName} in new tab` : 'Upload a PDF to enable view'}
              >
                <Eye className="h-3.5 w-3.5" />
                <span>View CV</span>
              </Button>

              {/* Download CV */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={handleDownloadClick}
                disabled={!localCvFile || isValidating}
                title={localCvFile ? `Download ${cv.fileName}` : 'Upload a PDF to enable download'}
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => fileInputRef.current?.click()}
                disabled={isValidating}
              >
                <Upload className="h-3.5 w-3.5" />
                <span>Replace</span>
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="gap-1.5 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                onClick={onRemoveCv}
                disabled={isValidating}
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Remove</span>
              </Button>
            </div>
          </div>

          {/* Fallback dialog when PDF viewing is unsupported or popup is blocked */}
          {fallbackPrompt && (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/80 p-3.5 text-xs text-amber-900 space-y-2">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                <span>{fallbackPrompt}</span>
              </div>
              <div className="flex items-center gap-2 pl-6">
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  className="gap-1.5 bg-amber-600 hover:bg-amber-700"
                  onClick={handleDownloadClick}
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download CV File</span>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setFallbackPrompt(null)}
                >
                  Dismiss
                </Button>
              </div>
            </div>
          )}

          {/* Validation / status notice */}
          {isValidating && (
            <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs text-slate-600 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-slate-400" />
              <span>Verifying PDF signature…</span>
            </div>
          )}
          {!isValidating && statusNotice && (
            <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50/70 p-3 text-xs text-indigo-800 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-indigo-600 mt-0.5" />
              <span>{statusNotice}</span>
            </div>
          )}
        </div>
      ) : (
        /* Empty Upload Dropzone */
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-8 text-center transition-colors hover:border-indigo-400 hover:bg-indigo-50/20"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-xs text-indigo-600 mb-3 border border-slate-100">
            <Upload className="h-6 w-6" />
          </div>
          <p className="text-sm font-bold text-slate-800">
            Upload your CV or Resume
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Only PDF format is supported (Maximum size: 5 MB)
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-4 pointer-events-none"
          >
            Select PDF Document
          </Button>
        </div>
      )}

      {/* Validation Error */}
      {activeCvError && (
        <p className="text-xs font-medium text-rose-600" role="alert">
          {activeCvError}
        </p>
      )}

      {/* Local-only notice */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-[11px] text-slate-500 space-y-1">
        <p className="font-semibold text-slate-700">Document Availability</p>
        <p>
          Your CV document is held locally in this browser session. The View CV action opens the PDF in a separate tab, and Download CV saves the original document. Native viewer toolbars (such as download buttons) vary across browsers. Persistent multi-device access will be connected via Supabase Storage in Phase 4.
        </p>
      </div>
    </div>
  )
}
