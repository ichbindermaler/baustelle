// Minimaler Service Worker - macht die Seite auf Android installierbar.
// Kein echtes Offline-Caching, damit niemand aus Versehen eine alte
// Version der Seite ausgeliefert bekommt, obwohl online eine neue steht.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());
self.addEventListener('fetch', () => {}); // leer, aber nötig für die Install-Erkennung
