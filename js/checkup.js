// js/checkup.js — Logic Halaman Check-Up — Google Stitch Interactive Flow (Intro → Incident Drill Wizard → Diagnostic...
//
const VECTOR_META = {
    safety: {
        label: "Digital Safety",
        subtext: "Credentials & 2FA Protocol",
        icon: "lock_reset",
        colorClass: "bg-secondary-container"
    },
    criticalThinking: {
        label: "Information Literacy",
        subtext: "Fact-Checking & Misinformation",
        icon: "find_in_page",
        colorClass: "bg-error"
    },
    aiLiteracy: {
        label: "AI Literacy",
        subtext: "Deepfake & Synthetic Media",
        icon: "psychology",
        colorClass: "bg-primary-container"
    },
    financialSecurity: {
        label: "Digital Finance",
        subtext: "Payment Gateways & Scams",
        icon: "account_balance_wallet",
        colorClass: "bg-secondary-container"
    }
};

// Klasifikasi persona taktis berdasarkan skor akhir (4 vektor).
const PERSONA_TYPES = [
    {
        min: 0, max: 39,
        name: "Cautious Explorer",
        code: "CODE: GDN-05",
        icon: "explore",
        desc: "Kamu masih dalam tahap awal membangun kebiasaan siaga digital. Kamu rawan terkecoh oleh tekanan psikologis dan penawaran berbatas waktu."
    },
    {
        min: 40, max: 59,
        name: "Vigilant Navigator",
        code: "CODE: GDN-04",
        icon: "visibility",
        desc: "Kamu mulai waspada terhadap ancaman umum, namun kewaspadaanmu masih dapat goyah saat menghadapi taktik rekayasa sosial yang tersusun rapi."
    },
    {
        min: 60, max: 74,
        name: "Aware Defender",
        code: "CODE: GDN-03",
        icon: "shield_moon",
        desc: "Kamu peka terhadap ancaman digital dan terbiasa melakukan verifikasi awal sebelum mengambil tindakan berisiko tinggi."
    },
    {
        min: 75, max: 89,
        name: "Digital Guardian",
        code: "CODE: GDN-01",
        icon: "security",
        desc: "Refleks ketahanan digitalmu sangat tajam. Kamu memiliki naluri verifikasi yang kuat dan secara konsisten mampu menetralkan ancaman digital."
    },
    {
        min: 90, max: 100,
        name: "Cyber Warden",
        code: "CODE: GDN-00",
        icon: "verified_user",
        desc: "Level ketahanan digital tertinggi! Naluri proteksimu berada pada tingkat elit dan kamu mampu mengedukasi orang lain agar tetap aman di dunia maya."
    }
];

// State Variables
let currentIndex = 0;
let userAnswers = [];
let selectedOptionIndex = null;
let drillStartTime = null;
let questionTimer = 0;
let timerInterval = null;

// ISOLATED MODE HELPERS — Activates browser restrictions during the active quiz session: - Disables right-click context menu -...
//
function preventContextMenu(e) {
    e.preventDefault();
}

//
function preventIsolationKeys(e) {
    const blockedCombinations = [
        { ctrl: true, key: "c" },  // Copy
        { ctrl: true, key: "a" },  // Select All
        { ctrl: true, key: "u" },  // View Source
        { ctrl: true, key: "p" },  // Print
        { ctrl: true, key: "s" },  // Save Page
    ];

    const isBlocked = blockedCombinations.some(
        (combo) => e.ctrlKey && e.key.toLowerCase() === combo.key
    );

    if (isBlocked) {
        e.preventDefault();
    }
}

//
function enableIsolatedMode() {
    document.body.classList.add("checkup-isolated-mode");
    document.addEventListener("contextmenu", preventContextMenu);
    document.addEventListener("keydown", preventIsolationKeys);
}

//
function disableIsolatedMode() {
    document.body.classList.remove("checkup-isolated-mode");
    document.removeEventListener("contextmenu", preventContextMenu);
    document.removeEventListener("keydown", preventIsolationKeys);
}

const questions = window.SIAGA_DATA?.checkupQuestions || [];
const TOTAL_QUESTIONS = questions.length;

