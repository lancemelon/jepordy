# Jeopardy

A host-controlled Jeopardy game. Load questions from an Excel file, pick clues on the board, and award points to teams.

## Run locally

    npm install
    npm run dev

## Question file

An `.xlsx` file (first sheet) with this header row:

| Round | Category | Value | Clue | Answer | Daily Double |
| ----- | -------- | ----- | ---- | ------ | ------------ |
| 1 | Geography | 100 | The longest river in Africa | The Nile | |
| 1 | Movies | 400 | ... | ... | yes |
| Final | Seas | | ... | ... | |

- Each round is a grid of categories x values. Values are whatever you put in the sheet; the sample uses
  100-500 in round 1 and doubles to 200-1000 in round 2.
- `Daily Double` is optional. Mark clues with `yes`; if the column is missing, they're placed randomly
  (1 in the first round, 2 in the second, alternating).
- A row with Round = `Final` is Final Jeopardy (no value needed).

`public/sample-questions.xlsx` is a full example in the real show's format: 2 rounds x 6 categories x 5 clues = 60 questions plus Final Jeopardy.
Regenerate it with `npm run sample`.

## Deploy

Import the repo into Vercel. It detects Vite automatically (build: `npm run build`, output: `dist`).
