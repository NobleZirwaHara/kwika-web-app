import { Head, Link, useForm } from '@inertiajs/react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ErrorDisplay, FieldError } from '@/components/ui/error-display'
import { UserPlus } from 'lucide-react'

export default function Register() {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
  })

  const hasGeneralError = errors && Object.keys(errors).some(key =>
    !['name', 'email', 'phone', 'password', 'password_confirmation'].includes(key)
  )

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    post(route('register'))
  }

  return (
    <>
      <Head title="Create Account" />

      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href={route('home')}>
              <img
                src="/kwika-logo.png"
                alt="Kwika"
                className="mx-auto h-12 w-auto"
              />
            </Link>
            <h2 className="mt-6 text-3xl font-bold">Create an account</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Join Kwika to book amazing event services
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>
                Fill in your details to create your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* General Errors */}
                {hasGeneralError && (
                  <ErrorDisplay errors={errors} title="Registration Error" />
                )}

                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="John Doe"
                    className={errors.name ? 'border-destructive' : ''}
                    autoComplete="name"
                    autoFocus
                  />
                  <FieldError error={errors.name} />
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    placeholder="you@example.com"
                    className={errors.email ? 'border-destructive' : ''}
                    autoComplete="email"
                  />
                  <FieldError error={errors.email} />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number (Optional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={data.phone}
                    onChange={(e) => setData('phone', e.target.value)}
                    placeholder="+265 999 000 000"
                    className={errors.phone ? 'border-destructive' : ''}
                    autoComplete="tel"
                  />
                  <FieldError error={errors.phone} />
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    placeholder="Create a strong password"
                    className={errors.password ? 'border-destructive' : ''}
                    autoComplete="new-password"
                  />
                  <FieldError error={errors.password} />
                  <p className="text-xs text-muted-foreground mt-1">
                    Must be at least 8 characters
                  </p>
                </div>

                <div>
                  <Label htmlFor="password_confirmation">Confirm Password</Label>
                  <Input
                    id="password_confirmation"
                    type="password"
                    value={data.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                    placeholder="Re-enter your password"
                    className={errors.password_confirmation ? 'border-destructive' : ''}
                    autoComplete="new-password"
                  />
                  <FieldError error={errors.password_confirmation} />
                </div>

                <Button type="submit" className="w-full cursor-pointer" disabled={processing}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  {processing ? 'Creating account...' : 'Create Account'}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-sm text-center text-muted-foreground">
                Already have an account?{' '}
                <Link href={route('login')} className="text-primary hover:underline font-medium">
                  Sign in
                </Link>
              </div>

              <div className="text-sm text-center text-muted-foreground">
                Want to become a service provider?{' '}
                <Link href={route('onboarding.welcome')} className="text-primary hover:underline font-medium">
                  Get started
                </Link>
              </div>

              <p className="text-xs text-center text-muted-foreground">
                By creating an account, you agree to our Terms of Service and Privacy Policy
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  )
}
