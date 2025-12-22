import { Head } from '@inertiajs/react'
import { Header } from '@/Components/header'
import { Footer } from '@/Components/footer'

export default function Ticketing() {
  return (
    <>
      <Head title="Event Ticketing - Kwika Events" />

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 bg-gradient-to-br from-background via-secondary/5 to-background">
          <div className="container mx-auto px-6 lg:px-20 py-16">
            {/* Coming Soon Section */}
            <div className="text-center max-w-3xl mx-auto space-y-6">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-6">
                <svg viewBox="0 0 32 32" fill="none" className="w-12 h-12 text-primary">
                  <path
                    d="M4 10C4 8.89543 4.89543 8 6 8H26C27.1046 8 28 8.89543 28 10V14C26.3431 14 25 15.3431 25 17C25 18.6569 26.3431 20 28 20V24C28 25.1046 27.1046 26 26 26H6C4.89543 26 4 25.1046 4 24V20C5.65685 20 7 18.6569 7 17C7 15.3431 5.65685 14 4 14V10Z"
                    fill="currentColor"
                    opacity="0.2"
                  />
                  <path
                    d="M4 10C4 8.89543 4.89543 8 6 8H26C27.1046 8 28 8.89543 28 10V14C26.3431 14 25 15.3431 25 17C25 18.6569 26.3431 20 28 20V24C28 25.1046 27.1046 26 26 26H6C4.89543 26 4 25.1046 4 24V20C5.65685 20 7 18.6569 7 17C7 15.3431 5.65685 14 4 14V10Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill="none"
                  />
                  <line x1="18" y1="11" x2="18" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
                  <line x1="18" y1="15" x2="18" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
                  <line x1="18" y1="19" x2="18" y2="21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
                  <line x1="18" y1="23" x2="18" y2="25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
                  <rect x="8" y="13" width="6" height="2" rx="1" fill="currentColor" opacity="0.6" />
                  <rect x="8" y="18" width="4" height="2" rx="1" fill="currentColor" opacity="0.4" />
                </svg>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold font-heading bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Event Ticketing
              </h1>

              <p className="text-xl text-muted-foreground">
                Coming Soon
              </p>

              <div className="pt-8">
                <div className="bg-card rounded-2xl p-8 border border-border/50 shadow-lg">
                  <p className="text-lg text-foreground/80 mb-6">
                    We're building a comprehensive event ticketing platform where you can discover,
                    book, and manage tickets for concerts, festivals, conferences, and more across Malawi.
                  </p>

                  <div className="grid md:grid-cols-3 gap-6 mt-8">
                    <div className="text-center p-6 bg-muted/30 rounded-xl">
                      <div className="text-3xl mb-2">🎵</div>
                      <h3 className="font-semibold mb-1">Concerts</h3>
                      <p className="text-sm text-muted-foreground">Live music and performances</p>
                    </div>

                    <div className="text-center p-6 bg-muted/30 rounded-xl">
                      <div className="text-3xl mb-2">🎭</div>
                      <h3 className="font-semibold mb-1">Festivals</h3>
                      <p className="text-sm text-muted-foreground">Cultural and entertainment events</p>
                    </div>

                    <div className="text-center p-6 bg-muted/30 rounded-xl">
                      <div className="text-3xl mb-2">📊</div>
                      <h3 className="font-semibold mb-1">Conferences</h3>
                      <p className="text-sm text-muted-foreground">Business and educational events</p>
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
