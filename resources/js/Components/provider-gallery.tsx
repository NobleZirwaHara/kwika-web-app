import { useState } from "react"

interface ProviderGalleryProps {
  images: string[]
}

export function ProviderGallery({ images = [] }: ProviderGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)

  // If no images provided, show placeholder
  if (!images || images.length === 0) {
    return (
      <div className="space-y-2">
        <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-muted flex items-center justify-center">
          <span className="text-muted-foreground">No images available</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {/* Main image */}
      <div className="aspect-[4/3] overflow-hidden rounded-2xl">
        <img
          src={images[selectedImage] || "/placeholder.svg"}
          alt="Provider work"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Thumbnail grid */}
      <div className="grid grid-cols-4 gap-2">
        {images.slice(0, 4).map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`aspect-square overflow-hidden rounded-lg transition-opacity ${
              selectedImage === index ? "opacity-100 ring-2 ring-primary" : "opacity-60 hover:opacity-100"
            }`}
          >
            <img
              src={image || "/placeholder.svg"}
              alt={`Gallery ${index + 1}`}
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  )
}
