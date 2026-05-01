# Repository Guidelines

## Project Structure & Module Organization
This is an Ionic + Angular app with the main source under `src/`. Pages live in `src/app/pages/`, reusable UI in `src/app/components/`, shared logic in `src/app/services/`, and route guards/resolvers/pipes/interceptors in their matching folders. Static assets are in `src/assets/`, global styles in `src/global.scss` and `src/theme/variables.scss`, and environment settings in `src/environments/`.

## Build, Test, and Development Commands
Use the npm scripts defined in `package.json`:

- `npm start`: runs the local dev server with `ng serve`.
- `npm run build`: creates the production build in `www/`.
- `npm run watch`: rebuilds continuously in development mode.
- `npm test`: runs Jasmine unit tests through Karma.
- `npm run lint`: checks TypeScript and inline HTML templates with ESLint.

## Coding Style & Naming Conventions
Follow the existing Angular ESLint rules. Use `app`-prefixed selectors, kebab-case for component tags, and camelCase for directives. Component and page classes should end in `Component` or `Page`. Keep TypeScript, HTML, and SCSS colocated by feature. This project uses SCSS, so prefer `.scss` for component styles and keep indentation consistent with the surrounding file.

## Testing Guidelines
Unit tests live next to the code they cover as `*.spec.ts`. Name tests after the target file, for example `home.page.spec.ts` or `url-manager.spec.ts`. Keep tests focused on observable behavior and run `npm test` before submitting changes. There is no separate end-to-end test setup in the repository.

## Commit & Pull Request Guidelines
Recent commits are short, imperative, and task-focused, such as `Fixing the url validation` or `Adding web socket for click counter`. Keep commit messages similarly concise and specific. Pull requests should explain the change, note any user-facing impact, and include screenshots or screen recordings when UI changes are involved. Link related issues when available and mention any environment or migration steps.

## Configuration Notes
Builds use `src/environments/environment.ts` and replace it with `environment.prod.ts` for production. Keep secrets out of the repository and update `capacitor.config.ts` and platform assets only when the runtime configuration actually changes.
