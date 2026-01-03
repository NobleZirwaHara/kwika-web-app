import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MetricCardProps {
  title: string
  value: string | number
  change?: number
  icon?: React.ReactNode
  format?: 'number' | 'currency' | 'percentage'
  currency?: string
  description?: string
}

export default function MetricCard({
  title,
  value,
  change,
  icon,
  format = 'number',
  currency = 'MWK',
  description,
}: MetricCardProps) {
  function formatValue(val: string | number): string {
    const numVal = typeof val === 'string' ? parseFloat(val) : val

    switch (format) {
      case 'currency':
        return `${currency} ${numVal.toLocaleString()}`
      case 'percentage':
        return `${numVal}%`
      default:
        return numVal.toLocaleString()
    }
  }

  function getTrendIcon() {
    if (change === undefined || change === 0) {
      return <Minus className="h-4 w-4 text-muted-foreground" />
    }
    if (change > 0) {
      return <TrendingUp className="h-4 w-4 text-green-600" />
    }
    return <TrendingDown className="h-4 w-4 text-red-600" />
  }

  function getTrendColor() {
    if (change === undefined || change === 0) return 'text-muted-foreground'
    if (change > 0) return 'text-green-600'
    return 'text-red-600'
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </div>
        <div className="space-y-1">
          <p className="text-3xl font-bold">{formatValue(value)}</p>
          {change !== undefined && (
            <div className="flex items-center gap-1">
              {getTrendIcon()}
              <span className={cn('text-sm font-medium', getTrendColor())}>
                {Math.abs(change)}% {change >= 0 ? 'increase' : 'decrease'}
              </span>
            </div>
          )}
          {description && (
            <p className="text-xs text-muted-foreground mt-2">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
