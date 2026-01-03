import { Search, X, Star } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useState, useEffect } from "react"
import { useDebouncedCallback } from "use-debounce"
import type { FilterState } from "./ActiveFilters"

interface Category {
  id: number
  name: string
  subcategories?: Array<{ id: number; name: string }>
}

interface FilterPanelProps {
  filters: FilterState
  categories: Category[]
  cities: string[]
  onFilterChange: (filters: Partial<FilterState>) => void
  onClearAll: () => void
  className?: string
}

export function FilterPanel({
  filters,
  categories,
  cities,
  onFilterChange,
  onClearAll,
  className
}: FilterPanelProps) {
  const [searchQuery, setSearchQuery] = useState(filters.query || '')
  const [priceRange, setPriceRange] = useState<[number, number]>([
    filters.min_price || 0,
    filters.max_price || 1000000
  ])
  const [selectedParentCategory, setSelectedParentCategory] = useState<number | null>(null)

  // Debounced search
  const debouncedSearch = useDebouncedCallback((value: string) => {
    onFilterChange({ query: value || undefined })
  }, 300)

  // Debounced price range
  const debouncedPriceChange = useDebouncedCallback((value: [number, number]) => {
    onFilterChange({
      min_price: value[0] > 0 ? value[0] : undefined,
      max_price: value[1] < 1000000 ? value[1] : undefined
    })
  }, 500)

  useEffect(() => {
    setSearchQuery(filters.query || '')
  }, [filters.query])

  useEffect(() => {
    setPriceRange([
      filters.min_price || 0,
      filters.max_price || 1000000
    ])
  }, [filters.min_price, filters.max_price])

  // Find parent category for selected category
  useEffect(() => {
    if (filters.category) {
      const parent = categories.find(cat =>
        cat.subcategories?.some(sub => sub.id === filters.category)
      )
      if (parent) {
        setSelectedParentCategory(parent.id)
      } else {
        // Check if it's a parent category
        const isParent = categories.find(cat => cat.id === filters.category)
        if (isParent) {
          setSelectedParentCategory(filters.category)
        }
      }
    }
  }, [filters.category, categories])

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    debouncedSearch(value)
  }

  const handlePriceRangeChange = (value: [number, number]) => {
    setPriceRange(value)
    debouncedPriceChange(value)
  }

  const handleParentCategoryChange = (value: string) => {
    const categoryId = parseInt(value)
    setSelectedParentCategory(categoryId)
    onFilterChange({ category: undefined }) // Reset subcategory when parent changes
  }

  const handleSubcategoryChange = (value: string) => {
    const categoryId = value ? parseInt(value) : undefined
    onFilterChange({ category: categoryId })
  }

  const ratingOptions = [5, 4, 3, 2]

  const priceTypeOptions = [
    { value: 'fixed', label: 'Fixed Price' },
    { value: 'hourly', label: 'Hourly Rate' },
    { value: 'daily', label: 'Daily Rate' },
    { value: 'custom', label: 'Custom' },
  ]

  const formatPrice = (price: number) => {
    return `MWK ${(price / 1000).toFixed(0)}k`
  }

  const selectedSubcategories = selectedParentCategory
    ? categories.find(cat => cat.id === selectedParentCategory)?.subcategories || []
    : []

  const hasActiveFilters = !!(
    filters.query ||
    filters.category ||
    filters.city ||
    filters.min_price ||
    filters.max_price ||
    filters.min_rating ||
    filters.price_type ||
    filters.available_date
  )

  return (
    <Card className={className}>
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Filters</CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              className="h-auto py-1 px-2 text-xs"
            >
              Clear all
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search providers or services..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9"
            />
            {searchQuery && (
              <button
                onClick={() => handleSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <Separator />

        {/* Category */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Category</Label>
            {selectedParentCategory && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedParentCategory(null)
                  onFilterChange({ category: undefined })
                }}
                className="h-auto py-1 px-2 text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                Clear
              </Button>
            )}
          </div>
          <Select value={selectedParentCategory?.toString()} onValueChange={handleParentCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedSubcategories.length > 0 && (
            <>
              <div className="flex items-center justify-between">
                <Label className="text-sm text-muted-foreground">Subcategory</Label>
                {filters.category && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onFilterChange({ category: undefined })}
                    className="h-auto py-1 px-2 text-xs"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Clear
                  </Button>
                )}
              </div>
              <Select
                value={filters.category?.toString()}
                onValueChange={handleSubcategoryChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subcategory" />
                </SelectTrigger>
                <SelectContent>
                  {selectedSubcategories.map((subcategory) => (
                    <SelectItem key={subcategory.id} value={subcategory.id.toString()}>
                      {subcategory.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          )}
        </div>

        <Separator />

        {/* Location */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="city">Location</Label>
            {filters.city && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onFilterChange({ city: undefined })}
                className="h-auto py-1 px-2 text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                Clear
              </Button>
            )}
          </div>
          <Select value={filters.city} onValueChange={(value) => onFilterChange({ city: value || undefined })}>
            <SelectTrigger id="city">
              <SelectValue placeholder="All locations" />
            </SelectTrigger>
            <SelectContent>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Price Range */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Price Range</Label>
            <span className="text-sm text-muted-foreground">
              {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
            </span>
          </div>
          <Slider
            value={priceRange}
            onValueChange={handlePriceRangeChange}
            min={0}
            max={1000000}
            step={10000}
            className="pt-2"
          />
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>MWK 0</span>
            <span className="flex-1 border-t" />
            <span>MWK 1M+</span>
          </div>
        </div>

        <Separator />

        {/* Rating */}
        <div className="space-y-3">
          <Label>Minimum Rating</Label>
          <div className="space-y-2">
            {ratingOptions.map((rating) => (
              <div key={rating} className="flex items-center space-x-2">
                <Checkbox
                  id={`rating-${rating}`}
                  checked={filters.min_rating === rating}
                  onCheckedChange={(checked) => {
                    onFilterChange({ min_rating: checked ? rating : undefined })
                  }}
                />
                <label
                  htmlFor={`rating-${rating}`}
                  className="flex items-center gap-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  <Star className="h-4 w-4 fill-foreground text-foreground" />
                  <span>{rating}+ stars</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Service Type */}
        <div className="space-y-3">
          <Label>Service Type</Label>
          <RadioGroup
            value={filters.price_type || ''}
            onValueChange={(value) => onFilterChange({ price_type: value as any || undefined })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="" id="type-all" />
              <label htmlFor="type-all" className="text-sm font-medium cursor-pointer">
                All types
              </label>
            </div>
            {priceTypeOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`type-${option.value}`} />
                <label htmlFor={`type-${option.value}`} className="text-sm font-medium cursor-pointer">
                  {option.label}
                </label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <Separator />

        {/* Availability Date */}
        <div className="space-y-2">
          <Label htmlFor="available_date">Availability Date</Label>
          <Input
            id="available_date"
            type="date"
            value={filters.available_date || ''}
            onChange={(e) => onFilterChange({ available_date: e.target.value || undefined })}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
      </CardContent>
    </Card>
  )
}
