import { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { MapPin, X, Search, Navigation } from 'lucide-react'
import { cn } from '@/lib/utils'

// Fix Leaflet's default icon issue with webpack
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

interface LocationPickerProps {
  value: string
  onChange: (location: string, coordinates?: { lat: number; lng: number }) => void
  placeholder?: string
  className?: string
  error?: string
  label?: string
  required?: boolean
  showCoordinates?: boolean
}

interface Coordinates {
  lat: number
  lng: number
}

// Component to handle map clicks and marker dragging
function LocationMarker({
  position,
  setPosition,
  onPositionChange,
}: {
  position: Coordinates | null
  setPosition: (pos: Coordinates) => void
  onPositionChange: (pos: Coordinates) => void
}) {
  const markerRef = useRef<L.Marker>(null)

  useMapEvents({
    click(e) {
      const newPos = { lat: e.latlng.lat, lng: e.latlng.lng }
      setPosition(newPos)
      onPositionChange(newPos)
    },
  })

  const eventHandlers = {
    dragend() {
      const marker = markerRef.current
      if (marker != null) {
        const pos = marker.getLatLng()
        const newPos = { lat: pos.lat, lng: pos.lng }
        setPosition(newPos)
        onPositionChange(newPos)
      }
    },
  }

  return position ? (
    <Marker
      position={[position.lat, position.lng]}
      draggable={true}
      eventHandlers={eventHandlers}
      ref={markerRef}
    />
  ) : null
}

export function LocationPicker({
  value,
  onChange,
  placeholder = 'Enter location or use map',
  className,
  error,
  label,
  required = false,
  showCoordinates = false,
}: LocationPickerProps) {
  const [showMap, setShowMap] = useState(false)
  const [position, setPosition] = useState<Coordinates | null>(null)
  const [searchQuery, setSearchQuery] = useState(value)
  const [isGeocoding, setIsGeocoding] = useState(false)
  const [mapCenter, setMapCenter] = useState<Coordinates>({ lat: -13.9626, lng: 33.7741 }) // Lilongwe, Malawi default

  // Initialize position from value if it contains coordinates
  useEffect(() => {
    setSearchQuery(value)
  }, [value])

  // Reverse geocode: Get address from coordinates
  const reverseGeocode = async (coords: Coordinates) => {
    setIsGeocoding(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}&addressdetails=1`
      )
      const data = await response.json()

      if (data.display_name) {
        const address = data.display_name
        setSearchQuery(address)
        onChange(address, coords)
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error)
    } finally {
      setIsGeocoding(false)
    }
  }

  // Forward geocode: Get coordinates from address
  const forwardGeocode = async (address: string) => {
    if (!address || address.length < 3) return

    setIsGeocoding(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&countrycodes=mw`
      )
      const data = await response.json()

      if (data && data.length > 0) {
        const coords = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
        setPosition(coords)
        setMapCenter(coords)
      }
    } catch (error) {
      console.error('Forward geocoding failed:', error)
    } finally {
      setIsGeocoding(false)
    }
  }

  // Get user's current location
  const getCurrentLocation = () => {
    if ('geolocation' in navigator) {
      setIsGeocoding(true)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setPosition(coords)
          setMapCenter(coords)
          reverseGeocode(coords)
        },
        (error) => {
          console.error('Error getting location:', error)
          setIsGeocoding(false)
        }
      )
    }
  }

  const handlePositionChange = (coords: Coordinates) => {
    reverseGeocode(coords)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setSearchQuery(newValue)
    onChange(newValue, position || undefined)
  }

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute left-0 top-0 h-9 z-10"
          onClick={() => setShowMap(!showMap)}
        >
          {showMap ? (
            <>
              <X className="h-4 w-4 mr-1" />
              Close
            </>
          ) : (
            <>
              <MapPin className="h-4 w-4 mr-1" />
              Use Map
            </>
          )}
        </Button>
        <Input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="pl-28 pr-4"
          required={required}
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {showMap && (
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            {/* Map Toolbar */}
            <div className="p-3 bg-muted/50 border-b space-y-2">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        forwardGeocode(searchQuery)
                      }
                    }}
                    placeholder="Search for a location..."
                    className="pl-9 h-9"
                  />
                </div>
                <Button
                  type="button"
                  size="sm"
                  disabled={isGeocoding}
                  onClick={() => forwardGeocode(searchQuery)}
                >
                  Search
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={getCurrentLocation}
                  disabled={isGeocoding}
                  title="Use my current location"
                >
                  <Navigation className="h-4 w-4" />
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                {isGeocoding ? (
                  'Loading location...'
                ) : (
                  'Click on the map or drag the marker to select a location'
                )}
              </p>
            </div>

            {/* Map */}
            <div className="h-[400px] relative">
              <MapContainer
                center={[mapCenter.lat, mapCenter.lng]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker
                  position={position}
                  setPosition={setPosition}
                  onPositionChange={handlePositionChange}
                />
              </MapContainer>
            </div>

            {/* Coordinates Display */}
            {showCoordinates && position && (
              <div className="p-3 bg-muted/50 border-t">
                <p className="text-xs font-mono text-muted-foreground">
                  Coordinates: {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <p className="text-xs text-muted-foreground">
        Type an address or click "Map" to select location visually
      </p>
    </div>
  )
}
