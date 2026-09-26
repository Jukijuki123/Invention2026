// ============================================================
// js/data.js
// Core Data Layer — SIAGA
// Semua konten statis: soal Check-Up, skenario Survival,
// microlesson Learn, Weekly Challenge, Badge, dan Community Stories
// ============================================================

// ------------------------------------------------------------
// 1. CHECK-UP QUESTIONS
// Setiap jawaban punya bobot poin ke salah satu dari 4 skill:
// safety, criticalThinking, aiLiteracy, financialSecurity
// ------------------------------------------------------------
const checkupQuestions = [
    {
        id: 1,
        question: "Kamu menerima pesan WhatsApp dari nomor tak dikenal berisi link 'Klaim hadiah undian BCA sekarang!'. Apa reaksi pertamamu?",
        options: [
            { text: "Langsung klik karena penasaran", points: { safety: 0, criticalThinking: 0 } },
            { text: "Cek nomor & link-nya dulu sebelum bertindak", points: { safety: 2, criticalThinking: 2 } },
            { text: "Abaikan tanpa memeriksa apa pun", points: { safety: 1, criticalThinking: 0 } },
            { text: "Forward ke teman untuk minta pendapat lebih dulu", points: { safety: 1, criticalThinking: 1 } }
        ]
    },
    {
        id: 2,
        question: "Saat scroll media sosial, kamu menemukan berita mengejutkan tanpa nama media yang jelas. Apa yang kamu lakukan?",
        options: [
            { text: "Langsung percaya dan share", points: { criticalThinking: 0 } },
            { text: "Cek ke minimal satu sumber terpercaya lain", points: { criticalThinking: 2 } },
            { text: "Baca judulnya saja lalu lupakan", points: { criticalThinking: 1 } },
            { text: "Komentar skeptis tanpa verifikasi", points: { criticalThinking: 1 } }
        ]
    },
    {
        id: 3,
        question: "Kamu diminta transfer 'DP' untuk barang murah dari akun online shop baru tanpa testimoni. Kamu akan...",
        options: [
            { text: "Transfer karena harganya menarik", points: { financialSecurity: 0, safety: 0 } },
            { text: "Cek reputasi toko & gunakan rekber/COD jika bisa", points: { financialSecurity: 2, safety: 1 } },
            { text: "Tanya teman dulu", points: { financialSecurity: 1 } },
            { text: "Batal tanpa cek apa pun", points: { financialSecurity: 1 } }
        ]
    },
    {
        id: 4,
        question: "Sebuah video menunjukkan tokoh publik mengatakan hal kontroversial. Videonya terlihat sedikit aneh gerakannya. Reaksimu?",
        options: [
            { text: "Anggap asli karena wajah & suaranya mirip", points: { aiLiteracy: 0 } },
            { text: "Curiga kemungkinan deepfake dan cek sumber resmi", points: { aiLiteracy: 2 } },
            { text: "Share dulu, klarifikasi belakangan", points: { aiLiteracy: 0 } },
            { text: "Abaikan videonya sepenuhnya", points: { aiLiteracy: 1 } }
        ]
    },
    {
        id: 5,
        question: "Aplikasi minta izin akses kontak & galeri padahal fungsinya cuma kalkulator. Kamu akan...",
        options: [
            { text: "Izinkan semua supaya cepat", points: { safety: 0 } },
            { text: "Tolak izin yang tidak relevan", points: { safety: 2 } },
            { text: "Izinkan lalu cek nanti", points: { safety: 1 } },
            { text: "Uninstall tanpa cek permission", points: { safety: 1 } }
        ]
    },
    {
        id: 6,
        question: "Kamu chat dengan 'admin bank' yang minta OTP untuk 'verifikasi akun'. Apa yang kamu lakukan?",
        options: [
            { text: "Kirim OTP karena mendesak", points: { safety: 0, financialSecurity: 0 } },
            { text: "Tidak pernah kirim OTP ke siapa pun", points: { safety: 2, financialSecurity: 2 } },
            { text: "Tanya balik identitasnya dulu", points: { safety: 1 } },
            { text: "Blokir tanpa konfirmasi", points: { safety: 1 } }
        ]
    },
    {
        id: 7,
        question: "Teman minta bantu 'like & follow' akun investasi dengan janji profit 20%/minggu. Sikapmu?",
        options: [
            { text: "Ikut karena temanmu sendiri", points: { financialSecurity: 0, criticalThinking: 0 } },
            { text: "Cek legalitas OJK/izin resmi dulu", points: { financialSecurity: 2, criticalThinking: 1 } },
            { text: "Follow saja, tidak invest", points: { financialSecurity: 1 } },
            { text: "Tolak tanpa menjelaskan alasan", points: { financialSecurity: 1 } }
        ]
    },
    {
        id: 8,
        question: "Kamu pakai chatbot AI untuk kerjakan tugas. Jawabannya terdengar meyakinkan tapi kamu tidak yakin faktanya benar. Kamu akan...",
        options: [
            { text: "Langsung kumpulkan tanpa cek", points: { aiLiteracy: 0, criticalThinking: 0 } },
            { text: "Verifikasi fakta pentingnya ke sumber lain", points: { aiLiteracy: 2, criticalThinking: 2 } },
            { text: "Edit sedikit kalimatnya saja", points: { aiLiteracy: 0 } },
            { text: "Tanyakan ke chatbot yang sama untuk mengecek ulang", points: { aiLiteracy: 1 } }
        ]
    },
    {
        id: 9,
        question: "Grup temanmu ramai membully satu orang secara online. Kamu akan...",
        options: [
            { text: "Ikut komentar agar tidak dianggap aneh", points: { safety: 0 } },
            { text: "Tidak ikut serta dan cari cara membantu korban", points: { safety: 2 } },
            { text: "Diam saja tanpa bertindak", points: { safety: 1 } },
            { text: "Keluar dari grup tanpa berkata apa-apa", points: { safety: 1 } }
        ]
    },
    {
        id: 10,
        question: "Sebelum posting sesuatu yang sensitif tentang dirimu, apa kebiasaanmu?",
        options: [
            { text: "Posting langsung, pikirkan nanti", points: { safety: 0, criticalThinking: 0 } },
            { text: "Pikirkan dampak & cek pengaturan privasi dulu", points: { safety: 2, criticalThinking: 1 } },
            { text: "Posting lalu hapus jika ada masalah", points: { safety: 1 } },
            { text: "Tanya pendapat orang lain dulu", points: { safety: 1 } }
        ]
    }
];

