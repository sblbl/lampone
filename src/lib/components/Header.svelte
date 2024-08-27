<script>
	import { navigating } from '$app/stores'
	import { onMount } from 'svelte'

	let paths = {
		'/': 'home',
		'/print': 'print',
		'/text': 'text'
	}

	let currentPath = ''

	const updatePath = () => {
		currentPath = $navigating.to.url.pathname
	}

	$: if ($navigating) updatePath()

	onMount(async () => {
		currentPath = window.location.pathname
	})
</script>

<header class="mt-4 w-full h-8 font-base flex items-center justify-center gap-2 z-40">
	<nav>
		<ul class="w-full list-none flex items-center justify-center gap-4">
			{#each Object.keys(paths) as path}
				{#if path != currentPath}
					<li>
						<a
							href={path}
							class="font-semibold text-lg rounded-full px-10 py-2 {currentPath == '/'
								? 'bg-raspberry hover:bg-raspberry/[.95]'
								: 'bg-blue-raspberry hover:bg-blue-raspberry/[.95]'}"
							>{paths[path]}</a
						>
					</li>
				{/if}
			{/each}
		</ul>
	</nav>
</header>
