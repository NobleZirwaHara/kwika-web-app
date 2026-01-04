import { useState, useEffect } from "react"
import { X, ChevronLeft, ChevronRight, Images } from "lucide-react"

interface ProviderGalleryLightboxProps {
  images: string[]
  providerName: string
}

export function ProviderGalleryLightbox({ images, providerName }: ProviderGalleryLightboxProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!images || images.length === 0) {
    return null
  }

  const openLightbox = (index: number = 0) => {
    setCurrentIndex(index)
    setIsOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setIsOpen(false)
    document.body.style.overflow = 'unset'
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeLightbox()
    }
  }

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          goToPrevious()
          break
        case "ArrowRight":
          goToNext()
          break
        case "Escape":
          closeLightbox()
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, images.length])

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => openLightbox(0)}
        className="flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg border hover:bg-accent transition-colors"
      >
        <Images className="h-4 w-4" />
        <span className="hidden sm:inline">Gallery ({images.length})</span>
        <span className="sm:hidden">{images.length}</span>
      </button>

      {/* Lightbox Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={handleBackdropClick}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
            aria-label="Close gallery"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Image counter */}
          <div className="absolute top-4 left-4 px-4 py-2 rounded-full bg-white/10 text-white text-sm font-medium z-10">
            {currentIndex + 1} / {images.length}
          </div>

          {/* Navigation buttons */}
          {images.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Main image */}
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <img
              src={images[currentIndex]}
              alt={`${providerName} - Image ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-2 rounded-lg bg-white/10 backdrop-blur-sm max-w-[90vw] overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-16 w-16 rounded-lg overflow-hidden shrink-0 transition-opacity ${
                    currentIndex === index
                      ? "ring-2 ring-white opacity-100"
                      : "opacity-50 hover:opacity-75"
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Keyboard navigation hint */}
          {images.length > 1 && (
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 text-white/60 text-xs">
              Use arrow keys to navigate
            </div>
          )}
        </div>
      )}
    </>
  )
}
