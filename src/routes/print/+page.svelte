<script>
	import { tempFile } from '$lib/'
	import { listenToDatabase, realtimeSet, realtimeData } from '$lib'
	import { fade } from 'svelte/transition'
	import { onMount, tick } from 'svelte'

	let file,
		imgWidth,
		dbData = {},
		log,
		status = 'printable' // todo set this to 'printable'

	const getFile = async (e) => {
		const reader = new FileReader()
		reader.onload = (e) => {
			file = e.target.result
		}
		reader.readAsDataURL(e.target.files[0])
		status = ''
		await new Promise((r) => setTimeout(r, 500))
		status = 'print'
	}

	const postImage = async () => {
		await realtimeSet('print', file)
		await tick()
		if (dbData.print == file) {
			file = null
			await new Promise((r) => setTimeout(r, 1000))
			status = 'printed'
			log = 'printed'
			await new Promise((r) => setTimeout(r, 3000))
			log = null
			await new Promise((r) => setTimeout(r, 500))
			status = 'printable'
		}
	}

	const reset = async () => {
		file = null
		log = null
		await new Promise((r) => setTimeout(r, 500))
		status = 'printable'
	}

	onMount(() => {
		realtimeData.subscribe((data) => {
			dbData = data || {}
		})
		listenToDatabase()
	})
</script>

<svelte:head>
	<title>print</title>
</svelte:head>

<section>
	<form
		on:submit|preventDefault={postImage}
		class="w-4/5 h-full flex items-center justify-center"
	>
		{#if status == 'print' && file}
			<div class="w-full flex justify-center">
				<div transition:fade class="w-fit bg-neutral-light drop-shadow-lg p-4 rounded-3xl">
					<div class="w-full flex justify-end">
						<button
							class="rounded-full py-1 px-3 bg-dark-cream hover:bg-dark-cream/[.95] text-neutral-light cursor-pointer"
							on:click|preventDefault={reset}>nevermind</button
						>
					</div>
					<div class="w-full max-w-full relative flex justify-center my-2">
						<img
							bind:contentRect={imgWidth}
							src={file}
							alt="image"
							class="max-w-full max-h-[55svh] rounded-2xl h-full object-center"
						/>
					</div>
					<div class="w-full flex justify-center">
						<button type="submit" class="red-button">print</button>
					</div>
				</div>
			</div>
		{:else if status == 'printed' && log}
			<div transition:fade class="w-full h-full flex items-center justify-center">
				<div class="fruktur text-lg text-center text-blue-raspberry">
					{log}
				</div>
			</div>
		{:else if status == 'printable'}
			<input
				transition:fade
				type="file"
				accept="image/*"
				on:change={getFile}
				class="block w-full text-sm file:cursor-pointer file:mr-2 file:py-1 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-dark-cream file:text-neutral-light hover:file:bg-dark-cream/[.95]"
			/>
		{/if}
	</form>
</section>