// ------------------------------------------------------------
// 2. SURVIVAL SCENARIOS
// Kategori: safety | information | ai | finance | social
// ------------------------------------------------------------
const scenarios = [
    {
        id: 1,
        title: "Link Mencurigakan di WhatsApp",
        category: "safety",
        difficulty: "Easy",
        xp: 50,
        situation: "Kamu menerima pesan: 'Selamat! Nomormu terpilih dapat hadiah Rp5.000.000 dari BCA. Klaim di sini: bit.ly/klaim-bca-resmi'. Pengirim adalah nomor pribadi, bukan kontak resmi.",
        options: [
            { text: "Klik link untuk lihat isinya", correct: false, feedback: "Link seperti ini biasanya phishing — mengklik saja bisa memicu unduhan berbahaya atau mengarah ke situs palsu pencuri data." },
            { text: "Abaikan & blokir nomor tersebut", correct: true, feedback: "Tepat. Bank resmi tidak pernah mengirim hadiah lewat nomor pribadi dan link pendek seperti ini." },
            { text: "Balas untuk tanya lebih detail", correct: false, feedback: "Membalas bisa mengonfirmasi ke pelaku bahwa nomormu aktif dan justru menambah risiko." }
        ],
        learningBridge: "Ciri umum phishing: urgensi berlebihan, tautan disingkat, dan mengatasnamakan institusi resmi lewat kontak pribadi."
    },
    {
        id: 2,
        title: "Permintaan OTP Mendadak",
        category: "safety",
        difficulty: "Medium",
        xp: 50,
        situation: "Seseorang menelepon mengaku 'petugas bank' dan meminta kode OTP yang baru saja masuk ke HP-mu untuk 'membatalkan transaksi mencurigakan'.",
        options: [
            { text: "Berikan OTP karena terdengar resmi & mendesak", correct: false, feedback: "OTP adalah kunci akses akunmu. Memberikannya sama saja menyerahkan akses penuh ke penipu." },
            { text: "Tutup telepon & hubungi bank lewat nomor resmi", correct: true, feedback: "Benar. Bank tidak pernah meminta OTP lewat telepon. Verifikasi selalu lewat kanal resmi." },
            { text: "Minta waktu berpikir sambil tetap di telepon", correct: false, feedback: "Menunda sambil tetap terhubung membuatmu rentan tekanan psikologis dari pelaku." }
        ],
        learningBridge: "Aturan mutlak: OTP tidak boleh dibagikan ke siapa pun, termasuk yang mengaku pihak bank."
    },
    {
        id: 3,
        title: "Berita Viral Tanpa Sumber Jelas",
        category: "information",
        difficulty: "Easy",
        xp: 50,
        situation: "Sebuah postingan viral menyebutkan 'vaksin baru menyebabkan efek samping parah' tanpa mencantumkan sumber medis atau nama media.",
        options: [
            { text: "Share karena terlihat penting untuk diketahui banyak orang", correct: false, feedback: "Menyebarkan tanpa verifikasi bisa memperluas misinformasi dan menimbulkan kepanikan." },
            { text: "Cek ke situs berita resmi/lembaga kesehatan dulu", correct: true, feedback: "Tepat. Verifikasi silang ke sumber kredibel adalah langkah dasar sebelum percaya atau menyebarkan info." },
            { text: "Abaikan sepenuhnya tanpa cek", correct: false, feedback: "Mengabaikan tanpa verifikasi bukan solusi — informasi penting (jika benar) tetap perlu ditindaklanjuti dengan tepat." }
        ],
        learningBridge: "Berita tanpa sumber jelas, apalagi menyangkut kesehatan, wajib diverifikasi ke sumber primer sebelum dipercaya."
    },
    {
        id: 4,
        title: "Video 'Pejabat' yang Terlihat Janggal",
        category: "ai",
        difficulty: "Medium",
        xp: 50,
        situation: "Beredar video seorang pejabat publik mengaku akan membagikan uang tunai jika menghubungi nomor tertentu. Gerakan bibir di video sedikit tidak sinkron dengan suara.",
        options: [
            { text: "Percaya karena wajah & suaranya sangat mirip aslinya", correct: false, feedback: "Deepfake modern bisa meniru wajah & suara dengan sangat meyakinkan — kemiripan visual bukan jaminan keaslian." },
            { text: "Curiga deepfake, cek akun resmi pejabat tersebut", correct: true, feedback: "Benar. Ketidaksinkronan audio-visual adalah tanda umum deepfake. Verifikasi ke sumber resmi adalah langkah tepat." },
            { text: "Hubungi nomor di video untuk konfirmasi", correct: false, feedback: "Menghubungi nomor dalam video justru menjebakmu masuk ke skema penipuan itu sendiri." }
        ],
        learningBridge: "Tanda deepfake: gerakan bibir tidak sinkron, pencahayaan tidak wajar, dan ajakan bertindak cepat lewat kontak tak resmi."
    },
    {
        id: 5,
        title: "Investasi 'Untung Pasti' dari Teman",
        category: "finance",
        difficulty: "Medium",
        xp: 50,
        situation: "Temanmu mengajak ikut 'investasi' yang menjanjikan profit 20% per minggu, tanpa penjelasan bagaimana uang itu dikelola.",
        options: [
            { text: "Ikut karena percaya pada temanmu", correct: false, feedback: "Skema dengan janji profit tidak masuk akal & tanpa transparansi pengelolaan adalah ciri khas investasi bodong." },
            { text: "Cek legalitasnya di OJK sebelum memutuskan", correct: true, feedback: "Tepat. Legalitas dan izin resmi (OJK) adalah pengecekan wajib sebelum menaruh uang di produk investasi apa pun." },
            { text: "Tolak tanpa memberi alasan ke teman", correct: false, feedback: "Menolak boleh, tapi tanpa penjelasan kamu kehilangan kesempatan mengedukasi teman soal risikonya." }
        ],
        learningBridge: "Return tinggi dalam waktu singkat + tanpa transparansi + tekanan sosial dari kenalan = pola klasik skema bodong."
    },
    {
        id: 6,
        title: "Tekanan Sosial untuk Ikut Perundungan Online",
        category: "social",
        difficulty: "Easy",
        xp: 50,
        situation: "Di grup chat kelas, banyak teman mengejek satu orang secara terbuka. Beberapa memintamu ikut berkomentar agar 'seru'.",
        options: [
            { text: "Ikut berkomentar supaya tidak dijauhi", correct: false, feedback: "Ikut serta memperkuat perundungan dan bisa berdampak hukum maupun psikologis bagi korban." },
            { text: "Tidak ikut & cari cara mendukung korban secara pribadi", correct: true, feedback: "Tepat. Tidak berpartisipasi dan mendukung korban secara personal adalah langkah paling aman dan etis." },
            { text: "Diam saja tanpa melakukan apa pun", correct: false, feedback: "Diam mengurangi risiko langsung untukmu, tapi tidak membantu korban — masih ada ruang untuk bertindak lebih baik." }
        ],
        learningBridge: "Tekanan sosial di grup adalah pemicu umum keputusan buruk — berhenti sejenak sebelum ikut arus."
    },
    {
        id: 7,
        title: "Aplikasi Kalkulator Minta Akses Kontak",
        category: "safety",
        difficulty: "Easy",
        xp: 50,
        situation: "Kamu baru install aplikasi kalkulator dari sumber tidak resmi. Saat dibuka, ia minta izin akses kontak, galeri, dan lokasi.",
        options: [
            { text: "Izinkan semua supaya aplikasinya bisa langsung dipakai", correct: false, feedback: "Permintaan izin yang tidak relevan dengan fungsi aplikasi adalah tanda bahaya (malware/spyware)." },
            { text: "Tolak izin yang tidak relevan dengan fungsinya", correct: true, feedback: "Tepat. Kalkulator tidak butuh akses kontak/galeri/lokasi — menolak izin berlebihan melindungi datamu." },
            { text: "Uninstall tanpa memeriksa dulu permission-nya", correct: false, feedback: "Uninstall boleh jadi solusi akhir, tapi memahami dulu permission membantumu lebih waspada ke depannya." }
        ],
        learningBridge: "Selalu cek kesesuaian antara fungsi aplikasi dan izin yang diminta sebelum menyetujui."
    },
    {
        id: 8,
        title: "Jawaban AI yang Terdengar Meyakinkan",
        category: "ai",
        difficulty: "Medium",
        xp: 50,
        situation: "Kamu memakai chatbot AI untuk menyelesaikan tugas sekolah. Jawabannya terdengar sangat meyakinkan, tapi ada satu data statistik yang terasa janggal.",
        options: [
            { text: "Langsung kumpulkan karena jawabannya terdengar profesional", correct: false, feedback: "AI bisa menghasilkan informasi yang terdengar meyakinkan namun keliru (halusinasi) — perlu diverifikasi." },
            { text: "Verifikasi data statistik itu ke sumber terpercaya", correct: true, feedback: "Tepat. Memverifikasi klaim penting dari AI ke sumber primer mencegah kesalahan fatal di tugasmu." },
            { text: "Ganti sedikit kalimatnya lalu kumpulkan", correct: false, feedback: "Mengubah kalimat tidak memperbaiki data yang salah — inti masalahnya tetap tidak terverifikasi." }
        ],
        learningBridge: "AI generatif bisa 'berhalusinasi' — selalu cek fakta kunci sebelum menjadikannya rujukan final."
    }
];

