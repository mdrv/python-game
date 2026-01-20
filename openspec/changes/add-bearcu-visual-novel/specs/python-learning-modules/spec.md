## ADDED Requirements

### Requirement: Code Editor

The system SHALL provide a kid-friendly code editor with syntax highlighting, line numbers, and basic autocomplete for Python code.

#### Scenario: Open code editor

- **GIVEN** a code challenge is presented in the story
- **WHEN** the code editor UI renders
- **THEN** the editor shows Python code with syntax highlighting (keywords, strings, comments)
- **AND** line numbers are displayed on the left
- **AND** a placeholder or starter code is shown in the editor
- **AND** an input field accepts keyboard typing

#### Scenario: Type code with syntax highlighting

- **GIVEN** the code editor is open
- **WHEN** the user types "print('Hello')"
- **THEN** "print" is colored blue (keyword)
- **AND** "'Hello'" is colored green (string)
- **AND** the cursor remains visible and positioned correctly

### Requirement: Code Execution

The system SHALL execute Python code entered by the user and display the output or errors in kid-friendly language.

#### Scenario: Execute valid Python code

- **GIVEN** the user enters "print(2 + 3)"
- **WHEN** the user clicks the "Run Code" button
- **THEN** the code executes using Pyodide (Python WebAssembly)
- **AND** the output "5" is displayed in the results panel
- **AND** a success message appears

#### Scenario: Display syntax error

- **GIVEN** the user enters "print('Hello" (missing closing quote)
- **WHEN** the user clicks "Run Code"
- **THEN** an error message is displayed
- **AND** the message explains "You're missing a closing quote! Try: print('Hello')"
- **AND** the problematic line is highlighted in the editor

#### Scenario: Fallback to simulated execution

- **GIVEN** Pyodide has not finished loading
- **WHEN** the user enters a simple arithmetic expression "2 + 2"
- **AND** clicks "Run Code"
- **THEN** the system uses simplified regex-based evaluation
- **AND** displays the result "4"
- **AND** shows a note "Using simplified mode"

### Requirement: Code Challenges and Validation

The system SHALL provide Python exercises with specific goals and validate the user's solution.

#### Scenario: Present code challenge

- **GIVEN** the story reaches a coding exercise
- **WHEN** the challenge UI appears
- **THEN** the challenge objective is displayed in Indonesian
- **AND** an example is shown (e.g., "Buat variabel untuk menyimpan nama beruang favoritmu")
- **AND** the code editor is pre-loaded with a starter template
- **AND** a "Check Answer" button is available

#### Scenario: Validate correct solution

- **GIVEN** the challenge requires creating a variable named "nama_bearcu"
- **WHEN** the user submits code "nama_bearcu = 'Bearcu'"
- **AND** clicks "Check Answer"
- **THEN** the solution is validated as correct
- **AND** Bearcu character appears with "proud" expression
- **AND** the story advances to the next scene

#### Scenario: Provide hint for incorrect solution

- **GIVEN** the user submits incorrect or incomplete code
- **WHEN** they click "Get Hint"
- **THEN** a helpful hint is displayed (e.g., "Ingat, untuk membuat variabel gunakan tanda sama dengan =")
- **AND** the hint is specific to their mistake if detectable
- **AND** no more than 3 hints are available per challenge

### Requirement: Python Learning Progression

The system SHALL structure Python concepts in a logical progression from basics to intermediate concepts.

#### Scenario: Introduction to variables

- **GIVEN** the user starts Chapter 1
- **WHEN** the first coding exercise appears
- **THEN** the concept is "Variables" (Variabel)
- **AND** Bearcu explains: "Variabel seperti kotak untuk menyimpan informasi"
- **AND** the exercise asks the user to create a variable for their favorite food

#### Scenario: Introduction to loops

- **GIVEN** the user has completed variables and numbers exercises
- **WHEN** the loop lesson begins
- **THEN** the concept is "Loops" (Perulangan)
- **AND** Bearcu explains: "Perulangan mengulang tugas berkali-kali"
- **AND** the exercise uses a story context (e.g., counting honey pots)
- **AND** examples show both `for` and `while` loops

#### Scenario: Progressive difficulty

- **GIVEN** the user progresses through chapters
- **WHEN** completing earlier concepts (variables → numbers → loops → functions)
- **THEN** each new concept builds on previous knowledge
- **AND** code exercises increase in complexity gradually
- **AND** previous concepts are reviewed in later challenges

### Requirement: Achievement System

The system SHALL provide badges and achievements to motivate learning and track progress.

#### Scenario: Earn first badge

- **GIVEN** the user completes their first coding exercise successfully
- **WHEN** the exercise is validated as correct
- **THEN** a badge is awarded (e.g., "Pemula Kode" - Code Beginner)
- **AND** a popup animation displays the badge
- **AND** the badge is added to the user's profile
- **AND** a congratulations message from Bearcu appears

#### Scenario: Display achievements screen

- **GIVEN** the user has earned 5 badges
- **WHEN** the user navigates to the achievements menu
- **THEN** all earned badges are displayed with icons
- **AND** locked badges are shown in gray with requirements listed
- **AND** the total achievement percentage is calculated
