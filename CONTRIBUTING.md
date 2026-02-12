# Contributing to Fitness Progress App

Thank you for considering contributing to the Fitness Progress App! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help create a welcoming environment for all contributors

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](../../issues)
2. If not, create a new issue with:
   - Clear, descriptive title
   - Steps to reproduce the bug
   - Expected vs actual behavior
   - Screenshots (if applicable)
   - Your environment (OS, browser, Node version)

### Suggesting Features

1. Check existing issues for similar suggestions
2. Create a new issue with:
   - Clear description of the feature
   - Use cases and benefits
   - Potential implementation approach (optional)

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Branch naming**: Use descriptive names
   - `feature/add-exercise-filters`
   - `fix/workout-log-bug`
   - `docs/update-setup-guide`

3. **Make your changes**
   - Write clean, readable code
   - Follow existing code style and patterns
   - Add comments for complex logic
   - Update documentation if needed

4. **Test your changes**
   - Ensure the app builds without errors
   - Test all affected functionality
   - Check responsive design on different screen sizes

5. **Commit your changes**
   - Use clear, descriptive commit messages
   - Follow conventional commits format:
     - `feat: add workout filter by date`
     - `fix: resolve authentication redirect issue`
     - `docs: update Firebase setup instructions`
     - `refactor: simplify exercise composable`
     - `style: format code with prettier`

6. **Submit pull request**
   - Provide clear description of changes
   - Reference related issues
   - Include screenshots for UI changes
   - Ensure all checks pass

## Development Setup

See [README.md](README.md#setup) for detailed setup instructions.

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Code Style Guidelines

### TypeScript

- Use TypeScript for all new code
- Define proper types, avoid `any` when possible
- Use interfaces for object shapes

### Vue Components

- Use Composition API with `<script setup>`
- Keep components focused and single-purpose
- Use composables for shared logic
- Follow Vue 3 best practices

### File Organization

- Place components in appropriate subdirectories
- Keep related files together
- Use index files for clean imports

### Naming Conventions

- Components: PascalCase (e.g., `ExerciseCard.vue`)
- Composables: camelCase with `use` prefix (e.g., `useExercises.ts`)
- Constants: UPPER_SNAKE_CASE
- Variables/functions: camelCase

## Firebase Guidelines

- Never commit Firebase credentials
- Use environment variables for configuration
- Follow Firestore security best practices
- Minimize database reads/writes

## Questions?

Feel free to open an issue for any questions about contributing!
