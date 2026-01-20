## Mistake 17: Exporting State Directly from .svelte.ts Files

### What I Did Wrong:

- Exported `$state` variables directly from `.svelte.ts` store files
- Got Svelte compile error: "Cannot export state from a module if it is reassigned"
- Exported state variables like `export let chapters = $state<>()` and `export let currentProfile = $state<>()`

### Root Cause:

- **`.svelte.ts` files have special rules** for exporting reactive state
- Cannot directly export state that gets reassigned during execution
- Must export **getter functions** instead of the state itself

### The Error:

```
[plugin:vite-plugin-svelte-module] src/stores/story.svelte.ts:1:0
Cannot export state from a module if it is reassigned.
Either export a function returning the state value or only mutate state value's properties
https://svelte.dev/e/state_invalid_export
```

### What Was Wrong:

```typescript
// ❌ WRONG - Direct export of reassigned state
export let storyState = $state<StoryState>({ ... })
export let chapters = $state<Map<number, Chapter>>(new Map())
export let currentScene = $state<Scene | null>(null)
export let currentDialogue = $state<DialogueNode | null>(null)

// Later reassigns these values
storyState = { ... }
currentScene = scene
currentDialogue = currentScene.dialogues[index]
```

### Correct Approach:

```typescript
// ✅ CORRECT - Private state, public getter functions
let storyState = $state<StoryState>({ ... })
let chapters = $state<Map<number, Chapter>>(new Map())
let currentScene = $state<Scene | null>(null)
let currentDialogue = $state<DialogueNode | null>(null)

// Export getter functions
export const getStoryState = () => storyState
export const getChapters = () => chapters
export const getCurrentScene = () => currentScene
export const getCurrentDialogue = () => currentDialogue
```

### How to Use in Components:

```typescript
// ❌ WRONG - Direct import of state
import { currentDialogue, currentScene } from '$stores/story.svelte.ts'

// ✅ CORRECT - Use getter functions
import { getCurrentDialogue, getCurrentScene } from '$stores/story.svelte.ts'

// Store in local variable
let currentDialogue = getCurrentDialogue()
let currentScene = getCurrentScene()
```

### Lessons Learned:

- **State must be private in `.svelte.ts`**: Use `let`, not `export let`
- **Export getter functions**: `export const getName = () => name`
- **Getter functions return reactive values**: They preserve reactivity
- **AGENTS.md documents this**: File Naming Conventions section

### What Should Have Done:

1. **Read Svelte 5 documentation** on `.svelte.ts` export patterns
2. **Use getter functions pattern** from the start
3. **Follow store conventions** established by Svelte community

### Reference:

- Svelte 5 documentation: https://svelte.dev/docs/svelte/llms.txt
- AGENTS.md lines 119-127: File Naming Conventions

---



## Mistake 18: Not Using Full File Extensions in Imports

### What I Did Wrong:

- Imported files without full extensions: `import type { Chapter } from '$lib/vn.types'`
- Master explicitly told me: "Use whole extension when importing even ts files"
- Missing `.ts` extension in imports across multiple files

### Root Cause:

- **AGENTS.md now explicitly requires** full file extensions in all imports
- I was following old TypeScript/JavaScript conventions where extensions are optional
- New convention: **Always include full extension** (`.ts`, `.svelte`, `.svelte.ts`)

### What Was Wrong:

```typescript
// ❌ WRONG - Missing extensions
import { getProfile } from '$lib/indexeddb'
import type { DialogueNode } from '$lib/vn.types'
import { t } from '$stores/i18n.svelte'
import { chapter1 } from '$stories/chapter1'
```

### Correct Approach:

```typescript
// ✅ CORRECT - Full extensions
import { getProfile } from '$lib/indexeddb.ts'
import type { DialogueNode } from '$lib/vn.types.ts'
import { t } from '$stores/i18n.svelte.ts'
import { chapter1 } from '$stories/chapter1.ts'
```

### Files Fixed:

