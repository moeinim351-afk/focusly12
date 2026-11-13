/* Service worker ساده: پوسته‌ی برنامه را برای استفاده‌ی آفلاین کش می‌کند.
   درخواست‌های غیرهم‌مبدأ (مثل Supabase) هرگز کش نمی‌شوند. */
const VERSION = 'v2';
const SHELL_CACHE = `shell-${VERSION}`;
const ASSET_CACHE = `assets-${VERSION}`;
const SHELL = ['/', '/index.html', '/manifest.webmanifest', '/icons/icon.svg', '/icons/icon-192.png', '/icons/icon-512.png', '/icons/icon-maskable-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(SHELL_CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => ![SHELL_CACHE, ASSET_CACHE].includes(k)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // ناوبری: اول شبکه، در صورت آفلاین بودن پوسته‌ی کش‌شده
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(SHELL_CACHE).then((c) => c.put('/index.html', copy));
          return res;
        })
        .catch(() => caches.match('/index.html').then((r) => r || caches.match('/'))),
    );
    return;
  }

  // فایل‌های ثابت: stale-while-revalidate
  event.respondWith(
    caches.open(ASSET_CACHE).then(async (cache) => {
      const cached = await cache.match(req);
      const network = fetch(req)
        .then((res) => {
          if (res.ok) cache.put(req, res.clone());
          return res;
        })
        // آفلاین و بدون کش: قبلاً undefined برمی‌گشت و respondWith خطای TypeError می‌داد
        .catch(() => cached || Response.error());
      if (cached) {
        event.waitUntil(network.catch(() => undefined)); // به‌روزرسانی پس‌زمینه تا پایان کار نیمه‌کاره نماند
        return cached;
      }
      return network;
    }),
  );
});