// DOM Elements
const dom = {
    introSection: document.getElementById("checkup-intro"),
    wizardSection: document.getElementById("checkup-wizard"),
    resultSection: document.getElementById("checkup-result"),
    btnStart: document.getElementById("btn-start-checkup"),
    btnExit: document.getElementById("btn-exit-checkup"),
    
    // Wizard
    questionCounter: document.getElementById("question-counter"),
    questionCategory: document.getElementById("question-category"),
    progressPercent: document.getElementById("progress-percent"),
    progressBarFill: document.getElementById("progress-bar-fill"),
    scenarioCard: document.getElementById("scenario-card"),
    urgencyText: document.getElementById("question-urgency"),
    incidentTag: document.getElementById("question-incident-tag"),
    timerDisplay: document.getElementById("timer-display"),
    questionText: document.getElementById("question-text"),
    snippetContainer: document.getElementById("snippet-container"),
    snippetText: document.getElementById("snippet-text"),
    optionsList: document.getElementById("options-list"),
    btnPrev: document.getElementById("btn-prev"),
    btnSkip: document.getElementById("btn-skip"),
    btnNext: document.getElementById("btn-next"),

    // Results
    sessionIdDisplay: document.getElementById("session-id-display"),
    scoreCounter: document.getElementById("scoreCounter"),
    scoreCircleBar: document.getElementById("score-circle-bar"),
    scoreStatusTag: document.getElementById("score-status-tag"),
    resultVerdictTitle: document.getElementById("result-verdict-title"),
    scenariosNeutralizedBadge: document.getElementById("scenarios-neutralized-badge"),
    vectorBarsContainer: document.getElementById("vector-bars-container"),
    personaIcon: document.getElementById("persona-icon"),
    personaCode: document.getElementById("persona-code"),
    resultPersonaName: document.getElementById("result-persona-name"),
    resultPersonaDesc: document.getElementById("result-persona-desc"),
    strongestVectorTitle: document.getElementById("strongest-vector-title"),
    strongestVectorDesc: document.getElementById("strongest-vector-desc"),
    weakestVectorTitle: document.getElementById("weakest-vector-title"),
    weakestVectorDesc: document.getElementById("weakest-vector-desc"),
    recommendationTitle: document.getElementById("recommendation-title"),
    recommendationDesc: document.getElementById("recommendation-desc"),
    recommendationLink: document.getElementById("recommendation-link"),
    retakeBtn: document.getElementById("retakeBtn"),
    shareBtn: document.getElementById("shareBtn")
};

// INITIALIZATION & EVENT LISTENERS
document.addEventListener("DOMContentLoaded", () => {
    if (window.SIAGA_STORAGE) {
        window.SIAGA_STORAGE.initializeIfFirstVisit();
    }

    if (dom.btnStart) {
        dom.btnStart.addEventListener("click", startCheckupDrill);
    }

    if (dom.btnNext) {
        dom.btnNext.addEventListener("click", handleNextClick);
    }

    if (dom.btnPrev) {
        dom.btnPrev.addEventListener("click", handlePrevClick);
    }

    if (dom.btnSkip) {
        dom.btnSkip.addEventListener("click", handleSkipClick);
    }

    if (dom.retakeBtn) {
        dom.retakeBtn.addEventListener("click", resetCheckupDrill);
    }

    if (dom.shareBtn) {
        dom.shareBtn.addEventListener("click", handleShareResults);
    }

    // Keyboard Shortcuts (1-4 to choose, Enter to Lock In)
    document.addEventListener("keydown", (e) => {
        if (dom.wizardSection && !dom.wizardSection.classList.contains("hidden")) {
            if (["1", "2", "3", "4"].includes(e.key)) {
                const optionIdx = parseInt(e.key, 10) - 1;
                const options = dom.optionsList.querySelectorAll("button");
                if (options[optionIdx]) {
                    options[optionIdx].click();
                }
            } else if (e.key === "Enter") {
                if (selectedOptionIndex !== null && dom.btnNext && !dom.btnNext.disabled) {
                    dom.btnNext.click();
                }
            }
        } else if (dom.introSection && !dom.introSection.classList.contains("hidden")) {
            if (e.key === "Enter" && dom.btnStart) {
                dom.btnStart.click();
            }
        }
    });
});

