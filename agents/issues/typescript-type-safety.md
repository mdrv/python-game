## Mistake 2: Not Checking Official Documentation Before Implementation

### What I Did Wrong:

- Attempted to create components and stores using Svelte 5 runes
- Used syntax like `$state`, `$derived`, `$effect`, `$props` without verification
- Created files with wrong extensions (`stores/*.svelte.ts`)

### Root Cause:

- I was working with outdated mental models of Svelte
- Didn't consult official documentation for Svelte 5

### Correct Approach:

- **Read official documentation before using new features**
- AGENTS.md says: "Before writing code, consult: Vite, Svelte 5, Vite, Panda CSS"
- I should have opened: https://svelte.dev/docs/svelte/llms.txt (which I did, but misread)
- Should have verified Svelte 5 project structure conventions

### Reference:

- https://svelte.dev/docs/svelte/llms.txt
- https://svelte.dev/docs/svelte/
- https://vite.dev/llms.txt

---



## Mistake 24: Wrong Property Name in Story State (Typo)

### What I Did Wrong:

- Build error in `src/stores/save.svelte.ts`:
  ```
  Object literal may only specify known properties, and 'changes' does not exist in type 'StoryState'
  ```
- Used property name `changes` instead of `choices` in StoryState:
  ```typescript
  // ❌ WRONG - 'changes' is not in StoryState interface
  story: {
    currentChapter: 1,
    currentScene: '',
    currentDialogueIndex: 0,
    completedChapters: [],
    changes: {},  // Typo - should be 'choices'
    codeSubmissions: {},
  }
  ```

### Root Cause:

- **Didn't check the StoryState interface** - Used wrong property name
- **Made typo that matched pattern** - `changes` sounds like `choices`
- **Didn't verify type consistency** - Didn't cross-reference interface

### The Error:

```
src/stores/save.svelte.ts(108,4): error TS2353: Object literal may only specify known properties, and 'changes' does not exist in type 'StoryState'.
```

### What Was Wrong:

```typescript
// ❌ WRONG - save.svelte.ts line 108
story: {
  currentChapter: 1,
  currentScene: '',
  currentDialogueIndex: 0,
  completedChapters: [],
  changes: {},  // Wrong property name
  codeSubmissions: {},
}

// Should match StoryState interface from vn.types.ts:
export interface StoryState {
  currentChapter: number
  currentScene: string
  currentDialogueIndex: number
  completedChapters: number[]
  choices: Record<string, string | number>  // <-- Correct name
  codeSubmissions: Record<string, string>
}
```

### Correct Approach:

```typescript
// ✅ CORRECT - save.svelte.ts
story: {
  currentChapter: 1,
  currentScene: '',
  currentDialogueIndex: 0,
  completedChapters: [],
  choices: {},  // Correct property name
  codeSubmissions: {},
}
```

### Lessons Learned:

- **Always check interfaces** - Cross-reference when using types
- **Use exact property names** - Tyos cause TypeScript errors
- **Auto-complete is safer** - Use IDE suggestions instead of typing names

---



## Mistake 25: Missing Type Import Causing TypeScript Error

### What I Did Wrong:

- Build error in `src/stores/save.svelte.ts`:
  ```
  Cannot find name 'StoryState'
  ```
- Used `StoryState` type in function signature without importing it:
  ```typescript
  // ❌ WRONG - StoryState not imported
  export function updateStoryProgress(storyUpdates: Partial<StoryState>): void
  ```

### Root Cause:

- **Added type annotation without adding import** - Forgot to import the type
- **Copied pattern from another file** - Didn't check what imports were needed

### The Error:

```
src/stores/save.svelte.ts(139,59): error TS2322: Cannot find name 'StoryState'.
```

### What Was Wrong:

```typescript
// ❌ WRONG - save.svelte.ts
// StoryState used but not imported
export function updateStoryProgress(storyUpdates: Partial<StoryState>): void {
  // ...
}
```

### Correct Approach:

```typescript
// ✅ CORRECT - save.svelte.ts
import type { StoryState } from '$lib/vn.types.ts'

export function updateStoryProgress(storyUpdates: Partial<StoryState>): void {
  // ...
}
```

### Lessons Learned:

- **Check imports when adding types** - Every type used must be imported
- **Use IDE "Quick Fix"** - Often suggests the correct import
- **Review all imports when modifying files** - Don't forget to add needed imports

---

## Pattern of Mistakes 22-25: Empty Page Investigation

All 4 mistakes (22, 23, 24, 25) stem from:

1. **Not reading documentation first** - Should have read Svelte 5 runes documentation
2. **Not checking interfaces** - Made assumptions about types without verifying
3. **Not cross-referencing** - Didn't check how interfaces were defined vs used
4. **Not using TypeScript to catch errors early** - Let bugs persist until build

### Root Cause Summary:

- **Same pattern as previous mistakes** (15, 16, 17, 18, 19, 21): Not reading documentation
- **Coding based on assumptions** - Instead of verified knowledge
- **Letting simple typos accumulate** - Without cross-checking types

### What Should Have Done:

1. **Read Svelte 5 documentation** - Before using `$state`, `$derived`
2. **Check StoryState interface** - Before using it in save.svelte.ts
3. **Check Translation interface** - Before using it in i18n.svelte.ts
4. **Use TypeScript auto-complete** - To catch typos like `changes` vs `choices`

