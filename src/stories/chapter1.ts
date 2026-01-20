import type { Chapter } from '$lib/vn.types.ts'

// Chapter 1: Hello World - Python Basics
export const chapter1: Chapter = {
	id: 1,
	title: 'Halo Dunia',
	description: 'Kenalan dengan Bearcu dan pelajari Python dasar',
	learningConcept: 'Mencetak teks ke layar dengan print()',
	scenes: [
		// Scene 1: Introduction - Longer intro scene
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
				},
				{
					id: 'dialogue1-2',
					type: 'dialogue',
					speaker: 'Bearcu',
					text:
						'Aku tinggal di hutan belantara yang penuh dengan madu dan buah-buahan! Setiap hari, aku belajar hal-hal baru dan menulisnya dengan kode Python.',
					character: {
						characterId: 'bearcu',
						expression: 'excited',
						position: 'center',
						visible: true,
					},
				},
				{
					id: 'dialogue1-3',
					type: 'dialogue',
					speaker: 'Bearcu',
					text:
						'Hari ini, aku akan mengajarimu cara menulis kode Python pertamamu! Apakah kamu siap untuk petualangan ini?',
					character: {
						characterId: 'bearcu',
						expression: 'thinking',
						position: 'center',
						visible: true,
					},
				},
				{
					id: 'dialogue1-4',
					type: 'dialogue',
					speaker: 'Bearcu',
					text:
						'Ayo mulai! Kita akan belajar cara menulis pesan ke layar komputer. Ini adalah hal pertama yang semua programmer pelajari!',
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
		// Scene 2: First Python Challenge - Print Hello World
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
					text: 'Python adalah bahasa komputer yang sangat menyenangkan dan mudah dipelajari!',
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
					text:
						'Di Python, kita menggunakan fungsi bernama `print()` untuk mencetak teks ke layar. `print` artinya "cetak" dalam bahasa Indonesia.',
					character: {
						characterId: 'bearcu',
						expression: 'thinking',
						position: 'center',
						visible: true,
					},
				},
				{
					id: 'dialogue2-3',
					type: 'dialogue',
					speaker: 'Bearcu',
					text:
						'Kurung kurawal `()` adalah tempat kita menaruh apa yang ingin dicetak. Kita selalu menulis teks di dalam tanda kutip `""`.',
					character: {
						characterId: 'bearcu',
						expression: 'thinking',
						position: 'center',
						visible: true,
					},
				},
				{
					id: 'dialogue2-4',
					type: 'dialogue',
					speaker: 'Bearcu',
					text: 'Contohnya: `print("Halo")` akan mencetak kata "Halo" ke layar. Sekarang cobalah sendiri!',
					character: {
						characterId: 'bearcu',
						expression: 'happy',
						position: 'center',
						visible: true,
					},
				},
				{
					id: 'dialogue2-5',
					type: 'codeChallenge',
					speaker: 'Bearcu',
					text: 'Tantangan pertamamu! Gunakan print() untuk mencetak "Halo Dunia" ke layar.',
					character: {
						characterId: 'bearcu',
						expression: 'happy',
						position: 'center',
						visible: true,
					},
					codeChallenge: {
						id: 'challenge1-1',
						title: 'Tantangan 1: Halo Dunia',
						description:
							'Gunakan fungsi print() untuk mencetak "Halo Dunia" ke layar. Ingat untuk menggunakan tanda kutip!',
						starterCode: '# Ketik kodemu di sini\n',
						expectedOutput: 'Halo Dunia',
						hints: [
							'Gunakan fungsi print()',
							'Tulis teks di dalam tanda kutip: "Halo Dunia"',
							'Contoh: print("Halo")',
						],
						maxAttempts: 3,
					},
				},
				{
					id: 'dialogue2-6',
					type: 'dialogue',
					speaker: 'Bearcu',
					text: 'Hebat! Kamu berhasil menulis kode Python pertamamu! Selamat datang di dunia Python, programmer cilik!',
					character: {
						characterId: 'bearcu',
						expression: 'proud',
						position: 'center',
						visible: true,
					},
					nextSceneId: 'ch1-scene3',
				},
			],
		},
		// Scene 3: Printing Names
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
					text: 'Sekarang kamu bisa mencetak pesan! Bagaimana kalau kita mencetak namamu sendiri?',
					character: {
						characterId: 'bearcu',
						expression: 'excited',
						position: 'center',
						visible: true,
					},
				},
				{
					id: 'dialogue3-2',
					type: 'dialogue',
					speaker: 'Bearcu',
					text:
						'Kita bisa mencetak apa saja yang kita mau! Namamu, nama temanmu, atau bahkan nama binatang kesukaanmu!',
					character: {
						characterId: 'bearcu',
						expression: 'happy',
						position: 'center',
						visible: true,
					},
				},
				{
					id: 'dialogue3-3',
					type: 'dialogue',
					speaker: 'Bearcu',
					text:
						'Misalnya, aku bisa mencetak namaku sendiri: print("Bearcu"). Coba lihat, hasilnya adalah namaku di layar!',
					character: {
						characterId: 'bearcu',
						expression: 'thinking',
						position: 'center',
						visible: true,
					},
				},
				{
					id: 'dialogue3-4',
					type: 'codeChallenge',
					speaker: 'Bearcu',
					text: 'Sekarang coba cetak namamu sendiri ke layar!',
					character: {
						characterId: 'bearcu',
						expression: 'happy',
						position: 'center',
						visible: true,
					},
					codeChallenge: {
						id: 'challenge1-2',
						title: 'Tantangan 2: Cetak Namamu',
						description:
							'Gunakan print() untuk mencetak nama kamu sendiri ke layar. Ganti "NAMAMU" dengan nama aslimu!',
						starterCode: '# Cetak namamu di sini\nprint("NAMAMU")\n',
						expectedOutput: '',
						hints: [
							'Ganti tulisan NAMAMU dengan nama aslimu',
							'Pastikan nama ada di dalam tanda kutip',
							'Contoh: print("Budi") jika namamu Budi',
						],
						maxAttempts: 3,
						allowAnyOutput: true, // Accept any output since we can't know the user's name
					},
				},
				{
					id: 'dialogue3-5',
					type: 'dialogue',
					speaker: 'Bearcu',
					text: 'Luar biasa! Sekarang komputer mengetahui namamu. Tapi tunggu, ada hal lain yang bisa kita lakukan!',
					character: {
						characterId: 'bearcu',
						expression: 'excited',
						position: 'center',
						visible: true,
					},
					nextSceneId: 'ch1-scene4',
				},
			],
		},
		// Scene 4: Multiple Print Statements
		{
			id: 'ch1-scene4',
			chapterId: 1,
			sceneNumber: 4,
			background: 'forest',
			dialogues: [
				{
					id: 'dialogue4-1',
					type: 'dialogue',
					speaker: 'Bearcu',
					text:
						'Tahukah kamu bahwa kita bisa mencetak banyak teks sekaligus? Kita bisa menulis banyak perintah print()!',
					character: {
						characterId: 'bearcu',
						expression: 'thinking',
						position: 'center',
						visible: true,
					},
				},
				{
					id: 'dialogue4-2',
					type: 'dialogue',
					speaker: 'Bearcu',
					text:
						'Setiap perintah print akan dicetak di baris baru. Jadi kalau kita menulis dua print, akan muncul dua baris!',
					character: {
						characterId: 'bearcu',
						expression: 'thinking',
						position: 'center',
						visible: true,
					},
				},
				{
					id: 'dialogue4-3',
					type: 'dialogue',
					speaker: 'Bearcu',
					text: 'Contohnya: `print("Baris pertama")` dan `print("Baris kedua")` akan mencetak dua baris berbeda!',
					character: {
						characterId: 'bearcu',
						expression: 'thinking',
						position: 'center',
						visible: true,
					},
				},
				{
					id: 'dialogue4-4',
					type: 'codeChallenge',
					speaker: 'Bearcu',
					text: 'Sekarang coba cetak dua baris teks! Pertama "Halo", lalu "Dunia".',
					character: {
						characterId: 'bearcu',
						expression: 'happy',
						position: 'center',
						visible: true,
					},
					codeChallenge: {
						id: 'challenge1-3',
						title: 'Tantangan 3: Dua Baris',
						description: 'Gunakan print() dua kali untuk mencetak "Halo" dan "Dunia" di baris berbeda!',
						starterCode: '# Cetak dua baris teks\nprint("Halo")\n# Tambahkan print kedua di sini\n',
						expectedOutput: ['Halo', 'Dunia'],
						hints: [
							'Tulis print() kedua di baris baru',
							'Gunakan print("Dunia") untuk baris kedua',
							'Pastikan setiap print ada di baris sendiri',
						],
						maxAttempts: 3,
					},
				},
				{
					id: 'dialogue4-5',
					type: 'dialogue',
					speaker: 'Bearcu',
					text:
						'Sempurna! Kamu sekarang bisa membuat komputer mencetak banyak pesan! Ini adalah keterampilan penting untuk programmer!',
					character: {
						characterId: 'bearcu',
						expression: 'proud',
						position: 'center',
						visible: true,
					},
					nextSceneId: 'ch1-scene5',
				},
			],
		},
		// Scene 5: Introduction to Strings (Preview for next chapter)
		{
			id: 'ch1-scene5',
			chapterId: 1,
			sceneNumber: 5,
			background: 'forest',
			dialogues: [
				{
					id: 'dialogue5-1',
					type: 'dialogue',
					speaker: 'Bearcu',
					text:
						'Kamu sudah belajar banyak hari ini! Kita bisa mencetak "Halo Dunia", namamu, dan banyak baris sekaligus!',
					character: {
						characterId: 'bearcu',
						expression: 'happy',
						position: 'center',
						visible: true,
					},
				},
				{
					id: 'dialogue5-2',
					type: 'dialogue',
					speaker: 'Bearcu',
					text:
						'Di bab berikutnya, kita akan belajar tentang "strings" atau teks. Strings adalah teks yang disimpan dalam komputer!',
					character: {
						characterId: 'bearcu',
						expression: 'thinking',
						position: 'center',
						visible: true,
					},
				},
				{
					id: 'dialogue5-3',
					type: 'dialogue',
					speaker: 'Bearcu',
					text:
						'Kita juga akan belajar bagaimana membuat variabel untuk menyimpan informasi seperti nama umurmu atau nama kesukaanmu!',
					character: {
						characterId: 'bearcu',
						expression: 'excited',
						position: 'center',
						visible: true,
					},
				},
				{
					id: 'dialogue5-4',
					type: 'dialogue',
					speaker: 'Bearcu',
					text: 'Tapi sekarang, ada satu tantangan terakhir untuk menguji kemampuanmu!',
					character: {
						characterId: 'bearcu',
						expression: 'thinking',
						position: 'center',
						visible: true,
					},
					nextSceneId: 'ch1-scene6',
				},
			],
		},
		// Scene 6: Final Challenge - Combining Everything
		{
			id: 'ch1-scene6',
			chapterId: 1,
			sceneNumber: 6,
			background: 'forest',
			dialogues: [
				{
					id: 'dialogue6-1',
					type: 'dialogue',
					speaker: 'Bearcu',
					text: 'Ini adalah tantangan terakhir! Kombinasikan semua yang sudah kamu pelajari.',
					character: {
						characterId: 'bearcu',
						expression: 'thinking',
						position: 'center',
						visible: true,
					},
				},
				{
					id: 'dialogue6-2',
					type: 'codeChallenge',
					speaker: 'Bearcu',
					text: 'Cetak tiga baris: "Aku suka", "Belajar", dan "Python"!',
					character: {
						characterId: 'bearcu',
						expression: 'happy',
						position: 'center',
						visible: true,
					},
					codeChallenge: {
						id: 'challenge1-4',
						title: 'Tantangan 4: Tiga Baris',
						description:
							'Gunakan print() tiga kali untuk mencetak "Aku suka", "Belajar", dan "Python" di baris berbeda!',
						starterCode: '# Cetak tiga baris teks\nprint("Aku suka")\n# Tambahkan dua print lagi\n',
						expectedOutput: ['Aku suka', 'Belajar', 'Python'],
						hints: [
							'Gunakan print("Belajar") untuk baris kedua',
							'Gunakan print("Python") untuk baris ketiga',
							'Pastikan setiap print ada di baris sendiri',
						],
						maxAttempts: 3,
					},
				},
				{
					id: 'dialogue6-3',
					type: 'dialogue',
					speaker: 'Bearcu',
					text:
						'Luar biasa sekali! Kamu telah menyelesaikan Bab 1 - Halo Dunia! Kamu sudah belajar cara menggunakan print()!',
					character: {
						characterId: 'bearcu',
						expression: 'proud',
						position: 'center',
						visible: true,
					},
				},
				{
					id: 'dialogue6-4',
					type: 'dialogue',
					speaker: 'Bearcu',
					text:
						'Kamu sekarang adalah programmer Python pemula! Bersiaplah untuk tantangan lebih seru di bab berikutnya!',
					character: {
						characterId: 'bearcu',
						expression: 'happy',
						position: 'center',
						visible: true,
					},
				},
				{
					id: 'dialogue6-5',
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
							text: 'Lanjut ke Bab 2: Variabel',
							nextSceneId: 'ch1-scene7',
						},
						{
							id: 'choice2',
							text: 'Ulangi Bab 1',
							nextSceneId: 'ch1-scene1',
						},
						{
							id: 'choice3',
							text: 'Selesai untuk hari ini',
							nextSceneId: 'ch1-scene8',
						},
					],
				},
			],
		},
		// Scene 7: Transition to Chapter 2
		{
			id: 'ch1-scene7',
			chapterId: 1,
			sceneNumber: 7,
			background: 'forest',
			isEndOfChapter: true,
			dialogues: [
				{
					id: 'dialogue7-1',
					type: 'dialogue',
					speaker: 'Bearcu',
					text: 'Bagus sekali! Bab 2 akan membawamu ke dunia variabel - tempat kita menyimpan informasi seperti kotak!',
					character: {
						characterId: 'bearcu',
						expression: 'happy',
						position: 'center',
						visible: true,
					},
				},
				{
					id: 'dialogue7-2',
					type: 'dialogue',
					speaker: 'Bearcu',
					text: 'Kita akan belajar menyimpan nama, umur, warna kesukaan, dan banyak lagi! Sampai jumpa di Bab 2!',
					character: {
						characterId: 'bearcu',
						expression: 'excited',
						position: 'center',
						visible: true,
					},
				},
			],
		},
		// Scene 8: End of session
		{
			id: 'ch1-scene8',
			chapterId: 1,
			sceneNumber: 8,
			background: 'forest',
			isEndOfChapter: true,
			dialogues: [
				{
					id: 'dialogue8-1',
					type: 'dialogue',
					speaker: 'Bearcu',
					text: 'Bagus sekali! Kamu sudah bekerja keras hari ini. Istirahat dulu ya, programmer cilik!',
					character: {
						characterId: 'bearcu',
						expression: 'neutral',
						position: 'center',
						visible: true,
					},
				},
				{
					id: 'dialogue8-2',
					type: 'dialogue',
					speaker: 'Bearcu',
					text:
						'Jangan lupa untuk datang kembali besok! Ada banyak hal baru yang akan kita pelajari bersama. Sampai jumpa!',
					character: {
						characterId: 'bearcu',
						expression: 'happy',
						position: 'center',
						visible: true,
					},
				},
			],
		},
	],
}