// DRILL FLOW LOGIC
function startCheckupDrill() {
    currentIndex = 0;
    userAnswers = [];
    selectedOptionIndex = null;
    drillStartTime = Date.now();

    dom.introSection.classList.add("hidden");
    dom.resultSection.classList.add("hidden");
    dom.wizardSection.classList.remove("hidden");

    // Activate browser isolated mode for undistracted quiz experience
    enableIsolatedMode();

    renderQuestion(currentIndex);
}

function renderQuestion(index) {
    const q = questions[index];
    if (!q) return;

    selectedOptionIndex = null;
    const existingAnswer = userAnswers.find(a => a.questionId === q.id);
    if (existingAnswer) {
        selectedOptionIndex = existingAnswer.optionIndex;
    }

    // Update Header Meta
    const incidentNum = String(index + 1).padStart(2, "0");
    dom.questionCounter.textContent = `Soal ${incidentNum} / ${String(TOTAL_QUESTIONS).padStart(2, "0")}`;
    dom.questionCategory.textContent = `• ${q.categoryLabel || "Digital Survival"}`;
    dom.urgencyText.textContent = q.urgency || "High Urgency Trigger";
    dom.incidentTag.textContent = `Skenario #${incidentNum}`;

    // Update Progress Bar
    const percent = Math.round(((index + 1) / TOTAL_QUESTIONS) * 100);
    dom.progressPercent.textContent = `${percent}%`;
    dom.progressBarFill.style.width = `${percent}%`;

    // Question Statement & Snippet
    dom.questionText.textContent = q.question;
    if (q.snippet) {
        dom.snippetContainer.classList.remove("hidden");
        dom.snippetText.textContent = q.snippet;
    } else {
        dom.snippetContainer.classList.add("hidden");
    }

    // Reset & Start Question Timer
    startQuestionTimer();

    // Render 4 Option Buttons (A, B, C, D)
    renderOptions(q, selectedOptionIndex);

    // Nav Buttons
    dom.btnPrev.disabled = index === 0;
    dom.btnNext.disabled = selectedOptionIndex === null;
    
    if (index === TOTAL_QUESTIONS - 1) {
        dom.btnNext.querySelector("span").textContent = "Lihat Hasil Diagnostic";
    } else {
        dom.btnNext.querySelector("span").textContent = "Kunci Pilihan";
    }

    // Card Animation
    dom.scenarioCard.classList.add("opacity-0", "translate-y-2");
    setTimeout(() => {
        dom.scenarioCard.classList.remove("opacity-0", "translate-y-2");
    }, 50);
}

function renderOptions(question, selectedIndex) {
    dom.optionsList.innerHTML = "";
    const letters = ["A", "B", "C", "D"];

    question.options.forEach((opt, idx) => {
        const letter = letters[idx] || String(idx + 1);
        const isSelected = selectedIndex === idx;

        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = getOptionButtonClasses(isSelected);
        btn.setAttribute("role", "radio");
        btn.setAttribute("aria-checked", String(isSelected));

        btn.innerHTML = `
            <div class="flex items-center gap-4">
                <div class="${isSelected ? 'bg-primary text-white' : 'bg-surface-container-low group-hover:bg-primary-fixed/60 text-on-surface group-hover:text-primary'} w-9 h-9 rounded-lg border border-outline-variant font-bold text-sm flex items-center justify-center shrink-0 transition-colors">
                    ${letter}
                </div>
                <div>
                    <div class="text-base md:text-lg font-semibold text-on-surface group-hover:text-on-surface tracking-tight flex items-center gap-2">
                        <span>${opt.text}</span>
                        ${isSelected ? '<span class="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-secondary-fixed text-on-secondary-fixed border border-secondary/40">Selected</span>' : ''}
                    </div>
                </div>
            </div>
            <div class="${isSelected ? 'bg-primary border-primary' : 'border-slate-300 group-hover:border-primary'} w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ml-3 transition-colors">
                ${isSelected ? '<span class="material-symbols-outlined text-white text-[16px]">check</span>' : '<div class="w-2.5 h-2.5 rounded-full bg-transparent group-hover:bg-primary/30 transition-colors"></div>'}
            </div>
        `;

        btn.addEventListener("click", () => handleSelectOption(idx));
        dom.optionsList.appendChild(btn);
    });
}

