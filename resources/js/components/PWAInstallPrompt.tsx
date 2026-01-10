import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRegisterSW } from 'virtual:pwa-register/react';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showInstallPrompt, setShowInstallPrompt] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    // Register service worker with auto-update
    const {
        offlineReady: [offlineReady, setOfflineReady],
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker,
    } = useRegisterSW({
        onRegisteredSW(swUrl, r) {
            console.log('Service Worker registered:', swUrl);
            // Check for updates every hour
            r && setInterval(() => {
                r.update();
            }, 60 * 60 * 1000);
        },
        onRegisterError(error) {
            console.error('SW registration error', error);
        },
    });

    useEffect(() => {
        // Check if app is already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
            return;
        }

        // Listen for beforeinstallprompt event
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);

            // Show prompt after 30 seconds or after 3 page views
            const installPromptDelay = localStorage.getItem('installPromptShown') ? 0 : 30000;
            if (!localStorage.getItem('installPromptDismissed')) {
                setTimeout(() => setShowInstallPrompt(true), installPromptDelay);
            }
        };

        // Listen for app installed event
        const handleAppInstalled = () => {
            setIsInstalled(true);
            setShowInstallPrompt(false);
            setDeferredPrompt(null);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        // Show the install prompt
        await deferredPrompt.prompt();

        // Wait for the user to respond
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
            // Vibrate for feedback if supported
            if ('vibrate' in navigator) {
                navigator.vibrate(50);
            }
        } else {
            console.log('User dismissed the install prompt');
        }

        setShowInstallPrompt(false);
        setDeferredPrompt(null);
        localStorage.setItem('installPromptShown', 'true');
    };

    const handleDismiss = () => {
        setShowInstallPrompt(false);
        localStorage.setItem('installPromptDismissed', 'true');
        // Don't show again for 7 days
        setTimeout(() => {
            localStorage.removeItem('installPromptDismissed');
        }, 7 * 24 * 60 * 60 * 1000);
    };

    const handleRefresh = () => {
        updateServiceWorker(true);
        setNeedRefresh(false);
        // Vibrate for feedback
        if ('vibrate' in navigator) {
            navigator.vibrate([50, 30, 50]);
        }
    };

    return (
        <>
            {/* Install Prompt - Mobile Bottom Sheet Style */}
            <AnimatePresence>
                {showInstallPrompt && !isInstalled && (
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed bottom-0 left-0 right-0 z-50 md:bottom-4 md:right-4 md:left-auto md:w-96"
                    >
                        <div className="bg-white dark:bg-gray-900 rounded-t-2xl md:rounded-2xl shadow-2xl p-6 pb-safe">
                            <button
                                onClick={handleDismiss}
                                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                aria-label="Dismiss"
                            >
                                <X className="h-5 w-5 text-gray-500" />
                            </button>

                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                        <Smartphone className="h-6 w-6 text-primary" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                        Install Kwika Events
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                        Add to your home screen for a faster, app-like experience with offline access
                                    </p>
                                    <div className="flex gap-3">
                                        <Button
                                            onClick={handleInstallClick}
                                            className="flex-1 bg-primary hover:bg-primary/90"
                                        >
                                            <Download className="h-4 w-4 mr-2" />
                                            Install App
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={handleDismiss}
                                            className="flex-1"
                                        >
                                            Not Now
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Update Available Notification */}
            <AnimatePresence>
                {(offlineReady || needRefresh) && (
                    <motion.div
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -100, opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed top-4 left-4 right-4 md:left-auto md:w-96 z-50"
                    >
                        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-start gap-3">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {offlineReady
                                            ? 'App ready to work offline'
                                            : 'New content available'}
                                    </p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                        {offlineReady
                                            ? 'You can now use the app without internet'
                                            : 'Click reload to update'}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    {needRefresh && (
                                        <Button
                                            size="sm"
                                            variant="default"
                                            onClick={handleRefresh}
                                            className="text-xs"
                                        >
                                            Reload
                                        </Button>
                                    )}
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => {
                                            setOfflineReady(false);
                                            setNeedRefresh(false);
                                        }}
                                        className="text-xs"
                                    >
                                        Dismiss
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* iOS Install Instructions (if no beforeinstallprompt support) */}
            <AnimatePresence>
                {showInstallPrompt && !deferredPrompt && !isInstalled && (
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed bottom-0 left-0 right-0 z-50 md:bottom-4 md:right-4 md:left-auto md:w-96"
                    >
                        <div className="bg-white dark:bg-gray-900 rounded-t-2xl md:rounded-2xl shadow-2xl p-6 pb-safe">
                            <button
                                onClick={handleDismiss}
                                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                aria-label="Dismiss"
                            >
                                <X className="h-5 w-5 text-gray-500" />
                            </button>

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Install Kwika Events
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    To install this app on iOS:
                                </p>
                                <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-2 list-decimal list-inside">
                                    <li>Tap the Share button in Safari</li>
                                    <li>Scroll down and tap "Add to Home Screen"</li>
                                    <li>Tap "Add" to install the app</li>
                                </ol>
                                <Button
                                    variant="outline"
                                    onClick={handleDismiss}
                                    className="w-full"
                                >
                                    Got it
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}