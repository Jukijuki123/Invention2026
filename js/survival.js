// ============================================================
// js/survival.js
// Logic Halaman Survival — Daily Hero, Filter, Grid, Simulator
// Bergantung pada: window.SIAGA_DATA, window.SIAGA_STORAGE, window.SIAGA_COMPONENTS
// FIX: nama variabel "scenarios" diganti "allScenarios" karena
// data.js sudah mendeklarasikan top-level const "scenarios" —
// tabrakan nama ini yang menyebabkan SyntaxError & seluruh script gagal jalan.
// ============================================================

/** Label & pemetaan kategori skenario ke skill terkait (ASUMSI, lihat catatan). */
const CATEGORY_META = {
    safety: { label: "Keamanan", icon: "shield", skill: "safety" },
    information: { label: "Informasi", icon: "newspaper", skill: "criticalThinking" },
    ai: { label: "AI", icon: "sparkles", skill: "aiLiteracy" },
    finance: { label: "Finansial", icon: "wallet", skill: "financialSecurity" },
    social: { label: "Sosial", icon: "users", skill: "safety" }
};

/** Pemetaan kategori -> badge yang bisa di-unlock (badge untuk "social" belum ada di data.js). */
const CATEGORY_BADGE_MAP = {
    safety: "scam-survivor",
    information: "fact-finder",
    ai: "ai-detector",
    finance: "safe-trader"
};

const CATEGORY_BADGE_THRESHOLD = 5;

/** @type {string} Kategori filter yang sedang aktif ("all" atau salah satu key CATEGORY_META) */
let activeFilter = "all";

/** @type {number|null} ID skenario yang sedang dibuka di modal */
let currentScenarioId = null;

const allScenarios = window.SIAGA_DATA.scenarios;

// ------------------------------------------------------------
// DAILY SURVIVAL HERO
// ------------------------------------------------------------

/**
 * Menentukan indeks skenario harian secara deterministik dari tanggal
 * (YYYY-MM-DD), supaya skenario yang sama muncul sepanjang hari itu.
 * @param {string} dateStr - format YYYY-MM-DD
 * @returns {number} index skenario
 */
function getDailyScenarioIndex(dateStr) {
    let hash = 0;
    for (let i = 0; i < dateStr.length; i += 1) {
        hash = (hash * 31 + dateStr.charCodeAt(i)) % allScenarios.length;
    }
    return Math.abs(hash) % allScenarios.length;
}

/**
 * Merender Hero Banner "Skenario Hari Ini", menyesuaikan status
 * selesai/belum dari storage.
 */
function renderDailyHero() {
    const todayStr = new Date().toISOString().split("T")[0];
    const dailyStatus = window.SIAGA_STORAGE.getDailyStatus();

    let dailyScenario;
    if (dailyStatus.date === todayStr) {
        dailyScenario = allScenarios.find(s => s.id === dailyStatus.scenarioId) || allScenarios[0];
    } else {
        const index = getDailyScenarioIndex(todayStr);
        dailyScenario = allScenarios[index];
        window.SIAGA_STORAGE.setDailyStatus({ date: todayStr, scenarioId: dailyScenario.id, done: false });
    }

    const isDone = window.SIAGA_STORAGE.getDailyStatus().done;

    document.getElementById("daily-title").textContent = dailyScenario.title;
    document.getElementById("daily-situation-preview").textContent = dailyScenario.situation;
    document.getElementById("daily-cta-text").textContent = isDone ? "Sudah Diselesaikan Hari Ini ✓" : "Mulai Sekarang";

    const ctaBtn = document.getElementById("daily-cta");
    ctaBtn.disabled = isDone;
    ctaBtn.classList.toggle("opacity-60", isDone);
    ctaBtn.classList.toggle("pointer-events-none", isDone);
    ctaBtn.onclick = () => openSimulator(dailyScenario.id);
}

// ------------------------------------------------------------
// FILTER TAGS
// ------------------------------------------------------------

/**
 * Merender tombol filter kategori ("Semua" + tiap kategori di CATEGORY_META).
 */
