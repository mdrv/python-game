<script lang='ts'>
	import { t } from '$stores/i18n.svelte.ts'
	import { getAutoSaveStatus, getCurrentProfile } from '$stores/save.svelte.ts'

	let autoSaveVisible = $state(false)

	// Get store values
	let autoSaveStatus = getAutoSaveStatus()
	let currentProfile = getCurrentProfile()

	$effect(() => {
		if (
			autoSaveStatus === 'saving' || autoSaveStatus === 'success'
			|| autoSaveStatus === 'error'
		) {
			autoSaveVisible = true
			setTimeout(() => {
				autoSaveVisible = false
			}, 2000)
		}
	})

	function formatLastSaved(timestamp: string | null): string {
		if (!timestamp) return 'belum pernah'
		const now = Date.now()
		const lastSaved = new Date(timestamp).getTime()
		const diff = now - lastSaved
		const seconds = Math.floor(diff / 1000)
		const minutes = Math.floor(seconds / 60)
		if (seconds < 60) return 'baru saja'
		if (minutes < 60) return `${minutes} menit yang lalu`
		const hours = Math.floor(minutes / 60)
		if (hours < 24) return `${hours} jam yang lalu`
		return `${Math.floor(hours / 24)} hari yang lalu`
	}

	let statusText = $derived(() => {
		switch (autoSaveStatus) {
			case 'saving':
				return t('saving')
			case 'success':
				return t('saved')
			case 'error':
				return 'Gagal menyimpan'
			case 'pending':
				return 'Menunggu...'
			default:
				return t('saved')
		}
	})

	let statusColor = $derived(() => {
		switch (autoSaveStatus) {
			case 'saving':
				return 'text-blue-600'
			case 'success':
				return 'text-green-600'
			case 'error':
				return 'text-red-600'
			default:
				return 'text-gray-600'
		}
	})
</script>

{#if autoSaveVisible}
	<div
		class='fixed top-4 right-4 flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-lg text-sm'
		role='status'
		aria-live='polite'
	>
		<svg
			class='w-5 h-5 text-bearcu-honey'
			fill='none'
			stroke='currentColor'
			viewBox='0 0 24 24'
		>
			<path
				stroke-linecap='round'
				stroke-linejoin='round'
				stroke-width='2'
				d='M19 21H5a2 2 0 0 0-2V5a2 2 0 0 2 2v14a2 2 0 0 2 2z'
			/>
		</svg>
		<span class={statusColor}>
			{statusText}
			{#if currentProfile?.lastPlayedAt}
				({formatLastSaved(currentProfile.lastPlayedAt)})
			{/if}
		</span>
	</div>
{/if}

<style>
	@keyframes pulse {
	  0%, 100% {
	    opacity: 1;
	  }
	  50% {
	    opacity: 0.3;
	  }
	}

	:global(.animate-pulse) {
	  animation: pulse 0.8s ease-in-out infinite;
	}
</style>
