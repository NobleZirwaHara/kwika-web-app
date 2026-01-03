import { Head } from '@inertiajs/react'
import MainTabs from '@/components/MainTabs'

export default function TabsDemo() {
  return (
    <>
      <Head title="Main Tabs - Kwika Events" />

      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-background">
        <div className="container mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-16 space-y-4">
            <h1 className="text-5xl font-bold font-heading bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Explore Kwika Events
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Browse through our services, products, and event ticketing options
            </p>
          </div>

          {/* Main Tabs Component */}
          <MainTabs />

          {/* Feature cards below tabs */}
          <div className="mt-24 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-card rounded-2xl p-8 border border-border/50 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6 text-primary">
                  <path d="M16 4L17.5 9.5L23 11L17.5 12.5L16 18L14.5 12.5L9 11L14.5 9.5L16 4Z" fill="currentColor" />
                </svg>
              </div>
              <h3 className="text-xl font-bold font-heading mb-2">Premium Services</h3>
              <p className="text-muted-foreground">
                Connect with top-rated event service providers for your special occasions
              </p>
            </div>

            <div className="bg-card rounded-2xl p-8 border border-border/50 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6 text-primary">
                  <rect x="8" y="14" width="16" height="13" rx="2" fill="currentColor" opacity="0.3" />
                  <path d="M16 5L14 12H18L16 5Z" fill="currentColor" />
                </svg>
              </div>
              <h3 className="text-xl font-bold font-heading mb-2">Event Products</h3>
              <p className="text-muted-foreground">
                Shop for decorations, equipment, and supplies for your events
              </p>
            </div>

            <div className="bg-card rounded-2xl p-8 border border-border/50 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6 text-primary">
                  <path
                    d="M4 10C4 8.89543 4.89543 8 6 8H26C27.1046 8 28 8.89543 28 10V14C26.3431 14 25 15.3431 25 17C25 18.6569 26.3431 20 28 20V24C28 25.1046 27.1046 26 26 26H6C4.89543 26 4 25.1046 4 24V20C5.65685 20 7 18.6569 7 17C7 15.3431 5.65685 14 4 14V10Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill="none"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold font-heading mb-2">Event Ticketing</h3>
              <p className="text-muted-foreground">
                Discover and book tickets for exciting events happening near you
              </p>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="fixed top-10 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10" />
          <div className="fixed bottom-10 right-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl -z-10" />
        </div>
      </div>
    </>
  )
}
