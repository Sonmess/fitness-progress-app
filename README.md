# Fitness Progress App

A comprehensive fitness tracking application built with Nuxt 4, Vue 3, and Firebase. Track your exercises, log workouts, and monitor your fitness progress over time.

## Features

- 🏋️ **Exercise Management** - Browse and manage exercises with detailed information about equipment and target body parts
- 📊 **Progress Tracking** - Monitor your fitness journey with comprehensive analytics:
  - Personal records table with max weight, reps, and achievement dates
  - Exercise-specific progress pages with detailed workout history
  - Interactive graphs showing max weight and volume progression over time
  - Tabular view with expandable set details and volume calculations
  - Visual highlighting of best performances
- 💪 **Workout Logging** - Log workout sessions and track your performance with:
  - Set-by-set tracking (reps and weight)
  - Support for assisted exercises (negative weights)
  - Decimal weight increments (0.25kg, 0.5kg, etc.)
  - Recent workout reference for consistency
- 🔐 **User Authentication** - Secure authentication powered by Firebase Auth
- 📱 **Responsive Design** - Beautiful UI built with Tailwind CSS with:
  - Dark theme optimized for gym lighting
  - Mobile-first approach with horizontal scrolling for large datasets
  - Custom styled scrollbars matching the app theme
  - Dynamic chart sizing for optimal mobile viewing

## Tech Stack

- **Framework:** [Nuxt 4](https://nuxt.com/)
- **Frontend:** [Vue 3](https://vuejs.org/) with Composition API
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Backend:** [Firebase](https://firebase.google.com/) (Authentication & Firestore)
- **Language:** TypeScript
- **Charts:** [Chart.js](https://www.chartjs.org/) with [vue-chartjs](https://vue-chartjs.org/)

## Project Structure

```
app/
├── components/       # Vue components
│   ├── common/      # Shared components (BasePage, etc.)
│   ├── exercises/   # Exercise-related components
│   ├── icons/       # Icon components
│   ├── modals/      # Modal dialogs
│   ├── progress/    # Progress tracking components
│   │   ├── LineGraph.vue        # Reusable Chart.js wrapper
│   │   ├── ProgressGraph.vue    # Progress graphs container
│   │   └── ProgressTable.vue    # Workout history table
│   └── ui/          # UI components
│       └── navigation/
│           ├── BackLink.vue     # Back navigation component
│           └── BaseTabs.vue     # Tab navigation component
├── composables/     # Vue composables for state management
│   ├── useAuth.ts
│   ├── useExercises.ts
│   ├── useProgress.ts
│   └── useWorkoutLog.ts
├── constants/       # Application constants
│   └── routes.ts    # Route definitions and builders
├── pages/           # Route pages (file-based routing)
│   ├── exercises/
│   ├── progress/
│   │   ├── [exerciseId].vue  # Exercise-specific progress
│   │   └── index.vue          # Progress overview
│   └── workouts/
├── plugins/         # Nuxt plugins (Firebase init)
├── types/           # TypeScript type definitions
│   └── index.ts
└── utils/           # Utility functions
    ├── date.ts      # Date formatting helpers
    └── workout.ts   # Workout calculation helpers
```

## Prerequisites

- Node.js 18+ or Bun
- Firebase project with Firestore and Authentication enabled

## Setup

1. **Clone the repository**

```bash
git clone <repository-url>
cd fitness-progress-app
```

2. **Install dependencies**

```bash
npm install
# or
pnpm install
# or
yarn install
# or
bun install
```

3. **Configure Firebase**

Create a `.env` file in the root directory with your Firebase configuration:

```env
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
FIREBASE_APP_ID=your_app_id
```

You can find these values in your Firebase project settings (Project Settings > General > Your apps).

4. **Set up Firestore collections**

Your Firebase Firestore should have the following collections:
- `users` - User profiles
- `exercises` - Exercise definitions
- `workoutSessions` - Workout session logs
- `progress` - Progress tracking data

## Development

Start the development server on `http://127.0.0.1:3000`:

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
# or
bun run dev
```

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

Check out the [Nuxt deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## License

No license. Project is protected by default copyright. No one can legally use, copy, or distribute it without your permission, even if the repository is public on GitHub.

## Support

For issues and questions, please open an issue on GitHub.
