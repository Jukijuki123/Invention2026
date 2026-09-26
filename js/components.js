// ============================================================
// js/components.js
// Shared Components Helper — SIAGA
// Komponen reusable: Toast Notification, Modal Popup Engine,
// Navbar Active State Highlighter, Sound/Haptic Feedback Toggle
// Menggunakan token warna dari js/tailwind-config.js (design system aktual)
// ============================================================

// ------------------------------------------------------------
// 1. TOAST NOTIFICATION SYSTEM
// Tipe: "success" | "warning" | "error" | "info"
// Dipetakan ke token yang tersedia di tailwind-config.js
// (tidak ada token success/warning khusus, jadi dipetakan ke
// secondary = success, tertiary = warning/info, error = error)
// ------------------------------------------------------------
const TOAST_STYLES = {
    success: "bg-secondary-container text-on-secondary-container",
    warning: "bg-tertiary-container text-on-tertiary-container",
    error: "bg-error-container text-on-error-container",
    info: "bg-surface-container-high text-on-surface"
};

const TOAST_ICONS = {
    success: "check-circle",
    warning: "alert-triangle",
    error: "x-circle",
    info: "info"
};

let toastContainer = null;

/**
 * Memastikan container toast ada di DOM (dibuat sekali, reusable).
 * @returns {HTMLElement}
 */
function ensureToastContainer() {
    if (toastContainer) return toastContainer;
    toastContainer = document.createElement("div");
    toastContainer.id = "siaga-toast-container";
    toastContainer.className =
        "fixed bottom-space-lg right-space-lg z-[9999] flex flex-col gap-space-xs " +
        "w-[calc(100%-2*theme(spacing.space-lg))] max-w-sm";
    toastContainer.setAttribute("aria-live", "polite");
    document.body.appendChild(toastContainer);
    return toastContainer;
}

/**
 * Menampilkan toast notification.
 * @param {string} message - Pesan yang ditampilkan.
 * @param {"success"|"warning"|"error"|"info"} [type="info"] - Jenis toast.
 * @param {number} [duration=3500] - Durasi tampil (ms) sebelum otomatis hilang.
 */
function showToast(message, type = "info", duration = 3500) {
    const container = ensureToastContainer();
    const style = TOAST_STYLES[type] || TOAST_STYLES.info;
    const icon = TOAST_ICONS[type] || TOAST_ICONS.info;

    const toast = document.createElement("div");
    toast.className =
        `${style} rounded-lg shadow-lg px-space-md py-space-sm ` +
        "flex items-center gap-space-xs font-body-sm " +
        "opacity-0 translate-y-2 transition-all duration-300 ease-out";
    toast.innerHTML = `
        <i data-lucide="${icon}" class="w-5 h-5 shrink-0"></i>
        <span class="flex-1">${message}</span>
    `;

    container.appendChild(toast);

    if (window.lucide) window.lucide.createIcons();

    // Trigger transisi masuk
    requestAnimationFrame(() => {
        toast.classList.remove("opacity-0", "translate-y-2");
    });

    // Auto-dismiss
    setTimeout(() => {
        toast.classList.add("opacity-0", "translate-y-2");
        setTimeout(() => toast.remove(), 300);
    }, duration);

    triggerHapticFeedback(type === "error" ? "error" : "light");
}

// ------------------------------------------------------------
// 2. MODAL POPUP ENGINE
// Modal harus punya struktur:
// <div id="my-modal" class="siaga-modal hidden" data-modal>
//   <div class="siaga-modal-backdrop" data-modal-backdrop></div>
//   <div class="siaga-modal-panel">...</div>
// </div>
// ------------------------------------------------------------

/**
 * Membuka modal berdasarkan ID elemen.
 * @param {string} modalId
 */
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) {
        console.warn(`SIAGA components: modal #${modalId} tidak ditemukan.`);
        return;
    }
    modal.classList.remove("hidden");
    requestAnimationFrame(() => {
        modal.classList.add("siaga-modal-open");
    });
    document.body.classList.add("overflow-hidden");
    modal.dispatchEvent(new CustomEvent("siaga:modal-open"));
}

/**
 * Menutup modal berdasarkan ID elemen.
 * @param {string} modalId
 */
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove("siaga-modal-open");
    document.body.classList.remove("overflow-hidden");
    setTimeout(() => modal.classList.add("hidden"), 200);
    modal.dispatchEvent(new CustomEvent("siaga:modal-close"));
}

/**
 * Inisialisasi listener global untuk semua modal:
 * - klik tombol dengan [data-modal-open="id"] → buka modal id
 * - klik tombol dengan [data-modal-close] di dalam modal → tutup modal terdekat
 * - klik backdrop [data-modal-backdrop] → tutup modal
 * - tekan Escape → tutup modal yang sedang terbuka
 */
