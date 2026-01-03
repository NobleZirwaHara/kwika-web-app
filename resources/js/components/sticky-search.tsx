import { Button } from "@/Components/ui/button"
import { Search, MapPin, Calendar } from "lucide-react"
import { useState, useEffect } from "react"
import { SearchDropdown } from "./search-dropdown"
import { router } from "@inertiajs/react"

interface Category {
  id: number
  name: string
  slug: string
  description: string
  icon: string
}

interface StickySearchProps {
  categories?: Category[]
}

export function StickySearch({ categories = [] }: StickySearchProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeField, setActiveField] = useState<"service" | "location" | "date" | null>(null)
  const [serviceValue, setServiceValue] = useState("")
  const [locationValue, setLocationValue] = useState("")
  const [dateValue, setDateValue] = useState("")

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

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

  return (
    <section
      className={`transition-all duration-300 relative ${
        isScrolled
          ? 'fixed top-0 left-0 right-0 z-[60] bg-background border-b shadow-md'
          : 'relative z-[60]'
      }`}
    >
      <div className={`container mx-auto px-6 lg:px-20 ${isScrolled ? 'py-3' : 'py-6'}`}>
        <div className="mx-auto max-w-4xl">
          {/* Compact Search - Always Visible */}
          <div className="relative">
            <div className="flex items-center gap-2 rounded-full border border-border bg-background p-2 shadow-xl">
              <div className="flex flex-1 items-center gap-2 px-4 py-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={serviceValue}
                  onChange={(e) => setServiceValue(e.target.value)}
                  onFocus={() => setActiveField("service")}
                  onKeyPress={handleKeyPress}
                  placeholder="What service are you looking for?"
                  className="flex-1 text-sm bg-transparent border-none outline-none placeholder:text-muted-foreground/60"
                />
              </div>

              <div className="h-6 w-px bg-border"></div>

              <div className="flex flex-1 items-center gap-2 px-4 py-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={locationValue}
                  onChange={(e) => setLocationValue(e.target.value)}
                  onFocus={() => setActiveField("location")}
                  onKeyPress={handleKeyPress}
                  placeholder="Where?"
                  className="flex-1 text-sm bg-transparent border-none outline-none placeholder:text-muted-foreground/60"
                />
              </div>

              <div className="h-6 w-px bg-border"></div>

              <div className="flex flex-1 items-center gap-2 px-4 py-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={dateValue}
                  onChange={(e) => setDateValue(e.target.value)}
                  onFocus={() => setActiveField("date")}
                  onKeyPress={handleKeyPress}
                  placeholder="When?"
                  className="flex-1 text-sm bg-transparent border-none outline-none placeholder:text-muted-foreground/60"
                />
              </div>

              <Button size="lg" className="rounded-full shrink-0" onClick={handleSearchClick}>
                <Search className="h-4 w-4" />
              </Button>
            </div>

            {/* Dropdown for active field */}
            {activeField && (
              <SearchDropdown
                activeField={activeField}
                onClose={() => setActiveField(null)}
                onSelect={handleSelect}
                searchValue={activeField === "service" ? serviceValue : locationValue}
                categories={categories}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
