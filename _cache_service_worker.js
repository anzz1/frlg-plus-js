/*
	Cache Service Worker template by mrc 2019
	mostly based in:
	https://github.com/GoogleChrome/samples/blob/gh-pages/service-worker/basic/service-worker.js
	https://github.com/chriscoyier/Simple-Offline-Site/blob/master/js/service-worker.js
	https://gist.github.com/kosamari/7c5d1e8449b2fbc97d372675f16b566e	
	
	Note for GitHub Pages:
	there can be an unexpected behaviour (cache not updating) when site is accessed from
	https://user.github.io/repo/ (without index.html) in some browsers (Firefox)
	use absolute paths if hosted in GitHub Pages in order to avoid it
	also invoke sw with an absolute path:
	navigator.serviceWorker.register('/repo/_cache_service_worker.js', {scope: '/repo/'})
*/

var PRECACHE_ID='frlg-plus-js';
var PRECACHE_VERSION='006';
var PRECACHE_URLS=[
	'/frlg-plus-js/','/frlg-plus-js/index.html',
	'/frlg-plus-js/manifest.json',
	'/frlg-plus-js/style/app_icon_16.png',
	'/frlg-plus-js/style/app_icon_114.png',
	'/frlg-plus-js/style/app_icon_144.png',
	'/frlg-plus-js/style/app_icon_192.png',
	'/frlg-plus-js/style/app_icon_maskable.png',
	'/frlg-plus-js/style/logo.png',
	'/frlg-plus-js/style/logo.svg',
	'/frlg-plus-js/style/RomPatcher.css',
	'/frlg-plus-js/style/icon_close.svg',
	'/frlg-plus-js/style/icon_github.svg',
	'/frlg-plus-js/style/icon_heart.svg',
	'/frlg-plus-js/style/icon_settings.svg',
	'/frlg-plus-js/js/RomPatcher.js',
	'/frlg-plus-js/js/locale.js',
	'/frlg-plus-js/js/worker_apply.js',
	'/frlg-plus-js/js/worker_create.js',
	'/frlg-plus-js/js/worker_crc.js',
	'/frlg-plus-js/js/MarcFile.js',
	'/frlg-plus-js/js/crc.js',
	'/frlg-plus-js/js/zip.js/zip.js',
	'/frlg-plus-js/js/zip.js/z-worker.js',
	'/frlg-plus-js/js/zip.js/inflate.js',
//	'/frlg-plus-js/js/formats/ips.js',
//	'/frlg-plus-js/js/formats/ups.js',
//	'/frlg-plus-js/js/formats/aps.js',
	'/frlg-plus-js/js/formats/bps.js',
//	'/frlg-plus-js/js/formats/rup.js',
//	'/frlg-plus-js/js/formats/ppf.js',
//	'/frlg-plus-js/js/formats/pmsr.js',
//	'/frlg-plus-js/js/formats/vcdiff.js',
	'/frlg-plus-js/js/formats/zip.js'
];



// install event (fired when sw is first installed): opens a new cache
self.addEventListener('install', evt => {
	evt.waitUntil(
		caches.open('precache-'+PRECACHE_ID+'-'+PRECACHE_VERSION)
			.then(cache => cache.addAll(PRECACHE_URLS))
			.then(self.skipWaiting())
	);
});


// activate event (fired when sw is has been successfully installed): cleans up old outdated caches
self.addEventListener('activate', evt => {
	evt.waitUntil(
		caches.keys().then(cacheNames => {
			return cacheNames.filter(cacheName => (cacheName.startsWith('precache-'+PRECACHE_ID+'-') && !cacheName.endsWith('-'+PRECACHE_VERSION)));
		}).then(cachesToDelete => {
			return Promise.all(cachesToDelete.map(cacheToDelete => {
				console.log('delete '+cacheToDelete);
				return caches.delete(cacheToDelete);
			}));
		}).then(() => self.clients.claim())
	);
});


// fetch event (fired when requesting a resource): returns cached resource when possible
self.addEventListener('fetch', evt => {
	if(evt.request.url.startsWith(self.location.origin)){ //skip cross-origin requests
		evt.respondWith(
			caches.match(evt.request).then(cachedResource => {
				if (cachedResource) {
					return cachedResource;
				}else{
					return fetch(evt.request);
				}
			})
		);
	}
});
