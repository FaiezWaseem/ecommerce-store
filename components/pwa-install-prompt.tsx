'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
};

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if the app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Store the event for later use
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show the install button
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      // Hide the install button when the app is installed
      setIsInstallable(false);
      setIsInstalled(true);
      // Clear the deferredPrompt
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
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    // We no longer need the prompt regardless of outcome
    setDeferredPrompt(null);
    
    if (outcome === 'accepted') {
      setIsInstallable(false);
    }
  };

  if (!isInstallable || isInstalled) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-sm">
      <div className="flex flex-col space-y-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">S.</span>
          </div>
          <div>
            <h3 className="font-semibold">Install Samreens</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Add to your home screen for a better experience</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => setIsInstallable(false)}
          >
            Not now
          </Button>
          <Button 
            className="flex-1 bg-teal-500 hover:bg-teal-600"
            onClick={handleInstallClick}
          >
            Install
          </Button>
        </div>
      </div>
    </div>
  );
}