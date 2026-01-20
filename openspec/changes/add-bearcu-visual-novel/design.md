# Design: Bearcu Visual Novel Application

## Context

This project creates an educational visual novel for Indonesian children (ages 8-12) to learn Python programming through storytelling. The application runs as a client-side SPA using Vite + Svelte with TypeScript.

**Target Audience:**

- Indonesian children aged 8-12 years old
- Beginner programmers with little to no coding experience
- Learners who prefer narrative-based, interactive education

**Constraints:**

- Must run entirely client-side (no backend required for basic functionality)
- Indonesian language primary, with architecture for future languages
- Python code execution should work in browser (WebAssembly or simplified simulation)
- Kid-friendly, colorful, and engaging visual design
- Performance optimized for tablets and low-end laptops common in schools

## Goals / Non-Goals

### Goals

- Create engaging visual novel framework for educational content
- Teach Python fundamentals through interactive exercises
- Provide immediate feedback on code attempts
- Support Indonesian language localization
- Enable offline functionality for areas with limited internet

### Non-Goals

- Full Python interpreter execution (simplified/sandboxed approach acceptable)
- Multiplayer or social features
- Advanced Python concepts (classes, complex OOP)
- Backend user accounts or cloud saving (IndexedDB per-browser storage only)
- Voice narration (text-only initially, audio hooks for future)

## Decisions

### 1. Visual Novel Engine Architecture

**Decision:** Use Svelte 5 with $state stores for reactive story management and Panda CSS for component styling.

**Rationale:**

- Svelte 5's $state and $derived provide clean reactivity without external state libraries
- Panda CSS generates atomic classes for performance and consistent theming
- Minimal dependencies aligns with "boring proven patterns" principle

**Alternatives considered:**

- React + Zustand: More complex setup, larger bundle
- Ren'Py or Twine: Specialized VN engines, harder to integrate custom code execution
- Custom vanilla JS: No reactivity, harder to maintain

### 2. Python Code Execution

**Decision:** Use Pyodide (Python WebAssembly) for client-side Python execution with fallback to simulated execution for simple exercises.

**Rationale:**

- Pyodide runs real Python 3 in browser via WebAssembly
- Offline-capable after initial download (~8MB)
- Matches goal of teaching real Python syntax

**Fallback strategy:**

- For simple exercises (print statements, basic arithmetic), use regex-based validation
- Provide clear indication when "real" vs "simulated" execution is used
- Load Pyodide lazily to improve initial load time

### 3. Story and Content Structure

**Decision:** Store story content as JSON with type-safe interfaces, separating narrative from code exercises.

**Rationale:**

- JSON is easy to edit and translate
- Type safety ensures all required fields are present
- Enables easy chapter/content updates without code changes

**Structure:**

```
Chapter → Scene → (Dialogue | CodeChallenge | Choice)
```

### 4. Character System

**Decision:** Use SVG-based Bearcu character with CSS animations for expressions and movements.

**Rationale:**

- SVGs scale perfectly on all devices
- CSS animations perform well without JavaScript overhead
- Easy to modify expressions programmatically
- Small file size compared to sprite sheets

**Implementation:**

- Base Bearcu body with interchangeable facial features
- Expression states: happy, thinking, excited, confused, proud
- Animations: bounce, shake, nod for emphasis

### 5. Localization Architecture

**Decision:** Implement simple i18n system using Svelte stores with Indonesian as primary language.

**Rationale:**

- Single-language requirement initially, but structure for future expansion
- Svelte stores provide reactive language switching
- JSON-based translations easy for non-technical translators

**Design:**

```typescript
interface Translations {
	ui: { [key: string]: string }
	story: { [chapterId: string]: ChapterTranslations }
}
```

### 6. Data Persistence

**Decision:** Use IndexedDB for storing kid progress, achievements, and saved code across browser sessions.

**Rationale:**

