import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface HeroCarouselContextType {
  activeSlide: number
  totalSlides: number
  setActiveSlide: (index: number) => void
  setTotalSlides: (count: number) => void
}

const HeroCarouselContext = createContext<HeroCarouselContextType | null>(null)

export function HeroCarouselProvider({ children }: { children: ReactNode }) {
  const [activeSlide, setActiveSlide] = useState(0)
  const [totalSlides, setTotalSlides] = useState(3)

  return (
    <HeroCarouselContext.Provider
      value={{
        activeSlide,
        totalSlides,
        setActiveSlide,
        setTotalSlides,
      }}
    >
      {children}
    </HeroCarouselContext.Provider>
  )
}

export function useHeroCarousel() {
  const context = useContext(HeroCarouselContext)
  // Return null if context is not available (not on home page)
  return context || null
}
