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

### Changed
- Updated exercises pages to use CommonBasePage
- Improved table structure on progress page
- Enhanced contact page with new icons and BasePage
- Refactored project structure for better organization

### Added
- Personal records table now displays repetitions performed at max weight
- Personal records table now shows the date each record was achieved

### Changed
- Weight input fields now accept negative values to support assisted exercises (e.g., -10kg for 10kg assistance)
- Weight inputs now support any decimal increment (e.g., 0.25kg, 0.5kg, 2.5kg) for precise tracking
- Updated placeholder text to indicate negative weights represent assistance
- Enhanced personal record tracking logic to prioritize most reps when weights are equal

### Fixed
- Recent Log now correctly excludes current session when logging/editing workouts
- Recent Log displays previous workout session as reference point instead of current changes

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
