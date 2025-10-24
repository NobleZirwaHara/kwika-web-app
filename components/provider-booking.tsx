"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"

interface ProviderBookingProps {
  price: number
  cancellationPolicy: string
}

export function ProviderBooking({ price, cancellationPolicy }: ProviderBookingProps) {
  return (
    <div className="sticky top-24 border rounded-2xl p-6 shadow-lg bg-card">
      <div className="mb-6">
        <div className="flex items-baseline gap-1 mb-1">
          <span className="text-2xl font-semibold">${price.toLocaleString()}</span>
          <span className="text-muted-foreground">/ event</span>
        </div>
        <p className="text-sm text-muted-foreground">{cancellationPolicy}</p>
      </div>

      <Button className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 mb-4">
        <Calendar className="h-5 w-5 mr-2" />
        Request booking
      </Button>

      <p className="text-xs text-center text-muted-foreground">You won't be charged yet</p>
    </div>
  )
}
