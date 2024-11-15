<script lang="ts">
    let { text }: { text: string } = $props()

    function parse(text: string) {
		let ip = 0;
		let isDelta = false;

		if (text[ip] == "D") {
			ip++;
			isDelta = true;
        }

		return {
			isDelta,
            primary: text[ip],
            subscript: text.slice(ip + 1)
        }
    }

	let parsed = $derived(parse(text))
</script>

<msub>
    <mi>
        {#if parsed.isDelta}
            &Delta;
        {/if}
        {parsed.primary}
    </mi>
    <mi>{parsed.subscript}</mi>
</msub>