// IndexedDB Type Definitions for Bearcu Visual Novel
// Reference: https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API

import type { StoryState } from './vn.types'

/**
 * Kid profile data structure
 * Stores progress, achievements, and settings for each child
 */
export interface KidProfile {
	id: string
	name: string
	age: number
	createdAt: string
	lastPlayedAt: string
	story: StoryState
	achievements: string[]
	settings: {
		soundEnabled: boolean
		musicEnabled: boolean
		language: 'id' | 'en'
	}
}

/**
 * Auto-save status
 */
export type AutoSaveStatus = 'idle' | 'pending' | 'saving' | 'success' | 'error'

/**
 * Save result
 */
export interface SaveResult {
	success: boolean
	error?: string
	timestamp: number
}

/**
 * IndexedDB configuration
 */
export interface IndexedDBConfig {
	databaseName: string
	version: number
	storeName: string
}

/**
 * Database initialization options
 */
export interface InitOptions {
	config?: Partial<IndexedDBConfig>
	onSuccess?: () => void
	onError?: (error: DOMException) => void
}

/**
 * Database schema for upgrades
 */
export interface SchemaUpgrade {
	version: number
	upgradeFn: (db: IDBDatabase) => void
}
