import { useForm, Link, router } from '@inertiajs/react'
import { FormEvent } from 'react'
import WizardLayout from '@/components/WizardLayout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  User,
  Mail,
  Phone,
  Building2,
  MapPin,
  Globe,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Edit2,
  CheckCircle2
} from 'lucide-react'
import AnimatedLayout from '@/layouts/AnimatedLayout'

interface Props {
  user: {
    name: string
    email: string
    phone: string
  }
  provider: {
    business_name: string
    description: string
    business_registration_number: string | null
    location: string
    city: string
    phone: string
    email: string
    website: string | null
    social_links: {
      facebook?: string
      instagram?: string
      twitter?: string
      linkedin?: string
    } | null
    logo: string | null
    cover_image: string | null
  }
  categories: Array<{
    id: number
    name: string
  }>
  portfolioImages: Array<{
    id: number
    url: string
  }>
  providerType?: 'both' | 'events_only'
}

export default function Step4Review({ user, provider, categories, portfolioImages, providerType = 'both' }: Props) {
  const isEventsOnly = providerType === 'events_only'
  const { post, processing } = useForm({})

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    post('/onboarding/complete')
  }

  return (
    <AnimatedLayout>
      <WizardLayout
      currentStep={4}
      title="Review Your Information"
      description="Please review and confirm all details before submitting"
      providerType={providerType}
    >
      <div className="space-y-6">
        {/* Personal Information */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Personal Information
            </h2>
            <Link href="/onboarding/step1" className="cursor-pointer">
              <Button variant="ghost" size="sm" className="cursor-pointer">
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Full Name</p>
              <p className="font-medium">{user.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {user.email}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {user.phone}
              </p>
            </div>
          </div>
        </section>

        {/* Business Information */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Business Information
            </h2>
            <Link href="/onboarding/step2" className="cursor-pointer">
              <Button variant="ghost" size="sm" className="cursor-pointer">
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link>
          </div>

          <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Business Name</p>
              <p className="font-medium text-lg">{provider.business_name}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Description</p>
              <p className="text-sm">{provider.description}</p>
            </div>

            {provider.business_registration_number && (
              <div>
                <p className="text-sm text-muted-foreground">Registration Number</p>
                <p className="font-medium">{provider.business_registration_number}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {provider.location}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">City</p>
                <p className="font-medium">{provider.city}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Business Phone</p>
                <p className="font-medium">{provider.phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Business Email</p>
                <p className="font-medium">{provider.email}</p>
              </div>
            </div>

            {provider.website && (
              <div>
                <p className="text-sm text-muted-foreground">Website</p>
                <a
                  href={provider.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:underline flex items-center gap-2 cursor-pointer"
                >
                  <Globe className="h-4 w-4" />
                  {provider.website}
                </a>
              </div>
            )}

            {provider.social_links && Object.values(provider.social_links).some(link => link) && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Social Media</p>
                <div className="flex flex-wrap gap-2">
                  {provider.social_links.facebook && (
                    <a
                      href={provider.social_links.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer"
                    >
                      <Facebook className="h-4 w-4" />
                      <span className="text-sm">Facebook</span>
                    </a>
                  )}
                  {provider.social_links.instagram && (
                    <a
                      href={provider.social_links.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer"
                    >
                      <Instagram className="h-4 w-4" />
                      <span className="text-sm">Instagram</span>
                    </a>
                  )}
                  {provider.social_links.twitter && (
                    <a
                      href={provider.social_links.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer"
                    >
                      <Twitter className="h-4 w-4" />
                      <span className="text-sm">Twitter</span>
                    </a>
                  )}
                  {provider.social_links.linkedin && (
                    <a
                      href={provider.social_links.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer"
                    >
                      <Linkedin className="h-4 w-4" />
                      <span className="text-sm">LinkedIn</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Services & Media - Only show for 'both' type */}
        {!isEventsOnly && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Services & Media</h2>
              <Link href="/onboarding/step3" className="cursor-pointer">
                <Button variant="ghost" size="sm" className="cursor-pointer">
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </Link>
            </div>

            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Service Categories</p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Badge key={category.id} variant="secondary" className="px-3 py-1">
                      {category.name}
                    </Badge>
                  ))}
                </div>
              </div>

              {(provider.logo || provider.cover_image) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {provider.logo && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Logo</p>
                      <img
                        src={`/storage/${provider.logo}`}
                        alt="Business logo"
                        className="h-24 w-24 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                  {provider.cover_image && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Cover Image</p>
                      <img
                        src={`/storage/${provider.cover_image}`}
                        alt="Cover"
                        className="w-full aspect-[3/1] object-cover rounded-lg border"
                      />
                    </div>
                  )}
                </div>
              )}

              {portfolioImages.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Portfolio Images ({portfolioImages.length})
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {portfolioImages.map((image) => (
                      <img
                        key={image.id}
                        src={image.url}
                        alt="Portfolio"
                        className="aspect-square object-cover rounded-lg border"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Confirmation Notice */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
          <div className="flex gap-4">
            <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Ready to Submit?</h3>
              <p className="text-sm text-muted-foreground">
                By submitting this application, you confirm that all the information provided is accurate
                and complete. Your profile will be reviewed by our team, and you'll be notified once it's approved.
              </p>
              <p className="text-sm text-muted-foreground">
                After approval, your business will be visible to customers searching for services in your area.
              </p>
            </div>
          </div>
        </div>

        {/* Submit Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Navigation Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 cursor-pointer"
              onClick={() => router.visit('/onboarding/step3')}
            >
              Back
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={processing}
            >
              {processing ? 'Submitting...' : 'Submit for Review'}
            </Button>
          </div>
        </form>
      </div>
    </WizardLayout>
    </AnimatedLayout>
  )
}
