# Frontend — Menu Management Dashboard

A modern dashboard application built with **Next.js 16**, **Zustand**, and **shadcn/ui**, featuring a tree-based menu management interface.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Language | TypeScript 5 |
| State Management | [Zustand 5](https://zustand-demo.pmnd.rs/) |
| UI Components | [shadcn/ui](https://ui.shadcn.com/) + Radix UI |
| Styling | Tailwind CSS v4 |
| Icons | [Lucide React](https://lucide.dev/) |
| Font | Plus Jakarta Sans, Geist (via `next/font`) |

---

## Prerequisites

Make sure you have the following installed before getting started:

- **Node.js** `>= 18.x` (recommend LTS)
- **npm** `>= 9.x` or **yarn** / **pnpm**
- Backend API running (default: `http://localhost:8080/api`)

---

## Setup Instructions

### 1. Clone & Install Dependencies

```bash
# Navigate to the frontend directory
cd frontend

# Install all dependencies
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root of the `frontend` directory:

```bash
cp .env .env.local
```

Then edit `.env.local` and adjust the value:

```env
# URL of the backend REST API
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:8080/api
```

> **Note:** Any variable prefixed with `NEXT_PUBLIC_` is exposed to the browser. Never store secrets here.

---

## Running the Application

### Development Mode

Starts the dev server with hot-reload on [http://localhost:3000](http://localhost:3000):

```bash
npm run dev
```

### Production Mode

Build the optimized bundle first, then start the production server:

```bash
# Step 1 — Build
npm run build

# Step 2 — Start
npm start
```

> The production server also runs on port `3000` by default. Use `PORT=<port> npm start` to override.

### Linting

```bash
npm run lint
```

---

## Project Structure

```
frontend/
├── public/                     # Static assets
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout (fonts, sidebar, providers)
│   │   ├── page.tsx            # Root page (/)
│   │   ├── globals.css         # Global styles & Tailwind tokens
│   │   ├── menus/
│   │   │   └── page.tsx        # Route: /menus (re-exports feature page)
│   │   └── feature/            # Feature-sliced modules
│   │       ├── home/           # Home feature
│   │       └── menus/          # Menu management feature
│   │           ├── components/ # Feature-specific UI components
│   │           │   ├── TreeNode.tsx
│   │           │   └── MenuDetail.tsx
│   │           ├── hooks/      # Custom React hooks
│   │           ├── pages/      # Page-level components
│   │           │   └── MenusPage.tsx
│   │           ├── stores/     # Zustand stores
│   │           │   └── menu.store.ts
│   │           └── types/      # TypeScript types & interfaces
│   ├── components/
│   │   └── ui/                 # shadcn/ui generated components
│   ├── lib/
│   │   └── utils.ts            # Utility helpers (cn, etc.)
│   └── shared/
│       ├── components/
│       │   └── layouts/        # Shared layout components (Sidebar, MainContent)
│       └── context/            # React Context providers (e.g. SidebarContext)
├── .env                        # Environment variable defaults
├── .env.local                  # Local overrides (gitignored)
├── components.json             # shadcn/ui configuration
├── next.config.ts              # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
└── tsconfig.json               # TypeScript configuration
```

---

## Architecture Decisions

### 1. Feature-Sliced Structure (`src/app/feature/`)

Each domain feature lives in its own self-contained folder following a **Feature-Sliced Design** pattern:

```
feature/<name>/
  ├── components/   # UI components scoped to this feature
  ├── hooks/        # Data-fetching and logic hooks
  ├── pages/        # The actual page component consumed by App Router
  ├── stores/       # Zustand state slice
  └── types/        # TypeScript interfaces and types
```

The Next.js route file (`app/<route>/page.tsx`) is kept thin — it simply re-exports the feature page:

```ts
// app/menus/page.tsx
export { default } from "@/app/feature/menus/pages/MenusPage";
```

This separates **routing concerns** (Next.js) from **feature logic**, making features easier to test and move independently.

---

### 2. State Management — Zustand

[Zustand](https://github.com/pmndrs/zustand) is used for global client-side state. Each feature owns its own store(s):

```ts
// feature/menus/stores/menu.store.ts

// Store for fetched menu list
export const useMenuStore = create<MenuState>((set) => ({
  menus: [],
  loading: false,
  fetchMenus: async () => { ... },
}));

// Store for currently selected menu item
export const useSelectMenu = create<MenuStore>((set) => ({
  selectedMenu: null,
  setSelectedMenu: (menu) => set({ selectedMenu: menu }),
}));
```

**Why Zustand over Context/Redux?**
- Minimal boilerplate compared to Redux Toolkit
- No Provider wrapping needed for each store
- Fine-grained subscriptions avoid unnecessary re-renders
- Works natively with React 19's concurrent features

---

### 3. UI — shadcn/ui + Radix UI

[shadcn/ui](https://ui.shadcn.com/) is used as the component foundation. Components are **copied into** `src/components/ui/` (not installed as a package dependency), giving full ownership and customizability.

```bash
# Adding a new shadcn component (example)
npx shadcn add button
npx shadcn add select
```

Components are then imported directly:

```ts
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
```

**Why shadcn/ui?**
- Unstyled at the primitive level (via Radix UI) — full styling control with Tailwind
- Accessible out of the box (ARIA, keyboard navigation)
- No runtime dependency — components live in your codebase

---

### 4. Fonts — `next/font`

Google Fonts are loaded via `next/font/google` to eliminate layout shift (CLS) and avoid external network requests at runtime:

```ts
// app/layout.tsx
const plusJakartaSans = Plus_Jakarta_Sans({ variable: "--font-plus-jakarta-sans", subsets: ["latin"] });
const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
```

Font CSS variables are then referenced in Tailwind config for consistent typography.

---

### 5. Shared Layout — Sidebar + Context

The root `layout.tsx` provides a persistent two-column layout:

```
┌──────────────┬──────────────────────────┐
│   Sidebar    │       Main Content       │
│ (SidebarSection) │   (children / pages)   │
└──────────────┴──────────────────────────┘
```

Sidebar open/close state is managed via a lightweight React Context (`SidebarProvider`) kept in `src/shared/context/` — appropriate for UI-only state that does not need Zustand's persistence or devtools.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build production bundle |
| `npm start` | Start production server (requires build) |
| `npm run lint` | Run ESLint |
