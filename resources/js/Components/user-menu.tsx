import { Button } from "@/Components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar"
import { Menu, User, Heart, Calendar, MessageCircle, UserCircle, Settings, Globe, HelpCircle, LogOut, LayoutDashboard } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { Link } from "@inertiajs/react"

interface UserMenuProps {
  user?: any
  isProvider?: boolean
  isAdmin?: boolean
}

export function UserMenu({ user, isProvider = false, isAdmin = false }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Get user initials for avatar fallback
  const getInitials = (name: string) => {
    if (!name) return 'U'
    const names = name.split(' ')
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="relative" ref={menuRef}>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        className="group gap-2 rounded-full border-border pl-3 pr-3 py-2 bg-transparent hover:shadow-md hover:bg-primary transition-shadow cursor-pointer"
      >
        <Menu className="h-4 w-4 group-hover:text-primary-foreground transition-colors" />
        <Avatar className="h-7 w-7 group-hover:ring-2 group-hover:ring-primary-foreground transition-all">
          {user ? (
            <>
              <AvatarImage src={user.avatar || undefined} alt={user.name} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xs group-hover:bg-primary-foreground group-hover:text-primary transition-colors">
                {getInitials(user.name)}
              </AvatarFallback>
            </>
          ) : (
            <AvatarFallback className="bg-muted group-hover:bg-primary-foreground/20 transition-colors">
              <User className="h-4 w-4 group-hover:text-primary-foreground transition-colors" />
            </AvatarFallback>
          )}
        </Avatar>
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-background border border-border rounded-2xl shadow-lg py-2 z-[1000]">
          {user ? (
            <>
              {/* Logged in menu */}
              <Link href="/wishlist" className="block px-4 py-3 hover:bg-primary/10 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <Heart className="h-5 w-5" />
                  <span className="font-medium">Wishlist</span>
                </div>
              </Link>

              {isProvider ? (
                <Link href="/provider/bookings" className="block px-4 py-3 hover:bg-primary/10 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5" />
                    <span className="font-medium">Bookings</span>
                  </div>
                </Link>
              ) : (
                <Link href="/bookings" className="block px-4 py-3 hover:bg-primary/10 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5" />
                    <span className="font-medium">My Bookings</span>
                  </div>
                </Link>
              )}

              {/* Messages - Future implementation
              <Link href="/messages" className="block px-4 py-3 hover:bg-primary/10 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <MessageCircle className="h-5 w-5" />
                  <span className="font-medium">Messages</span>
                </div>
              </Link>
              */}

              {isAdmin ? (
                <Link href="/admin/settings" className="block px-4 py-3 hover:bg-primary/10 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <UserCircle className="h-5 w-5" />
                    <span className="font-medium">Profile</span>
                  </div>
                </Link>
              ) : isProvider ? (
                <Link href="/provider/settings" className="block px-4 py-3 hover:bg-primary/10 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <UserCircle className="h-5 w-5" />
                    <span className="font-medium">Profile</span>
                  </div>
                </Link>
              ) : (
                <Link href="/profile" className="block px-4 py-3 hover:bg-primary/10 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <UserCircle className="h-5 w-5" />
                    <span className="font-medium">Profile</span>
                  </div>
                </Link>
              )}

              <div className="border-t border-border my-2"></div>

              {isAdmin ? (
                <Link href="/admin/settings" className="block px-4 py-3 hover:bg-primary/10 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Settings className="h-5 w-5" />
                    <span className="font-medium">Account settings</span>
                  </div>
                </Link>
              ) : isProvider ? (
                <Link href="/provider/settings" className="block px-4 py-3 hover:bg-primary/10 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Settings className="h-5 w-5" />
                    <span className="font-medium">Account settings</span>
                  </div>
                </Link>
              ) : (
                <Link href="/settings" className="block px-4 py-3 hover:bg-primary/10 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Settings className="h-5 w-5" />
                    <span className="font-medium">Account settings</span>
                  </div>
                </Link>
              )}

              {/* <Link href="/settings/language" className="block px-4 py-3 hover:bg-primary/10 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5" />
                  <span className="font-medium">Languages & currency</span>
                </div>
              </Link> */}

              <Link href="/help" className="block px-4 py-3 hover:bg-primary/10 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <HelpCircle className="h-5 w-5" />
                  <span className="font-medium">Help Center</span>
                </div>
              </Link>

              <div className="border-t border-border my-2"></div>

              {isAdmin && (
                <Link href="/admin/dashboard" className="block px-4 py-3 hover:bg-primary/10 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <LayoutDashboard className="h-5 w-5" />
                    <span className="font-medium">Admin Dashboard</span>
                  </div>
                </Link>
              )}

              {isProvider ? (
                <Link href="/provider/dashboard" className="block px-4 py-3 hover:bg-primary/10 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <LayoutDashboard className="h-5 w-5" />
                    <span className="font-medium">Provider Dashboard</span>
                  </div>
                </Link>
              ) : !isAdmin ? (
                <Link href="/onboarding/welcome" className="block px-4 py-3 hover:bg-primary/10 transition-colors cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <div className="font-semibold">Become a provider</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        It's easy to start hosting and earn extra income.
                      </div>
                    </div>
                    <div className="text-2xl">🎉</div>
                  </div>
                </Link>
              ) : null}

              <Link href="/logout" method="post" as="button" className="block w-full text-left px-4 py-3 hover:bg-primary/10 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium">Log out</span>
                </div>
              </Link>
            </>
          ) : (
            <>
              {/* Not logged in menu */}
              <Link href="/help" className="block px-4 py-3 hover:bg-primary/10 transition-colors border-b border-border cursor-pointer">
                <div className="flex items-center gap-3">
                  <HelpCircle className="h-5 w-5" />
                  <span className="font-semibold">Help Center</span>
                </div>
              </Link>

              <Link href="/onboarding/welcome" className="block px-4 py-3 hover:bg-primary/10 transition-colors cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <div className="font-semibold">Become a provider</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      It's easy to start hosting and earn extra income.
                    </div>
                  </div>
                  <div className="text-2xl">🎉</div>
                </div>
              </Link>

              <div className="border-t border-border my-2"></div>

              <Link href="/login" className="block px-4 py-3 hover:bg-primary/10 transition-colors font-medium cursor-pointer">
                Log in or sign up
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  )
}
