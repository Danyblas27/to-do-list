const CACHE_NAME = 'todolist-v8'
const urlsToCache = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/js/main.js',
    '/js/classes/storageManager.js',
    '/js/classes/taskManager.js',
    '/js/classes/toDoList.js',
    '/icons/web-app-manifest-192x192.png',
    '/icons/web-app-manifest-512x512.png',
    '/manifest.json'
]

// Instalación
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => {
            return cache.addAll(urlsToCache)
        })
    )
})

// Fetch
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => {
        if (response) {
            return response // servir desde cache
        }
        return fetch(event.request).catch(() => {
            // fallback
            if (event.request.destination === "document") {
            return caches.match("/index.html")
            } else if (event.request.destination === "script") {
            return new Response("", { status: 200, headers: { "Content-Type": "application/javascript" } })
            } else if (event.request.destination === "style") {
            return new Response("", { status: 200, headers: { "Content-Type": "text/css" } })
            } else {
            return new Response() // fallback genérico
            }
        })
        })
    )
})

// Activación
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
        return Promise.all(
            cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
                return caches.delete(cacheName)
            }
            })
        )
        })
    )
})