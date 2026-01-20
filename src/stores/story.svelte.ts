// Story Store - manages current story progress and state
// Uses Svelte 5 runes for reactive state management
// Reference: https://svelte.dev/docs/svelte/runes

import type { Chapter, DialogueNode, Scene, StoryState } from '$lib/vn.types.ts'

// Current story state
let storyState = $state<StoryState>({
	currentChapter: 1,
	currentScene: '',
	currentDialogueIndex: 0,
	completedChapters: [],
	choices: {},
	codeSubmissions: {},
})

// Store all chapters
let chapters = $state<Map<number, Chapter>>(new Map())

// Store current scene
let currentScene = $state<Scene | null>(null)

// Store current dialogue
let currentDialogue = $state<DialogueNode | null>(null)

// Derived: Check if chapter is complete
let isChapterComplete = $derived(
	storyState.completedChapters.includes(storyState.currentChapter),
)

// Derived: Get current chapter
let activeChapter = $derived(
	chapters.get(storyState.currentChapter) || null,
)

// Export getter functions for state
export const getStoryState = () => storyState
export const getChapters = () => chapters
export const getCurrentScene = () => currentScene
export const getCurrentDialogue = () => currentDialogue
export const getIsChapterComplete = () => isChapterComplete
export const getActiveChapter = () => activeChapter

/**
 * Set chapter data into store
 */
export function setChapter(chapterId: number, chapter: Chapter): void {
	chapters.set(chapterId, chapter)
}

/**
 * Load chapter data into store
 */
export function loadChapter(chapterId: number): void {
	storyState.currentChapter = chapterId
	storyState.currentScene = ''
	storyState.currentDialogueIndex = 0
	storyState.choices = {}
}

/**
 * Load specific scene
 */
export function loadScene(sceneId: string, scenes: Scene[]): void {
	const scene = scenes.find((s) => s.id === sceneId)
	if (scene) {
		currentScene = scene
		storyState.currentScene = sceneId
		storyState.currentDialogueIndex = 0
		loadDialogue(0)
	}
}

/**
 * Load specific dialogue by index
 */
export function loadDialogue(index: number): void {
	if (currentScene && index >= 0 && index < currentScene.dialogues.length) {
		storyState.currentDialogueIndex = index
		currentDialogue = currentScene.dialogues[index]
	}
}

/**
 * Advance to next dialogue
 */
export function nextDialogue(): void {
	if (!currentScene) {
		return
	}

	// Check if there are more dialogues in current scene
	if (storyState.currentDialogueIndex < currentScene.dialogues.length - 1) {
		loadDialogue(storyState.currentDialogueIndex + 1)
	} // Check if current dialogue has nextSceneId (scene transition)
	else if (currentDialogue?.nextSceneId) {
		const chapterData = chapters.get(storyState.currentChapter)
		if (chapterData) {
			loadScene(currentDialogue.nextSceneId, chapterData.scenes)
		}
	} // Check if end of chapter
	else if (currentScene.isEndOfChapter) {
		completeChapter()
	}
}

/**
 * Complete current chapter
 */
export function completeChapter(): void {
	if (!storyState.completedChapters.includes(storyState.currentChapter)) {
		storyState.completedChapters = [...storyState.completedChapters, storyState.currentChapter]
	}
}

/**
 * Record user choice
 */
export function recordChoice(sceneId: string, choiceId: string): void {
	storyState.choices = { ...storyState.choices, [sceneId]: choiceId }
}

/**
 * Record code submission
 */
export function recordCodeSubmission(exerciseId: string, code: string): void {
	storyState.codeSubmissions = { ...storyState.codeSubmissions, [exerciseId]: code }
}

/**
 * Reset story state
 */
export function resetStory(): void {
	storyState = {
		currentChapter: 1,
		currentScene: '',
		currentDialogueIndex: 0,
		completedChapters: [],
		choices: {},
		codeSubmissions: {},
	}
	currentScene = null
	currentDialogue = null
}
