import { Button } from "@/Components/ui/button"
import { Globe, Menu, User, Search } from "lucide-react"
import { useState, useEffect } from "react"
import { SearchDropdown } from "./search-dropdown"

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
              <svg className="h-8 w-8 text-primary" viewBox="0 0 32 32" fill="currentColor">
                <path d="M16 1c-1.7 0-3.4.4-5 1.2-1.5.8-2.9 1.9-4 3.3-1.1 1.4-2 3-2.5 4.7-.5 1.8-.7 3.6-.5 5.4.2 1.8.8 3.5 1.7 5.1.9 1.5 2.1 2.9 3.5 4 1.4 1.1 3 1.9 4.7 2.4 1.7.5 3.5.6 5.3.4 1.8-.2 3.5-.8 5-1.7 1.5-.9 2.9-2.1 4-3.5 1.1-1.4 1.9-3 2.4-4.7.5-1.7.6-3.5.4-5.3-.2-1.8-.8-3.5-1.7-5-1.9-3.1-5-5.4-8.6-6.3C18.4 1.1 17.2 1 16 1zm0 2c1 0 2 .1 3 .4 3.1.8 5.7 2.8 7.3 5.4.8 1.3 1.3 2.8 1.5 4.3.2 1.5.1 3.1-.3 4.6-.4 1.5-1.1 2.9-2.1 4.1-.9 1.2-2.1 2.3-3.5 3-1.3.8-2.8 1.3-4.3 1.5-1.5.2-3.1.1-4.6-.3-1.5-.4-2.9-1.1-4.1-2.1-1.2-.9-2.2-2.1-3-3.5-.8-1.3-1.3-2.8-1.5-4.3-.2-1.5-.1-3.1.3-4.6.4-1.5 1.1-2.9 2.1-4.1.9-1.2 2.1-2.2 3.5-3C13.1 3.4 14.5 3 16 3z" />
              </svg>
              <span className="text-xl font-semibold text-primary font-[family-name:var(--font-heading)]">
                Kwika.Events
              </span>
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
            <Button variant="ghost" className="hidden md:flex text-sm font-medium">
              Become a provider
            </Button>
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