1. **App.svelte**: All imports from `$stores` and `$stories` updated
2. **DialogueBox.svelte**: Import from `$lib/vn.types.ts`
3. **BearcuCharacter.svelte**: Import from `$lib/vn.types.ts`
4. **ChoiceMenu.svelte**: Import from `$lib/vn.types.ts`
5. **AutoSaveIndicator.svelte**: Imports from `$stores/save.svelte.ts`
6. **save.svelte.ts**: Import from `$lib/indexeddb.ts` and `$lib/indexeddb.types.ts`
7. **story.svelte.ts**: Import from `$lib/vn.types.ts`
8. **chapter1.ts**: Import from `$lib/vn.types.ts`

### Lessons Learned:

- **Full extensions are mandatory**: All imports must include `.ts` or `.svelte`
- **AGENTS.md is explicit**: "ALWAYS use full file extension in imports (including .ts)"
- **This is a project convention**: Not just TypeScript default behavior
- **Consistency is key**: All imports follow the same pattern

### What Should Have Done:

1. **Read AGENTS.md** File Naming Conventions section
2. **Use full extensions** from the beginning
3. **Check imports** after renaming files to ensure consistency

### Reference:

- AGENTS.md lines 119-127: File Naming Conventions
- Import examples show correct pattern with full extensions

---



## Mistake 19: Using $effect at Top Level of .svelte.ts File

### What I Did Wrong:

- Used `$effect` at the top level of `save.svelte.ts` store file
- Got runtime error: "Uncaught Svelte error: effect_orphan"
- Error message: "`$effect` can only be used inside an effect (e.g. during component initialisation)"

### Root Cause:

- **`$effect` can only be used during component initialization** or while a parent effect is running
- **`.svelte.ts` files are modules, not components** - they don't have an initialization phase
- I treated the store file like a component, using `$effect` at module level

### The Error:

```
Uncaught Svelte error: effect_orphan
`$effect` can only be used inside an effect (e.g. during component initialisation)
https://svelte.dev/e/effect_orphan
    at http://192.168.100.41:5173/src/stores/save.svelte.ts:245:3
```

### What Was Wrong:

```typescript
// ❌ WRONG - $effect at top level of .svelte.ts module
// File: src/stores/save.svelte.ts

let currentProfile = $state<KidProfile | null>(null)

// ... other code ...

// Initialize auto-save interval when a profile is loaded
$effect(() => {
	if (currentProfile) {
		startPeriodicAutoSave()
	} else {
		stopPeriodicAutoSave()
	}
})
```

### Correct Approach:

**Move reactive logic to components that use the store:**

```typescript
// ✅ CORRECT - Provide functions, components handle reactivity
// File: src/stores/save.svelte.ts

let currentProfile = $state<KidProfile | null>(null)

export const getCurrentProfile = () => currentProfile
export function startPeriodicAutoSave(): void { ... }
export function stopPeriodicAutoSave(): void { ... }
// NO $effect here!
```

```svelte
<!-- ✅ CORRECT - Component uses $effect -->
<!-- File: src/App.svelte -->

<script>
	import {
		getCurrentProfile,
		startPeriodicAutoSave,
		stopPeriodicAutoSave,
	} from '$stores/save.svelte.ts'

	let currentProfile = getCurrentProfile()

	// Start/stop periodic auto-save when profile changes
	$effect(() => {
		if (currentProfile) {
			startPeriodicAutoSave()
		} else {
			stopPeriodicAutoSave()
		}
	})
</script>
```

### Key Insight from Svelte 5 Documentation:

> **`$effect` can only be used inside an effect (e.g. during component initialization)**
>
> You can use `$effect` anywhere, not just at the top level of a component,
> as long as it is called while a parent effect is running.
>
> — Svelte 5 Documentation

### The Pattern:

**Store files (`.svelte.ts`):**

- Provide reactive state via `$state` (private, with getter functions)
- Export functions to modify state
- Export getters to access state
- **DO NOT use `$effect` at module level**

**Component files (`.svelte`):**

- Use `$effect` to react to store state changes
- Call store functions as needed
- This is where side effects like intervals/timeouts belong

### Lessons Learned:

- **`.svelte.ts` files are NOT components**: They don't have initialization phases
- **`$effect` is component-only**: Can only be used during component initialization
- **Move side effects to components**: Store provides state, components handle effects
- **Svelte 5 docs are clear**: "`$effect` can only be used inside an effect"

### What Should Have Done:

1. **Read Svelte 5 docs** about `$effect` usage in `.svelte.ts` files
2. **Understood store pattern**: Stores provide state, components handle reactivity
3. **Moved `$effect` to component**: Let App.svelte handle auto-save timing

