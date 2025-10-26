import { Camera, Video, Palette, Music, UtensilsCrossed, Navigation, Building2, Landmark, Calendar } from "lucide-react"
import { Input } from "@/Components/ui/input"
import { useMemo } from "react"

interface SearchDropdownProps {
  activeField: "service" | "location" | "date"
  onClose: () => void
  onSelect: (value: string) => void
  searchValue: string
}

const serviceOptions = [
  { icon: Camera, name: "Photographers", description: "Capture your special moments", color: "text-blue-500" },
  { icon: Video, name: "Videographers", description: "Professional video coverage", color: "text-purple-500" },
  { icon: Palette, name: "Decorators", description: "Transform your venue", color: "text-pink-500" },
  { icon: Music, name: "PA Systems", description: "Sound and audio equipment", color: "text-orange-500" },
  { icon: UtensilsCrossed, name: "Catering", description: "Delicious food for your guests", color: "text-green-500" },
]

const locationOptions = [
  { icon: Navigation, name: "Nearby", description: "Find what's around you", color: "text-blue-500" },
  { icon: Building2, name: "Johannesburg, South Africa", description: "Popular business hub", color: "text-green-500" },
  {
    icon: Landmark,
    name: "Cape Town, South Africa",
    description: "Popular coastal destination",
    color: "text-red-500",
  },
  { icon: Building2, name: "Durban, South Africa", description: "Beautiful beachfront city", color: "text-teal-500" },
  { icon: Landmark, name: "Pretoria, South Africa", description: "Capital city venues", color: "text-purple-500" },
  { icon: Building2, name: "Nairobi, Kenya", description: "East African events", color: "text-orange-500" },
]

export function SearchDropdown({ activeField, onClose, onSelect, searchValue }: SearchDropdownProps) {
  const filteredServices = useMemo(() => {
    if (!searchValue) return serviceOptions
    return serviceOptions.filter((service) => service.name.toLowerCase().includes(searchValue.toLowerCase()))
  }, [searchValue])

  const filteredLocations = useMemo(() => {
    if (!searchValue) return locationOptions
    return locationOptions.filter((location) => location.name.toLowerCase().includes(searchValue.toLowerCase()))
  }, [searchValue])

  return (
    <>
      <div className="fixed inset-0 z-[100]" onClick={onClose} />

      <div className="absolute top-full left-0 mt-2 w-[420px] bg-background rounded-3xl shadow-2xl border border-border z-[110] animate-in fade-in slide-in-from-top-2 duration-200">
        <div className="p-6 max-h-[400px] overflow-y-auto">
          {activeField === "service" && (
            <div>
              <h3 className="text-sm font-semibold mb-4">Popular services</h3>
              <div className="space-y-2">
                {filteredServices.map((service) => (
                  <button
                    key={service.name}
                    onClick={() => onSelect(service.name)}
                    className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors text-left"
                  >
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-muted ${service.color}`}>
                      <service.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{service.name}</div>
                      <div className="text-sm text-muted-foreground">{service.description}</div>
                    </div>
                  </button>
                ))}
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
                    onClick={() => onSelect(location.name)}
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
              <Input type="date" className="w-full" onChange={(e) => onSelect(e.target.value)} />
              <div className="mt-4 space-y-2">
                <button
                  onClick={() => onSelect("This Weekend")}
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
                  onClick={() => onSelect("Next Month")}
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
