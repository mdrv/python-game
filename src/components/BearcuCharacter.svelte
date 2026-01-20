<script lang='ts'>
	import type {
		AnimationType,
		CharacterState,
		ExpressionType,
	} from '$lib/vn.types'

	// Props using Svelte 5 $props rune
	interface Props {
		character?: CharacterState
		size?: number
	}

	let { character, size = 300 }: Props = $props()

	// Local state for animation
	let currentAnimation = $state<AnimationType>('idle')
	let showCharacter = $state(true)

	// Handle character animation changes
	$effect(() => {
		if (character?.animation) {
			currentAnimation = character.animation

			// Reset to idle after animation completes
			if (character.animation !== 'idle') {
				setTimeout(() => {
					currentAnimation = 'idle'
				}, 1000)
			}
		}

		if (character !== undefined) {
			showCharacter = character.visible
		}
	})

	// Get color for expression
	function getExpressionColor(expression: ExpressionType): string {
		switch (expression) {
			case 'happy':
				return '#FFD700'
			case 'excited':
				return '#FF6B6B'
			case 'thinking':
				return '#9370DB'
			case 'confused':
				return '#708090'
			case 'proud':
				return '#32CD32'
			default:
				return '#DEB887'
		}
	}

	// Get SVG path based on expression
	function getMouthPath(expression: ExpressionType): string {
		switch (expression) {
			case 'happy':
				return 'M 95 110 Q 100 120 105 110'
			case 'excited':
				return 'M 90 110 Q 100 130 110 110'
			case 'thinking':
				return 'M 95 115 Q 100 115 105 115'
			case 'confused':
				return 'M 95 115 L 105 110'
			case 'proud':
				return 'M 95 108 Q 100 118 105 108'
			default:
				return 'M 95 115 Q 100 115 105 115'
		}
	}

	// Get eyebrow position based on expression
	function getEyebrowOffset(expression: ExpressionType): number {
		switch (expression) {
			case 'thinking':
				return -3
			case 'confused':
				return 2
			default:
				return 0
		}
	}

	// Animation classes
	let animationClass = $derived(() => {
		if (currentAnimation === 'bounce') return 'animate-bounce'
		if (currentAnimation === 'shake') return 'animate-shake'
		if (currentAnimation === 'nod') return 'animate-nod'
		return ''
	})
</script>

{#if character && showCharacter}
	<div
		class='character-container {animationClass}'
		style={`width: ${size}px; height: ${size}px`}
	>
		<svg
			viewBox='0 0 200 200'
			class='bearcu-svg'
			style={`width: 100%; height: 100%; fill: ${
				getExpressionColor(
					character.expression,
				)
			}`}
		>
			<!-- Ears -->
			<circle cx='50' cy='60' r='25' />
			<circle cx='150' cy='60' r='25' />

			<!-- Head -->
			<circle cx='100' cy='100' r='60' />

			<!-- Eyes -->
			<circle cx='80' cy='95' r='8' fill='#333' />
			<circle cx='120' cy='95' r='8' fill='#333' />

			<!-- Eye highlights -->
			<circle cx='82' cy='93' r='3' fill='#fff' />
			<circle cx='122' cy='93' r='3' fill='#fff' />

			<!-- Eyebrows (position based on expression) -->
			<path
				d={`M 70 ${85 + getEyebrowOffset(character.expression)} Q 80 ${
					80 + getEyebrowOffset(character.expression)
				} 90 ${85 + getEyebrowOffset(character.expression)}`}
				fill='none'
				stroke='#5D3A1A'
				stroke-width='3'
				stroke-linecap='round'
			/>
			<path
				d={`M 110 ${85 + getEyebrowOffset(character.expression)} Q 120 ${
					80 + getEyebrowOffset(character.expression)
				} 130 ${85 + getEyebrowOffset(character.expression)}`}
				fill='none'
				stroke='#5D3A1A'
				stroke-width='3'
				stroke-linecap='round'
			/>

			<!-- Nose -->
			<ellipse cx='100' cy='105' rx='8' ry='6' fill='#5D3A1A' />

			<!-- Mouth -->
			<path
				d={getMouthPath(character.expression)}
				fill='none'
				stroke='#5D3A1A'
				stroke-width='3'
				stroke-linecap='round'
			/>

			<!-- Cheeks (for happy/excited expressions) -->
			{#if character.expression === 'happy' || character.expression === 'excited'}
				<circle cx='65' cy='115' r='6' fill='#FFB6C1' opacity='0.5' />
				<circle cx='135' cy='115' r='6' fill='#FFB6C1' opacity='0.5' />
			{/if}
		</svg>
	</div>
{/if}

<style>
	.character-container {
		transition: opacity 0.3s ease;
	}

	.bearcu-svg {
		filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
	}

	@keyframes bounce {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-20px);
		}
	}

	@keyframes shake {
		0%,
		100% {
			transform: rotate(0deg);
		}
		25% {
			transform: rotate(-10deg);
		}
		75% {
			transform: rotate(10deg);
		}
	}

	@keyframes nod {
		0%,
		100% {
			transform: rotate(0deg);
		}
		50% {
			transform: rotate(15deg);
		}
	}

	.animate-bounce {
		animation: bounce 0.5s ease-in-out;
	}

	.animate-shake {
		animation: shake 0.5s ease-in-out;
	}

	.animate-nod {
		animation: nod 0.5s ease-in-out;
	}
</style>
