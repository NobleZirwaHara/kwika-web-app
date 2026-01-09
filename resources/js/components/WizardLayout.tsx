import { Head, Link } from '@inertiajs/react'
import { ReactNode } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface WizardStep {
  number: number
  title: string
  description: string
}

interface WizardLayoutProps {
  children: ReactNode
  currentStep: number
  title: string
  description?: string
  variant?: 'horizontal' | 'sidebar'
  providerType?: 'both' | 'events_only'
}

const fullSteps: WizardStep[] = [
  {
    number: 1,
    title: 'Personal Details',
    description: 'Create your account'
  },
  {
    number: 2,
    title: 'Business Information',
    description: 'Tell us about your business'
  },
  {
    number: 3,
    title: 'Services & Media',
    description: 'Showcase your work'
  },
  {
    number: 4,
    title: 'Review & Submit',
    description: 'Confirm your details'
  }
]

const eventsOnlySteps: WizardStep[] = [
  {
    number: 1,
    title: 'Personal Details',
    description: 'Create your account'
  },
  {
    number: 2,
    title: 'Business Information',
    description: 'Tell us about your business'
  },
  {
    number: 3,
    title: 'Branding',
    description: 'Upload your logo & cover'
  },
  {
    number: 4,
    title: 'Review & Submit',
    description: 'Confirm your details'
  }
]

export default function WizardLayout({ children, currentStep, title, description, variant = 'sidebar', providerType = 'both' }: WizardLayoutProps) {
  const isEventsOnly = providerType === 'events_only'
  const steps = isEventsOnly ? eventsOnlySteps : fullSteps

  const displayStep = currentStep
  return (
    <>
      <Head title={title} />

      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <Link href="/" className="flex items-center gap-2 cursor-pointer">
                <img src="/kwika-logo.png" alt="Kwika Events" className="h-8 w-auto" />
              </Link>
              <div className="text-sm text-muted-foreground">
                Need help? <a href="/support" className="text-primary hover:underline">Contact Support</a>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile/Small screens: horizontal progress */}
        <div className="border-b bg-background/50 backdrop-blur md:hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center gap-2 relative">
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all",
                        displayStep > step.number
                          ? "border-primary bg-primary text-primary-foreground"
                          : displayStep === step.number
                          ? "border-primary bg-background text-primary shadow-lg shadow-primary/20"
                          : "border-muted bg-background text-muted-foreground"
                      )}
                    >
                      {displayStep > step.number ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <span className="text-sm font-semibold">{step.number}</span>
                      )}
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        "h-0.5 flex-1 mx-2 transition-all",
                        displayStep > step.number ? "bg-primary" : "bg-muted"
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Sidebar (md+) */}
            <aside className={cn(
              "hidden md:block md:col-span-4 lg:col-span-3",
              variant === 'sidebar' ? 'md:sticky md:top-24 self-start' : 'md:hidden'
            )}>
              <div className="bg-card rounded-xl border p-4">
                <h2 className="font-semibold mb-4">Onboarding Progress</h2>
                <ol className="space-y-3">
                  {steps.map((step) => (
                    <li key={step.number} className="flex items-start gap-3">
                      <div
                        className={cn(
                          "mt-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2 text-xs font-semibold",
                          displayStep > step.number
                            ? "border-primary bg-primary text-primary-foreground"
                            : displayStep === step.number
                            ? "border-primary bg-background text-primary"
                            : "border-muted bg-background text-muted-foreground"
                        )}
                      >
                        {displayStep > step.number ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <span>{step.number}</span>
                        )}
                      </div>
                      <div>
                        <p className={cn(
                          "text-sm font-medium",
                          displayStep >= step.number ? "text-foreground" : "text-muted-foreground"
                        )}>{step.title}</p>
                        <p className="text-xs text-muted-foreground">{step.description}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </aside>

            {/* Content */}
            <div className={cn(
              "md:col-span-8 lg:col-span-9 max-w-3xl md:max-w-none mx-auto",
              variant === 'sidebar' ? '' : 'md:col-span-12'
            )}>
              {/* Page Title */}
              <div className="mb-6 md:mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold">{title}</h1>
                {description && (
                  <p className="mt-2 text-lg text-muted-foreground">{description}</p>
                )}
              </div>

              {/* Content Card */}
              <div className="bg-card rounded-xl shadow-lg border p-6 sm:p-8">
                {children}
              </div>

              {/* Progress Indicator */}
              <div className="mt-6 text-center text-sm text-muted-foreground">
                Step {displayStep} of {steps.length}
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t mt-auto py-6 bg-background/50 backdrop-blur">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-muted-foreground">
              By continuing, you agree to our <a href="/terms" className="text-primary hover:underline">Terms of Service</a> and <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}
