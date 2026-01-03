import { Button } from "@/components/ui/button"
import { Search, MapPin, Calendar, Users, X } from "lucide-react"
import { useState, useEffect } from "react"
import { SearchDropdown } from "./search-dropdown"
import { router } from "@inertiajs/react"
import { Dialog, DialogContent } from "@/components/ui/dialog"

interface Subcategory {
  id: number
  name: string
}

interface Category {
  id: number
  name: string
  slug: string
  description: string
  icon: string
  subcategories: Subcategory[]
}

interface HeroSearchProps {
  categories?: Category[]
}

export function HeroSearch({ categories = [] }: HeroSearchProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeField, setActiveField] = useState<"service" | "location" | "date" | null>(null)
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false)
  const [serviceValue, setServiceValue] = useState("")
  const [locationValue, setLocationValue] = useState("")
  const [dateValue, setDateValue] = useState("")
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)

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
      // Store the category ID for later use when search is submitted
      if (categoryId) {
        setSelectedCategoryId(categoryId)
      }
    }
    if (activeField === "location") setLocationValue(value)
    if (activeField === "date") setDateValue(value)
    setActiveField(null)
  }

  const performSearch = () => {
    const params: any = {}

    // Use the stored category ID if available
    if (selectedCategoryId) {
      params.category = selectedCategoryId
    } else if (serviceValue) {
      // If no category ID stored, try to match the service value to a category/subcategory
      let matchedId = null

      // First check parent categories
      const matchedParent = categories.find(
        cat => cat.name.toLowerCase() === serviceValue.toLowerCase()
      )

      if (matchedParent) {
        matchedId = matchedParent.id
      } else {
        // Check subcategories
        for (const category of categories) {
          const matchedSubcategory = category.subcategories?.find(
            sub => sub.name.toLowerCase() === serviceValue.toLowerCase()
          )
          if (matchedSubcategory) {
            matchedId = matchedSubcategory.id
            break
          }
        }
      }

      if (matchedId) {
        params.category = matchedId
      } else {
        params.query = serviceValue
      }
    }

    if (locationValue) {
      params.city = locationValue
    }

    // Navigate to search page with parameters
    router.get('/search', params)
  }

  const handleSearchClick = () => {
    performSearch()
    setIsMobileModalOpen(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      performSearch()
    }
  }

  const handleClearAll = () => {
    setServiceValue("")
    setLocationValue("")
    setDateValue("")
  }

  const hasAnyValue = serviceValue || locationValue || dateValue

  return (
    <>
      <section
        className={`border-b bg-background pt-6 pb-12 transition-all duration-300 relative z-[60] ${
          isScrolled || isMobileModalOpen ? "opacity-0 -translate-y-4 pointer-events-none" : "opacity-100 translate-y-0"
        }`}
      >
        <div className="absolute inset-0 z-0">
          <img src="./top-search-image.webp" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-background/85"></div>
        </div>

        <div className="container mx-auto px-6 lg:px-20 relative z-10 py-10
        ">
          <div className="mx-auto max-w-4xl">
            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground text-center mb-8">
              {/* Everything events <br></br>in one place.. */}
              Plan your events... kwika
            </h1>

            {/* Mobile - Search handled by sticky mobile nav */}

          {/* Desktop Search */}
          <div className="hidden md:block">
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
      </div>
    </section>

      {/* Mobile Search Modal */}
      <Dialog open={isMobileModalOpen} onOpenChange={setIsMobileModalOpen}>
        <DialogContent className="max-w-full h-full m-0 p-0 rounded-none">
          <div className="flex flex-col h-full bg-background">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <button onClick={() => setIsMobileModalOpen(false)}>
                <X className="h-6 w-6" />
              </button>
              <h2 className="text-lg font-semibold">Search</h2>
              <div className="w-6" />
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Where Section */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-4">Where?</h3>
                <div className="relative">
                  <Search className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={locationValue}
                    onChange={(e) => setLocationValue(e.target.value)}
                    onFocus={() => setActiveField("location")}
                    placeholder="Search destinations"
                    className="w-full pl-12 pr-4 py-4 border border-border rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                {activeField === "location" && (
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold mb-3">Suggested destinations</h4>
                    <SearchDropdown
                      activeField="location"
                      onClose={() => setActiveField(null)}
                      onSelect={handleSelect}
                      searchValue={locationValue}
                      categories={categories}
                    />
                  </div>
                )}
              </div>

              {/* When Section */}
              <div className="mb-6 py-6 border-t">
                <div className="flex items-center justify-between cursor-pointer" onClick={() => setActiveField("date")}>
                  <div>
                    <h3 className="text-lg font-semibold">When</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {dateValue || "Add dates"}
                  </p>
                </div>
                {activeField === "date" && (
                  <div className="mt-4">
                    <input
                      type="date"
                      value={dateValue}
                      onChange={(e) => setDateValue(e.target.value)}
                      className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                )}
              </div>

              {/* Who Section */}
              <div className="py-6 border-t">
                <div className="flex items-center justify-between cursor-pointer" onClick={() => setActiveField("service")}>
                  <div>
                    <h3 className="text-lg font-semibold">What service?</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {serviceValue || "Select service"}
                  </p>
                </div>
                {activeField === "service" && (
                  <div className="mt-4">
                    <input
                      type="text"
                      value={serviceValue}
                      onChange={(e) => setServiceValue(e.target.value)}
                      placeholder="Search photographers, decorators..."
                      className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <div className="mt-4">
                      <SearchDropdown
                        activeField="service"
                        onClose={() => setActiveField(null)}
                        onSelect={handleSelect}
                        searchValue={serviceValue}
                        categories={categories}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t p-4 flex items-center justify-between bg-background">
              <button
                onClick={handleClearAll}
                className="text-sm font-semibold underline"
                disabled={!hasAnyValue}
              >
                Clear all
              </button>
              <Button
                size="lg"
                className="rounded-full px-8"
                onClick={handleSearchClick}
              >
                <Search className="h-5 w-5 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
