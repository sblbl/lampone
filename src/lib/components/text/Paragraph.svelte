<script>
	import { marked } from 'marked'
	import { slide } from 'svelte/transition'
	import { createEventDispatcher } from 'svelte'
	import { tick } from 'svelte'
	export let text = 'he**llo**'
	export let align = 'left'
	export let invert = false
	export let flip = false
	export let focused = false
	export let image = false
	export let key = 0

	const dispatcher = createEventDispatcher()
	let textarea

	$: console.log({ key, text, align })

	const renderer = new marked.Renderer()

	let parsed = marked(text, { renderer })

	$: {
		parsed = marked(text, { renderer })
		parsed = parsed.replaceAll('<p>', `<p style="text-align:${align};">`)
	}

	$: if (textarea && focused) {
		autoResize()
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

	const autoResize = async () => {
		textarea.style.height = 'auto'
		textarea.style.height = textarea.scrollHeight + 'px'
	}
</script>

<div
	transition:slide
	on:click|stopPropagation={focus}
	class="w-full h-fit relative border-b-4 border-b-white border-dotted text-sm"
>
	<div
		class="line-{align} w-full h-fit text-{align} bg-white px-10 py-2 outline-none"
		style="text-align={align}!important;"
	>
		{#if image}
			<div
				class="w-full flex items-center {align == 'left'
					? 'justify-start'
					: align == 'center'
						? 'justify-center'
						: 'justify-end'}"
			>
				<img src={text} alt="image" class="w-1/2 h-auto" />
			</div>
		{:else if focused}
			<textarea
				bind:this={textarea}
				on:keydown|stopPropagation
				on:click|stopPropagation
				bind:value={text}
				class="w-full h-auto overflow-y-scroll text-zinc-500 py-1 rounded-xl resize-none outline-none"
				style="text-align:{align};"
			></textarea>
		{:else}
			{@html parsed}
		{/if}
	</div>
	{#if focused}
		<div
			on:click|stopPropagation={focus}
			class="absolute top-2 right-2 w-8 aspect-square transition-transform"
		>
			<img src="/ui/collapse.svg" alt="collapse" class="w-full" />
		</div>
		<div transition:slide class="w-full bg-white/65 p-2 flex items-center justify-end gap-2">
			<button
				type="button"
				on:click|stopPropagation={() => {
					align = 'left'
					dispatchChange()
				}}
				class="text-center min-w-20 px-4 py-1 text-sm {align != 'left'
					? 'bg-dark-cream/[.50] hover:bg-dark-cream/[.45]'
					: ''}"
			>
				left
			</button>
			<button
				type="button"
				on:click|stopPropagation={() => {
					align = 'center'
					dispatchChange()
				}}
				class="text-center min-w-20 px-4 py-1 text-sm {align != 'center'
					? 'bg-dark-cream/[.50] hover:bg-dark-cream/[.45]'
					: ''}"
			>
				center
			</button>
			<button
				type="button"
				on:click|stopPropagation={() => {
					align = 'right'
					dispatchChange()
				}}
				class="text-center min-w-20 px-4 py-1 text-sm {align != 'right'
					? 'bg-dark-cream/[.50] hover:bg-dark-cream/[.45]'
					: ''}"
			>
				right
			</button>

			<button
				type="button"
				on:click|stopPropagation={deleteParagraph}
				class="w-8 aspect-square p-2 bg-raspberry-light hover:bg-raspberry flex items-center justify-center"
			>
				<img src="/ui/delete.svg" alt="delete" class="w-full" />
			</button>
		</div>
	{/if}
</div>
