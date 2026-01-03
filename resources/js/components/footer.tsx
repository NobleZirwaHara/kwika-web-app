import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Link } from '@inertiajs/react'
import { cn } from "@/lib/utils"

interface FooterProps {
  className?: string
  variant?: 'default' | 'light'
}

export function Footer({ className, variant = 'default' }: FooterProps = {}) {
  const isLight = variant === 'light'
  
  return (
    <footer className={cn("border-t border-border bg-muted/30", className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/kwika-logo.png" alt="Logo" width={150} />
            </div>
            {/* <p className={cn("text-sm leading-relaxed", isLight ? "text-gray-300" : "text-muted-foreground")}>
              Your trusted marketplace for event service providers. Making every event unforgettable.
            </p> */}
          </div>

          <div>
            <h3 className={cn("font-semibold mb-4", isLight && "text-white")}>For Clients</h3>
            <ul className={cn("space-y-2 text-sm", isLight ? "text-gray-300" : "text-muted-foreground")}>
              <li>
                <a href="#" className={cn("transition-colors", isLight ? "hover:text-white" : "hover:text-foreground")}>
                  Browse Services
                </a>
              </li>
              <li>
                <a href="#" className={cn("transition-colors", isLight ? "hover:text-white" : "hover:text-foreground")}>
                  How It Works
                </a>
              </li>
              <li>
                <a href="#" className={cn("transition-colors", isLight ? "hover:text-white" : "hover:text-foreground")}>
                  Trust & Safety
                </a>
              </li>
              <li>
                <a href="#" className={cn("transition-colors", isLight ? "hover:text-white" : "hover:text-foreground")}>
                  Help Center
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className={cn("font-semibold mb-4", isLight && "text-white")}>For Providers</h3>
            <ul className={cn("space-y-2 text-sm", isLight ? "text-gray-300" : "text-muted-foreground")}>
              <li>
                <Link href="/onboarding/welcome" className={cn("transition-colors", isLight ? "hover:text-white" : "hover:text-foreground")}>
                  List Your Service
                </Link>
              </li>
              <li>
                <a href="#" className={cn("transition-colors", isLight ? "hover:text-white" : "hover:text-foreground")}>
                  Provider Resources
                </a>
              </li>
              <li>
                <a href="#" className={cn("transition-colors", isLight ? "hover:text-white" : "hover:text-foreground")}>
                  Success Stories
                </a>
              </li>
              <li>
                <a href="#" className={cn("transition-colors", isLight ? "hover:text-white" : "hover:text-foreground")}>
                  Community
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className={cn("font-semibold mb-4", isLight && "text-white")}>Stay Updated</h3>
            <p className={cn("text-sm mb-3", isLight ? "text-gray-300" : "text-muted-foreground")}>Get the latest tips and exclusive offers</p>
            <div className="flex gap-2">
              <Input placeholder="Your email" className="h-9" />
              <Button size="sm">Subscribe</Button>
            </div>
          </div>
        </div>

        <div className={cn("mt-12 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4 text-sm", isLight ? "border-white/20 text-gray-300" : "border-border text-muted-foreground")}>
          <p>© 2025 Kwika.Events. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className={cn("transition-colors", isLight ? "hover:text-white" : "hover:text-foreground")}>
              Privacy
            </a>
            <a href="#" className={cn("transition-colors", isLight ? "hover:text-white" : "hover:text-foreground")}>
              Terms
            </a>
            <a href="#" className={cn("transition-colors", isLight ? "hover:text-white" : "hover:text-foreground")}>
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
