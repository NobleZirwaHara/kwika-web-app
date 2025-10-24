"use client"

import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { useState, useEffect } from "react"
import { SearchDropdown } from "./search-dropdown"

export function HeroSearch() {
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
                placeholder="Search photographers, decorators..."
                className="text-sm text-foreground bg-transparent border-none outline-none placeholder:text-muted-foreground/60"
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

            <div className="flex flex-1 flex-col px-6 py-3 border-r border-border relative z-[60]">
              <label className="text-xs font-semibold mb-1">Location</label>
              <input
                type="text"
                value={locationValue}
                onChange={(e) => setLocationValue(e.target.value)}
                onFocus={() => setActiveField("location")}
                placeholder="Where is your event?"
                className="text-sm text-foreground bg-transparent border-none outline-none placeholder:text-muted-foreground/60"
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

            <div className="flex flex-1 flex-col px-6 py-3 relative z-[60]">
              <label className="text-xs font-semibold mb-1">Date</label>
              <input
                type="text"
                value={dateValue}
                onChange={(e) => setDateValue(e.target.value)}
                onFocus={() => setActiveField("date")}
                placeholder="Add dates"
                className="text-sm text-foreground bg-transparent border-none outline-none placeholder:text-muted-foreground/60"
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

            <Button size="lg" className="rounded-full h-14 w-14 sm:h-12 sm:w-12 shrink-0">
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
