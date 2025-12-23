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

const appName = import.meta.env.VITE_APP_NAME || 'Kwika Events';

// Make route helper available globally
declare global {
  function route(name?: string, params?: any, absolute?: boolean): string;
}

globalThis.route = (name, params, absolute) => {
  return ziggyRoute(name, params, absolute, (globalThis as any).Ziggy);
};

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
                <App {...props} />
            </CartProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
