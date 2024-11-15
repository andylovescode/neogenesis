<script lang="ts">
import {parenthesiseMinimally} from "$lib/math.js";
import LucideVariable from "lucide-svelte/icons/variable";
import Expression from "$lib/components/Expression.svelte";
import VarName from "$lib/components/VarName.svelte";
import MessageCircleWarning from "lucide-svelte/icons/message-circle-warning";
import TriangleAlert from "lucide-svelte/icons/triangle-alert";
import Sparkles from "lucide-svelte/icons/sparkles";
import type {QuickButton, Step} from "$lib/solve";
import {Button} from "$lib/components/ui/button";

let { step, mutate }: { step: Step, mutate(button: QuickButton): void } = $props();
</script>

<div class="flex flex-row gap-4">
    <div class="size-12 rounded-full bg-foreground text-background hidden md:flex items-center justify-center">
        {#if step[0] === 'error'}
            <TriangleAlert/>
        {:else if step[0] === 'solve'}
            <LucideVariable/>
        {:else if step[0] === 'hint'}
            <MessageCircleWarning/>
        {:else if step[0] === 'summary'}
            <Sparkles/>
        {/if}
    </div>

    <div class="flex flex-col gap-1">
        {#if step[0] === 'error'}
            <p class="font-bold">Error</p>
            <p class="text-muted-foreground">{step[1]}</p>
        {:else if step[0] === 'solve'}
            <p class="font-bold">{step[1].title}</p>
            <p class="text-muted-foreground">{step[1].description}</p>

            <p>G:
                <math>
                    {#each step[1].given as [[x, key, unit], value]}
                        <mrow class="pr-2">
                            <VarName text={key}/>
                            <mo>=</mo>
                            <mn>{value}{unit ?? ""}</mn>
                        </mrow>
                    {/each}
                </math>
            </p>
            <p>U: <math>
                <mrow>
                    <VarName text={step[1].unknown[1]}/>
                    <mo>=</mo>
                    <mn>?</mn>
                </mrow>
            </math></p>
            <p>E:
                <math>
                    <mrow>
                        <VarName text={step[1].unknown[1]}/>
                        <mo>=</mo>
                        <Expression expr={parenthesiseMinimally(step[1].equation)}/>
                    </mrow>
                </math>
            </p>
            <p>S:
                <math>
                    <mrow>
                        <VarName text={step[1].unknown[1]}/>
                        <mo>=</mo>
                        <Expression expr={parenthesiseMinimally(step[1].substitute)}/>
                    </mrow>
                </math>
            </p>
            <p>S:
                <math>
                    <mrow>
                        <VarName text={step[1].unknown[1]}/>
                        <mo>=</mo>
                        <mn>{step[1].solve}{step[1].unknown[2] ?? ""}</mn>
                    </mrow>
                </math>
            </p>
            <div class="flex flex-row gap-2 mt-2">
                <Button size="tiny" variant="default" onclick={()=>{
                    mutate({text: "Make explicit", primary: true, set: {
                        [step[1].unknown[1]]: step[1].solve
                    }});
                }}>Make explicit</Button>
            </div>
        {:else if step[0] === 'hint'}
            <p class="font-bold">Hint</p>
            <p class="text-muted-foreground">{step[1].message}</p>
            <div class="flex flex-row gap-2 mt-2 flex-wrap">
                {#each step[1].quickButtons as button}
                    <Button size="tiny" variant={button.primary ? "default" : "secondary"} onclick={()=>{
                        mutate(button);
                    }}>{button.text}</Button>
                {/each}
            </div>
        {:else if step[0] === 'summary'}
            <p class="font-bold">Data at a glance</p>
            <div class="flex flex-col gap-4 items-start">
                {#each Array.from(step[1].variables).toSorted((a, b) => a[0].localeCompare(b[0])) as [key, value]}
                    <math><mrow><VarName text={key}/><mo>=</mo><mn>{value}</mn></mrow></math>
                {/each}
            </div>
        {/if}
    </div>
</div>