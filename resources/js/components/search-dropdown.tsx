import { Camera, Video, Palette, Music, UtensilsCrossed, Navigation, Building2, Landmark, Calendar, Sparkles, Flower, Disc, MapPin } from "lucide-react"
import { Input } from "@/Components/ui/input"
import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"

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
  subcategories?: Subcategory[]
}

interface SearchDropdownProps {
  activeField: "service" | "location" | "date"
  onClose: () => void
  onSelect: (value: string, categoryId?: number, type?: 'category' | 'location' | 'date') => void
  searchValue: string
  categories?: Category[]
  floating?: boolean // When true, renders without backdrop and absolute positioning
}

const iconMap: Record<string, any> = {
  camera: Camera,
  video: Video,
  sparkles: Sparkles,
  music: Music,
  utensils: UtensilsCrossed,
  flower: Flower,
  building: Building2,
  disc: Disc,
}

const colorMap = [
  "text-blue-500",
  "text-purple-500",
  "text-pink-500",
  "text-orange-500",
  "text-green-500",
  "text-teal-500",
  "text-red-500",
]

const locationOptions = [
  { icon: Navigation, name: "Nearby", description: "Find what's around you", color: "text-blue-500" },
  { icon: Building2, name: "Lilongwe", description: "Capital city", color: "text-green-500" },
  { icon: Landmark, name: "Blantyre", description: "Commercial hub", color: "text-red-500" },
  { icon: Building2, name: "Mzuzu", description: "Northern region", color: "text-teal-500" },
  { icon: Landmark, name: "Zomba", description: "Old capital", color: "text-purple-500" },
]