- IndexedDB provides significantly more storage capacity than localStorage (hundreds of MB vs ~5MB)
- Asynchronous API doesn't block the main thread, better for performance
- Stores structured data natively (objects, arrays, blobs)
- Persists across browser sessions and device restarts
- Each kid's browser maintains separate data (privacy by design)
- Better support for offline scenarios with larger datasets

**Alternatives considered:**

- **localStorage**: Too limited (5-10MB), synchronous (blocks UI), can only store strings
- **SessionStorage**: Cleared on browser close, insufficient for long-term progress tracking
- **Cookies**: Too small (4KB), sent with every HTTP request, not designed for client-side storage

**Data Schema:**

```typescript
interface KidProfile {
	id: string // Unique per browser
	name?: string
	createdAt: number
	lastPlayedAt: number
	currentChapter: number
	currentScene: number
	completedChapters: number[]
	choices: { [sceneId: string]: string | number }
	achievements: Achievement[]
	codeSubmissions: { [exerciseId: string]: CodeSubmission }
	settings: {
		language: string
		soundEnabled: boolean
		musicEnabled: boolean
	}
}
```

**Auto-Save Strategy:**

- Save automatically after every scene completion
- Save after each code submission
- Save when earning an achievement
- Save on browser/tab close event (beforeunload)
- Debounce saves to avoid excessive writes (max once every 30 seconds)
- Show subtle auto-save indicator when save completes
- Gracefully handle IndexedDB unavailability (fallback to in-memory with warning)

## Risks / Trade-offs

### Risk 1: Pyodide Bundle Size (~8MB)

**Mitigation:**

- Lazy load Pyodide only when user reaches first code exercise
- Provide loading indicator and estimated time
- Consider cached version check to avoid re-downloading
- Fallback to simulated execution for very simple exercises

### Risk 2: Browser Compatibility

**Mitigation:**

- Use modern browsers (Chrome 90+, Firefox 88+, Safari 14+)
- Graceful degradation for older browsers (message to upgrade)
- Test on common Indonesian school devices

### Risk 3: Offline Functionality

**Mitigation:**

- Use service worker for asset caching
- Store Pyodide in browser cache
- Enable all story content offline after initial load
- Clear cache management UI

### Trade-off: Simplified vs Real Python Execution

**Decision:** Start with real Pyodide execution, add simulation fallback for performance.

**Rationale:**

- Real execution provides authentic learning experience
- Kids can run actual Python code they write
- Simulation is harder to maintain and less flexible
- Performance acceptable for target devices after caching

### Trade-off: Animation Complexity

**Decision:** Keep animations simple (CSS transitions, basic keyframes).

**Rationale:**

- Reduces development time and complexity
- Better performance on low-end devices
- Still engaging for target age group
- Easy to extend later if needed

## Migration Plan

Since this is a greenfield project, no migration is required. However, future migrations to consider:

### Phase 1: Initial Release

- Single language (Indonesian)
- 3 chapters covering Python basics
- IndexedDB with auto-save for progress
- Pyodide execution

### Phase 2: Expansion

- Additional chapters (functions, conditionals)
- Sound effects and music
- English language option
- Achievement system

### Phase 3: Advanced Features

- User accounts and cloud sync
- Multiplayer challenges
- Community-created content
- Voice narration

## Open Questions

1. **Code Editor UI:** Should we use a simplified custom editor or integrate Monaco/CodeMirror?
   - Recommendation: Custom lightweight editor with syntax highlighting
   - Rationale: Smaller bundle, kid-friendly UI, sufficient for beginner code

2. **Story Length:** How long should each chapter be?
   - Recommendation: 5-10 scenes per chapter, 15-30 minutes each
   - Rationale: Manageable attention span for kids, encourages completion

3. **Feedback Mechanism:** How detailed should code error feedback be?
   - Recommendation: Kid-friendly error messages with hints, not raw Python tracebacks
   - Rationale: Avoid overwhelming beginners, focus on learning

4. **Offline Strategy:** Should we require initial online download or provide offline installer?
   - Recommendation: Single HTML file with embedded assets, progressive web app option
   - Rationale: Easy distribution to schools, no installation required
