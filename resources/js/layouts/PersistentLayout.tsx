import React, { ReactNode, useMemo } from 'react'
import { usePage } from '@inertiajs/react'
import CachedHeader, { useCachedHeaderScroll } from '@/components/CachedHeader'
import CachedSearchHeader, { useCachedSearchHeaderScroll } from '@/components/CachedSearchHeader'
import CachedFooter from '@/components/CachedFooter'
import AdminLayout from '@/components/AdminLayout'
import ProviderLayout from '@/components/ProviderLayout'
import CustomerLayout from '@/components/CustomerLayout'

interface PersistentLayoutProps {
    children: ReactNode
}

// Layout configuration based on route patterns
const LAYOUT_CONFIG = {
    // Admin routes
    admin: {
        pattern: /^Admin\//,
        component: 'admin',
        hasFooter: false,
    },
    // Provider routes
    provider: {
        pattern: /^Provider\//,
        component: 'provider',
        hasFooter: false,
    },
    // Customer routes
    customer: {
        pattern: /^(Customer|User)\//,
        component: 'customer',
        hasFooter: false,
    },
    // Detail pages with SearchHeader
    detail: {
        pattern: /^(ServiceProviders\/Show|Products\/Show|Packages\/Show|Services\/Show)/,
        component: 'searchHeader',
        hasFooter: true,
    },
    // Search and listing pages with SearchHeader
    search: {
        pattern: /^(Search|Provider\/Services\/Index|ServiceProviders\/Index)/,
        component: 'searchHeader',
        hasFooter: true,
    },
    // Auth pages - minimal layout
    auth: {
        pattern: /^Auth\//,
        component: 'none',
        hasFooter: false,
    },
    // Onboarding pages - minimal layout
    onboarding: {
        pattern: /^Onboarding\//,
        component: 'none',
        hasFooter: false,
    },
    // Default public pages with main Header
    public: {
        pattern: /.*/,
        component: 'header',
        hasFooter: true,
    },
}

// Persistent layout component that maintains header/footer across navigation
const PersistentLayout: React.FC<PersistentLayoutProps> = ({ children }) => {
    const page = usePage()
    const hasHeaderScrolled = useCachedHeaderScroll()
    const hasSearchHeaderScrolled = useCachedSearchHeaderScroll()

    // Determine which layout to use based on current page component
    const layoutConfig = useMemo(() => {
        const component = page.component as string

        // Check each layout pattern
        for (const [key, config] of Object.entries(LAYOUT_CONFIG)) {
            if (config.pattern.test(component)) {
                return config
            }
        }

        // Default to public layout
        return LAYOUT_CONFIG.public
    }, [page.component])

    // Memoize shared props
    const sharedProps = useMemo(() => page.props.shared || {}, [page.props.shared])
    const categories = useMemo(() => sharedProps.categories || [], [sharedProps.categories])

    // Render appropriate header based on layout config
    const renderHeader = useMemo(() => {
        switch (layoutConfig.component) {
            case 'header':
                return (
                    <CachedHeader
                        categories={categories}
                        hasScrolled={hasHeaderScrolled}
                    />
                )
            case 'searchHeader':
                const isDetailPage = layoutConfig === LAYOUT_CONFIG.detail
                return (
                    <CachedSearchHeader
                        variant={isDetailPage ? 'detail' : 'search'}
                        showBackButton={isDetailPage}
                        categories={categories}
                    />
                )
            case 'admin':
            case 'provider':
            case 'customer':
            case 'none':
                return null
            default:
                return null
        }
    }, [layoutConfig.component, categories, hasHeaderScrolled])

    // Render footer if needed
    const renderFooter = useMemo(() => {
        if (!layoutConfig.hasFooter) return null
        return <CachedFooter variant="default" />
    }, [layoutConfig.hasFooter])

    // Handle dashboard layouts
    if (layoutConfig.component === 'admin') {
        return <AdminLayout>{children}</AdminLayout>
    }

    if (layoutConfig.component === 'provider') {
        return <ProviderLayout>{children}</ProviderLayout>
    }

    if (layoutConfig.component === 'customer') {
        return <CustomerLayout>{children}</CustomerLayout>
    }

    // Render public/detail/search layouts
    return (
        <>
            {renderHeader}
            <main className={layoutConfig.component === 'searchHeader' ? 'pt-16' : ''}>
                {children}
            </main>
            {renderFooter}
        </>
    )
}

// Higher-order component to wrap pages with persistent layout
export const withPersistentLayout = <P extends object>(
    Component: React.ComponentType<P>
) => {
    const WrappedComponent = (props: P) => (
        <PersistentLayout>
            <Component {...props} />
        </PersistentLayout>
    )

    // Preserve the layout property for Inertia
    ;(WrappedComponent as any).layout = (page: ReactNode) => page

    return WrappedComponent
}

export default PersistentLayout