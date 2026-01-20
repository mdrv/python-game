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
	} from '$stores/story.svelte.ts'
	import { chapter1 } from '$stories/chapter1.ts'
	import { onMount } from 'svelte'

	// Local state
	let appReady = $state(false)
	let showChoiceMenu = $state(false)

	// Get store values
	let chapters = getChapters()
	let currentScene = getCurrentScene()
	let currentDialogue = getCurrentDialogue()
	let currentProfile = getCurrentProfile()

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
		console.log('App mounting...')

		try {
			// Initialize save system
			await initSaveSystem()

			console.log('Save system initialized')

			// Create a default profile if none exists
			createProfile('Anonim', 8)

			console.log('Profile created')

			// Load Chapter 1 data into store
			chapters.set(1, chapter1)

			console.log('Chapter 1 loaded')

			// Load first scene of chapter 1
			loadChapter(1)
			if (chapter1.scenes.length > 0) {
				loadScene(chapter1.scenes[0].id, chapter1.scenes)
			}

			console.log('Scene loaded')

			// Set app as ready
			appReady = true

			console.log('App ready:', appReady)
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
	function handleCodeSubmit(code: string): void {
		console.log('Code submitted:', code)
		// Would validate code here
		// For now, just advance to next dialogue
		handleNextDialogue()
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
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	.game-container {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		gap: 2rem;
		position: relative;
	}

	.character-area {
		flex: 1;
		display: flex;
		align-items: flex-end;
		justify-content: center;
		width: 100%;
	}

	.dialogue-area {
		width: 100%;
		max-width: 800px;
		z-index: 10;
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
