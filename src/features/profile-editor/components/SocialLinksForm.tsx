import { useState, useMemo } from 'react'
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Search,
  ExternalLink,
  AlertCircle,
  Link2,
} from 'lucide-react'
import type { ProfileLink } from '../../../types'
import {
  PLATFORM_CATALOG,
  PLATFORM_CATEGORIES,
  getPlatformConfig,
  type PlatformConfig,
} from '../../../utils/platforms'
import { getPlatformBrandIcon } from '../../../components/icons/BrandIcons'
import { isValidUrl } from '../../../utils/validators'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'

export interface SocialLinksFormProps {
  links: ProfileLink[]
  onAddLink: (link: Omit<ProfileLink, 'id' | 'order'>) => void
  onUpdateLink: (id: string, partial: Partial<ProfileLink>) => void
  onRemoveLink: (id: string) => void
  onReorderLinks: (fromIndex: number, toIndex: number) => void
}

export function SocialLinksForm({
  links,
  onAddLink,
  onUpdateLink,
  onRemoveLink,
  onReorderLinks,
}: SocialLinksFormProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isCatalogOpen, setIsCatalogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Filter out platforms already added (except 'custom' which can be added multiple times)
  const existingPlatformSet = useMemo(() => {
    return new Set(links.filter((l) => l.platform !== 'custom').map((l) => l.platform))
  }, [links])

  const filteredCatalog = useMemo(() => {
    return PLATFORM_CATALOG.filter((p) => {
      // If already added and not custom, do not show
      if (existingPlatformSet.has(p.id)) return false

      // Category filter
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        return (
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q))
        )
      }

      return true
    })
  }, [searchQuery, selectedCategory, existingPlatformSet])

  const handleSelectPlatform = (platform: PlatformConfig) => {
    onAddLink({
      platform: platform.id,
      title: platform.name,
      url: '',
      customLabel: platform.id === 'custom' ? 'My Custom Link' : undefined,
    })
    setIsCatalogOpen(false)
    setSearchQuery('')
  }

  return (
    <div className="space-y-6">
      {/* Platform Selector / Add Action */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Add Social & Professional Links</h3>
            <p className="text-xs text-slate-500">
              Select from 31 platforms across tech, design, career, academic, and personal profiles.
            </p>
          </div>

          <Button
            type="button"
            variant={isCatalogOpen ? 'secondary' : 'primary'}
            size="sm"
            className="shrink-0 gap-1.5 whitespace-nowrap"
            onClick={() => setIsCatalogOpen(!isCatalogOpen)}
          >
            <Plus className="h-4 w-4" />
            <span>{isCatalogOpen ? 'Close Catalog' : 'Add Link'}</span>
          </Button>
        </div>

        {/* Searchable Platform Catalog Panel */}
        {isCatalogOpen && (
          <div className="mt-5 space-y-4 border-t border-slate-100 pt-4">
            {/* Search Input & Category Badges */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search 31 platforms (e.g. LinkedIn, GitHub, Portfolio, Wuzzuf)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-hidden"
                  autoFocus
                />
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1 text-[11px]">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className={`rounded-full px-2.5 py-1 font-medium transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All (31)
                </button>
                {PLATFORM_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-full px-2.5 py-1 font-medium transition-colors ${
                      selectedCategory === cat
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Catalog Grid */}
            <div className="max-h-72 overflow-y-auto pr-1">
              {filteredCatalog.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No matching platforms found. Try another search or choose Custom Link.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                  {filteredCatalog.map((platform) => (
                    <button
                      key={platform.id}
                      type="button"
                      onClick={() => handleSelectPlatform(platform)}
                      className="flex items-center gap-2.5 rounded-xl border border-slate-200 p-2.5 text-left transition hover:border-indigo-300 hover:bg-indigo-50/40 group"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                        {getPlatformBrandIcon(platform.id, 'h-4 w-4')}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-xs font-semibold text-slate-800">
                          {platform.name}
                        </div>
                        <div className="truncate text-[10px] text-slate-400">
                          {platform.category}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Active Links List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Active Links ({links.length})
          </h3>
          <span className="text-[11px] text-slate-400">
            Use arrows to reorder • URLs are safely validated
          </span>
        </div>

        {links.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
            <Link2 className="h-8 w-8 text-slate-400 mb-2" />
            <p className="text-sm font-semibold text-slate-700">No links added yet</p>
            <p className="mt-1 text-xs text-slate-500 max-w-sm">
              Connect your online presence by adding LinkedIn, GitHub, your Portfolio, and communication channels.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-4 gap-1.5"
              onClick={() => setIsCatalogOpen(true)}
            >
              <Plus className="h-4 w-4" />
              <span>Add Your First Link</span>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {links.map((link, index) => {
              const cfg = getPlatformConfig(link.platform)
              const hasUrl = Boolean(link.url && link.url.trim().length > 0)
              const urlValid = !hasUrl || isValidUrl(link.url, link.platform)

              return (
                <div
                  key={link.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs transition hover:border-slate-300"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    {/* Platform Header */}
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                        {getPlatformBrandIcon(link.platform, 'h-4 w-4')}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{cfg.name}</span>
                          <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[9px] font-medium text-slate-600">
                            {cfg.category}
                          </span>
                        </div>
                        {cfg.description && (
                          <p className="text-[10px] text-slate-400">{cfg.description}</p>
                        )}
                      </div>
                    </div>

                    {/* Reorder and Delete Actions */}
                    <div className="flex items-center gap-1 self-end sm:self-auto">
                      <button
                        type="button"
                        onClick={() => onReorderLinks(index, index - 1)}
                        disabled={index === 0}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                        title="Move Up"
                        aria-label={`Move ${link.title} up`}
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onReorderLinks(index, index + 1)}
                        disabled={index === links.length - 1}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                        title="Move Down"
                        aria-label={`Move ${link.title} down`}
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onRemoveLink(link.id)}
                        className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-colors ml-1"
                        title="Delete Link"
                        aria-label={`Remove ${link.title}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Inputs Section */}
                  <div className="mt-3.5 space-y-2.5">
                    {/* Custom Label input for custom link */}
                    {link.platform === 'custom' && (
                      <Input
                        label="Custom Display Label"
                        placeholder="e.g. My Newsletter, Photography Blog"
                        value={link.customLabel || ''}
                        onChange={(e) =>
                          onUpdateLink(link.id, {
                            customLabel: e.target.value,
                            title: e.target.value || 'Custom Link',
                          })
                        }
                      />
                    )}

                    {/* URL Input */}
                    <div className="space-y-1">
                      <div className="relative">
                        <Input
                          placeholder={cfg.placeholder}
                          value={link.url}
                          onChange={(e) => onUpdateLink(link.id, { url: e.target.value })}
                          className={!urlValid ? 'border-rose-400 focus:border-rose-500' : ''}
                        />
                      </div>

                      {/* Validation message */}
                      {hasUrl && !urlValid && (
                        <div className="flex items-center gap-1.5 text-[11px] text-rose-600 mt-1">
                          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                          <span>
                            Please enter a valid destination for {cfg.name} (e.g. {cfg.placeholder})
                          </span>
                        </div>
                      )}

                      {hasUrl && urlValid && (
                        <div className="flex items-center gap-1 text-[11px] text-emerald-600 mt-1">
                          <ExternalLink className="h-3 w-3 shrink-0" />
                          <span>Valid link • ready to display</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
