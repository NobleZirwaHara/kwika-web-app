import { useState, useCallback } from 'react'
import { router } from '@inertiajs/react'
import { ProviderCard, type Provider } from './ProviderCard'
import { ServiceCard, type Service } from './ServiceCard'
import { ProviderListItem } from './ProviderListItem'
import { ServiceListItem } from './ServiceListItem'
import { FilterPanel } from './FilterPanel'
import { MobileFilterSheet } from './MobileFilterSheet'
import { ViewModeToggle, type ViewMode } from './ViewModeToggle'
import { ListingTypeToggle, type ListingType } from './ListingTypeToggle'
import { SortingDropdown, type SortOption, type SortOrder } from './SortingDropdown'
import { ActiveFilters, type FilterState } from './ActiveFilters'
import { MapView } from './MapView'
import { EmptyResults } from './EmptyResults'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useMediaQuery } from 'react-responsive'

interface Category {
  id: number
  name: string
  subcategories?: Array<{ id: number; name: string }>
}

interface PaginatedData<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  links: Array<{
    url: string | null
    label: string
    active: boolean
  }>
}

interface ServicesListingContainerProps {
  results: PaginatedData<Provider> | PaginatedData<Service>
  listingType: ListingType
  categories: Category[]
  cities: string[]
  searchParams: FilterState & {
    sort_by: SortOption
    sort_order: SortOrder
    per_page: number
    listing_type: ListingType
  }
  totalResults: number
  className?: string
  hideListingTypeToggle?: boolean
}

export function ServicesListingContainer({
  results,
  listingType,
  categories,
  cities,
  searchParams,
  totalResults,
  className,
  hideListingTypeToggle = false
}: ServicesListingContainerProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [hoveredMapId, setHoveredMapId] = useState<number | null>(null)

  const isDesktop = useMediaQuery({ minWidth: 1024 })
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 })

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters: Partial<FilterState>) => {
    const params = {
      ...searchParams,
      ...newFilters,
      page: undefined, // Reset to page 1 when filters change
    }

    // Remove undefined/null values
    Object.keys(params).forEach(key => {
      if (params[key as keyof typeof params] === undefined || params[key as keyof typeof params] === null) {
        delete params[key as keyof typeof params]
      }
    })

    // Use current pathname to work on both /search and /listings
    router.get(window.location.pathname, params, {
      preserveState: true,
      preserveScroll: true,
    })
  }, [searchParams])

  // Handle listing type change
  const handleListingTypeChange = useCallback((type: ListingType) => {
    handleFilterChange({ listing_type: type } as any)
  }, [handleFilterChange])

  // Handle sorting change
  const handleSortingChange = useCallback((sortBy: SortOption, sortOrder: SortOrder) => {
    handleFilterChange({ sort_by: sortBy, sort_order: sortOrder } as any)
  }, [handleFilterChange])

  // Handle remove single filter
  const handleRemoveFilter = useCallback((key: keyof FilterState) => {
    const updates: Partial<FilterState> = { [key]: undefined }

    // If removing price, clear both min and max
    if (key === 'min_price') {
      updates.max_price = undefined
    }

    handleFilterChange(updates)
  }, [handleFilterChange])

  // Handle clear all filters
  const handleClearAll = useCallback(() => {
    router.get(window.location.pathname, {
      listing_type: searchParams.listing_type,
      sort_by: 'rating',
      sort_order: 'desc',
      per_page: 12,
    }, {
      preserveState: true,
      preserveScroll: false,
    })
  }, [searchParams.listing_type])


  const isProviderListing = listingType === 'providers'
  const items = results.data
  const hasResults = items.length > 0

  return (
    <div className={className}>
      {/* Header Controls */}
      <div className="space-y-4 mb-6">
        {/* Top Row: Listing Type & View Mode */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {!hideListingTypeToggle && (
            <ListingTypeToggle
              value={listingType}
              onChange={handleListingTypeChange}
            />
          )}

          <div className="flex items-center gap-3">
            {/* Mobile Filter Button */}
            {!isDesktop && (
              <MobileFilterSheet
                filters={searchParams}
                categories={categories}
                cities={cities}
                onFilterChange={handleFilterChange}
                onClearAll={handleClearAll}
                onApply={() => {}}
              />
            )}

            {/* Sorting */}
            <SortingDropdown
              sortBy={searchParams.sort_by}
              sortOrder={searchParams.sort_order}
              onSortChange={handleSortingChange}
            />

            {/* View Mode Toggle (Desktop) */}
            {isDesktop && (
              <ViewModeToggle
                value={viewMode}
                onChange={setViewMode}
                showMap={true}
              />
            )}
          </div>
        </div>

        {/* Active Filters */}
        <ActiveFilters
          filters={searchParams}
          categories={categories}
          onRemoveFilter={handleRemoveFilter}
          onClearAll={handleClearAll}
        />

        {/* Results Count */}
        <div className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{totalResults}</span>
          {' '}{isProviderListing ? 'providers' : 'services'} found
        </div>
      </div>

      {/* Main Content */}
      <div className="flex gap-6">
        {/* Desktop Sidebar Filters */}
        {isDesktop && (
          <aside className="w-80 shrink-0">
            <div className="sticky top-24">
              <FilterPanel
                filters={searchParams}
                categories={categories}
                cities={cities}
                onFilterChange={handleFilterChange}
                onClearAll={handleClearAll}
              />
            </div>
          </aside>
        )}

        {/* Results Area */}
        <div className="flex-1 min-w-0">
          {!hasResults ? (
            <EmptyResults
              title="No results found"
              description="Try adjusting your search criteria or filters to find what you're looking for"
              onClearFilters={handleClearAll}
              showClearButton={!!(searchParams.query || searchParams.category || searchParams.city)}
            />
          ) : viewMode === 'map' ? (
            <div className="h-[600px] rounded-xl overflow-hidden border">
              <MapView
                items={items as any}
                listingType={listingType}
                onItemHover={setHoveredMapId}
                hoveredId={hoveredMapId}
                className="h-full"
              />
            </div>
          ) : viewMode === 'list' ? (
            <div className="space-y-4">
              {items.map((item) =>
                isProviderListing ? (
                  <ProviderListItem
                    key={item.id}
                    provider={item as Provider}
                  />
                ) : (
                  <ServiceListItem
                    key={item.id}
                    service={item as Service}
                  />
                )
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) =>
                isProviderListing ? (
                  <ProviderCard
                    key={item.id}
                    provider={item as Provider}
                  />
                ) : (
                  <ServiceCard
                    key={item.id}
                    service={item as Service}
                  />
                )
              )}
            </div>
          )}

          {/* Pagination */}
          {hasResults && results.last_page > 1 && viewMode !== 'map' && (
            <div className="mt-8 flex justify-center gap-2 flex-wrap">
              {results.links.map((link, index) => {
                const isDisabled = !link.url
                const isCurrent = link.active

                return (
                  <button
                    key={index}
                    onClick={() => link.url && router.visit(link.url)}
                    disabled={isDisabled}
                    className={`
                      px-4 py-2 rounded-lg text-sm font-medium transition-colors
                      ${isCurrent
                        ? 'bg-primary text-primary-foreground'
                        : isDisabled
                        ? 'bg-muted text-muted-foreground cursor-not-allowed'
                        : 'bg-muted hover:bg-muted/80'
                      }
                    `}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                  />
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Loading skeleton component
export function ServicesListingContainerSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-48" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="aspect-square w-full" />
            <div className="p-4 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
