<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

## HARD RULES

- MUST utilize Bun and TypeScript in all possible parts of code.

## Formatting Standards

When to run dprint:
- ✅ After making code changes: Run `dprint fmt` on modified files only
- ✅ After implementing features: Format all touched files
- ❌ Don't format entire repo unless explicitly requested
- ✅ After completing work: Report formatted files in summary

## Styling Guidelines

Use Panda CSS when:
- Component has 3+ style properties
- Styles need to be shared across multiple components
- Need responsive variants or theme support
- Working with design system tokens
- Creating reusable component library
Use inline styles (right on HTML tags) when:
- Simple single-component styling (1-2 properties)
- One-off element adjustments
- Prototyping or temporary changes
- Utility classes don't exist in Panda config

## TypeScript Usage Policy

For NEW code:
- ✅ Always use TypeScript (.ts files)
- ✅ Define interfaces/types for all function parameters
- ✅ Enable strict mode in tsconfig.json
For EXISTING code:
- ✅ Extensively modified .js files: Convert to .ts
- ✅ Test files: Keep .js but add JSDoc type annotations
- ✅ Config files in some ecosystems: Keep .js, add `// @ts-check` at top
When TypeScript not possible:
1. Add JSDoc comments with @param, @return, @type
2. Use strict null checks
3. Avoid implicit 'any' types

## Recommended Framework Documentation References

Before writing code, consult:
- **SvelteKit**: https://svelte.dev/docs/kit/llms.txt
- **Svelte 5**: https://svelte.dev/docs/svelte/llms.txt
- **Vite**: https://vite.dev/llms.txt
- **Panda CSS**: https://panda-css.com/llms.txt
- **Better Auth**: https://www.better-auth.com/llms.txt
- **Astro**: https://docs.astro.build/llms.txt
- **ElysiaJS**: https://elysiajs.com/llms.txt

## AVOID these frameworks

- React (not my style of writing + less pure HTML-based)
- TailwindCSS (prefer not to use hardcoded classes)
- SvelteKit (quite restrictive in my opinion, unless for prototyping)

## Package management policy

When to check NPM registry:
- **Installing NEW packages**: Always check https://npmjs.org/package/<name> for latest version
- **Updating existing packages**: Check if major version bump exists before update
- **Existing working code**: DON'T check unless the master requests audit/update
- **Troubleshooting version conflicts**: Check all involved packages

## Conventions

- On package.json scripts:
  - `b` → `build`
  - `d` → `dev`
  - `s` → `start`
  - `p` → `preview`
  - `pr` → `prepare`
- My convention for git remote names:
  - `gh` → `github` (most frequent)
  - `gl` → `gitlab`
  - `cb` → `codeberg`

## Svelte Guidelines

- Always follow latest Svelte 5 syntax
  - EMBRACE newest features such as $state/$derived/$props, onMount, mount(), @attach, snippets.
  - AVOID deprecated or outdated syntax such as `export let`, `on:click`, slots, new App(), svelte/store.

## Agent Self-Correction Protocol

If agent makes a mistake or realizes an error in previous action:
1. **Acknowledge explicitly**: "I made a mistake"
2. **Explain the error**: What went wrong and why
3. **Propose a fix**: Clear correction to the mistake
4. **Ask for confirmation**: "Is this fix correct?"
5. **Document learning**: Note for future reference (internal)