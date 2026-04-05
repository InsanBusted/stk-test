# 🍃 Menu Management API

Backend REST API untuk manajemen menu bertingkat (nested menu) yang dibangun dengan **NestJS**, **Prisma ORM**, dan **PostgreSQL**.

---

## 📋 Daftar Isi

- [Teknologi yang Digunakan](#teknologi-yang-digunakan)
- [Fitur](#fitur)
- [Prasyarat](#prasyarat)
- [Struktur Proyek](#struktur-proyek)
- [Cara Menjalankan (Docker)](#cara-menjalankan-docker)
- [Cara Menjalankan (Manual / Lokal)](#cara-menjalankan-manual--lokal)
- [Variabel Environment](#variabel-environment)
- [Migrasi Database](#migrasi-database)
- [Dokumentasi API (Swagger)](#dokumentasi-api-swagger)
- [Endpoint API](#endpoint-api)
- [Validasi & DTO](#validasi--dto)

---

## 🛠️ Teknologi yang Digunakan

| Teknologi | Versi | Keterangan |
|---|---|---|
| [NestJS](https://nestjs.com/) | ^10.x | Framework backend utama |
| [Prisma ORM](https://www.prisma.io/) | ^5.x | ORM untuk akses database |
| [PostgreSQL](https://www.postgresql.org/) | 17 | Database relasional |
| [class-validator](https://github.com/typestack/class-validator) | ^0.14.x | Validasi DTO/request body |
| [Swagger (OpenAPI)](https://swagger.io/) | ^7.x | Dokumentasi API otomatis |
| [Docker](https://www.docker.com/) | ^24.x | Containerisasi database |

---

## 💡 Pemilihan Teknologi & Keputusan Arsitektur
 
### Pemilihan Teknologi
 
Tech stack yang digunakan dipilih berdasarkan familiaritas dan produktivitas pengembangan sehari-hari. Kombinasi **NestJS + Prisma + PostgreSQL** sudah menjadi stack utama yang digunakan, sehingga pengembangan dapat berjalan lebih cepat tanpa perlu banyak penyesuaian.
 
- **NestJS** dipilih karena strukturnya yang modular dan opiniated, sehingga penulisan kode lebih konsisten dan mudah di-maintain.
- **Prisma** dipilih sebagai ORM karena developer experience-nya yang baik — schema deklaratif, type-safety penuh, dan migrasi yang mudah dikelola.
- **PostgreSQL** dipilih karena sudah terbukti handal untuk data relasional dan mendukung query kompleks dengan baik.
- **class-validator** dipilih karena terintegrasi sangat baik dengan ekosistem NestJS untuk validasi request secara deklaratif lewat DTO.
 
---
 
### Keputusan Arsitektur
 
#### Struktur Menu dengan `parentId`
 
Struktur hierarki menu dirancang menggunakan pendekatan **Adjacency List** — setiap menu item hanya menyimpan satu field `parentId` yang merujuk ke parent langsungnya. Menu tanpa parent (root) memiliki `parentId: null`.
 
```
Menu A  (parentId: null)         ← root
├── Menu B  (parentId: A)        ← child
│   └── Menu C  (parentId: B)   ← sub-child
└── Menu D  (parentId: A)        ← child
```
 
Pendekatan ini dipilih karena setiap menu item dapat **berpindah parent kapan saja** tanpa perlu menyimpan informasi level atau posisi secara eksplisit. Untuk mengetahui posisi sebuah menu (apakah dia child ke-1, sub-child, atau lebih dalam lagi), dilakukan **recursive loop** dari node tersebut ke atas hingga menemukan root — dari situlah nilai `depth` pada response tree dihitung secara dinamis.
 
Keuntungan pendekatan ini:
 
- **Fleksibel** — memindahkan menu ke parent mana pun cukup dengan mengubah satu field `parentId`
- **Sederhana** — tidak perlu menyimpan metadata level/depth di database, depth dihitung dinamis saat membangun tree
- **Scalable** — tidak ada batasan kedalaman level, bisa nested sedalam apapun
 
#### Self-Relation pada Model Prisma
 
Model `Menu` menggunakan **self-relation** — relasi ke dirinya sendiri — untuk merepresentasikan hubungan parent-child:
 
```prisma
model Menu {
  id       String  @id @default(cuid())
  name     String
  order    Int     @default(0)
  parentId String?
 
  parent   Menu?   @relation("MenuToMenu", fields: [parentId], references: [id])
  children Menu[]  @relation("MenuToMenu")
}
```
 
Self-relation dipilih karena lebih **scalable** dibanding membuat tabel terpisah untuk setiap level menu. Dengan satu model saja, semua level hierarki dapat direpresentasikan tanpa perlu mengubah skema ketika kedalaman bertambah.
 
 ---


## ✨ Fitur

- CRUD menu (Create, Read, Update, Delete)
- Struktur menu bertingkat (nested tree)
- Hapus menu beserta seluruh turunannya secara rekursif
- Pindah menu ke parent lain (move)
- Atur urutan menu (reorder)
- Validasi request menggunakan DTO dan class-validator
- Dokumentasi API interaktif via Swagger UI

---

## ✅ Prasyarat

Pastikan sudah terinstal di mesin Anda:

- [Node.js](https://nodejs.org/) >= 18
- [npm](https://www.npmjs.com/) >= 9
- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)

---

## 📁 Struktur Proyek

```
.
├── src/
│   ├── database/
│   │   └── prisma.service.ts        # Prisma service wrapper
│   ├── menus/
│   │   ├── dto/
│   │   │   ├── create-menu.dto.ts
│   │   │   ├── update-menu.dto.ts
│   │   │   ├── move-menu.dto.ts
│   │   │   └── reorder-menu.dto.ts
│   │   ├── menus.controller.ts
│   │   ├── menus.service.ts
│   │   └── menus.module.ts
│   ├── app.module.ts
│   └── main.ts
├── prisma/
│   ├── schema.prisma                # Skema database Prisma
│   └── migrations/                  # File migrasi database
├── docker-compose.yml
├── .env
├── .env.example
└── package.json
```

---

## 🐳 Cara Menjalankan (Docker)

Docker digunakan untuk menjalankan database PostgreSQL saja. Aplikasi NestJS tetap dijalankan langsung di mesin lokal.

### Langkah 1 — Clone repositori

```bash
git clone <url-repositori>
cd <nama-folder-proyek>
```

### Langkah 2 — Jalankan container database

```bash
docker-compose up -d
```

Perintah ini akan menjalankan container PostgreSQL 17 dengan nama `menus` di port `5433`.

### Langkah 3 — Install dependencies

```bash
npm install
```

### Langkah 4 — Konfigurasi environment

```bash
cp .env.example .env
```

Isi file `.env` dengan koneksi ke database yang baru dijalankan:

```env
DATABASE_URL="postgresql://root:pass@localhost:5433/menus"
```

### Langkah 5 — Jalankan migrasi Prisma

```bash
npx prisma migrate dev
```

### Langkah 6 — Jalankan aplikasi

```bash
npm run start:dev
```

Aplikasi: `http://localhost:8080`

Swagger UI: `http://localhost:8080/api`

### Menghentikan container database

```bash
docker-compose down
```

Untuk menghapus volume database juga:

```bash
docker-compose down -v
```

---

## 💻 Cara Menjalankan (Manual / Lokal)

Gunakan cara ini jika tidak ingin menggunakan Docker dan sudah punya PostgreSQL berjalan di mesin lokal.

### Langkah 1 — Clone repositori

```bash
git clone <url-repositori>
cd <nama-folder-proyek>
```

### Langkah 2 — Install dependencies

```bash
npm install
```

### Langkah 3 — Siapkan database PostgreSQL

Buat database baru:

```sql
CREATE DATABASE menus;
```

### Langkah 4 — Konfigurasi environment

```bash
cp .env.example .env
```

Edit file `.env` dan sesuaikan `DATABASE_URL`:

```env
DATABASE_URL="postgresql://root:pass@localhost:5432/menus"
```

### Langkah 5 — Jalankan migrasi Prisma

```bash
npx prisma migrate dev
```

### Langkah 6 — Generate Prisma Client

```bash
npx prisma generate
```

### Langkah 7 — Jalankan aplikasi

**Mode development (hot reload):**

```bash
npm run start:dev
```

**Mode production:**

```bash
npm run build
npm run start:prod
```

---

## ⚙️ Variabel Environment

Buat file `.env` berdasarkan `.env.example` berikut:

```env
# Koneksi database PostgreSQL
DATABASE_URL="postgresql://root:pass@localhost:5433/menus"

# Port aplikasi NestJS
PORT=8080

# Environment
NODE_ENV=development
```

> ⚠️ Pastikan `.env` sudah ada di `.gitignore` dan tidak di-commit ke repositori.

---

## 🗃️ Migrasi Database

| Perintah | Keterangan |
|---|---|
| `npx prisma migrate dev` | Buat dan jalankan migrasi baru (development) |
| `npx prisma migrate deploy` | Jalankan migrasi yang sudah ada (production) |
| `npx prisma migrate reset` | Reset database dan jalankan ulang semua migrasi |
| `npx prisma generate` | Generate ulang Prisma Client |
| `npx prisma studio` | Buka GUI Prisma Studio untuk melihat data |

---

## 📖 Dokumentasi API (Swagger)

Setelah aplikasi berjalan, akses Swagger UI di:

```
http://localhost:8080/api/docs
```

---

## 🔌 Endpoint API

Base URL: `http://localhost:8080/menus`

| Method | Endpoint | Deskripsi |
|---|---|---|
| `POST` | `/menus` | Buat menu baru |
| `GET` | `/menus` | Ambil semua menu (flat list) |
| `GET` | `/menus/tree` | Ambil semua menu (nested tree) |
| `GET` | `/menus/:id` | Ambil satu menu berdasarkan ID |
| `PUT` | `/menus/:id` | Update nama menu |
| `PATCH` | `/menus/:id/move` | Pindah menu ke parent baru |
| `PATCH` | `/menus/:id/reorder` | Ubah urutan menu |
| `DELETE` | `/menus/:id` | Hapus menu beserta semua turunannya |

### Contoh Request Body

**POST `/menus`**

```json
{
  "name": "Dashboard",
  "parentId": null,
  "order": 0
}
```

**PUT `/menus/:id`**

```json
{
  "name": "Home"
}
```

**PATCH `/menus/:id/move`**

```json
{
  "newParentId": "cm1abc124"
}
```

**PATCH `/menus/:id/reorder`**

```json
{
  "newOrder": 2
}
```

### Contoh Response Tree (`GET /menus/tree`)

```json
[
  {
    "id": "cm1abc123",
    "name": "Dashboard",
    "depth": 0,
    "parentId": null,
    "parentName": null
  },
  {
    "id": "cm1abc124",
    "name": "Settings",
    "depth": 0,
    "parentId": null,
    "parentName": null,
    "children": [
      {
        "id": "cm1abc125",
        "name": "Profile",
        "depth": 1,
        "parentId": "cm1abc124",
        "parentName": "Settings"
      }
    ]
  }
]
```

---

## 🛡️ Validasi & DTO

Validasi request menggunakan `class-validator`.


| DTO | Digunakan Oleh | Field |
|---|---|---|
| `CreateMenuDto` | `POST /menus` | `name` (required), `parentId` (optional), `order` (optional) |
| `UpdateMenuDto` | `PUT /menus/:id` | `name` (optional) |
| `MoveMenuDto` | `PATCH /menus/:id/move` | `newParentId` (nullable) |
| `ReorderMenuDto` | `PATCH /menus/:id/reorder` | `newOrder` (required, number) |

---

