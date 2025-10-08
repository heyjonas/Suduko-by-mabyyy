## Repository: sudoku-by-mabyyy — Quick agent guide

This file contains repository-specific instructions for AI coding agents to be productive immediately.

Keep changes small and isolated. This is a minimal Vite + React app used to prototype a Sudoku UI.

Key files/directories
- `package.json` — npm scripts: `dev` (vite), `build` (vite build), `preview` (vite preview), `lint` (eslint).
- `src/` — main source. `src/main.jsx` mounts the app. `src/App.jsx` is the top-level component.
- `src/components/` — UI components. Examples: `SplashScreen.jsx`, `SudokuGrid.jsx`.
- `src/assets/` — static assets (images) referenced by components.

Big-picture architecture
- Single-page React app using Vite for dev server and build.
- No backend; state and UI logic live in React components under `src/`.
- Styling uses Tailwind utility classes (see `className` usage across components). Expect existing Tailwind v4 config via `postcss` dependencies.

Developer workflows
- Start dev server: `npm run dev` (starts Vite with HMR).
- Build for production: `npm run build`.
- Quick preview of build: `npm run preview`.
- Lint: `npm run lint`.

Project-specific conventions and patterns
- Use function components and React hooks (see `App.jsx` using `useState`/`useEffect`).
- Small, focused components per file under `src/components/`.
- Layout/styling uses Tailwind utility classes inline on `className`. Prefer adding utility classes over creating CSS files for small changes.
- Static assets are referenced with relative paths from components (e.g. `src/components/SplashScreen.jsx` imports `../assets/brownie-icon.jpg`). Keep paths relative to component files.

Integration points & dependencies
- No external APIs — all logic is client-side. If adding persistence, prefer lightweight browser storage (localStorage) or add a clear backend integration in a new folder (e.g. `server/`).
- Dev dependencies to be aware of: `vite`, `@vitejs/plugin-react`, `eslint`, `tailwindcss`, `postcss`, `autoprefixer`.

Behavioral guidance for code changes
- Preserve the minimal build footprint — avoid adding large runtime dependencies unless necessary.
- When editing UI, prefer adjusting JSX + Tailwind classes. If adding new styles, prefer creating small CSS files under `src/` only when utility classes are insufficient.
- Component examples:
  - `src/components/SplashScreen.jsx`: simple full-screen loader; keep animation and image usage intact.
  - `src/components/SudokuGrid.jsx`: uses a 9x9 grid created at render time (`Array(9).map`) and maps to inputs. If adding logic, centralize grid generation or move to a helper (e.g. `src/utils/grid.js`).

Testing and quality
- There are no tests configured. If adding tests, choose a lightweight setup (Jest or Vitest) and add scripts to `package.json`.
- Run `npm run lint` before pushing changes.

When unsure, open these files first
- `src/App.jsx`, `src/main.jsx`, `src/components/SplashScreen.jsx`, `src/components/SudokuGrid.jsx`, `package.json`, `README.md`.

Notes & limitations (discoverable in repo)
- No CI workflows are present. Do not assume automated tests or linters run on push.
- Tailwind config and PostCSS may be missing; verify when making Tailwind changes.

If you modify the build/dev scripts, update this file with the exact commands and rationale.

-- End of file
