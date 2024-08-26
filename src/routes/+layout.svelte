<script>
	import Header from '$lib/components/Header.svelte'
	import { onMount } from 'svelte'
	import '../app.css'

	let title

	onMount(() => {
		try {
			title = document.querySelector('title').textContent
		} catch (e) {
			title = null
		}
		console.log('title', title)
	})
</script>

<main
	class="w-screen h-screen max-h-dvh flex justify-center {title == 'home'
		? 'bg-blue-raspberry'
		: ''}"
>
	<div class="w-full h-full max-w-xl p-4 flex flex-col items-center justify-end">
		<!-- {#if title != null}
			<h1 class="text-4xl trailing-wide select-none">{title}</h1>
		{/if} -->
		<div class="w-full flex-grow">
			<slot />
		</div>
		<Header />
	</div>
</main>
