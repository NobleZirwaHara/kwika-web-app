import { useForm } from '@inertiajs/react'
import { FormEvent } from 'react'
import WizardLayout from '@/Components/WizardLayout'
import { Button } from '@/Components/ui/button'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import { User, Mail, Phone, Lock, IdCard } from 'lucide-react'

interface Props {
  user?: {
    name: string
    email: string
    phone: string
  } | null
}

export default function Step1PersonalDetails({ user }: Props) {
  const { data, setData, post, processing, errors } = useForm({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    password: '',
    password_confirmation: '',
    national_id: '',
  })

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    post('/onboarding/step1')
  }

  return (
    <WizardLayout
      currentStep={1}
      title="Create Your Provider Account"
      description="Let's start with your personal information"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="name">
            Full Name <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="name"
              type="text"
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
              placeholder="Enter your full name"
              className="pl-10"
              required
            />
          </div>
          {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">
            Email Address <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
              placeholder="your.email@example.com"
              className="pl-10"
              required
            />
          </div>
          {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">
            Phone Number <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="phone"
              type="tel"
              value={data.phone}
              onChange={(e) => setData('phone', e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="pl-10"
              required
            />
          </div>
          {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
        </div>

        {/* National ID (Optional) */}
        <div className="space-y-2">
          <Label htmlFor="national_id">
            National ID <span className="text-muted-foreground text-xs">(Optional)</span>
          </Label>
          <div className="relative">
            <IdCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="national_id"
              type="text"
              value={data.national_id}
              onChange={(e) => setData('national_id', e.target.value)}
              placeholder="Enter your national ID"
              className="pl-10"
            />
          </div>
          {errors.national_id && <p className="text-sm text-destructive">{errors.national_id}</p>}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password">
            Password <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              value={data.password}
              onChange={(e) => setData('password', e.target.value)}
              placeholder="Create a strong password"
              className="pl-10"
              required
            />
          </div>
          {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
          <p className="text-xs text-muted-foreground">
            Must be at least 8 characters with a mix of letters, numbers & symbols
          </p>
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="password_confirmation">
            Confirm Password <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="password_confirmation"
              type="password"
              value={data.password_confirmation}
              onChange={(e) => setData('password_confirmation', e.target.value)}
              placeholder="Confirm your password"
              className="pl-10"
              required
            />
          </div>
          {errors.password_confirmation && (
            <p className="text-sm text-destructive">{errors.password_confirmation}</p>
          )}
        </div>

        {/* General Errors */}
        {errors.error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
            <p className="text-sm text-destructive">{errors.error}</p>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => window.history.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1"
            disabled={processing}
          >
            {processing ? 'Creating Account...' : 'Continue'}
          </Button>
        </div>

        {/* Already have an account */}
        <div className="text-center text-sm text-muted-foreground pt-4 border-t">
          Already have an account?{' '}
          <a href="/login" className="text-primary hover:underline font-medium">
            Sign in
          </a>
        </div>
      </form>
    </WizardLayout>
  )
}
