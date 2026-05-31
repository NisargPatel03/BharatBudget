import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      // Drop v1 caches that stored stale index.html → 404 on old hashed bundles after deploy.
      const cacheKeys = await caches.keys();
      await Promise.all(
        cacheKeys
          .filter((key) => key.startsWith('bharatbudget-') && key !== 'bharatbudget-v2')
          .map((key) => caches.delete(key))
      );

      const registration = await navigator.serviceWorker.register('/sw.js');
      if (registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }
    } catch (err) {
      console.warn('Service Worker setup failed:', err);
    }
  });
}
