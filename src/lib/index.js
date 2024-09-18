import { writable } from 'svelte/store'
import { initializeApp, getApps, getApp } from 'firebase/app'
import { getDatabase, ref, set, get, onValue } from 'firebase/database'

export const realtimeData = writable({})

export const listenToDatabase = async () => {
	const config = import.meta.env.VITE_FIREBASE_CONFIG
	const firebaseConfig = JSON.parse(atob(config))

	const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
	const database = getDatabase(app)
	const dbRef = ref(database, '/')

	onValue(dbRef, (snapshot) => {
		const data = snapshot.val()

		if (data) {
			console.log(data)
			realtimeData.set(data)
		} else {
			realtimeData.set({})
		}
	})
}

export const realtimeSet = async (item, value) => {
	const config = import.meta.env.VITE_FIREBASE_CONFIG
	const firebaseConfig = JSON.parse(atob(config))

	const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
	const database = getDatabase(app)
	const newItemRef = ref(database, `/${item}`)
	await set(newItemRef, value)
}

export const realtimePush = async (item, value) => {
	const config = import.meta.env.VITE_FIREBASE_CONFIG
	const firebaseConfig = JSON.parse(atob(config))

	const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
	const database = getDatabase(app)
	const newItemRef = ref(database, `/${item}`)

	const snapshot = await get(newItemRef)
	console.log({ snapshot: snapshot.val() })
	let queue =
		snapshot.exists() && snapshot.val() != null && snapshot.val() !== '' ? snapshot.val() : {}

	const timestamp = Date.now()
	queue[timestamp] = value

	console.log({ queue })
	await set(newItemRef, queue)
}
