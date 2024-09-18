<script>
	import { marked } from 'marked'
	import { slide } from 'svelte/transition'
	import { createEventDispatcher } from 'svelte'
	export let text = 'he**llo**'
	export let align = 'left'
	export let invert = false
	export let flip = false
	export let focused = false
	export let key = 0

	const dispatcher = createEventDispatcher()

	$: console.log({ key, text, align })

	const renderer = new marked.Renderer()

	let parsed = marked(text, { renderer })

	$: {
		parsed = marked(text, { renderer })
		parsed = parsed.replaceAll('<p>', `<p style="text-align:${align};">`)
	}

	renderer.Paragraph = (text) => {
		return `<p class="text-{align}">{text}</p>`
	}

	const dispatchFocus = () => {
		dispatcher('focus', { key, focused })
	}

	const dispatchChange = () => {
		dispatcher('change', { key, text, align, invert, flip })
	}

	const dispatchDelete = () => {
		dispatcher('delete', { key })
	}

	const focus = () => {
		focused = !focused
		dispatchFocus()
	}

	const deleteParagraph = () => {
		dispatchDelete()
	}
</script>

<div
	transition:slide
	on:click|stopPropagation={focus}
	class="w-full h-fit relative {focused ? 'border-y-2 border-y-white border-dashed ' : ''}"
>
	<div
		class="line-{align} w-full h-fit text-{align} bg-white px-2 py-1"
		style="text-align={align}!important;"
	>
		{#if focused}
			<textarea
				on:keydown|stopPropagation
				on:click|preventDefault
				bind:value={text}
				class="w-full h-full overflow-y-scroll text-zinc-500 px-3 py-1 rounded-xl resize-none outline-none"
				style="text-align:{align};"
			></textarea>
		{:else}
			{@html parsed}
		{/if}
	</div>
	{#if focused}
		<!-- <div
			on:click|stopPropagation={focus}
			class="absolute top-2 right-2 w-8 aspect-square transition-transform delay-100 rotate-180"
		> -->
		<div
			on:click|stopPropagation={focus}
			class="absolute top-2 right-2 w-8 aspect-square transition-transform"
		>
			<img src="/ui/collapse.svg" alt="collapse" class="w-full" />
		</div>
		<div transition:slide class="w-full bg-white/65 p-2 flex items-center justify-end">
			<button
				on:click|stopPropagation={deleteParagraph}
				class="w-8 aspect-square p-2 bg-raspberry-light hover:bg-raspberry flex items-center justify-center"
			>
				<img src="/ui/delete.svg" alt="delete" class="w-full" />
			</button>
		</div>
	{/if}
</div>
