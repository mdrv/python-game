<script lang='ts'>
	import type { DialogueNode } from '$lib/vn.types.ts'
	import { t } from '$stores/i18n.svelte.ts'

	// Props using Svelte 5 $props rune
	interface Props {
		dialogue: DialogueNode | null
		onNext?: () => void
		onChoice?: (choiceId: string, nextSceneId: string) => void
		onCodeSubmit?: (
			code: string,
		) => { success: boolean; message?: string; output?: string[] }
	}

	let { dialogue, onNext, onChoice, onCodeSubmit }: Props = $props()

	// Local state for code editor
	let code = $state('')
	let showHints = $state(false)
	let codeFeedback = $state<
		{
			success: boolean
			message?: string
			output?: string[]
		} | null
	>(null)

	// Reset code when dialogue changes
	$effect(() => {
		if (dialogue?.codeChallenge?.starterCode) {
			code = dialogue.codeChallenge.starterCode
			codeFeedback = null
		}
	})

	// Handle click on dialogue box
	function handleClick(): void {
		if (!dialogue) return

		// If dialogue is not complete, advance to next
		if (onNext) {
			onNext()
		}
	}

	// Handle choice selection
	function handleChoice(choiceId: string, nextSceneId: string): void {
		if (onChoice) {
			onChoice(choiceId, nextSceneId)
		}
	}

	// Handle code submission
	function handleSubmitCode(): void {
		if (onCodeSubmit && dialogue?.codeChallenge) {
			const result = onCodeSubmit(code)
			codeFeedback = result
		}
	}
</script>

