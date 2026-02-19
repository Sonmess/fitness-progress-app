# Changelog

All notable changes to the Fitness Progress App will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project setup with Nuxt 4, Vue 3, and Firebase
- User authentication with Firebase Auth
- Exercise management system
- Workout logging functionality
- Progress tracking features
- Body parts and equipment management
- Common BasePage component for consistent layouts
- Page transitions for improved UX
- Responsive design with Tailwind CSS
- **Exercise Progress Page** - New dedicated page at `/progress/[exerciseId]` showing detailed workout history
- **Progress Table Component** - Displays all workout logs in expandable table format with:
  - Dynamic columns based on maximum sets performed
  - Date, individual set details (reps×weight), best set, and total volume
  - Zebra striping for improved readability
  - Highlighted row for workout with highest volume (indigo left border)
  - Custom styled horizontal scrollbar
- **Progress Graph Components** - Visual progress tracking with Chart.js:
  - Max Weight Progress graph showing strength progression over time
  - Total Volume Progress graph showing work capacity trends
  - Dynamic sizing: width and height scale with number of data points
  - Horizontal scrolling for datasets with many entries
  - Smooth curves with filled area under line
- **Tab Navigation Component** (`BaseTabs`) - Reusable tab switcher with icon support
- **Utility Functions** - Extracted reusable helpers:
  - `utils/date.ts` - `formatDateShort()`, `formatDateLong()` for consistent date formatting
  - `utils/workout.ts` - `calculateMaxWeight()`, `calculateVolume()`, `formatBestSet()`, `findBestSet()`, `formatSet()` for workout calculations
- Chart.js and vue-chartjs integration for data visualization
- Personal records table now displays repetitions performed at max weight
- Personal records table now shows the date each record was achieved

### Changed
- Updated exercises pages to use CommonBasePage
- Improved table structure on progress page
- Enhanced contact page with new icons and BasePage
- Refactored project structure for better organization
- Weight input fields now accept negative values to support assisted exercises (e.g., -10kg for 10kg assistance)
- Weight inputs now support any decimal increment (e.g., 0.25kg, 0.5kg, 2.5kg) for precise tracking
- Updated placeholder text to indicate negative weights represent assistance
- Enhanced personal record tracking logic to prioritize most reps when weights are equal
- **Refactored `getExerciseById`** composable to return `Promise<Exercise | null>` for better error handling
- Exercise names in progress table now link to detailed exercise progress page
- Date format standardized to DD.MM.YY (e.g., "09.02.26") across table and graphs

### Fixed
- Recent Log now correctly excludes current session when logging/editing workouts
- Recent Log displays previous workout session as reference point instead of current changes
- **SECURITY:** Fixed critical data leakage bug where user data persisted after logout, allowing next logged-in user to see previous user's workout data, logs, and personal records
- Fixed invalid exerciseId handling in progress pages with proper async/await and redirects

### Security
- Implemented global authentication middleware
- Protected routes requiring user authentication

## [0.1.0] - Initial Development

### Added
- Project foundation and core architecture
- Firebase integration (Firestore + Auth)
- TypeScript type definitions
- Composables for state management
- File-based routing structure
- Development environment setup

---

## How to Update This Changelog

When making changes, add entries under the `[Unreleased]` section using these categories:

- **Added** for new features
- **Changed** for changes in existing functionality
- **Deprecated** for soon-to-be removed features
- **Removed** for now removed features
- **Fixed** for any bug fixes
- **Security** for vulnerability fixes

When releasing a new version:
1. Create a new version section (e.g., `## [0.2.0] - 2026-02-15`)
2. Move relevant entries from `[Unreleased]` to the new version
3. Add a link to the release at the bottom of the file
