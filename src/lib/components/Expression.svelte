<script lang="ts">
    import type {Expression as TExpression } from "$lib/math";
	import Expression from './Expression.svelte';
	import VarName from "$lib/components/VarName.svelte";

	let { expr }: { expr: TExpression } = $props()

    function exprIsLarge(expr: TExpression) {
		if (["literal", "paren", "variable", "divide"].includes(expr[0])) {
            return false;
        }

		return true;
	}

	function exprIsSmall(expr: TExpression) {
		if (expr[0] === "literal" && expr[1] >= 0 && expr[2] === undefined) {
            return true;
        }
		if (expr[0] === "variable") {
            return true;
        }
		return false;
	}

    function computeProductChainStyles(exprs: TExpression[]) {
		const result: {expr: TExpression, style: 'times' | 'paren' | 'raw'}[] = [];
		let previousStyle: 'times' | 'paren' | 'raw' | 'none' = 'none';
		let previousIsLarge = false;

		for (let expr of exprs) {
			let style: 'times' | 'paren' | 'raw' = 'raw';
            let isLarge = exprIsLarge(expr);

			if (previousStyle !== "none" && expr[0] === "literal" && !previousIsLarge) {
				style = "paren";
            }

			if (expr[0] === "literal" && (expr[1] < 0 || expr[2] !== undefined)) {
				style = "paren";
            }

			if (expr[0] === "exp" && !exprIsSmall(expr[1])) {
                style = "paren";
            }

			if (previousIsLarge) {
				style = "times";
            }

			if (style === "paren") {
				isLarge = false;
            }

			if (expr[0] === "exp" && style === "paren") {
				style = "raw";
				expr = ["exp", ["paren", expr[1]], expr[2]];
            }

			result.push({expr, style});

			previousStyle = style;
			previousIsLarge = isLarge;
        }

		return result;
    }
</script>

{#if expr[0] === "product"}
    <mrow>
        {#each computeProductChainStyles(expr[1]) as subexpr, idx}
            {#if idx > 0}
                {#if subexpr.style === "times"}
                    <mo>&#8226;</mo>
                {:else if subexpr.style === "paren"}
                    <mo>(</mo>
                {/if}
            {/if}
            <Expression expr={subexpr.expr}/>
            {#if idx > 0}
                {#if subexpr.style === "paren"}
                    <mo>)</mo>
                {/if}
            {/if}
        {/each}
    </mrow>
{:else if expr[0] === "sum"}
    <mrow>
        {#each expr[1] as subexpr, idx}
            {#if idx > 0}
                <mo>+</mo>
            {/if}
            <Expression expr={subexpr}/>
        {/each}
    </mrow>
{:else if expr[0] === "variable"}
    <VarName text={expr[1]}/>
{:else if expr[0] === "literal"}
    <mn>
        {expr[1]}{expr[2] ?? ""}
    </mn>
{:else if expr[0] === "divide"}
    <mfrac>
        <Expression expr={expr[1]}/>
        <Expression expr={expr[2]}/>
    </mfrac>
{:else if expr[0] === "exp"}
    <msup>
        <Expression expr={expr[1]}/>
        <mn>{expr[2]}</mn>
    </msup>
{:else if expr[0] === "paren"}
    <mrow>
        <mo>(</mo>
        <Expression expr={expr[1]}/>
        <mo>)</mo>
    </mrow>
{:else if expr[0] === "sub"}
    <mrow>
        <Expression expr={expr[1]}/>
        <mo>-</mo>
        <Expression expr={expr[2]}/>
    </mrow>
{:else if expr[0] === "sqrt"}
    <msqrt>
        <Expression expr={expr[1]}/>
    </msqrt>
{:else if expr[0] === "sin"}
    <mrow>
        <mi>sin</mi>
        <mi>(</mi>
        <Expression expr={expr[1]}/>
        <mi>)</mi>
    </mrow>
{:else if expr[0] === "cos"}
    <mrow>
        <mi>cos</mi>
        <mi>(</mi>
        <Expression expr={expr[1]}/>
        <mi>)</mi>
    </mrow>
{:else if expr[0] === "tan"}
    <mrow>
        <mi>tan</mi>
        <mi>(</mi>
        <Expression expr={expr[1]}/>
        <mi>)</mi>
    </mrow>
{:else if expr[0] === "atan"}
    <mrow>
        <mi>atan</mi>
        <mi>(</mi>
        <Expression expr={expr[1]}/>
        <mi>)</mi>
    </mrow>
{/if}