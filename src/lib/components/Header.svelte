<script>
	import { navigating } from '$app/stores'
	import { onMount } from 'svelte'

	let headerHeight = 0

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

<header class="w-full h-12 font-base flex items-center justify-center z-40">
	<nav class="w-full h-full list-none flex items-center justify-center">
		<ul class="w-full list-none flex items-center justify-center gap-2">
			{#each Object.keys(paths) as path}
				{#if (currentPath == '/' && path != currentPath) || currentPath != '/'}
					<li>
						<a
							href={path}
							class="font-semibold text-base rounded-full px-8 py-1 {currentPath ==
							'/'
								? 'bg-raspberry hover:bg-raspberry/[.95]'
								: currentPath == path
									? 'bg-blue-raspberry hover:bg-blue-raspberry/[.95]'
									: 'bg-blue-raspberry/[.85] hover:bg-blue-raspberry/[.75]'}"
							>{paths[path]}</a
						>
					</li>
				{/if}
			{/each}
		</ul>
	</nav>
</header>
