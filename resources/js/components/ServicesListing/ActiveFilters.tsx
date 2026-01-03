import { X, Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

export interface FilterState {
  query?: string
  category?: number
  city?: string
  min_price?: number
  max_price?: number
  min_rating?: number
  price_type?: 'fixed' | 'hourly' | 'daily' | 'custom'
  available_date?: string
}

interface ActiveFiltersProps {
  filters: FilterState
  categories?: Array<{ id: number; name: string }>
  onRemoveFilter: (key: keyof FilterState) => void
  onClearAll: () => void
  className?: string
}

export function ActiveFilters({
  filters,
  categories = [],
  onRemoveFilter,
  onClearAll,
  className
}: ActiveFiltersProps) {
  const activeFilters: Array<{ key: keyof FilterState; label: string; value: string }> = []

  // Build active filters list
  if (filters.query) {
    activeFilters.push({ key: 'query', label: 'Search', value: `"${filters.query}"` })
  }

  if (filters.category) {
    const category = categories.find(c => c.id === filters.category)
    if (category) {
      activeFilters.push({ key: 'category', label: 'Category', value: category.name })
    }
  }

  if (filters.city) {
    activeFilters.push({ key: 'city', label: 'Location', value: filters.city })
  }

  if (filters.min_price || filters.max_price) {
    const priceRange = []
    if (filters.min_price) priceRange.push(`MWK ${filters.min_price.toLocaleString()}`)
    if (filters.max_price) priceRange.push(`MWK ${filters.max_price.toLocaleString()}`)
    activeFilters.push({
      key: 'min_price',
      label: 'Price',
      value: priceRange.join(' - ')
    })
  }

  if (filters.min_rating) {
    activeFilters.push({
      key: 'min_rating',
      label: 'Rating',
      value: `${filters.min_rating}+ stars`
    })
  }

  if (filters.price_type) {
    const typeLabels: Record<string, string> = {
      fixed: 'Fixed Price',
      hourly: 'Hourly Rate',
      daily: 'Daily Rate',
      custom: 'Custom Pricing'
    }
    activeFilters.push({
      key: 'price_type',
      label: 'Service Type',
      value: typeLabels[filters.price_type]
    })
  }

  if (filters.available_date) {
    const date = new Date(filters.available_date)
    activeFilters.push({
      key: 'available_date',
      label: 'Available',
      value: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    })
  }

  if (activeFilters.length === 0) {
    return null
  }

  return (
    <div className={className}>
      <div className="flex items-center gap-3 flex-wrap">
        {/* Header */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="h-4 w-4" />
          <span className="font-medium">Active filters:</span>
        </div>

        {/* Filter chips */}
        <AnimatePresence mode="popLayout">
          {activeFilters.map((filter) => (
            <motion.div
              key={filter.key}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
              }}
            >
              <Badge
                variant="secondary"
                className="gap-2 pl-3 pr-2 py-1.5 text-sm"
              >
                <span className="font-medium">{filter.label}:</span>
                <span className="text-muted-foreground">{filter.value}</span>
                <button
                  onClick={() => onRemoveFilter(filter.key)}
                  className="ml-1 rounded-full hover:bg-background/50 p-0.5 transition-colors"
                  aria-label={`Remove ${filter.label} filter`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Clear all button */}
        {activeFilters.length > 1 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="h-auto py-1 px-2 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            Clear all
          </Button>
        )}
      </div>
    </div>
  )
}
