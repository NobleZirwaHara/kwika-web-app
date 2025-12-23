import { useRef } from "react"
import { Link } from "@inertiajs/react"
import { motion } from "framer-motion"
import { CategoryIllustration } from "./category-illustrations"

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
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <section className="py-14 lg:py-20 relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[oklch(0.58_0.16_215)]/[0.02] to-transparent pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-20 relative">
        {/* Header */}
        <div className="mb-10">
          <h2 className="text-2xl lg:text-3xl font-semibold text-foreground font-[family-name:var(--font-heading)] tracking-tight">
            Browse by category
          </h2>
          <p className="text-muted-foreground mt-2 text-sm lg:text-base">
            Find the perfect service provider for your event
          </p>
        </div>

        {/* Categories Grid */}
        <div
          ref={scrollRef}
          className="flex gap-5 lg:gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory -mx-6 px-6 lg:mx-0 lg:px-0"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((category, index) => (
            <Link
              key={category.slug}
              href={`/search?category=${category.id}`}
              className="group shrink-0 snap-start"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.05,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                className="relative"
              >
                {/* Card */}
                <div className="relative w-36 h-36 lg:w-44 lg:h-44 overflow-hidden rounded-xl transition-all duration-500 ease-out
                  bg-gradient-to-br from-white via-white to-[oklch(0.98_0.01_215)]
                  shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.02)]
                  group-hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.15),0_0_0_1px_rgba(0,0,0,0.04)]
                  group-hover:-translate-y-2
                  group-hover:bg-gradient-to-br group-hover:from-white group-hover:via-white group-hover:to-[oklch(0.95_0.03_215)]
                ">
                  {/* Subtle inner glow on hover */}
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500
                    bg-[radial-gradient(ellipse_at_50%_0%,oklch(0.58_0.16_215)_0%,transparent_60%)]
                    opacity-[0.01]
                  " />

                  {/* Illustration container */}
                  <div className="relative w-full h-full p-4 lg:p-5 transition-transform duration-500 ease-out group-hover:scale-105">
                    <CategoryIllustration
                      name={category.name}
                      className="w-full h-full drop-shadow-sm"
                    />
                  </div>

                  {/* Bottom highlight line */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-transparent via-[oklch(0.58_0.16_215)] to-transparent rounded-full
                    group-hover:w-3/4 transition-all duration-500 ease-out opacity-20
                  " />
                </div>

                {/* Label */}
                <div className="mt-4 text-center">
                  <h3 className="font-medium text-foreground text-sm lg:text-[15px] tracking-tight transition-colors duration-300 group-hover:text-[oklch(0.35_0.02_215)]">
                    {category.name}
                  </h3>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
