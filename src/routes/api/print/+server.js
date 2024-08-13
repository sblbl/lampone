import { json } from '@sveltejs/kit'
import { env } from '$env/dynamic/private'

export async function POST({ request }) {
	const { msg } = await request.json()

	// write to realtime db /msg

	return json({ msg: 'ok' }, { status: 200 })
	try {
	} catch (error) {
		return json({ error }, { status: 500 })
	}
}
