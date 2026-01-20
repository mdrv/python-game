## Mistake 1: Not Checking NPM Registry Before Specifying Package Versions

### What I Did Wrong:

- Created `package.json` with arbitrary version numbers (e.g., `^5.0.0`)
- Didn't verify actual available versions on https://npmjs.org
- Assumed versions without checking official registries

### Correct Approach:

- **ALWAYS check https://npmjs.org/package/<name> before installing/using packages**
- Use latest stable version or follow official documentation
- Verify package exists before adding to package.json

### Reference:

- https://www.npmjs.org/package/@sveltejs/tsconfig
- https://www.npmjs.org/package/pandacss
- AGENTS.md line: "When to check NPM registry"

---



## Mistake 3: Not Understanding Root Cause of `bun create vite` Failure

### What I Did Wrong:

- Tried multiple times to run `bun create vite .`
- Got "Operation cancelled" error
- Proceeded to manually create files without understanding why

### Correct Approach:

- **Read and analyze error messages completely**
- The error explicitly stated: "Current directory is not empty. Please choose how to proceed"
- Options were:
  - Remove existing files and continue
  - Ignore files and continue
  - Cancel and document mistakes
- I should have asked for user permission to remove existing files
- OR created project in a temporary directory

### Reference:

- AGENTS.md says: "If you make a mistake or realize an error in previous action: 1. Acknowledge explicitly, 2. Explain the error, 3. Propose a fix, 4. Ask for confirmation"

---



## Mistake 4: Continuing After Repeated LSP Errors

### What I Did Wrong:

- Got LSP errors about missing modules and Svelte runes
- Kept trying to fix errors without understanding root cause
- Didn't stop to think about the actual problem

### Correct Approach:

- **Stop and analyze before continuing**
- The LSP errors occurred because:
  1. Dependencies not installed (Svelte 5 not available to TypeScript compiler)
  2. Wrong file extensions (`.svelte.ts` instead of `.ts`)
  3. Module paths not configured yet
- I should have:
  1. Stopped after first set of errors
  2. Identified that packages need to be installed first
  3. Asked user for permission to run `bun install`

### Reference:

- AGENTS.md says: "If encountering a bug/error, attempt up to 3 logical solutions. If no progress after 3 attempts OR 5 minutes, STOP and provide: 1. What you tried, 2. Error messages, 3. Possible causes, 4. Write your mistakes on AGENTS-MISTAKES.md, 5. Next steps for your master to try manually"

---



## Mistake 5: Not Following Latest Documentation for Svelte 5 (CORRECTED)

### What I Did Wrong:

- Initially thought store files should use `.ts` extension
- **Mistake 5 was completely INCORRECT** - I got it backwards
- The correct convention is `.svelte.ts`, not `.ts`

### CORRECT Information (Fixed):

- **Store files MUST use `.svelte.ts` extension**
- **`.svelte.ts` files have special rules**:
  - Runes are available globally (no import needed)
  - State cannot be exported directly (must use getter functions)
- **Regular `.ts` files** cannot use runes (they must import from `'svelte/reactivity'`)

### Correct Pattern:

```typescript
// File: src/stores/example.svelte.ts

// Runes available globally - no import needed
let state = $state({ value: 0 })

// Export getter function (NOT direct export)
export const getState = () => state

// Functions are fine to export directly
export function updateValue(newValue: number) {
	state.value = newValue
}
```

### Lessons Learned:

- **Mistake 5 was wrong**: I initially documented the opposite of what's correct
- **`.svelte.ts` is special**: Different from regular `.ts` files
- **AGENTS.md now documents this**: File Naming Conventions section
- **Master corrected me**: Store files use `.svelte.ts`, not `.ts`

### What This Mistake Shows:

- **Always verify conventions**: Don't rely on assumptions
- **AGENTS.md is authoritative**: File Naming Conventions section has the correct rules
- **Mistakes can compound**: Wrong information led to more mistakes

### Reference:

- Svelte 5 official docs: https://svelte.dev/docs/svelte/llms.txt
- AGENTS.md lines 119-127: File Naming Conventions (CORRECTED)

---



## Mistake 8: Not Checking AGENTS.md llms.txt Links

### What I Did Wrong:

- Tried to install `@pandacss/vite-plugin` from npm registry which returned 404
- Used wrong package `@pandacss/vite-plugin` in vite.config.ts
- Tried incorrect URLs: `https://panda-css.com/docs/installation` and `integration/vite` (typos in both)
- Didn't read official Panda CSS documentation from llms.txt link provided in AGENTS.md

### Root Cause:

- **AGENTS.md line 81 clearly states:** "Panda CSS: https://panda-css.com/llms.txt"
- **Failed to follow AGENTS.md instruction:** "Before writing code, consult: Vite, Svelte 5, Vite, Panda CSS"
- Assumed package name without checking official documentation
- Made typo in URL (installation instead of installation)

### Correct Approach from Official Panda CSS Documentation:

According to `https://panda-css.com/llms.txt/installation`, for Vite + Svelte:

1. Install dependencies:
   ```bash
   bun add -D @pandacss/dev postcss
   ```

2. Initialize Panda CSS:
   ```bash
   bun panda init -p
   ```
   This creates `panda.config.ts` and `postcss.config.js` automatically

3. Update package.json scripts:
   ```json
   {
   	"scripts": {
   		"prepare": "panda codegen",
   		"dev": "vite dev",
   		"build": "vite build",
   		"preview": "vite preview"
   	}
   }
   ```

4. DO NOT use `@pandacss/vite-plugin` - it doesn't exist on npm
5. Use PostCSS integration, not Vite plugin

### What Should Have Documented:

- **Error**: Wrong Panda CSS package and installation method
- **Missing**: Check of official documentation from llms.txt link
- **Should have verified**: Package exists and installation instructions before implementing
- **Lessons**:
  - **Always consult** AGENTS.md links for official documentation
  - **Always verify** URLs before making requests
  - **Always read** framework-specific installation guides before implementing
  - Don't assume package names based on generic patterns
  - PostCSS is the recommended integration method for Vite

### Reference:

- AGENTS.md line 81: "Panda CSS: https://panda-css.com/llms.txt"
- Panda CSS installation guide: https://panda-css.com/llms.txt/installation
- Svelte + Vite section: https://panda-css.com/llms.txt/installation (section "Using Svelte")

---