function getOptionButtonClasses(isSelected) {
    const base = "w-full text-left rounded-xl p-4 md:p-5 flex items-center justify-between transition-all duration-150 group focus:outline-none cursor-pointer ";
    if (isSelected) {
        return base + "bg-blue-50/40 border-2 border-primary shadow-active-glow ring-1 ring-primary/30";
    } else {
        return base + "bg-surface-container-lowest hover:bg-primary-fixed/30 border-2 border-outline-variant hover:border-primary/60 shadow-sm hover:shadow-card-hover";
    }
}

function handleSelectOption(optionIndex) {
    selectedOptionIndex = optionIndex;
    const q = questions[currentIndex];

    const existingIdx = userAnswers.findIndex(a => a.questionId === q.id);
    if (existingIdx >= 0) {
        userAnswers[existingIdx].optionIndex = optionIndex;
    } else {
        userAnswers.push({ questionId: q.id, optionIndex });
    }

    if (window.SIAGA_COMPONENTS?.triggerHapticFeedback) {
        window.SIAGA_COMPONENTS.triggerHapticFeedback("light");
    }

    renderOptions(q, selectedOptionIndex);
    dom.btnNext.disabled = false;
}

function handleNextClick() {
    if (selectedOptionIndex === null) return;

    if (currentIndex < TOTAL_QUESTIONS - 1) {
        currentIndex += 1;
        renderQuestion(currentIndex);
    } else {
        finishCheckupDrill();
    }
}

function handlePrevClick() {
    if (currentIndex > 0) {
        currentIndex -= 1;
        renderQuestion(currentIndex);
    }
}

function handleSkipClick() {
    if (currentIndex < TOTAL_QUESTIONS - 1) {
        currentIndex += 1;
        renderQuestion(currentIndex);
    } else {
        finishCheckupDrill();
    }
}

function startQuestionTimer() {
    questionTimer = 0;
    if (timerInterval) clearInterval(timerInterval);
    
    dom.timerDisplay.textContent = `Waktu Keputusan: 0s`;
    timerInterval = setInterval(() => {
        questionTimer += 1;
        dom.timerDisplay.textContent = `Waktu Keputusan: ${questionTimer}s`;
    }, 1000);
}

// CALCULATE & RENDER DIAGNOSTIC RESULTS
function calculateResults() {
    const vectors = { safety: 0, criticalThinking: 0, aiLiteracy: 0, financialSecurity: 0 };
    const maxVectors = { safety: 0, criticalThinking: 0, aiLiteracy: 0, financialSecurity: 0 };

    questions.forEach((q) => {
        // Find max possible points per vector for this question
        const maxPerVectorThisQuestion = {};
        q.options.forEach((opt) => {
            Object.entries(opt.points || {}).forEach(([vec, pts]) => {
                maxPerVectorThisQuestion[vec] = Math.max(maxPerVectorThisVectorThisQuestion(vec, pts, maxPerVectorThisQuestion), pts);
            });
        });

        Object.entries(maxPerVectorThisQuestion).forEach(([vec, maxPts]) => {
            maxVectors[vec] = (maxVectors[vec] || 0) + maxPts;
        });

        // Add user selected points
        const userAns = userAnswers.find(a => a.questionId === q.id);
        if (userAns) {
            const chosenOpt = q.options[userAns.optionIndex];
            if (chosenOpt && chosenOpt.points) {
                Object.entries(chosenOpt.points).forEach(([vec, pts]) => {
                    vectors[vec] = (vectors[vec] || 0) + pts;
                });
            }
        }
    });

    // Calculate percentages
    const vectorPercents = {};
    Object.keys(maxVectors).forEach((vec) => {
        const max = maxVectors[vec] || 2;
        vectorPercents[vec] = Math.round(((vectors[vec] || 0) / max) * 100);
    });

    // Overall Score = average of non-zero vectors
    const vecValues = Object.values(vectorPercents);
    const overallScore = Math.round(vecValues.reduce((sum, v) => sum + v, 0) / vecValues.length);

    return { vectorPercents, overallScore };
}

function maxPerVectorThisVectorThisQuestion(vec, pts, map) {
    return map[vec] || 0;
}

function determinePersona(score) {
    return PERSONA_TYPES.find(p => score >= p.min && score <= p.max) || PERSONA_TYPES[0];
}

