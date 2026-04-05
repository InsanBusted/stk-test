# 🌳 Menu Management System (Fullstack)

Aplikasi **manajemen menu bertingkat (nested menu)** berbasis **fullstack TypeScript**.

Terdiri dari:

- ⚙️ Backend API → NestJS + Prisma + PostgreSQL
- 🎨 Frontend Dashboard → Next.js + Zustand + shadcn/ui

---

## 📦 DAFTAR ISI

- Overview
- Arsitektur Sistem
- Tech Stack
- Fitur Utama
- Struktur Project
- Cara Menjalankan
- Import Database
- Environment Variables
- Alur Sistem
- API Endpoint
- Penggunaan AI
- Deployment

---

## 📖 OVERVIEW

Project ini merupakan hasil technical test fullstack yang dikerjakan oleh **Muhammad Insan Kamil** dengan tujuan membangun sistem manajemen menu bertingkat (menu tree system) berbasis fullstack.

# STK - Technical Test Fullstack Web

# Fullstack Menu Tree System

## Overview - The Goals 🎯

Build a fullstack application that implements a hierarchical menu tree system with CRUD operations. The system should support nested menu items with unlimited depth, and implement the UI as similar as possible like in this figma:

https://www.figma.com/design/Pa1vc4POl4DGsvDTutwM6k/Fullstack---ReactJS%2FVueJS

## Tujuan Implementasi

- Mengimplementasikan sistem menu bertingkat (tree structure)
- Mendukung nested menu dengan kedalaman tanpa batas
- Menyediakan operasi CRUD lengkap pada menu
- Menampilkan UI yang mengikuti referensi desain Figma
- Menjaga struktur backend dan frontend tetap scalable dan maintainable

## Use Case Sistem

- Sistem sidebar admin dashboard
- Struktur navigasi dinamis
- CMS menu builder
- Layout navigasi bertingkat untuk aplikasi web

## 🧱 ARSITEKTUR SISTEM

Frontend (Next.js)
↓
REST API (NestJS)
↓
Database (PostgreSQL)

- Frontend mengambil data dari backend via REST API
- Backend mengelola logic & validasi
- Database menyimpan struktur menu

---

## 🛠️ TECH STACK

BACKEND:

- NestJS
- Prisma ORM
- PostgreSQL
- Swagger (OpenAPI)
- class-validator
- Docker

FRONTEND:

- Next.js (App Router)
- TypeScript
- Zustand
- shadcn/ui + Radix UI
- Tailwind CSS
- Lucide Icons

---

## ✨ FITUR UTAMA

BACKEND:

- CRUD Menu
- Nested Menu (Tree)
- Move Menu (ubah parent)
- Reorder Menu
- Delete recursive (hapus + children)
- Swagger API Docs

FRONTEND:

- Tree Menu UI (hierarki)
- Select & Detail Menu
- State management dengan Zustand
- Modular feature-based structure
- Responsive dashboard layout

---

## 📁 STRUKTUR PROJECT

root/
├── backend/
│ ├── src/
│ ├── prisma/
│ ├── docker-compose.yml
│ └── package.json
│
├── frontend/
│ ├── src/
│ ├── public/
│ └── package.json
│
└── README.md

---

## 🚀 CARA MENJALANKAN

1. Clone repository

---

git clone <repo-url>
cd <project-name>

---

## 🐳 BACKEND SETUP

cd backend

docker-compose up -d

npm install

cp .env.example .env

DATABASE_URL="postgresql://root:pass@localhost:5433/menus"
PORT=8080

npx prisma migrate dev

npm run start:dev

Backend:
http://localhost:8080

Swagger:
http://localhost:8080/api/docs

---

## 🎨 FRONTEND SETUP

cd frontend

npm install

cp .env.local .env

NEXT_PUBLIC_BACKEND_API_URL=http://localhost:8080/api

npm run dev

Frontend:
http://localhost:3000

---

## 🗄️ IMPORT DATABASE (SQL FILE)

File:
menus-202604051556.sql

CREATE DATABASE menus;

IMPORT:
psql -U root -d menus -f menus-202604051556.sql

PORT CUSTOM:
psql -U root -p 5433 -d menus -f menus-202604051556.sql

DOCKER:
docker exec -i <container_name> psql -U root -d menus < menus-202604051556.sql

Contoh:
docker exec -i menus-db psql -U root -d menus < menus-202604051556.sql

NOTE:

- File SQL sudah berisi schema database
- Tidak perlu migrate jika sudah import SQL
- Gunakan salah satu: Prisma Migration ATAU SQL Import

---

## ⚙️ ENVIRONMENT VARIABLES

BACKEND:
DATABASE_URL=postgresql://user:pass@localhost:5433/menus
PORT=8080
NODE_ENV=development

FRONTEND:
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:8080/api

---

## 🔄 ALUR SISTEM

1. Frontend request /menus/tree
2. Backend ambil data database
3. Backend build tree structure
4. Backend hitung depth
5. Kirim ke frontend
6. Frontend render tree UI

---

## 🔌 API ENDPOINT

BASE URL:
http://localhost:8080/menus

POST /menus -> create menu
GET /menus -> list menu
GET /menus/tree -> nested menu
GET /menus/:id -> detail menu
PUT /menus/:id -> update menu
PATCH /menus/:id/move -> pindah parent
PATCH /menus/:id/reorder -> ubah urutan
DELETE /menus/:id -> hapus recursive

---

## 🤖 PENGGUNAAN AI

1. ChatGPT

- Brainstorming ide & struktur sistem
- Membantu validasi arsitektur
- Membantu perencanaan logic sebelum implementasi

2. Claude

- Membantu efisiensi pembuatan frontend
- Menyempurnakan kode yang sudah dibuat
- Membantu debugging lebih cepat
- Membantu pembuatan Swagger & README

Semua hasil AI selalu direview manual sebelum digunakan.
Tidak ada kode yang langsung dipakai tanpa pengecekan.

---

## 🚀 DEPLOYMENT

BACKEND:

- VPS / Docker / Railway / Render
- Pastikan PostgreSQL aktif
- Setup environment production

FRONTEND:

- Vercel (recommended)
- Netlify

---

## 📌 CATATAN

- Backend & frontend terpisah (decoupled)
- Struktur menu fleksibel tanpa batas level
- Mudah dikembangkan & scalable

---
