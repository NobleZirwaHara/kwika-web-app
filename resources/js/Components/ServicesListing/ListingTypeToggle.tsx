import { Building2, Package } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export type ListingType = 'providers' | 'services'

interface ListingTypeToggleProps {
  value: ListingType
  onChange: (type: ListingType) => void
  className?: string
}

export function ListingTypeToggle({
  value,
  onChange,
  className
}: ListingTypeToggleProps) {
  const options = [
    { type: 'services' as ListingType, icon: Package, label: 'Services', description: 'Browse individual services' },
    { type: 'providers' as ListingType, icon: Building2, label: 'Providers', description: 'Browse service providers' },
  ]

  const activeIndex = options.findIndex(opt => opt.type === value)

  return (
    <div
      className={cn(
        "relative inline-flex items-center bg-muted rounded-full p-1",
        className
      )}
      role="tablist"
      aria-label="Listing type"
    >
      {/* Animated background indicator */}
      <motion.div
        className="absolute bg-background rounded-full shadow-md"
        initial={false}
        animate={{
          x: `calc(${activeIndex} * (100% + 0.25rem))`,
          width: 'calc((100% - 0.25rem) / 2)',
        }}
        transition={{
          type: "spring",
          stiffness: 350,
          damping: 28,
          mass: 0.8,
        }}
        style={{
          height: 'calc(100% - 0.5rem)',
          top: '0.25rem',
          left: '0.25rem',
        }}
      />

      {/* Buttons */}
      {options.map((option) => {
        const Icon = option.icon
        const isActive = value === option.type

        return (
          <button
            key={option.type}
            onClick={() => onChange(option.type)}
            className={cn(
              "relative z-10 flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all duration-200",
              "rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "min-w-[140px] justify-center",
              isActive
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
            role="tab"
            aria-selected={isActive}
            aria-label={option.description}
            title={option.description}
          >
            {/* Animated icon with color shift */}
            <motion.div
              initial={false}
              animate={{
                scale: isActive ? 1.1 : 1,
                rotate: isActive ? [0, -10, 10, 0] : 0,
              }}
              transition={{
                scale: {
                  type: "spring",
                  stiffness: 500,
                  damping: 25,
                },
                rotate: {
                  duration: 0.5,
                  ease: "easeInOut",
                }
              }}
            >
              <Icon
                className={cn(
                  "h-4 w-4 transition-all duration-300",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              />
            </motion.div>

            {/* Label with animated scale */}
            <motion.span
              initial={false}
              animate={{
                scale: isActive ? 1.05 : 1,
                fontWeight: isActive ? 600 : 500,
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 30,
              }}
            >
              {option.label}
            </motion.span>

            {/* Active indicator dot (optional subtle effect) */}
            {isActive && (
              <motion.div
                layoutId="activeIndicator"
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                }}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
