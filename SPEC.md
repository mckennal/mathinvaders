# Math Invaders

## Overview

Math Invaders is a browser-based educational game inspired by Space Invaders.

Players solve maths questions before they reach the bottom of the screen.

The game is designed for children in Years 2 through 6.

The game must run entirely in the browser using static files only.

The game should be fun, visually engaging and educational.

## Technical Requirements

### Mandatory

* HTML5
* CSS3
* Vanilla JavaScript
* HTML5 Canvas
* No NodeJS
* No npm
* No React
* No frameworks
* No build process
* Runs directly from index.html
* Works offline
* Uses localStorage for persistence
* Give me a settings file that allows me to easily change things like difficulty, number of answers to get wrong before the game is over, etc.

### Code Quality

* ES6 classes
* Modular architecture
* Maintainable code
* Minimal global variables
* Clear separation of responsibilities

## Core Gameplay

### Main Concept

Math questions fall from the top of the screen.

The player must answer them before they reach the bottom.

Only one question is active at a time.

### Active Question Rules

At all times:

* Exactly one question is highlighted.
* The highlighted question is the question that has fallen furthest down the screen.
* The highlight should be visually obvious.
* The active question updates automatically whenever questions are removed.

### Answering Questions

Player enters an answer.

Press Enter to submit.

If answer is correct:

* Question is destroyed.
* Score increases.
* Correct answer counter increases.
* Combo streak increases.
* Highlight moves to the next lowest question.

If answer is incorrect:

* Wrong answer counter increases.
* Combo streak resets.
* Highlight remains on the same question.

### Game Over Conditions

Game ends immediately if:

* Any question reaches the bottom of the screen.

OR

* Player gets 5 questions wrong. So the if the Wrong answer counter gets to 5.

## Controls

### Keyboard

* Number keys
* Decimal point
* forward slash for fraction answers
* Backspace
* Enter to submit

## Year Levels

### Year 2

Topics:

* Basic addition
* Basic subtraction
* Number bonds
* Missing numbers
* Multiplication up to 5 x 5

Examples:

* 3 + 4
* 8 + 5
* 12 - 4
* 17 - 8
* 10 + 10
* 20 - 7

### Year 3

Topics:

* Addition
* Subtraction
* Multiplication tables up to 10 x 10
* Simple division

Examples:

* 24 + 17
* 52 - 18
* 7 × 8
* 9 × 6
* 42 ÷ 6
* 56 ÷ 8


### Year 4

Topics:

* Multiplication up to 12 x 12
* Division
* Missing number problems

Examples:

* 12 × 3
* 8 × 6
* 63 ÷ 7
* 96 ÷ 12
* ? × 8 = 56
* 144 ÷ ? = 12

### Year 5

Topics:

* Fractions
* Decimals
* Factors
* Multiples

Examples:

* 0.5 + 0.2
* 1.2 + 0.8
* 3/4 of 20
* 1/5 of 30
* Common factor of 12 and 18
* Round 4.67 to 1 decimal place
* 2.4 × 10

### Year 6

Topics:

* Fractions
* Decimals
* Percentages
* Ratios
* Order of operations

Examples:

* 25% of 80
* 15% of 150
* Simplify 12:18
* 3/5 + 1/5
* 4 × (6 + 2)
* 48 ÷ (4 × 2)
* 1.25 × 8
* 2/3 of 24

## Question System

Questions must be generated dynamically.

Each topic should define:

* Minimum difficulty
* Maximum difficulty
* Generation rules
* Validation rules

The system should be data-driven.

Adding a new topic should require minimal code changes.

## Difficulty Progression

Difficulty should gradually increase.

Possible progression variables:

* Faster falling speed
* More simultaneous questions
* Larger numbers
* Harder question types
* Less reaction time

## Scoring

### Points

Correct answer:

* Base score

Fast answer:

* Bonus score

Consecutive correct answers:

* Combo multiplier

### Statistics

Track:

* Questions attempted
* Questions answered correctly
* Questions answered incorrectly
* Accuracy percentage
* Longest combo
* Highest score
* Average response time

## User Interface

### Main Menu

Options:

* Play
* Select Year Level
* Statistics
* Settings

### During Gameplay

Display:

* Current score
* Combo streak
* Wrong answers remaining
* Year level
* Active question input
* Accuracy percentage

### Visual Highlighting

The active question should:

* Be larger
* Have a glowing border
* Have a different colour
* Be immediately obvious

### Game Over Screen

Display:

* Final score
* Accuracy
* Longest combo
* Questions answered
* Restart button

## Parent Dashboard

Track and display:

### Performance

* Accuracy by topic
* Average response time
* Strong topics
* Weak topics
* Most common mistakes

### Progress

* Highest level reached
* Total questions answered
* Play sessions
* Historical performance

Persist using localStorage.

## Graphics

Theme:

* Space
* Bright colours
* Kid friendly
* Modern arcade style

Effects:

* Explosions
* Particle effects
* Floating score popups
* Combo effects
* Smooth animations

Use Canvas rendering.

No external assets required initially.

## Audio

Optional sound effects:

* Correct answer
* Incorrect answer
* Combo streak
* Question destroyed
* Game over

Must continue functioning without audio.

## Save Data

Persist:

* High scores
* Statistics
* Settings
* Preferred year level

Use localStorage.

Handle missing or corrupt save data safely.

## Performance

Must run smoothly on low-powered computers.

Target:

* 60 FPS where possible
* Efficient rendering
* Low memory usage

## Future Features

Architecture should support:

* Multiple player profiles
* Unlockable ships
* Achievements
* Power-ups
* Additional maths topics
* Teacher mode
* Classroom mode
