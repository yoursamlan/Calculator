const staticCacheName = 'site-static-v1';
const assets = [
  '/app/',
	'/app/index.html',
	'/app/style.css/',
  '/index.html',
  '/app/script.js',
  'https://rawcdn.githack.com/chrisveness/crypto/7067ee62f18c76dd4a9d372a00e647205460b62b/sha1.js',
	'https://code.jquery.com/jquery-1.12.0.min.js',
	'https://cdnjs.cloudflare.com/ajax/libs/normalize/5.0.0/normalize.min.css',
	'https: //fonts.googleapis.com/css?family=Source+Sans+Pro',
  'https://fonts.googleapis.com/css?family=Montserrat',
];
// install event
self.addEventListener('install', evt => {
	evt.waitUntil(
		caches.open(staticCacheName).then((cache) => {
			cache.addAll(assets);
			console.log('cached shell assets');
		})
	);
});
// activate event
self.addEventListener('activate', evt => {
	evt.waitUntil(
		caches.keys().then(keys => {
			return Promise.all(keys
				.filter(key => key !== staticCacheName)
				.map(key => caches.delete(key))
			);
		})
	);
});
// fetch event
self.addEventListener('fetch', evt => {
	evt.respondWith(
		caches.match(evt.request).then(cacheRes => {
			return cacheRes || fetch(evt.request);
		})
	);
});

const dynamicCacheName = 'site-dynamic-v1';
// activate event
self.addEventListener('activate', evt => {
	evt.waitUntil(
		caches.keys().then(keys => {
			return Promise.all(keys
				.filter(key => key !== dynamicCacheName)
				.map(key => caches.delete(key))
			);
		})
	);
});
// fetch event
self.addEventListener('fetch', evt => {
	evt.respondWith(
		caches.match(evt.request).then(cacheRes => {
			return cacheRes || fetch(evt.request).then(fetchRes => {
				return caches.open(dynamicCacheName).then(cache => {
					cache.put(evt.request.url, fetchRes.clone());
					return fetchRes;
				})
			});
		})
	);
});
