//import { configureEcho } from '@laravel/echo-react';

// configureEcho({
//     broadcaster: 'reverb',
// });
import './bootstrap';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { route as ziggyRoute } from 'ziggy-js';
import { CartProvider } from '@/contexts/CartContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
import MobileBottomNav from '@/components/MobileBottomNav';
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt';
import { PushNotifications } from '@/components/PushNotifications';

const appName = import.meta.env.VITE_APP_NAME || 'Kwika Events';

// Make route helper available globally
declare global {
  var route: typeof ziggyRoute;
}

globalThis.route = ((...args: any[]) =>
  (ziggyRoute as any)(...args, args.length < 4 ? (globalThis as any).Ziggy : undefined)
) as typeof ziggyRoute;

// Wrapper component to include MobileBottomNav and PWA features within Inertia context
function AppWrapper({ App, props }: { App: any; props: any }) {
  const user = props?.initialPage?.props?.auth?.user;

  return (
    <>
      <App {...props} />
      <MobileBottomNav user={user} />
      <PWAInstallPrompt />
      <PushNotifications />
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
