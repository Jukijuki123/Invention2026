// ============================================================
// js/storage.js
// Core Storage Engine — SIAGA
// Modul helper terisolasi untuk manipulasi LocalStorage.
// Semua fungsi lain di seluruh halaman WAJIB lewat modul ini,
// tidak boleh akses localStorage langsung di file lain (DRY & clean).
// ============================================================

const STORAGE_KEYS = {
    USER: "siaga_user",
    SCORE: "siaga_score",
    XP: "siaga_xp",
    LEVEL: "siaga_level",
    SKILLS: "siaga_skills",
    COMPLETED: "siaga_completed",
    BADGES: "siaga_badges",
    DAILY: "siaga_daily",
    CHALLENGE: "siaga_challenge",
    STORIES: "siaga_stories"
};

// ------------------------------------------------------------
// Level thresholds (sesuai PRD §9.2)
// ------------------------------------------------------------
const LEVEL_THRESHOLDS = [
    { min: 0, max: 199, name: "Digital Rookie" },
    { min: 200, max: 499, name: "Aware User" },
    { min: 500, max: 999, name: "Digital Defender" },
    { min: 1000, max: 1499, name: "Digital Detective" },
    { min: 1500, max: 2499, name: "Digital Guardian" },
    { min: 2500, max: Infinity, name: "Community Protector" }
];

// ------------------------------------------------------------
// Helper baca/tulis generik + fallback jika parsing gagal
// ------------------------------------------------------------
function readJSON(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        if (raw === null) return fallback;
        return JSON.parse(raw);
    } catch (err) {
        console.warn(`SIAGA storage: gagal membaca ${key}, pakai fallback.`, err);
        return fallback;
    }
}

function writeJSON(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (err) {
        console.error(`SIAGA storage: gagal menyimpan ${key}.`, err);
        return false;
    }
}

// ------------------------------------------------------------
// Inisialisasi otomatis untuk pengguna pertama kali
// ------------------------------------------------------------
function initializeIfFirstVisit() {
    if (localStorage.getItem(STORAGE_KEYS.USER) === null) {
        writeJSON(STORAGE_KEYS.USER, {
            name: "Pengguna SIAGA",
            joinedAt: new Date().toISOString()
        });
        writeJSON(STORAGE_KEYS.SCORE, null);
        writeJSON(STORAGE_KEYS.XP, 0);
        writeJSON(STORAGE_KEYS.LEVEL, LEVEL_THRESHOLDS[0].name);
        writeJSON(STORAGE_KEYS.SKILLS, {
            safety: 0,
            criticalThinking: 0,
            aiLiteracy: 0,
            financialSecurity: 0
        });
        writeJSON(STORAGE_KEYS.COMPLETED, []);
        writeJSON(STORAGE_KEYS.BADGES, []);
        writeJSON(STORAGE_KEYS.DAILY, { date: null, scenarioId: null, done: false });
        writeJSON(STORAGE_KEYS.CHALLENGE, { challengeId: null, progress: 0, done: false });
        writeJSON(STORAGE_KEYS.STORIES, []);
    }
}

// ------------------------------------------------------------
// USER PROFILE
// ------------------------------------------------------------
function getUserProfile() {
    initializeIfFirstVisit();
    return readJSON(STORAGE_KEYS.USER, {});
}

function updateUserProfile(patch) {
    const current = getUserProfile();
    return writeJSON(STORAGE_KEYS.USER, { ...current, ...patch });
}

// ------------------------------------------------------------
// CHECK-UP
// ------------------------------------------------------------
function saveCheckupResult({ score, skills, survivalType }) {
    initializeIfFirstVisit();
    writeJSON(STORAGE_KEYS.SCORE, score);
    writeJSON(STORAGE_KEYS.SKILLS, skills);
    updateUserProfile({ survivalType });
    return true;
}

function getCheckupResult() {
    return {
        score: readJSON(STORAGE_KEYS.SCORE, null),
        skills: readJSON(STORAGE_KEYS.SKILLS, {
            safety: 0, criticalThinking: 0, aiLiteracy: 0, financialSecurity: 0
        })
    };
}

// ------------------------------------------------------------
// XP & LEVEL
// ------------------------------------------------------------
function addXP(amount) {
    initializeIfFirstVisit();
    const currentXP = readJSON(STORAGE_KEYS.XP, 0);
    const newXP = currentXP + amount;
    writeJSON(STORAGE_KEYS.XP, newXP);

    const newLevel = LEVEL_THRESHOLDS.find(l => newXP >= l.min && newXP <= l.max)?.name
        ?? LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1].name;
    const previousLevel = readJSON(STORAGE_KEYS.LEVEL, LEVEL_THRESHOLDS[0].name);
    writeJSON(STORAGE_KEYS.LEVEL, newLevel);

    return {
        xp: newXP,
        level: newLevel,
        leveledUp: newLevel !== previousLevel
    };
}

