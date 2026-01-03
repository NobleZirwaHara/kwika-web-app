import { useState } from 'react'
import { Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TimeSlot {
  time: string
  isBooked: boolean
}

interface TimeSlotPickerProps {
  bookedSlots?: string[]
  onTimeRangeSelect: (startTime: string, endTime: string) => void
  selectedStartTime?: string
  selectedEndTime?: string
}

export function TimeSlotPicker({
  bookedSlots = [],
  onTimeRangeSelect,
  selectedStartTime,
  selectedEndTime
}: TimeSlotPickerProps) {
  const [startTime, setStartTime] = useState<string | undefined>(selectedStartTime)
  const [endTime, setEndTime] = useState<string | undefined>(selectedEndTime)

  // Generate time slots from 6 AM to 11 PM (every 30 minutes)
  const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = []
    for (let hour = 6; hour < 23; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        slots.push({
          time: timeStr,
          isBooked: bookedSlots.includes(timeStr)
        })
      }
    }
    // Add 11:00 PM and 11:30 PM
    slots.push({ time: '23:00', isBooked: bookedSlots.includes('23:00') })
    slots.push({ time: '23:30', isBooked: bookedSlots.includes('23:30') })
    return slots
  }

  const timeSlots = generateTimeSlots()

  const handleSlotClick = (time: string, isBooked: boolean) => {
    if (isBooked) return

    // If no start time selected yet, set start time
    if (!startTime) {
      setStartTime(time)
      setEndTime(undefined)
      return
    }

    // If start time is selected but no end time
    if (startTime && !endTime) {
      // If clicked time is after start time, set as end time
      if (time > startTime) {
        setEndTime(time)
        onTimeRangeSelect(startTime, time)
      } else {
        // If clicked time is before or same as start time, reset and set as new start time
        setStartTime(time)
        setEndTime(undefined)
      }
      return
    }

    // If both are selected, reset and start over
    setStartTime(time)
    setEndTime(undefined)
  }

  const isInRange = (time: string) => {
    if (!startTime || !endTime) return false
    return time >= startTime && time <= endTime
  }

  const formatTime = (time: string) => {
    const [hour, minute] = time.split(':')
    const hourNum = parseInt(hour)
    const period = hourNum >= 12 ? 'PM' : 'AM'
    const displayHour = hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum
    return `${displayHour}:${minute} ${period}`
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Select Time Range
        </h4>
        {startTime && endTime && (
          <button
            onClick={() => {
              setStartTime(undefined)
              setEndTime(undefined)
            }}
            className="text-xs text-primary hover:underline"
          >
            Clear
          </button>
        )}
      </div>

      {startTime && !endTime && (
        <div className="text-xs text-muted-foreground bg-blue-50 dark:bg-blue-950/20 p-2 rounded">
          Start: <strong>{formatTime(startTime)}</strong> - Now select end time
        </div>
      )}

      {startTime && endTime && (
        <div className="text-xs text-green-800 dark:text-green-400 bg-green-50 dark:bg-green-950/20 p-2 rounded font-medium">
          Selected: {formatTime(startTime)} - {formatTime(endTime)}
        </div>
      )}

      {/* Time slots grid */}
      <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto p-1">
        {timeSlots.map((slot) => (
          <button
            key={slot.time}
            onClick={() => handleSlotClick(slot.time, slot.isBooked)}
            disabled={slot.isBooked}
            className={cn(
              'px-2 py-2 text-xs font-medium rounded-md transition-all',
              'border',
              slot.isBooked && 'bg-teal-100 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border-teal-300 dark:border-teal-700 cursor-not-allowed',
              !slot.isBooked && !startTime && 'border-gray-200 dark:border-gray-700 hover:bg-primary/10 hover:border-primary cursor-pointer',
              !slot.isBooked && startTime === slot.time && !endTime && 'bg-primary text-primary-foreground border-primary',
              !slot.isBooked && isInRange(slot.time) && 'bg-primary/20 border-primary/50',
              !slot.isBooked && startTime && startTime !== slot.time && !endTime && slot.time > startTime && 'border-gray-200 dark:border-gray-700 hover:bg-green-100 dark:hover:bg-green-950/30 hover:border-green-500 cursor-pointer',
              !slot.isBooked && startTime && startTime !== slot.time && !endTime && slot.time < startTime && 'border-gray-200 dark:border-gray-700 hover:bg-orange-100 dark:hover:bg-orange-950/30 hover:border-orange-500 cursor-pointer'
            )}
          >
            {formatTime(slot.time)}
          </button>
        ))}
      </div>

      <div className="text-xs text-muted-foreground space-y-1 border-t pt-3">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-teal-100 dark:bg-teal-950/50 border border-teal-300 dark:border-teal-700"></div>
          <span>Already booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary text-primary-foreground"></div>
          <span>Your selection</span>
        </div>
      </div>
    </div>
  )
}