function renderCategoryFilters() {
    const container = document.getElementById("category-filters");
    const categories = ["all", ...Object.keys(CATEGORY_META)];

    container.innerHTML = categories.map((key) => {
        const label = key === "all" ? "Semua" : CATEGORY_META[key].label;
        const isActive = key === activeFilter;
        const activeClass = isActive
            ? "bg-primary text-on-primary"
            : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high";
        return `<button type="button" data-filter="${key}"
                    class="${activeClass} font-body-sm px-space-md py-space-2xs rounded-full transition-colors">
                    ${label}
                </button>`;
    }).join("");

    container.querySelectorAll("[data-filter]").forEach((btn) => {
        btn.addEventListener("click", () => {
            activeFilter = btn.getAttribute("data-filter");
            renderCategoryFilters();
            renderScenarioGrid();
        });
    });
}

// ------------------------------------------------------------
// SCENARIO CARD GRID (renderer berbasis state, tanpa spaghetti DOM)
// ------------------------------------------------------------

/**
 * Merender grid kartu skenario sesuai filter aktif.
 */
function renderScenarioGrid() {
    const grid = document.getElementById("scenario-grid");
    const filtered = activeFilter === "all"
        ? allScenarios
        : allScenarios.filter(s => s.category === activeFilter);

    grid.innerHTML = filtered.map(buildScenarioCardHTML).join("");

    grid.querySelectorAll("[data-scenario-id]").forEach((card) => {
        card.addEventListener("click", () => {
            openSimulator(Number(card.getAttribute("data-scenario-id")));
        });
    });

    if (window.lucide) window.lucide.createIcons();
}

/**
 * Membuat markup HTML satu kartu skenario.
 * @param {object} scenario
 * @returns {string}
 */
function buildScenarioCardHTML(scenario) {
    const meta = CATEGORY_META[scenario.category];
    const isCompleted = window.SIAGA_STORAGE.isScenarioCompleted(scenario.id);

    return `
        <div data-scenario-id="${scenario.id}"
            class="bg-surface border border-outline-variant rounded-xl p-space-md cursor-pointer hover:border-primary hover:shadow-md transition-all relative">
            ${isCompleted ? `
                <span class="absolute top-space-xs right-space-xs bg-secondary-container text-on-secondary-container rounded-full p-space-2xs">
                    <i data-lucide="check" class="w-3.5 h-3.5"></i>
                </span>` : ""}
            <div class="flex items-center gap-space-2xs mb-space-sm">
                <span class="bg-surface-container text-on-surface-variant font-label-badge px-space-sm py-space-2xs rounded-full inline-flex items-center gap-space-2xs">
                    <i data-lucide="${meta.icon}" class="w-3.5 h-3.5"></i>${meta.label}
                </span>
                <span class="font-label-badge text-on-surface-variant">${scenario.difficulty}</span>
            </div>
            <h3 class="font-headline-sm text-on-surface mb-space-2xs">${scenario.title}</h3>
            <p class="font-body-sm text-on-surface-variant line-clamp-2 mb-space-sm">${scenario.situation}</p>
            <span class="font-label-badge text-primary">+${scenario.xp} XP</span>
        </div>
    `;
}

// ------------------------------------------------------------
// INTERACTIVE SIMULATOR (Situation -> Option -> Consequence -> Learning Bridge)
// ------------------------------------------------------------

/**
 * Membuka modal simulator untuk skenario tertentu dan menampilkan Stage 1 (Situation).
 * @param {number} scenarioId
 */
function openSimulator(scenarioId) {
    const scenario = allScenarios.find(s => s.id === scenarioId);
    if (!scenario) return;
    currentScenarioId = scenarioId;

    const meta = CATEGORY_META[scenario.category];
    document.getElementById("modal-category-badge").textContent = meta.label;
    document.getElementById("modal-title").textContent = scenario.title;
    document.getElementById("modal-situation").textContent = scenario.situation;

    const optionsContainer = document.getElementById("modal-options");
    optionsContainer.innerHTML = "";
    scenario.options.forEach((option, index) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "text-left font-body-md px-space-md py-space-sm rounded-lg border border-outline-variant " +
            "bg-surface hover:border-primary hover:bg-surface-container-low transition-all";
        btn.textContent = option.text;
        btn.addEventListener("click", () => handleOptionChoice(scenario, index));
        optionsContainer.appendChild(btn);
    });

    document.getElementById("stage-situation").classList.remove("hidden");
    document.getElementById("stage-feedback").classList.add("hidden");

    window.SIAGA_COMPONENTS.openModal("simulator-modal");
}

/**
 * Menangani pilihan pengguna: memberi XP/skill jika sudah pernah selesai
 * hanya XP pertama kali, mengecek badge, lalu menampilkan Stage 2 (Feedback).
 * @param {object} scenario
 * @param {number} optionIndex
 */
