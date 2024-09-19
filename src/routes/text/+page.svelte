<script>
	import { listenToDatabase, realtimeSet, realtimeData } from '$lib'
	import { fade } from 'svelte/transition'
	import { onMount, tick } from 'svelte'
	import Paragraph from '$lib/components/text/Paragraph.svelte'
	import ReceiptEnd from '$lib/components/text/ReceiptEnd.svelte'

	let mode = 'image',
		file

	let sendBtn, addLineBtn, receitpWidth, paragraphsContainer, fileInput

	const lineModel = {
		text: '',
		align: 'left',
		invert: false,
		flip: false,
		image: false
	}

	const sampleText = {
		text: 'sending **formatted** texts',
		align: 'left',
		invert: false,
		flip: false
	}

	let texts = [],
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
		if ((tempText.length > 0 || file) && addLineBtn) {
			addLineBtn.disabled = false
		} else if (addLineBtn) {
			addLineBtn.disabled = true
		}
	}
	$: {
		if (sendBtn && texts.length > 0) {
			sendBtn.disabled = false
		} else if (sendBtn) {
			sendBtn.disabled = true
		}
	}
	$: console.log({ currentAlign })

	const toggleMode = () => {
		mode = mode === 'text' ? 'image' : 'text'
	}

	const addLine = async () => {
		if (mode == 'image') {
			tempText = file
			console.log('adding image')
			file = null
			fileInput.value = ''
		}
		currentText.text = tempText
		currentText.align = currentAlign
		currentText.image = mode === 'image' ? true : false
		texts = [...texts, currentText]
		focuses = [...focuses, false]
		tempText = ''
		currentText = structuredClone(lineModel)
		// scroll smoothly to the bottom od paragraphsContainer
		await new Promise((r) => setTimeout(r, 500))
		paragraphsContainer.scrollTo({
			top: paragraphsContainer.scrollHeight,
			behavior: 'smooth'
		})
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
		texts[key] = {
			text: e.detail.text,
			align: e.detail.align,
			invert: e.detail.invert,
			flip: e.detail.flip,
			image: texts[key].image
		}
	}

	const handleParagraphsDelete = (e) => {
		texts = texts.filter((t, i) => i !== e.detail.key)
		focuses = focuses.filter((f, i) => i !== e.detail.key)
	}

	const getFile = async (e) => {
		const reader = new FileReader()
		reader.onload = (e) => {
			file = e.target.result
		}
		reader.readAsDataURL(e.target.files[0])
		await new Promise((r) => setTimeout(r, 500))
	}

	const postText = async () => {
		console.log('posting text')
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
		sendBtn.disabled = false
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

<section class="relative">
	<form
		on:submit|preventDefault={postText}
		class="w-full max-w-sm h-full flex flex-col items-center justify-end"
	>
		<div
			bind:this={paragraphsContainer}
			bind:clientWidth={receitpWidth}
			class="w-full h-3/4 max-h-full overflow-y-scroll"
		>
			<div class="flex flex-col min-h-full">
				<div class="mt-auto">
					{#each texts as text, i}
						<Paragraph
							text={text.text}
							key={i}
							align={text.align}
							focused={focuses[i]}
							image={text.image}
							on:focus={handleParagraphsFocus}
							on:delete={handleParagraphsDelete}
							on:change={handleParagraphsChange}
						/>
					{/each}
				</div>
			</div>
		</div>
		<button bind:this={sendBtn} type="submit" class="red-button absolute top-2 right-2"
			>send</button
		>
		<div class="w-full h-1/4">
			<div class="w-full relative">
				<div class="h-16">
					{#if mode == 'text'}
						<textarea
							bind:value={tempText}
							class="w-full h-full text-sm text-zinc-500 overflow-y-scroll pl-3 pr-10 py-1 resize-none outline-none"
							style="text-align: {currentAlign};"
							rows="10"
							placeholder="type to add text"
						></textarea>
					{:else}
						<input
							bind:this={fileInput}
							on:change={getFile}
							type="file"
							accept="image/*"
							class="w-full h-full rounded-none text-xs"
						/>
					{/if}
				</div>
				<div class="w-full bg-white py-2 flex items-center justify-between">
					<div class="ml-2">
						<button
							type="button"
							on:click={toggleMode}
							class="bg-white hover:bg-white p-0 flex items-center justify-center"
						>
							{#if mode == 'text'}
								<img src="/ui/text.svg" alt="text icon" class="h-6" />
							{:else}
								<img src="/ui/image.svg" alt="image icon" class="h-6" />
							{/if}
						</button>
					</div>
					<div class=" w-7/12 flex items-center justify-start px-2 gap-2">
						{#each aligns as align}
							<button
								type="button"
								on:click={() => (currentAlign = align)}
								class="w-1/3 text-center px-0 py-1 text-xs {align != currentAlign
									? 'bg-dark-cream/[.50] hover:bg-dark-cream/[.45]'
									: ''}">{align}</button
							>
						{/each}
					</div>
					<div class="px-2">
						<button
							type="button"
							bind:this={addLineBtn}
							on:click={addLine}
							class="px-4 py-1 text-sm bg-blue-raspberry hover:bg-blue-raspberry/[.95] disabled:bg-blue-raspberry/[.50]"
							>add</button
						>
					</div>
				</div>
			</div>
			<ReceiptEnd n={16} w={receitpWidth} h={16} />
		</div>
	</form>
</section>
