<script lang='ts'>
	import { t } from '$stores/i18n'
	import { isSaving, lastSavedAt } from '$stores/save'

	let autoSaveVisible = $derived(false)

	$effect(() => {
		if (isSaving) {
			autoSaveVisible = true
			setTimeout(() => {
				autoSaveVisible = false
			}, 2000)
		}
	})

	function formatLastSaved(timestamp: number | null): string {
		if (!timestamp) return t('never')
		const now = Date.now()
		const diff = now - timestamp
		const minutes = Math.floor(diff / 60000)
		if (minutes < 1) return 'baru saja'
		if (minutes < 60) return `${minutes} menit yang lalu`
		const hours = Math.floor(minutes / 60)
		if (hours < 24) return `${hours} jam yang lalu`
		return `${Math.floor(hours / 24)} hari yang lalu`
	}
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
		<span class='text-gray-600'>
			{#if isSaving}
				{t('saving')}
			{:else}
				{t('saved')} ({formatLastSaved(lastSavedAt)})
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
