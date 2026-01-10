// Push Notification Service Worker Extensions

// Listen for push events
self.addEventListener('push', function(event) {
    if (!(self.Notification && self.Notification.permission === 'granted')) {
        return;
    }

    const data = event.data ? event.data.json() : {};
    const title = data.title || 'Kwika Events';

    const options = {
        body: data.body || 'You have a new notification',
        icon: data.icon || '/android-icon-192x192.png',
        badge: data.badge || '/android-icon-96x96.png',
        image: data.image,
        vibrate: data.vibrate || [200, 100, 200],
        tag: data.tag || 'kwika-notification',
        requireInteraction: data.requireInteraction || false,
        renotify: data.renotify || false,
        silent: data.silent || false,
        timestamp: data.timestamp || Date.now(),
        actions: data.actions || [],
        data: {
            url: data.url || '/',
            ...data.data
        }
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', function(event) {
    event.notification.close();

    const urlToOpen = event.notification.data?.url || '/';

    event.waitUntil(
        clients.matchAll({
            type: 'window',
            includeUncontrolled: true
        }).then(function(clientList) {
            // Check if there's already a window/tab open
            for (const client of clientList) {
                if (client.url.includes(self.location.origin) && 'focus' in client) {
                    client.focus();
                    client.navigate(urlToOpen);
                    return;
                }
            }
            // Open a new window if no existing window is found
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});

// Handle notification close
self.addEventListener('notificationclose', function(event) {
    // Track notification dismissal
    if (event.notification.data && event.notification.data.trackingId) {
        fetch('/api/notifications/dismissed', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                trackingId: event.notification.data.trackingId,
                timestamp: Date.now()
            })
        });
    }
});

// Background sync for failed notification acknowledgments
self.addEventListener('sync', function(event) {
    if (event.tag === 'notification-sync') {
        event.waitUntil(syncNotifications());
    }
});

async function syncNotifications() {
    try {
        const cache = await caches.open('notification-queue');
        const requests = await cache.keys();

        for (const request of requests) {
            try {
                const response = await fetch(request);
                if (response.ok) {
                    await cache.delete(request);
                }
            } catch (error) {
                console.error('Failed to sync notification:', error);
            }
        }
    } catch (error) {
        console.error('Sync failed:', error);
    }
}

// Listen for messages from the main app
self.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }

    if (event.data && event.data.type === 'NOTIFICATION_TEST') {
        self.registration.showNotification('Test Notification', {
            body: 'Push notifications are working!',
            icon: '/android-icon-192x192.png',
            badge: '/android-icon-96x96.png',
            vibrate: [200, 100, 200],
            tag: 'test-notification'
        });
    }
});

// Periodic background sync (if supported)
self.addEventListener('periodicsync', function(event) {
    if (event.tag === 'check-notifications') {
        event.waitUntil(checkForNotifications());
    }
});

async function checkForNotifications() {
    try {
        const response = await fetch('/api/notifications/pending');
        const notifications = await response.json();

        for (const notification of notifications) {
            await self.registration.showNotification(notification.title, notification.options);
        }
    } catch (error) {
        console.error('Failed to check notifications:', error);
    }
}