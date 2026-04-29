# When was the last time I? — UI

Frontend for a reminders and groups product: sign-in, manage groups, and track recurring or one-off reminders with deadlines.

Built with **Vite**, **React 19**, **TypeScript**, **Tailwind CSS v4**, and **React Router**.

## Prerequisites

- **Node.js** (use an LTS version compatible with the dependencies in `package.json`)
- **npm** (or another client that respects `package-lock.json`)

## Setup

```bash
npm install
```

### Environment

Create a `.env` (or `.env.local`) in the project root. The app reads the backend base URL from Vite’s public env prefix:

| Variable             | Description                             |
| -------------------- | --------------------------------------- |
| `VITE_URL_BACKEND`   | Base URL of the API (e.g. `https://…`) |

Configuration is exposed in `config/environment.config.ts` as `ENVIRONTMENT.URL_BACKEND`.

## Scripts

| Command             | Description                                |
| ------------------- | ------------------------------------------ |
| `npm run dev`       | Start the Vite dev server with HMR         |
| `npm run build`     | Typecheck (`tsc -b`) then production build |
| `npm run preview`   | Serve the production build locally         |
| `npm run lint`      | Run ESLint on the project                  |

## Tech stack

- **Bundler / dev**: [Vite 8](https://vite.dev)
- **UI**: React 19, [`react-router` v7](https://reactrouter.com) (`BrowserRouter`, file-based route components under `src/screens/`)
- **Data / auth**: [@tanstack/react-query](https://tanstack.com/query) for server state; auth context in `src/contexts/Auth/`
- **Styling**: Tailwind v4 via `@import "tailwindcss"` in `index.css`, with design tokens in `@theme static` and class-based dark mode on `<html class="dark">` (theme is applied before paint using `localStorage` in `index.html`)
- **Icons**: [lucide-react](https://lucide.dev)
- **React Compiler**: enabled in `vite.config.ts` using `@vitejs/plugin-react` plus `@rolldown/plugin-babel` with `reactCompilerPreset()` from the React plugin (see [React Compiler](https://react.dev/learn/react-compiler))

## Project layout

```
src/
  App.tsx              # Route definitions (public vs. `AuthRedirect` wrapper)
  main.tsx             # React root, QueryClient, router, auth provider
  components/          # Reusable UI and sections (e.g. `ui/`, `auth/`, `sections/`)
  screens/             # Full-page views (home, auth, groups, reminders, settings, …)
  contexts/            # Auth provider / context
  middlewares/         # e.g. `AuthRedirect` for protected routes
  services/            # API modules (auth, groups, reminders, user)
  lib/                 # HTTP client, theme helpers, sorting, presets, etc.
  types/, models/      # Shared types and models
  constants/           # e.g. error codes
config/
  environment.config.ts
index.css              # Tailwind entry + `@theme` tokens + base styles
tailwind.config.ts     # `content` paths for class scanning
```

Protected routes live inside the `AuthRedirect` layout in `src/App.tsx`; public routes include landing, login, register, email verification, and password reset flows.

## API layer

HTTP helpers and services under `src/lib/request.ts` and `src/services/` consume `VITE_URL_BACKEND`. Adjust that variable per environment so the UI talks to the correct API.

## Deployment notes

`vercel.json` configures a SPA-style rewrite so all paths serve `index.html`, which is required for client-side routing in production.

## Linting

ESLint is configured with TypeScript and React-friendly plugins (`eslint.config.js`). Run `npm run lint` before pushing substantive UI changes.