function initModalListeners() {
    document.addEventListener("click", (e) => {
        const openTrigger = e.target.closest("[data-modal-open]");
        if (openTrigger) {
            openModal(openTrigger.getAttribute("data-modal-open"));
            return;
        }

        const closeTrigger = e.target.closest("[data-modal-close]");
        if (closeTrigger) {
            const parentModal = closeTrigger.closest("[data-modal]");
            if (parentModal) closeModal(parentModal.id);
            return;
        }

        const backdrop = e.target.closest("[data-modal-backdrop]");
        if (backdrop) {
            const parentModal = backdrop.closest("[data-modal]");
            if (parentModal) closeModal(parentModal.id);
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key !== "Escape") return;
        const openModalEl = document.querySelector("[data-modal].siaga-modal-open");
        if (openModalEl) closeModal(openModalEl.id);
    });
}

// ------------------------------------------------------------
// 3. NAVBAR ACTIVE STATE HIGHLIGHTER
// Setiap link navbar diberi atribut data-nav-link="checkup" dsb,
// dicocokkan dengan nama file halaman saat ini.
// ------------------------------------------------------------

/**
 * Mengambil nama halaman aktif dari path URL, tanpa ekstensi.
 * index.html / "" dianggap "home".
 * @returns {string}
 */
function getCurrentPageKey() {
    const path = window.location.pathname.split("/").pop();
    if (!path || path === "index.html") return "home";
    return path.replace(".html", "");
}

/**
 * Menandai link navbar yang aktif sesuai halaman saat ini
 * dengan menambahkan kelas token warna primary.
 */
function highlightActiveNavLink() {
    const currentPage = getCurrentPageKey();
    const navLinks = document.querySelectorAll("[data-nav-link]");

    navLinks.forEach((link) => {
        const isActive = link.getAttribute("data-nav-link") === currentPage;
        link.classList.toggle("text-primary", isActive);
        link.classList.toggle("font-semibold", isActive);
        link.classList.toggle("text-on-surface-variant", !isActive);
        link.setAttribute("aria-current", isActive ? "page" : "false");
    });
}

// ------------------------------------------------------------
// 4. SOUND / HAPTIC FEEDBACK TOGGLE
// Preferensi disimpan terpisah dari storage.js (murni UI setting,
// bukan progres pengguna) agar components.js tetap independen.
// ------------------------------------------------------------
const FEEDBACK_SETTING_KEY = "siaga_feedback_enabled";

/**
 * Mengecek apakah feedback sound/haptic sedang aktif.
 * Default: aktif (true) jika belum pernah diatur.
 * @returns {boolean}
 */
function isFeedbackEnabled() {
    const stored = localStorage.getItem(FEEDBACK_SETTING_KEY);
    return stored === null ? true : stored === "true";
}

/**
 * Mengaktifkan/menonaktifkan feedback sound/haptic, lalu
 * mengembalikan status barunya.
 * @returns {boolean}
 */
function toggleFeedbackSetting() {
    const newValue = !isFeedbackEnabled();
    localStorage.setItem(FEEDBACK_SETTING_KEY, String(newValue));
    return newValue;
}

/**
 * Memicu haptic feedback (getar) di perangkat yang mendukung.
 * @param {"light"|"success"|"error"} [style="light"]
 */
function triggerHapticFeedback(style = "light") {
    if (!isFeedbackEnabled()) return;
    if (!("vibrate" in navigator)) return;

    const patterns = {
        light: 15,
        success: [15, 40, 15],
        error: [30, 60, 30]
    };
    navigator.vibrate(patterns[style] || patterns.light);
}

/**
 * Memicu bunyi "klik" singkat pakai Web Audio API (tanpa file audio
 * eksternal, supaya tetap ringan & sesuai batasan proyek statis).
 * @param {"tap"|"success"|"error"} [style="tap"]
 */
function triggerSoundFeedback(style = "tap") {
    if (!isFeedbackEnabled()) return;

    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioCtx();
        const oscillator = ctx.createOscillator();
        const gain = ctx.createGain();

        const freqMap = { tap: 440, success: 660, error: 220 };
        oscillator.frequency.value = freqMap[style] || freqMap.tap;
        oscillator.type = "sine";

        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

        oscillator.connect(gain);
        gain.connect(ctx.destination);

        oscillator.start();
        oscillator.stop(ctx.currentTime + 0.15);
    } catch (err) {
        console.warn("SIAGA components: audio feedback tidak tersedia.", err);
    }
}

// ------------------------------------------------------------
// INIT — dipanggil otomatis saat DOM siap
// ------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    highlightActiveNavLink();
    initModalListeners();
});

// ------------------------------------------------------------
// EXPORT
// ------------------------------------------------------------
window.SIAGA_COMPONENTS = {
    showToast,
    openModal,
    closeModal,
    highlightActiveNavLink,
    getCurrentPageKey,
    isFeedbackEnabled,
    toggleFeedbackSetting,
    triggerHapticFeedback,
    triggerSoundFeedback
};