### Reference:

- Svelte 5 documentation: https://svelte.dev/docs/svelte/llms.txt
- Svelte error guide: https://svelte.dev/e/effect_orphan
- AGENTS.md lines 119-127: File Naming Conventions

---

## Mistake 15: Using Old Svelte Event Handler Syntax

### What I Did Wrong:

- Used `on:click={handleClick}` (old Svelte 4 syntax) in DialogueBox.svelte line 63
- Got Svelte compile error: "Mixing old (on:click) and new syntaxes for event handling is not allowed. Use only the onclick syntax"
- Correct new Svelte 5 syntax is `onclick={handleClick}`
- This violated AGENTS.md line 117 which explicitly forbids `on:click` syntax

### Root Cause:

- **Didn't follow AGENTS.md Svelte Guidelines** (lines 115-117):
  ```
  ## Svelte Guidelines

  - Always follow latest Svelte 5 syntax
    - EMBRACE newest features such as $state/$derived/$props, onMount, mount(), @attach, snippets.
    - AVOID deprecated or outdated syntax such as `export let`, `on:click`, slots, new App(), svelte/store.
  ```
- **Didn't consult Svelte 5 documentation** before writing code
- **Mixed old and new syntax** in the same file - Svelte 5 doesn't allow this
- **Wrote code quickly** without checking llms.txt link: https://svelte.dev/docs/svelte/llms.txt

### The Error:

```
[plugin:vite-plugin-svelte] src/components/DialogueBox.svelte:63:3
Mixing old (on:click) and new syntaxes for event handling is not allowed.
Use only the onclick syntax
https://svelte.dev/e/mixed_event_handler_syntaxes
src/components/DialogueBox.svelte:63:3
```

### What Was Wrong in DialogueBox.svelte:

```svelte
<!-- ❌ OLD SYNTAX (line 63) -->
<div
  class='dialogue-text'
  on:click={handleClick}  <!-- Old syntax -->
  role='button'
  tabindex='0'
>

<!-- ✅ CORRECT SYNTAX (what I changed to) -->
<div
  class='dialogue-text'
  onclick={handleClick}  <!-- New Svelte 5 syntax -->
  role='button'
  tabindex='0'
>
```

Note: I correctly used `onclick` in other parts of the same file (lines 76, 104, 108), but made a mistake on line 63.

### Correct Svelte 5 Event Handler Syntax:

According to Svelte 5 documentation:

**Old Svelte 4:**

```svelte
<button on:click={handleClick}>Click me</button>
<button on:submit={handleSubmit}>Submit</button>
```

**New Svelte 5:**

```svelte
<button onclick={handleClick}>Click me</button>
<button onsubmit={handleSubmit}>Submit</button>
```

The event name is now camelCase and uses `on` prefix, not `on:`.

### Svelte 5 Migration Guide:

- `on:click` → `onclick`
- `on:submit` → `onsubmit`
- `on:keydown` → `onkeydown`
- `on:mouseenter` → `onmouseenter`
- Pattern: Remove colon, use camelCase

### What I Should Have Done:

1. **Consult Svelte 5 llms.txt** before writing event handlers:
   - https://svelte.dev/docs/svelte/llms.txt
   - Section on event handling and event attributes
2. **Follow AGENTS.md Guidelines** (lines 115-117) which explicitly forbid `on:click`
3. **Be consistent** with Svelte 5 syntax throughout the file
4. **Check Svelte migration guide** if uncertain about syntax changes

### Lessons Learned:

- **AGENTS.md is explicit**: It clearly says "AVOID deprecated or outdated syntax such as `export let`, `on:click`, slots, new App(), svelte/store"
- **Don't mix syntaxes**: Svelte 5 doesn't allow mixing old and new event handlers
- **Consult documentation**: Before writing any Svelte code, check https://svelte.dev/docs/svelte/llms.txt
- **Be consistent**: If using Svelte 5 runes ($state, $derived, $props), also use new event syntax
- **Search for old syntax**: After writing code, search for `on:` pattern to catch any old event handlers

### Verification After Fix:

I verified no more old syntax exists:

```bash
rg "on:[a-z]+=\{" src/ --type-add 'svelte:*.svelte' -t svelte
```

