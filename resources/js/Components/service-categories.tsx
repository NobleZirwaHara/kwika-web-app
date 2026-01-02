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
    <section className="pt-4 pb-10 lg:pt-6 lg:pb-14">
      <div className="container mx-auto px-6 lg:px-20">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl lg:text-2xl font-semibold text-foreground font-[family-name:var(--font-heading)] tracking-tight">
            Browse by category
          </h2>
        </div>

        {/* Category Tags */}
        <div className="flex flex-wrap gap-2 lg:gap-3">
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
            >
              <Link
                href={`/providers?category=${category.id}`}
                className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium
                  bg-muted/50 text-foreground border border-border/50
                  hover:bg-primary hover:text-primary-foreground hover:border-primary
                  transition-all duration-200 ease-out"
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