// ------------------------------------------------------------
// 3. MICROLESSONS (Learn)
// tag skill dipakai untuk sistem rekomendasi dari hasil Check-Up
// ------------------------------------------------------------
const lessons = [
    {
        id: 1,
        title: "Mengenali Ciri-Ciri Phishing",
        skillTag: "safety",
        category: "Digital Safety",
        xp: 40,
        content: {
            situation: "Phishing adalah upaya menipu korban agar memberikan data pribadi lewat pesan/tautan palsu yang menyamar sebagai pihak resmi.",
            signals: ["Urgensi berlebihan ('klaim sekarang!')", "Tautan disingkat/aneh", "Meminta OTP atau password", "Tata bahasa tidak baku dari 'institusi resmi'"],
            whatToDo: "Jangan klik, jangan balas. Verifikasi lewat kanal resmi institusi, lalu blokir & laporkan.",
            quickCheck: {
                question: "Manakah tanda paling kuat dari pesan phishing?",
                options: ["Dikirim pagi hari", "Meminta OTP/password", "Menggunakan emoji"],
                correctIndex: 1
            }
        }
    },
    {
        id: 2,
        title: "Verifikasi Berita Sebelum Percaya",
        skillTag: "criticalThinking",
        category: "Information Literacy",
        xp: 40,
        content: {
            situation: "Tidak semua informasi viral itu benar. Verifikasi silang adalah kebiasaan dasar literasi digital.",
            signals: ["Tidak ada nama media/penulis jelas", "Judul provokatif berlebihan", "Tidak ditemukan di media kredibel lain"],
            whatToDo: "Cek ke minimal 1-2 sumber kredibel lain sebelum percaya atau membagikan.",
            quickCheck: {
                question: "Langkah pertama saat menemukan berita viral tanpa sumber jelas?",
                options: ["Langsung share", "Cek ke sumber kredibel lain", "Percaya karena banyak yang share"],
                correctIndex: 1
            }
        }
    },
    {
        id: 3,
        title: "Mengenali Konten Buatan AI (Deepfake)",
        skillTag: "aiLiteracy",
        category: "AI Literacy",
        xp: 40,
        content: {
            situation: "Deepfake adalah video/audio hasil AI yang meniru wajah/suara seseorang secara meyakinkan.",
            signals: ["Gerakan bibir tidak sinkron", "Pencahayaan/bayangan tidak wajar", "Ajakan bertindak cepat lewat kontak tidak resmi"],
            whatToDo: "Verifikasi ke akun/kanal resmi orang atau institusi terkait sebelum percaya atau bertindak.",
            quickCheck: {
                question: "Apa tanda umum video deepfake?",
                options: ["Resolusi tinggi", "Gerakan bibir tidak sinkron", "Diunggah malam hari"],
                correctIndex: 1
            }
        }
    },
    {
        id: 4,
        title: "Mengenali Skema Investasi Bodong",
        skillTag: "financialSecurity",
        category: "Financial Security",
        xp: 40,
        content: {
            situation: "Investasi bodong menjanjikan profit tinggi tanpa risiko dan tanpa transparansi pengelolaan dana.",
            signals: ["Profit tetap & tinggi setiap minggu", "Tidak terdaftar di OJK", "Mengandalkan ajakan berantai dari kenalan"],
            whatToDo: "Cek legalitas di situs resmi OJK sebelum menaruh uang di produk investasi apa pun.",
            quickCheck: {
                question: "Ke mana kamu mengecek legalitas produk investasi di Indonesia?",
                options: ["OJK", "Grup WhatsApp teman", "Testimoni media sosial"],
                correctIndex: 0
            }
        }
    }
];

