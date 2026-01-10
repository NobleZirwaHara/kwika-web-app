// Cleanup script to unregister all service workers
// This helps resolve navigation issues during development

(async () => {
    if ('serviceWorker' in navigator) {
        console.log('🧹 Cleaning up service workers...');

        try {
            // Get all registrations
            const registrations = await navigator.serviceWorker.getRegistrations();

            // Unregister each one
            for (const registration of registrations) {
                const success = await registration.unregister();
                if (success) {
                    console.log('✅ Service worker unregistered:', registration.scope);
                } else {
                    console.log('❌ Failed to unregister:', registration.scope);
                }
            }

            // Clear all caches
            if ('caches' in window) {
                const cacheNames = await caches.keys();
                await Promise.all(
                    cacheNames.map(cacheName => {
                        console.log('🗑️ Deleting cache:', cacheName);
                        return caches.delete(cacheName);
                    })
                );
            }

            console.log('✨ Cleanup complete! Please refresh the page.');

            // Force reload to clear any remaining state
            setTimeout(() => {
                window.location.reload(true);
            }, 1000);

        } catch (error) {
            console.error('Error during cleanup:', error);
        }
    } else {
        console.log('Service workers not supported in this browser.');
    }
})();