### Lessons for Future:

- **ALWAYS read documentation first** - No matter how "simple" the task seems
- **ALWAYS check interfaces** - Before using types
- **ALWAYS cross-reference** - When adding new code to existing codebase
- **ALWAYS verify types** - Against their definitions

---



## Mistake 26: IndexedDB Cannot Clone Svelte Proxy Objects

### What I Did Wrong:

- Auto-save was failing with error: "DOMException: Proxy object could not be cloned"
- Error stack trace:
  ```
  Auto-save error: DOMException: Proxy object could not be cloned.
  saveProfile indexeddb.ts:105
  performAutoSave save.svelte.ts:200
  updateStoryProgress save.svelte.ts:151
  handleNextDialogue App.svelte:96
  ```
- Was trying to save Svelte reactive state directly to IndexedDB:
  ```typescript
  // ❌ WRONG - currentProfile contains Svelte proxies
  const result = await saveProfile(currentProfile)
  ```

### Root Cause:

- **Svelte $state creates proxy objects** - These are wrapped in Proxies for reactivity
- **IndexedDB cannot clone proxy objects** - Only plain JavaScript objects can be serialized
- **Shallow copy doesn't remove proxies** - Spread operator `{ ...obj }` only copies top level
- **Nested objects remain proxies** - `currentProfile.story` etc. are still Svelte proxies

### The Error:

```
Auto-save error: DOMException: Proxy object could not be cloned
    at saveProfile indexeddb.ts:105
    at performAutoSave save.svelte.ts:200
    at updateStoryProgress save.svelte.ts:151
```

### What Was Wrong:

```typescript
// ❌ WRONG - save.svelte.ts line 200
async function performAutoSave(): Promise<void> {
  if (!currentProfile || !isDatabaseInitialized()) {
    return
  }

  autoSaveStatus = 'saving'

  try {
    const result = await saveProfile(currentProfile)  // ❌ currentProfile is a Svelte proxy!
    // ...
  }
}

// Even when we do this:
currentProfile = { ...currentProfile, ...updates }
// The spread operator does shallow copy, nested objects are still proxies
// currentProfile.story is still a Svelte proxy
```

### Correct Approach:

```typescript
// ✅ CORRECT - save.svelte.ts
/**
 * Convert Svelte reactive state to plain JavaScript object
 * This removes all Svelte proxies so the object can be cloned by IndexedDB
 */
function toPlainObject<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

async function performAutoSave(): Promise<void> {
  if (!currentProfile || !isDatabaseInitialized()) {
    return
  }

  autoSaveStatus = 'saving'

  try {
    // Convert reactive profile to plain object (removes Svelte proxies)
    const plainProfile = toPlainObject(currentProfile)
    const result = await saveProfile(plainProfile)  // ✅ Plain object can be cloned
    // ...
  }
}
```

### Lessons Learned:

- **Svelte reactive state uses Proxies** - These can't be cloned by IndexedDB
- **Shallow copy doesn't remove proxies** - `{ ...obj }` only copies top level
- **JSON serialization removes proxies** - `JSON.parse(JSON.stringify(obj))` creates plain object
- **IndexedDB requires plain objects** - Must convert before saving

### Alternative Solutions (Not Used):

1. **Svelte's untrack()** - Only disables tracking, doesn't remove proxy wrapper
2. **Custom deep clone** - More complex, JSON serialization is simpler
3. **Structured clone API** - `structuredClone(obj)` - But still doesn't handle Svelte proxies

### Reference:

- Svelte 5 reactive state: https://svelte.dev/docs/svelte/runes#state
- IndexedDB cloning: https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB#Adding_data_to_the_database
- JSON serialization limitation: Cannot clone functions, circular references, or Dates

### What Should Have Done:

1. **Understood Svelte reactivity** - Know that $state creates proxy objects
2. **Checked IndexedDB limitations** - Know it requires plain JavaScript objects
3. **Converted before saving** - Always convert reactive state to plain objects before IndexedDB
4. **Used deep cloning** - Shallow copy doesn't work for nested proxies

---

## Summary of Mistakes 22-26: Empty Page + Auto-save Errors

### Root Pattern:

All 5 mistakes stem from:
1. **Not reading Svelte 5 documentation** - Assumed knowledge about reactivity
2. **Not understanding Svelte internals** - Proxies, shallow vs deep copies
3. **Not checking API limitations** - IndexedDB requirements
4. **Coding by assumption** - Instead of verifying against documentation

### Issues Fixed:

1. **Mistake 22**: Empty page - Non-reactive state variables
2. **Mistake 23**: TypeScript error - Wrong interface type
3. **Mistake 24**: TypeScript error - Typo in property name
4. **Mistake 25**: TypeScript error - Missing type import
5. **Mistake 26**: Auto-save error - Svelte proxies not cloneable by IndexedDB

### What Should Have Done (General):

1. **Read Svelte 5 documentation before coding** - Especially runes and reactivity
2. **Check all interfaces against usage** - Verify type consistency
3. **Use TypeScript to catch errors** - Fix immediately, don't accumulate
4. **Understand Svelte internals** - Proxies, state management, reactivity
5. **Check API limitations** - IndexedDB, localStorage, etc.

---



