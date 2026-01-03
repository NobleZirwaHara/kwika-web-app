import { Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyResultsProps {
  title?: string
  description?: string
  onClearFilters?: () => void
  showClearButton?: boolean
}

export function EmptyResults({
  title = "No results found",
  description = "Try adjusting your search criteria or filters",
  onClearFilters,
  showClearButton = true
}: EmptyResultsProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
        <Search className="h-10 w-10 text-muted-foreground" />
      </div>

      <h3 className="text-2xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground text-center max-w-md mb-6">
        {description}
      </p>

      {showClearButton && onClearFilters && (
        <Button
          onClick={onClearFilters}
          variant="outline"
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          Clear all filters
        </Button>
      )}
    </div>
  )
}
