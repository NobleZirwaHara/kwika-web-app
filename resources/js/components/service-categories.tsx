import { Link } from "@inertiajs/react"
import { motion } from "framer-motion"

interface Category {
  id: number
  name: string
  slug: string
  description: string
  icon: string
}

interface ServiceCategoriesProps {
  categories: Category[]
}

export function ServiceCategories({ categories }: ServiceCategoriesProps) {
  return (
    <section className="pt-4 pb-2 md:pb-10 lg:pt-6 lg:pb-14">
      <div className="container mx-auto px-4 md:px-6 lg:px-20">
        {/* Header */}
        <div className="mb-4 md:mb-6">
          <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-foreground font-[family-name:var(--font-heading)] tracking-tight">
            Browse by category
          </h2>
        </div>

        {/* Category Tags - Horizontal scroll on mobile, wrap on desktop */}
        <div className="flex md:flex-wrap gap-2 lg:gap-3 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((category, index) => (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.3,
                delay: index * 0.02,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              className="shrink-0 md:shrink"
            >
              <Link
                href={`/providers?category=${category.id}`}
                className="inline-flex items-center px-3 md:px-4 py-1.5 md:py-2 rounded-full text-sm font-medium whitespace-nowrap
                  bg-muted/50 text-foreground border border-border/50
                  hover:bg-primary hover:text-primary-foreground hover:border-primary
                  active:scale-95 transition-all duration-200 ease-out"
              >
                {category.name}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
