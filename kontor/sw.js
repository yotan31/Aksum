// Minimaler Service Worker: macht das Kontor auf dem Handy installierbar.
// Daten kommen immer frisch aus dem Netz (keine Zwischenspeicherung).
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", () => {});
