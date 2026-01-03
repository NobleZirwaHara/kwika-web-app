import { Head, Link } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Users, TrendingUp, Shield, Zap, Building2, Home, Play } from 'lucide-react'

export default function Welcome() {
  const benefits = [
    {
      icon: Users,
      title: 'Reach More Customers',
      description: 'Connect with thousands of customers actively searching for event services in your area.'
    },
    {
      icon: TrendingUp,
      title: 'Grow Your Business',
      description: 'Get more bookings, increase visibility, and build your reputation with verified reviews.'
    },
    {
      icon: Shield,
      title: 'Trusted Platform',
      description: 'Join a verified community of professional service providers with secure payment processing.'
    },
    {
      icon: Zap,
      title: 'Easy Management',
      description: 'Manage bookings, communicate with clients, and track your performance all in one place.'
    }
  ]

  // steps removed in redesigned hero; process now conveyed via copy and sections

  return (
    <>
      <Head title="Become a Service Provider" />

      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <Link href="/" className="flex items-center gap-2 cursor-pointer">
                <img src="/kwika-logo.png" alt="Kwika Events" className="h-8 w-auto" />
              </Link>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">Already have an account?</span>
                <Link href="/login" className="cursor-pointer">
                  <Button variant="outline" className="hover:bg-primary/10 cursor-pointer">Sign In</Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="">
          <section className="relative">
            {/* Background image - stock image */}
            <div className="absolute inset-0">
              <img
                src="/annie-spratt-Kic07Fh_MJQ-unsplash.jpg"
                alt="Event venue background"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/30 to-background" />
              <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-background/30 to-transparent" />
            </div>

            <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-28 lg:pb-28">
              <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left: Headline */}
                <div className="lg:col-span-7">
                  <div className="mb-6">
                    <span className="inline-flex items-center gap-2 rounded-full border bg-card/80 backdrop-blur px-3 py-1 text-xs text-muted-foreground">
                      <span className="h-2 w-2 rounded-full bg-accent" /> Provider Onboarding
                    </span>
                  </div>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                    Welcome a new world of customers
                  </h1>
                  <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl">
                    List your services on Kwika Events and reach clients looking for trusted event professionals.
                    Grow bookings with our tools and marketplace.
                  </p>
                </div>

                {/* Right: Choice card */}
                <div className="lg:col-span-5">
                  <div className="bg-card/95 backdrop-blur border rounded-2xl p-6 sm:p-8 shadow-lg">
                    <h2 className="text-xl font-semibold mb-4">What would you like to list?</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Link href="/onboarding/step1" className="cursor-pointer">
                        <Button variant="outline" className="w-full h-20 justify-start gap-3 hover:bg-primary/10 cursor-pointer hover:text-primary hover:-translate-y-1 transition-all">
                          <Building2 className="h-5 w-5 text-primary" />
                          <div className="text-left">
                            <p className="font-medium">Event Services</p>
                            <p className="text-xs text-muted-foreground">Vendors, DJs, decor, etc.</p>
                          </div>
                        </Button>
                      </Link>
                      <a href="#" onClick={(e) => e.preventDefault()} className="cursor-pointer">
                        <Button variant="outline" className="w-full h-20 justify-start gap-3 hover:bg-primary/10 cursor-pointer hover:text-primary hover:-translate-y-1 transition-all">
                          <Home className="h-5 w-5 text-primary" />
                          <div className="text-left">
                            <p className="font-medium">Venues</p>
                            <p className="text-xs text-muted-foreground">Coming soon</p>
                          </div>
                        </Button>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Benefits and marketplace sections */}
          <section id="how-it-works" className="container mx-auto px-4 sm:px-6 lg:px-8 mt-14 sm:mt-20">
            <div className="bg-card border rounded-xl p-6 sm:p-10">
              <h3 className="text-2xl sm:text-3xl font-bold text-center mb-10">Bring the right clients within reach</h3>
              {/* Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {benefits.slice(0,3).map((benefit, index) => {
                  const Icon = benefit.icon
                  return (
                    <div key={index} className="rounded-xl border p-6">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-md bg-primary/10 text-primary">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">{benefit.title}</h4>
                          <p className="text-sm text-muted-foreground">{benefit.description}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            {/* Logos grid */}
            {/* <div className="max-w-6xl mx-auto mt-10 sm:mt-14">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {["wotif","trivago","stayz","hotels","expedia","orbitz"].map((brand) => (
                  <div key={brand} className="rounded-lg border bg-card p-4 text-center text-sm text-muted-foreground">
                    {brand}
                  </div>
                ))}
              </div>
            </div> */}
          </section>
          {/* Insight / video */}
          <section className="container mx-auto px-4 sm:px-6 lg:px-8 mt-14 sm:mt-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-card border rounded-xl p-6 sm:p-10">
              <div>
                <h3 className="text-2xl font-bold mb-2">Drive demand like our partners</h3>
                <p className="text-muted-foreground mb-4">Hear how providers grow with Kwika Events—more visibility, better bookings, and streamlined communication.</p>
                <a href="/provider-stories" className="text-primary hover:underline font-medium cursor-pointer">See success stories</a>
              </div>
              <div className="relative aspect-video rounded-lg overflow-hidden border">
                <img src="https://images.unsplash.com/photo-1551836022-4c4c79ecde51?q=80&w=1600&auto=format&fit=crop" alt="Provider story" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-background/20" />
                <button className="absolute inset-0 m-auto h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
                  <Play className="h-5 w-5" />
                </button>
              </div>
            </div>
          </section>

          {/* Existing partner CTA */}
          <section className="container mx-auto px-4 sm:px-6 lg:px-8 mt-14 sm:mt-20 mb-16">
            <div className="max-w-3xl mx-auto text-center bg-card border rounded-xl p-6 sm:p-10 shadow-sm">
              <h4 className="text-xl font-semibold mb-2">Already a partner with Kwika Events?</h4>
              <p className="text-muted-foreground mb-4">Log in to your provider account to manage your profile and bookings.</p>
              <Link href="/login" className="cursor-pointer">
                <Button className="px-6 cursor-pointer">Log in to your account</Button>
              </Link>
            </div>
            <div className="text-center mt-6">
              <p className="text-muted-foreground">
                FAQs • <a href="/support" className="text-primary hover:underline font-medium cursor-pointer">Support</a> • <a href="/provider-faq" className="text-primary hover:underline font-medium cursor-pointer">Learn more</a>
              </p>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t mt-auto py-8 bg-background/50 backdrop-blur">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-muted-foreground">
              By continuing, you agree to our{' '}
              <a href="/terms" className="text-primary hover:underline cursor-pointer">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-primary hover:underline cursor-pointer">
                Privacy Policy
              </a>
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}
