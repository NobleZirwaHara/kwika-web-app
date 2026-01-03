import { Check, ChevronsUpDown, TrendingUp, Star, DollarSign, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export type SortOption = 'rating' | 'reviews' | 'price' | 'newest'
export type SortOrder = 'asc' | 'desc'

interface SortingDropdownProps {
  sortBy: SortOption
  sortOrder: SortOrder
  onSortChange: (sortBy: SortOption, sortOrder: SortOrder) => void
  className?: string
}

const sortOptions = [
  {
    value: 'rating',
    label: 'Rating',
    icon: Star,
    description: 'Highest rated first',
    defaultOrder: 'desc' as SortOrder,
  },
  {
    value: 'reviews',
    label: 'Reviews',
    icon: TrendingUp,
    description: 'Most reviewed first',
    defaultOrder: 'desc' as SortOrder,
  },
  {
    value: 'price',
    label: 'Price',
    icon: DollarSign,
    description: 'Lowest price first',
    defaultOrder: 'asc' as SortOrder,
  },
  {
    value: 'newest',
    label: 'Newest',
    icon: Clock,
    description: 'Recently added',
    defaultOrder: 'desc' as SortOrder,
  },
]

export function SortingDropdown({
  sortBy,
  sortOrder,
  onSortChange,
  className
}: SortingDropdownProps) {
  const currentOption = sortOptions.find(opt => opt.value === sortBy)
  const CurrentIcon = currentOption?.icon || Star

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn("gap-2 min-w-[180px] justify-between", className)}
        >
          <div className="flex items-center gap-2">
            <CurrentIcon className="h-4 w-4" />
            <span>Sort: {currentOption?.label}</span>
          </div>
          <ChevronsUpDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[220px]">
        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {sortOptions.map((option) => {
          const Icon = option.icon
          const isActive = sortBy === option.value

          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => onSortChange(option.value as SortOption, option.defaultOrder)}
              className={cn(
                "flex items-center gap-3 cursor-pointer",
                isActive && "bg-accent"
              )}
            >
              <Icon className={cn("h-4 w-4", isActive && "text-primary")} />
              <div className="flex-1">
                <div className="font-medium">{option.label}</div>
                <div className="text-xs text-muted-foreground">{option.description}</div>
              </div>
              {isActive && <Check className="h-4 w-4 text-primary" />}
            </DropdownMenuItem>
          )
        })}

        {sortBy === 'price' && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Order</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={sortOrder}
              onValueChange={(value) => onSortChange(sortBy, value as SortOrder)}
            >
              <DropdownMenuRadioItem value="asc">
                Low to High
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="desc">
                High to Low
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
