import { Head } from '@inertiajs/react'
import { Header } from '@/Components/header'
import { Footer } from '@/Components/footer'

export default function Products() {
  return (
    <>
      <Head title="Products - Kwika Events" />

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 bg-gradient-to-br from-background via-secondary/5 to-background">
          <div className="container mx-auto px-6 lg:px-20 py-16">
            {/* Coming Soon Section */}
            <div className="text-center max-w-3xl mx-auto space-y-6">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-6">
                <svg viewBox="0 0 32 32" fill="none" className="w-12 h-12 text-primary">
                  <rect x="8" y="14" width="16" height="13" rx="2" fill="currentColor" opacity="0.2" />
                  <path
                    d="M8 14C8 12.8954 8.89543 12 10 12H22C23.1046 12 24 12.8954 24 14V16H8V14Z"
                    fill="currentColor"
                  />
                  <path d="M16 5L14 12H18L16 5Z" fill="currentColor" />
                  <ellipse cx="13" cy="11" rx="3" ry="2" fill="currentColor" opacity="0.7" />
                  <ellipse cx="19" cy="11" rx="3" ry="2" fill="currentColor" opacity="0.7" />
                  <rect x="15" y="12" width="2" height="15" fill="currentColor" opacity="0.3" />
                  <circle cx="12" cy="20" r="1" fill="currentColor" opacity="0.4" />
                  <circle cx="20" cy="23" r="1" fill="currentColor" opacity="0.4" />
                </svg>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold font-heading bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Event Products
              </h1>

              <p className="text-xl text-muted-foreground">
                Coming Soon
              </p>

              <div className="pt-8">
                <div className="bg-card rounded-2xl p-8 border border-border/50 shadow-lg">
                  <p className="text-lg text-foreground/80 mb-6">
                    We're preparing an amazing marketplace for event products including decorations,
                    equipment rentals, party supplies, and everything you need to make your event special.
                  </p>

                  <div className="grid md:grid-cols-3 gap-6 mt-8">
                    <div className="text-center p-6 bg-muted/30 rounded-xl">
                      <div className="text-3xl mb-2">🎈</div>
                      <h3 className="font-semibold mb-1">Decorations</h3>
                      <p className="text-sm text-muted-foreground">Balloons, banners, centerpieces</p>
                    </div>

                    <div className="text-center p-6 bg-muted/30 rounded-xl">
                      <div className="text-3xl mb-2">🎪</div>
                      <h3 className="font-semibold mb-1">Equipment</h3>
                      <p className="text-sm text-muted-foreground">Tents, tables, chairs, stages</p>
                    </div>

                    <div className="text-center p-6 bg-muted/30 rounded-xl">
                      <div className="text-3xl mb-2">🎁</div>
                      <h3 className="font-semibold mb-1">Party Supplies</h3>
                      <p className="text-sm text-muted-foreground">Favors, games, tableware</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="fixed top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10" />
          <div className="fixed bottom-10 right-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl -z-10" />
        </main>

        <Footer />
      </div>
    </>
  )
}