function finishCheckupDrill() {
    if (timerInterval) clearInterval(timerInterval);

    if (userAnswers.length === 0) {
        if (window.SIAGA_COMPONENTS?.showToast) {
            window.SIAGA_COMPONENTS.showToast("Jawab minimal 1 soal dulu sebelum melihat hasil.", "warning");
        }
        currentIndex = 0;
        renderQuestion(currentIndex);
        return;
    }

    // Disable isolation: user has completed the quiz
    disableIsolatedMode();

    const { vectorPercents, overallScore } = calculateResults();
    const persona = determinePersona(overallScore);

    // Save to LocalStorage & Award 100 XP
    if (window.SIAGA_STORAGE) {
        window.SIAGA_STORAGE.saveCheckupResult({
            score: overallScore,
            skills: vectorPercents,
            survivalType: persona.name
        });
        window.SIAGA_STORAGE.addXP(100);
    }

    renderResults({ overallScore, vectorPercents, persona });

    if (window.SIAGA_COMPONENTS?.showToast) {
        window.SIAGA_COMPONENTS.showToast("Check-Up Selesai! +100 XP ditambahkan ke akunmu.", "success");
    }
}

function renderResults({ overallScore, vectorPercents, persona }) {
    dom.wizardSection.classList.add("hidden");
    dom.resultSection.classList.remove("hidden");

    // Session ID
    const randomSession = "SG-" + Math.floor(1000 + Math.random() * 9000) + "-A";
    dom.sessionIdDisplay.textContent = `SESSION_ID: #${randomSession}`;

    // Jumlah skenario yang dijawab (dinamis mengikuti TOTAL_QUESTIONS)
    if (dom.scenariosNeutralizedBadge) {
        dom.scenariosNeutralizedBadge.innerHTML = `<span class="material-symbols-outlined text-[16px] text-emerald-400">task_alt</span><span>${userAnswers.length} dari ${TOTAL_QUESTIONS} Skenario Dinilai</span>`;
    }

    // Score Counter Animation
    animateScoreCounter(overallScore);

    // Persona Setup
    dom.personaIcon.textContent = persona.icon;
    dom.personaCode.textContent = persona.code;
    dom.resultPersonaName.textContent = persona.name;
    dom.resultPersonaDesc.textContent = persona.desc;

    // Vector Breakdown Bars
    renderVectorBars(vectorPercents);

    // Identify Strongest & Weakest Vector
    const sortedVectors = Object.entries(vectorPercents).sort((a, b) => b[1] - a[1]);
    const strongest = sortedVectors[0];
    const weakest = sortedVectors[sortedVectors.length - 1];

    const strongMeta = VECTOR_META[strongest[0]] || { label: strongest[0] };
    const weakMeta = VECTOR_META[weakest[0]] || { label: weakest[0] };

    dom.strongestVectorTitle.textContent = `Keunggulan Utama: ${strongMeta.label} (${strongest[1]}%)`;
    dom.strongestVectorDesc.textContent = `Memiliki respon cepat & verifikasi tajam pada skenario ${strongMeta.label.toLowerCase()}.`;

    dom.weakestVectorTitle.textContent = `Area Rentan: ${weakMeta.label} (${weakest[1]}%)`;
    dom.weakestVectorDesc.textContent = `Masih memiliki celah risiko yang dapat diperkuat lewat modul ${weakMeta.label}.`;

    // Prescriptive Recommendation
    const recommendedLesson = window.SIAGA_DATA?.lessons?.find(l => l.skillTag === weakest[0]) || window.SIAGA_DATA?.lessons?.[0];
    if (recommendedLesson) {
        dom.recommendationTitle.textContent = `Latihan Penguatan: ${recommendedLesson.title}`;
        dom.recommendationDesc.textContent = `Berdasarkan analisis hasil diagnostik, modul "${recommendedLesson.title}" difokuskan untuk memperkuat titik rentan ${weakMeta.label} milikmu.`;
        dom.recommendationLink.href = `learn.html?lesson=${recommendedLesson.id}`;
    }

    if (window.lucide) window.lucide.createIcons();
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function animateScoreCounter(targetScore) {
    let current = 0;
    const duration = 1000;
    const step = Math.ceil(targetScore / 40);

    const interval = setInterval(() => {
        current += step;
        if (current >= targetScore) {
            current = targetScore;
            clearInterval(interval);
        }
        dom.scoreCounter.textContent = current;
    }, 25);

    // Circular SVG dash offset
    const maxDash = 440;
    const offset = maxDash - (maxDash * (targetScore / 100));
    dom.scoreCircleBar.style.strokeDashoffset = offset;
}

function renderVectorBars(vectorPercents) {
    dom.vectorBarsContainer.innerHTML = "";

    Object.entries(vectorPercents).forEach(([key, score]) => {
        const meta = VECTOR_META[key] || { label: key, subtext: "", icon: "shield", colorClass: "bg-primary" };
        
        let tagText = "Solid Awareness";
        let tagClass = "text-primary font-medium";
        if (score >= 80) {
            tagText = "Advanced Defense";
            tagClass = "text-secondary font-medium";
        } else if (score < 65) {
            tagText = "Needs Reinforcement";
            tagClass = "text-error font-medium";
        }

        const barRow = document.createElement("div");
        barRow.className = score < 65 ? "group p-2.5 -mx-2.5 rounded-xl bg-rose-50/60 border border-rose-100" : "group";

        barRow.innerHTML = `
            <div class="flex items-center justify-between mb-1.5">
                <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-lg ${score < 65 ? 'bg-rose-100 text-rose-600' : 'bg-surface-container text-primary'} flex items-center justify-center shrink-0">
                        <span class="material-symbols-outlined text-[18px]">${meta.icon}</span>
                    </div>
                    <div>
                        <span class="font-headline-sm text-body-md font-semibold text-on-surface block">${meta.label}</span>
                        <span class="font-code-telemetry text-label-badge ${score < 65 ? 'text-rose-600 font-semibold' : 'text-on-surface-variant'}">${meta.subtext}</span>
                    </div>
                </div>
                <div class="text-right">
                    <div class="flex items-baseline justify-end gap-1">
                        <span class="font-headline-sm text-headline-sm ${score < 65 ? 'text-rose-600' : 'text-on-surface'} font-bold">${score}</span>
                        <span class="text-on-surface-variant text-body-sm">/100</span>
                    </div>
                    <span class="text-label-badge font-label-badge ${tagClass}">${tagText}</span>
                </div>
            </div>
            <div class="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div class="h-full rounded-full ${score < 65 ? 'bg-rose-500' : meta.colorClass} transition-all duration-1000 ease-out" style="width: 0%;" data-width="${score}%"></div>
            </div>
        `;

        dom.vectorBarsContainer.appendChild(barRow);
    });

    // Animate progress bar widths
    requestAnimationFrame(() => {
        setTimeout(() => {
            dom.vectorBarsContainer.querySelectorAll("[data-width]").forEach((bar) => {
                bar.style.width = bar.getAttribute("data-width");
            });
        }, 100);
    });
}

function resetCheckupDrill() {
    disableIsolatedMode();
    startCheckupDrill();
}

function handleShareResults() {
    const scoreText = dom.scoreCounter ? dom.scoreCounter.textContent : "";
    const personaText = dom.resultPersonaName ? dom.resultPersonaName.textContent : "";
    const shareData = {
        title: "Hasil Check-Up SIAGA",
        text: `Skor SIAGA-ku ${scoreText}/100 (${personaText}). Cek kesiapsiagaan digitalmu juga!`,
        url: window.location.href
    };
    const flashCopied = () => {
        const originalText = dom.shareBtn.innerHTML;
        dom.shareBtn.innerHTML = `<span class="material-symbols-outlined text-[18px]">check</span> Tautan Tersalin!`;
        setTimeout(() => {
            dom.shareBtn.innerHTML = originalText;
        }, 2000);
    };
    if (navigator.share) {
        navigator.share(shareData).catch(() => { /* dibatalkan pengguna */ });
        return;
    }
    if (!navigator.clipboard || !navigator.clipboard.writeText) {
        alert("Salin link halaman ini untuk membagikan hasil Check-Up kamu!");
        return;
    }
    navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`).then(flashCopied).catch(() => {
        alert("Salin link halaman ini untuk membagikan hasil Check-Up kamu!");
    });
}
