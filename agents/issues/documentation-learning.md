## Mistake 6: Not Reflecting on Git Commit Heredoc Error

### What I Did Wrong:

- Attempted to use bash heredoc for multi-line git commit message
- Got error: "/usr/bin/bash: -c: line 12: unexpected EOF while looking for matching `"'`
- Did not analyze why heredoc syntax failed in this context
- Did not document root cause of heredoc issue
- Immediately switched to a different command without explanation or reflection
- Proceeded without updating documentation to record lessons learned

### Root Cause:

- Bash heredoc syntax doesn't work the same way inside git commands as it does in bash scripts
- Git's commit parser processes messages differently, causing heredoc delimiter to cause issues
- I should have recognized this context difference before attempting to workaround
- Moving past as error without reflection means missing a learning opportunity

### Correct Approach:

- **Always analyze errors in their specific context** before applying workarounds
- **Document reasoning** behind errors and solutions tried
- **Update AGENTS-MISTAKES.md** with root cause analysis
- **Consider alternative tools** when one approach fails unexpectedly
- **Ask for guidance** if uncertain about the cause or solution

### What Should Have Documented:

- **Error**: Bash heredoc EOF with git commit
- **Cause**: Heredoc syntax conflicts with git command parsing
- **Solution tried**: Simple git commit without heredoc
- **Lesson**: Understand tool limitations in different contexts
- **Better approach**: Use git commit with standard quoting, avoid complex shell features in git commands
- **Ask for guidance** if uncertain about the cause or solution

### Lessons Learned:

- **Tool context matters**: The same technique that works in bash scripts may not work in git command context
- **Always verify**: Test command syntax in actual target context before use
- **Document failures**: When a workaround is used, document the original issue and the solution
- **Don't skip reflection**: Always take time to analyze why something failed before moving past it
- **Ask when uncertain**: If unsure about the root cause, pause and ask for guidance

---



## Mistake 9: Typos in URLs

### What I Did Wrong:

- Tried to fetch `https://panda-css.com/docs/installation` (should be `installation`)
- Tried to fetch `https://panda-css.com/integration/vite` (should be using Vite section from installation guide)

### Root Cause:

- Made typos in URLs without verifying them first
- Didn't check if URLs exist before making requests

### Correct Approach:

- **Always verify URLs** before making web requests
- Use correct spelling: `installation` not `installation`
- Navigate to correct sections in documentation

### Lessons Learned:

- **URL verification matters**: Check URLs work before using them
- **Spelling matters**: Small typos can cause 404 errors
- **Use official links**: AGENTS.md provides correct documentation links

### Reference:

- Correct URL: https://panda-css.com/llms.txt/installation
- AGENTS.md line 81: "Panda CSS: https://panda-css.com/llms.txt"

---



## Mistake 10: Panda CSS Codegen Build Failure

### What I Did Wrong:

- Ran `bun panda init -p` and `bun panda codegen` which failed with error
- Error: "ERROR: Could not resolve "../pkg'" from lightningcss
- Tried multiple times without understanding root cause
- Spent time trying to fix a known Panda CSS issue

### Root Cause:

- Panda CSS lightningcss package has a bug when running `panda codegen`
- Error originates from node_modules/@pandacss/lightningcss trying to resolve "../pkg"
- This is a known internal Panda CSS issue, not a configuration problem

### Workaround Attempts:

1. Tried running `panda codegen` separately - same error
2. Tried removing duplicate postcss.config files - didn't help
3. Tried removing @pandacss/core dependency - still needs @pandacss/dev
4. Tried modifying panda.config.ts - not the root cause

### Current Status:

- **NOT RESOLVED** - Cannot run `panda codegen` successfully
- **Workaround needed**: Need to either:
  - Use `panda --watch` in development mode (bypasses codegen)
  - Wait for Panda CSS fix or use alternative CSS framework
  - Use PostCSS directly with manual CSS styling

### Lessons Learned:

