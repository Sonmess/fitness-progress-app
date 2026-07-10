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
  - Pagination for workout history
  - Support for assisted exercises (negative weights)
  - Decimal weight increments (0.25kg, 0.5kg, etc.)
  - Recent workout reference for consistency
- 🔐 **User Authentication** - Secure authentication powered by Firebase Auth
- 🔔 **Global Notifications** - Real-time success and error feedback for user actions
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
- **Testing:** [Vitest](https://vitest.dev/) with Vue Test Utils

## Project Structure

The app follows standard Nuxt 4 conventions: file-based routing in `app/pages/`, components organized by feature domain in `app/components/`, state management via composables in `app/composables/`, and pure utility functions in `app/utils/`.

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the full project structure, data flow, and design decisions.

## Prerequisites

- Node.js 18+ or Bun
- Firebase project with Firestore and Authentication enabled

## Setup

1. **Clone the repository**

```bash
git clone https://github.com/Sonmess/fitness-progress-app.git
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

Copy `.env.example` to `.env` and fill in your Firebase configuration:

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

The app uses the following Firestore collections:
- `users` - User profiles
- `exercises` - Exercise definitions (shared across users)
- `workoutSessions` - Workout sessions
- `workoutLogs` - Per-exercise logs belonging to a session
- `bodyParts` - Body part reference data

Composite indexes are defined in [firestore.indexes.json](firestore.indexes.json).

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

## Testing

Run unit tests with Vitest:

```bash
npm test              # run all tests
npm run test:ui       # interactive test UI
npm run test:coverage # coverage report
```

Tests live next to their sources (e.g. `app/utils/date.test.ts`).

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

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.

## License

This project is open source under the [MIT License](LICENSE).

## Support

For issues and questions, please open an issue on GitHub.
