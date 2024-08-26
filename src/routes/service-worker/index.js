/// <reference types="@sveltejs/kit" />

// @ts-nocheck
import { build, files, version } from '$service-worker'

// Create a unique cache name for this deployment
const CACHE = `cache-${version}`

const ASSETS = [
	...build, // the app itself
	...files // everything in `static`
]

self.addEventListener('activate', (event) => {
	// Remove previous cached data from disk
	async function deleteOldCaches() {
		for (const key of await caches.keys()) {
			if (key !== CACHE) await caches.delete(key)
		}
	}

	event.waitUntil(deleteOldCaches())
})

self.addEventListener('fetch', (event) => {
	// ignore POST requests etc
	if (event.request.method !== 'GET') return

	async function respond() {
		const url = new URL(event.request.url)
		const cache = await caches.open(CACHE)
		// for everything else, try the network first, but
		// fall back to the cache if we're offline
		try {
			const response = await fetch(event.request)

			if (response.status === 200) {
				cache.put(event.request, response.clone())
			}

			return response
		} catch {
			return cache.match(event.request)
		}
	}

	event.respondWith(respond())
})
