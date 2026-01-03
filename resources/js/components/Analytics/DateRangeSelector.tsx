import { router } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar } from 'lucide-react'
import { useState } from 'react'

interface DateRangeSelectorProps {
  startDate: string
  endDate: string
  onApply?: (startDate: string, endDate: string) => void
}

export default function DateRangeSelector({ startDate, endDate, onApply }: DateRangeSelectorProps) {
  const [localStartDate, setLocalStartDate] = useState(startDate)
  const [localEndDate, setLocalEndDate] = useState(endDate)

  function handleQuickSelect(days: number) {
    const end = new Date()
    const start = new Date()
    start.setDate(start.getDate() - days)

    const startStr = start.toISOString().split('T')[0]
    const endStr = end.toISOString().split('T')[0]

    setLocalStartDate(startStr)
    setLocalEndDate(endStr)

    if (onApply) {
      onApply(startStr, endStr)
    } else {
      router.get(window.location.pathname, {
        start_date: startStr,
        end_date: endStr,
      }, {
        preserveState: true,
        preserveScroll: true,
      })
    }
  }

  function handleApplyCustomRange() {
    if (onApply) {
      onApply(localStartDate, localEndDate)
    } else {
      router.get(window.location.pathname, {
        start_date: localStartDate,
        end_date: localEndDate,
      }, {
        preserveState: true,
        preserveScroll: true,
      })
    }
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickSelect(7)}
            >
              Last 7 Days
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickSelect(30)}
            >
              Last 30 Days
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickSelect(90)}
            >
              Last 90 Days
            </Button>
          </div>

          <div className="flex gap-2 items-end flex-1">
            <div className="flex-1">
              <Label className="text-xs">Start Date</Label>
              <Input
                type="date"
                value={localStartDate}
                onChange={(e) => setLocalStartDate(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="flex-1">
              <Label className="text-xs">End Date</Label>
              <Input
                type="date"
                value={localEndDate}
                onChange={(e) => setLocalEndDate(e.target.value)}
                className="mt-1"
              />
            </div>
            <Button onClick={handleApplyCustomRange}>
              <Calendar className="h-4 w-4 mr-2" />
              Apply
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