export function SearchDropdown({ activeField: initialActiveField, onClose, onSelect, searchValue, categories = [], floating = false }: SearchDropdownProps) {
  const [activeField, setActiveField] = useState(initialActiveField)
  const filteredCategories = useMemo(() => {
    if (!searchValue) return categories

    // Filter categories and subcategories based on search
    return categories
      .map(category => {
        const matchingSubcategories = (category.subcategories || []).filter(sub =>
          sub.name.toLowerCase().includes(searchValue.toLowerCase())
        )

        if (category.name.toLowerCase().includes(searchValue.toLowerCase()) || matchingSubcategories.length > 0) {
          return {
            ...category,
            subcategories: matchingSubcategories.length > 0 ? matchingSubcategories : category.subcategories
          }
        }
        return null
      })
      .filter(Boolean) as Category[]
  }, [searchValue, categories])

  const filteredLocations = useMemo(() => {
    if (!searchValue) return locationOptions
    return locationOptions.filter((location) => location.name.toLowerCase().includes(searchValue.toLowerCase()))
  }, [searchValue])

  // For floating mode, render full component with tabs
  if (floating) {
    return (
      <div className="w-full bg-background rounded-3xl shadow-2xl border border-border overflow-hidden">
        {/* Tab Navigation */}
        <div className="flex border-b border-border">
          <button
            type="button"
            onClick={() => setActiveField("service")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors",
              activeField === "service"
                ? "text-primary border-b-2 border-primary bg-primary/5"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <Camera className="h-4 w-4" />
            Category
          </button>
          <button
            type="button"
            onClick={() => setActiveField("location")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors",
              activeField === "location"
                ? "text-primary border-b-2 border-primary bg-primary/5"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <MapPin className="h-4 w-4" />
            Location
          </button>
          <button
            type="button"
            onClick={() => setActiveField("date")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors",
              activeField === "date"
                ? "text-primary border-b-2 border-primary bg-primary/5"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <Calendar className="h-4 w-4" />
            Date
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 max-h-[400px] overflow-y-auto">
          {activeField === "service" && (
            <div>
              <h3 className="text-sm font-semibold mb-4">Browse by category</h3>
              <div className="space-y-4">
                {filteredCategories.map((category, categoryIndex) => {
                  const Icon = iconMap[category.icon] || Camera
                  const color = colorMap[categoryIndex % colorMap.length]

                  return (
                    <div key={category.id}>
                      <div className="flex items-center gap-2 mb-2 px-2">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-muted ${color}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <h4 className="font-semibold text-sm">{category.name}</h4>
                      </div>

                      {category.subcategories && category.subcategories.length > 0 && (
                        <div className="ml-10 space-y-1">
                          {category.subcategories.map((subcategory) => (
                            <button
                              key={subcategory.id}
                              onClick={() => onSelect(subcategory.name, subcategory.id, 'category')}
                              className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors text-sm"
                            >
                              {subcategory.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {activeField === "location" && (
            <div>
              <h3 className="text-sm font-semibold mb-4">Suggested destinations</h3>
              <div className="space-y-2">
                {filteredLocations.map((location) => (
                  <button
                    key={location.name}
                    onClick={() => onSelect(location.name, undefined, 'location')}
                    className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors text-left"
                  >
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-muted ${location.color}`}>
                      <location.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{location.name}</div>
                      <div className="text-sm text-muted-foreground">{location.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeField === "date" && (
            <div>
              <h3 className="text-sm font-semibold mb-4">Select event date</h3>
              <Input type="date" className="w-full" onChange={(e) => onSelect(e.target.value, undefined, 'date')} />
              <div className="mt-4 space-y-2">
                <button
                  onClick={() => onSelect("This Weekend", undefined, 'date')}
                  className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors text-left"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-blue-500">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">This Weekend</div>
                    <div className="text-sm text-muted-foreground">Find providers available soon</div>
                  </div>
                </button>
                <button
                  onClick={() => onSelect("Next Month", undefined, 'date')}
                  className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors text-left"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-green-500">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Next Month</div>
                    <div className="text-sm text-muted-foreground">Plan ahead for your event</div>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="fixed inset-0 z-[100]" onClick={onClose} />

      <div className="absolute top-full left-0 mt-2 w-[420px] bg-background rounded-3xl shadow-2xl border border-border z-[110] animate-in fade-in slide-in-from-top-2 duration-200">
        <div className="p-6 max-h-[400px] overflow-y-auto">
          {activeField === "service" && (
            <div>
              <h3 className="text-sm font-semibold mb-4">Browse by category</h3>
              <div className="space-y-4">
                {filteredCategories.map((category, categoryIndex) => {
                  const Icon = iconMap[category.icon] || Camera
                  const color = colorMap[categoryIndex % colorMap.length]

                  return (
                    <div key={category.id}>
                      {/* Parent Category Header */}
                      <div className="flex items-center gap-2 mb-2 px-2">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-muted ${color}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <h4 className="font-semibold text-sm">{category.name}</h4>
                      </div>

                      {/* Subcategories */}
                      {category.subcategories && category.subcategories.length > 0 && (
                        <div className="ml-10 space-y-1">
                          {category.subcategories.map((subcategory) => (
                            <button
                              key={subcategory.id}
                              onClick={() => onSelect(subcategory.name, subcategory.id, 'category')}
                              className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors text-sm"
                            >
                              {subcategory.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {activeField === "location" && (
            <div>
              <h3 className="text-sm font-semibold mb-4">Suggested destinations</h3>
              <div className="space-y-2">
                {filteredLocations.map((location) => (
                  <button
                    key={location.name}
                    onClick={() => onSelect(location.name, undefined, 'location')}
                    className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors text-left"
                  >
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-muted ${location.color}`}>
                      <location.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{location.name}</div>
                      <div className="text-sm text-muted-foreground">{location.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeField === "date" && (
            <div>
              <h3 className="text-sm font-semibold mb-4">Select event date</h3>
              <Input type="date" className="w-full" onChange={(e) => onSelect(e.target.value, undefined, 'date')} />
              <div className="mt-4 space-y-2">
                <button
                  onClick={() => onSelect("This Weekend", undefined, 'date')}
                  className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors text-left"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-blue-500">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">This Weekend</div>
                    <div className="text-sm text-muted-foreground">Find providers available soon</div>
                  </div>
                </button>
                <button
                  onClick={() => onSelect("Next Month", undefined, 'date')}
                  className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors text-left"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-green-500">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Next Month</div>
                    <div className="text-sm text-muted-foreground">Plan ahead for your event</div>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
