<script>
	import Header from '$lib/components/Header.svelte'
	import { navigating } from '$app/stores'
	import { onMount } from 'svelte'
	import '../app.css'

	let currentPath
	let offsetHeight = 0,
		mainHeight = 0

	$: console.log({ mainHeight })

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
	id="main"
	bind:clientHeight={mainHeight}
	class="w-screen h-dvh flex justify-center {currentPath == '/'
		? 'bg-blue-raspberry'
		: 'bg-light-cream'}"
>
	<div class="w-full max-w-xl" style="height: {mainHeight}px;">
		<div class="w-full" style="height: {mainHeight - 60}px;">
			<slot />
		</div>
		<Header />
	</div>
</main>

<style>
	main {
		height: 100vh;
		@media all and (display-mode: standalone) {
			height: 100lvh;
		}
	}
	#main {
		height: 100vh;
		@media all and (display-mode: standalone) {
			height: 100lvh;
		}
	}
</style>
