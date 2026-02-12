# Architecture Documentation

## Overview

The Fitness Progress App is built using modern web technologies with a focus on type safety, composability, and user experience. This document outlines the application architecture and key design decisions.

## Technology Stack

- **Framework**: Nuxt 4 (Vue 3 meta-framework with SSR capabilities)
- **Frontend**: Vue 3 with Composition API and TypeScript
- **Styling**: Tailwind CSS for utility-first responsive design
- **Backend**: Firebase (Firestore for database, Auth for authentication)
- **State Management**: Vue composables for reactive state

## Application Structure

### Directory Layout

```
app/
├── components/          # Vue components organized by feature
│   ├── common/         # Shared components (BasePage, etc.)
│   ├── exercises/      # Exercise-specific components
│   ├── icons/          # SVG icon components
│   ├── modals/         # Modal dialog components
│   └── ui/             # Reusable UI components
├── composables/        # Reactive state management
├── constants/          # Application constants
├── layouts/            # Page layouts
├── middleware/         # Route middleware (auth, etc.)
├── pages/              # File-based routing
├── plugins/            # Nuxt plugins (Firebase init)
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## Core Concepts

### 1. Composables Pattern

The app uses Vue 3 composables for state management and business logic. Each composable encapsulates related functionality:

- **`useAuth.ts`** - Authentication state and operations
- **`useExercises.ts`** - Exercise data fetching and management
- **`useBodyParts.ts`** - Body part categories management
- **`useEquipment.ts`** - Equipment types management
- **`useWorkoutLog.ts`** - Workout logging functionality
- **`useWorkoutSessions.ts`** - Workout session management
- **`useProgress.ts`** - Progress tracking and analytics

#### Benefits of Composables:
- Reusable across components
- Testable in isolation
- Type-safe with TypeScript
- Reactive state management
- Logical code organization

### 2. Firebase Integration

Firebase services are initialized in `app/plugins/firebase.ts` and provided globally via Nuxt plugin system.

#### Authentication
- Firebase Auth handles user authentication
- Auth state is managed via `useAuth` composable
- Global middleware (`auth.global.ts`) protects routes
- Auth ready promise ensures hydration before app initialization

#### Firestore Database

**Collections Structure:**

```
firestore/
├── users/
│   └── {userId}
│       ├── nickname: string
│       ├── email: string
│       ├── role: string
│       └── state: number
├── exercises/
│   └── {exerciseId}
│       ├── name: string
│       ├── description: string
│       ├── bodyPartId: string
│       ├── bodyPartName: string
│       ├── equipment: string
│       └── imageUrl: string
├── bodyParts/
│   └── {bodyPartId}
│       ├── name: string
│       └── imageUrl: string
├── workoutSessions/
│   └── {sessionId}
│       ├── userId: string
│       ├── title: string
│       ├── date: Timestamp
│       ├── notes: string
│       ├── bodyPartIds: string[]
│       └── bodyPartNames: string[]
└── workoutLogs/
    └── {logId}
        ├── userId: string
        ├── sessionId: string
        ├── exerciseId: string
        ├── exerciseName: string
        ├── sets: Array<{reps: number, weight: number}>
        ├── date: Timestamp
        └── notes: string
```

### 3. Type System

All data models are defined in `app/types/index.ts` with TypeScript interfaces:

- **`Exercise`** - Exercise definition
- **`BodyPart`** - Body part category
- **`WorkoutSession`** - Workout session metadata
- **`WorkoutLog`** - Individual exercise log entry
- **`Set`** - Single set (reps + weight)
- **`UserProfile`** - User account information

Helper types like `NewWorkoutLogData` exclude Firestore-generated fields for cleaner API.

### 4. Routing & Navigation

- **File-based routing** via Nuxt pages directory
- **Route constants** defined in `app/constants/routes.ts` for type-safe navigation
- **Global auth middleware** checks authentication state before route access
- **Page transitions** configured in `nuxt.config.ts`

### 5. Component Architecture

#### Common Components

**`BasePage.vue`** - Standardized page wrapper with:
- Consistent layout structure
- Title and subtitle support
- Optional action slots
- Responsive design

**Benefits:**
- Consistent UX across pages
- Reduced code duplication
- Easier maintenance

#### Feature Components

Organized by domain (exercises, workouts, etc.) for:
- Clear separation of concerns
- Easy feature discovery
- Scalable codebase

### 6. State Management

Instead of Vuex/Pinia, the app uses:
- **Composables** for shared reactive state
- **Props/Emits** for component communication
- **Provide/Inject** for dependency injection (Firebase instances)

This approach provides:
- Better TypeScript support
- Simpler mental model
- Less boilerplate
- Tree-shakeable code

## Data Flow

### Authentication Flow

```
1. User lands on protected route
2. auth.global.ts middleware runs
3. Checks Firebase Auth state
4. If not authenticated → redirect to /login
5. If authenticated → allow access
```

### Workout Logging Flow

```
1. User creates workout session (useWorkoutSessions)
2. Session saved to Firestore with metadata
3. User logs exercises (useWorkoutLog)
4. Each exercise log linked to session
5. Progress calculated from historical logs (useProgress)
```

## Configuration

### Runtime Config

Environment variables are exposed via `nuxt.config.ts` runtime config:
- Firebase credentials loaded from `.env`
- Public runtime config available client-side
- Type-safe access via `useRuntimeConfig()`

### Build Configuration

- **Modules**: Tailwind CSS for styling
- **Dev Server**: Port 3000 on localhost
- **Page Transitions**: Out-in mode for smooth navigation
- **TypeScript**: Strict mode enabled

## Security Considerations

1. **Authentication**: All protected routes require authentication
2. **Firestore Rules**: (Should be configured in Firebase Console)
   - Users can only access their own data
   - Write operations validate user ownership
3. **Environment Variables**: Sensitive config never committed to git
4. **Type Safety**: TypeScript prevents common runtime errors

## Performance Optimizations

- **Code Splitting**: Nuxt automatically splits code by route
- **Lazy Loading**: Components loaded on-demand
- **Firebase Caching**: Firestore uses local cache for offline support
- **Composable Reactivity**: Only re-renders affected components

## Future Considerations

Potential improvements:
- **Progressive Web App (PWA)**: Offline support, installability
- **Analytics**: Track user engagement and feature usage
- **Server-Side Rendering**: Improve initial load time and SEO
- **Testing**: Unit tests for composables, E2E tests for critical flows
- **CI/CD**: Automated testing and deployment pipeline
