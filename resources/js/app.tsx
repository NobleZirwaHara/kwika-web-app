//import { configureEcho } from '@laravel/echo-react';

// configureEcho({
//     broadcaster: 'reverb',
// });
import './bootstrap';

import { createRoot } from 'react-dom/client';
import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { route as ziggyRoute } from 'ziggy-js';
import { CartProvider } from '@/contexts/CartContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
import MobileBottomNav from '@/components/MobileBottomNav';

// Global handler for 419 CSRF token errors (session expired)
router.on('invalid', (event) => {
    // 419 Page Expired - CSRF token mismatch
    if (event.detail.response.status === 419) {
        event.preventDefault()
        alert('Your session has expired. The page will reload.')
        window.location.reload()
    }
})

const appName = import.meta.env.VITE_APP_NAME || 'Kwika Events';

// Make route helper available globally
declare global {
  function route(name?: string, params?: any, absolute?: boolean): string;
}

globalThis.route = (name, params, absolute) => {
  return ziggyRoute(name, params, absolute, (globalThis as any).Ziggy);
};

// Wrapper component to include MobileBottomNav within Inertia context
function AppWrapper({ App, props }: { App: any; props: any }) {
  const user = props?.initialPage?.props?.auth?.user;

  return (
    <>
      <App {...props} />
      <MobileBottomNav user={user} />
    </>
  );
}

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <CartProvider>
                <WishlistProvider>
                    <AppWrapper App={App} props={props} />
                </WishlistProvider>
            </CartProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