// ------------------------------------------------------------
// 4. WEEKLY CHALLENGES
// ------------------------------------------------------------
const weeklyChallenges = [
    {
        id: 1,
        title: "Minggu Ketahanan Digital #1",
        description: "Hadapi 5 skenario campuran untuk menguji seluruh skill SIAGA-mu minggu ini.",
        scenarioIds: [1, 3, 4, 5, 6],
        rewardXp: 250,
        rewardBadgeId: "digital-guardian"
    }
];

// ------------------------------------------------------------
// 5. BADGES
// ------------------------------------------------------------
const badges = [
    { id: "first-decision", title: "First Decision", description: "Selesaikan skenario pertamamu.", icon: "shield" },
    { id: "scam-survivor", title: "Scam Survivor", description: "Selesaikan 5 skenario kategori safety.", icon: "shield-check" },
    { id: "fact-finder", title: "Fact Finder", description: "Selesaikan 5 skenario kategori information.", icon: "search" },
    { id: "ai-detector", title: "AI Detector", description: "Selesaikan 5 skenario kategori AI.", icon: "sparkles" },
    { id: "safe-trader", title: "Safe Trader", description: "Selesaikan 5 skenario kategori finance.", icon: "wallet" },
    { id: "digital-guardian", title: "Digital Guardian", description: "Capai rata-rata skill di atas ambang tertentu.", icon: "trophy" }
];

