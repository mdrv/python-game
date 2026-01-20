// Visual Novel Engine Type Definitions
// Reference: https://svelte.dev/docs/svelte/runes

export type ExpressionType = 'neutral' | 'happy' | 'thinking' | 'excited' | 'confused' | 'proud'

export type AnimationType = 'bounce' | 'shake' | 'nod' | 'idle'

export interface Character {
	id: string
	name: string
	color: string
}

export interface CharacterState {
	characterId: string
	expression: ExpressionType
	position: 'left' | 'center' | 'right'
	animation?: AnimationType
	visible: boolean
}

export interface DialogueNode {
	id: string
	type: 'dialogue' | 'codeChallenge' | 'choice'
	speaker?: string
	text: string
	character?: CharacterState
	nextSceneId?: string
	choices?: Choice[]
	codeChallenge?: CodeChallenge
}

export interface CodeChallenge {
	id: string
	title: string
	description: string
	starterCode: string
	expectedOutput?: string | string[]
	allowAnyOutput?: boolean // If true, any non-empty output is accepted (useful for name challenges)
	hints: string[]
	maxAttempts?: number
}

export interface Choice {
	id: string
	text: string
	nextSceneId: string
}

export interface Scene {
	id: string
	chapterId: number
	sceneNumber: number
	background: string
	dialogues: DialogueNode[]
	isStartOfChapter?: boolean
	isEndOfChapter?: boolean
}

export interface Chapter {
	id: number
	title: string
	description: string
	scenes: Scene[]
	learningConcept: string
}

export interface StoryState {
	currentChapter: number
	currentScene: string
	currentDialogueIndex: number
	completedChapters: number[]
	choices: Record<string, string | number>
	codeSubmissions: Record<string, string>
}
