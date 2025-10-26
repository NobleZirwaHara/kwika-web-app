import { Share2, Heart, MapPin } from "lucide-react"
import { useState } from "react"

interface ProviderInfoProps {
  provider: {
    name: string
    category?: string
    location: string
    description: string
    about?: string
    badges?: Array<{
      icon: string
      title: string
      description: string
    }>
    languages?: string[]
  }
}

export function ProviderInfo({ provider }: ProviderInfoProps) {
  const [isFavorite, setIsFavorite] = useState(false)

  return (
    <div className="space-y-6">
      {/* Title and actions */}
      <div>
        <h1 className="text-4xl font-bold font-heading text-balance mb-3">{provider.name}</h1>
        <p className="text-lg text-muted-foreground mb-4">{provider.description}</p>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{provider.location}</span>
          </div>
          {provider.category && (
            <>
              <span>•</span>
              <span>{provider.category}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 text-sm font-medium underline hover:no-underline">
            <Share2 className="h-4 w-4" />
            Share
          </button>
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="flex items-center gap-2 text-sm font-medium underline hover:no-underline"
          >
            <Heart className={`h-4 w-4 ${isFavorite ? "fill-primary text-primary" : ""}`} />
            Save
          </button>
        </div>
      </div>

      {/* Host info */}
      {provider.about && (
        <div className="border-t pt-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-lg font-semibold text-primary">SC</span>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Hosted by Sarah</h3>
              <p className="text-sm text-muted-foreground">{provider.about}</p>
            </div>
          </div>
        </div>
      )}

      {/* Badges */}
      {provider.badges && provider.badges.length > 0 && provider.badges.map((badge, index) => (
        <div key={index} className="border-t pt-6">
          <div className="flex items-start gap-4">
            <div className="text-3xl shrink-0">{badge.icon}</div>
            <div>
              <h3 className="font-semibold mb-1">{badge.title}</h3>
              <p className="text-sm text-muted-foreground">{badge.description}</p>
            </div>
          </div>
        </div>
      ))}

      {/* Languages */}
      {provider.languages && provider.languages.length > 0 && (
        <div className="border-t pt-6">
          <h3 className="font-semibold mb-2">Speaks {provider.languages.join(", ")}</h3>
        </div>
      )}
    </div>
  )
}