function getXP() {
    return readJSON(STORAGE_KEYS.XP, 0);
}

function getLevel() {
    return readJSON(STORAGE_KEYS.LEVEL, LEVEL_THRESHOLDS[0].name);
}

// ------------------------------------------------------------
// SKILLS (per-kategori dari hasil scenario/lesson)
// ------------------------------------------------------------
function updateSkillPoints(skillKey, points) {
    const skills = readJSON(STORAGE_KEYS.SKILLS, {
        safety: 0, criticalThinking: 0, aiLiteracy: 0, financialSecurity: 0
    });
    skills[skillKey] = (skills[skillKey] || 0) + points;
    writeJSON(STORAGE_KEYS.SKILLS, skills);
    return skills;
}

function getSkills() {
    return readJSON(STORAGE_KEYS.SKILLS, {
        safety: 0, criticalThinking: 0, aiLiteracy: 0, financialSecurity: 0
    });
}

// ------------------------------------------------------------
// SCENARIO / LESSON COMPLETION
// ------------------------------------------------------------
function getCompletedScenarios() {
    return readJSON(STORAGE_KEYS.COMPLETED, []);
}

function markScenarioCompleted(scenarioId, wasCorrect) {
    const completed = getCompletedScenarios();
    if (!completed.some(c => c.scenarioId === scenarioId)) {
        completed.push({ scenarioId, wasCorrect, completedAt: new Date().toISOString() });
        writeJSON(STORAGE_KEYS.COMPLETED, completed);
    }
    return completed;
}

function isScenarioCompleted(scenarioId) {
    return getCompletedScenarios().some(c => c.scenarioId === scenarioId);
}

// ------------------------------------------------------------
// BADGES
// ------------------------------------------------------------
function getBadges() {
    return readJSON(STORAGE_KEYS.BADGES, []);
}

function unlockBadge(badgeId) {
    const current = getBadges();
    if (current.includes(badgeId)) return { alreadyUnlocked: true, badges: current };
    const updated = [...current, badgeId];
    writeJSON(STORAGE_KEYS.BADGES, updated);
    return { alreadyUnlocked: false, badges: updated };
}

function hasBadge(badgeId) {
    return getBadges().includes(badgeId);
}

// ------------------------------------------------------------
// DAILY SURVIVAL
// ------------------------------------------------------------
function getDailyStatus() {
    return readJSON(STORAGE_KEYS.DAILY, { date: null, scenarioId: null, done: false });
}

function setDailyStatus({ date, scenarioId, done }) {
    return writeJSON(STORAGE_KEYS.DAILY, { date, scenarioId, done });
}

// ------------------------------------------------------------
// WEEKLY CHALLENGE
// ------------------------------------------------------------
function getChallengeStatus() {
    return readJSON(STORAGE_KEYS.CHALLENGE, { challengeId: null, progress: 0, done: false });
}

function setChallengeStatus({ challengeId, progress, done }) {
    return writeJSON(STORAGE_KEYS.CHALLENGE, { challengeId, progress, done });
}

// ------------------------------------------------------------
// COMMUNITY STORIES (input pengguna, disimpan lokal)
// ------------------------------------------------------------
function getUserStories() {
    return readJSON(STORAGE_KEYS.STORIES, []);
}

function saveUserStory(story) {
    const stories = getUserStories();
    const newStory = {
        id: `user-${Date.now()}`,
        createdAt: new Date().toISOString(),
        helpfulCount: 0,
        isDefault: false,
        ...story
    };
    stories.unshift(newStory);
    writeJSON(STORAGE_KEYS.STORIES, stories);
    return newStory;
}

// ------------------------------------------------------------
// RESET (untuk keperluan testing / fitur "Reset Progress")
// ------------------------------------------------------------
function resetAllProgress() {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    initializeIfFirstVisit();
}

// ------------------------------------------------------------
// EXPORT
// ------------------------------------------------------------
window.SIAGA_STORAGE = {
    initializeIfFirstVisit,
    getUserProfile,
    updateUserProfile,
    saveCheckupResult,
    getCheckupResult,
    addXP,
    getXP,
    getLevel,
    updateSkillPoints,
    getSkills,
    getCompletedScenarios,
    markScenarioCompleted,
    isScenarioCompleted,
    getBadges,
    unlockBadge,
    hasBadge,
    getDailyStatus,
    setDailyStatus,
    getChallengeStatus,
    setChallengeStatus,
    getUserStories,
    saveUserStory,
    resetAllProgress
};