- **Known package bugs exist**: Even official packages can have issues
- **Don't waste time**: After 3 attempts with no progress, should stop and ask master
- **Alternatives are important**: Always have fallback options (plain CSS, other CSS frameworks)
- **PostCSS works directly**: Vite can use postcss.config.js without Panda codegen
- **panda --watch mode**: Can run in development mode to bypass codegen

### What Should Have Documented:

- **Error**: `panda codegen` failing due to internal lightningcss bug
- **Workaround attempted**: Multiple approaches to fix, none succeeded
- **Status**: BLOCKED - Need master's guidance on how to proceed
- **Should have asked**: Should I switch to plain CSS or try alternative integration?

### Reference:

- Panda CSS documentation: https://panda-css.com/llms.txt/installation
- PostCSS is integrated: postcss.config.cjs exists
- Vite + PostCSS: Vite automatically picks up postcss.config.* files

---



## Mistake 22: Non-Reactive Local State Variables Causing Empty Page

### What I Did Wrong:

- App page was completely empty despite successful mounting
- Console showed: "App ready: true" but nothing displayed
- Local state variables in App.svelte were NOT reactive:
  ```typescript
  // ❌ WRONG - Regular let variables, not reactive
  let currentDialogue = getCurrentDialogue()
  let currentScene = getCurrentScene()
  let currentProfile = getCurrentProfile()
  ```
- When stores updated (scene loaded, dialogue changed), local variables stayed at initial values
- Also tried to call `.set()` on a derived value:
  ```typescript
  // ❌ WRONG - chapters is $derived, not a Map
  chapters.set(1, chapter1)
  ```

### Root Cause:

- **Didn't understand Svelte 5 reactivity**: Regular `let` variables don't auto-update
- **Mixed store pattern and component pattern incorrectly**:
  - Stores: Use `$state` internally
  - Components: Must use `$derived` to track store values
- **Misunderstood getter functions**: They return reactive values, not plain variables

### The Error:

```
Symptom: Empty page at http://localhost:5174/
Console: "App ready: true" (but no content displayed)
Root cause: Components rendered with undefined/null values from non-reactive variables
```

### What Was Wrong:

```typescript
// ❌ WRONG - App.svelte lines 31-34
// These are regular let variables - get called once, never update
let chapters = getChapters()
let currentScene = getCurrentScene()
let currentDialogue = getCurrentDialogue()
let currentProfile = getCurrentProfile()

// ❌ WRONG - Can't call .set() on $derived
chapters.set(1, chapter1)  // chapters is a function return value!
```

### Correct Approach:

```typescript
// ✅ CORRECT - App.svelte
// Use $derived to track store values reactively
let chapters = $derived(getChapters())
let currentScene = $derived(getCurrentScene())
let currentDialogue = $derived(getCurrentDialogue())
let currentProfile = $derived(getCurrentProfile())

// ✅ CORRECT - story.svelte.ts
// Add function to set chapter data in store
export function setChapter(chapterId: number, chapter: Chapter): void {
  chapters.set(chapterId, chapter)  // Mutate the Map directly
}

// ✅ CORRECT - App.svelte
setChapter(1, chapter1)  // Use the setter function
```

### Lessons Learned:

- **Svelte 5 reactivity rule**: 
  - `let` = plain variable (called once)
  - `$state` = reactive state (in stores/components)
  - `$derived` = computed from reactive state (triggers on change)
- **Store pattern**: Stores hold `$state`, components use `$derived` to track stores
- **Getter functions return reactive values**: Must wrap in `$derived` in components
- **NEVER modify $derived**: It's read-only; modify source state instead

### Reference:

- Svelte 5 runes: https://svelte.dev/docs/svelte/runes
- AGENTS.md line 119-161: File naming conventions (should have re-read)
- Pattern of error: Didn't read documentation (same as Mistakes 15, 16, 17, 18, 19, 21)

### What Should Have Done:

1. **Read Svelte 5 runes documentation** - Before using Svelte 5
2. **Checked AGENTS.md** - File naming conventions section has reactivity rules
3. **Used $derived in components** - To track store values reactively
4. **Added setter function to store** - Instead of trying to call .set() on $derived

---



