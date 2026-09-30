// CHECK-UP QUESTIONS 
const checkupQuestions = [
    {
        id: 1,
        categoryLabel: "Smishing & Banking Vectors",
        urgency: "High Urgency Trigger",
        vector: "safety",
        question: "Kamu menerima pesan WhatsApp dari nomor tak dikenal berisi tautan klaim hadiah undian bank. Apa reaksi pertamamu?",
        snippet: '[ALERT] "Selamat! Nomor Anda terpilih mendapatkan hadiah tunai Rp5.000.000 dari BCA. Klik bit.ly/klaim-bca-resmi dalam 15 menit."',
        options: [
            { text: "Langsung klik link untuk melihat info lengkap hadiahnya", points: { safety: 0, criticalThinking: 0 } },
            { text: "Cek nomor pengirim & format tautan sebelum mengambil tindakan", points: { safety: 2, criticalThinking: 2 } },
            { text: "Abaikan pesan tersebut dan hapus dari riwayat chat", points: { safety: 1, criticalThinking: 0 } },
            { text: "Forward pesan ke grup teman untuk menanyakan keasliannya", points: { safety: 1, criticalThinking: 1 } }
        ]
    },
    {
        id: 2,
        categoryLabel: "Disinformation & Misinformation",
        urgency: "Medium Urgency Trigger",
        vector: "criticalThinking",
        question: "Saat scroll media sosial, kamu menemukan berita mengejutkan dari akun anonim tanpa rujukan media terpercaya. Reaksimu?",
        snippet: '[VIRAL POST] "GEMPAR! Ditemukan efek samping berbahaya dari produk populer ini yang disembunyikan media resmi! Repost sebelum dihapus!"',
        options: [
            { text: "Langsung percayai dan bagikan ke media sosial agar orang tahu", points: { criticalThinking: 0 } },
            { text: "Verifikasi klaim berita ke minimal dua sumber media arus utama terpercaya", points: { criticalThinking: 2 } },
            { text: "Hanya membaca judulnya saja lalu mengabaikannya", points: { criticalThinking: 1 } },
            { text: "Menulis komentar skeptis tanpa melakukan verifikasi terlebih dahulu", points: { criticalThinking: 1 } }
        ]
    },
    {
        id: 3,
        categoryLabel: "E-Commerce & Digital Payment Scam",
        urgency: "High Urgency Trigger",
        vector: "financialSecurity",
        question: "Kamu diminta mentransfer DP untuk barang bermerek berharga sangat murah oleh toko online baru tanpa testimoni. Tindakanmu?",
        snippet: '[DM INSTAGRAM] "Kak stok barangnya sisa 1 unit lagi ya! Siapa cepat dia dapat. Transfer DP Rp200.000 sekarang ke rekening pribadi Admin."',
        options: [
            { text: "Langsung transfer DP karena khawatir kehabisan barang murah tersebut", points: { financialSecurity: 0, safety: 0 } },
            { text: "Periksa reputasi toko di platfon resmi & desak pembayaran via Rekber / COD", points: { financialSecurity: 2, safety: 1 } },
            { text: "Menanyakan pendapat teman terdekat terlebih dahulu", points: { financialSecurity: 1 } },
            { text: "Membatalkan pembelian tanpa melakukan pengecekan", points: { financialSecurity: 1 } }
        ]
    },
    {
        id: 4,
        categoryLabel: "AI Deepfake & Synthetic Media",
        urgency: "High Urgency Trigger",
        vector: "aiLiteracy",
        question: "Beredar video tokoh publik membagikan uang cuma-cuma, namun gerakan bibirnya terasa sedikit kaku dan tak sinkron. Sikapmu?",
        snippet: '[VIDEO PREVIEW] "Halo warga Indonesia, saya akan membagikan bantuan Rp50.000.000 tunai. Segera klik link di bio untuk klaim kuota terbatas!"',
        options: [
            { text: "Anggap video asli karena raut wajah dan intonasi suaranya sangat mirip", points: { aiLiteracy: 0 } },
            { text: "Curiga sebagai manipulasi AI (deepfake) dan mengecek ke saluran informasi resmi", points: { aiLiteracy: 2 } },
            { text: "Bagikan videonya terlebih dahulu, klarifikasi bisa dilakukan belakangan", points: { aiLiteracy: 0 } },
            { text: "Abaikan video tersebut tanpa mencari tahu kebenarannya", points: { aiLiteracy: 1 } }
        ]
    },
    {
        id: 5,
        categoryLabel: "Malware & Excessive Permissions",
        urgency: "Critical Risk Alert",
        vector: "safety",
        question: "Aplikasi kalkulator yang baru kamu unduh meminta akses penuh ke Kontak, Galeri Foto, dan Lokasi Presisi. Apa yang kamu lakukan?",
        snippet: '[SYSTEM DIALOG] "Calculator Pro v2.1 requests access to: Contacts, Photo Gallery, and Precise Location to continue initialization."',
        options: [
            { text: "Berikan semua izin agar aplikasi bisa cepat digunakan", points: { safety: 0 } },
            { text: "Tolak seluruh izin yang tidak relevan dengan fungsi dasar kalkulator", points: { safety: 2 } },
            { text: "Berikan izin sementara, lalu berniat mengubahnya nanti", points: { safety: 1 } },
            { text: "Langsung copot (uninstall) aplikasi tanpa memeriksa ulang", points: { safety: 1 } }
        ]
    },
    {
        id: 6,
        categoryLabel: "Social Engineering & OTP Fraud",
        urgency: "Critical Risk Alert",
        vector: "financialSecurity",
        question: "Penelepon yang mengaku sebagai 'Admin Keamanan Bank' meminta 6 digit OTP yang baru masuk ke HP-mu untuk membatalkan transaksi. Tindakanmu?",
        snippet: '[CALL LOG / SMS] "Kami mendeteksi aktivitas mencurigakan Rp4.500.000. Mohon sebutkan kode OTP yang kami kirimkan untuk pembatalan otomatis."',
        options: [
            { text: "Memberikan kode OTP karena merasa situasi sangat mendesak", points: { safety: 0, financialSecurity: 0 } },
            { text: "Menolak memberikan OTP dan langsung mengakhiri panggilan", points: { safety: 2, financialSecurity: 2 } },
            { text: "Menanyakan kembali identitas resmi penelepon", points: { safety: 1 } },
            { text: "Memblokir nomor tanpa memberikan konfirmasi", points: { safety: 1 } }
        ]
    },
    {
        id: 7,
        categoryLabel: "Ponzi & Illegal Investment",
        urgency: "Medium Urgency Trigger",
        vector: "financialSecurity",
        question: "Temanmu mengajak bergabung ke platform investasi yang menjanjikan keuntungan pasti 20% setiap minggu tanpa risiko. Reaksimu?",
        snippet: '[CHAT GROUP] "Guys! Join platform ini modal 1jt bisa cair 1.2jt per minggu terbukti cair terus! Kuota terbatas sisa 2 member lagi."',
        options: [
            { text: "Langsung ikut mendaftar karena diajad oleh teman dekat sendiri", points: { financialSecurity: 0, criticalThinking: 0 } },
            { text: "Mengecek legalitas perizinan perusahaan tersebut di website resmi OJK", points: { financialSecurity: 2, criticalThinking: 1 } },
            { text: "Mengikuti akun media sosialnya saja tanpa menginvestasikan uang", points: { financialSecurity: 1 } },
            { text: "Menolak ajakan tersebut tanpa memberikan alasan ilmiah", points: { financialSecurity: 1 } }
        ]
    },
    {
        id: 8,
        categoryLabel: "AI Hallucination & Fact Check",
        urgency: "Medium Urgency Trigger",
        vector: "aiLiteracy",
        question: "Chatbot AI memberikan jawaban tugas sekolah dengan gaya bahasa meyakinkan, namun mencantumkan angka statistik yang tercium aneh. Reaksimu?",
        snippet: '[AI GENERATED RESPONSE] "Berdasarkan Studi Harvard 2025, 94.2% remaja mengalami kelelahan digital karena frekuensi Wi-Fi 5GHz (Kutipan: J-Mind p.44)."',
        options: [
            { text: "Langsung menyalin dan menyetorkan tugas karena terdengar sangat ilmiah", points: { aiLiteracy: 0, criticalThinking: 0 } },
            { text: "Memverifikasi kutipan data & jurnal tersebut ke mesin pencari/sumber resmi", points: { aiLiteracy: 2, criticalThinking: 2 } },
            { text: "Mengedit sedikit susunan kalimatnya lalu menyetorkannya", points: { aiLiteracy: 0 } },
            { text: "Menanyakan kembali pertanyaan yang sama ke chatbot AI tersebut", points: { aiLiteracy: 1 } }
        ]
    }
];

