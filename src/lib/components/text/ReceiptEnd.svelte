<script>
	export let w = 0
	export let h = 28
	export let n = 10

	let divisionW, array
	$: divisionW = w / n
	$: array = Array.from({ length: n }, (_, i) => i)
</script>

<svg class="" width={w} height={h} viewBox="0 0 {w} {h}">
	{#each array as i}
		<polygon
			points="{divisionW * i},0 {divisionW * i + divisionW},0 {divisionW * i +
				divisionW / 2},{h}"
			fill="white"
		/>
	{/each}
</svg>
