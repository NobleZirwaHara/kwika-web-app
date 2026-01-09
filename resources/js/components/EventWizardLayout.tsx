import { Head, Link } from '@inertiajs/react'
import { ReactNode } from 'react'
import { CheckCircle2, Calendar, MapPin, Ticket, Eye, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'

interface WizardStep {
  number: number
  title: string
  description: string
  icon: typeof Calendar
}

interface EventWizardLayoutProps {
  children: ReactNode
  currentStep: number
  title: string
  description?: string
  onBack?: () => void
  showBackToEvents?: boolean
}

const steps: WizardStep[] = [
  {
    number: 1,
    title: 'Event Details',
    description: 'Basic information',
    icon: Calendar
  },
  {
    number: 2,
    title: 'Venue & Schedule',
    description: 'Location and timing',
    icon: MapPin
  },
  {
    number: 3,
    title: 'Tickets',
    description: 'Pricing and packages',
    icon: Ticket
  },
  {
    number: 4,
    title: 'Review & Publish',
    description: 'Confirm and launch',
    icon: Eye
  }
]

export default function EventWizardLayout({
  children,
  currentStep,
  title,
  description,
  onBack,
  showBackToEvents = true
}: EventWizardLayoutProps) {
  const progress = ((currentStep - 1) / (steps.length - 1)) * 100

  return (
    <>
      <Head title={title} />

      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/" className="flex items-center gap-2 cursor-pointer">
                  <img src="/kwika-logo.png" alt="Kwika Events" className="h-8 w-auto" />
                </Link>
                <div className="hidden sm:block h-6 w-px bg-border" />
                <span className="hidden sm:block text-sm font-medium text-muted-foreground">Create Event</span>
              </div>
              {showBackToEvents && (
                <Link href="/provider/events" className="cursor-pointer">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Back to Events</span>
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </header>

        {/* Progress Bar - Top */}
        <div className="bg-background border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative h-1 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>

        {/* Desktop: Horizontal Steps */}
        <div className="hidden md:block border-b bg-background/50 backdrop-blur">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              {steps.map((step, index) => {
                const Icon = step.icon
                const isCompleted = currentStep > step.number
                const isCurrent = currentStep === step.number
                const isPending = currentStep < step.number

                return (
                  <div key={step.number} className="flex items-center flex-1">
                    <motion.div
                      className="flex flex-col items-center gap-2 relative"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <motion.div
                        className={cn(
                          "flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all",
                          isCompleted
                            ? "border-primary bg-primary text-primary-foreground"
                            : isCurrent
                            ? "border-primary bg-background text-primary shadow-lg shadow-primary/20 ring-4 ring-primary/10"
                            : "border-muted bg-background text-muted-foreground"
                        )}
                        whileHover={{ scale: 1.05 }}
                        animate={isCurrent ? {
                          boxShadow: ["0 0 0 0 rgba(var(--primary), 0)", "0 0 0 8px rgba(var(--primary), 0.1)", "0 0 0 0 rgba(var(--primary), 0)"]
                        } : {}}
                        transition={isCurrent ? { duration: 2, repeat: Infinity } : {}}
                      >
                        {isCompleted ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 25 }}
                          >
                            <CheckCircle2 className="h-6 w-6" />
                          </motion.div>
                        ) : (
                          <Icon className="h-5 w-5" />
                        )}
                      </motion.div>
                      <div className="text-center">
                        <p className={cn(
                          "text-sm font-medium transition-colors",
                          isCompleted || isCurrent ? "text-foreground" : "text-muted-foreground"
                        )}>{step.title}</p>
                        <p className="text-xs text-muted-foreground hidden lg:block">{step.description}</p>
                      </div>
                    </motion.div>
                    {index < steps.length - 1 && (
                      <div className="flex-1 mx-4 relative">
                        <div className="h-0.5 bg-muted rounded-full" />
                        <motion.div
                          className="absolute inset-y-0 left-0 h-0.5 bg-primary rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: isCompleted ? "100%" : "0%" }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Mobile: Compact Steps */}
        <div className="md:hidden border-b bg-background/50 backdrop-blur">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const isCompleted = currentStep > step.number
                const isCurrent = currentStep === step.number

                return (
                  <div key={step.number} className="flex items-center flex-1">
                    <motion.div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-semibold transition-all",
                        isCompleted
                          ? "border-primary bg-primary text-primary-foreground"
                          : isCurrent
                          ? "border-primary bg-background text-primary"
                          : "border-muted bg-background text-muted-foreground"
                      )}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        step.number
                      )}
                    </motion.div>
                    {index < steps.length - 1 && (
                      <div className="flex-1 mx-2 relative">
                        <div className="h-0.5 bg-muted rounded-full" />
                        <motion.div
                          className="absolute inset-y-0 left-0 h-0.5 bg-primary rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: isCompleted ? "100%" : "0%" }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            <div className="mt-2 text-center">
              <p className="text-sm font-medium">{steps[currentStep - 1]?.title}</p>
              <p className="text-xs text-muted-foreground">{steps[currentStep - 1]?.description}</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="max-w-3xl mx-auto">
            {/* Page Title with Animation */}
            <motion.div
              className="mb-6 md:mb-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h1 className="text-2xl sm:text-3xl font-bold">{title}</h1>
              {description && (
                <p className="mt-2 text-muted-foreground">{description}</p>
              )}
            </motion.div>

            {/* Content Card with Animation */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="bg-card rounded-xl shadow-lg border p-6 sm:p-8"
              >
                {children}
              </motion.div>
            </AnimatePresence>

            {/* Step Indicator */}
            <motion.div
              className="mt-6 text-center text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Step {currentStep} of {steps.length}
            </motion.div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t mt-auto py-6 bg-background/50 backdrop-blur">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-muted-foreground">
              Need help? <a href="/support" className="text-primary hover:underline">Contact Support</a>
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}
