import { LayoutGrid, List, Map } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export type ViewMode = 'grid' | 'list' | 'map'

interface ViewModeToggleProps {
  value: ViewMode
  onChange: (mode: ViewMode) => void
  className?: string
  showMap?: boolean
}

export function ViewModeToggle({
  value,
  onChange,
  className,
  showMap = true
}: ViewModeToggleProps) {
  const options: { mode: ViewMode; icon: typeof LayoutGrid; label: string }[] = [
    { mode: 'grid', icon: LayoutGrid, label: 'Grid' },
    { mode: 'list', icon: List, label: 'List' },
  ]

  if (showMap) {
    options.push({ mode: 'map', icon: Map, label: 'Map' })
  }

  const activeIndex = options.findIndex(opt => opt.mode === value)

  return (
    <div
      className={cn(
        "relative inline-flex items-center bg-muted rounded-full p-1",
        className
      )}
      role="tablist"
      aria-label="View mode"
    >
      {/* Animated background indicator */}
      <motion.div
        className="absolute bg-background rounded-full shadow-sm"
        initial={false}
        animate={{
          x: `calc(${activeIndex} * (100% + 0.25rem))`,
          width: `calc((100% - ${(options.length - 1) * 0.25}rem) / ${options.length})`,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30,
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
        const isActive = value === option.mode

        return (
          <button
            key={option.mode}
            onClick={() => onChange(option.mode)}
            className={cn(
              "relative z-10 flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200",
              "rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              isActive
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
            role="tab"
            aria-selected={isActive}
            aria-label={`${option.label} view`}
          >
            {/* Animated icon */}
            <motion.div
              initial={false}
              animate={{
                scale: isActive ? 1 : 0.9,
                rotate: isActive ? 0 : -5,
              }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
              }}
            >
              <Icon
                className={cn(
                  "h-4 w-4 transition-colors",
                  isActive ? "text-primary" : ""
                )}
              />
            </motion.div>

            {/* Label */}
            <motion.span
              initial={false}
              animate={{
                opacity: isActive ? 1 : 0.7,
                scale: isActive ? 1 : 0.95,
              }}
              transition={{
                duration: 0.2,
              }}
              className="hidden sm:inline"
            >
              {option.label}
            </motion.span>
          </button>
        )
      })}
    </div>
  )
}
