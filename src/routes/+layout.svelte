<script>
	import Header from '$lib/components/Header.svelte'
	import { navigating } from '$app/stores'
	import { onMount } from 'svelte'
	import '../app.css'

	let currentPath
	let offsetHeight = 0

	$: if ($navigating) updatePath()

	onMount(() => {
		currentPath = window.location.pathname
	})
	const updatePath = () => {
		console.log('updating path', window.location.pathname)
		currentPath = $navigating.to.url.pathname
	}
</script>

<svelte:body bind:offsetHeight />

<main
	class="w-screen {`h-[${offsetHeight}px]`} flex justify-center {currentPath == '/'
		? 'bg-blue-raspberry'
		: ''}"
>
	<div class="w-full h-full max-w-xl p-4 flex flex-col items-center justify-end">
		<div class="w-full flex-grow">
			<slot />
		</div>
		<Header />
	</div>
</main>
