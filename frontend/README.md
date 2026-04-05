# Frontend — Dasbor Manajemen Menu

Aplikasi dasbor modern yang dibangun dengan **Next.js 16**, **Zustand**, dan **shadcn/ui**, dilengkapi antarmuka manajemen menu berbasis pohon (tree).

---

## Tech Stack

| Lapisan         | Teknologi                                      |
| --------------- | ---------------------------------------------- |
| Framework       | [Next.js 16](https://nextjs.org/) (App Router) |
| Bahasa          | TypeScript 5                                   |
| Manajemen State | [Zustand 5](https://zustand-demo.pmnd.rs/)     |
| Komponen UI     | [shadcn/ui](https://ui.shadcn.com/) + Radix UI |
| Styling         | Tailwind CSS v4                                |
| Ikon            | [Lucide React](https://lucide.dev/)            |
| Font            | Plus Jakarta Sans, Geist (via `next/font`)     |

---

## Prasyarat

Pastikan hal-hal berikut telah terpasang sebelum memulai:

- **Node.js** `>= 18.x` (disarankan versi LTS)
- **npm** `>= 9.x` atau **yarn** / **pnpm**
- Backend API sudah berjalan (default: `http://localhost:8080/api`)

---

## Panduan Setup

### 1. Clone & Install Dependensi

```bash
# Masuk ke direktori frontend
cd frontend

# Install semua dependensi
npm install
```

### 2. Konfigurasi Environment Variable

Ketik di terminal

```bash
cp .env.local .env
```

Kemudian edit `.env` dan sesuaikan nilainya:

```env
# URL backend REST API
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:8080/api
```

> **Catatan:** Variabel yang diawali dengan `NEXT_PUBLIC_` akan terekspos ke browser. Jangan simpan data rahasia di sini.

---

## Menjalankan Aplikasi

### Mode Development

Menjalankan server pengembangan dengan hot-reload di [http://localhost:3000](http://localhost:3000):

```bash
npm run dev
```

### Mode Production

Build bundle teroptimasi terlebih dahulu, kemudian jalankan server production:

```bash
# Langkah 1 — Build
npm run build

# Langkah 2 — Jalankan
npm start
```

> Server production juga berjalan di port `3000` secara default. Gunakan `PORT=<port> npm start` untuk menggantinya.

### Linting

```bash
npm run lint
```

---

## Struktur Proyek

```
frontend/
├── public/                     # Aset statis
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Layout utama (font, sidebar, provider)
│   │   ├── page.tsx            # Halaman root (/)
│   │   ├── globals.css         # Gaya global & token Tailwind
│   │   ├── menus/
│   │   │   └── page.tsx        # Route: /menus (re-export halaman fitur)
│   │   └── feature/            # Modul berbasis fitur
│   │       ├── home/           # Fitur home
│   │       └── menus/          # Fitur manajemen menu
│   │           ├── components/ # Komponen UI khusus fitur ini
│   │           │   ├── TreeNode.tsx
│   │           │   └── MenuDetail.tsx
│   │           ├── hooks/      # Custom React hooks
│   │           ├── pages/      # Komponen tingkat halaman
│   │           │   └── MenusPage.tsx
│   │           ├── stores/     # Zustand stores
│   │           │   └── menu.store.ts
│   │           └── types/      # Tipe & antarmuka TypeScript
│   ├── components/
│   │   └── ui/                 # Komponen yang di-generate shadcn/ui
│   ├── lib/
│   │   └── utils.ts            # Fungsi utilitas (cn, dll.)
│   └── shared/
│       ├── components/
│       │   └── layouts/        # Komponen layout bersama (Sidebar, MainContent)
│       └── context/            # React Context provider (mis. SidebarContext)
├── .env                        # Nilai default environment variable
├── .env.local                  # Override lokal (ter-gitignore)
├── components.json             # Konfigurasi shadcn/ui
├── next.config.ts              # Konfigurasi Next.js
├── tailwind.config.ts          # Konfigurasi Tailwind CSS
└── tsconfig.json               # Konfigurasi TypeScript
```

---

## Keputusan Arsitektur

### 1. Struktur Feature-Sliced (`src/app/feature/`)

Setiap fitur domain memiliki folder tersendiri yang mengikuti pola **Feature-Sliced Design**:

```
feature/<nama>/
  ├── components/   # Komponen UI yang terbatas pada fitur ini
  ├── hooks/        # Hook untuk pengambilan data dan logika
  ├── pages/        # Komponen halaman yang digunakan App Router
  ├── stores/       # Slice state Zustand
  └── types/        # Antarmuka dan tipe TypeScript
```

File route Next.js (`app/<route>/page.tsx`) dibuat sesederhana mungkin — hanya me-re-export halaman fitur:

```ts
// app/menus/page.tsx
export { default } from "@/app/feature/menus/pages/MenusPage";
```

Ini memisahkan **kepentingan routing** (Next.js) dari **logika fitur**, sehingga fitur lebih mudah diuji dan dipindahkan secara independen.

---

### 2. Manajemen State — Zustand

[Zustand](https://github.com/pmndrs/zustand) digunakan untuk state global sisi klien. Setiap fitur memiliki store-nya sendiri:

```ts
// feature/menus/stores/menu.store.ts

// Store untuk daftar menu yang diambil dari API
export const useMenuStore = create<MenuState>((set) => ({
  menus: [],
  loading: false,
  fetchMenus: async () => { ... },
}));

// Store untuk menu yang sedang dipilih
export const useSelectMenu = create<MenuStore>((set) => ({
  selectedMenu: null,
  setSelectedMenu: (menu) => set({ selectedMenu: menu }),
}));
```

**Mengapa Zustand dibanding Context/Redux?**

- Boilerplate minimal dibanding Redux Toolkit
- Tidak perlu membungkus komponen dengan Provider untuk setiap store
- Subscription yang granular menghindari render ulang yang tidak perlu
- Bekerja secara native dengan fitur concurrent di React 19

---

### 3. UI — shadcn/ui + Radix UI

[shadcn/ui](https://ui.shadcn.com/) digunakan sebagai fondasi komponen. Komponen **disalin ke dalam** `src/components/ui/` (bukan sebagai dependensi package), sehingga memberikan kepemilikan dan kemampuan kustomisasi penuh.

```bash
# Menambahkan komponen shadcn baru (contoh)
npx shadcn add button
npx shadcn add select
```

Komponen kemudian diimpor langsung:

```ts
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
```

**Mengapa shadcn/ui?**

- Tidak memiliki style bawaan di level primitif (via Radix UI) — kontrol styling penuh dengan Tailwind
- Aksesibel secara default (ARIA, navigasi keyboard)
- Tidak ada dependensi runtime — komponen ada di dalam codebase Anda

---

### 4. Font — `next/font`

Google Fonts dimuat via `next/font/google` untuk menghilangkan layout shift (CLS) dan menghindari permintaan jaringan eksternal saat runtime:

```ts
// app/layout.tsx
const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});
const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
```

Variabel CSS font kemudian direferensikan di konfigurasi Tailwind untuk tipografi yang konsisten.

---

### 5. Layout Bersama — Sidebar + Context

Root `layout.tsx` menyediakan layout dua kolom yang persisten:

```
┌──────────────┬──────────────────────────┐
│   Sidebar    │       Konten Utama       │
│ (SidebarSection) │   (children / pages)   │
└──────────────┴──────────────────────────┘
```

State buka/tutup sidebar dikelola via React Context ringan (`SidebarProvider`) yang disimpan di `src/shared/context/` — sesuai untuk state yang hanya bersifat UI dan tidak memerlukan persistensi atau devtools dari Zustand.

---

## Daftar Skrip

| Perintah        | Keterangan                                                  |
| --------------- | ----------------------------------------------------------- |
| `npm run dev`   | Menjalankan server pengembangan                             |
| `npm run build` | Membuild bundle production                                  |
| `npm start`     | Menjalankan server production (butuh build terlebih dahulu) |
| `npm run lint`  | Menjalankan ESLint                                          |
