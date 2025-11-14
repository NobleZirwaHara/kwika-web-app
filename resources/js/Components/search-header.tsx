import { Link } from "@inertiajs/react"
import { Button } from "@/Components/ui/button"
import { Search, MapPin, Calendar, User, Menu, X, Globe } from "lucide-react"
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

interface SearchHeaderProps {
  categories?: Category[]
  user?: any
}

export function SearchHeader({ categories = [], user }: SearchHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeField, setActiveField] = useState<"service" | "location" | "date" | null>(null)
  const [serviceValue, setServiceValue] = useState("")
  const [locationValue, setLocationValue] = useState("")
  const [dateValue, setDateValue] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleExpandSearch = () => {
    setIsExpanded(true)
  }

  const handleCollapseSearch = () => {
    setIsExpanded(false)
    setActiveField(null)
  }

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
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/95 backdrop-blur-md shadow-md' : 'bg-background border-b'
      }`}
    >
      <div className="container mx-auto px-6 lg:px-20">
        <div className="flex items-center justify-between gap-6 h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img src="/kwika-logo.png" alt="Logo" width={100} />
          </Link>

          {/* Search Bar - Desktop Only */}
          <div className="hidden md:flex flex-1 max-w-2xl relative">
            {!isScrolled && !isExpanded ? (
              /* Compact Search - Before Scroll */
              <button
                onClick={handleExpandSearch}
                className="w-full flex items-center justify-between gap-4 rounded-full border border-border bg-background px-6 py-3 shadow-xl hover:shadow-2xl transition-shadow"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="text-left">
                    <p className="text-sm font-semibold">
                      {locationValue || "Anywhere"}
                    </p>
                  </div>
                  <div className="h-6 w-px bg-border"></div>
                  <div className="text-left">
                    <p className="text-sm font-semibold">
                      {dateValue || "Any week"}
                    </p>
                  </div>
                  <div className="h-6 w-px bg-border"></div>
                  <div className="text-left flex-1">
                    <p className="text-sm text-muted-foreground">
                      {serviceValue || "Add service"}
                    </p>
                  </div>
                </div>
                <div className="bg-primary text-primary-foreground rounded-full p-2">
                  <Search className="h-4 w-4" />
                </div>
              </button>
            ) : (
              /* Expanded Search - After Scroll or Click */
              <div className="w-full">
                <div className="flex items-center rounded-full border border-border bg-background shadow-lg hover:shadow-xl transition-shadow p-2">
                  <div className="flex flex-1 items-center gap-2 px-3 py-1">
                    <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                    <input
                      type="text"
                      value={serviceValue}
                      onChange={(e) => setServiceValue(e.target.value)}
                      onFocus={() => setActiveField("service")}
                      onKeyPress={handleKeyPress}
                      placeholder="What service?"
                      className="flex-1 text-sm bg-transparent border-none outline-none placeholder:text-muted-foreground/60"
                    />
                  </div>

                  <div className="h-6 w-px bg-border"></div>

                  <div className="flex flex-1 items-center gap-2 px-3 py-1">
                    <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
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

                  <div className="flex flex-1 items-center gap-2 px-3 py-1">
                    <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
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
                    onClose={handleCollapseSearch}
                    onSelect={handleSelect}
                    searchValue={activeField === "service" ? serviceValue : locationValue}
                    categories={categories}
                  />
                )}
              </div>
            )}
          </div>

          {/* Right Side - Desktop */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <Link href="/onboarding/welcome">
              <Button variant="ghost" className="text-sm font-medium">
                Become a provider
              </Button>
            </Link>

            <Button variant="ghost" size="icon" className="rounded-full">
              <Globe className="h-4 w-4" />
            </Button>

            {user ? (
              <Link href="/provider/dashboard">
                <Button variant="outline" className="gap-2 rounded-full border-border pl-3 pr-3 py-2 bg-transparent">
                  <Menu className="h-4 w-4" />
                  <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button variant="outline" className="gap-2 rounded-full border-border pl-3 pr-3 py-2 bg-transparent">
                  <Menu className="h-4 w-4" />
                  <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            variant="outline"
            className="md:hidden gap-2 rounded-full border-border pl-3 pr-3 py-2 bg-transparent"
          >
            <Menu className="h-4 w-4" />
            <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center">
              <User className="h-4 w-4" />
            </div>
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t py-4 space-y-4">
            {/* Mobile Search */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 rounded-lg border border-border bg-background p-3">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={serviceValue}
                  onChange={(e) => setServiceValue(e.target.value)}
                  placeholder="What service?"
                  className="flex-1 text-sm bg-transparent border-none outline-none"
                />
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-border bg-background p-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={locationValue}
                  onChange={(e) => setLocationValue(e.target.value)}
                  placeholder="Where?"
                  className="flex-1 text-sm bg-transparent border-none outline-none"
                />
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-border bg-background p-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={dateValue}
                  onChange={(e) => setDateValue(e.target.value)}
                  placeholder="When?"
                  className="flex-1 text-sm bg-transparent border-none outline-none"
                />
              </div>
              <Button className="w-full" onClick={handleSearchClick}>
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>

            {/* Mobile Links */}
            <div className="space-y-2 border-t pt-4">
              <Link href="/onboarding/welcome">
                <Button variant="ghost" className="w-full justify-start text-sm font-medium">
                  Become a provider
                </Button>
              </Link>
              {user ? (
                <Link href="/provider/dashboard">
                  <Button variant="ghost" className="w-full justify-start gap-2 text-sm font-medium">
                    <User className="h-4 w-4" />
                    {user.name}
                  </Button>
                </Link>
              ) : (
                <Link href="/login">
                  <Button variant="ghost" className="w-full justify-start gap-2 text-sm font-medium">
                    <User className="h-4 w-4" />
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