//  SURVIVAL SCENARIOS 
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
        id: 7,
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

// MICROLESSONS (Learn) 
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
    },
    {
        id: 5,
        title: "OTP Adalah Kunci: Jangan Dibagikan",
        skillTag: "safety",
        category: "Digital Safety",
        xp: 40,
        content: {
            situation: "Kode OTP adalah kunci sekali pakai ke akunmu. Penipu menyamar sebagai pihak bank dan mendesakmu membacakannya lewat telepon.",
            signals: ["Penelepon mengaku dari bank/pihak resmi", "Dibuat panik dengan transaksi misterius", "Diminta membacakan kode yang masuk ke HP-mu"],
            whatToDo: "Tutup teleponnya. Bank tidak pernah meminta OTP. Hubungi nomor resmi bank bila perlu konfirmasi.",
            quickCheck: {
                question: "Pihak yang mengaku bank menelepon dan meminta kode OTP-mu. Apa yang benar?",
                options: ["Bacakan kodenya karena mendesak", "Tutup telepon & hubungi nomor resmi bank", "Minta waktu berpikir sambil tetap tersambung"],
                correctIndex: 1
            }
        }
    },
    {
        id: 6,
        title: "Waspadai Izin Aplikasi Berlebihan",
        skillTag: "safety",
        category: "Digital Safety",
        xp: 40,
        content: {
            situation: "Aplikasi berbahaya sering meminta akses yang tidak ada hubungannya dengan fungsinya — misalnya kalkulator yang minta akses kontak dan galeri — untuk mencuri datamu.",
            signals: ["Izin tidak relevan dengan fungsi aplikasi", "Diunduh dari luar toko aplikasi resmi", "Aplikasi memaksa: tolak izin berarti tidak bisa dipakai sama sekali"],
            whatToDo: "Tolak izin yang tidak relevan. Bila ragu, copot aplikasi dan unduh ulang dari toko resmi.",
            quickCheck: {
                question: "Aplikasi kalkulator meminta akses kontak dan lokasi. Apa yang benar?",
                options: ["Izinkan semua agar bisa dipakai", "Tolak izin yang tidak relevan dengan fungsinya", "Izinkan sementara, ubah belakangan"],
                correctIndex: 1
            }
        }
    },
    {
        id: 7,
        title: "AI Bisa Ngawur: Selalu Verifikasi",
        skillTag: "aiLiteracy",
        category: "AI Literacy",
        xp: 40,
        content: {
            situation: "Chatbot AI kadang mengarang jawaban yang terdengar sangat meyakinkan (halusinasi) — lengkap dengan angka, kutipan, dan sumber yang ternyata fiktif.",
            signals: ["Angka statistik yang terasa janggal", "Kutipan jurnal/buku yang tidak bisa dilacak", "Nada terlalu yakin untuk topik yang diperdebatkan"],
            whatToDo: "Verifikasi klaim penting ke sumber primer (mesin pencari, situs resmi, jurnal asli) sebelum dipakai untuk tugas atau keputusan.",
            quickCheck: {
                question: "Chatbot memberi jawaban tugas dengan data statistik yang janggal. Apa yang benar?",
                options: ["Langsung kumpulkan karena terdengar profesional", "Verifikasi datanya ke sumber terpercaya", "Tanyakan ulang pertanyaan yang sama ke chatbot"],
                correctIndex: 1
            }
        }
    },
    {
        id: 8,
        title: "Belanja Online Aman: Rekber & COD",
        skillTag: "financialSecurity",
        category: "Financial Security",
        xp: 40,
        content: {
            situation: "Toko online palsu memancing dengan harga jauh di bawah pasar, lalu meminta transfer DP ke rekening pribadi agar transaksi tidak terlindungi platform.",
            signals: ["Harga tidak masuk akal murahnya", "Diminta transfer ke rekening pribadi", "Toko baru tanpa testimoni dan menolak Rekber/COD"],
            whatToDo: "Belanja hanya lewat jalur resmi platform dan gunakan Rekber/COD. Cek reputasi toko sebelum transfer apa pun.",
            quickCheck: {
                question: "Toko baru berharga sangat murah meminta DP via transfer pribadi. Apa yang benar?",
                options: ["Transfer cepat sebelum kehabisan", "Desak pembayaran via Rekber/COD di platform resmi", "Batalkan tanpa memeriksa apa pun"],
                correctIndex: 1
            }
        }
    },
    {
        id: 9,
        title: "Baca Isi, Bukan Cuma Judul",
        skillTag: "criticalThinking",
        category: "Information Literacy",
        xp: 40,
        content: {
            situation: "Judul clickbait dirancang memancing emosi agar kamu langsung percaya dan membagikan — padahal isi beritanya sering berbeda, dipelintir, atau tanpa sumber.",
            signals: ["Judul bombastis penuh huruf kapital dan tanda seru", "Isi artikel tidak mendukung klaim judulnya", "Tidak ada narasumber atau data yang bisa dilacak"],
            whatToDo: "Baca seluruh isi sebelum percaya atau share, lalu bandingkan dengan minimal satu media kredibel lain.",
            quickCheck: {
                question: "Kamu menemukan berita berjudul heboh yang memancing emosi. Apa yang benar?",
                options: ["Langsung bagikan agar viral", "Baca isinya lalu bandingkan ke media kredibel", "Percaya karena banyak yang komentar"],
                correctIndex: 1
            }
        }
    }
];

