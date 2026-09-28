# SIAGA — Sistem Informasi & Gamifikasi Aman Digital

> **Tagline:** Siap. Cek. Putuskan. Bertindak Aman.
> **One-liner:** Platform interaktif yang melatih Gen Z mengambil keputusan aman melalui simulasi situasi digital nyata.

SIAGA adalah *Continuous Digital Survival Training*: pengguna berulang kali berlatih
menghadapi situasi digital nyata dengan alur
**Situasi → Keputusan → Konsekuensi → Penjelasan → Pembelajaran → Latihan berikutnya**,
mengikuti framework **STOP → THINK → CHECK → DECIDE → SHARE**.

Fokus pembelajaran (4 vektor): **Keamanan Digital**, **Informasi & Berita**,
**AI & Sintetis**, dan **Finansial**.

## Fitur & Halaman (6 halaman)

| Halaman | File | Fungsi |
|---|---|---|
| Home | `index.html` | Hero, lanskap ancaman, Tentang, cara kerja, tantangan harian, kategori, cerita komunitas, FAQ |
| Check-Up | `checkup.html` | Tes 8 situasi → skor SIAGA, breakdown 4 skill, persona taktis, rekomendasi modul |
| Tantangan | `challenge.html` | Misi harian (rotasi by-date), misi mingguan 5 skenario + reward, library skenario + filter 4 kategori |
| Learn | `learn.html` | Microlesson ±4 menit (Situation → Signals → What To Do → Quick Check → +40 XP) |
| Community | `community.html` | Story feed, story detail 4 alur, form Share Experience (+75 XP, LocalStorage) |
| My SIAGA | `progress.html` | Skor, level & XP, skill map, badges, activity log, Panduan Darurat, reset progres |

## Gamifikasi

| Aktivitas | XP |
|---|---|
| Selesaikan Check-Up | +100 |
| Selesaikan Skenario | +50 |
| Selesaikan Modul Learn | +40 |
| Selesaikan Challenge | +250 |
| Bagikan Cerita | +75 |

Level: `0–199 Digital Rookie` → `200–499 Aware User` → `500–999 Digital Defender`
→ `1000–1499 Digital Detective` → `1500–2499 Digital Guardian` → `2500+ Community Protector`.

Badge: First Decision, Scam Survivor, Fact Finder, AI Detector, Safe Trader, Digital Guardian.

## Tech Stack

HTML5 + Tailwind CSS (CDN) + JavaScript vanilla. Tanpa backend/database/auth —
progres (skor, XP, level, skill, badge, streak, cerita) disimpan di
**LocalStorage** (`siaga_*`). Font: Inter & Plus Jakarta Sans (Google Fonts, OFL).
Ikon: Material Symbols (Apache 2.0) & Lucide (ISC). Lihat `ASSETS-CREDIT.md`
untuk daftar dan atribusi aset lengkap.

## Struktur Folder

```
SIAGA/
├── index.html / checkup.html / challenge.html / learn.html
├── community.html / progress.html (6 halaman)
├── assets/images/logo.png
├── css/style.css
├── js/
│   ├── tailwind-config.js   (design tokens: warna, tipografi, spacing)
│   ├── data.js              (soal, skenario, lesson, challenge, badge, story)
│   ├── storage.js           (satu-satunya akses LocalStorage)
│   ├── components.js        (toast, modal, nav aktif, hamburger, feedback)
│   ├── app.js               (animasi & nav Home)
│   ├── splash.js            (splashscreen sekali-per-sesi, khusus index)
│   └── checkup.js / learn.js / challenge.js
│       / community.js / progress.js
├── ASSETS-CREDIT.md
├── SIAGA-PRD.md / DESIGN-SIAGA.md
└── README.md
```

## Menjalankan Lokal

Situs 100% statis — tidak perlu build maupun install:

```bash
# opsi 1: server statis apa pun, contoh dengan Python
python -m http.server 8000
# buka http://localhost:8000

# opsi 2: VS Code Live Server (klik kanan index.html → Open with Live Server)
```

> Disarankan lewat server lokal (bukan `file://` dobel-klik) agar perilaku
> browser menyerupai hasil deploy.

## Deploy

Lihat tutorial GitHub Pages di bawah (riwayat chat) — intinya: push folder ini
ke repo GitHub → Settings → Pages → Deploy from branch → pilih branch & `/ (root)`.

## Dokumen Terkait

- `SIAGA-PRD.md` — Product Requirements Document
- `DESIGN-SIAGA.md` — design system (warna, tipografi, spacing, komponen)
- `ASSETS-CREDIT.md` — kredit & lisensi aset
