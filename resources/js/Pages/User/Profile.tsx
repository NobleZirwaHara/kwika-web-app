import CustomerLayout from '@/Components/CustomerLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card'
import { Button } from '@/Components/ui/button'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar'
import { Textarea } from '@/Components/ui/textarea'
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Bell,
  Camera,
  Save
} from 'lucide-react'
import { useForm } from '@inertiajs/react'
import { FormEvent } from 'react'

interface Props {
  user: {
    id: number
    name: string
    email: string
    phone?: string | null
    avatar?: string | null
    bio?: string | null
    address?: string | null
    city?: string | null
    country?: string | null
  }
  settings: {
    email_notifications: boolean
    sms_notifications: boolean
    marketing_emails: boolean
  }
}

export default function Profile({ user, settings }: Props) {
  const { data: profileData, setData: setProfileData, post: postProfile, processing: processingProfile } = useForm({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    bio: user.bio || '',
    address: user.address || '',
    city: user.city || '',
    country: user.country || '',
    avatar: null as File | null,
  })

  const { data: passwordData, setData: setPasswordData, post: postPassword, processing: processingPassword, reset: resetPassword } = useForm({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  })

  const { data: notificationData, setData: setNotificationData, post: postNotifications, processing: processingNotifications } = useForm({
    email_notifications: settings.email_notifications,
    sms_notifications: settings.sms_notifications,
    marketing_emails: settings.marketing_emails,
  })

  const handleProfileSubmit = (e: FormEvent) => {
    e.preventDefault()
    postProfile('/user/profile', {
      preserveScroll: true,
    })
  }

  const handlePasswordSubmit = (e: FormEvent) => {
    e.preventDefault()
    postPassword('/user/password', {
      preserveScroll: true,
      onSuccess: () => resetPassword(),
    })
  }

  const handleNotificationsSubmit = (e: FormEvent) => {
    e.preventDefault()
    postNotifications('/user/notifications', {
      preserveScroll: true,
    })
  }

  const getInitials = (name: string) => {
    if (!name) return 'U'
    const names = name.split(' ')
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  return (
    <CustomerLayout title="Profile Settings">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Profile Settings</h2>
          <p className="text-muted-foreground mt-1">
            Manage your account information and preferences
          </p>
        </div>

        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your profile details and photo</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              {/* Avatar Upload */}
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.avatar || undefined} alt={user.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Label htmlFor="avatar" className="cursor-pointer">
                    <div className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors">
                      <Camera className="h-4 w-4" />
                      <span className="font-medium">Change Photo</span>
                    </div>
                    <Input
                      id="avatar"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setProfileData('avatar', e.target.files?.[0] || null)}
                    />
                  </Label>
                  <p className="text-xs text-muted-foreground mt-2">
                    JPG, PNG or GIF. Max size 2MB
                  </p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData('name', e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData('email', e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData('phone', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    type="text"
                    value={profileData.city}
                    onChange={(e) => setProfileData('city', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="address"
                    type="text"
                    value={profileData.address}
                    onChange={(e) => setProfileData('address', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => setProfileData('bio', e.target.value)}
                  rows={4}
                  placeholder="Tell us a bit about yourself..."
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={processingProfile}>
                  <Save className="h-4 w-4 mr-2" />
                  {processingProfile ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Update your password to keep your account secure</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current_password">Current Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="current_password"
                    type="password"
                    value={passwordData.current_password}
                    onChange={(e) => setPasswordData('current_password', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new_password">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="new_password"
                    type="password"
                    value={passwordData.new_password}
                    onChange={(e) => setPasswordData('new_password', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new_password_confirmation">Confirm New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="new_password_confirmation"
                    type="password"
                    value={passwordData.new_password_confirmation}
                    onChange={(e) => setPasswordData('new_password_confirmation', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={processingPassword}>
                  {processingPassword ? 'Updating...' : 'Update Password'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>Choose how you want to receive updates</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleNotificationsSubmit} className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <Bell className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Receive booking updates and messages via email
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationData.email_notifications}
                    onChange={(e) => setNotificationData('email_notifications', e.target.checked)}
                    className="h-4 w-4 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">SMS Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Get important updates via text message
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationData.sms_notifications}
                    onChange={(e) => setNotificationData('sms_notifications', e.target.checked)}
                    className="h-4 w-4 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Marketing Emails</p>
                      <p className="text-sm text-muted-foreground">
                        Receive promotional offers and event ideas
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationData.marketing_emails}
                    onChange={(e) => setNotificationData('marketing_emails', e.target.checked)}
                    className="h-4 w-4 cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={processingNotifications}>
                  <Save className="h-4 w-4 mr-2" />
                  {processingNotifications ? 'Saving...' : 'Save Preferences'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </CustomerLayout>
  )
}
