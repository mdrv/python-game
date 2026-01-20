// Save Store - manages kid profiles with auto-save
// Uses Svelte 5 runes for reactive state management
// Reference: https://svelte.dev/docs/svelte/runes

import { getProfile, initIndexedDB, isDatabaseInitialized, saveProfile } from '$lib/indexeddb'
import type { AutoSaveStatus, KidProfile } from '$lib/indexeddb.types'
import { $derived, $effect, $state } from 'svelte/reactivity'

/**
 * Current kid profile state
 */
export let currentProfile = $state<KidProfile | null>(null)

/**
 * Auto-save status (used by AutoSaveIndicator component)
 */
export let autoSaveStatus = $state<AutoSaveStatus>('idle')

/**
 * Auto-save timeout ID (for debouncing)
 */
let autoSaveTimeoutId: ReturnType<typeof setTimeout> | null = null

/**
 * Auto-save interval ID (for periodic saves)
 */
let autoSaveIntervalId: ReturnType<typeof setInterval> | null = null

/**
 * Auto-save configuration
 */
const AUTO_SAVE_CONFIG = {
	debounceMs: 2000, // Wait 2 seconds after last change before saving
	intervalMs: 30000, // Also save every 30 seconds regardless of changes
} as const

/**
 * Derived: Check if a profile is loaded
 */
export let isProfileLoaded = $derived(currentProfile !== null)

/**
 * Derived: Check if auto-save is in progress
 */
export let isAutoSaving = $derived(
	autoSaveStatus === 'pending' || autoSaveStatus === 'saving',
)

/**
 * Initialize the database and load profile
 * Should be called when app starts
 */
export async function initSaveSystem(): Promise<boolean> {
	if (isDatabaseInitialized()) {
		return true
	}

	try {
		await initIndexedDB({
			onSuccess: () => {
				console.log('IndexedDB initialized successfully')
			},
			onError: (error) => {
				console.error('Failed to initialize IndexedDB:', error)
			},
		})
		return true
	} catch (error) {
		console.error('Failed to initialize save system:', error)
		return false
	}
}

/**
 * Load a profile by ID
 */
export async function loadProfile(profileId: string): Promise<void> {
	try {
		const profile = await getProfile(profileId)
		currentProfile = profile
	} catch (error) {
		console.error('Failed to load profile:', error)
		throw error
	}
}

/**
 * Create a new profile
 */
export function createProfile(name: string, age: number): KidProfile {
	const profile: KidProfile = {
		id: crypto.randomUUID(),
		name,
		age,
		createdAt: new Date().toISOString(),
		lastPlayedAt: new Date().toISOString(),
		story: {
			currentChapter: 1,
			currentScene: '',
			currentDialogueIndex: 0,
			completedChapters: [],
			changes: {},
			codeSubmissions: {},
		},
		achievements: [],
		settings: {
			soundEnabled: true,
			musicEnabled: true,
			language: 'id',
		},
	}

	currentProfile = profile
	return profile
}

/**
 * Update profile data and trigger auto-save
 */
export function updateProfile(updates: Partial<KidProfile>): void {
	if (!currentProfile) {
		console.warn('Cannot update profile: no profile loaded')
		return
	}

	currentProfile = { ...currentProfile, ...updates }
	triggerAutoSave()
}

/**
 * Update story progress
 */
export function updateStoryProgress(storyUpdates: Partial<typeof currentProfile.story>): void {
	if (!currentProfile) {
		console.warn('Cannot update story: no profile loaded')
		return
	}

	currentProfile = {
		...currentProfile,
		story: { ...currentProfile.story, ...storyUpdates },
		lastPlayedAt: new Date().toISOString(),
	}
	triggerAutoSave()
}

/**
 * Update last played time
 */
export function updateLastPlayed(): void {
	if (!currentProfile) {
		return
	}

	currentProfile = {
		...currentProfile,
		lastPlayedAt: new Date().toISOString(),
	}
}

/**
 * Trigger auto-save (debounced)
 */
function triggerAutoSave(): void {
	if (!currentProfile) {
		return
	}

	// Clear any pending timeout
	if (autoSaveTimeoutId) {
		clearTimeout(autoSaveTimeoutId)
	}

	// Set new timeout for debounced save
	autoSaveTimeoutId = setTimeout(() => {
		performAutoSave()
	}, AUTO_SAVE_CONFIG.debounceMs)

	autoSaveStatus = 'pending'
}

/**
 * Perform actual save
 */
async function performAutoSave(): Promise<void> {
	if (!currentProfile || !isDatabaseInitialized()) {
		return
	}

	autoSaveStatus = 'saving'

	try {
		const result = await saveProfile(currentProfile)
		if (result.success) {
			autoSaveStatus = 'success'
			// Reset to idle after showing success
			setTimeout(() => {
				if (autoSaveStatus === 'success') {
					autoSaveStatus = 'idle'
				}
			}, 1000)
		} else {
			console.error('Auto-save failed:', result.error)
			autoSaveStatus = 'error'
		}
	} catch (error) {
		console.error('Auto-save error:', error)
		autoSaveStatus = 'error'
	}
}

/**
 * Start periodic auto-save (every 30 seconds)
 */
export function startPeriodicAutoSave(): void {
	if (autoSaveIntervalId) {
		return // Already started
	}

	autoSaveIntervalId = setInterval(() => {
		if (currentProfile && autoSaveStatus !== 'saving') {
			performAutoSave()
		}
	}, AUTO_SAVE_CONFIG.intervalMs)
}

/**
 * Stop periodic auto-save
 */
export function stopPeriodicAutoSave(): void {
	if (autoSaveIntervalId) {
		clearInterval(autoSaveIntervalId)
		autoSaveIntervalId = null
	}
}

/**
 * Force immediate save
 */
export async function forceSave(): Promise<boolean> {
	if (!currentProfile) {
		return false
	}

	autoSaveStatus = 'saving'

	try {
		const result = await saveProfile(currentProfile)
		if (result.success) {
			autoSaveStatus = 'success'
			// Reset to idle after showing success
			setTimeout(() => {
				if (autoSaveStatus === 'success') {
					autoSaveStatus = 'idle'
				}
			}, 1000)
			return true
		} else {
			autoSaveStatus = 'error'
			return false
		}
	} catch (error) {
		console.error('Force save error:', error)
		autoSaveStatus = 'error'
		return false
	}
}

/**
 * Clear current profile (logout)
 */
export function clearProfile(): void {
	currentProfile = null
	stopPeriodicAutoSave()
}

// Initialize auto-save interval when a profile is loaded
$effect(() => {
	if (currentProfile) {
		startPeriodicAutoSave()
	} else {
		stopPeriodicAutoSave()
	}
})
