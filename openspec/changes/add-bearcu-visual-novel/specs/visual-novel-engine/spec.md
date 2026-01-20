## ADDED Requirements

### Requirement: Dialogue System

The system SHALL provide a dialogue display system that shows character dialogue with typing animation, character portraits with expressions, and speaker identification.

#### Scenario: Display basic dialogue

- **GIVEN** a dialogue node with speaker name, text, and character expression
- **WHEN** the system renders the dialogue
- **THEN** the character portrait appears with the specified expression
- **AND** the speaker name is displayed
- **AND** the dialogue text appears character-by-character (typing animation)

#### Scenario: Skip typing animation

- **GIVEN** dialogue is currently typing out
- **WHEN** the user clicks or presses space
- **THEN** the remaining text appears immediately
- **AND** the animation completes

### Requirement: Scene Management

The system SHALL provide scene management to switch between different story backgrounds and maintain scene history.

#### Scenario: Change background scene

- **GIVEN** the user is on a scene with a forest background
- **WHEN** a scene change to "classroom" is triggered
- **THEN** the background transitions smoothly to the classroom image
- **AND** all characters reset to default positions
- **AND** the scene is added to history for back navigation

#### Scenario: Navigate back through scenes

- **GIVEN** the user has navigated through multiple scenes (scene1 → scene2 → scene3)
- **WHEN** the user clicks the back button
- **THEN** the system returns to the previous scene (scene2)
- **AND** the story state is restored to that point

### Requirement: Choice and Branching

The system SHALL support user choices that branch the story into different narrative paths.

#### Scenario: Present dialogue choices

- **GIVEN** a dialogue node with 2-4 selectable choices
- **WHEN** the dialogue completes and choices are presented
- **THEN** all choices are displayed as clickable buttons
- **AND** hovering over a choice shows highlight effect
- **AND** clicking a choice advances the story along that branch

#### Scenario: Track chosen paths

- **GIVEN** the user selected choice B at a decision point
- **WHEN** the story continues
- **THEN** the system records the chosen path
- **AND** future dialogue may reference or react to previous choices

### Requirement: Story State Persistence

The system SHALL use IndexedDB to save story progress and allow users to continue from where they left off, with automatic saving after key events.

#### Scenario: Initialize IndexedDB on first load

- **GIVEN** the application loads for the first time
- **WHEN** the IndexedDB initialization runs
- **THEN** a database named "bearcu-vn" is created
- **AND** an object store named "kidProfiles" is created with "id" as key path
- **AND** the system generates a unique profile ID for the browser
- **AND** an initial profile record is created with default settings

#### Scenario: Auto-save after scene completion

- **GIVEN** the user is playing Chapter 1, Scene 5
- **WHEN** the user completes the scene
- **THEN** the system automatically saves current chapter, scene, and choices to IndexedDB
- **AND** a subtle save indicator (floppy disk icon) appears briefly in the corner
- **AND** the save completes within 100ms asynchronously
- **AND** the UI is not blocked during the save

#### Scenario: Auto-save after code submission

- **GIVEN** the user submits code for an exercise
- **WHEN** the code is validated and results are displayed
- **THEN** the system saves the code submission to IndexedDB
- **AND** the submission is linked to the exercise ID
- **AND** the save happens in the background without blocking UI

#### Scenario: Auto-save after earning achievement

- **GIVEN** the user earns a new achievement (e.g., "Pemula Kode")
- **WHEN** the achievement is awarded
- **THEN** the achievement is saved to the user's profile in IndexedDB
- **AND** the save completes before the achievement popup dismisses

#### Scenario: Debounced auto-save for rapid actions

- **GIVEN** the user is rapidly clicking through multiple scenes
- **WHEN** scene completions happen within 30 seconds
- **THEN** the system debounces saves to avoid excessive IndexedDB writes
- **AND** only the last scene state is saved within that window
- **AND** no save indicator appears for debounced saves

#### Scenario: Save before browser close

- **GIVEN** the user is playing and closes the browser tab
- **WHEN** the beforeunload event triggers
- **THEN** the system attempts a final save of current state to IndexedDB
- **AND** the save completes synchronously before the tab closes

#### Scenario: Load saved progress on startup

- **GIVEN** the user has a saved game at Chapter 2, Scene 3
- **WHEN** the user opens the application
- **THEN** IndexedDB is queried for the user's profile
- **AND** if a saved profile exists, a "Lanjutkan" (Continue) button is available on the main menu
- **AND** the last played chapter and scene are displayed
- **AND** clicking "Lanjutkan" resumes from Chapter 2, Scene 3 with all previous choices and code submissions restored

#### Scenario: Handle IndexedDB unavailability

- **GIVEN** IndexedDB is unavailable or blocked by browser settings
- **WHEN** the application attempts to initialize
- **THEN** a user-friendly warning message is displayed
- **AND** the application continues with in-memory storage only
- **AND** the warning explains that progress won't be saved between sessions
- **AND** save indicators are hidden or modified to show "Progress not being saved"

### Requirement: Character Display

The system SHALL render character portraits with multiple expressions and support for character positioning and animation.

#### Scenario: Display character with expression

- **GIVEN** a character is configured to appear with "happy" expression at center-left position
- **WHEN** the scene renders
- **THEN** the character portrait is displayed at the specified position
- **AND** the facial features show the happy expression

#### Scenario: Change character expression mid-scene

- **GIVEN** a character is currently displayed with "neutral" expression
- **WHEN** a dialogue node specifies the character changes to "excited"
- **THEN** the character's face animates to the excited expression
- **AND** the animation completes within 300ms

### Requirement: Progress Tracking

The system SHALL track chapter completion and display visual progress indicators to the user.

#### Scenario: Display chapter progress

- **GIVEN** the user has completed Chapter 1 and is 60% through Chapter 2
- **WHEN** the user views the chapter selection screen
- **THEN** Chapter 1 is marked as complete (checkmark icon)
- **AND** Chapter 2 shows a 60% progress bar
- **AND** Chapter 3 is locked (grayed out)

#### Scenario: Unlock next chapter

- **GIVEN** the user completes all scenes in Chapter 1
- **WHEN** Chapter 1 final scene concludes
- **THEN** Chapter 2 becomes unlocked
- **AND** a "New Chapter Unlocked!" animation plays
- **AND** the main menu highlights Chapter 2
