import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { RefObject, useState, useEffect } from "react"

interface ScrollArrowsProps {
  scrollRef: RefObject<HTMLDivElement>
}

export function ScrollArrows({ scrollRef }: ScrollArrowsProps) {
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  useEffect(() => {
    const element = scrollRef.current
    if (!element) return

    const handleScroll = () => {
      const scrollLeft = element.scrollLeft
      const maxScroll = element.scrollWidth - element.clientWidth
      
      setShowLeftArrow(scrollLeft > 10)
      setShowRightArrow(scrollLeft < maxScroll - 10)
    }

    handleScroll()
    element.addEventListener('scroll', handleScroll)
    
    const resizeObserver = new ResizeObserver(handleScroll)
    resizeObserver.observe(element)

    return () => {
      element.removeEventListener('scroll', handleScroll)
      resizeObserver.disconnect()
    }
  }, [scrollRef])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400
      const newScrollPosition = scrollRef.current.scrollLeft + (direction === 'right' ? scrollAmount : -scrollAmount)
      scrollRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
      })
    }
  }

  return (
    <>
      {/* Left Arrow */}
      {showLeftArrow && (
        <Button
          variant="outline"
          size="icon"
          onClick={() => scroll('left')}
          className="hidden lg:flex absolute -left-6 top-[45%] -translate-y-1/2 z-10 rounded-full h-12 w-12 shadow-lg hover:shadow-xl transition-all bg-background"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      )}

      {/* Right Arrow */}
      {showRightArrow && (
        <Button
          variant="outline"
          size="icon"
          onClick={() => scroll('right')}
          className="hidden lg:flex absolute -right-6 top-[45%] -translate-y-1/2 z-10 rounded-full h-12 w-12 shadow-lg hover:shadow-xl transition-all bg-background"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      )}
    </>
  )
}
