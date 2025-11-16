import { Head, Link, useForm } from '@inertiajs/react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card'
import { Button } from '@/Components/ui/button'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import { Checkbox } from '@/Components/ui/checkbox'
import { LogIn } from 'lucide-react'

export default function Login() {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
    remember: false,
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    post(route('login'))
  }

  return (
    <>
      <Head title="Login" />

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
            <h2 className="mt-6 text-3xl font-bold">Welcome back</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    placeholder="you@example.com"
                    className={errors.email ? 'border-red-500' : ''}
                    autoComplete="email"
                    autoFocus
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    placeholder="Enter your password"
                    className={errors.password ? 'border-red-500' : ''}
                    autoComplete="current-password"
                  />
                  {errors.password && (
                    <p className="text-sm text-red-600 mt-1">{errors.password}</p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="remember"
                      checked={data.remember}
                      onCheckedChange={(checked) => setData('remember', checked as boolean)}
                    />
                    <Label htmlFor="remember" className="cursor-pointer text-sm">
                      Remember me
                    </Label>
                  </div>

                  {/* <Link
                    href="/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </Link> */}
                </div>

                <Button type="submit" className="w-full cursor-pointer" disabled={processing}>
                  <LogIn className="h-4 w-4 mr-2" />
                  {processing ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-sm text-center text-muted-foreground">
                Don't have an account?{' '}
                <Link href={route('register')} className="text-primary hover:underline font-medium">
                  Create one
                </Link>
              </div>

              <div className="text-sm text-center text-muted-foreground">
                Want to become a service provider?{' '}
                <Link href={route('onboarding.welcome')} className="text-primary hover:underline font-medium">
                  Get started
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  )
}
