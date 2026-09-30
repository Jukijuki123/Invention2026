# Kredit Aset — SIAGA

Daftar terpusat seluruh aset yang dipakai proyek (hasil inventarisasi kode). Komentar atribusi inline juga ada tepat di lokasi pemakaian di setiap file HTML. Terakhir diverifikasi: 30 Sep 2026.

## 1. Gambar lokal (`assets/images/`)

| File | Ukuran | Dipakai di | Asal & lisensi |
|---|---|---|---|
| `logo.png` | ±616 KB | Favicon, navbar + footer 6 halaman | Original asset — milik tim SIAGA |
| `siaga.svg` | ±125 KB | Section Tentang di `index.html` | Canva asset |

## 2. Font (Google Fonts, dimuat via CDN di `<head>`)

| Font | Peran | Halaman | Lisensi |
|---|---|---|---|
| Inter (400–700) | Body text | 6 halaman | SIL Open Font License 1.1 — https://fonts.google.com/specimen/Inter |
| Plus Jakarta Sans (500–800) | Heading | 6 halaman | SIL OFL 1.1 — https://fonts.google.com/specimen/Plus+Jakarta+Sans |
| Material Symbols Outlined (statis `opsz,wght,FILL,GRAD`, `display=block`) | Seluruh ikon UI | 6 halaman | Apache License 2.0 — https://fonts.google.com/icons |
| Material Symbols Outlined (variabel, `display=swap`) | Ikon tambahan | `index.html` | Apache License 2.0 |

## 3. Ikon & library (CDN)

| Aset | Dipakai di | Lisensi & sumber |
|---|---|---|
| Material Symbols (lihat tabel font) | Seluruh ikon UI | Apache 2.0 — https://fonts.google.com/icons |
| Lucide Static 0.294.0 (`cdnjs.cloudflare.com`) | `checkup.html` (`lucide.createIcons()`) | ISC License — https://lucide.dev |
| Tailwind CSS Play CDN (`cdn.tailwindcss.com`) + `js/tailwind-config.js` | 6 halaman | MIT License — https://tailwindcss.com |

## 4. Yang disengaja TIDAK memakai aset eksternal

- **Audio/suara & getar**: 100% disintesis via Web Audio API + `navigator.vibrate` (`js/components.js`) — tanpa file audio.
- **Backend/data**: tidak ada API, database, maupun auth — progres di `LocalStorage` browser.
- **Emoji**: tidak dipakai di UI (diganti ikon Material Symbols).

## 5. Struktur folder aset

```
SIAGA/ (6 halaman — survival.html dilebur ke challenge.html)
├── index.html / checkup.html / challenge.html / learn.html
├── community.html / progress.html
├── assets/images/          <- logo.png, siaga.svg (tambah ilustrasi baru di sini)
├── css/style.css
├── js/app.js / splash.js / data.js / storage.js / components.js
│   / checkup.js / learn.js / challenge.js
│   / community.js / progress.js / tailwind-config.js
└── ASSETS-CREDIT.md        <- file ini
```