// WEEKLY CHALLENGES 
const weeklyChallenges = [
    {
        id: 1,
        title: "Minggu Ketahanan Digital #1",
        description: "Hadapi 5 skenario campuran untuk menguji seluruh skill SIAGA-mu minggu ini.",
        scenarioIds: [1, 3, 4, 5, 7],
        rewardXp: 250,
        rewardBadgeId: "digital-guardian"
    }
];

// BADGES 
const badges = [
    { id: "first-decision", title: "First Decision", description: "Selesaikan skenario pertamamu.", icon: "shield" },
    { id: "scam-survivor", title: "Scam Survivor", description: "Selesaikan 5 skenario kategori safety.", icon: "verified_user" },
    { id: "fact-finder", title: "Fact Finder", description: "Selesaikan 5 skenario kategori information.", icon: "fact_check" },
    { id: "ai-detector", title: "AI Detector", description: "Selesaikan 5 skenario kategori AI.", icon: "auto_awesome" },
    { id: "safe-trader", title: "Safe Trader", description: "Selesaikan 5 skenario kategori finance.", icon: "wallet" },
    { id: "digital-guardian", title: "Digital Guardian", description: "Capai rata-rata skill di atas ambang tertentu.", icon: "emoji_events" }
];

// DEFAULT COMMUNITY STORIES 
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


window.SIAGA_DATA = {
    checkupQuestions,
    scenarios,
    lessons,
    weeklyChallenges,
    badges,
    defaultStories
};
