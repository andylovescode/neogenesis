<script lang="ts">
	import {Label} from "$lib/components/ui/label";
	import {Textarea} from "$lib/components/ui/textarea";
	import {rewriteScript, solveInternal} from "$lib/solve";
	import Step from "$lib/components/Step.svelte";

	let script = $state('')

    let steps = $derived(solveInternal(script));
</script>

<div class="flex flex-col gap-8 p-32 w-full">
    <div class="flex flex-col gap-2">
        <h1 class="text-3xl font-bold tracking-tight">The <s>Physics</s> Math Solver</h1>
        <p class="text-muted-foreground">(please make sure you know your stuff before you use this, you will need the knowledge)</p>
    </div>

    <div class="flex flex-col gap-1">
        <Label for="script">Script</Label>
        <Textarea id="script" placeholder="Enter your script here" bind:value={script}/>
    </div>

    <h2 class="text-2xl font-bold tracking-tight">Solution</h2>
    <div class="flex flex-col gap-4">
        {#each steps as step}
            <Step step={step} mutate={(button)=>{
                script = rewriteScript(script, button);
            }}/>
        {/each}
    </div>
</div>