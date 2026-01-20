<script lang='ts'>
	import type { Choice } from '$lib/vn.types.ts'

	// Props using Svelte 5 $props rune
	interface Props {
		choices: Choice[]
		onChoice: (choiceId: string, nextSceneId: string) => void
		title?: string
	}

	let { choices, onChoice, title = 'Pilih jawabanmu' }: Props = $props()

	function handleChoice(choice: Choice): void {
		onChoice(choice.id, choice.nextSceneId)
	}
</script>

<div class='choice-menu'>
	{#if title}
		<h2 class='choice-title'>{title}</h2>
	{/if}

	<div class='choices-list'>
		{#each choices as choice (choice.id)}
			<button
				class='choice-item'
				onclick={() => handleChoice(choice)}
				type='button'
			>
				<span class='choice-text'>{choice.text}</span>
				<span class='choice-arrow'>→</span>
			</button>
		{/each}
	</div>
</div>

<style>
	.choice-menu {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1.5rem;
		background: rgba(255, 255, 255, 0.95);
		border-radius: 1rem;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		max-width: 600px;
		width: 100%;
		animation: slideIn 0.3s ease-out;
	}

	.choice-title {
		font-size: 1.25rem;
		font-weight: bold;
		color: #8B4513;
		margin: 0;
		text-align: center;
	}

	.choices-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.choice-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 1.25rem;
		background: #8B4513;
		color: white;
		border: none;
		border-radius: 0.75rem;
		font-size: 1.0625rem;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.choice-item:hover {
		background: #A0522D;
		transform: translateX(4px);
	}

	.choice-item:active {
		transform: translateX(4px) scale(0.98);
	}

	.choice-item:focus {
		outline: 2px solid #FFC107;
		outline-offset: 2px;
	}

	.choice-text {
		flex: 1;
		text-align: left;
	}

	.choice-arrow {
		font-size: 1.25rem;
		margin-left: 1rem;
	}

	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
