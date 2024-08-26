<script>
	import { onMount } from 'svelte'

	let status, query, answer, documents

	/* const processQuery = async (e) => {
		console.log('submit')
		status = 'processing query'
		const res = await fetch('/api/query', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ query })
		})
		const data = await res.json()
		answer = data.answer
		documents = data.documents
	} */

	onMount(async () => {})
</script>

<section
	class="fixed top-0 left-0 w-screen h-dvh bg-blue-raspberry text-light-cream flex flex-col items-center justify-center"
>
	<img src="/favicon.png" alt="lampone" class="max-h-64" />
	<h1 class="text-6xl text-light-cream mb-2">lampone</h1>
	<p class="text-center font-semibold text-2xl">you 👉 raspberry pi</p>
</section>
