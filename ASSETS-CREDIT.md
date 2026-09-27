# Kredit Aset — SIAGA

Daftar terpusat seluruh aset pihak ketiga dan aset buatan tim, sesuai PRD §11.
Komentar inline juga dicantumkan tepat di lokasi pemakaian di setiap file HTML/CSS.

## 1. Aset Buatan Tim (Original)

| Aset | Lokasi pakai | Keterangan |
|---|---|---|
| Logo SIAGA (`assets/images/logo.png`, perisai navy–cyan) | Navbar + footer semua halaman (`index.html`, `checkup.html`, `survival.html`, `learn.html`, `challenge.html`, `community.html`, `progress.html`) | Original asset — dibuat oleh tim SIAGA, disimpan lokal di repo. |
| Ilustrasi perisai / grid pertahanan (`...AEtjO1XusVpV...`) | Hero `index.html` (backdrop kanan) | Original asset — dibuat oleh tim SIAGA (AI-generated untuk prototipe lomba). |
| Ilustrasi shield Check-Up (`...AEtjO1VjrN...`) | Intro `checkup.html` | Original asset — dibuat oleh tim SIAGA (AI-generated untuk prototipe lomba). |

> Catatan juri: URL `lh3.googleusercontent.com/aida/...` bersifat sementara untuk prototipe.
> Versi final disarankan mengunduh dan menyimpan sebagai `assets/images/*` agar tidak bergantung URL eksternal.

## 2. Font (pihak ketiga, gratis)

| Aset | Lisensi | Sumber |
|---|---|---|
| Inter (body) — Google Fonts | SIL Open Font License 1.1 | https://fonts.google.com/specimen/Inter |
| Plus Jakarta Sans (heading) — Google Fonts | SIL Open Font License 1.1 | https://fonts.google.com/specimen/Plus+Jakarta+Sans |
| Material Symbols Outlined (ikon) — Google Fonts | Apache License 2.0 | https://fonts.google.com/icons |

## 3. Ikon & Library (pihak ketiga, gratis)

| Aset | Lisensi | Sumber |
|---|---|---|
| Lucide Icons (dipakai di `checkup.html` via `lucide-static`) | ISC License | https://lucide.dev |
| Tailwind CSS via CDN (`cdn.tailwindcss.com`) | MIT License | https://tailwindcss.com |

## 4. Struktur folder yang diharapkan (PRD §10.3)

```
SIAGA/
├── index.html / checkup.html / survival.html / learn.html
├── challenge.html / community.html / progress.html
├── assets/
│   └── images/          ← unduhan logo & ilustrasi final ditaruh di sini
├── css/style.css
├── js/app.js / data.js / storage.js / components.js
│   / checkup.js / survival.js / learn.js / challenge.js
│   / community.js / progress.js / tailwind-config.js
└── ASSETS-CREDIT.md     ← file ini
```

## 5. Aturan atribusi inline (sudah diterapkan)

- HTML: `<!-- Original asset — dibuat oleh tim SIAGA -->` tepat di atas tag `<img>`.
- Font/ikon CDN: dicantumkan di bagian `<head>` masing-masing halaman.
