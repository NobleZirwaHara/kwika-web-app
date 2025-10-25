"use client"

import { Camera, Video, Sparkles, Music } from "lucide-react"
import { useRef } from "react"

const categories = [
  {
    name: "Photographers",
    icon: Camera,
    image: "/professional-event-photographer-with-camera.jpg",
  },
  {
    name: "Videographers",
    icon: Video,
    image: "/videographer-filming-wedding-event.jpg",
  },
  {
    name: "Decorators",
    icon: Sparkles,
    image: "/elegant-event-decoration-setup.jpg",
  },
  {
    name: "PA Systems",
    icon: Music,
    image: "/professional-sound-system-event-setup.jpg",
  },
  {
    name: "Caterers",
    icon: Sparkles,
    image: "/professional-catering-service.jpg",
  },
  {
    name: "Florists",
    icon: Sparkles,
    image: "/elegant-floral-arrangements.jpg",
  },
]

export function ServiceCategories() {
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <section className="py-12 border-b relative z-0">
      <div className="container mx-auto px-6 lg:px-20">
        <h2 className="text-2xl font-semibold mb-6 font-[family-name:var(--font-heading)]">Browse by category</h2>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <div key={category.name} className="group cursor-pointer shrink-0 snap-start relative z-0">
                <div className="relative w-64 aspect-square overflow-hidden rounded-xl mb-3">
                  <img
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-foreground" />
                  <h3 className="font-medium text-foreground">{category.name}</h3>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
