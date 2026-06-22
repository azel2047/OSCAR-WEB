# PRODUCT REQUIREMENTS DOCUMENT
## OSCAR 3.0 — SEASON RAINFOREST
### Website Official Competition Platform

---

| Atribut | Detail |
|---------|--------|
| **Nama Proyek** | Website OSCAR 3.0 — Season Rainforest |
| **Versi Dokumen** | 2.0 (Complete Edition) |
| **Tanggal** | Mei 2026 |
| **Author** | Tim Frontend OSCAR 3.0 |
| **Status** | Final Draft — Ready for Development |
| **Scope** | Frontend Only (React 18 + Laravel 11 Monorepo) |
| **Tech Stack** | React 18, Vite, Tailwind CSS, GSAP, Lenis, Axios, Zustand |
| **Referensi Desain** | https://spylt-gsap-website.vercel.app |

---

## DAFTAR ISI

```
1.   Executive Summary
2.   Goals & OKRs
3.   Stakeholders & Personas
4.   Information Architecture
5.   Feature Specifications (F-01 s/d F-20)
6.   User Flows Lengkap
7.   Design System & UI/UX
8.   Animation Specifications
9.   Routing & Navigation
10.  State Management Architecture
11.  API Contract Lengkap
12.  Form Validation Rules
13.  Error Handling & Edge Cases
14.  Performance Budget
15.  Aksesibilitas (A11y)
16.  SEO Strategy
17.  Testing Plan
18.  Struktur Folder & Arsitektur Frontend
19.  Scope Matrix & Prioritas
20.  Timeline & Milestones
21.  Risiko & Mitigasi
22.  Glossary
```

---

# 1. EXECUTIVE SUMMARY

## 1.1 Latar Belakang

OSCAR (Open Source Competition & Annual Race) adalah event kompetisi teknologi tahunan yang diselenggarakan untuk mendorong minat dan kemampuan siswa SMA/SMK serta mahasiswa di bidang teknologi informasi. Memasuki season ke-3 dengan tema **"Rainforest"**, OSCAR membutuhkan platform digital yang tidak hanya informatif tetapi juga mampu menciptakan kesan prestisius dan profesional — mencerminkan ambisi OSCAR sebagai kompetisi tech terdepan.

Website OSCAR 2.0 dirasakan kurang memuaskan dari sisi visual dan pengalaman pengguna. Website OSCAR 3.0 dirancang ulang dari nol dengan filosofi desain **Cyber Rainforest**: perpaduan estetika digital futuristik (neon, dark UI) dengan motif ekosistem hutan tropis — menciptakan identitas visual yang kuat dan unik.

## 1.2 Problem Statement

| Problem | Dampak |
|---------|--------|
| Website lama tidak mobile-friendly | Kehilangan peserta yang akses via HP |
| Pendaftaran manual via Google Form | Data berantakan, admin kesulitan verifikasi |
| Tidak ada tracking status pendaftaran | Peserta harus bertanya manual ke humas |
| Dokumentasi season sebelumnya tidak terarsip | Brand awareness OSCAR tidak terbangun |
| Tampilan tidak memorable | Tidak mencerminkan level kompetisi yang diinginkan |

## 1.3 Solusi

Website OSCAR 3.0 hadir sebagai **platform kompetisi terintegrasi** dengan:
- Landing page sinematik berbasis GSAP untuk first impression yang kuat
- Sistem pendaftaran online dengan tracking status real-time
- Dashboard peserta yang informatif
- Dashboard admin untuk manajemen kompetisi end-to-end
- Arsip dokumentasi lintas season
- Design system konsisten berbasis tema Cyber Rainforest

---

# 2. GOALS & OKRs

## 2.1 Business Goals

### Goal 1: Tingkatkan Jumlah Pendaftar
- **KR1.1:** Registrasi akun mencapai minimal 300 akun unik dalam 2 minggu pertama open registration
- **KR1.2:** Form pendaftaran lomba submitted minimal 150 tim/individu total
- **KR1.3:** Conversion rate dari kunjungan ke pendaftaran >= 15%

### Goal 2: Bangun Brand Awareness OSCAR
- **KR2.1:** Average time on site >= 3 menit (diukur via analytics)
- **KR2.2:** Bounce rate <= 40%
- **KR2.3:** Minimal 500 unique visitors dalam minggu pertama launch

### Goal 3: Efisiensi Operasional Panitia
- **KR3.1:** Waktu admin verifikasi 1 pendaftaran <= 5 menit
- **KR3.2:** 0 data peserta hilang atau duplikat
- **KR3.3:** Export data peserta bisa dilakukan dalam < 30 detik

### Goal 4: Platform Berkelanjutan
- **KR4.1:** Admin bisa tambah lomba baru tanpa ubah kode dalam < 10 menit
- **KR4.2:** Dokumentasi season baru bisa diupload tanpa developer dalam < 30 menit

## 2.2 Frontend-Specific Goals

| Goal | Metrik Target |
|------|--------------|
| Performa halaman | Lighthouse Performance > 85 |
| Aksesibilitas | Lighthouse Accessibility > 90 |
| Core Web Vitals LCP | < 2.5 detik |
| Core Web Vitals CLS | < 0.1 |
| Core Web Vitals FID/INP | < 200ms |
| First Contentful Paint | < 1.5 detik |
| Mobile Responsif | Semua halaman 100% fungsional di 375px |
| Cross-browser | Chrome, Firefox, Safari, Edge (2 versi terakhir) |

---

# 3. STAKEHOLDERS & PERSONAS

## 3.1 Stakeholders

| Stakeholder | Peran | Keterlibatan |
|-------------|-------|--------------|
| Tim Humas OSCAR | Pemilik konten, kontak peserta | Konten halaman kontak, pengumuman |
| Tim IT OSCAR | Developer backend, admin sistem | API contract, admin dashboard |
| Ketua Panitia | Decision maker | Review & approval PRD, desain |
| Mitra (MUDENG, GDG, dll.) | Sponsor/kolaborator | Logo & info tampil di website |
| Peserta (Siswa/Mahasiswa) | End user utama | Semua public pages + dashboard |
| Guru Pendamping | Pengguna sekunder | Info lomba, kontak humas |

## 3.2 User Personas

### Persona 1 — Rini (Siswa SMA, 16 tahun)
```
Background : Siswi SMAN 1 Makassar, suka desain grafis
Device     : iPhone SE (layar kecil), koneksi 4G kadang lemot
Goals      : Ingin ikut lomba desain poster, belum pernah daftar lomba online
Pain Points: Takut salah isi form, tidak tahu syarat apa yang perlu disiapkan
Kebutuhan  : Form yang mudah, petunjuk jelas, bisa simpan progress, notifikasi via WA
```

### Persona 2 — Bagas (Mahasiswa, 21 tahun)
```
Background : Mahasiswa Teknik Informatika, tertarik CTF dan cybersecurity
Device     : Laptop + Android, familiar dengan web
Goals      : Ikut CTF bersama tim, cari info soal kategori, tools yang boleh dipakai
Pain Points: Info lomba yang tidak lengkap, tidak tahu apakah pendaftaran berhasil
Kebutuhan  : Detail teknis yang lengkap, status real-time, info grup tim
```

### Persona 3 — Pak Budi (Guru Pendamping, 38 tahun)
```
Background : Guru TIK SMKN 3 Surabaya, mendampingi 2 tim siswa
Device     : Laptop kantor, browser Chrome
Goals      : Pastikan siswa terdaftar dengan benar, tahu info technical meeting
Pain Points: Informasi tersebar, harus kontak humas berulang kali
Kebutuhan  : Satu halaman dengan semua info, kontak humas mudah ditemukan
```

### Persona 4 — Sari (Admin OSCAR, 22 tahun)
```
Background : Anggota tim IT OSCAR, mengurus data pendaftaran
Device     : Laptop, monitor besar
Goals      : Verifikasi data pendaftar cepat, export data untuk laporan
Pain Points: Harus buka banyak tab, data berantakan di Google Sheet
Kebutuhan  : Dashboard terpusat, preview berkas instan, filter dan search data
```

---

# 4. INFORMATION ARCHITECTURE

## 4.1 Sitemap Lengkap

```
OSCAR 3.0 Website
|
+-- PUBLIC (tanpa login)
|   +-- / ─────────────────── Landing Page / Beranda
|   +-- /lomba ───────────── Daftar Semua Lomba
|   +-- /lomba/:slug ─────── Detail Lomba
|   +-- /roadmap ─────────── Roadmap OSCAR
|   +-- /roadmap/:season ─── Dokumentasi Season
|   +-- /tentang ─────────── Tentang OSCAR
|   +-- /kontak ──────────── Kontak & Humas
|
+-- AUTH
|   +-- /register ────────── Halaman Daftar Akun
|   +-- /login ───────────── Halaman Masuk
|   +-- /lupa-password ───── Request Reset Password
|   +-- /reset-password ──── Form Reset Password (via link email)
|
+-- PESERTA (membutuhkan login, role: peserta)
|   +-- /dashboard ────────── Dashboard Peserta
|   +-- /daftar ──────────── Pilih Lomba (step 1)
|   +-- /daftar/:lombaId ──── Form Pendaftaran (step 2-4)
|   +-- /status ──────────── Status Pendaftaran Saya
|   +-- /profil ──────────── Profil Akun
|
+-- ADMIN (membutuhkan login, role: admin)
    +-- /admin ────────────── Dashboard Admin (redirect)
    +-- /admin/dashboard ──── Overview & Statistik
    +-- /admin/lomba ──────── Daftar Lomba
    +-- /admin/lomba/baru ─── Form Lomba Baru
    +-- /admin/lomba/:id ──── Edit Lomba
    +-- /admin/pendaftaran ─── Daftar Pendaftaran (filter status)
    +-- /admin/pendaftaran/:id ─ Detail & Verifikasi
    +-- /admin/peserta ────── Data Peserta (per lomba)
    +-- /admin/timeline ───── Manajemen Timeline
    +-- /admin/roadmap ────── Manajemen Dokumentasi Season
    +-- /admin/pengumuman ─── Manajemen Pengumuman
    +-- /admin/laporan ────── Laporan & Statistik
```

## 4.2 Navigation Priority

**Primary Nav (Navbar):** Beranda > Lomba > Roadmap > Tentang > Kontak
**Secondary Nav (Navbar kanan):** Login / [Avatar + Nama] > Dropdown (Dashboard, Profil, Logout)
**Footer Nav:** Lomba, Roadmap, Tentang, Kontak, Kebijakan Privasi
**Admin Sidebar:** Dashboard, Lomba, Pendaftaran, Peserta, Timeline, Roadmap, Pengumuman, Laporan

---

# 5. FEATURE SPECIFICATIONS

## F-01 | LANDING PAGE / BERANDA

**Route:** `/`
**Auth:** Tidak diperlukan
**Priority:** P0 (Wajib — MVP)

### F-01-A | Hero Section

**Layout:** Full-viewport height (100vh), centered content

