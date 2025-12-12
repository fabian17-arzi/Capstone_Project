📘 Capstone Project – Sistem Berita Acara (BAPP)

Proyek ini merupakan aplikasi fullstack yang terdiri dari:

Frontend (React + Vite + Tailwind)

Backend (PHP Native + MySQL)

API proses dokumen BAPP & BAPB

Sistem multi-role: Admin, Vendor, Gudang, Direksi

Sistem notifikasi & progres dokumen

Struktur repository menggunakan model monorepo agar mudah direplikasi dan dipelajari.



Cara Menjalankan Project
1️⃣ Clone Repository
git clone https://github.com/USERNAME/NAMA-REPO.git
cd NAMA-REPO

2️⃣ Pindahkan backend ke XAMPP
Letakkan folder:
backend/ → C:\xampp\htdocs\backend\

3️⃣Buat Database di phpMyAdmin
Buka browser → http://localhost/phpmyadmin
Buat database baru:
capstone_db
Import file SQL jika tersedia, atau buat tabel sesuai kebutuhan.

4️⃣Install dependencies
Masuk ke folder frontend:
cd capstone
npm install

✨ Fitur Utama

Login & autentikasi berbasis role

Pembuatan dokumen BAPP & BAPB

Upload lampiran (PDF/Gambar)

Preview dokumen sebelum submit

Notifikasi status progres (modal)

Dashboard role spesifik

Arsip dokumen lengkap

Tampilan modern (Tailwind + React)

Sistem direksi/gudang/vendor terpisah