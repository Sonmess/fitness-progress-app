# Development Guidelines

This is a personal project, open source under the [MIT License](LICENSE). Issues and pull requests are welcome, but the primary purpose of this document is to keep development consistent.

## Workflow

1. Branch from `main` with a descriptive name:
   - `feature/add-exercise-filters`
   - `fix/workout-log-bug`
   - `docs/update-setup-guide`
2. Use [Conventional Commits](https://www.conventionalcommits.org/) messages:
   - `feat: add workout filter by date`
   - `fix: resolve authentication redirect issue`
   - `docs: update Firebase setup instructions`
   - `refactor: simplify exercise composable`
   - `chore: update dependencies`
3. Before committing:
   - `npm test` — all tests pass
   - `npm run build` — build succeeds
   - Update `CHANGELOG.md` for any user-facing change (see below)
   - Update `README.md` (features) and `docs/ARCHITECTURE.md` (structure) if they are affected

## Code Style

- TypeScript for all code; avoid `any`, define shared types in `app/types/index.ts`
- Vue 3 Composition API with `<script setup>`; shared logic belongs in composables
- Naming: components PascalCase (`ExerciseCard.vue`), composables `use` prefix (`useExercises.ts`), constants UPPER_SNAKE_CASE, variables/functions camelCase
- Reuse existing UI primitives (`app/components/ui/`, `BasePage`, `BaseTabs`) before writing new markup
- Use `useNotification` for user feedback, never `alert()`

## Changelog

The changelog follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

- Add entries under `[Unreleased]` in the matching category: **Added**, **Changed**, **Deprecated**, **Removed**, **Fixed**, **Security**
- When releasing: create a version section (e.g. `## [0.3.0] - 2026-08-01`), move the `[Unreleased]` entries into it, and add a comparison link at the bottom of the file

## Firebase

- Never commit credentials; configuration comes from `.env` (see `.env.example`)
- Scope all user-data queries by `userId`
- Minimize database reads/writes; add composite indexes to `firestore.indexes.json` when queries need them
