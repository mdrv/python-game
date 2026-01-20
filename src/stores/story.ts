// Story Store - manages current story progress and state
// Uses Svelte 5 runes for reactive state management
// Reference: https://svelte.dev/docs/svelte/runes

import type { DialogueNode, Scene, StoryState } from '$lib/vn.types'
import { $derived, $state } from 'svelte/reactivity'

// Current story state
export let storyState = $state<StoryState>({
	currentChapter: 1,
	currentScene: '',
	currentDialogueIndex: 0,
	completedChapters: [],
	choices: {},
	codeSubmissions: {},
})

// Store all chapters
export let chapters = $state<Map<number, Chapter>>(new Map())

// Store current scene
export let currentScene = $state<Scene | null>(null)

// Store current dialogue
export let currentDialogue = $state<DialogueNode | null>(null)

// Derived: Check if chapter is complete
export let isChapterComplete = $derived(
	storyState.completedChapters.includes(storyState.currentChapter),
)

// Derived: Get current chapter
export let activeChapter = $derived(
	chapters.get(storyState.currentChapter) || null,
)

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
	if (currentScene && storyState.currentDialogueIndex < currentScene.dialogues.length - 1) {
		loadDialogue(storyState.currentDialogueIndex + 1)
	} else if (currentScene?.isEndOfChapter) {
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