**Elemen:**
1. **Pre-loader** — Logo OSCAR SVG stroke-draw animation (1.5 detik), fade out ke hero
2. **Background Layer** — Deep black (#050505) dengan particle system ringan (TSParticles / GSAP custom), noise texture overlay opacity 0.03
3. **Maskot Harimau Digital** — Posisi kanan layar, parallax factor: bergerak 30% lebih lambat dari scroll, floating animation CSS keyframe (translateY -8px > 8px, 4 detik ease-in-out infinite)
4. **Eyebrow Text** — "OPEN SOURCE COMPETITION & ANNUAL RACE" — font monospace kecil, letter-spacing 0.2em, warna `--color-primary`, fade in delay 0.3s
5. **Main Headline** — "OSCAR 3.0" — Ukuran clamp(4rem, 10vw, 8rem), font display, clip-path reveal dari bawah
6. **Sub-headline** — "Season Rainforest" — warna `--color-accent`, italic, stagger masuk setelah headline
7. **Deskripsi Singkat** — Max 2 baris, warna text-muted, fade in delay 0.8s
8. **CTA Group** — 3 tombol horizontal (Daftar Sekarang | Lihat Lomba | Download Booklet)
9. **Scroll Indicator** — Animated arrow/chevron + teks "Scroll" bergerak bounce

**CTA Behavior:**
- "Daftar Sekarang" > Cek auth status:
  - Jika sudah login sebagai peserta > `/daftar`
  - Jika sudah login sebagai admin > `/admin/dashboard`
  - Jika belum login > `/register`
- "Lihat Lomba" > Smooth scroll ke section Arena Lomba di halaman yang sama
- "Download Booklet" > Fetch URL booklet dari API `/api/config/booklet`, buka di tab baru. Jika tidak ada > tampilkan toast "Booklet belum tersedia"

**Stats Counter Bar** (di bawah CTA):
```
[4 Cabang Lomba] [500+ Peserta OSCAR] [8 Mitra] [3 Season]
```
Angka count-up dari 0 saat hero masuk viewport. Data statis dari config, bukan API.

**Acceptance Criteria:**
- [ ] Hero terlihat sempurna di viewport 375px, 768px, 1280px, 1920px
- [ ] Pre-loader tidak muncul lagi jika user navigate back (session flag)
- [ ] Semua teks dapat dibaca (contrast ratio >= 4.5:1 terhadap background)
- [ ] Maskot menggunakan `<img>` dengan alt text yang deskriptif
- [ ] CTA redirect berdasarkan auth state yang akurat
- [ ] Download booklet gracefully handle jika API error
- [ ] Animasi tidak dijalankan jika `prefers-reduced-motion: reduce`

---

### F-01-B | Modul Kategori Peserta

**Layout:** 2 kolom (desktop), 1 kolom stack (mobile)

**Konten Per Kolom:**

*Kolom Kiri — Siswa SMA/SMK:*
- Icon + Label "SMA/SMK Sederajat"
- Deskripsi 1 kalimat
- List lomba: Web Development, Desain Poster, Desain Infografis
- Tombol "Lihat Lomba SMA/SMK" > scroll ke Arena Lomba + aktifkan filter "Siswa"

*Kolom Kanan — Mahasiswa:*
- Icon + Label "Mahasiswa"
- Deskripsi 1 kalimat
- List lomba: Capture The Flag (CTF)
- Tombol "Lihat Lomba Mahasiswa" > scroll ke Arena Lomba + aktifkan filter "Mahasiswa"

**Visual Treatment:**
- Divider vertikal di tengah dengan neon glow
- Hover kolom: background sedikit lebih terang, border left/right glow
- Animasi entrance: kolom kiri slide dari kiri, kolom kanan dari kanan

**Acceptance Criteria:**
- [ ] Filter lomba aktif saat tombol diklik
- [ ] Di mobile, kolom kiri tampil lebih dulu
- [ ] Tidak ada horizontal overflow di mobile

---

### F-01-C | Ecosystem Kompetisi / Mitra

**Layout:** Section penuh lebar dengan label "Kolaborasi Bersama"

**Konten:**
- Infinite horizontal scroll (marquee) logo mitra
- Data logo diambil dari API `/api/mitra`
- Duplikasi array logo untuk seamless loop
- Hover individual logo: scale 1.1, opacity 1 (default opacity 0.7)
- Speed: 40 detik per loop
- Paused on hover (animation-play-state: paused)

**Fallback:** Jika API error, tampilkan placeholder 5 kotak abu dengan teks "Mitra OSCAR"

**Acceptance Criteria:**
- [ ] Tidak ada gap/jump pada infinite scroll
- [ ] Logo tidak distorsi (object-fit: contain, max-height 60px)
- [ ] Accessible: aria-hidden="true" pada marquee (dekoratif)
- [ ] Di mobile: kecepatan scroll dikurangi 50%

---

### F-01-D | Arena Lomba

**Layout:** Grid 2 kolom (desktop), 1 kolom (mobile)

**Filter Bar:**
- Tombol: Semua | Siswa SMA/SMK | Mahasiswa
- Active state: background primary, glow
- State filter disimpan di URL query param `?kategori=siswa` (shareable URL)

**Lomba Card:**
```
+------------------------------------+
| [Status Badge]          [Kategori] |
|                                    |
| [Ikon Lomba]                       |
| NAMA LOMBA                         |
| Deskripsi singkat (max 2 baris)    |
|                                    |
| Hadiah: Rp X.XXX.XXX + sertif.    |
| Maks. X peserta per tim            |
| Deadline: DD MMM YYYY              |
|                                    |
| [Detail Lomba]  [Daftar Sekarang] |
+------------------------------------+
```

**Status Badge:**
- `BUKA` > warna accent green, pulse animation
- `TUTUP` > warna error red
- `SEGERA` > warna primary teal, blink animation
- `HABIS` > warna gray, disabled state

**Card Hover:**
- border-color: transition ke `--color-primary`
- box-shadow: `0 0 20px rgba(0, 245, 195, 0.2)`
- Tombol "Daftar Sekarang" muncul (opacity 0 > 1 dengan translateY)

**Empty State (jika filter tidak ada hasil):**
```
[Ikon] Belum ada lomba untuk kategori ini.
       Coba kategori lain atau pantau pengumuman kami.
```

**Acceptance Criteria:**
- [ ] Filter berubah mengupdate URL dan card tanpa page reload
- [ ] Card skeleton loader saat data sedang di-fetch
- [ ] Tombol "Daftar" disabled jika status lomba TUTUP atau HABIS
- [ ] Jumlah card yang ditampilkan tidak lebih dari 8 di beranda (sisanya di halaman /lomba)
- [ ] Tombol "Lihat Semua Lomba" muncul jika total lomba > 8

---

### F-01-E | Timeline Interaktif

**Layout:** Horizontal scrollable (desktop) / Vertical (mobile)

**Stage Items:**
1. Open Registration — tanggal
2. Technical Meeting — tanggal
3. Penyisihan / Babak Pertama — tanggal
4. Semifinal — tanggal
5. Final — tanggal
6. Awarding — tanggal

**Visual:**
- Line connector antar stage
- Stage yang sudah lewat: opacity 0.5, ikon centang hijau
- Stage aktif: highlighted, pulse ring
- Stage mendatang: tampilan normal

**Data:** Dari API `/api/timeline`

**Acceptance Criteria:**
- [ ] Timezone Indonesia (WIB/WITA/WIT) ditampilkan dengan benar
- [ ] Stage aktif auto-highlight berdasarkan tanggal saat ini
- [ ] Di mobile, vertikal dan bisa discroll

---

## F-02 | HALAMAN DAFTAR LOMBA

**Route:** `/lomba`
**Auth:** Tidak diperlukan
**Priority:** P0

**Konten:**
- Page title: "Arena Lomba OSCAR 3.0"
- Deskripsi singkat
- Filter bar (Semua / SMA/SMK / Mahasiswa)
- Search bar: cari nama lomba
- Sort: Terbaru | Deadline Terdekat | Hadiah Terbesar
- Grid semua lomba (card yang sama dengan F-01-D)
- Pagination jika lomba > 12

**Acceptance Criteria:**
- [ ] Search realtime (debounce 300ms)
- [ ] URL update saat filter/sort/search berubah
- [ ] SEO: title tag dinamis, meta description

---

## F-03 | HALAMAN DETAIL LOMBA

**Route:** `/lomba/:slug`
**Auth:** Tidak diperlukan
**Priority:** P0

**Layout:** Single Column + Sticky Sidebar (desktop) / Full Width (mobile)

**Main Content:**
1. **Hero Banner** — Full-width, gradient overlay, nama lomba besar di atas
2. **Breadcrumb** — Beranda > Lomba > [Nama Lomba]
3. **Status + Deadline** — Badge status + countdown timer ke deadline pendaftaran
4. **Deskripsi Lomba** — Rich text (render HTML dari API, sanitized)
5. **Persyaratan** — List bulleted: dokumen yang harus disiapkan
6. **Ketentuan Lomba** — List: aturan, format file, dll.
7. **Timeline Lomba** — Timeline spesifik untuk lomba ini
8. **Benefit & Hadiah** — Grid: Juara 1, 2, 3 + hadiah masing-masing
9. **Mitra Lomba** — Logo-logo mitra yang terlibat
10. **FAQ** — Accordion: pertanyaan dan jawaban umum
11. **Booklet** — Tombol download booklet khusus lomba ini

**Sticky Sidebar (desktop):**
```
+----------------------+
| STATUS: BUKA         |
| Deadline: XX hari    |
| lagi                 |
|                      |
| Kuota: XX peserta    |
| Terdaftar: XX        |
|                      |
| [DAFTAR SEKARANG]    |
| [Download Booklet]   |
|                      |
| Bagikan:             |
| [WA] [IG] [Copy URL] |
+----------------------+
```

**Countdown Timer:**
- Format: `XX Hari XX Jam XX Menit XX Detik`
- Jika deadline lewat: "Pendaftaran Ditutup"
- Jika deadline < 24 jam: warna merah, lebih mencolok

**Acceptance Criteria:**
- [ ] Countdown timer real-time (update tiap detik)
- [ ] Share via WA: pre-filled pesan dengan nama lomba dan URL
- [ ] HTML dari API di-sanitize (DOMPurify) sebelum dirender
- [ ] 404 page jika slug tidak ditemukan
- [ ] OG tags untuk preview WhatsApp/sosmed (og:title, og:image, og:description)
- [ ] Breadcrumb structured data (JSON-LD)

---

## F-04 | HALAMAN ROADMAP OSCAR

**Route:** `/roadmap`
**Auth:** Tidak diperlukan
**Priority:** P0

### F-04-A | Historical Timeline Section

**Visual Design:**
- Full-width section dengan background pattern hutan/organic subtle
- Horizontal timeline dengan 3 node: OSCAR 1.0 > OSCAR 2.0 > OSCAR 3.0
- Connector line animasi draw (stroke-dashoffset) saat masuk viewport
- Node: lingkaran besar dengan nomor season, tahun di bawah

**Node Hover State:**
- Popup card muncul di atas node
- Berisi: Tahun, tema season, jumlah peserta, 1 foto thumbnail

### F-04-B | Season Cards Grid

**Konten Per Card:**
```
+------------------------------+
| [Foto Utama — 16:9]          |
|                              |
| OSCAR 1.0          [2022]   |
| Season: [Nama Tema]          |
| Peserta: XXX   Lomba: X     |
|                              |
| [Lihat Dokumentasi]          |
+------------------------------+
```

**Card Hover:** 3D tilt effect (max 10deg X dan Y), photo scale 1.05

### F-04-C | Halaman Dokumentasi Season

**Route:** `/roadmap/:season` (contoh: `/roadmap/oscar-1`)
**Konten:**
1. Hero dengan foto utama full-width dan nama season
2. Statistik: jumlah peserta, lomba, mitra
3. Gallery foto (masonry grid, klik > lightbox)
4. Video Aftermovie (YouTube embed, lazy load)
5. Artikel/Cerita Acara (rich text)
6. Daftar Pemenang per Lomba (tabel per lomba)
7. Galeri Statistik (chart sederhana)

**Gallery Lightbox:**
- Library: yet-another-react-lightbox
- Fitur: zoom, swipe (mobile), keyboard navigation, download foto
- Lazy loading dengan IntersectionObserver
- Tampilkan thumbnail 6 foto pertama, tombol "Lihat Semua" buka lightbox

**Acceptance Criteria:**
- [ ] Gallery lazy load sebelum viewport
- [ ] Video tidak autoplay
- [ ] Lightbox bisa ditutup dengan ESC key
- [ ] Pemenang table responsive (horizontal scroll di mobile)

---

## F-05 | HALAMAN TENTANG OSCAR

**Route:** `/tentang`
**Auth:** Tidak diperlukan
**Priority:** P0

**Sections:**
1. **Hero** — "Tentang OSCAR" dengan background abstract
2. **Apa itu OSCAR** — Paragraf deskriptif + ilustrasi
3. **Visi & Misi** — 2 kolom dengan ikon
4. **Tujuan Acara** — Grid 4 tujuan utama dengan ikon dan deskripsi singkat
5. **Filosofi Season Rainforest** — Paragraf naratif, bisa ada quote besar
6. **Penyelenggara** — Card organisasi penyelenggara + foto tim (opsional)
7. **Peta Persebaran Peserta** — Visualisasi peta Indonesia interaktif:
   - Provinsi yang ada pesertanya di-highlight
   - Hover provinsi > tooltip: nama provinsi + jumlah peserta
   - Library: react-simple-maps atau SVG Indonesia custom
   - Data dari API `/api/statistik/peta`
8. **Statistik OSCAR 1.0 & 2.0** — Bar chart perbandingan jumlah peserta per season, per lomba

**Acceptance Criteria:**
- [ ] Peta Indonesia SVG accessible (aria-label per provinsi)
- [ ] Chart menggunakan Recharts, responsif
- [ ] Data peta dan statistik dari API (dengan loading state)

---

## F-06 | HALAMAN KONTAK

**Route:** `/kontak`
**Auth:** Tidak diperlukan
**Priority:** P0

**Konten:**
- Heading "Hubungi Kami"
- Sub-teks: jam operasional humas
- Grid kontak channels:
  - WhatsApp > `https://wa.me/[nomor]?text=[pesan default]`
  - Instagram > `https://instagram.com/[handle]`
  - TikTok > `https://tiktok.com/@[handle]`
  - Email > `mailto:[email]?subject=[subject]`
  - YouTube > `https://youtube.com/@[channel]`
- Setiap channel: ikon platform, nama, handle/nomor, tombol "Hubungi"
- Semua link buka tab baru
- Pesan WA default: "Halo, saya ingin bertanya tentang OSCAR 3.0..."

**FAQ Umum** (accordion):
- Kapan pendaftaran dibuka?
- Apakah boleh ikut lebih dari 1 lomba?
- Bagaimana cara mengetahui status pendaftaran?

**Acceptance Criteria:**
- [ ] Semua link sosmed valid dan buka tab baru
- [ ] WA link format `wa.me` bukan `api.whatsapp.com`
- [ ] FAQ accordion accessible (ARIA expanded/collapsed)

---

## F-07 | REGISTER

**Route:** `/register`
**Auth:** Redirect ke dashboard jika sudah login
**Priority:** P0

**Form Fields:**
```
Nama Lengkap*     : text input, min 3 char, max 100 char
Email*            : email input, harus unique (validasi via API)
Password*         : password input, min 8 char, harus ada huruf + angka
Konfirmasi Pass*  : harus match dengan password
Kategori*         : radio — Siswa SMA/SMK | Mahasiswa
Setuju T&C*       : checkbox
```

**Validasi Real-time:**
- Nama: tidak boleh angka di depan
- Email: format valid + cek ketersediaan saat onBlur (debounce 500ms)
- Password: strength indicator (weak/medium/strong) + tooltip syarat
- Konfirmasi: validasi saat onChange setelah field disentuh

**Behavior setelah Submit:**
1. Loading state (spinner di tombol, disabled form)
2. Sukses > Toast "Akun berhasil dibuat!" > Redirect ke `/login` dengan state `{newUser: true}`
3. Di login page: banner info "Silakan masuk dengan akun baru Anda"
4. Error 422 > Tampilkan error per field dari API response
5. Error 500 > Toast error generic "Terjadi kesalahan, coba lagi"

**Acceptance Criteria:**
- [ ] Tidak ada double submit
- [ ] Password tidak ter-reveal secara default
- [ ] Toggle show/hide password
- [ ] Tombol submit disabled sampai semua field valid
- [ ] Link ke halaman Login

---

## F-08 | LOGIN

**Route:** `/login`
**Auth:** Redirect ke dashboard jika sudah login
**Priority:** P0

**Form Fields:**
```
Email*     : email input
Password*  : password input
Ingat Saya : checkbox (opsional)
```

**Behavior:**
1. Submit > loading state
2. Sukses > ambil data user dari response (role, nama)
   - role `peserta` > redirect `/dashboard`
   - role `admin` > redirect `/admin/dashboard`
3. Error 401 > "Email atau password salah"
4. Error 429 > "Terlalu banyak percobaan. Coba lagi dalam X menit"
5. "Ingat Saya" > token disimpan lebih lama (configurable dari backend)

**Acceptance Criteria:**
- [ ] Enter key submit form
- [ ] Link "Lupa Password" mengarah ke `/lupa-password`
- [ ] Link "Belum punya akun? Daftar" mengarah ke `/register`
- [ ] Rate limit error tertangani dengan baik

---

## F-09 | LUPA & RESET PASSWORD

**Route Lupa:** `/lupa-password`
**Route Reset:** `/reset-password?token=xxx&email=xxx`
**Priority:** P1

**Flow:**
1. User input email > submit > "Jika email terdaftar, link reset akan dikirim"
2. Klik link di email > halaman reset password
3. Form: Password baru + Konfirmasi password baru
4. Submit > sukses > redirect login dengan pesan "Password berhasil direset"

**Edge Cases:**
- Link expired (> 60 menit) > error "Link sudah kedaluwarsa, minta ulang"
- Link sudah dipakai > error "Link ini sudah digunakan"
- Email tidak terdaftar > tampilkan pesan yang sama (security: jangan reveal)

---

## F-10 | DASHBOARD PESERTA

**Route:** `/dashboard`
**Auth:** Wajib login (role: peserta)
**Priority:** P0

**Layout:** Sidebar fixed (desktop) + Top nav (mobile)

**Sidebar Items:**
- Dashboard (home)
- Daftar Lomba
- Status Pendaftaran
- Profil Saya
- Logout

**Main Dashboard Widgets:**

**Widget 1: Greeting + Status Akun**
```
Halo, [Nama]!
Kategori: Siswa SMA/SMK | Mahasiswa
Status Akun: Aktif
```

**Widget 2: Pendaftaran Saya**
- Card per lomba yang didaftar
- Badge status (Pending / Diverifikasi / Ditolak)
- Jika belum daftar: CTA "Mulai Daftar Lomba"

**Widget 3: Timeline Lomba**
- Progress bar atau mini timeline
- Highlight stage aktif dengan countdown

**Widget 4: Notifikasi Terbaru**
- List 3 notifikasi terbaru
- Link "Lihat Semua"
- Badge merah di sidebar jika ada notif belum dibaca

**Widget 5: Pengumuman**
- Card pengumuman terbaru dari admin
- Format: judul, tanggal, cuplikan isi
- Link "Baca Selengkapnya" > modal atau halaman detail

**Widget 6: Info Grup**
- Jika status Diverifikasi: tampilkan link grup (WA/Telegram)
- Jika belum diverifikasi: "Informasi grup akan tersedia setelah verifikasi"

**Acceptance Criteria:**
- [ ] Data dashboard di-fetch saat mount, loading skeleton saat pending
- [ ] Notifikasi badge update secara polling (interval 60 detik)
- [ ] Mobile: sidebar berubah menjadi bottom navigation bar
- [ ] Redirect ke login jika token expired (401 interceptor)

---

## F-11 | FORM PENDAFTARAN LOMBA (MULTI-STEP)

**Route:** `/daftar` > `/daftar/:lombaId`
**Auth:** Wajib login (role: peserta)
**Priority:** P0

**Step 1: Pilih Kategori & Lomba**
```
Pilih Kategori: [Siswa SMA/SMK] [Mahasiswa]
Tampilkan lomba yang tersedia untuk kategori tersebut
Card lomba dengan tombol "Pilih" per lomba
```

**Step 2: Isi Data Peserta**
Form fields berbeda per lomba (lihat detail di bawah)

**Step 3: Upload Berkas**
```
Upload Bukti Transfer     : JPG/PNG/PDF, max 2MB
Upload Bukti Follow Sosmed: JPG/PNG, max 2MB
```
File upload features:
- Drag & drop area
- Click to browse
- Preview thumbnail setelah upload
- Tombol hapus file
- Progress bar upload (jika file besar)
- Validasi tipe dan ukuran di client sebelum upload

**Step 4: Preview & Konfirmasi**
- Tampilkan semua data yang akan di-submit
- Checklist pernyataan kebenaran data
- Tombol "Kembali & Edit" per section
- Tombol "Submit Pendaftaran"

**Step 5: Sukses / Error**
```
SUKSES:
Pendaftaran berhasil dikirim!
Nomor Pendaftaran: OSC-2026-XXXX
Cek status di dashboard Anda.
Email konfirmasi akan dikirim ke: [email]
[Lihat Status] [Kembali ke Dashboard]

ERROR:
Pendaftaran gagal dikirim.
[Pesan error spesifik]
[Coba Lagi]
```

**Aturan Form Per Lomba:**

Web Development (Tim 2 orang):
```
Nama Peserta 1*           : text, min 3 char
Nama Peserta 2*           : text, min 3 char
Nama Guru Pendamping*     : text, min 3 char
Asal Sekolah*             : text, min 3 char
No WA Pendamping*         : tel, format +62xxx atau 08xxx, min 10 digit
Email Pendamping*         : email valid
Pilihan Tema*             : dropdown (data dari API)
Upload Bukti Transfer*    : file
Upload Bukti Follow Sosmed*: file
```

Desain Poster (Individual):
```
Nama Peserta*             : text
Asal Sekolah*             : text
No WhatsApp*              : tel
Email Peserta*            : email
Pilihan Tema*             : dropdown
Upload Bukti Transfer*    : file
Upload Bukti Follow Sosmed*: file
```

Desain Infografis (Individual): sama dengan Desain Poster

CTF Mahasiswa (Tim maks 3 orang):
```
Nama Peserta 1*           : text (wajib)
Nama Peserta 2            : text (opsional)
Nama Peserta 3            : text (opsional)
Asal Universitas*         : text
No WhatsApp*              : tel
Email Peserta*            : email
Pilihan Tema*             : dropdown
Upload Bukti Transfer*    : file
Upload Bukti Follow Sosmed*: file
```

**Progress Indicator:**
```
[Pilih Lomba] ── [Data Peserta] ── [Upload] ── [Konfirmasi]
     v                 *               o              o
```

**Draft Auto-save:**
- Data form di-save ke localStorage setiap 30 detik
- Saat user kembali ke halaman: tampilkan banner "Anda memiliki draft yang belum dikirim. [Lanjutkan] [Hapus]"
- Draft dihapus otomatis setelah submit berhasil atau setelah 7 hari

**Acceptance Criteria:**
- [ ] Browser back button tidak merusak progress form
- [ ] File tetap tersimpan saat navigasi antar step
- [ ] Validasi per-step sebelum lanjut ke step berikutnya
- [ ] Tidak bisa akses step 3/4 tanpa menyelesaikan step sebelumnya
- [ ] Submit hanya satu kali (tombol disabled setelah klik)
- [ ] Jika sudah pernah mendaftar lomba yang sama: tampilkan pesan "Anda sudah mendaftar lomba ini"

---

## F-12 | STATUS PENDAFTARAN PESERTA

**Route:** `/status`
**Auth:** Wajib login (role: peserta)
**Priority:** P0

**Layout:**
- Header: "Status Pendaftaran Saya"
- Jika belum pernah daftar: empty state + CTA daftar
- Jika sudah daftar: list card per pendaftaran

**Pendaftaran Card:**
```
+----------------------------------------+
| Web Development              [PENDING] |
| No. Pendaftaran: OSC-2026-0001        |
| Didaftarkan: 12 Mei 2026, 14:23 WIB   |
|                                        |
| Progress Verifikasi:                   |
| [v] Data Diterima                      |
| [*] Verifikasi Pembayaran (sedang...) |
| [ ] Verifikasi Sosmed                  |
| [ ] Selesai                            |
|                                        |
| [Lihat Detail]                         |
+----------------------------------------+
```

Jika status DITOLAK:
```
+----------------------------------------+
| Desain Poster               [DITOLAK] |
| Catatan Admin:                         |
| "Bukti transfer tidak jelas/terpotong. |
|  Mohon upload ulang dengan foto yang   |
|  lebih jernih."                        |
|                                        |
| [Revisi & Kirim Ulang]                 |
+----------------------------------------+
```

**Halaman Detail Pendaftaran:**
- Semua data yang sudah diisi
- Preview file yang diupload (thumbnail, klik untuk buka full)
- Status badge + history perubahan status (timestamp)
- Catatan admin (jika ada)

**Acceptance Criteria:**
- [ ] Status di-polling setiap 30 detik
- [ ] Jika status berubah saat user sedang di halaman > tampilkan toast notifikasi
- [ ] Preview bukti transfer bisa di-zoom (tap pada mobile)
- [ ] Tombol "Revisi" hanya muncul jika status DITOLAK

---

## F-13 | PROFIL PESERTA

**Route:** `/profil`
**Auth:** Wajib login
**Priority:** P2

**Konten:**
- Nama Lengkap (editable)
- Email (read-only setelah register)
- Kategori (read-only setelah register)
- Tombol Ganti Password
- Tombol Hapus Akun (dengan konfirmasi)

---

## F-14 | ADMIN DASHBOARD OVERVIEW

**Route:** `/admin/dashboard`
**Auth:** Wajib login (role: admin)
**Priority:** P0

**Layout:** Sidebar tetap + Main content

**Sidebar Admin:**
- Logo OSCAR (link ke /admin/dashboard)
- Dashboard (Overview)
- Lomba
- Pendaftaran
- Peserta
- Timeline
- Roadmap
- Pengumuman
- Laporan
- Profil Admin
- Logout

**Main Content:**

Row 1 — Summary Cards:
```
[Total Peserta: 234]  [Pending Verif: 18]  [Lomba Aktif: 4]  [Hari ini: 12]
```

Row 2 — Chart Peserta Per Lomba:
- Bar chart (Recharts BarChart)
- X-axis: nama lomba, Y-axis: jumlah peserta
- Warna bar menggunakan color palette OSCAR

Row 3 — Tabel Pendaftaran Terbaru:
- Kolom: Nama, Lomba, Status, Waktu Daftar, Aksi (Lihat)
- Maks 10 row terbaru
- Link "Lihat Semua Pendaftaran"

Row 4 — Split Charts:
- Kiri: Pie chart distribusi kategori peserta (SMA vs Mahasiswa)
- Kanan: Line chart pertumbuhan pendaftaran per hari (7 hari terakhir)

**Acceptance Criteria:**
- [ ] Data auto-refresh setiap 5 menit
- [ ] Chart responsif (Recharts ResponsiveContainer)
- [ ] Summary card menampilkan delta dari kemarin

---

## F-15 | ADMIN MANAJEMEN LOMBA

**Route:** `/admin/lomba`
**Auth:** Admin
**Priority:** P0

**Halaman List Lomba:**
- Tabel: Nama, Kategori, Status, Peserta, Deadline, Aksi
- Aksi: Edit | Toggle Status | Hapus
- Tombol "+ Tambah Lomba Baru"
- Search lomba
- Filter by status

**Form Lomba (Create & Edit):**
```
Nama Lomba*           : text
Slug*                 : auto-generate dari nama (editable), unik
Kategori*             : select (Siswa SMA/SMK | Mahasiswa)
Deskripsi*            : rich text editor (Quill atau TipTap)
Persyaratan           : rich text
Ketentuan             : rich text
Hadiah Juara 1*       : text
Hadiah Juara 2        : text
Hadiah Juara 3        : text
Benefit Tambahan      : text
Deadline Pendaftaran* : datetime-local input
Kuota Peserta         : number (0 = unlimited)
Status*               : select (Draft | Buka | Tutup)
Upload Booklet        : file (PDF, max 10MB)
Mitra Lomba           : multi-select (dari daftar mitra)
Ikon/Gambar Banner    : file (JPG/PNG, max 2MB)
```

**Delete Confirmation Modal:**
```
"Apakah Anda yakin ingin menghapus lomba [Nama]?
 Tindakan ini tidak dapat dibatalkan.
 Semua data pendaftaran terkait lomba ini akan ikut terhapus."
[Batal]  [Hapus Lomba]
```

**Acceptance Criteria:**
- [ ] Slug auto-generate tapi editable, validasi unik
- [ ] Rich text editor aman (sanitize HTML output)
- [ ] Toggle status real-time (no page reload)
- [ ] Tidak bisa hapus lomba jika ada peserta yang sudah diverifikasi

---

## F-16 | ADMIN VERIFIKASI PENDAFTARAN

**Route:** `/admin/pendaftaran`
**Auth:** Admin
**Priority:** P0

**Halaman List Pendaftaran:**
- Tabs: Semua | Pending | Diverifikasi | Ditolak
- Filter: Lomba, Tanggal, Asal Sekolah/Universitas
- Search: Nama peserta
- Kolom tabel: No. Daftar, Nama, Lomba, Sekolah, Waktu Daftar, Status, Aksi
- Aksi: Lihat Detail

**Halaman Detail Pendaftaran:**
```
+-----------------------------------------------------+
| PENDAFTARAN #OSC-2026-0001                 [PENDING] |
| Lomba: Web Development                               |
| Dikirim: 12 Mei 2026, 14:23 WIB                     |
+-----------------------------------------------------+
| DATA PESERTA                                         |
| Peserta 1 : Budi Santoso                            |
| Peserta 2 : Ani Lestari                             |
| Pendamping: Pak Joko (+6281234567890)               |
| Sekolah   : SMAN 1 Surabaya                         |
| Email     : joko@sman1sby.sch.id                    |
| Tema      : Teknologi Ramah Lingkungan              |
+-----------------------------------------------------+
| BERKAS PENDAFTARAN                                   |
|                                                      |
| Bukti Transfer:      [Preview] [Buka Full]          |
| Bukti Follow Sosmed: [Preview] [Buka Full]          |
+-----------------------------------------------------+
| TINDAKAN ADMIN                                       |
|                                                      |
| Catatan (jika ditolak):                             |
| [textarea]                                           |
|                                                      |
| [TERIMA PENDAFTARAN]    [TOLAK PENDAFTARAN]         |
+-----------------------------------------------------+
```

**Setelah Terima:**
- Status update ke "Diverifikasi"
- Email otomatis terkirim (trigger backend)
- Toast: "Pendaftaran berhasil diverifikasi"
- Opsi "Simpan & Lanjut ke Berikutnya"

**Setelah Tolak:**
- Modal konfirmasi dengan textarea alasan wajib diisi
- Status update ke "Ditolak"
- Email dengan alasan terkirim ke peserta

**Acceptance Criteria:**
- [ ] Gambar bukti bisa di-zoom (lightbox)
- [ ] Catatan wajib diisi saat menolak
- [ ] Setelah aksi, data ter-refresh otomatis
- [ ] Tombol "Terima" dan "Tolak" disabled saat sedang loading
- [ ] Navigasi antar pendaftaran (prev/next) tanpa kembali ke list

---

## F-17 | ADMIN MANAJEMEN PESERTA

**Route:** `/admin/peserta`
**Auth:** Admin
**Priority:** P1

**Layout:**
- Tabs per lomba (Web Dev | Poster | Infografis | CTF)
- Tabel per lomba dengan kolom yang relevan
- Filter: Status, Asal Sekolah/Kota
- Search: Nama peserta, sekolah
- Export: Tombol "Export CSV" > download file CSV

**Export Format CSV:**
- Nama file: `peserta_webdev_oscar3_2026.csv`
- Encoding: UTF-8 BOM (agar bisa dibuka di Excel tanpa encoding issue)

**Acceptance Criteria:**
- [ ] Data peserta TIDAK digabung antar lomba (tab terpisah)
- [ ] Export hanya data yang sesuai filter aktif
- [ ] Empty state jika belum ada peserta di lomba tersebut

---

## F-18 | ADMIN MANAJEMEN TIMELINE

**Route:** `/admin/timeline`
**Auth:** Admin
**Priority:** P1

**Halaman List:**
- Tabel timeline: Nama Stage, Tanggal, Status Aktif, Aksi
- Toggle "Set sebagai Stage Aktif"
- Tombol + Tambah Stage

**Form Stage:**
```
Nama Stage*  : text (contoh: "Open Registration")
Tanggal*     : date input
Waktu        : time input (opsional)
Keterangan   : textarea
Status Aktif : toggle/checkbox
```

**Acceptance Criteria:**
- [ ] Hanya satu stage yang bisa aktif sekaligus
- [ ] Urutan stage bisa di-drag untuk reorder (P2)

---

## F-19 | ADMIN MANAJEMEN ROADMAP & DOKUMENTASI

**Route:** `/admin/roadmap`
**Auth:** Admin
**Priority:** P1

**Halaman List Season:**
- Card per season: nama, tahun, tombol Edit, Hapus
- Tombol "+ Tambah Season"

**Form Season:**
```
Nama Season*    : text (contoh: "OSCAR 1.0")
Slug*           : auto-generate
Tema*           : text
Tahun*          : number
Deskripsi*      : rich text
Foto Utama*     : file (JPG/PNG)
Galeri Foto     : multiple file upload (drag & drop, reorderable)
Link Video*     : URL YouTube (embed)
Cerita Acara    : rich text
Statistik:
  - Jumlah Peserta : number
  - Jumlah Lomba   : number
  - Jumlah Mitra   : number
Pemenang Lomba  : repeater field:
  [Nama Lomba] [Juara 1] [Juara 2] [Juara 3]
```

**Acceptance Criteria:**
- [ ] Multiple foto upload dengan preview grid dan tombol hapus per foto
- [ ] Validasi URL YouTube (harus format youtube.com atau youtu.be)
- [ ] Urutan foto bisa di-drag untuk reorder

---

## F-20 | ADMIN MANAJEMEN PENGUMUMAN

**Route:** `/admin/pengumuman`
**Auth:** Admin
**Priority:** P1

**Halaman List:**
- Tabel: Judul, Target, Dibuat, Status, Aksi
- Filter: Lomba, Tanggal
- Tombol "+ Buat Pengumuman"

**Form Pengumuman:**
```
Judul*       : text
Isi*         : rich text
Target*      : select (Semua Peserta | Per Lomba > pilih lomba)
Publish At   : datetime (jadwal publish, kosong = sekarang)
Kirim Email  : checkbox (trigger kirim email ke peserta terdampak)
```

---

# 6. USER FLOWS LENGKAP

## Flow 1: New Visitor > Daftar Lomba

```
[Buka URL oscar.id]
        |
[Landing Page loads]
   Pre-loader (1.5s)
        |
[Hero Section]
   "Daftar Sekarang" <-- user klik
        |
[/register]
   Isi form > Submit
        |
[API POST /auth/register]
   Success? --- Ya --> Redirect /login
             +-- Tidak --> Tampilkan error field
        |
[/login]
   Isi email & password > Submit
        |
[API POST /auth/login]
   Success? --- Ya --> Simpan token > Redirect /dashboard
             +-- Tidak --> "Email/password salah"
        |
[/dashboard]
   Klik "Daftar Lomba"
        |
[/daftar]
   Pilih Kategori > Pilih Lomba > Klik "Pilih"
        |
[/daftar/:lombaId — Step 2]
   Isi form data peserta > Next
        |
[Step 3: Upload]
   Upload bukti transfer > Upload bukti sosmed > Next
        |
[Step 4: Konfirmasi]
   Review data > Centang pernyataan > Submit
        |
[API POST /api/pendaftaran]
   Success? --- Ya --> Halaman sukses > Redirect /status
             +-- Tidak --> Tampilkan error
```

## Flow 2: Admin Verifikasi Pendaftaran

```
[/admin/dashboard]
   Lihat "Pending Verifikasi: 18"
   Klik angka / navigasi ke Pendaftaran
        |
[/admin/pendaftaran — Tab Pending]
   Klik "Lihat Detail" pada salah satu
        |
[/admin/pendaftaran/:id]
   Review data peserta
   Buka preview bukti transfer > OK
   Buka preview bukti sosmed > OK
        |
[Klik "Terima Pendaftaran"]
        |
[Konfirmasi Modal]
   "Apakah yakin menerima pendaftaran ini?"
   [Tidak] > tutup modal
   [Ya] > API PUT /api/admin/pendaftaran/:id/verifikasi
              |
         Success > Toast "Diverifikasi" > update status
                   Email otomatis dikirim ke peserta
              |
         Klik "Lanjut ke Berikutnya" > next pending item
```

## Flow 3: Peserta Cek Status (Ditolak > Revisi)

```
[Email masuk: "Pendaftaran DITOLAK"]
   Klik link di email > Buka website
        |
[/login] > Masuk akun
        |
[/status]
   Lihat card dengan badge [DITOLAK]
   Baca catatan admin:
   "Bukti transfer tidak jelas"
        |
[Klik "Revisi & Kirim Ulang"]
        |
[Form revisi — hanya step Upload]
   Upload ulang bukti transfer yang lebih jelas
   Submit
        |
[API PUT /api/pendaftaran/:id/revisi]
   Success > Status kembali ke PENDING
             Toast: "Revisi berhasil dikirim"
             Redirect /status
```

## Flow 4: Pengunjung Menjelajah Roadmap

```
[Navbar > Roadmap]
        |
[/roadmap]
   Scroll timeline: OSCAR 1.0 > 2.0 > 3.0
   Hover node OSCAR 1.0 > muncul preview card
   Klik card OSCAR 1.0 "Lihat Dokumentasi"
        |
[/roadmap/oscar-1]
   Baca cerita acara
   Lihat gallery > klik foto > lightbox
   Scroll ke bawah > Lihat pemenang
   Lihat video aftermovie (klik play)
        |
   Klik "Kembali ke Roadmap" atau breadcrumb
        |
[/roadmap] > Klik card OSCAR 2.0
```

---

# 7. DESIGN SYSTEM & UI/UX

## 7.1 Design Philosophy

**Core Concept:** Cyber Rainforest — Digital ecosystem meets tropical wilderness

Terinspirasi dari Spylt GSAP Website (https://spylt-gsap-website.vercel.app) yang menggunakan:
- Scroll-triggered clip-path transitions
- Parallax depth layering
- Cinematic text reveals
- Smooth inertia scrolling

Diterapkan ke OSCAR dengan nuansa:
- Dark base (seperti hutan malam) dengan neon accent (seperti bioluminesensi)
- Tipografi bold dan assertive mencerminkan level kompetisi
- Animasi purposeful, tidak decorative semata

## 7.2 Color System

```css
/* ===== BRAND COLORS ===== */
--oscar-primary:     #00F5C3;    /* Teal Neon — CTA, highlight */
--oscar-secondary:   #0A3D3C;    /* Emerald Dark — section bg */
--oscar-accent:      #39FF14;    /* Neon Green — status aktif */
--oscar-bg:          #050505;    /* Deep Black — base bg */
--oscar-bg-card:     #0D1F1E;    /* Card surface */
--oscar-bg-elevated: #122B2A;    /* Elevated surface (modal, dropdown) */
--oscar-border:      #1C4A48;    /* Subtle border */
--oscar-border-glow: rgba(0, 245, 195, 0.3);

/* ===== TEXT ===== */
--oscar-text-primary:   #FFFFFF;
--oscar-text-secondary: #8BBDBB;
--oscar-text-dim:       #4D7574;
--oscar-text-accent:    #00F5C3;

/* ===== STATUS ===== */
--oscar-success:        #39FF14;
--oscar-warning:        #FFD740;
--oscar-error:          #FF4444;
--oscar-info:           #00B4D8;

/* ===== GLOW EFFECTS ===== */
--glow-sm:  0 0 10px rgba(0, 245, 195, 0.2);
--glow-md:  0 0 20px rgba(0, 245, 195, 0.35);
--glow-lg:  0 0 40px rgba(0, 245, 195, 0.5);
```

## 7.3 Typography System

```css
/* ===== FONT FAMILIES ===== */
--font-display: 'Chakra Petch', 'Rajdhani', sans-serif;
--font-body:    'Plus Jakarta Sans', 'DM Sans', sans-serif;
--font-mono:    'JetBrains Mono', 'Fira Code', monospace;

/* ===== TYPE SCALE (fluid) ===== */
--text-hero:    clamp(3.5rem, 9vw, 8rem);
--text-display: clamp(2.25rem, 5vw, 4.5rem);
--text-h1:      clamp(1.875rem, 4vw, 3rem);
--text-h2:      clamp(1.5rem, 3vw, 2.25rem);
--text-h3:      clamp(1.25rem, 2.5vw, 1.75rem);
--text-lg:      1.125rem;
--text-base:    1rem;
--text-sm:      0.875rem;
--text-xs:      0.75rem;
```

## 7.4 Spacing & Layout System

```css
/* ===== SPACING SCALE ===== */
--space-1:  0.25rem;   /* 4px */
--space-2:  0.5rem;    /* 8px */
--space-4:  1rem;      /* 16px */
--space-6:  1.5rem;    /* 24px */
--space-8:  2rem;      /* 32px */
--space-12: 3rem;      /* 48px */
--space-16: 4rem;      /* 64px */
--space-20: 5rem;      /* 80px */
--space-24: 6rem;      /* 96px */

/* ===== CONTAINER ===== */
--container-max:   1400px;
--container-xl:    1280px;
--container-pad-x: clamp(1.5rem, 5vw, 5rem);

/* ===== BORDER RADIUS ===== */
--radius-sm:   4px;
--radius-md:   8px;
--radius-lg:   16px;
--radius-xl:   24px;
--radius-full: 9999px;
```

## 7.5 Component Specifications

### BUTTON
```
Variants:
  primary   — bg: --oscar-primary, text: #050505, hover: glow-md
  secondary — border: --oscar-primary, text: --oscar-primary, hover: bg-primary/10
  ghost     — transparent, text: --oscar-text-secondary, hover: bg-elevated
  danger    — bg: --oscar-error, text: white

Sizes:
  sm — h: 32px, px: 12px, font: 13px
  md — h: 44px, px: 20px, font: 14px (default)
  lg — h: 52px, px: 28px, font: 16px
  xl — h: 60px, px: 36px, font: 18px

States:
  loading  — opacity: 0.7, spinner icon kiri
  disabled — opacity: 0.5, pointer-events: none
  active   — scale: 0.98
```

### BADGE / STATUS
```
Variants:
  pending   — bg: rgba(255,215,64,0.15), text: #FFD740
  verified  — bg: rgba(57,255,20,0.15),  text: #39FF14
  rejected  — bg: rgba(255,68,68,0.15),  text: #FF4444
  open      — bg: rgba(0,245,195,0.15),  text: #00F5C3, + pulse dot
  closed    — bg: rgba(255,255,255,0.08), text: #8BBDBB
  soon      — bg: rgba(0,180,216,0.15),  text: #00B4D8
```

### INPUT / FORM ELEMENTS
```
Text Input:
  height: 48px
  padding: 0 16px
  background: rgba(255,255,255,0.05)
  border: 1px solid --oscar-border
  :focus -> border-color: --oscar-primary, box-shadow: 0 0 0 3px rgba(0,245,195,0.1)
  :error -> border-color: --oscar-error
```

### MODAL
```
Overlay: background rgba(5,5,5,0.85), backdrop-filter: blur(4px)
Container:
  background: --oscar-bg-elevated
  border: 1px solid --oscar-border
  border-radius: --radius-xl
  max-width: 520px
  padding: 2rem

Animation enter: opacity 0>1 + scale 0.95>1 (200ms ease-out)
Close: ESC key, klik overlay, tombol X
Focus trap: Tab/Shift+Tab dalam modal saja
```

### NAVBAR
```
Height: 72px (desktop), 60px (mobile)
Background: rgba(5,5,5,0) > rgba(5,5,5,0.9) + backdrop-filter: blur(20px)
  [Transisi setelah scroll 50px]
Mobile:
  Logo + Hamburger icon
  Fullscreen overlay menu, z-index 9999
  Nav links vertikal, font 24px, stagger animation
```

---

# 8. ANIMATION SPECIFICATIONS

## 8.1 Library & Setup

```javascript
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
})

lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((time) => lenis.raf(time * 1000))
gsap.ticker.lagSmoothing(0)
```

## 8.2 Reduced Motion

```javascript
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

function animateIn(el, props) {
  if (prefersReduced) {
    gsap.set(el, { opacity: 1 })
    return
  }
  gsap.from(el, { opacity: 0, y: 40, duration: 0.8, ...props })
}
```

## 8.3 Global Animations

### Pre-loader
```javascript
gsap.timeline()
  .from('.logo-path', { strokeDashoffset: 500, duration: 1.2, ease: 'power2.out' })
  .to('.preloader', { opacity: 0, duration: 0.5, pointerEvents: 'none' })
  .set('.preloader', { display: 'none' })
```

### Hero Section
```javascript
const heroAnimation = gsap.timeline({ delay: 0.2 })
heroAnimation
  .from('.hero-eyebrow', { opacity: 0, y: 20, duration: 0.6 })
  .from('.hero-title', {
    clipPath: 'inset(100% 0 0 0)',
    y: 60,
    duration: 0.9,
    ease: 'power3.out'
  }, '-=0.3')
  .from('.hero-subtitle', { opacity: 0, x: -20, duration: 0.6 }, '-=0.4')
  .from('.hero-desc', { opacity: 0, duration: 0.5 }, '-=0.3')
  .from('.hero-cta > *', { opacity: 0, y: 20, stagger: 0.1, duration: 0.5 }, '-=0.3')
  .from('.hero-stats > *', { opacity: 0, y: 10, stagger: 0.08, duration: 0.4 }, '-=0.2')
```

### Section Reveal (ScrollTrigger)
```javascript
function revealSection(selector) {
  gsap.utils.toArray(selector).forEach(el => {
    gsap.from(el, {
      opacity: 0,
      y: 60,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    })
  })
}
```

### Counter Number
```javascript
function animateCounter(el, target, duration = 2) {
  const obj = { val: 0 }
  gsap.to(obj, {
    val: target,
    duration,
    ease: 'power2.out',
    onUpdate: () => {
      el.textContent = Math.round(obj.val).toLocaleString()
    },
    scrollTrigger: {
      trigger: el,
      start: 'top 90%',
      once: true
    }
  })
}
```

## 8.4 Micro-interactions

```
Button hover      -> transform: translateY(-2px) + glow shadow, 0.2s ease
Card hover        -> border-color + box-shadow transition, 0.25s ease
Nav link hover    -> color transition + underline width 0>100%, 0.2s ease
Input focus       -> border glow + subtle scale background, 0.2s ease
Badge pulse       -> keyframe: scale 1>1.3>1, opacity 1>0, 2s infinite
Modal open        -> backdrop fade + container scale 0.95>1, 0.2s ease-out
File upload hover -> border-color primary, dashed > solid, 0.2s
```

---

# 9. ROUTING & NAVIGATION

## 9.1 React Router v6 Setup

```jsx
// src/router/index.jsx
const router = createBrowserRouter([
  // PUBLIC
  { path: '/', element: <RootLayout />, children: [
    { index: true, element: <LandingPage /> },
    { path: 'lomba', element: <LombaPage /> },
    { path: 'lomba/:slug', element: <LombaDetailPage /> },
    { path: 'roadmap', element: <RoadmapPage /> },
    { path: 'roadmap/:season', element: <SeasonDetailPage /> },
    { path: 'tentang', element: <TentangPage /> },
    { path: 'kontak', element: <KontakPage /> },
  ]},

  // AUTH
  { path: '/register', element: <AuthLayout />, children: [{ index: true, element: <RegisterPage /> }] },
  { path: '/login',    element: <AuthLayout />, children: [{ index: true, element: <LoginPage /> }] },
  { path: '/lupa-password', element: <AuthLayout />, children: [{ index: true, element: <ForgotPasswordPage /> }] },
  { path: '/reset-password', element: <AuthLayout />, children: [{ index: true, element: <ResetPasswordPage /> }] },

  // PESERTA (Protected)
  { path: '/dashboard', element: <ProtectedRoute role="peserta"><PesertaLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <PesertaDashboard /> },
      { path: 'daftar', element: <DaftarLombaPage /> },
      { path: 'daftar/:lombaId', element: <FormDaftarPage /> },
      { path: 'status', element: <StatusPendaftaranPage /> },
      { path: 'profil', element: <ProfilPage /> },
    ]
  },

  // ADMIN (Protected)
  { path: '/admin', element: <AdminRoute><AdminLayout /></AdminRoute>,
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: 'dashboard', element: <AdminDashboard /> },
      { path: 'lomba', element: <AdminLombaPage /> },
      { path: 'lomba/baru', element: <AdminLombaForm /> },
      { path: 'lomba/:id', element: <AdminLombaForm /> },
      { path: 'pendaftaran', element: <AdminPendaftaranPage /> },
      { path: 'pendaftaran/:id', element: <AdminPendaftaranDetail /> },
      { path: 'peserta', element: <AdminPesertaPage /> },
      { path: 'timeline', element: <AdminTimelinePage /> },
      { path: 'roadmap', element: <AdminRoadmapPage /> },
      { path: 'pengumuman', element: <AdminPengumumanPage /> },
      { path: 'laporan', element: <AdminLaporanPage /> },
    ]
  },

  { path: '*', element: <NotFoundPage /> },
])
```

## 9.2 Route Guards

```jsx
function ProtectedRoute({ children, role }) {
  const { user, isLoading } = useAuthStore()
  if (isLoading) return <FullscreenLoader />
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />
  if (role && user.role !== role) {
    return user.role === 'admin'
      ? <Navigate to="/admin/dashboard" replace />
      : <Navigate to="/dashboard" replace />
  }
  return children
}
```

---

# 10. STATE MANAGEMENT ARCHITECTURE

## 10.1 Tool: Zustand

Dipilih karena bundle size kecil (< 3KB), tidak butuh Provider wrapper, TypeScript-friendly.

## 10.2 Store Structure

```javascript
// authStore.js
const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isLoading: true,
  login: async (credentials) => {
    const data = await authService.login(credentials)
    set({ user: data.user, token: data.token })
    localStorage.setItem('token', data.token)
  },
  logout: () => {
    set({ user: null, token: null })
    localStorage.removeItem('token')
  },
  checkAuth: async () => {
    const token = localStorage.getItem('token')
    if (!token) { set({ isLoading: false }); return }
    try {
      const user = await authService.me(token)
      set({ user, token, isLoading: false })
    } catch {
      set({ user: null, token: null, isLoading: false })
      localStorage.removeItem('token')
    }
  }
}))

// lombaStore.js
const useLombaStore = create((set) => ({
  lombaList: [],
  isLoading: false,
  filter: 'semua',
  fetchLomba: async () => {
    set({ isLoading: true })
    const data = await lombaService.getAll()
    set({ lombaList: data, isLoading: false })
  },
  setFilter: (filter) => set({ filter }),
}))

// pendaftaranStore.js — multi-step form state
const usePendaftaranStore = create((set) => ({
  currentStep: 1,
  selectedLomba: null,
  formData: {},
  files: { transfer: null, sosmed: null },
  setStep: (step) => set({ currentStep: step }),
  updateFormData: (data) => set(state => ({ formData: { ...state.formData, ...data } })),
  setFile: (type, file) => set(state => ({ files: { ...state.files, [type]: file } })),
  resetForm: () => set({ currentStep: 1, selectedLomba: null, formData: {}, files: {} }),
}))
```

---

# 11. API CONTRACT LENGKAP

## 11.1 Base Configuration

```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
  timeout: 15000,
})

// Request interceptor: inject token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Response interceptor: handle 401 global
api.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(error.response?.data || error)
  }
)
```

## 11.2 Response Format Standar

```json
// SUCCESS
{
  "success": true,
  "message": "Berhasil",
  "data": {},
  "meta": { "current_page": 1, "per_page": 15, "total": 234, "last_page": 16 }
}

// ERROR
{
  "success": false,
  "message": "Pesan error yang human-readable",
  "errors": {
    "email": ["Email sudah digunakan."],
    "password": ["Password minimal 8 karakter."]
  }
}
```

## 11.3 Endpoint Lengkap

### AUTH

| Method | Endpoint | Body | Response | Auth |
|--------|----------|------|---------|------|
| POST | `/auth/register` | `{nama, email, password, password_confirmation, kategori}` | `{user, token}` | No |
| POST | `/auth/login` | `{email, password, remember}` | `{user, token}` | No |
| POST | `/auth/logout` | — | `{message}` | Yes |
| GET | `/auth/me` | — | `{user}` | Yes |
| POST | `/auth/forgot-password` | `{email}` | `{message}` | No |
| POST | `/auth/reset-password` | `{token, email, password, password_confirmation}` | `{message}` | No |

### LOMBA (Public)

| Method | Endpoint | Query Params | Response |
|--------|----------|-------------|---------|
| GET | `/lomba` | `?kategori=siswa&status=buka&search=web&sort=deadline` | Array lomba |
| GET | `/lomba/:slug` | — | Single lomba |
| GET | `/lomba/:slug/faq` | — | Array FAQ |
| GET | `/timeline` | — | Array timeline |
| GET | `/roadmap` | — | Array seasons |
| GET | `/roadmap/:season` | — | Single season |
| GET | `/mitra` | — | Array mitra |

**Lomba Object:**
```json
{
  "id": 1,
  "nama": "Web Development",
  "slug": "web-development",
  "kategori": "siswa",
  "deskripsi": "<p>HTML content...</p>",
  "hadiah_1": "Rp 1.500.000 + Piala + Sertifikat",
  "hadiah_2": "Rp 1.000.000 + Sertifikat",
  "hadiah_3": "Rp 750.000 + Sertifikat",
  "deadline": "2026-06-30T23:59:59Z",
  "kuota": 50,
  "terdaftar": 23,
  "status": "buka",
  "booklet_url": "https://...",
  "banner_url": "https://..."
}
```

### PENDAFTARAN (Peserta)

| Method | Endpoint | Body | Auth |
|--------|----------|------|------|
| GET | `/pendaftaran/saya` | — | Peserta |
| GET | `/pendaftaran/saya/:id` | — | Peserta |
| POST | `/pendaftaran` | FormData | Peserta |
| PUT | `/pendaftaran/:id/revisi` | FormData (file saja) | Peserta |

### ADMIN

| Method | Endpoint | Notes | Auth |
|--------|----------|-------|------|
| GET/POST | `/admin/lomba` | List + Create | Admin |
| GET/PUT/DELETE | `/admin/lomba/:id` | Detail + Edit + Hapus | Admin |
| PATCH | `/admin/lomba/:id/status` | Toggle status | Admin |
| GET | `/admin/pendaftaran` | `?status=&lomba_id=&search=&page=` | Admin |
| GET | `/admin/pendaftaran/:id` | Detail | Admin |
| PUT | `/admin/pendaftaran/:id/verifikasi` | `{action: terima/tolak, catatan}` | Admin |
| GET | `/admin/peserta` | `?lomba_id=&search=` | Admin |
| GET | `/admin/peserta/export` | File download CSV | Admin |
| GET/POST/PUT/DELETE | `/admin/timeline` | CRUD timeline | Admin |
| PATCH | `/admin/timeline/:id/aktif` | Set stage aktif | Admin |
| GET | `/admin/statistik/overview` | Summary cards data | Admin |
| GET | `/admin/statistik/peta` | Data peta provinsi | Admin |
| GET | `/admin/statistik/pertumbuhan` | `?days=7` | Admin |

---

# 12. FORM VALIDATION RULES

## 12.1 Aturan Global

```javascript
export const rules = {
  required:       { required: 'Field ini wajib diisi' },
  email:          { pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Format email tidak valid' } },
  minLength: (n) => ({ minLength: { value: n, message: `Minimal ${n} karakter` } }),
  maxLength: (n) => ({ maxLength: { value: n, message: `Maksimal ${n} karakter` } }),
  phone:          { pattern: { value: /^(\+62|62|0)8[0-9]{8,11}$/, message: 'Format nomor WA tidak valid' } },
  youtubeUrl:     { validate: v => /youtube\.com\/watch\?v=|youtu\.be\//.test(v) || 'Harus URL YouTube yang valid' },
  fileSize: (maxMB) => ({
    validate: v => !v || v[0]?.size <= maxMB * 1024 * 1024 || `Ukuran file maksimal ${maxMB}MB`
  }),
  fileType: (types) => ({
    validate: v => !v || types.includes(v[0]?.type) || `Tipe file harus: ${types.join(', ')}`
  }),
}
```

## 12.2 Validasi Per Field

| Field | Rules | Error Message |
|-------|-------|--------------|
| Nama | required, minLength(3), maxLength(100) | "Nama minimal 3 karakter" |
| Email (register) | required, email, unique (API onBlur) | "Email sudah terdaftar" |
| Password | required, minLength(8), hasNumber | "Password minimal 8 karakter dan mengandung angka" |
| Konfirmasi Pass | required, matches(password) | "Password tidak sama" |
| No WhatsApp | required, phone | "Format: 08xx atau +628xx (min 10 digit)" |
| Asal Sekolah | required, minLength(3), maxLength(100) | — |
| Bukti Transfer | required, fileSize(2), fileType(['jpg','jpeg','png','pdf']) | "File max 2MB, format JPG/PNG/PDF" |
| Bukti Sosmed | required, fileSize(2), fileType(['jpg','jpeg','png']) | "File max 2MB, format JPG/PNG" |
| Deadline (admin) | required, futureDate | "Tanggal harus di masa depan" |
| Link YouTube | required, youtubeUrl | "URL harus dari YouTube" |

---

# 13. ERROR HANDLING & EDGE CASES

## 13.1 HTTP Error Handling Matrix

| Status Code | Skenario | UI Response |
|------------|----------|-------------|
| 400 | Request malformed | Toast "Request tidak valid" |
| 401 | Token expired/invalid | Redirect ke /login + Toast "Sesi berakhir" |
| 403 | Akses tidak diizinkan | Toast "Anda tidak memiliki akses" + redirect |
| 404 | Resource tidak ditemukan | Halaman 404 custom / Toast |
| 409 | Conflict (sudah daftar) | Toast "Anda sudah mendaftar lomba ini" |
| 413 | File terlalu besar | Toast "Ukuran file melebihi batas. Max 2MB." |
| 422 | Validasi gagal | Tampilkan error per field (inline) |
| 429 | Rate limit | Toast "Terlalu banyak percobaan. Coba lagi dalam X menit." |
| 500 | Server error | Toast "Terjadi kesalahan server. Coba lagi nanti." |
| Network | Tidak ada koneksi | Toast "Tidak ada koneksi internet." |
| Timeout | Request timeout | Toast "Koneksi lambat. Coba lagi." |

## 13.2 Edge Cases Per Fitur

**Pendaftaran:**
- User coba daftar lomba yang sudah penuh (kuota habis) > tombol disabled, tooltip "Kuota penuh"
- User coba daftar setelah deadline > redirect ke detail lomba dengan info deadline terlewat
- File upload gagal (network error) > toast error + tombol retry per file
- User close tab saat upload berjalan > peringatan (beforeunload)
- Double klik tombol submit > tombol disabled setelah klik pertama

**Auth:**
- Token expired saat user isi form panjang > simpan form ke sessionStorage, redirect login, kembali setelah login
- Browser autocomplete isi email salah > validasi tetap berjalan onBlur

**Admin:**
- Admin hapus lomba yang ada pesertanya > warning modal "Ada X peserta terdaftar"
- Admin ubah status lomba ke "Tutup" > konfirmasi modal

## 13.3 Halaman Error Custom

**404 Not Found:**
- Visual: ilustrasi hutan digital dengan "404" besar
- Pesan: "Halaman yang kamu cari sudah berpindah ke dimensi lain..."
- CTA: Kembali ke Beranda | Lihat Lomba

**500 Server Error:**
- Pesan: "Sistem sedang dalam maintenance. Coba lagi dalam beberapa saat."
- CTA: Refresh Halaman | Hubungi Humas

**403 Forbidden:**
- Pesan: "Akses tidak diizinkan. Kamu perlu role yang sesuai."
- CTA: Kembali | Logout & Login Ulang

---

# 14. PERFORMANCE BUDGET

## 14.1 Target Metrics

| Metric | Target |
|--------|--------|
| Lighthouse Performance | > 85 |
| Lighthouse Accessibility | > 90 |
| Lighthouse SEO | > 90 |
| LCP | < 2.5s |
| CLS | < 0.1 |
| INP | < 200ms |
| FCP | < 1.5s |
| TTI | < 3.5s |
| Total JS bundle (gzip) | < 300KB |
| Initial page load | < 2s (3G fast) |

## 14.2 Strategi Optimasi

**Code Splitting:**
```javascript
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'))
const FormDaftar = lazy(() => import('./pages/peserta/FormDaftar'))
// Setiap route admin di-split terpisah
```

**Image Optimization:**
- Format: WebP dengan fallback JPG
- Lazy loading: `loading="lazy"` pada semua img non-hero
- Responsive images: `srcset` + `sizes`
- Hero image: `loading="eager"`, preload via `<link rel="preload">`

**GSAP:**
- Import hanya plugin yang dipakai
- Kill ScrollTrigger instances saat komponen unmount
- Debounce resize handler

**API:**
- Cache response lomba (5 menit)
- Prefetch halaman detail lomba saat hover card
- Pagination untuk list peserta admin

---

# 15. AKSESIBILITAS (A11y)

## 15.1 Standar: WCAG 2.1 Level AA

## 15.2 Implementasi

**Warna & Contrast:**
- Text putih (#FFFFFF) di atas bg #050505 > Contrast ratio: 21:1
- Text teal (#00F5C3) di atas bg #050505 > Contrast ratio: 9.8:1

**Keyboard Navigation:**
- Semua interactive element reachable via Tab
- Focus indicator visible (ring 3px dengan offset, warna primary)
- Skip-to-content link sebagai elemen pertama
- Modal: focus trap + return focus ke trigger saat ditutup
- Dropdown: Arrow keys navigasi, ESC close

**Screen Reader:**
- Semua img memiliki alt yang deskriptif (kosong jika dekoratif)
- Ikon dekoratif: `aria-hidden="true"`
- Loading state: `aria-live="polite"`
- Form: setiap input memiliki label atau aria-label
- Error message: `role="alert"` + dihubungkan ke input via `aria-describedby`
- Status badge: `aria-label="Status: Pending"` (tidak hanya warna)
- Accordion: `aria-expanded`, `aria-controls`
- Modal: `role="dialog"`, `aria-labelledby`, `aria-modal="true"`

**GSAP & Animasi:**
```javascript
const mm = gsap.matchMedia()
mm.add('(prefers-reduced-motion: no-preference)', () => {
  // animasi normal
})
mm.add('(prefers-reduced-motion: reduce)', () => {
  // instant atau tidak ada animasi
})
```

**HTML Semantic:**
- `<main>`, `<nav>`, `<header>`, `<footer>`, `<section>`, `<article>`
- Heading hierarchy: satu `<h1>` per halaman, tidak skip level
- Tabel data menggunakan `<th scope="col/row">`

---

# 16. SEO STRATEGY

## 16.1 Meta Tags Per Halaman

```jsx
function SEO({ title, description, image, url }) {
  return (
    <Helmet>
      <title>{title ? `${title} | OSCAR 3.0` : 'OSCAR 3.0 — Season Rainforest'}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image || '/og-image.jpg'} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <link rel="canonical" href={url} />
    </Helmet>
  )
}
```

## 16.2 Target Keyword Per Halaman

| Halaman | Primary Keyword |
|---------|----------------|
| Landing | "OSCAR 3.0", "lomba IT SMA SMK 2026" |
| Lomba | "kompetisi web development pelajar", "lomba desain poster SMA" |
| Detail Lomba | "[nama lomba] OSCAR 3.0" |
| Roadmap | "OSCAR season history", "dokumentasi lomba IT" |
| Tentang | "apa itu OSCAR competition" |

## 16.3 Structured Data (JSON-LD)

```javascript
// Event schema untuk lomba
const eventSchema = {
  "@context": "https://schema.org",
  "@type": "Event",
  "name": lomba.nama,
  "description": lomba.deskripsi_plain,
  "startDate": lomba.created_at,
  "endDate": lomba.deadline,
  "organizer": { "@type": "Organization", "name": "OSCAR 3.0" }
}

// Breadcrumb schema
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Beranda", "item": "https://oscar.id/" },
    { "@type": "ListItem", "position": 2, "name": "Lomba", "item": "https://oscar.id/lomba" },
    { "@type": "ListItem", "position": 3, "name": lomba.nama }
  ]
}
```

---

# 17. TESTING PLAN

## 17.1 Unit Testing (Vitest + React Testing Library)

**Yang di-test:**
- Utility functions (validators, formatters, date helpers)
- Zustand stores (login, logout, form state)
- Komponen UI isolasi (Button, Badge, Input, Modal)
- Custom hooks (useAuth, useFormDraft)

**Target coverage:** > 70% untuk utilities dan stores

## 17.2 Integration Testing

**Flow yang di-test:**
- Register > Login > Redirect ke dashboard
- Form pendaftaran multi-step: isi data > upload > submit
- Filter lomba mengupdate URL dan card
- Admin verifikasi: terima/tolak > update status

## 17.3 Manual Testing Checklist

**Pre-launch checklist:**
- [ ] Semua halaman di mobile (375px) tidak ada overflow horizontal
- [ ] Semua link tidak broken (404)
- [ ] Form submit tidak bisa double-submit
- [ ] Download booklet berfungsi
- [ ] WA link buka aplikasi WA dengan pesan pre-filled
- [ ] Countdown timer akurat untuk timezone WIB
- [ ] Gallery lightbox: open, close ESC, swipe, keyboard
- [ ] Admin export CSV bisa dibuka di Excel dengan encoding benar
- [ ] Animasi GSAP tidak lag di laptop mid-range
- [ ] Prefers-reduced-motion: animasi tidak berjalan

## 17.4 Cross-browser Testing

| Browser | Target |
|---------|--------|
| Chrome 2 versi terakhir | Full support |
| Firefox 2 versi terakhir | Full support |
| Safari 2 versi terakhir | Full support (termasuk iOS Safari) |
| Edge 2 versi terakhir | Full support |
| Samsung Internet Latest | Best effort |

---

# 18. STRUKTUR FOLDER & ARSITEKTUR FRONTEND

```
laravel-oscar/
+-- app/
+-- routes/api.php
+-- resources/
    +-- react/
        +-- public/
        |   +-- favicon.ico
        |   +-- og-image.jpg
        |   +-- robots.txt
        +-- src/
            +-- assets/
            |   +-- images/
            |   +-- svgs/
            |
            +-- components/
            |   +-- ui/                    <- Atomic components
            |   |   +-- Button/
            |   |   +-- Badge/
            |   |   +-- Card/
            |   |   +-- Input/
            |   |   +-- Select/
            |   |   +-- Textarea/
            |   |   +-- Checkbox/
            |   |   +-- Modal/
            |   |   +-- Toast/
            |   |   +-- Skeleton/
            |   |   +-- Spinner/
            |   |   +-- Accordion/
            |   |   +-- Tabs/
            |   |   +-- FileUpload/
            |   |   +-- RichTextEditor/
            |   |   +-- CountdownTimer/
            |   |
            |   +-- layout/
            |   |   +-- Navbar/
            |   |   +-- Footer/
            |   |   +-- AdminSidebar/
            |   |   +-- PesertaSidebar/
            |   |   +-- RootLayout.jsx
            |   |   +-- AuthLayout.jsx
            |   |   +-- PesertaLayout.jsx
            |   |   +-- AdminLayout.jsx
            |   |
            |   +-- sections/             <- Page sections (one-off)
            |   |   +-- HeroSection.jsx
            |   |   +-- KategoriSection.jsx
            |   |   +-- MitraMarquee.jsx
            |   |   +-- ArenaLombaSection.jsx
            |   |   +-- TimelineSection.jsx
            |   |   +-- RoadmapTimeline.jsx
            |   |   +-- StatistikSection.jsx
            |   |
            |   +-- shared/               <- Reusable cross-page components
            |       +-- SEO.jsx
            |       +-- LombaCard.jsx
            |       +-- StatusBadge.jsx
            |       +-- FilterBar.jsx
            |       +-- SearchBar.jsx
            |       +-- PaginationBar.jsx
            |       +-- EmptyState.jsx
            |       +-- ErrorBoundary.jsx
            |       +-- ImageGallery.jsx
            |       +-- Preloader.jsx
            |       +-- MapIndonesia.jsx
            |
            +-- pages/
            |   +-- public/
            |   |   +-- LandingPage.jsx
            |   |   +-- LombaPage.jsx
            |   |   +-- LombaDetailPage.jsx
            |   |   +-- RoadmapPage.jsx
            |   |   +-- SeasonDetailPage.jsx
            |   |   +-- TentangPage.jsx
            |   |   +-- KontakPage.jsx
            |   |
            |   +-- auth/
            |   |   +-- RegisterPage.jsx
            |   |   +-- LoginPage.jsx
            |   |   +-- ForgotPasswordPage.jsx
            |   |   +-- ResetPasswordPage.jsx
            |   |
            |   +-- peserta/
            |   |   +-- DashboardPage.jsx
            |   |   +-- DaftarLombaPage.jsx
            |   |   +-- FormDaftarPage.jsx
            |   |   +-- StatusPendaftaranPage.jsx
            |   |   +-- ProfilPage.jsx
            |   |
            |   +-- admin/
            |   |   +-- DashboardPage.jsx
            |   |   +-- LombaPage.jsx
            |   |   +-- LombaFormPage.jsx
            |   |   +-- PendaftaranPage.jsx
            |   |   +-- PendaftaranDetailPage.jsx
            |   |   +-- PesertaPage.jsx
            |   |   +-- TimelinePage.jsx
            |   |   +-- RoadmapPage.jsx
            |   |   +-- PengumumanPage.jsx
            |   |   +-- LaporanPage.jsx
            |   |
            |   +-- errors/
            |       +-- NotFoundPage.jsx
            |       +-- ForbiddenPage.jsx
            |       +-- ServerErrorPage.jsx
            |
            +-- hooks/
            |   +-- useAuth.js
            |   +-- useApi.js
            |   +-- useFormDraft.js
            |   +-- useScrollAnimation.js
            |   +-- useCountdown.js
            |   +-- useDebounce.js
            |   +-- useMediaQuery.js
            |
            +-- stores/
            |   +-- authStore.js
            |   +-- lombaStore.js
            |   +-- pendaftaranStore.js
            |   +-- notifStore.js
            |
            +-- services/
            |   +-- api.js
            |   +-- authService.js
            |   +-- lombaService.js
            |   +-- roadmapService.js
            |   +-- pesertaService.js
            |   +-- pendaftaranService.js
            |   +-- adminService.js
            |
            +-- utils/
            |   +-- validators.js
            |   +-- formatters.js
            |   +-- constants.js
            |   +-- sanitize.js
            |   +-- csvExport.js
            |
            +-- animations/
            |   +-- gsapConfig.js
            |   +-- heroAnimations.js
            |   +-- scrollAnimations.js
            |   +-- preloader.js
            |
            +-- styles/
            |   +-- globals.css
            |   +-- typography.css
            |   +-- animations.css
            |   +-- utilities.css
            |
            +-- router/
            |   +-- index.jsx
            |   +-- ProtectedRoute.jsx
            |   +-- AdminRoute.jsx
            |
            +-- App.jsx
            +-- main.jsx
```

## 18.2 Vite Config

```javascript
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') }
  },
  server: {
    proxy: {
      '/api': { target: 'http://localhost:8000', changeOrigin: true }
    }
  },
  build: {
    outDir: '../../public/app',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          gsap: ['gsap', 'lenis'],
          charts: ['recharts'],
        }
      }
    }
  }
})
```

---

# 19. SCOPE MATRIX & PRIORITAS

## 19.1 Priority Tiers

| Tier | Label | Definisi |
|------|-------|---------|
| P0 | Must Have | MVP tidak bisa launch tanpa ini |
| P1 | Should Have | Penting untuk UX yang baik, bisa di-iterate setelah launch |
| P2 | Nice to Have | Tambahan nilai, bisa dikerjakan di sprint berikutnya |
| P3 | Won't Have | Di luar scope project ini |

## 19.2 Full Feature Priority Table

| # | Fitur | Priority | Est. Hari |
|---|-------|----------|-----------|
| 1 | Design System & Komponen UI | P0 | 4 |
| 2 | Layout (Navbar, Footer, Layouts) | P0 | 2 |
| 3 | Landing Page — Hero Section | P0 | 3 |
| 4 | Landing Page — Arena Lomba + Filter | P0 | 2 |
| 5 | Landing Page — Timeline | P0 | 1 |
| 6 | Landing Page — Mitra Marquee | P0 | 1 |
| 7 | Landing Page — Kategori Section | P0 | 1 |
| 8 | Halaman Daftar Lomba (/lomba) | P0 | 1 |
| 9 | Halaman Detail Lomba | P0 | 2 |
| 10 | Halaman Roadmap | P0 | 2 |
| 11 | Halaman Dokumentasi Season | P0 | 2 |
| 12 | Halaman Tentang OSCAR | P0 | 1 |
| 13 | Halaman Kontak | P0 | 1 |
| 14 | Halaman Register | P0 | 1 |
| 15 | Halaman Login | P0 | 1 |
| 16 | Route Guard (Auth Protection) | P0 | 1 |
| 17 | Dashboard Peserta | P0 | 2 |
| 18 | Form Pendaftaran Multi-step | P0 | 4 |
| 19 | Halaman Status Pendaftaran | P0 | 2 |
| 20 | Admin Dashboard Overview | P0 | 2 |
| 21 | Admin Manajemen Lomba (CRUD) | P0 | 3 |
| 22 | Admin Verifikasi Pendaftaran | P0 | 3 |
| 23 | GSAP Animations — Hero & Scroll | P0 | 3 |
| 24 | Responsif Mobile — semua halaman | P0 | 3 |
| 25 | Error boundaries & loading states | P0 | 1 |
| **Total P0** | | | **~44 hari** |
| 26 | Lupa/Reset Password | P1 | 1 |
| 27 | Admin Manajemen Peserta + Export | P1 | 2 |
| 28 | Admin Manajemen Timeline | P1 | 1 |
| 29 | Admin Manajemen Roadmap | P1 | 2 |
| 30 | Admin Manajemen Pengumuman | P1 | 2 |
| 31 | SEO meta tags per halaman | P1 | 1 |
| 32 | Halaman 404, 403, 500 custom | P1 | 1 |
| 33 | Peta Persebaran Peserta (Tentang) | P1 | 2 |
| **Total P1** | | | **~12 hari** |
| 34 | Admin Laporan & Statistik (charts) | P2 | 2 |
| 35 | Profil Peserta (edit nama, ganti pass) | P2 | 1 |
| 36 | Notifikasi polling realtime | P2 | 1 |
| 37 | 3D Tilt effect pada Season Cards | P2 | 0.5 |
| 38 | Animated Indonesia Map (SVG) | P2 | 2 |
| **Total P2** | | | **~9 hari** |
| 39 | Form Builder dinamis untuk admin | P3 | — |
| 40 | Dark/Light mode toggle | P3 | — |
| 41 | Multilingual (EN/ID) | P3 | — |
| 42 | PWA / Offline support | P3 | — |

---

# 20. TIMELINE & MILESTONES

## 20.1 Sprint Plan

```
SPRINT 0 (Hari 1-3): Setup & Foundation
-----------------------------------------
- Init project Vite + React + Tailwind di dalam Laravel
- Setup alias path, env variables
- Pasang semua dependencies
- Setup GSAP + Lenis
- Setup Zustand stores (skeleton)
- Setup Axios + interceptors
- Setup React Router v6 + route guards
- Commit struktur folder awal

SPRINT 1 (Hari 4-8): Design System
-----------------------------------------
- CSS variables (warna, tipografi, spacing)
- Komponen: Button, Badge, Input, Textarea, Select
- Komponen: Card, Modal, Skeleton, Spinner
- Komponen: Accordion, Tabs, FileUpload
- Navbar (desktop + mobile menu)
- Footer
- Layout wrappers (Root, Auth, Peserta, Admin)

SPRINT 2 (Hari 9-15): Public Pages
-----------------------------------------
- Landing Page (Hero, Kategori, Mitra, Arena Lomba, Timeline)
- GSAP Hero animation
- Scroll reveal untuk semua section
- Halaman Daftar Lomba (/lomba) + filter
- Halaman Detail Lomba (dengan countdown timer)
- Halaman Roadmap + Dokumentasi Season
- Halaman Tentang OSCAR
- Halaman Kontak

SPRINT 3 (Hari 16-19): Auth Pages
-----------------------------------------
- Halaman Register + validasi + API
- Halaman Login + validasi + API
- Route guards & redirect logic
- Auth store (checkAuth on app mount)
- Lupa Password & Reset Password

SPRINT 4 (Hari 20-25): Peserta Dashboard
-----------------------------------------
- Dashboard Peserta (layout, widgets, API)
- Pilih Kategori & Lomba (Step 1)
- Form Pendaftaran multi-step per lomba (Step 2-4)
- File upload dengan preview
- Draft auto-save
- Halaman Status Pendaftaran
- Revisi pendaftaran yang ditolak

SPRINT 5 (Hari 26-33): Admin Dashboard
-----------------------------------------
- Admin Layout + Sidebar
- Dashboard Overview (charts, summary cards)
- Manajemen Lomba (list + form CRUD)
- Verifikasi Pendaftaran (list + detail + aksi)
- Manajemen Peserta (tab per lomba + export)
- Manajemen Timeline
- Manajemen Roadmap/Dokumentasi
- Manajemen Pengumuman

SPRINT 6 (Hari 34-38): API Integration
-----------------------------------------
- Integrasi semua endpoint yang belum (ada mock data sebelumnya)
- Error handling global
- Loading states semua halaman
- Toast notifications
- Halaman 404, 403, 500

SPRINT 7 (Hari 39-43): Polish & QA
-----------------------------------------
- Mobile responsif — audit dan fix semua halaman
- GSAP animation fine-tuning & performance
- Cross-browser testing
- Lighthouse audit & optimasi
- SEO meta tags
- Prefers-reduced-motion fix
- Bug fixing dari internal testing

SPRINT 8 (Hari 44-46): Staging & Handover
-----------------------------------------
- Deploy ke staging
- UAT bersama tim OSCAR
- Fix bug dari UAT
- Dokumentasi komponen
- Handover ke tim
```

## 20.2 Milestones

| Milestone | Tanggal Target | Deliverable |
|-----------|---------------|-------------|
| M1: Project Setup | Hari 3 | Folder structure, semua deps terpasang, bisa run dev |
| M2: Design System | Hari 8 | Semua komponen UI bisa dipakai |
| M3: Public Pages | Hari 15 | Semua halaman publik live dengan animasi |
| M4: Auth + Peserta | Hari 25 | End-to-end: register > daftar lomba > lihat status |
| M5: Admin | Hari 33 | Admin bisa verifikasi pendaftaran, kelola lomba |
| M6: Full Integration | Hari 38 | API terhubung semua, error handling proper |
| M7: Production Ready | Hari 46 | Lighthouse >85, mobile OK, deployed to staging |

---

# 21. RISIKO & MITIGASI

## 21.1 Technical Risks

| Risiko | Probabilitas | Dampak | Mitigasi |
|--------|-------------|--------|---------|
| API backend terlambat | Tinggi | Tinggi | Buat mock API dengan MSW (Mock Service Worker) sejak awal |
| GSAP conflict dengan React re-render | Sedang | Sedang | Gunakan useRef untuk target GSAP, useEffect cleanup dengan gsap.context() |
| Performa animasi buruk di HP mid-low | Sedang | Tinggi | Deteksi device via navigator.hardwareConcurrency, kurangi animasi jika CPU rendah |
| File upload besar / slow network | Sedang | Sedang | Client-side compress gambar sebelum upload, progress bar, retry |
| Layout break di Safari | Sedang | Tinggi | Test Safari sejak sprint 1, hindari flexbox gap |
| Lenis conflict dengan native scroll | Rendah | Sedang | Lock scroll event propagation, test di semua device |
| Token auth tidak sinkron antar tab | Sedang | Sedang | BroadcastChannel API untuk sync logout antar tab |

## 21.2 Project Risks

| Risiko | Mitigasi |
|--------|---------|
| Design assets (maskot, logo) terlambat | Gunakan placeholder SVG dengan dimensi yang sama |
| Konten teks belum siap | Gunakan Lorem Ipsum terstruktur, buat admin CMS mudah digunakan |
| Scope creep dari stakeholder | Lock scope di dokumen ini, perubahan melalui change request formal |
| Perubahan design di tengah development | Freeze design pada sprint 1, perubahan minor masuk sprint polish |
| Developer sakit / tidak available | Dokumentasi kode dari awal, pola konsisten sehingga bisa di-pickup |

---

# 22. GLOSSARY

| Term | Definisi |
|------|---------|
| OSCAR | Open Source Competition & Annual Race — nama event kompetisi |
| Season | Iterasi tahunan OSCAR (1.0, 2.0, 3.0) |
| Cabang Lomba | Jenis kompetisi dalam satu season (Web Dev, Poster, dll.) |
| Peserta | User yang mendaftar untuk mengikuti lomba |
| Pendamping | Guru yang mendampingi tim siswa SMA/SMK |
| Booklet | Dokumen PDF berisi panduan lengkap lomba |
| Verifikasi | Proses admin mengecek data dan berkas pendaftaran |
| CTF | Capture The Flag — jenis lomba cybersecurity untuk mahasiswa |
| SMA/SMK | Sekolah Menengah Atas / Kejuruan (setara, grade 10-12) |
| PRD | Product Requirements Document — dokumen ini |
| MVP | Minimum Viable Product — versi minimal yang bisa diluncurkan |
| GSAP | GreenSock Animation Platform — library animasi JavaScript |
| Lenis | Library smooth scrolling |
| Zustand | State management library untuk React |
| SPA | Single Page Application — arsitektur React yang digunakan |
| CRUD | Create, Read, Update, Delete — operasi data dasar |
| CTA | Call-to-Action — tombol utama yang mendorong aksi user |
| A11y | Accessibility (aksesibilitas) |
| WCAG | Web Content Accessibility Guidelines |
| LCP | Largest Contentful Paint — metrik performa Core Web Vitals |
| CLS | Cumulative Layout Shift — metrik performa Core Web Vitals |
| JWT | JSON Web Token — format token autentikasi |

---

*Dokumen ini adalah spesifikasi teknis dan produk yang mengikat untuk tim frontend OSCAR 3.0.*
*Setiap perubahan scope harus melalui persetujuan stakeholder dan direvisi di dokumen ini.*

**Referensi:**
- Design Inspiration: https://spylt-gsap-website.vercel.app
- GSAP Docs: https://gsap.com/docs
- Lenis: https://lenis.darkroom.engineering
- React Router v6: https://reactrouter.com/en/main
- Zustand: https://zustand-demo.pmnd.rs

**Versi Laravel:** 11.x | **Versi React:** 18.x | **Versi Node:** 20.x LTS | **Versi Vite:** 5.x
