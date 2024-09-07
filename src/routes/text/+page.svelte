<script>
	import { listenToDatabase, realtimeSet, realtimeData } from '$lib'
	import { fade } from 'svelte/transition'
	import { onMount, tick } from 'svelte'
	import Paragraph from '$lib/components/text/Paragraph.svelte'
	import ReceiptEnd from '$lib/components/text/ReceiptEnd.svelte'

	let sendBtn, addLineBtn, receitpWidth

	const lineModel = {
		text: '',
		align: 'left',
		invert: false,
		flip: false
	}

	const sampleText = {
		text: 'sending **formatted** texts',
		align: 'left',
		invert: false,
		flip: false
	}

	let texts = [
			sampleText,
			{
				text: 'destra',
				align: 'center',
				invert: false,
				flip: false
			},
			{
				text: 'culo',
				align: 'right',
				invert: false,
				flip: false
			}
		],
		focuses = [false],
		tempText = '',
		aligns = ['left', 'center', 'right'],
		currentAlign = 'left',
		currentText = structuredClone(lineModel),
		dbData = {},
		log,
		status = 'writable'

	$: console.log(texts)
	$: {
		if (tempText.length > 0 && addLineBtn) {
			addLineBtn.disabled = false
		} else if (addLineBtn) {
			addLineBtn.disabled = true
		}
	}

	const addLine = () => {
		currentText.text = tempText
		texts = [...texts, currentText]
		focuses = [...focuses, false]
		tempText = ''
		currentText = structuredClone(lineModel)
	}

	const resetParagraphsFocus = () => {
		focuses = focuses.map((f) => false)
	}

	const handleParagraphsFocus = (e) => {
		if (e.detail.focused) {
			focuses = focuses.map((f, i) => (i === e.detail.key ? true : false))
			console.log(focuses)
		} else {
			focuses[e.detail.key] = false
		}
	}

	const handleParagraphsChange = (e) => {
		const key = e.detail.key
		let newText = e.detail
		// remove key from new object
		delete newText.key
		texts[key] = newText
	}

	const handleParagraphsDelete = (e) => {
		texts = texts.filter((t, i) => i !== e.detail.key)
		focuses = focuses.filter((f, i) => i !== e.detail.key)
	}

	const postText = async () => {
		sendBtn.disabled = true
		await realtimeSet('text', texts)
		await tick()
		status = 'writing'
		texts = []
		await new Promise((r) => setTimeout(r, 1000))
		status = 'written'
		log = 'sent to printer'
		await new Promise((r) => setTimeout(r, 3000))
		log = null
		await new Promise((r) => setTimeout(r, 500))
		reset()
	}

	const reset = async () => {
		log = null
		await new Promise((r) => setTimeout(r, 500))
		status = 'writable'
	}

	onMount(() => {
		realtimeData.subscribe((data) => {
			dbData = data || {}
		})
		listenToDatabase()
	})
</script>

<svelte:body on:click|stopPropagation={resetParagraphsFocus} />

<section>
	<form
		on:submit|preventDefault={postText}
		class="w-4/5 flex-grow flex flex-col items-center justify-end"
	>
		<div
			bind:clientWidth={receitpWidth}
			class="flex-grow w-full flex flex-col items-start justify-end"
		>
			{#each texts as text, i}
				<Paragraph
					text={text.text}
					key={i}
					align={text.align}
					focused={focuses[i]}
					on:focus={handleParagraphsFocus}
					on:delete={handleParagraphsDelete}
				/>
			{/each}
		</div>
		<div class="w-full relative border-t-white border-t-4 border-dashed">
			<div class="h-16">
				<textarea
					bind:value={tempText}
					class="w-full h-full text-zinc-500 overflow-y-scroll px-3 py-1 resize-none outline-none"
					style="text-align: {currentAlign};"
					rows="10"
					placeholder="type to add text"
				></textarea>
			</div>
			<div class="w-full bg-white py-2 flex items-center justify-between">
				<div class=" w-7/12 flex items-center justify-start px-2 gap-2">
					{#each aligns as align}
						<button
							on:click={() => (currentAlign = align)}
							class="w-1/4 text-center px-0 py-1 text-sm {align != currentAlign
								? 'bg-dark-cream/[.50] hover:bg-dark-cream/[.45]'
								: ''}">{align}</button
						>
					{/each}
				</div>
				<div class="px-2">
					<button
						bind:this={addLineBtn}
						on:click={addLine}
						class="px-4 py-1 text-sm bg-blue-raspberry hover:bg-blue-raspberry/[.95] disabled:bg-blue-raspberry/[.50]"
						>add</button
					>
				</div>
			</div>
		</div>
		<ReceiptEnd n={16} w={receitpWidth} h={24} />
		<div class="w-full h-16 flex items-center justify-center">
			<button bind:this={sendBtn} type="submit" class="red-button">send</button>
		</div>
		<!-- {/if} -->
	</form>
</section>
