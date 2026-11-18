import { useState, useRef, useEffect, useCallback } from 'react'
import type {
  CardDisplayData,
  ProfileLink,
  ThemePresetId,
  ThemeColors,
  CoverBannerType,
  CoverBannerConfig,
} from '../../../types'
import { THEME_PRESETS } from '../../../types'
import {
  validateImageFile,
  validateCoverImageFile,
  validatePdfFile,
  hasPdfSignature,
  formatFileSize,
  isValidHexColor,
} from '../../../utils/validators'

export const DEFAULT_BANNER_CONFIG: CoverBannerConfig = {
  type: 'gradient',
  gradientStart: THEME_PRESETS['modern-indigo'].bannerGradientStart,
  gradientEnd: THEME_PRESETS['modern-indigo'].bannerGradientEnd,
  solidColor: THEME_PRESETS['modern-indigo'].bannerGradientStart,
  imageUrl: null,
  positionX: 50,
  positionY: 50,
  zoom: 1,
  overlayOpacity: 0.2,
  overlayColor: '#000000',
}

export const DEFAULT_PROFILE_DATA: CardDisplayData = {
  fullName: 'Alex Morgan',
  title: 'Full-Stack Software Engineer',
  bio: 'Building accessible, high-performance web products with React, TypeScript, and modern backend architectures.',
  avatarUrl: null,
  theme: {
    presetId: 'modern-indigo',
    colors: THEME_PRESETS['modern-indigo'],
  },
  banner: DEFAULT_BANNER_CONFIG,
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

export function useProfileEditor(initialData?: Partial<CardDisplayData>) {
  const [cardData, setCardData] = useState<CardDisplayData>(() => ({
    ...DEFAULT_PROFILE_DATA,
    ...initialData,
    theme: {
      ...DEFAULT_PROFILE_DATA.theme,
      ...initialData?.theme,
      colors: {
        ...DEFAULT_PROFILE_DATA.theme.colors,
        ...initialData?.theme?.colors,
      },
    },
    banner: initialData?.banner
      ? { ...DEFAULT_BANNER_CONFIG, ...initialData.banner }
      : DEFAULT_BANNER_CONFIG,
    links: initialData?.links || DEFAULT_PROFILE_DATA.links,
  }))

  // Unpersisted local file references kept strictly separate from serializable card data
  const [localAvatarFile, setLocalAvatarFile] = useState<File | null>(null)
  const [localCoverImageFile, setLocalCoverImageFile] = useState<File | null>(null)
  const [localCvFile, setLocalCvFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Track active object URLs to safely revoke when replaced, removed, or unmounted
  const activeAvatarUrlRef = useRef<string | null>(null)
  const activeCoverImageUrlRef = useRef<string | null>(null)
  // Stable long-lived Blob URL for the CV: kept valid as long as the user needs to view it.
  const activeCvBlobUrlRef = useRef<string | null>(null)

  // Unmount cleanup: revoke all active blob URLs to prevent memory leaks
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (activeCvBlobUrlRef.current) {
        URL.revokeObjectURL(activeCvBlobUrlRef.current)
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      if (activeAvatarUrlRef.current) {
        URL.revokeObjectURL(activeAvatarUrlRef.current)
      }
      if (activeCoverImageUrlRef.current) {
        URL.revokeObjectURL(activeCoverImageUrlRef.current)
      }
      if (activeCvBlobUrlRef.current) {
        URL.revokeObjectURL(activeCvBlobUrlRef.current)
      }
    }
  }, [])

  // 1. Update basic information
  const updateBasicInfo = useCallback(
    (fields: Partial<Pick<CardDisplayData, 'fullName' | 'title' | 'bio'>>) => {
      setCardData((prev) => ({
        ...prev,
        ...fields,
      }))
      // Clear error for updated field
      if (fields.fullName) setErrors((prev) => ({ ...prev, fullName: '' }))
      if (fields.title) setErrors((prev) => ({ ...prev, title: '' }))
    },
    []
  )

  // 2. Theme controls
  const setThemePreset = useCallback((presetId: Exclude<ThemePresetId, 'custom'>) => {
    const presetColors = THEME_PRESETS[presetId]
    if (presetColors) {
      setCardData((prev) => {
        // If current banner is gradient, optionally sync with theme preset
        const currentBanner = prev.banner
        const updatedBanner: CoverBannerConfig = {
          ...currentBanner,
          type: currentBanner?.type || 'gradient',
          gradientStart: presetColors.bannerGradientStart,
          gradientEnd: presetColors.bannerGradientEnd,
          solidColor: presetColors.bannerGradientStart,
        }

        return {
          ...prev,
          theme: {
            presetId,
            colors: { ...presetColors },
          },
          banner: updatedBanner,
        }
      })
    }
  }, [])

  const setCustomThemeColor = useCallback(
    <K extends keyof ThemeColors>(colorKey: K, value: ThemeColors[K]) => {
      setCardData((prev) => ({
        ...prev,
        theme: {
          ...prev.theme,
          presetId: 'custom',
          colors: {
            ...prev.theme.colors,
            [colorKey]: value,
          },
        },
      }))
    },
    []
  )

  // 3. Social links management
  const addLink = useCallback((link: Omit<ProfileLink, 'id' | 'order'>) => {
    const newId = `link-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    setCardData((prev) => {
      const nextOrder = prev.links.length + 1
      return {
        ...prev,
        links: [...prev.links, { ...link, id: newId, order: nextOrder }],
      }
    })
  }, [])

  const updateLink = useCallback((id: string, partial: Partial<ProfileLink>) => {
    setCardData((prev) => ({
      ...prev,
      links: prev.links.map((item) => (item.id === id ? { ...item, ...partial } : item)),
    }))
  }, [])

  const removeLink = useCallback((id: string) => {
    setCardData((prev) => ({
      ...prev,
      links: prev.links
        .filter((item) => item.id !== id)
        .map((item, index) => ({ ...item, order: index + 1 })),
    }))
  }, [])

  const reorderLinks = useCallback((fromIndex: number, toIndex: number) => {
    setCardData((prev) => {
      const updated = [...prev.links]
      const [moved] = updated.splice(fromIndex, 1)
      updated.splice(toIndex, 0, moved)
      return {
        ...prev,
        links: updated.map((item, idx) => ({ ...item, order: idx + 1 })),
      }
    })
  }, [])

  // 4. Avatar selection, crop application & cleanup
  const selectAvatar = useCallback((file: File): { success: boolean; error?: string } => {
    const validation = validateImageFile(file)
    if (!validation.valid) {
      const errorMsg = validation.error || 'Invalid image file.'
      setErrors((prev) => ({ ...prev, avatar: errorMsg }))
      return { success: false, error: errorMsg }
    }

    // Revoke previous object URL if one was created
    if (activeAvatarUrlRef.current) {
      URL.revokeObjectURL(activeAvatarUrlRef.current)
    }

    const objectUrl = URL.createObjectURL(file)
    activeAvatarUrlRef.current = objectUrl
    setLocalAvatarFile(file)
    setErrors((prev) => ({ ...prev, avatar: '' }))

    setCardData((prev) => ({
      ...prev,
      avatarUrl: objectUrl,
    }))

    return { success: true }
  }, [])

  /**
   * Applies a cropped image blob from ImageCropModal as the final avatar
   */
  const applyCroppedAvatar = useCallback((blob: Blob, originalFile?: File): { success: boolean; error?: string } => {
    if (activeAvatarUrlRef.current) {
      URL.revokeObjectURL(activeAvatarUrlRef.current)
    }

    const objectUrl = URL.createObjectURL(blob)
    activeAvatarUrlRef.current = objectUrl

    // Wrap blob as a File object if needed for consistent local file state
    const file =
      originalFile ||
      new File([blob], 'avatar.jpg', { type: blob.type || 'image/jpeg' })
    setLocalAvatarFile(file)
    setErrors((prev) => ({ ...prev, avatar: '' }))

    setCardData((prev) => ({
      ...prev,
      avatarUrl: objectUrl,
    }))

    return { success: true }
  }, [])

  const removeAvatar = useCallback(() => {
    if (activeAvatarUrlRef.current) {
      URL.revokeObjectURL(activeAvatarUrlRef.current)
      activeAvatarUrlRef.current = null
    }
    setLocalAvatarFile(null)
    setCardData((prev) => ({
      ...prev,
      avatarUrl: null,
    }))
    setErrors((prev) => ({ ...prev, avatar: '' }))
  }, [])

  // 5. Cover Banner Controls (Strictly isolated from Avatar)
  const setBannerType = useCallback((type: CoverBannerType) => {
    setCardData((prev) => ({
      ...prev,
      banner: {
        ...prev.banner,
        type,
      },
    }))
  }, [])

  const setBannerSolidColor = useCallback((hex: string): { success: boolean; error?: string } => {
    if (!isValidHexColor(hex)) {
      setErrors((prev) => ({ ...prev, bannerSolid: 'Invalid HEX color code (e.g. #4f46e5)' }))
      return { success: false, error: 'Invalid HEX color code' }
    }
    setErrors((prev) => ({ ...prev, bannerSolid: '' }))
    setCardData((prev) => ({
      ...prev,
      banner: {
        ...prev.banner,
        type: 'solid',
        solidColor: hex.trim(),
      },
    }))
    return { success: true }
  }, [])

  const setBannerGradient = useCallback((start: string, end: string) => {
    setCardData((prev) => ({
      ...prev,
      banner: {
        ...prev.banner,
        type: 'gradient',
        gradientStart: start,
        gradientEnd: end,
      },
    }))
  }, [])

  const selectBannerImage = useCallback((file: File): { success: boolean; error?: string } => {
    const validation = validateCoverImageFile(file)
    if (!validation.valid) {
      const errorMsg = validation.error || 'Invalid cover image file.'
      setErrors((prev) => ({ ...prev, bannerImage: errorMsg }))
      return { success: false, error: errorMsg }
    }

    if (activeCoverImageUrlRef.current) {
      URL.revokeObjectURL(activeCoverImageUrlRef.current)
    }

    const objectUrl = URL.createObjectURL(file)
    activeCoverImageUrlRef.current = objectUrl
    setLocalCoverImageFile(file)
    setErrors((prev) => ({ ...prev, bannerImage: '' }))

    setCardData((prev) => ({
      ...prev,
      banner: {
        ...prev.banner,
        type: 'image',
        imageUrl: objectUrl,
        positionX: prev.banner?.positionX ?? 50,
        positionY: prev.banner?.positionY ?? 50,
        zoom: prev.banner?.zoom ?? 1,
        overlayOpacity: prev.banner?.overlayOpacity ?? 0.2,
        overlayColor: prev.banner?.overlayColor || '#000000',
      },
    }))

    return { success: true }
  }, [])

  const updateBannerImageTransform = useCallback(
    (options: {
      positionX?: number
      positionY?: number
      zoom?: number
      overlayOpacity?: number
      overlayColor?: string
    }) => {
      setCardData((prev) => ({
        ...prev,
        banner: {
          ...prev.banner,
          type: prev.banner?.type || 'image',
          ...options,
        },
      }))
    },
    []
  )

  const removeBannerImage = useCallback(() => {
    if (activeCoverImageUrlRef.current) {
      URL.revokeObjectURL(activeCoverImageUrlRef.current)
      activeCoverImageUrlRef.current = null
    }
    setLocalCoverImageFile(null)
    setErrors((prev) => ({ ...prev, bannerImage: '' }))

    setCardData((prev) => {
      // Revert to solid color or gradient when cover image is removed
      const hasSolid = Boolean(prev.banner?.solidColor)
      return {
        ...prev,
        banner: {
          ...prev.banner,
          type: hasSolid ? 'solid' : 'gradient',
          imageUrl: null,
        },
      }
    })
  }, [])

  // 6. CV selection & download
  const selectCv = useCallback(async (file: File): Promise<{ success: boolean; error?: string }> => {
    // Step 1: validate MIME / extension and file size (synchronous)
    const validation = validatePdfFile(file)
    if (!validation.valid) {
      const errorMsg = validation.error || 'Invalid PDF file.'
      setErrors((prev) => ({ ...prev, cv: errorMsg }))
      return { success: false, error: errorMsg }
    }

    // Step 2: verify the PDF magic bytes (%PDF-) before accepting the file
    const signatureOk = await hasPdfSignature(file)
    if (!signatureOk) {
      const errorMsg = 'The selected file does not appear to be a valid PDF document.'
      setErrors((prev) => ({ ...prev, cv: errorMsg }))
      return { success: false, error: errorMsg }
    }

    // Deterministic Cleanup: revoke previous CV Blob URL before replacing
    if (activeCvBlobUrlRef.current) {
      URL.revokeObjectURL(activeCvBlobUrlRef.current)
      activeCvBlobUrlRef.current = null
    }

    // Create a stable long-lived Blob URL for viewing this PDF
    const blobUrl = URL.createObjectURL(file)
    activeCvBlobUrlRef.current = blobUrl

    // Store the original File directly
    setLocalCvFile(file)
    setErrors((prev) => ({ ...prev, cv: '' }))

    setCardData((prev) => ({
      ...prev,
      cv: {
        fileName: file.name,
        fileSizeFormatted: formatFileSize(file.size),
        isLocalDraft: true,
      },
    }))

    return { success: true }
  }, [])

  const removeCv = useCallback(() => {
    // Deterministic Cleanup: safely revoke the Blob URL upon removal
    if (activeCvBlobUrlRef.current) {
      URL.revokeObjectURL(activeCvBlobUrlRef.current)
      activeCvBlobUrlRef.current = null
    }
    setLocalCvFile(null)
    setCardData((prev) => ({
      ...prev,
      cv: null,
    }))
    setErrors((prev) => ({ ...prev, cv: '' }))
  }, [])

  /**
   * Opens the valid PDF in a separate browser tab using the stable Blob URL.
   * Returns capability status and fallback info if viewing is unavailable or blocked.
   */
  const viewLocalCv = useCallback((): {
    success: boolean
    fallbackRequired?: boolean
    message?: string
  } => {
    if (!localCvFile || !activeCvBlobUrlRef.current) {
      return {
        success: false,
        message: 'No CV document is currently loaded. Please select a valid PDF file.',
      }
    }

    // Check capability: navigator.pdfViewerEnabled (when defined)
    const supportsPdfViewing =
      typeof navigator !== 'undefined' && 'pdfViewerEnabled' in navigator
        ? navigator.pdfViewerEnabled
        : true

    if (!supportsPdfViewing) {
      return {
        success: false,
        fallbackRequired: true,
        message:
          'In-browser PDF viewing is not supported in this browser. Please use the Download CV option to view it on your device.',
      }
    }

    // Open in designated tab window
    const newWindow = window.open(activeCvBlobUrlRef.current, '_blank')
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      // Pop-up blocked or mobile webview rejection
      return {
        success: false,
        fallbackRequired: true,
        message:
          'The PDF viewing tab was blocked by the browser. Please allow pop-ups or use Download CV directly.',
      }
    }

    return { success: true }
  }, [localCvFile])

  /**
   * Downloads the locally selected CV PDF.
   *
   * Mechanism: creates a short-lived object URL from the original File bytes,
   * triggers an <a download> click, then revokes the URL after one tick —
   * the browser has already initiated the download at that point.
   */
  const downloadLocalCv = useCallback((): { success: boolean; message?: string } => {
    if (!localCvFile) {
      return {
        success: false,
        message:
          'No CV file is loaded. Upload a PDF document to enable the Download CV action.',
      }
    }

    // Create a short-lived object URL from the original File bytes
    const url = URL.createObjectURL(localCvFile)

    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = localCvFile.name // preserves the original filename
    anchor.style.display = 'none'
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)

    // Revoke after a tick — the download has been initiated synchronously
    setTimeout(() => URL.revokeObjectURL(url), 150)

    return { success: true }
  }, [localCvFile])

  return {
    cardData,
    localAvatarFile,
    localCoverImageFile,
    localCvFile,
    errors,
    updateBasicInfo,
    setThemePreset,
    setCustomThemeColor,
    addLink,
    updateLink,
    removeLink,
    reorderLinks,
    selectAvatar,
    applyCroppedAvatar,
    removeAvatar,
    setBannerType,
    setBannerSolidColor,
    setBannerGradient,
    selectBannerImage,
    updateBannerImageTransform,
    removeBannerImage,
    selectCv,
    removeCv,
    viewLocalCv,
    downloadLocalCv,
  }
}
