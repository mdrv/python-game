import type { Chapter } from '$lib/vn.types.ts'

// Chapter 1: Hello World - Python Basics
export const chapter1: Chapter = {
	id: 1,
	title: 'Halo Dunia',
	description: 'Kenalan dengan Bearcu dan pelajari Python dasar',
	learningConcept: 'Mencetak teks ke layar dengan print()',
	scenes: [
		{
			id: 'ch1-scene1',
			chapterId: 1,
			sceneNumber: 1,
			background: 'forest',
			isStartOfChapter: true,
			dialogues: [
				{
					id: 'dialogue1-1',
					type: 'dialogue',
					speaker: 'Bearcu',
					text: 'Halo! Namaku Bearcu! Aku adalah beruang pendampingmu untuk belajar Python.',
					character: {
						characterId: 'bearcu',
						expression: 'happy',
						position: 'center',
						visible: true,
					},
					nextSceneId: 'ch1-scene2',
				},
			],
		},
		{
			id: 'ch1-scene2',
			chapterId: 1,
			sceneNumber: 2,
			background: 'forest',
			dialogues: [
				{
					id: 'dialogue2-1',
					type: 'dialogue',
					speaker: 'Bearcu',
					text:
						'Python adalah bahasa komputer yang sangat menyenangkan! Hari ini kita akan belajar cara mencetak teks ke layar.',
					character: {
						characterId: 'bearcu',
						expression: 'excited',
						position: 'center',
						visible: true,
					},
				},
				{
					id: 'dialogue2-2',
					type: 'dialogue',
					speaker: 'Bearcu',
					text: 'Di Python, kita menggunakan fungsi bernama `print()` untuk mencetak teks. Coba ketik ini:',
					character: {
						characterId: 'bearcu',
						expression: 'thinking',
						position: 'center',
						visible: true,
					},
				},
				{
					id: 'dialogue2-3',
					type: 'codeChallenge',
					speaker: 'Bearcu',
					text: 'Coba jalankan kode ini!',
					character: {
						characterId: 'bearcu',
						expression: 'happy',
						position: 'center',
						visible: true,
					},
					codeChallenge: {
						id: 'challenge1-1',
						title: 'Tantangan Pertama!',
						description: 'Gunakan print() untuk mencetak "Halo Dunia" ke layar.',
						starterCode: '# Ketik kodemu di sini\n',
						expectedOutput: 'Halo Dunia',
						hints: [
							'Gunakan fungsi print()',
							'Tulis teks di dalam tanda kutip: "Halo Dunia"',
							'Contoh: print("Halo")',
						],
						maxAttempts: 3,
					},
					nextSceneId: 'ch1-scene3',
				},
			],
		},
		{
			id: 'ch1-scene3',
			chapterId: 1,
			sceneNumber: 3,
			background: 'forest',
			dialogues: [
				{
					id: 'dialogue3-1',
					type: 'dialogue',
					speaker: 'Bearcu',
					text: 'Hebat! Kamu berhasil! Selamat datang di dunia Python!',
					character: {
						characterId: 'bearcu',
						expression: 'proud',
						position: 'center',
						visible: true,
					},
				},
				{
					id: 'dialogue3-2',
					type: 'choice',
					speaker: 'Bearcu',
					text: 'Apa yang ingin kamu lakukan selanjutnya?',
					character: {
						characterId: 'bearcu',
						expression: 'happy',
						position: 'center',
						visible: true,
					},
					choices: [
						{
							id: 'choice1',
							text: 'Belajar variabel',
							nextSceneId: 'ch1-scene4',
						},
						{
							id: 'choice2',
							text: 'Selesai untuk hari ini',
							nextSceneId: 'ch1-scene5',
						},
					],
				},
			],
		},
		{
			id: 'ch1-scene4',
			chapterId: 1,
			sceneNumber: 4,
			background: 'forest',
			isEndOfChapter: true,
			dialogues: [
				{
					id: 'dialogue4-1',
					type: 'dialogue',
					speaker: 'Bearcu',
					text: 'Baik! Kita akan belajar variabel di Bab berikutnya. Sampai jumpa!',
					character: {
						characterId: 'bearcu',
						expression: 'happy',
						position: 'center',
						visible: true,
					},
				},
			],
		},
		{
			id: 'ch1-scene5',
			chapterId: 1,
			sceneNumber: 5,
			background: 'forest',
			isEndOfChapter: true,
			dialogues: [
				{
					id: 'dialogue5-1',
					type: 'dialogue',
					speaker: 'Bearcu',
					text: 'Bagus sekali! Istirahat dulu ya. Sampai jumpa lagi besok!',
					character: {
						characterId: 'bearcu',
						expression: 'neutral',
						position: 'center',
						visible: true,
					},
				},
			],
		},
	],
}
