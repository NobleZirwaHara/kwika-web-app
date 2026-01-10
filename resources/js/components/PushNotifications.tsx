import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, BellOff, X, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { useHapticFeedback } from '@/hooks/useSwipeGestures';
import { router } from '@inertiajs/react';

interface NotificationPreferences {
    bookings: boolean;
    messages: boolean;
    promotions: boolean;
    updates: boolean;
    reminders: boolean;
}

export function PushNotifications() {
    const [permission, setPermission] = useState<NotificationPermission>('default');
    const [isSupported, setIsSupported] = useState(false);
    const [subscription, setSubscription] = useState<PushSubscription | null>(null);
    const [showPermissionCard, setShowPermissionCard] = useState(false);
    const [showPreferencesModal, setShowPreferencesModal] = useState(false);
    const [preferences, setPreferences] = useState<NotificationPreferences>({
        bookings: true,
        messages: true,
        promotions: true,
        updates: false,
        reminders: true,
    });
    const [isLoading, setIsLoading] = useState(false);
    const haptic = useHapticFeedback();

    // Check if push notifications are supported
    useEffect(() => {
        const checkSupport = async () => {
            const supported = 'Notification' in window &&
                              'serviceWorker' in navigator &&
                              'PushManager' in window;

            setIsSupported(supported);

            if (supported) {
                setPermission(Notification.permission);

                // Check if already subscribed
                const registration = await navigator.serviceWorker.ready;
                const sub = await registration.pushManager.getSubscription();
                setSubscription(sub);

                // Show permission card if not granted and not denied
                if (Notification.permission === 'default' && !localStorage.getItem('notificationPromptDismissed')) {
                    setTimeout(() => setShowPermissionCard(true), 10000); // Show after 10 seconds
                }
            }
        };

        checkSupport();
    }, []);

    // Request notification permission
    const requestPermission = async () => {
        if (!isSupported) return;

        setIsLoading(true);
        haptic.medium();

        try {
            const result = await Notification.requestPermission();
            setPermission(result);

            if (result === 'granted') {
                await subscribeToNotifications();
                haptic.success();
                showTestNotification();
            } else {
                haptic.error();
            }
        } catch (error) {
            console.error('Error requesting permission:', error);
            haptic.error();
        } finally {
            setIsLoading(false);
            setShowPermissionCard(false);
        }
    };

    // Subscribe to push notifications
    const subscribeToNotifications = async () => {
        try {
            const registration = await navigator.serviceWorker.ready;

            // Public VAPID key (this should come from your backend)
            const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY ||
                'BNbxGYNMhEIi9zrneh7mqV4oUanjLUK3m+mYZBc62frMKrEoMk88r3Lk596T0ck9xlT+aok0fO1KXBLV4+XqxYE=';

            const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: convertedVapidKey
            });

            setSubscription(subscription);

            // Send subscription to backend
            await saveSubscriptionToBackend(subscription);

        } catch (error) {
            console.error('Failed to subscribe:', error);
        }
    };

    // Convert VAPID key
    const urlBase64ToUint8Array = (base64String: string) => {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    };

    // Save subscription to backend
    const saveSubscriptionToBackend = async (subscription: PushSubscription) => {
        try {
            await router.post('/api/notifications/subscribe', {
                subscription: subscription.toJSON(),
                preferences: preferences
            }, {
                preserveState: true
            });
        } catch (error) {
            console.error('Failed to save subscription:', error);
        }
    };

    // Update preferences
    const updatePreferences = async (newPreferences: NotificationPreferences) => {
        setPreferences(newPreferences);
        haptic.light();

        if (subscription) {
            try {
                await router.post('/api/notifications/preferences', {
                    preferences: newPreferences
                }, {
                    preserveState: true
                });
            } catch (error) {
                console.error('Failed to update preferences:', error);
            }
        }
    };

    // Test notification
    const showTestNotification = () => {
        if (permission === 'granted') {
            const notification = new Notification('Welcome to Kwika Events! 🎉', {
                body: 'You\'ll now receive updates about your bookings and messages.',
                icon: '/android-icon-192x192.png',
                badge: '/android-icon-96x96.png',
                vibrate: [200, 100, 200],
                tag: 'welcome',
                requireInteraction: false,
                actions: [
                    { action: 'view', title: 'View' },
                    { action: 'dismiss', title: 'Dismiss' }
                ]
            });

            notification.onclick = () => {
                window.focus();
                notification.close();
            };
        }
    };

    // Unsubscribe from notifications
    const unsubscribe = async () => {
        if (subscription) {
            try {
                await subscription.unsubscribe();
                setSubscription(null);
                haptic.light();

                // Notify backend
                await router.post('/api/notifications/unsubscribe', {}, {
                    preserveState: true
                });
            } catch (error) {
                console.error('Failed to unsubscribe:', error);
            }
        }
    };

    if (!isSupported) {
        return null;
    }

    return (
        <>
            {/* Permission Request Card */}
            <AnimatePresence>
                {showPermissionCard && permission === 'default' && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-96 z-40"
                    >
                        <Card className="p-4 shadow-xl border-primary/20">
                            <button
                                onClick={() => {
                                    setShowPermissionCard(false);
                                    localStorage.setItem('notificationPromptDismissed', 'true');
                                }}
                                className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                <X className="h-4 w-4" />
                            </button>

                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                        <Bell className="h-5 w-5 text-primary" />
                                    </div>
                                </div>
                                <div className="flex-1 pr-2">
                                    <h4 className="font-semibold text-sm mb-1">
                                        Stay Updated
                                    </h4>
                                    <p className="text-xs text-muted-foreground mb-3">
                                        Get instant alerts for bookings, messages, and special offers
                                    </p>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            onClick={requestPermission}
                                            disabled={isLoading}
                                            className="flex-1"
                                        >
                                            {isLoading ? (
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ repeat: Infinity, duration: 1 }}
                                                >
                                                    <Bell className="h-3 w-3 mr-1" />
                                                </motion.div>
                                            ) : (
                                                <Bell className="h-3 w-3 mr-1" />
                                            )}
                                            Enable
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => {
                                                setShowPermissionCard(false);
                                                localStorage.setItem('notificationPromptDismissed', 'true');
                                            }}
                                        >
                                            Later
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Notification Bell (for settings) */}
            {permission === 'granted' && subscription && (
                <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="fixed top-4 right-4 z-30 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg md:hidden"
                    onClick={() => setShowPreferencesModal(true)}
                >
                    <Bell className="h-5 w-5" />
                </motion.button>
            )}

            {/* Notification Preferences Modal */}
            <AnimatePresence>
                {showPreferencesModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50"
                        onClick={() => setShowPreferencesModal(false)}
                    >
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="w-full md:w-96 bg-white dark:bg-gray-900 rounded-t-2xl md:rounded-2xl p-6 pb-safe"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold">Notification Preferences</h3>
                                <button
                                    onClick={() => setShowPreferencesModal(false)}
                                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {permission === 'granted' && subscription ? (
                                <div className="space-y-4">
                                    {/* Booking Notifications */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                                                <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">Bookings</p>
                                                <p className="text-xs text-muted-foreground">
                                                    New bookings and updates
                                                </p>
                                            </div>
                                        </div>
                                        <Switch
                                            checked={preferences.bookings}
                                            onCheckedChange={(checked) =>
                                                updatePreferences({ ...preferences, bookings: checked })
                                            }
                                        />
                                    </div>

                                    {/* Message Notifications */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                                                <Bell className="h-5 w-5 text-green-600 dark:text-green-400" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">Messages</p>
                                                <p className="text-xs text-muted-foreground">
                                                    Chat messages from customers
                                                </p>
                                            </div>
                                        </div>
                                        <Switch
                                            checked={preferences.messages}
                                            onCheckedChange={(checked) =>
                                                updatePreferences({ ...preferences, messages: checked })
                                            }
                                        />
                                    </div>

                                    {/* Promotion Notifications */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                                                <Bell className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">Promotions</p>
                                                <p className="text-xs text-muted-foreground">
                                                    Special offers and deals
                                                </p>
                                            </div>
                                        </div>
                                        <Switch
                                            checked={preferences.promotions}
                                            onCheckedChange={(checked) =>
                                                updatePreferences({ ...preferences, promotions: checked })
                                            }
                                        />
                                    </div>

                                    {/* Update Notifications */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
                                                <Bell className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">Updates</p>
                                                <p className="text-xs text-muted-foreground">
                                                    App features and improvements
                                                </p>
                                            </div>
                                        </div>
                                        <Switch
                                            checked={preferences.updates}
                                            onCheckedChange={(checked) =>
                                                updatePreferences({ ...preferences, updates: checked })
                                            }
                                        />
                                    </div>

                                    {/* Reminder Notifications */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                                                <Bell className="h-5 w-5 text-red-600 dark:text-red-400" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">Reminders</p>
                                                <p className="text-xs text-muted-foreground">
                                                    Event reminders and deadlines
                                                </p>
                                            </div>
                                        </div>
                                        <Switch
                                            checked={preferences.reminders}
                                            onCheckedChange={(checked) =>
                                                updatePreferences({ ...preferences, reminders: checked })
                                            }
                                        />
                                    </div>

                                    <div className="pt-4 border-t">
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={unsubscribe}
                                            className="w-full"
                                        >
                                            <BellOff className="h-4 w-4 mr-2" />
                                            Disable All Notifications
                                        </Button>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <AlertCircle className="h-3 w-3" />
                                        <span>You can change these settings anytime</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <BellOff className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Notifications are not enabled
                                    </p>
                                    <Button onClick={requestPermission} disabled={isLoading}>
                                        <Bell className="h-4 w-4 mr-2" />
                                        Enable Notifications
                                    </Button>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}