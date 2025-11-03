# AquaPump Frontend

Marketing experience built with React 18, Vite, Tailwind CSS, and the shadcn/ui component system.

## Requirements

- Node.js 20+
- npm 10+

## Environment

Create `.env` (or `.env.local`) in the repository root to point the frontend at the backend API:

```
VITE_REACT_APP_API_BASE=http://localhost:8000
```

## Scripts

| Command           | Description                            |
| ----------------- | -------------------------------------- |
| `npm run dev`     | Start the Vite dev server on port 5173 |
| `npm run build`   | Build a production bundle (used by CI) |
| `npm run lint`    | Lint with ESLint and TypeScript        |
| `npm run preview` | Preview the production build locally   |

The GitHub Actions pipeline runs `lint` and `build` on every push and pull request.

## Design system notes

- Components live under `src/components` and follow the shadcn/ui conventions.
- Global styles live in `src/index.css` with Tailwind driven by `tailwind.config.ts`.
- Reusable hooks/utilities belong in `src/hooks` and `src/lib`; keep page experiences under `src/pages`.
