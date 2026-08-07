/* 어브로디 · service worker — offline 지원 + 최신본 우선.
   앱을 자주 고치는 단계라 HTML/JS/CSS는 network-first로 서빙해
   캐시가 오래된 화면을 붙잡는 문제를 막는다. Bump CACHE when core files change. */
const CACHE = 'abrody-v10';
const CORE = [
  './',
  './index.html',
  './s.html',
  './assets/app.css',
  './assets/app.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // 교차 출처(Pretendard 폰트 등): cache-first
  if (url.origin !== location.origin) {
    e.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => {
        if (res.ok && url.host.includes('jsdelivr.net')) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      }).catch(() => hit))
    );
    return;
  }

  // 동일 출처(앱 파일): network-first → 최신본을 받아 캐시 갱신, 오프라인이면 캐시 폴백
  e.respondWith(
    fetch(req).then((res) => {
      if (res.ok) {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy));
      }
      return res;
    }).catch(() => caches.match(req).then((hit) => hit || caches.match('./index.html')))
  );
});
