<script lang='ts'>
	import AutoSaveIndicator from '$components/AutoSaveIndicator.svelte'
	import BearcuCharacter from '$components/BearcuCharacter.svelte'
	import ChoiceMenu from '$components/ChoiceMenu.svelte'
	import DialogueBox from '$components/DialogueBox.svelte'
	import {
		createProfile,
		getCurrentProfile,
		initSaveSystem,
		startPeriodicAutoSave,
		stopPeriodicAutoSave,
		updateStoryProgress,
	} from '$stores/save.svelte.ts'
	import {
		getChapters,
		getCurrentDialogue,
		getCurrentScene,
		loadChapter,
		loadScene,
		nextDialogue,
		recordChoice,
		setChapter,
	} from '$stores/story.svelte.ts'
	import { chapter1 } from '$stories/chapter1.ts'
	import { onMount } from 'svelte'

	// Local state
	let appReady = $state(false)
	let showChoiceMenu = $state(false)

	// Get store values - use $derived for reactivity
	let chapters = $derived(getChapters())
	let currentScene = $derived(getCurrentScene())
	let currentDialogue = $derived(getCurrentDialogue())
	let currentProfile = $derived(getCurrentProfile())

	// Start/stop periodic auto-save when profile changes
	$effect(() => {
		if (currentProfile) {
			startPeriodicAutoSave()
		} else {
			stopPeriodicAutoSave()
		}
	})

	// Initialize app on mount
	onMount(async () => {
		try {
			// Initialize save system
			await initSaveSystem()

			// Create a default profile if none exists
			createProfile('Anonim', 8)

			// Load Chapter 1 data into store
			setChapter(1, chapter1)

			// Load first scene of chapter 1
			loadChapter(1)
			if (chapter1.scenes.length > 0) {
				loadScene(chapter1.scenes[0].id, chapter1.scenes)
			}

			// Set app as ready
			appReady = true
		} catch (error) {
			console.error('Error during app initialization:', error)
		}
	})

	// Handle next dialogue
	function handleNextDialogue(): void {
		nextDialogue()

		// Check if we need to show choice menu
		if (currentDialogue?.type === 'choice' && currentDialogue.choices) {
			showChoiceMenu = true
		} else {
			showChoiceMenu = false
		}

		// Update story progress
		if (currentScene) {
			updateStoryProgress({
				currentScene: currentScene.id,
			})
		}
	}

	// Handle choice selection
	function handleChoiceSelection(choiceId: string, nextSceneId: string): void {
		recordChoice(currentScene?.id || '', choiceId)
		showChoiceMenu = false

		// Load next scene
		const chapterData = chapters.get(1)
		if (chapterData) {
			loadScene(nextSceneId, chapterData.scenes)
		}
	}

	// Handle code submission
	function handleCodeSubmit(
		code: string,
	): { success: boolean; message?: string; output?: string[] } {
		if (!currentDialogue?.codeChallenge) {
			return { success: false, message: 'Tidak ada tantangan kode' }
		}

		const challenge = currentDialogue.codeChallenge

		// Extract print() statements from code
		const printMatches = code.match(/print\s*\(\s*"([^"]*?)"\s*\)/g) || []

		// Get the values being printed
		const outputs = printMatches.map((match) => {
			const contentMatch = match.match(/print\s*\(\s*"([^"]*?)"\s*\)/)
			return contentMatch ? contentMatch[1] : ''
		})

		let isValid = false

		// Check if allowAnyOutput is set (for name challenges)
		if (challenge.allowAnyOutput) {
			// Accept any non-empty output
			isValid = outputs.some((output) => output.trim().length > 0)
		} else if (Array.isArray(challenge.expectedOutput)) {
			// Check if outputs match expected array
			isValid = outputs.length === challenge.expectedOutput.length
				&& outputs.every((output, index) =>
					output === challenge.expectedOutput![index]
				)
		} else if (typeof challenge.expectedOutput === 'string') {
			// Check if outputs match expected string
			isValid = outputs.includes(challenge.expectedOutput)
		}

		if (isValid) {
			// Show success message and advance
			setTimeout(() => {
				handleNextDialogue()
			}, 1000) // Wait 1 second to show success message
			return {
				success: true,
				message: 'Benar! Kode berhasil dijalankan.',
				output: outputs,
			}
		} else {
			// Show error message
			return {
				success: false,
				message: 'Salah! Coba lagi atau periksa petunjuk.',
				output: outputs,
			}
		}
	}
</script>

{#if !appReady}
	<div class='loading-screen'>
		<p>Loading Bearcu Visual Novel...</p>
	</div>
{:else}
	<main class='app'>
		<!-- Auto-save indicator -->
		<AutoSaveIndicator />

		<!-- Main content area -->
		<div class='game-container'>
			<!-- Character display area -->
			<div class='character-area'>
				{#if currentDialogue?.character}
					<BearcuCharacter
						character={currentDialogue.character}
						size={300}
					/>
				{/if}
			</div>

			<!-- Dialogue box -->
			<div class='dialogue-area'>
				<DialogueBox
					dialogue={currentDialogue}
					onNext={handleNextDialogue}
					onChoice={handleChoiceSelection}
					onCodeSubmit={handleCodeSubmit}
				/>
			</div>

			<!-- Standalone choice menu -->
			{#if showChoiceMenu && currentDialogue?.choices}
				<div class='choice-overlay'>
					<ChoiceMenu
						choices={currentDialogue.choices}
						onChoice={handleChoiceSelection}
					/>
				</div>
			{/if}
		</div>
	</main>
{/if}

<style>
	.loading-screen {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100vh;
		font-size: 1.25rem;
		color: #8B4513;
	}

	.app {
		width: 100vw;
		height: 100vh;
		overflow: auto; /* Changed from hidden to auto for scrolling */
		display: flex;
		flex-direction: column;
	}

	.game-container {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start; /* Changed from center to flex-start */
		padding: 2rem;
		padding-bottom: 4rem; /* Extra padding at bottom for buttons */
		gap: 2rem;
		position: relative;
		min-height: 100vh; /* Ensure it can grow taller than viewport */
	}

	.character-area {
		flex-shrink: 0; /* Prevent character from shrinking */
		display: flex;
		align-items: flex-end;
		justify-content: center;
		width: 100%;
		max-height: 350px; /* Limit character height */
	}

	.dialogue-area {
		width: 100%;
		max-width: 800px;
		z-index: 10;
		flex-shrink: 0; /* Prevent dialogue from being cut off */
	}

	.choice-overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(0, 0, 0, 0.5);
		z-index: 20;
	}
</style>
