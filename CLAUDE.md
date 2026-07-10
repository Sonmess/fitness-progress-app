# CLAUDE.md

Fitness tracking app — Nuxt 4, Vue 3 (Composition API), TypeScript, Tailwind CSS, Firebase (Auth + Firestore), Chart.js. Detailed structure in `docs/ARCHITECTURE.md`.

## Working rules (important)

- **Plan first, implement only after explicit approval.** Always present a plan explaining what will change and why, then wait for the user to approve. Never start coding, committing, or modifying files based on assumed consent — even for small fixes.
- Work on one agreed item at a time; keep changes small and reviewable.
- Update `CHANGELOG.md` (under `[Unreleased]`) as part of any user-facing change; update the README features list and `docs/ARCHITECTURE.md` when features or structure change; update `docs/DATA_MODEL.md` (incl. the ER diagram) when Firestore collections or types in `app/types/index.ts` change.

## Commands

- `npm run dev` — dev server at http://127.0.0.1:3000
- `npm test` — Vitest (unit tests live next to sources, e.g. `app/utils/*.test.ts`)
- `npm run build` / `npm run preview` — production build / preview

## Conventions

- State management via composables (`app/composables/`) using Nuxt `useState`; all user data queries must be scoped by `userId`.
- Route names/paths come from `app/constants/routes.ts` — don't hardcode paths.
- Types live in `app/types/index.ts`.
- Use existing UI primitives (`app/components/ui/`, `BasePage`, `BaseTabs`, `NumberInput`) before writing new markup; use `useNotification` for user feedback, never `alert()`.
- Dark theme only; mobile-first.

## Task creation

Use the `/task-creator` skill (personal skill) to turn ideas into GitHub issues — it drafts the issue, waits for approval, creates it with `gh`, and adds it to the project board at https://github.com/users/Sonmess/projects/1. Use only labels/milestones that exist in the repo (`gh label list`).
