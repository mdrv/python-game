# Agent Mistakes - Bearcu Visual Novel Project

## Mistake 0: Attempting to Scaffold Project in Non-Empty Directory

### What I Did Wrong:

- Ran `bun create vite .` multiple times
- Got "Operation cancelled" and interactive prompt about empty directory
- Didn't recognize that existing files (.git, openspec, AGENTS.md) caused to issue
- Attempted to echo answers to stdin and create temp directories unnecessarily

### Root Cause:

- `bun create vite .` (or `npm create vite@latest .`) detects if directory has files
- Existing files like `.git`, `openspec`, `AGENTS.md` made the directory "not empty"
- Tool prompts for how to proceed: remove files, ignore, or cancel

### Correct Approach:

- **Always check existing files before scaffolding**
- If directory has project files (git, docs, configs), create in temp directory then copy
- OR remove conflicting files first (after asking for permission)
- OR use `bun create vite project-name` for new directory

### Outcome:

- Created empty temp directory for scaffolding (worked but unnecessary steps)
- Could have asked master: "Should I remove non-code files first?"

### Reference:

- Vite documentation shows that prompt text when directory has files
- AGENTS.md doesn't explicitly cover this edge case

---

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

## Mistake 5: Not Following Latest Documentation for Svelte 5

### What I Did Wrong:

- Created store files with wrong extensions (`.svelte.ts` instead of `.ts`)
- Attempted to use Svelte 5 syntax without reading official docs
- Didn't verify package existence and latest versions on npm registry

### Root Cause:

- I was working with outdated mental models of Svelte
- Didn't consult official documentation for Svelte 5

### Correct Approach from Latest Docs:

- **Store files should use `.ts` extension, not `.svelte.ts`**
- **Use runes correctly**: `$state`, `$derived`, `$effect`, `$props` (Svelte 5 specific)
- **Read official docs** at https://svelte.dev/docs/svelte/llms.txt before using new features
- **Always verify** package versions on npm registry
- **Follow framework conventions** from official documentation

### Reference:

- Svelte 5 official docs: https://svelte.dev/docs/svelte/llms.txt
- Svelte 5 runes reference: Same documentation
- Vite plugin svelte: Check GitHub README for proper configuration
- AGENTS.md line: "Before writing code, consult: Vite, Svelte 5, Vite, Panda CSS"

### Outcome:

- Created files with wrong syntax that caused LSP errors
- Need to recreate files following Svelte 5 conventions

---

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

## Mistake 7: Not Creating Deployable Progress Tracking

### What I Did Wrong:

- Did not create a way for master to track project progress visually
- Did not make TODO list accessible via a deployed website
- Proceeded without asking for deployment strategy or approval

### Root Cause:

- Assuming deployment approach without considering practical implementation details
- Not creating accessible progress tracking from the beginning
- Missing opportunity to implement progress tracking that serves both local development and remote monitoring needs

### Correct Approach:

- **Create progress.html page** that displays tasks.md content in a clean, readable format
- **Add deployment task** to implement a simple accessible progress tracker
- **Document the approach** so it's clear how progress is tracked (markdown file vs website)
- **Consider alternatives** like separate progress tracking repository or service
- **Ask for approval** if approach seems over-engineered for current needs

### What Should Have Documented:

- **Error**: No deployable progress tracking created
- **Missing**: Deployment strategy discussion with master
- **Should have added**: Discussion about using simple HTML/Markdown vs. GitHub Pages/external service
- **Lessons**: Always consider how master will review progress and plan deployment strategy

### Reference:

- AGENTS.md line: "Always ask for guidance if unsure about how to proceed"

---

## Pattern to Avoid: Acting in Burst Mode

### What I Did Wrong:

- Created multiple files in sequence without stopping to verify
- Generated numerous LSP errors without pausing
- Did not validate that previous steps were successful

### Correct Approach:

- **Work step-by-step with verification after each step**
- Create ONE file, then verify it works
- Fix errors before moving to next file
- Ask for approval before major steps
- Report errors immediately instead of continuing

### Reference:

- AGENTS.md line: "You don't act in burst, but rather step-by-step and stay within the master's expectation by seeking his/her approval"
