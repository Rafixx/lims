# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LIMS (Laboratory Information Management System) - A React/TypeScript application for managing laboratory workflows, samples, worklists, and master data tables.

## Development Commands

```bash
npm run dev       # Start Vite dev server (HMR enabled)
npm run build     # TypeScript check + production build
npm test          # Run Jest tests
npm run test:watch # Run Jest in watch mode
npm run lint      # Run ESLint
```

## Architecture

### Tech Stack
- **React 19** + **TypeScript 5.7** + **Vite 6**
- **TanStack React Query** for server state (5 min stale time, 30 min GC)
- **React Hook Form** + **Zod** for forms/validation
- **Tailwind CSS** for styling
- **Axios** with JWT auth interceptor

### Folder Structure
```
src/
├── features/           # Domain modules (each has components/, pages/, services/, hooks/, interfaces/)
│   ├── auth/          # Login/Register
│   ├── muestras/      # Samples management
│   ├── workList/      # Worklist management (core workflow feature)
│   ├── plantillaTecnica/
│   ├── tecnicasReactivos/
│   └── dim_tables/    # Master tables (pruebas, pacientes, centros, reactivos, etc.)
├── shared/            # Reusable resources
│   ├── components/    # Atomic design: atoms/, molecules/, organisms/
│   ├── contexts/      # UserContext, NotificationContext, ConfirmationContext
│   ├── hooks/         # useDim_tables, useEstados, useListFilters
│   ├── services/      # apiClient, authService, dim_tables.services
│   ├── constants/     # BASE_URL, TOKEN_KEY, STALE_TIME
│   └── utils/         # filterUtils, helpers
└── layouts/           # DashboardLayout
```

### Key Patterns

**Feature Module Structure**: Each feature follows the pattern:
- `components/` - UI components (often with sub-folders like MuestraForm/, MuestraList/)
- `pages/` - Route pages
- `services/` - API calls
- `hooks/` - Custom hooks (data fetching, business logic)
- `interfaces/` - TypeScript types

**State Management**:
- React Context for auth/user state and UI notifications
- React Query for all server data (no Redux/MobX)

**API Client**: Single axios instance (`src/shared/services/apiClient.ts`) with auto-injected JWT from localStorage.

## Workflow System

The worklist feature implements a 4-state workflow documented in `WORKFLOW_SYSTEM_DOCUMENTATION.md`:
- CREATED → TECNICO_ASSIGNED → TECNICAS_STARTED → RESULTS_IMPORTED
- Centralized in `useWorklistWorkflow` hook
- Dynamic permissions based on workflow state

## Code Style

- **ESLint + Prettier**: Single quotes, no semicolons, 100 char width, 2-space indent
- **Naming**: Spanish for domain entities, English for code constructs
- **Components**: Atomic design (atoms → molecules → organisms)

## Environment Configuration

- `.env.development`: `VITE_BASE_URL=http://localhost:3002/api`
- `.env.production`: `VITE_BASE_URL=/lims/api`, `VITE_APP_BASE=/lims/`

Path alias: `@` maps to `./src` (configured in tsconfig.json and vite.config.ts)