Result: No matches found (only CSS properties like `animation:`, `transition:`)

### What Should Have Documented:

- **Error**: Mixed old and new Svelte event handler syntax
- **Cause**: Didn't consult Svelte 5 docs before writing event handlers
- **AGENTS.md violation**: Explicitly forbids `on:click` syntax (line 117)
- **Should have checked**: https://svelte.dev/docs/svelte/llms.txt for event handling
- **Lesson**: Always check AGENTS.md Svelte Guidelines before writing any Svelte code

### Reference:

- AGENTS.md lines 115-117: Svelte Guidelines (AVOID `on:click`)
- Svelte 5 documentation: https://svelte.dev/docs/svelte/llms.txt
- Svelte error guide: https://svelte.dev/e/mixed_event_handler_syntaxes
- Svelte migration guide: Event handler syntax changes
echo "

---

## Pattern of Mistakes: Not Reading Documentation Before Coding

### What I Keep Doing Wrong:

I repeatedly make Svelte 5 coding mistakes because I **DO NOT follow this workflow**:

1. ❌ Start coding immediately based on assumptions
2. ❌ Guess syntax without reading documentation
3. ❌ Make errors, get corrected, move to next thing
4. ❌ Repeat of same pattern

### What I Should Be Doing:

1. ✅ **FIRST: Read AGENTS.md** - Understand project conventions
2. ✅ **SECOND: Read Svelte 5 llms.txt** - Understand syntax and patterns
3. ✅ **THIRD: Code based on documentation** - Not assumptions
4. ✅ **FOURTH: Verify** - Test and confirm with master

### All Svelte 5 Mistakes I Made:

1. **Mistake 5** - Wrong about .svelte.ts vs .ts extensions
   - Initially said stores should use .ts (WRONG)
   - Corrected to: stores MUST use .svelte.ts
   - Root cause: Didn't read Svelte docs about .svelte.ts files

2. **Mistake 15** - Used old 'on:click' syntax
   - AVOID 'on:click', use 'onclick' (Svelte 5)
   - Root cause: AGENTS.md line 126 explicitly forbids 'on:click', I didn't read it

3. **Mistake 16** - Imported runes in .svelte.ts files
   - Tried to import '\$state', '\$derived', '\$effect' from 'svelte/reactivity'
   - Runes are GLOBAL in .svelte.ts files
   - Root cause: Didn't read Svelte docs about .svelte.ts file rules

4. **Mistake 17** - Exported state directly from .svelte.ts
   - Tried 'export let currentProfile = \$state(...)'
   - Must export getter functions: 'export const getCurrentProfile = () => currentProfile'
   - Root cause: Didn't read Svelte docs about state export restrictions

5. **Mistake 18** - Missing full file extensions in imports
   - Used 'import from \"\$lib/vn.types\"' (missing .ts)
   - Master explicitly told me to use full extensions
   - Root cause: Didn't read AGENTS.md line 138 (full extensions required)

6. **Mistake 19** - Used \$effect at top level of .svelte.ts
   - Put '\$effect(() => { ... })' in store file (module level)
   - '\$effect' only works during component initialization
   - Root cause: Didn't read Svelte docs about \$effect usage rules

### The Fundamental Problem:

**I'm not treating documentation as authoritative source of truth.**

Each time I make a Svelte 5 mistake, the answer is in:
- AGENTS.md (lines 22-31, 80-91, 114-161)
- Svelte 5 llms.txt documentation

I need to **STOP making assumptions** and **START reading documentation first**.

### Correct Workflow Going Forward:

\`\`\`
BEFORE CODING ANY SVELTE 5 CODE:
1. Read AGENTS.md lines 22-31 (HARD RULES, ADMIT YOUR MISTAKES)
2. Read AGENTS.md lines 114-161 (Svelte Guidelines, File Naming Conventions)
3. Read Svelte 5 llms.txt: https://svelte.dev/docs/svelte/llms.txt
4. Check AGENTS-MISTAKES.md - Have I made this error before?
5. Code based on DOCUMENTATION, not assumptions
6. Verify against documentation before claiming \"done\"
\`\`\`

### Key Documentation Sections I Must Reference:

**AGENTS.md:**
- Lines 22-37: HARD RULES, ADMIT YOUR MISTAKES
- Lines 80-91: Recommended Framework Documentation (Svelte 5 link)
- Lines 114-161: Svelte Guidelines, File Naming Conventions

**Svelte 5 llms.txt:**
- .svelte.js and .svelte.ts files section
- \$state section (especially deep state, classes)
- \$derived section
- \$effect section (especially \"Understanding lifecycle\", \"Understanding dependencies\")
- \$props section (especially Updating props, Type safety)
- Passing state across modules (CRITICAL for store files)

### Commitment:

**I will NOT write Svelte 5 code without first reading BOTH:**
1. AGENTS.md (project conventions)
2. Svelte 5 llms.txt (official syntax documentation)

**If I am uncertain about ANYTHING:**
1. Stop coding
2. Read documentation
3. Ask master for clarification
4. Proceed only when confident

This pattern has caused me to make 6 mistakes. It MUST STOP now.
"

---

## Pattern of Mistakes: Not Reading Documentation Before Coding

### What I Keep Doing Wrong:

I repeatedly make Svelte 5 coding mistakes because I **DO NOT follow this workflow**:

1. ❌ Start coding immediately based on assumptions
2. ❌ Guess syntax without reading documentation
3. ❌ Make errors, get corrected, move to next thing
4. ❌ Repeat of same pattern

### What I Should Be Doing:

1. ✅ **FIRST: Read AGENTS.md** - Understand project conventions
2. ✅ **SECOND: Read Svelte 5 llms.txt** - Understand syntax and patterns
3. ✅ **THIRD: Code based on documentation** - Not assumptions
4. ✅ **FOURTH: Verify** - Test and confirm with master

### All Svelte 5 Mistakes I Made:

1. **Mistake 5** - Wrong about .svelte.ts vs .ts extensions
   - Initially said stores should use .ts (WRONG)
   - Corrected to: stores MUST use .svelte.ts
   - Root cause: Didn't read Svelte docs about .svelte.ts files

2. **Mistake 15** - Used old 'on:click' syntax
   - AVOID 'on:click', use 'onclick' (Svelte 5)
   - Root cause: AGENTS.md line 126 explicitly forbids 'on:click', I didn't read it

3. **Mistake 16** - Imported runes in .svelte.ts files
   - Tried to import '$state', '$derived', '$effect' from 'svelte/reactivity'
   - Runes are GLOBAL in .svelte.ts files
   - Root cause: Didn't read Svelte docs about .svelte.ts file rules

4. **Mistake 17** - Exported state directly from .svelte.ts
   - Tried 'export let currentProfile = $state(...)'
   - Must export getter functions: 'export const getCurrentProfile = () => currentProfile'
   - Root cause: Didn't read Svelte docs about state export restrictions

5. **Mistake 18** - Missing full file extensions in imports
   - Used 'import from "$lib/vn.types"' (missing .ts)
   - Master explicitly told me to use full extensions
   - Root cause: Didn't read AGENTS.md line 138 (full extensions required)

6. **Mistake 19** - Used $effect at top level of .svelte.ts
   - Put '$effect(() => { ... })' in store file (module level)
   - '$effect' only works during component initialization
   - Root cause: Didn't read Svelte docs about $effect usage rules

### The Fundamental Problem:

**I'm not treating documentation as authoritative source of truth.**

Each time I make a Svelte 5 mistake, the answer is in:
- AGENTS.md (lines 22-31, 80-91, 114-161)
- Svelte 5 llms.txt documentation

I need to **STOP making assumptions** and **START reading documentation first**.

### Correct Workflow Going Forward:

```
BEFORE CODING ANY SVELTE 5 CODE:
1. Read AGENTS.md lines 22-31 (HARD RULES, ADMIT YOUR MISTAKES)
2. Read AGENTS.md lines 114-161 (Svelte Guidelines, File Naming Conventions)
3. Read Svelte 5 llms.txt: https://svelte.dev/docs/svelte/llms.txt
4. Check AGENTS-MISTAKES.md - Have I made this error before?
5. Code based on DOCUMENTATION, not assumptions
6. Verify against documentation before claiming "done"
```

### Key Documentation Sections I Must Reference:

**AGENTS.md:**
- Lines 22-37: HARD RULES, ADMIT YOUR MISTAKES
- Lines 80-91: Recommended Framework Documentation (Svelte 5 link)
- Lines 114-161: Svelte Guidelines, File Naming Conventions

**Svelte 5 llms.txt:**
- .svelte.js and .svelte.ts files section
- $state section (especially deep state, classes)
- $derived section
- $effect section (especially "Understanding lifecycle", "Understanding dependencies")
- $props section (especially Updating props, Type safety)
- Passing state across modules (CRITICAL for store files)

### Commitment:

**I will NOT write Svelte 5 code without first reading BOTH:**
1. AGENTS.md (project conventions)
2. Svelte 5 llms.txt (official syntax documentation)

**If I am uncertain about ANYTHING:**
1. Stop coding
2. Read documentation
3. Ask master for clarification
4. Proceed only when confident

This pattern has caused me to make 6 mistakes. It MUST STOP now.

---



## Mistake 20: Using crypto.randomUUID() Without Checking Availability

### What I Did Wrong:

- Used \`crypto.randomUUID()\` to generate UUIDs in save.svelte.ts
- Got runtime error: "TypeError: crypto.randomUUID is not a function"
- Did not check if this API is available in the target environment
- Master had to suggest using external uuid package

### Root Cause:

- **\`crypto.randomUUID()\` is a modern browser API** that is not available in all environments
- I used it without checking compatibility
- Should have used a well-tested external library (uuid package)
- Did not follow AGENTS.md rule: Check NPM registry for packages before using

### The Error:

\`\`\`
Uncaught (in promise) TypeError: crypto.randomUUID is not a function
    at createProfile (save.svelte.ts:97:14)
    at App.svelte:51:3
\`\`\`

### What Was Wrong:

\`\`\`typescript
// ❌ WRONG - Using browser-specific API
import { getProfile, initIndexedDB, isDatabaseInitialized, saveProfile } from '\$lib/indexeddb.ts'
import type { AutoSaveStatus, KidProfile } from '\$lib/indexeddb.types.ts'

export function createProfile(name: string, age: number): KidProfile {
  const profile: KidProfile = {
    id: crypto.randomUUID(),  // ← Not available in all environments
    // ...
  }
  // ...
}
\`\`\`

### Correct Approach:

Use the \`uuid\` package (https://github.com/uuidjs/uuid):

\`\`\`typescript
// ✅ CORRECT - Using external uuid package
import { v4 as uuidv4 } from 'uuid'
import { getProfile, initIndexedDB, isDatabaseInitialized, saveProfile } from '\$lib/indexeddb.ts'
import type { AutoSaveStatus, KidProfile } from '\$lib/indexeddb.types.ts'

export function createProfile(name: string, age: number): KidProfile {
  const profile: KidProfile = {
    id: uuidv4(),  // ← Cross-platform, well-tested
    // ...
  }
  // ...
}
\`\`\`

### uuid Package Usage:

\`\`\`typescript
import { v4 as uuidv4, v7 as uuidv7 } from 'uuid'

// Version 4 (random UUID) - Most common
uuidv4() // → '550e8400-e29b-41d4-a716-44665544000'

// Version 7 (random UUID) - Sorted variant
uuidv7() // → '019ddd5b-6f54-4b21-bd62864d658c'
\`\`\`

### Lessons Learned:

- **Don't assume browser APIs are available**: Some modern APIs don't work everywhere
- **Use well-tested libraries for critical functionality**: uuid package is 15.2k stars, 944 forks
- **Check package documentation**: Understand what you're using before implementing
- **AGENTS.md rule**: Check NPM registry for package info before using
- **Master's suggestion was correct**: uuid@7 is the right solution

### What Should Have Done:

1. **Checked crypto.randomUUID() availability** - Not in all browsers/Node versions
2. **Asked about UUID generation** - "What's the best way to generate UUIDs?"
3. **Researched uuid package** - Check https://www.npmjs.org/package/uuid
4. **Used external library** - uuid@7 is well-tested and cross-platform
5. **Consulted AGENTS.md** - Package management policy lines 100-107

### Reference:

- uuid package: https://github.com/uuidjs/uuid
- uuid documentation: https://github.com/uuidjs/uuid#readme
- AGENTS.md lines 100-107: Package management policy
- Node.js crypto docs: https://nodejs.org/api/crypto.html

---