function handleOptionChoice(scenario, optionIndex) {
    const chosenOption = scenario.options[optionIndex];
    const alreadyCompleted = window.SIAGA_STORAGE.isScenarioCompleted(scenario.id);

    if (!alreadyCompleted) {
        window.SIAGA_STORAGE.markScenarioCompleted(scenario.id, chosenOption.correct);

        if (chosenOption.correct) {
            const meta = CATEGORY_META[scenario.category];
            window.SIAGA_STORAGE.updateSkillPoints(meta.skill, 5);
            const xpResult = window.SIAGA_STORAGE.addXP(scenario.xp);
            window.SIAGA_COMPONENTS.showToast(
                `Keputusan tepat! +${scenario.xp} XP${xpResult.leveledUp ? ` — Naik ke level ${xpResult.level}!` : ""}`,
                "success"
            );
        } else {
            window.SIAGA_COMPONENTS.showToast("Keputusan kurang tepat, tapi kamu belajar sesuatu yang penting.", "warning");
        }

        checkAndUnlockBadges(scenario.category);
        markDailyDoneIfMatch(scenario.id);
    }

    renderFeedbackStage(chosenOption);
    renderScenarioGrid(); // refresh badge "selesai" di grid
    renderDailyHero(); // refresh status hero jika skenario harian yang diselesaikan
}

/**
 * Menandai status daily survival sebagai selesai jika skenario yang
 * diselesaikan adalah skenario harian aktif.
 * @param {number} scenarioId
 */
function markDailyDoneIfMatch(scenarioId) {
    const dailyStatus = window.SIAGA_STORAGE.getDailyStatus();
    if (dailyStatus.scenarioId === scenarioId) {
        window.SIAGA_STORAGE.setDailyStatus({ ...dailyStatus, done: true });
    }
}

/**
 * Mengecek jumlah skenario selesai per kategori; unlock badge jika
 * ambang batas tercapai dan badge terkait tersedia di data.js.
 * @param {string} category
 */
function checkAndUnlockBadges(category) {
    const badgeId = CATEGORY_BADGE_MAP[category];
    if (!badgeId) return; // kategori "social" belum punya badge terdaftar

    const completed = window.SIAGA_STORAGE.getCompletedScenarios();
    const countInCategory = completed.filter((c) => {
        const s = allScenarios.find(sc => sc.id === c.scenarioId);
        return s && s.category === category && c.wasCorrect;
    }).length;

    if (countInCategory >= CATEGORY_BADGE_THRESHOLD && !window.SIAGA_STORAGE.hasBadge(badgeId)) {
        window.SIAGA_STORAGE.unlockBadge(badgeId);
        const badgeInfo = window.SIAGA_DATA.badges.find(b => b.id === badgeId);
        window.SIAGA_COMPONENTS.showToast(`Lencana baru terbuka: ${badgeInfo.title}!`, "success", 5000);
    }
}

/**
 * Merender Stage 2 modal: hasil keputusan, feedback, dan learning bridge.
 * @param {object} chosenOption
 */
function renderFeedbackStage(chosenOption) {
    document.getElementById("stage-situation").classList.add("hidden");
    document.getElementById("stage-feedback").classList.remove("hidden");

    const verdictBadge = document.getElementById("feedback-result-badge");
    const icon = document.getElementById("feedback-icon");
    const verdictText = document.getElementById("feedback-verdict");

    if (chosenOption.correct) {
        verdictBadge.className = "inline-flex items-center gap-space-2xs px-space-md py-space-xs rounded-full font-label-badge mb-space-md bg-secondary-container text-on-secondary-container";
        icon.setAttribute("data-lucide", "check-circle");
        verdictText.textContent = "Keputusan Tepat";
    } else {
        verdictBadge.className = "inline-flex items-center gap-space-2xs px-space-md py-space-xs rounded-full font-label-badge mb-space-md bg-error-container text-on-error-container";
        icon.setAttribute("data-lucide", "x-circle");
        verdictText.textContent = "Kurang Tepat";
    }

    document.getElementById("modal-feedback-text").textContent = chosenOption.feedback;
    document.getElementById("modal-learning-bridge").textContent =
        allScenarios.find(s => s.id === currentScenarioId).learningBridge;

    if (window.lucide) window.lucide.createIcons();
}

// ------------------------------------------------------------
// INIT
// ------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    window.SIAGA_STORAGE.initializeIfFirstVisit();
    renderDailyHero();
    renderCategoryFilters();
    renderScenarioGrid();
});