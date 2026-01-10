import { ReactNode } from 'react';
import { PageTransitionWrapper } from '@/components/PageTransitionWrapper';
import { usePage } from '@inertiajs/react';

interface AnimatedLayoutProps {
    children: ReactNode;
    mode?: 'slide' | 'fade' | 'scale' | 'none';
    className?: string;
}

// Define transition modes for different page types
const pageTransitionModes: Record<string, 'slide' | 'fade' | 'scale' | 'none'> = {
    // Main navigation pages - slide transition
    'Search': 'slide',
    'ServiceProviders/Show': 'slide',
    'Services/Show': 'slide',
    'Events/Show': 'slide',
    'Packages/Show': 'slide',

    // Onboarding flow - scale transition for progression feel
    'Onboarding/Welcome': 'scale',
    'Onboarding/Step1PersonalDetails': 'scale',
    'Onboarding/Step2BusinessInfo': 'scale',
    'Onboarding/Step3ServicesMedia': 'scale',
    'Onboarding/Step4Review': 'scale',
    'Onboarding/Confirmation': 'scale',

    // Authentication pages - fade for simplicity
    'Auth/Login': 'fade',
    'Auth/Register': 'fade',
    'Auth/ForgotPassword': 'fade',

    // Dashboard pages - fade for quick transitions
    'Dashboard': 'fade',
    'Admin/Dashboard': 'fade',
    'Provider/Dashboard': 'fade',
    'Customer/Dashboard': 'fade',

    // Cart/Checkout flow - slide for progression
    'Cart': 'slide',
    'Checkout': 'slide',
    'Payment': 'slide',
    'Confirmation': 'slide',

    // Messages - fade for quick loading
    'Messages': 'fade',
    'Messages/Show': 'fade',

    // Settings/Profile - fade
    'Profile': 'fade',
    'Settings': 'fade',

    // Default for all other pages
    'default': 'slide'
};

export default function AnimatedLayout({
    children,
    mode,
    className = ''
}: AnimatedLayoutProps) {
    const { component } = usePage();

    // Determine transition mode based on page component
    const detectedMode = mode || pageTransitionModes[component] || pageTransitionModes.default;

    return (
        <PageTransitionWrapper mode={detectedMode} className={className}>
            {children}
        </PageTransitionWrapper>
    );
}

// HOC to wrap any page component with animations
export function withPageTransition<P extends object>(
    Component: React.ComponentType<P>,
    mode?: 'slide' | 'fade' | 'scale' | 'none'
) {
    return (props: P) => (
        <AnimatedLayout mode={mode}>
            <Component {...props} />
        </AnimatedLayout>
    );
}