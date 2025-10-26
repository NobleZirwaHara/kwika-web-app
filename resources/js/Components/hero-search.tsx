import { Button } from "@/Components/ui/button"
import { Search } from "lucide-react"
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

interface HeroSearchProps {
  categories?: Category[]
}

export function HeroSearch({ categories = [] }: HeroSearchProps) {
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
      // If a category ID is provided, perform search immediately
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

    // Build search query from service value or passed service
    const searchService = service || serviceValue
    const searchLocation = location || locationValue

    if (searchService) {
      // Check if the service matches a category name
      const matchedCategory = categories.find(
        cat => cat.name.toLowerCase() === searchService.toLowerCase()
      )

      if (matchedCategory) {
        params.category = matchedCategory.id
      } else {
        params.query = searchService
      }
    }

    // Use categoryId if provided directly
    if (categoryId) {
      params.category = categoryId
    }

    if (searchLocation) {
      params.city = searchLocation
    }

    // Navigate to search page with parameters
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
      className={`border-b bg-background pt-6 pb-12 transition-all duration-300 relative z-[60] ${
        isScrolled ? "opacity-0 -translate-y-4" : "opacity-100 translate-y-0"
      }`}
    >
      <div className="absolute inset-0 z-0">
        <img src="/elegant-outdoor-event-setup.jpg" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-accent/75" />
      </div>

      <div className="container mx-auto px-6 lg:px-20 relative z-10">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col gap-4 rounded-full border border-border bg-background p-2 shadow-xl sm:flex-row sm:items-center relative z-[60]">
            <div className="flex flex-1 flex-col px-6 py-3 border-r border-border relative z-[60]">
              <label className="text-xs font-semibold mb-1">Service</label>
              <input
                type="text"
                value={serviceValue}
                onChange={(e) => setServiceValue(e.target.value)}
                onFocus={() => setActiveField("service")}
                onKeyPress={handleKeyPress}
                placeholder="Search photographers, decorators..."
                className="text-sm text-foreground bg-transparent border-none outline-none placeholder:text-muted-foreground/60"
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

            <div className="flex flex-1 flex-col px-6 py-3 border-r border-border relative z-[60]">
              <label className="text-xs font-semibold mb-1">Location</label>
              <input
                type="text"
                value={locationValue}
                onChange={(e) => setLocationValue(e.target.value)}
                onFocus={() => setActiveField("location")}
                onKeyPress={handleKeyPress}
                placeholder="Where is your event?"
                className="text-sm text-foreground bg-transparent border-none outline-none placeholder:text-muted-foreground/60"
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

            <div className="flex flex-1 flex-col px-6 py-3 relative z-[60]">
              <label className="text-xs font-semibold mb-1">Date</label>
              <input
                type="text"
                value={dateValue}
                onChange={(e) => setDateValue(e.target.value)}
                onFocus={() => setActiveField("date")}
                onKeyPress={handleKeyPress}
                placeholder="Add dates"
                className="text-sm text-foreground bg-transparent border-none outline-none placeholder:text-muted-foreground/60"
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

            <Button size="lg" className="rounded-full h-14 w-14 sm:h-12 sm:w-12 shrink-0" onClick={handleSearchClick}>
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
