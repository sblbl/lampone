<script>
	import { fade } from 'svelte/transition'
	let QRVisible = false,
		shareURLBtn

	const showQR = () => {
		console.log('show')
		QRVisible = true
	}

	const hideQR = () => {
		console.log('hide')
		QRVisible = false
	}

	const copyURL = async () => {
		navigator.clipboard.writeText(window.location.href)
		shareURLBtn.textContent = 'copied!'
		await new Promise((r) => setTimeout(r, 700))
		hideQR()
	}
</script>

<svelte:head>
	<title>home</title>
</svelte:head>

<!-- <section
	class="fixed top-0 left-0 w-screen h-screen max-h-lvh bg-blue-raspberry text-light-cream flex flex-col items-center justify-center"
> -->
<section class="text-light-cream">
	<img on:click|stopPropagation={showQR} src="/favicon.png" alt="lampone" class="max-h-64" />
	<h1 class="text-6xl text-light-cream mb-2">lampone</h1>
	<p class="text-center font-semibold text-2xl">you 👉 raspberry pi</p>
	{#if QRVisible}
		<div
			transition:fade
			on:click={hideQR}
			class="fixed top-0 left-0 w-full h-full backdrop-blur-xl flex flex-col items-center justify-center gap-3 z-50"
		>
			<div class="w-2/3 max-w-60 aspect-square bg-white rounded-2xl overflow-hidden">
				<img class="w-full" src="/qr-code.svg" />
			</div>
			<button
				class="w-2/3 max-w-60"
				bind:this={shareURLBtn}
				on:click|stopPropagation={copyURL}>share url</button
			>
		</div>
	{/if}
</section>
