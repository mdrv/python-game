// IndexedDB Wrapper Library
// Reference: https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB

import type { IndexedDBConfig, InitOptions, KidProfile, SaveResult } from './indexeddb.types'

// Default configuration
const DEFAULT_CONFIG: IndexedDBConfig = {
	databaseName: 'bearcu-vn',
	version: 1,
	storeName: 'kidProfiles',
}

let db: IDBDatabase | null = null

/**
 * Initialize IndexedDB database
 * Creates database with proper schema if it doesn't exist
 */
export async function initIndexedDB(options: InitOptions = {}): Promise<boolean> {
	const config: IndexedDBConfig = { ...DEFAULT_CONFIG, ...options.config }

	return new Promise((resolve, reject) => {
		// Check if IndexedDB is available
		if (!window.indexedDB) {
			const error = new DOMException(
				'IndexedDB not supported in this browser',
				'NotSupportedError',
			)
			options.onError?.(error)
			reject(error)
			return
		}

		const request = indexedDB.open(config.databaseName, config.version)

		request.onerror = () => {
			const error = request.error || new DOMException('Unknown error', 'UnknownError')
			options.onError?.(error as DOMException)
			reject(error)
		}

		request.onsuccess = () => {
			db = request.result
			options.onSuccess?.()
			resolve(true)
		}

		request.onupgradeneeded = (event) => {
			const database = (event.target as IDBOpenDBRequest).result

			// Create object store for kid profiles
			if (!database.objectStoreNames.contains(config.storeName)) {
				const objectStore = database.createObjectStore(config.storeName, {
					keyPath: 'id',
				})

				// Create indexes for efficient queries
				objectStore.createIndex('name', 'name', { unique: false })
				objectStore.createIndex('createdAt', 'createdAt', { unique: false })
				objectStore.createIndex('lastPlayedAt', 'lastPlayedAt', { unique: false })
			}
		}
	})
}

/**
 * Get a kid profile by ID
 */
export async function getProfile(profileId: string): Promise<KidProfile | null> {
	if (!db) {
		throw new Error('Database not initialized. Call initIndexedDB() first.')
	}

	return new Promise((resolve, reject) => {
		const transaction = db!.transaction(DEFAULT_CONFIG.storeName, 'readonly')
		const objectStore = transaction.objectStore(DEFAULT_CONFIG.storeName)
		const request = objectStore.get(profileId)

		request.onerror = () => {
			reject(request.error || new Error('Failed to get profile'))
		}

		request.onsuccess = () => {
			const profile = request.result as KidProfile | undefined
			resolve(profile || null)
		}
	})
}

/**
 * Save or update a kid profile
 */
export async function saveProfile(profile: KidProfile): Promise<SaveResult> {
	if (!db) {
		return {
			success: false,
			error: 'Database not initialized',
			timestamp: Date.now(),
		}
	}

	return new Promise((resolve) => {
		const transaction = db!.transaction(DEFAULT_CONFIG.storeName, 'readwrite')
		const objectStore = transaction.objectStore(DEFAULT_CONFIG.storeName)
		const request = objectStore.put(profile)

		request.onerror = () => {
			resolve({
				success: false,
				error: request.error?.message || 'Failed to save profile',
				timestamp: Date.now(),
			})
		}

		request.onsuccess = () => {
			resolve({
				success: true,
				timestamp: Date.now(),
			})
		}
	})
}

/**
 * Delete a kid profile
 */
export async function deleteProfile(profileId: string): Promise<boolean> {
	if (!db) {
		throw new Error('Database not initialized. Call initIndexedDB() first.')
	}

	return new Promise((resolve, reject) => {
		const transaction = db!.transaction(DEFAULT_CONFIG.storeName, 'readwrite')
		const objectStore = transaction.objectStore(DEFAULT_CONFIG.storeName)
		const request = objectStore.delete(profileId)

		request.onerror = () => {
			reject(request.error || new Error('Failed to delete profile'))
		}

		request.onsuccess = () => {
			resolve(true)
		}
	})
}

/**
 * Get all kid profiles
 */
export async function getAllProfiles(): Promise<KidProfile[]> {
	if (!db) {
		throw new Error('Database not initialized. Call initIndexedDB() first.')
	}

	return new Promise((resolve, reject) => {
		const transaction = db!.transaction(DEFAULT_CONFIG.storeName, 'readonly')
		const objectStore = transaction.objectStore(DEFAULT_CONFIG.storeName)
		const request = objectStore.getAll()

		request.onerror = () => {
			reject(request.error || new Error('Failed to get profiles'))
		}

		request.onsuccess = () => {
			resolve(request.result as KidProfile[])
		}
	})
}

/**
 * Close the database connection
 */
export function closeDatabase(): void {
	if (db) {
		db.close()
		db = null
	}
}

/**
 * Check if database is initialized
 */
export function isDatabaseInitialized(): boolean {
	return db !== null
}
