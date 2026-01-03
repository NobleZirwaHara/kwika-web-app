import { Search } from "lucide-react"
import { useState } from "react"
import { SearchDropdown } from "./search-dropdown"
import { router } from "@inertiajs/react"

interface Category {
  id: number
  name: string
  slug: string
  description: string
  icon: string
}

interface CompactSearchBarProps {
  categories?: Category[]
  className?: string
  isMobile?: boolean
}

export function CompactSearchBar({ categories = [], className = "", isMobile = false }: CompactSearchBarProps) {
  const [activeField, setActiveField] = useState<"service" | "location" | "date" | null>(null)
  const [serviceValue, setServiceValue] = useState("")
  const [locationValue, setLocationValue] = useState("")
  const [dateValue, setDateValue] = useState("")

  const handleSelect = (value: string, categoryId?: number) => {
    if (activeField === "service") {
      setServiceValue(value)
      if (categoryId) {
        performSearch(value, locationValue, categoryId)
      }
    }
    if (activeField === "location") setLocationValue(value)
    if (activeField === "date") setDateValue(value)
    setActiveField(null)
  }

  const performSearch = (service?: string, location?: string, categoryId?: number) => {
    const params: any = {}
    const searchService = service || serviceValue
    const searchLocation = location || locationValue

    if (searchService) {
      const matchedCategory = categories.find(
        cat => cat.name.toLowerCase() === searchService.toLowerCase()
      )
      if (matchedCategory) {
        params.category = matchedCategory.id
      } else {
        params.query = searchService
      }
    }

    if (categoryId) {
      params.category = categoryId
    }

    if (searchLocation) {
      params.city = searchLocation
    }

    router.get('/search', params)
  }

  const handleSearchClick = () => {
    performSearch()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      performSearch()
    }
  }

  // Mobile layout - simplified single search input
  if (isMobile) {
    return (
      <div className={className}>
        <div className="flex items-center gap-2 rounded-full border border-border/50 bg-white dark:bg-card shadow-md px-4 py-2">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            type="text"
            value={serviceValue}
            onChange={(e) => setServiceValue(e.target.value)}
            onFocus={() => setActiveField("service")}
            onKeyPress={handleKeyPress}
            placeholder="Search services, locations..."
            className="flex-1 text-sm font-medium bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground min-w-0"
          />
          {(serviceValue || locationValue) && (
            <button
              onClick={handleSearchClick}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer shrink-0"
            >
              <Search className="h-4 w-4" />
            </button>
          )}
        </div>
        {activeField === "service" && (
          <div className="relative z-[60]">
            <SearchDropdown
              activeField="service"
              onClose={() => setActiveField(null)}
              onSelect={handleSelect}
              searchValue={serviceValue}
              categories={categories}
            />
          </div>
        )}
      </div>
    )
  }

  // Desktop layout
  return (
    <div className={className}>
      <div className="flex items-center gap-0 rounded-full border border-border/50 bg-white dark:bg-card shadow-md hover:shadow-lg transition-shadow">
        <div className="relative z-[60]">
          <input
            type="text"
            value={serviceValue}
            onChange={(e) => setServiceValue(e.target.value)}
            onFocus={() => setActiveField("service")}
            onKeyPress={handleKeyPress}
            placeholder="Service"
            className="px-6 py-3 text-sm font-medium hover:bg-primary/10 rounded-l-full transition-colors bg-transparent border-none outline-none w-32 cursor-pointer text-foreground placeholder:text-muted-foreground"
          />
          {activeField === "service" && (
            <SearchDropdown
              activeField="service"
              onClose={() => setActiveField(null)}
              onSelect={handleSelect}
              searchValue={serviceValue}
              categories={categories}
            />
          )}
        </div>

        <span className="text-muted-foreground">|</span>

        <div className="relative z-[60]">
          <input
            type="text"
            value={locationValue}
            onChange={(e) => setLocationValue(e.target.value)}
            onFocus={() => setActiveField("location")}
            onKeyPress={handleKeyPress}
            placeholder="Location"
            className="px-6 py-3 text-sm font-medium hover:bg-primary/10 transition-colors bg-transparent border-none outline-none w-32 cursor-pointer text-foreground placeholder:text-muted-foreground"
          />
          {activeField === "location" && (
            <SearchDropdown
              activeField="location"
              onClose={() => setActiveField(null)}
              onSelect={handleSelect}
              searchValue={locationValue}
              categories={categories}
            />
          )}
        </div>

        <span className="text-muted-foreground">|</span>

        <div className="relative z-[60]">
          <input
            type="text"
            value={dateValue}
            onChange={(e) => setDateValue(e.target.value)}
            onFocus={() => setActiveField("date")}
            onKeyPress={handleKeyPress}
            placeholder="Date"
            className="px-6 py-3 text-sm font-medium hover:bg-primary/10 transition-colors bg-transparent border-none outline-none w-32 cursor-pointer text-foreground placeholder:text-muted-foreground"
          />
          {activeField === "date" && (
            <SearchDropdown
              activeField="date"
              onClose={() => setActiveField(null)}
              onSelect={handleSelect}
              searchValue={dateValue}
              categories={categories}
            />
          )}
        </div>

        <button
          onClick={handleSearchClick}
          className="ml-2 mr-2 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
        >
          <Search className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