// ------------------------------------------------------------
// 6. DEFAULT COMMUNITY STORIES
// ------------------------------------------------------------
const defaultStories = [
    {
        id: "default-1",
        author: "Anonim",
        relatedScenarioId: 1,
        title: "Hampir Kena Link Hadiah Palsu",
        whatHappened: "Saya menerima pesan hadiah undian bank lewat WhatsApp dan hampir klik linknya karena panik.",
        theDecision: "Saya cek dulu nomornya di Google sebelum klik apa pun.",
        whatWentWrong: "Ternyata nomor itu sudah dilaporkan banyak orang sebagai penipuan.",
        whatILearned: "Selalu cek dulu sebelum klik, sekalipun pesannya terasa mendesak.",
        helpfulCount: 12,
        isDefault: true
    },
    {
        id: "default-2",
        author: "Anonim",
        relatedScenarioId: 5,
        title: "Diajak Investasi Bodong Teman Sendiri",
        whatHappened: "Teman dekat mengajak investasi dengan janji profit 20% per minggu.",
        theDecision: "Saya cek dulu ke situs OJK dan ternyata perusahaannya tidak terdaftar.",
        whatWentWrong: "Beberapa teman lain yang ikut akhirnya kehilangan uang.",
        whatILearned: "Kedekatan personal bukan jaminan sebuah tawaran itu aman.",
        helpfulCount: 8,
        isDefault: true
    }
];

// ------------------------------------------------------------
// EXPORT (diakses global lewat window jika tanpa module bundler)
// ------------------------------------------------------------
window.SIAGA_DATA = {
    checkupQuestions,
    scenarios,
    lessons,
    weeklyChallenges,
    badges,
    defaultStories
};