{#if dialogue}
	<div class='dialogue-box'>
		<!-- Speaker name -->
		{#if dialogue.speaker}
			<div class='speaker-name'>
				{dialogue.speaker}
			</div>
		{/if}

		<!-- Dialogue text -->
		<div
			class='dialogue-text'
			onclick={handleClick}
			role='button'
			tabindex='0'
		>
			{dialogue.text}
		</div>

		<!-- Choice menu -->
		{#if dialogue.type === 'choice' && dialogue.choices}
			<div class='choices'>
				{#each dialogue.choices as choice (choice.id)}
					<button
						class='choice-button'
						onclick={() => handleChoice(choice.id, choice.nextSceneId)}
					>
						{choice.text}
					</button>
				{/each}
			</div>
		{/if}

		<!-- Code challenge -->
		{#if dialogue.type === 'codeChallenge' && dialogue.codeChallenge}
			<div class='code-challenge'>
				<div class='code-title'>
					{dialogue.codeChallenge.title}
				</div>
				<div class='code-description'>
					{dialogue.codeChallenge.description}
				</div>
				<div class='code-editor'>
					<textarea
						bind:value={code}
						class='code-input'
						placeholder='Ketik kode Python di sini...'
						rows='6'
					></textarea>
				</div>
				<div class='code-actions'>
					<button
						class='hint-button'
						onclick={() => (showHints = !showHints)}
					>
						{t('hint')}
					</button>
					<button class='run-button' onclick={handleSubmitCode}>
						{t('runCode')}
					</button>
				</div>
				{#if codeFeedback}
					<div
						class='code-feedback'
						class:success={codeFeedback.success}
						class:error={!codeFeedback.success}
					>
						{
							codeFeedback.message
							|| (codeFeedback.success ? 'Benar!' : 'Salah, coba lagi!')
						}
					</div>
				{/if}
				{#if codeFeedback?.output && codeFeedback.output.length > 0}
					<div class='code-output'>
						<div class='output-label'>Output:</div>
						{#each codeFeedback.output as line}
							<div class='output-line'>{line}</div>
						{/each}
					</div>
				{/if}
				{#if showHints && dialogue.codeChallenge.hints.length > 0}
					<div class='hints'>
						<h4>{t('hint')}</h4>
						<ul>
							{#each dialogue.codeChallenge.hints as hint}
								<li>{hint}</li>
							{/each}
						</ul>
					</div>
				{/if}
			</div>
		{/if}
	</div>
{/if}

<style>
	.dialogue-box {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1.5rem;
		background: rgba(255, 255, 255, 0.95);
		border-radius: 1rem;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		max-width: 800px;
		width: 100%;
		max-height: 85vh; /* Limit height to 85% of viewport */
		overflow-y: auto; /* Allow scrolling if content is too tall */
	}

	.speaker-name {
		font-size: 1.25rem;
		font-weight: bold;
		color: #8B4513;
	}

	.dialogue-text {
		font-size: 1.125rem;
		line-height: 1.6;
		color: #333;
		cursor: pointer;
		transition: background-color 0.2s;
		padding: 0.75rem;
		border-radius: 0.5rem;
	}

	.dialogue-text:hover {
		background-color: rgba(139, 69, 19, 0.05);
	}

	.dialogue-text:focus {
		outline: 2px solid #8B4513;
		outline-offset: 2px;
	}

	.choices {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.choice-button {
		padding: 0.75rem 1rem;
		background: #8B4513;
		color: white;
		border: none;
		border-radius: 0.5rem;
		font-size: 1rem;
		cursor: pointer;
		transition: background-color 0.2s, transform 0.1s;
	}

	.choice-button:hover {
		background: #A0522D;
	}

	.choice-button:active {
		transform: scale(0.98);
	}

	.code-challenge {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.code-title {
		font-size: 1.125rem;
		font-weight: bold;
		color: #8B4513;
	}

	.code-description {
		font-size: 1rem;
		color: #555;
	}

	.code-editor {
		display: flex;
	}

	.code-input {
		width: 100%;
		padding: 0.75rem;
		background: #f5f5f5;
		border: 2px solid #ddd;
		border-radius: 0.5rem;
		font-family: 'Courier New', monospace;
		font-size: 0.9375rem;
		resize: vertical;
		min-height: 120px; /* Minimum height for code editor */
		max-height: 300px; /* Maximum height to prevent it from being too tall */
	}

	.code-input:focus {
		outline: none;
		border-color: #8B4513;
	}

	.code-actions {
		display: flex;
		gap: 0.75rem;
	}

	.code-feedback {
		padding: 1rem;
		border-radius: 0.5rem;
		font-weight: bold;
		font-size: 1rem;
		margin-top: 0.5rem;
		text-align: center;
		animation: fadeIn 0.3s ease-in;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.code-feedback.success {
		background: #d4edda;
		color: #155724;
		border: 2px solid #155724;
	}

	.code-feedback.error {
		background: #f8d7da;
		color: #721c24;
		border: 2px solid #721c24;
	}

	.code-output {
		margin-top: 1rem;
		padding: 1rem;
		background: #f0f0f0;
		border: 2px solid #ddd;
		border-radius: 0.5rem;
		font-family: 'Courier New', monospace;
		font-size: 0.9375rem;
	}

	.output-label {
		font-weight: bold;
		color: #555;
		margin-bottom: 0.5rem;
	}

	.output-line {
		padding: 0.25rem 0;
		color: #333;
		line-height: 1.5;
	}

	.hint-button,
	.run-button {
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 0.5rem;
		font-size: 1rem;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.hint-button {
		background: #FFC107;
		color: #333;
	}

	.hint-button:hover {
		background: #FFD54F;
	}

	.run-button {
		background: #4CAF50;
		color: white;
	}

	.run-button:hover {
		background: #45a049;
	}

	.hints {
		padding: 1rem;
		background: #FFF9C4;
		border-radius: 0.5rem;
		border-left: 4px solid #FFC107;
	}

	.hints h4 {
		margin: 0 0 0.5rem 0;
		font-size: 1rem;
		color: #8B4513;
	}

	.hints ul {
		margin: 0;
		padding-left: 1.25rem;
	}

	.hints li {
		margin-bottom: 0.5rem;
	}
</style>
