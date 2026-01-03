import { Star } from "lucide-react"

interface ProviderReviewsProps {
  rating: number
  reviewCount: number
}

const reviews = [
  {
    name: "Jennifer M.",
    date: "December 2024",
    rating: 5,
    comment:
      "Sarah was absolutely incredible! She captured every moment perfectly and made everyone feel comfortable. The photos turned out stunning and we couldn't be happier.",
    avatar: "/testimonial-sarah.jpg",
  },
  {
    name: "David L.",
    date: "November 2024",
    rating: 5,
    comment:
      "Professional, creative, and a pleasure to work with. Sarah went above and beyond to ensure we got the perfect shots. Highly recommend!",
    avatar: "/testimonial-michael.jpg",
  },
  {
    name: "Priya K.",
    date: "October 2024",
    rating: 5,
    comment:
      "We hired Sarah for our corporate event and she delivered exceptional results. Her attention to detail and ability to capture candid moments was impressive.",
    avatar: "/testimonial-priya.jpg",
  },
]

export function ProviderReviews({ rating, reviewCount }: ProviderReviewsProps) {
  return (
    <div className="space-y-6">
      <div className="border-b pb-6">
        <div className="flex items-center gap-2 mb-2">
          <Star className="h-5 w-5 fill-foreground text-foreground" />
          <span className="text-2xl font-semibold">{rating}</span>
          <span className="text-muted-foreground">· {reviewCount} reviews</span>
        </div>
      </div>

      <div className="space-y-8">
        {reviews.map((review, index) => (
          <div key={index} className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 overflow-hidden">
                <img
                  src={review.avatar || "/placeholder.svg"}
                  alt={review.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="font-semibold">{review.name}</p>
                <p className="text-sm text-muted-foreground">{review.date}</p>
              </div>
            </div>
            <div className="flex gap-1">
              {Array.from({ length: review.rating }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-foreground text-foreground" />
              ))}
            </div>
            <p className="text-foreground leading-relaxed">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
