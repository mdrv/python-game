## Mistake 16: Importing Runes in .svelte.ts Files

### What I Did Wrong:

- Imported `$state`, `$derived`, `$effect` from `'svelte/reactivity'` in `.svelte.ts` files
- Got Svelte compile error: "The $ prefix is reserved, and cannot be used for variables and imports"
- Error occurred in save.svelte.ts, story.svelte.ts, and i18n.svelte.ts

### Root Cause:

- **Runes are available globally in `.svelte` and `.svelte.ts` files**
- Just like regular `.svelte` components, `.svelte.ts` store files don't need to import runes
- AGENTS.md now documents this rule explicitly

### The Error:

```
[plugin:vite-plugin-svelte-module] /x/g/vdev/python-game/src/stores/save.svelte.ts:2:9
The $ prefix is reserved, and cannot be used for variables and imports
https://svelte.dev/e/dollar_prefix_invalid
```

### What Was Wrong:

```typescript
// ❌ WRONG - Runes are global in .svelte.ts
import { $derived, $effect, $state } from 'svelte/reactivity'

export let currentProfile = $state<KidProfile | null>(null)
```

### Correct Approach:

```typescript
// ✅ CORRECT - Runes available globally, no import needed

export let currentProfile = $state<KidProfile | null>(null)
```

### Lessons Learned:

- **Runes are global in `.svelte.ts` files**: Just like `.svelte` components
- **Don't import runes**: `$state`, `$derived`, `$effect` are available automatically
- **This is intentional**: Svelte 5 treats `.svelte.ts` as special module type
- **AGENTS.md documents this**: File Naming Conventions section

### What Should Have Done:

1. **Read Svelte 5 documentation** on `.svelte.ts` files
2. **Check AGENTS.md** for file naming conventions
3. **Never import runes** in `.svelte.ts` files

### Reference:

- Svelte 5 documentation: https://svelte.dev/docs/svelte/llms.txt
- AGENTS.md lines 119-127: File Naming Conventions

---



