import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { Link } from '@inertiajs/react'
import { Star, MapPin, DollarSign } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import 'leaflet/dist/leaflet.css'
import type { Provider } from './ProviderCard'
import type { Service } from './ServiceCard'
import L from 'leaflet'

// Fix for default marker icons in Leaflet
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

L.Marker.prototype.options.icon = DefaultIcon

interface MapViewProps {
  items: Provider[] | Service[]
  listingType: 'providers' | 'services'
  onItemHover?: (id: number | null) => void
  hoveredId?: number | null
  className?: string
}

// Helper to check if item is a Service
function isService(item: Provider | Service): item is Service {
  return 'provider' in item
}

// Component to handle map updates
function MapUpdater({ items }: { items: (Provider | Service)[] }) {
  const map = useMap()

  useEffect(() => {
    if (items.length === 0) return

    // Get all valid coordinates
    const coordinates = items
      .map(item => {
        if (isService(item)) {
          return item.provider.latitude && item.provider.longitude
            ? [item.provider.latitude, item.provider.longitude] as [number, number]
            : null
        }
        return item.latitude && item.longitude
          ? [item.latitude, item.longitude] as [number, number]
          : null
      })
      .filter((coord): coord is [number, number] => coord !== null)

    if (coordinates.length > 0) {
      const bounds = L.latLngBounds(coordinates)
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 })
    }
  }, [items, map])

  return null
}

export function MapView({ items, listingType, onItemHover, hoveredId, className }: MapViewProps) {
  const [mapReady, setMapReady] = useState(false)

  // Default center (Lilongwe, Malawi)
  const defaultCenter: [number, number] = [-13.9833, 33.7833]
  const defaultZoom = 12

  // Filter items with valid coordinates
  const itemsWithCoords = items.filter(item => {
    if (isService(item)) {
      return item.provider.latitude && item.provider.longitude
    }
    return item.latitude && item.longitude
  })

  const formatPrice = (price?: number) => {
    if (!price) return null
    return new Intl.NumberFormat('en-MW', {
      style: 'currency',
      currency: 'MWK',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className={className}>
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        className="h-full w-full rounded-lg"
        whenReady={() => setMapReady(true)}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {mapReady && <MapUpdater items={itemsWithCoords} />}

        {itemsWithCoords.map(item => {
          const lat = isService(item) ? item.provider.latitude! : item.latitude!
          const lng = isService(item) ? item.provider.longitude! : item.longitude!
          const itemId = item.id

          if (listingType === 'providers') {
            const provider = item as Provider

            return (
              <Marker
                key={provider.id}
                position={[lat, lng]}
                eventHandlers={{
                  mouseover: () => onItemHover?.(provider.id),
                  mouseout: () => onItemHover?.(null),
                }}
              >
                <Popup>
                  <div className="p-2 min-w-[250px]">
                    {provider.image && (
                      <img
                        src={provider.image}
                        alt={provider.name}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                    )}

                    <div className="space-y-2">
                      {provider.featured && (
                        <Badge className="text-xs">Featured</Badge>
                      )}

                      <h3 className="font-semibold text-base">{provider.name}</h3>

                      <div className="flex items-center gap-2 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-foreground" />
                          <span>{provider.rating.toFixed(1)}</span>
                        </div>
                        <span>•</span>
                        <span className="text-muted-foreground">
                          {provider.reviews} reviews
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{provider.city}</span>
                      </div>

                      {provider.min_price && (
                        <div className="text-sm font-semibold">
                          From {formatPrice(provider.min_price)}
                        </div>
                      )}

                      <Button asChild size="sm" className="w-full mt-2">
                        <Link href={`/providers/${provider.slug}`}>
                          View Profile
                        </Link>
                      </Button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            )
          } else {
            const service = item as Service

            return (
              <Marker
                key={service.id}
                position={[lat, lng]}
                eventHandlers={{
                  mouseover: () => onItemHover?.(service.id),
                  mouseout: () => onItemHover?.(null),
                }}
              >
                <Popup>
                  <div className="p-2 min-w-[250px]">
                    {service.image && (
                      <img
                        src={service.image}
                        alt={service.name}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                    )}

                    <div className="space-y-2">
                      {service.category && (
                        <Badge variant="secondary" className="text-xs">
                          {service.category.name}
                        </Badge>
                      )}

                      <h3 className="font-semibold text-base">{service.name}</h3>

                      <div className="text-sm text-muted-foreground">
                        by {service.provider.name}
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-foreground" />
                          <span>{service.provider.rating.toFixed(1)}</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>{service.provider.city}</span>
                        </div>
                      </div>

                      <div className="text-lg font-bold">
                        {service.formatted_price}
                      </div>

                      <Button size="sm" className="w-full mt-2">
                        Book Now
                      </Button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            )
          }
        })}
      </MapContainer>

      {items.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/10 backdrop-blur-sm rounded-lg">
          <Card className="p-6 text-center">
            <MapPin className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
            <p className="text-lg font-semibold">No locations to display</p>
            <p className="text-sm text-muted-foreground mt-1">
              Items need location data to appear on the map
            </p>
          </Card>
        </div>
      )}
    </div>
  )
}
