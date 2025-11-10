import { Button } from "@/Components/ui/button"
import { Globe, Menu, User, Search } from "lucide-react"
import { useState, useEffect } from "react"
import { SearchDropdown } from "./search-dropdown"
import { Link } from '@inertiajs/react'

export function Header() {
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

  const handleSelect = (value: string) => {
    if (activeField === "service") setServiceValue(value)
    if (activeField === "location") setLocationValue(value)
    if (activeField === "date") setDateValue(value)
    setActiveField(null)
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-background transition-all duration-300 ${
        isScrolled ? "border-b shadow-sm" : ""
      }`}
    >
      <div className="container mx-auto px-6 lg:px-20">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center gap-10">
            <a href="/" className="flex items-center gap-2">
              <img src="/kwika-logo.png" alt="Logo" width={100} />
            </a>

            <div
              className={`hidden lg:block transition-all duration-300 absolute left-1/2 -translate-x-1/2 ${
                isScrolled ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
              }`}
            >
              <div className="flex items-center gap-0 rounded-full border border-border bg-background shadow-md hover:shadow-lg transition-shadow">
                <div className="relative z-[60]">
                  <input
                    type="text"
                    value={serviceValue}
                    onChange={(e) => setServiceValue(e.target.value)}
                    onFocus={() => setActiveField("service")}
                    placeholder="Service"
                    className="px-6 py-2 text-sm font-medium hover:bg-muted/30 rounded-l-full transition-colors bg-transparent border-none outline-none w-32"
                  />
                  {activeField === "service" && (
                    <SearchDropdown
                      activeField="service"
                      onClose={() => setActiveField(null)}
                      onSelect={handleSelect}
                      searchValue={serviceValue}
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
                    placeholder="Location"
                    className="px-6 py-2 text-sm font-medium hover:bg-muted/30 transition-colors bg-transparent border-none outline-none w-32"
                  />
                  {activeField === "location" && (
                    <SearchDropdown
                      activeField="location"
                      onClose={() => setActiveField(null)}
                      onSelect={handleSelect}
                      searchValue={locationValue}
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
                    placeholder="Date"
                    className="px-6 py-2 text-sm font-medium hover:bg-muted/30 transition-colors bg-transparent border-none outline-none w-32"
                  />
                  {activeField === "date" && (
                    <SearchDropdown
                      activeField="date"
                      onClose={() => setActiveField(null)}
                      onSelect={handleSelect}
                      searchValue={dateValue}
                    />
                  )}
                </div>

                <div className="ml-2 mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Search className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/onboarding/welcome">
              <Button variant="ghost" className="hidden md:flex text-sm font-medium">
                Become a provider
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Globe className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="gap-2 rounded-full border-border pl-3 pr-3 py-2 bg-transparent">
              <Menu className="h-4 w-4" />
              <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center">
                <User className="h-4 w-4" />
              </div>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
