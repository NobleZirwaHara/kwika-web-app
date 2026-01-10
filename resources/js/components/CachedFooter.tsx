import React, { memo, useCallback, useMemo, useState } from 'react'
import { Link } from '@inertiajs/react'
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CachedFooterProps {
    variant?: 'default' | 'light'
    className?: string
}

// Memoized social links component
const SocialLinks = memo(() => (
    <div className="flex gap-4">
        <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            <Facebook className="h-5 w-5" />
        </a>
        <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            <Twitter className="h-5 w-5" />
        </a>
        <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            <Instagram className="h-5 w-5" />
        </a>
        <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            <Linkedin className="h-5 w-5" />
        </a>
    </div>
))

SocialLinks.displayName = 'SocialLinks'

// Memoized newsletter form
const NewsletterForm = memo(() => {
    const [email, setEmail] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) return

        setIsSubmitting(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        setIsSubmitting(false)
        setEmail('')
    }, [email])

    return (
        <form onSubmit={handleSubmit} className="flex gap-2">
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 text-sm border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={isSubmitting}
            />
            <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </button>
        </form>
    )
})

NewsletterForm.displayName = 'NewsletterForm'

// Memoized footer section component
const FooterSection = memo(({ title, children }: { title: string; children: React.ReactNode }) => (
    <div>
        <h3 className="font-semibold text-lg mb-4">{title}</h3>
        {children}
    </div>
))

FooterSection.displayName = 'FooterSection'

// Static footer links data
const FOOTER_LINKS = {
    clients: [
        { href: '/search', label: 'Find Providers' },
        { href: '/categories', label: 'Browse Categories' },
        { href: '/how-it-works', label: 'How It Works' },
        { href: '/testimonials', label: 'Testimonials' },
        { href: '/contact', label: 'Contact Support' },
    ],
    providers: [
        { href: '/provider/register', label: 'Become a Provider' },
        { href: '/provider/benefits', label: 'Provider Benefits' },
        { href: '/provider/resources', label: 'Resources' },
        { href: '/provider/success-stories', label: 'Success Stories' },
        { href: '/provider/faq', label: 'Provider FAQ' },
    ],
    legal: [
        { href: '/privacy', label: 'Privacy Policy' },
        { href: '/terms', label: 'Terms of Service' },
        { href: '/sitemap', label: 'Sitemap' },
    ]
}

// Main cached footer component
const CachedFooter = memo<CachedFooterProps>(({
    variant = 'default',
    className = ''
}) => {
    // Memoize footer classes
    const footerClasses = useMemo(() => {
        return cn(
            variant === 'default'
                ? 'bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100'
                : 'bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100',
            'border-t border-gray-200 dark:border-gray-800',
            className
        )
    }, [variant, className])

    // Memoize current year
    const currentYear = useMemo(() => new Date().getFullYear(), [])

    // Memoize link lists
    const clientLinks = useMemo(() => (
        <ul className="space-y-3">
            {FOOTER_LINKS.clients.map(link => (
                <li key={link.href}>
                    <Link
                        href={link.href}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        {link.label}
                    </Link>
                </li>
            ))}
        </ul>
    ), [])

    const providerLinks = useMemo(() => (
        <ul className="space-y-3">
            {FOOTER_LINKS.providers.map(link => (
                <li key={link.href}>
                    <Link
                        href={link.href}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        {link.label}
                    </Link>
                </li>
            ))}
        </ul>
    ), [])

    return (
        <footer className={footerClasses}>
            <div className="mx-auto max-w-[1400px] px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    {/* Brand Section */}
                    <FooterSection title="Kwika Events">
                        <div className="space-y-4">
                            <p className="text-muted-foreground">
                                Your trusted platform for finding and booking event service providers.
                            </p>
                            <SocialLinks />
                            <div className="space-y-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    <span>Lilongwe, Malawi</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4" />
                                    <span>+265 999 123 456</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    <span>info@kwikaevents.com</span>
                                </div>
                            </div>
                        </div>
                    </FooterSection>

                    {/* For Clients */}
                    <FooterSection title="For Clients">
                        {clientLinks}
                    </FooterSection>

                    {/* For Providers */}
                    <FooterSection title="For Providers">
                        {providerLinks}
                    </FooterSection>

                    {/* Newsletter */}
                    <FooterSection title="Stay Updated">
                        <div className="space-y-4">
                            <p className="text-muted-foreground">
                                Subscribe to our newsletter for the latest updates and exclusive offers.
                            </p>
                            <NewsletterForm />
                        </div>
                    </FooterSection>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-muted-foreground">
                            © {currentYear} Kwika Events. All rights reserved.
                        </p>
                        <div className="flex gap-6 text-sm">
                            {FOOTER_LINKS.legal.map(link => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}, (prevProps, nextProps) => {
    // Shallow comparison for props
    return prevProps.variant === nextProps.variant && prevProps.className === nextProps.className
})

CachedFooter.displayName = 'CachedFooter'

export default CachedFooter