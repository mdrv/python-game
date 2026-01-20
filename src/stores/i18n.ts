// Localization Store - Indonesian language support
// Future: Expand to support multiple languages
// Reference: https://svelte.dev/docs/svelte/runes

import { $state } from 'svelte/reactivity'

export type Language = 'id' | 'en' | 'ja'

export interface Translation {
	ui: Record<string, string>
	story: Record<string, Record<string, string>>
}

// Indonesian translations
const idTranslations: Translation = {
	ui: {
		startGame: 'Mulai Petualangan',
		continueGame: 'Lanjutkan',
		chapters: 'Bab',
		achievements: 'Pencapaian',
		settings: 'Pengaturan',
		language: 'Bahasa',
		sound: 'Suara',
		music: 'Musik',
		back: 'Kembali',
		next: 'Lanjut',
		skip: 'Lewati',
		hint: 'Petunjuk',
		runCode: 'Jalankan Kode',
		checkAnswer: 'Periksa Jawaban',
		save: 'Simpan',
		load: 'Muat',
		saved: 'Disimpan',
		saving: 'Menyimpan...',
		loading: 'Memuat...',
		error: 'Kesalahan',
		success: 'Berhasil',
		retry: 'Coba Lagi',
		chapterCompleted: 'Bab Selesai',
		newChapterUnlocked: 'Bab Baru Terbuka',
	},
	story: {
		// Chapter 1
		chapter1Title: 'Halo Dunia',
		chapter1Desc: 'Kenalan dengan Bearcu dan pelajari Python dasar',
		// Python concepts
		pythonIntro: 'Python adalah bahasa komputer yang menyenangkan',
		variables: 'Variabel',
		variablesDesc: 'Variabel seperti kotak untuk menyimpan informasi',
		loops: 'Perulangan',
		loopsDesc: 'Perulangan mengulang tugas berkali-kali',
		functions: 'Fungsi',
		functionsDesc: 'Fungsi adalah blok kode yang dapat dipakai ulang',
		// Code concepts
		print: 'Mencetak ke layar',
		helloWorld: 'Halo Dunia',
	},
}

export let currentLanguage = $state<Language>('id')
export let translations = $state<Translation>(idTranslations)

/**
 * Get translated UI text
 */
export function t(key: string): string {
	return translations.ui[key] || key
}

/**
 * Get translated story text
 */
export function storyT(key: string): string {
	return translations.story[key] || key
}
