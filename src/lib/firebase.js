import { initializeApp, getApps, getApp } from 'firebase/app'
import { getDatabase, ref, onValue } from 'firebase/database'

export default async () => {
	const config = import.meta.env.VITE_FIREBASE_CONFIG
	const firebaseConfig = JSON.parse(atob(config))
	const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()

	const database = getDatabase(app)
	const dbRef = ref(database, '/')

	onValue(dbRef, (snapshot) => {
		console.log(snapshot.val())
	})
}
