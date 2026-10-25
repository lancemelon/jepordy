# Jeopardy

A host-controlled Jeopardy game. Load questions from an Excel file, pick clues on the board, and award points to teams.

## Run locally

    npm install
    npm run dev

## Question file

An `.xlsx` file (first sheet) with this header row:

| Round | Category | Value | Clue | Answer |
| ----- | -------- | ----- | ---- | ------ |
| 1 | Geography | 100 | The longest river in Africa | The Nile |

Each round is a grid of categories x values. `public/sample-questions.xlsx` has 4 rounds x 5 categories x 5 clues = 100 questions.
Regenerate it with `npm run sample`.

## Deploy

Import the repo into Vercel. It detects Vite automatically (build: `npm run build`, output: `dist`).
