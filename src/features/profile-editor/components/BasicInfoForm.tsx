import { useState, useRef, type ChangeEvent } from 'react'
import { Upload, Trash2, Image as ImageIcon, Crop } from 'lucide-react'
import { Input } from '../../../components/ui/Input'
import { Textarea } from '../../../components/ui/Textarea'
import { Button } from '../../../components/ui/Button'
import { ImageCropModal } from './ImageCropModal'
import { getInitials } from '../../../utils/initials'
import { validateImageFile } from '../../../utils/validators'

export interface BasicInfoFormProps {
  fullName: string
  title: string
  bio: string
  avatarUrl?: string | null
  localAvatarFile?: File | null
  errors: Record<string, string>
  onUpdateInfo: (fields: Partial<{ fullName: string; title: string; bio: string }>) => void
  onSelectAvatar: (file: File) => { success: boolean; error?: string }
  onApplyCroppedAvatar?: (blob: Blob, originalFile?: File) => { success: boolean; error?: string }
  onRemoveAvatar: () => void
}

export function BasicInfoForm({
  fullName,
  title,
  bio,
  avatarUrl,
  localAvatarFile,
  errors,
  onUpdateInfo,
  onSelectAvatar,
  onApplyCroppedAvatar,
  onRemoveAvatar,
}: BasicInfoFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const initials = getInitials(fullName)

  // Cropping modal state
  const [cropFile, setCropFile] = useState<File | null>(null)
  const [isCropOpen, setIsCropOpen] = useState<boolean>(false)
  const [localAvatarError, setLocalAvatarError] = useState<string>('')

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const validation = validateImageFile(file)
      if (!validation.valid) {
        setLocalAvatarError(validation.error || 'Invalid image file.')
        return
      }
      setLocalAvatarError('')
      setCropFile(file)
      setIsCropOpen(true)
    }
    // Reset file input so re-selecting the same file triggers onChange
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleTriggerPicker = () => {
    fileInputRef.current?.click()
  }

  const handleReCropExisting = () => {
    if (localAvatarFile) {
      setCropFile(localAvatarFile)
      setIsCropOpen(true)
    } else {
      handleTriggerPicker()
    }
  }

  const handleConfirmCrop = (croppedBlob: Blob) => {
    if (onApplyCroppedAvatar) {
      onApplyCroppedAvatar(croppedBlob, cropFile || undefined)
    } else if (cropFile) {
      onSelectAvatar(cropFile)
    }
    setIsCropOpen(false)
    setCropFile(null)
  }

  const handleCancelCrop = () => {
    setIsCropOpen(false)
    setCropFile(null)
  }

  const activeAvatarError = errors.avatar || localAvatarError

  return (
    <div className="space-y-6">
      {/* 1. Avatar Picker Section */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
          Profile Photo
        </label>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          {/* Avatar Preview Thumbnail */}
          <div
            className="relative flex h-20 w-20 shrink-0 aspect-square items-center justify-center overflow-hidden rounded-[12px] border-2 border-slate-200 bg-slate-900 text-xl font-bold text-white shadow-xs"
            style={{ aspectRatio: '1 / 1', borderRadius: '12px' }}
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={fullName || 'Profile Preview'}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="select-none">{initials}</span>
            )}
          </div>

          {/* Avatar Actions */}
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                id="avatar-file-input"
                onChange={handleFileChange}
              />

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={handleTriggerPicker}
              >
                {avatarUrl ? (
                  <>
                    <Upload className="h-3.5 w-3.5" />
                    <span>Change Photo</span>
                  </>
                ) : (
                  <>
                    <ImageIcon className="h-3.5 w-3.5" />
                    <span>Upload Photo</span>
                  </>
                )}
              </Button>

              {avatarUrl && localAvatarFile && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-slate-700"
                  onClick={handleReCropExisting}
                >
                  <Crop className="h-3.5 w-3.5" />
                  <span>Adjust Crop</span>
                </Button>
              )}

              {avatarUrl && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                  onClick={onRemoveAvatar}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Remove</span>
                </Button>
              )}
            </div>

            <p className="text-[11px] text-slate-500">
              Supported formats: JPG, PNG, or WEBP (Max: 2 MB).
            </p>

            {activeAvatarError && (
              <p className="text-xs font-medium text-rose-600" role="alert">
                {activeAvatarError}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 2. Full Name Input */}
      <Input
        label="Full Name"
        value={fullName}
        onChange={(e) => onUpdateInfo({ fullName: e.target.value })}
        error={errors.fullName}
        placeholder="e.g. Alex Morgan"
      />

      {/* 3. Professional Title Input */}
      <Input
        label="Professional Title"
        value={title}
        onChange={(e) => onUpdateInfo({ title: e.target.value })}
        error={errors.title}
        placeholder="e.g. Full-Stack Software Engineer"
      />

      {/* 4. Professional Bio Textarea */}
      <Textarea
        label="Professional Bio"
        value={bio}
        onChange={(e) => onUpdateInfo({ bio: e.target.value })}
        showCount
        maxLength={300}
        rows={3}
        placeholder="Brief summary of your technical focus, experience, and what you're working on..."
      />

      {/* Crop Modal */}
      <ImageCropModal
        imageFile={cropFile}
        isOpen={isCropOpen}
        onConfirm={handleConfirmCrop}
        onCancel={handleCancelCrop}
      />
    </div>
  )
}
