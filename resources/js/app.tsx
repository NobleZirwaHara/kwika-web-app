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
import MobileBottomNav from '@/components/MobileBottomNav';

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
                <AppWrapper App={App} props={props} />
            </CartProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
