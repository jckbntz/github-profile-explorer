# GitHub Profile Explorer

Search a GitHub user and browse their profile and repositories.

## Stack
- Backend: Node, Express, TypeScript, Zod (`backend/`)
- Frontend: React, Vite, TanStack Query (`frontend/`)

## Run
1. `pnpm install`
2. Copy `backend/.env.example` to `backend/.env` (optionally add `GITHUB_TOKEN`)
3. `pnpm dev` → web on :5173, API on :4000

## Build
`pnpm build`