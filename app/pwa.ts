// Service Worker Registration Script

export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator && 'workbox' in window) {
    // Register the service worker
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch((err) => {
        console.error('Service Worker registration failed:', err);
      });
  }
}