/* ClinicalCompass service worker.
   Install/offline without ever serving stale regulatory content to an online
   user:
   - Page navigations -> NETWORK-FIRST (online visitors always get the latest
     published build; cache is the offline fallback). This matters for a
     regulatory tool where content must not go stale silently.
   - Static assets (css/js/icons/manifest) -> CACHE-FIRST, with runtime caching.
   - External links (primary-source citations) are never intercepted.
   Bump CACHE when the asset list changes. */
const CACHE = 'clinicalcompass-v1';
const ASSETS = [
  './',
  'index.html',
  'css/theme.css',
  'css/layout.css',
  'css/components.css',
  'js/utils.js',
  'js/rules/profile.js',
  'js/rules/strategy-eu.js',
  'js/rules/strategy-fda.js',
  'js/rules/equivalence.js',
  'js/rules/data-gap.js',
  'js/rules/cep-cer.js',
  'js/rules/pmcf.js',
  'js/rules/sscp.js',
  'js/rules/psur-pms.js',
  'js/rules/samd-ai.js',
  'js/rules/pccp.js',
  'js/rules/ai-act.js',
  'js/rules/human-factors.js',
  'js/rules/cybersecurity.js',
  'js/rules/soup.js',
  'js/checklist-engine.js',
  'js/export.js',
  'js/app.js',
  'manifest.json',
  'icon.svg',
  'pwa-icon.svg',
  'pwa-icon-192.png',
  'pwa-icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // let external citations pass

  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put('index.html', copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match('index.html').then((r) => r || caches.match('./')))
    );
    return;
  }
  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req).then((res) => {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
      return res;
    }))
  );
});
