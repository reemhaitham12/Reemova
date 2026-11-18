import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Edit3,
  Image as ImageIcon,
  FileText,
  Palette,
  Link as LinkIcon,
  ExternalLink,
  Sparkles,
  CheckCircle2,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { useProfileEditor } from '../hooks/useProfileEditor'
import { LivePreviewFrame } from '../components/LivePreviewFrame'
import { MobileViewToggle, type MobileEditorView } from '../components/MobileViewToggle'
import { BasicInfoForm } from '../components/BasicInfoForm'
import { CoverBannerForm } from '../components/CoverBannerForm'
import { CvUploadForm } from '../components/CvUploadForm'
import { SocialLinksForm } from '../components/SocialLinksForm'
import type { ThemePresetId } from '../../../types'

type EditorTab = 'details' | 'banner' | 'cv' | 'theme' | 'links'

export function ProfileEditorPage() {
  const [activeTab, setActiveTab] = useState<EditorTab>('details')
  const [mobileView, setMobileView] = useState<MobileEditorView>('edit')

  const {
    cardData,
    localAvatarFile,
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
  } = useProfileEditor()

  const presetList: Array<{ id: Exclude<ThemePresetId, 'custom'>; label: string }> = [
    { id: 'modern-indigo', label: 'Modern Indigo' },
    { id: 'emerald-tech', label: 'Emerald Tech' },
    { id: 'minimal-dark', label: 'Minimal Dark' },
    { id: 'sunset-coral', label: 'Sunset Coral' },
  ]

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
            <Sparkles className="h-3 w-3" />
            <span>Interactive Editor &bull; Phase 2.4 Active</span>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Profile Editor
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Customize your professional bio, banner, resume, and appearance in real time
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/u/alex">
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4" />
              Preview Public View
            </Button>
          </Link>
          <Button size="sm" disabled className="opacity-60 cursor-not-allowed">
            Draft Mode (Saving in Phase 4)
          </Button>
        </div>
      </div>

      {/* Mobile-Only Segmented Control Toggle */}
      <div className="mt-6">
        <MobileViewToggle activeView={mobileView} onToggle={setMobileView} />
      </div>

      {/* Main Dual-Column Layout */}
      <div className="mt-4 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Form Controls (Hidden on mobile if preview mode is active) */}
        <div
          className={`lg:col-span-7 ${
            mobileView === 'preview' ? 'hidden lg:block' : 'block'
          }`}
        >
          {/* Editor Tabs Navigation */}
          <div className="flex overflow-x-auto border-b border-slate-200 scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveTab('details')}
              className={`flex shrink-0 items-center gap-1.5 border-b-2 px-3.5 py-2.5 text-xs sm:text-sm font-medium transition-colors ${
                activeTab === 'details'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Edit3 className="h-4 w-4" />
              Basic Info
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('banner')}
              className={`flex shrink-0 items-center gap-1.5 border-b-2 px-3.5 py-2.5 text-xs sm:text-sm font-medium transition-colors ${
                activeTab === 'banner'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <ImageIcon className="h-4 w-4" />
              Cover Banner
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('cv')}
              className={`flex shrink-0 items-center gap-1.5 border-b-2 px-3.5 py-2.5 text-xs sm:text-sm font-medium transition-colors ${
                activeTab === 'cv'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <FileText className="h-4 w-4" />
              CV / Resume
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('theme')}
              className={`flex shrink-0 items-center gap-1.5 border-b-2 px-3.5 py-2.5 text-xs sm:text-sm font-medium transition-colors ${
                activeTab === 'theme'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Palette className="h-4 w-4" />
              Theme & Styling
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('links')}
              className={`flex shrink-0 items-center gap-1.5 border-b-2 px-3.5 py-2.5 text-xs sm:text-sm font-medium transition-colors ${
                activeTab === 'links'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <LinkIcon className="h-4 w-4" />
              Social Links
            </button>
          </div>

          <Card className="mt-6">
            {/* Tab 1: Profile Info Form */}
            {activeTab === 'details' && (
              <div className="space-y-4">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-base">Personal Information & Photo</CardTitle>
                  <CardDescription>
                    Update your professional identity, bio, and adjust your profile photo crop. Changes sync with the live preview instantly.
                  </CardDescription>
                </CardHeader>

                <BasicInfoForm
                  fullName={cardData.fullName}
                  title={cardData.title}
                  bio={cardData.bio}
                  avatarUrl={cardData.avatarUrl}
                  localAvatarFile={localAvatarFile}
                  errors={errors}
                  onUpdateInfo={updateBasicInfo}
                  onSelectAvatar={selectAvatar}
                  onApplyCroppedAvatar={applyCroppedAvatar}
                  onRemoveAvatar={removeAvatar}
                />
              </div>
            )}

            {/* Tab 2: Cover Banner Form */}
            {activeTab === 'banner' && (
              <div className="space-y-4">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-base">Card Cover Banner</CardTitle>
                  <CardDescription>
                    Customize the top banner area with an image, gradient, or solid color. The banner is isolated to the top of your card and never changes your profile photo.
                  </CardDescription>
                </CardHeader>

                <CoverBannerForm
                  banner={cardData.banner}
                  errors={errors}
                  onSetType={setBannerType}
                  onSetSolidColor={setBannerSolidColor}
                  onSetGradient={setBannerGradient}
                  onSelectImage={selectBannerImage}
                  onUpdateTransform={updateBannerImageTransform}
                  onRemoveImage={removeBannerImage}
                />
              </div>
            )}

            {/* Tab 3: CV / Resume Form */}
            {activeTab === 'cv' && (
              <div className="space-y-4">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-base">Curriculum Vitae / Resume</CardTitle>
                  <CardDescription>
                    Attach a PDF resume to display View CV and Download CV buttons on your digital card.
                  </CardDescription>
                </CardHeader>

                <CvUploadForm
                  cv={cardData.cv}
                  localCvFile={localCvFile}
                  errors={errors}
                  onSelectCv={selectCv}
                  onRemoveCv={removeCv}
                  onDownloadCv={downloadLocalCv}
                  onViewCv={viewLocalCv}
                />
              </div>
            )}

            {/* Tab 4: Theme Presets Wired to State */}
            {activeTab === 'theme' && (
              <div className="space-y-4">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-base">Card & Banner Theme Presets</CardTitle>
                  <CardDescription>
                    Select any preset style below to observe live color updates on the card.
                  </CardDescription>
                </CardHeader>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {presetList.map((preset) => {
                    const isSelected = cardData.theme.presetId === preset.id
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setThemePreset(preset.id)}
                        className={`flex items-center justify-between rounded-lg border p-3 text-left text-xs font-medium transition-all ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 ring-2 ring-indigo-500/20'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{preset.label}</span>
                        {isSelected && <CheckCircle2 className="h-4 w-4 text-indigo-600" />}
                      </button>
                    )
                  })}
                </div>

                {/* Solid Color Customization */}
                <div className="mt-4 space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <h4 className="text-xs font-semibold text-slate-700">Custom Colors</h4>

                  {/* Card Background Color */}
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium text-slate-700">Card Background</p>
                      <p className="text-[11px] text-slate-400">Solid fill for the card surface</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Color swatch preview */}
                      <span
                        className="h-6 w-6 rounded-md border border-slate-300 shadow-xs"
                        style={{ backgroundColor: cardData.theme.colors.cardBackgroundColor }}
                        aria-hidden="true"
                      />
                      <input
                        type="color"
                        value={cardData.theme.colors.cardBackgroundColor}
                        onChange={(e) => setCustomThemeColor('cardBackgroundColor', e.target.value)}
                        className="h-8 w-10 cursor-pointer rounded border border-slate-300 bg-white p-0.5"
                        title="Pick card background color"
                      />
                    </div>
                  </div>

                  {/* Accent / Button Color */}
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium text-slate-700">Accent Color</p>
                      <p className="text-[11px] text-slate-400">Buttons, icons, and highlights</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="h-6 w-6 rounded-md border border-slate-300 shadow-xs"
                        style={{ backgroundColor: cardData.theme.colors.accentColor }}
                        aria-hidden="true"
                      />
                      <input
                        type="color"
                        value={cardData.theme.colors.accentColor}
                        onChange={(e) => setCustomThemeColor('accentColor', e.target.value)}
                        className="h-8 w-10 cursor-pointer rounded border border-slate-300 bg-white p-0.5"
                        title="Pick accent color"
                      />
                    </div>
                  </div>

                  {/* Text Color */}
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium text-slate-700">Text Color</p>
                      <p className="text-[11px] text-slate-400">Name and primary text</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="h-6 w-6 rounded-md border border-slate-300 shadow-xs"
                        style={{ backgroundColor: cardData.theme.colors.textColor }}
                        aria-hidden="true"
                      />
                      <input
                        type="color"
                        value={cardData.theme.colors.textColor}
                        onChange={(e) => setCustomThemeColor('textColor', e.target.value)}
                        className="h-8 w-10 cursor-pointer rounded border border-slate-300 bg-white p-0.5"
                        title="Pick text color"
                      />
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    Selecting a custom color switches the preset to <strong>Custom</strong>. Pick a preset above to reset all colors.
                  </p>
                </div>
              </div>
            )}

            {/* Tab 5: Complete Social Links Management */}
            {activeTab === 'links' && (
              <div className="space-y-4">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-base">Social & Professional Links</CardTitle>
                  <CardDescription>
                    Manage and reorder your online links from 31 platforms including LinkedIn, GitHub, your dedicated Portfolio, and communication channels.
                  </CardDescription>
                </CardHeader>

                <SocialLinksForm
                  links={cardData.links}
                  onAddLink={addLink}
                  onUpdateLink={updateLink}
                  onRemoveLink={removeLink}
                  onReorderLinks={reorderLinks}
                />
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Live Preview Frame (Hidden on mobile if edit mode is active) */}
        <div
          className={`lg:col-span-5 ${
            mobileView === 'edit' ? 'hidden lg:block' : 'block'
          }`}
        >
          <LivePreviewFrame
            cardData={cardData}
            username="alex"
            onDownloadCv={downloadLocalCv}
            onViewCv={viewLocalCv}
          />
        </div>
      </div>
    </div>
  )
}
