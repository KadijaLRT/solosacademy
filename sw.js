/* Solo's Academy service worker: caches everything so the app works offline. */
const CACHE = 'solos-academy-v68';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './retro.css',
  './games.css',
  './manifest.webmanifest',
  './js/data-words.js',
  './js/data-english.js',
  './js/data-trees.js',
  './js/data-water.js',
  './js/data-helpers.js',
  './js/data-moving.js',
  './js/data-buildings.js',
  './js/data-pathway.js',
  './js/data-fun.js',
  './js/data-topics.js',
  './js/data-facts.js',
  './js/data-agegames.js',
  './js/data-movies.js',
  './js/icons.js',
  './js/word-icons.js',
  './js/stage.js',
  './js/data-letters.js',
  './js/data-basics.js',
  './js/fun.js',
  './js/games.js',
  './js/skills.js',
  './js/trace.js',
  './js/phrases.js',
  './js/kid.js',
  './js/data-parent.js',
  './js/parent.js',
  './js/app.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
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
  if (new URL(req.url).pathname.indexOf('/api/') === 0) return; // never cache the story helper
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  event.respondWith(
    caches.match(req).then((hit) => {
      if (hit) return hit;
      return fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        return res;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
