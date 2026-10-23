
# 🎓 SkripsiTrack - Sistem Informasi Monitoring Tugas Akhir

Sistem Informasi Monitoring Tugas Akhir (Single-Tenant) eksklusif yang dirancang khusus untuk manajemen bimbingan mahasiswa oleh **Bapak Ir. Syaifuddin S.Kom., M.Kom., IPM, ASEAN Eng** (Informatika UMM). 

Aplikasi ini mencakup pemantauan progres bimbingan (jalur Skripsi dan Jurnal), verifikasi SK, presensi bimbingan, dan visualisasi matriks keterlambatan mahasiswa.

## ✨ Fitur Utama

*   **Arsitektur Single-Tenant:** Didesain khusus untuk satu dosen pembimbing (Super-Admin).
*   **Visualisasi Dashboard (Dosen):** Matriks risiko keterlambatan (Scatter Plot), Bottleneck Pipeline per bab, dan diagram klaster riset.
*   **Manajemen 2 Jalur Kelulusan:** Pemisahan alur progres untuk mahasiswa jalur **Skripsi** (Bab 1-5) dan jalur **Jurnal** (Draft, Submit, Revisi, Publish).
*   **Sistem Presensi:** Pencatatan kehadiran bimbingan secara mandiri oleh mahasiswa dengan verifikasi dosen.
*   **Filter Fleksibel:** Filter data berdasarkan Angkatan (NIM), Status SK, dan Jalur Kelulusan.

## 💻 Prasyarat (Prerequisites)

Sebelum menjalankan project ini, pastikan sistem Anda sudah terinstal:
*   [Node.js](https://nodejs.org/) (Versi 16 atau terbaru)
*   NPM, Yarn, atau pnpm
*   Database Server (PostgreSQL atau MySQL)

## 🚀 Cara Instalasi dan Menjalankan Sistem

**1. Clone Repository**
```bash
git clone [https://github.com/username-anda/nama-repo-anda.git](https://github.com/username-anda/nama-repo-anda.git)
cd nama-repo-anda

```

**2. Install Dependencies**
Instal seluruh package dan library yang dibutuhkan menggunakan package manager pilihan Anda:

```bash
npm install
# atau
yarn install

```

**3. Konfigurasi Environment Variables (.env)**
Duplikat file `.env.example` menjadi `.env`. Sesuaikan konfigurasi koneksi database Anda di dalam file ini.

```bash
cp .env.example .env

```

*(Buka file `.env` dan pastikan `DATABASE_URL` sudah mengarah ke database lokal Anda).*

**4. Migrasi Database & Inisialisasi Data (Seeder)**
Jalankan perintah migrasi untuk membuat tabel-tabel database, lalu jalankan seeder untuk memasukkan akun Dosen dan 35 data mahasiswa awal (beserta status ACC/Pending).

```bash
# Contoh jika menggunakan Prisma ORM
npx prisma migrate dev --name init
npx prisma db seed

# (Catatan: Sesuaikan perintah migrasi/seed ini jika Anda menggunakan framework lain seperti Laravel/Sequelize)

```

**5. Jalankan Development Server**

```bash
npm run dev
# atau
yarn dev

```

Buka browser dan akses aplikasi melalui `http://localhost:3000` (atau port yang tertera pada terminal).

## 🔐 Kredensial Login Bawaan (Default Accounts)

Gunakan akun berikut untuk masuk ke dalam sistem pertama kali:

**Akun Dosen (Super-Admin):**

* **Username / NIP:** `10816120590PNS`
* **Password:** `admin123`

**Akun Mahasiswa (Contoh Data Grup 1):**

* **Username / NIM:** `202310370311104` (Adinda Okta Rubiyanti)
* **Password:** `bimbingan123`


```

```
