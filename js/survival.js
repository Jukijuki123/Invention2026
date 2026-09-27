// js/survival.js — Logic Halaman Survival — Dynamic Scenarios, Filters, & Interactive Evaluation Bergantung pada: windo...
document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const viewHub = document.getElementById("view-hub");
  const viewDrill = document.getElementById("view-drill");
  const viewResult = document.getElementById("view-result");

  const hubStreakEl = document.getElementById("hub-streak");
  const hubXpEl = document.getElementById("hub-xp");
  
  const heroTitleEl = document.getElementById("hero-title");
  const heroDescEl = document.getElementById("hero-desc");
  const btnHeroStart = document.getElementById("btn-hero-start");

  const categoryFilterBar = document.getElementById("category-filter-bar");
  const scenarioGridContainer = document.getElementById("scenario-grid-container");

  // Active Scenario Elements (Drill / Scenario view)
  const activeCatBadge = document.getElementById("active-cat-badge");
  const activeScenarioCode = document.getElementById("active-scenario-code");
  const activeScenarioXp = document.getElementById("active-scenario-xp");
  const countdownEl = document.getElementById("countdown");
  const activeDifficulty = document.getElementById("active-difficulty");
  const activeTitle = document.getElementById("active-title");
  const activeSituation = document.getElementById("active-situation");
  const decisionOptionsContainer = document.getElementById("decision-options");
  const submitBtn = document.getElementById("submit-btn");
  const btnSkipDrill = document.getElementById("btn-skip-drill");

  // Result View Elements
  const btnExitResult = document.getElementById("btn-exit-result");
  const btnBackHub = document.getElementById("btn-back-hub");
  const verdictBanner = document.getElementById("verdict-banner");
  const verdictIconBox = document.getElementById("verdict-icon-box");
  const resultIcon = document.getElementById("result-icon");
  const resultTitle = document.getElementById("result-title");
  const resultDesc = document.getElementById("result-desc");
  const resultLearning = document.getElementById("result-learning");

  // State Variables
  const allScenarios = (window.SIAGA_DATA && window.SIAGA_DATA.scenarios) ? window.SIAGA_DATA.scenarios : [];
  let currentCategory = "all";
  let currentScenario = null;
  let selectedOptionIndex = null;
  let timerInterval = null;
  let secondsLeft = 120;

  const CATEGORY_META = {
    safety: { label: "Keamanan Digital", icon: "shield", color: "text-primary" },
    information: { label: "Informasi & Berita", icon: "newspaper", color: "text-secondary" },
    ai: { label: "AI & Sintetis", icon: "smart_toy", color: "text-on-secondary-container" },
    finance: { label: "Finansial", icon: "credit_card", color: "text-primary-container" }
  };

  // PRD F-05: kategori skenario -> kunci skill di storage.js
  const CATEGORY_TO_SKILL = {
    safety: "safety",
    information: "criticalThinking",
    ai: "aiLiteracy",
    finance: "financialSecurity"
  };

  // ------------------------------------------------------------
  // INITIALIZATION
  // ------------------------------------------------------------
  function init() {
    updateTelemetry();
    renderHeroScenario();
    renderScenarioGrid();
    setupCategoryFilters();
    setupEventHandlers();
  }

  function updateTelemetry() {
    if (window.SIAGA_STORAGE) {
      const stats = window.SIAGA_STORAGE.getStats();
      if (hubXpEl) hubXpEl.textContent = `${stats.totalXp} XP`;
      if (hubStreakEl) hubStreakEl.textContent = `${stats.streak} Hari`;
    }
  }

  function renderHeroScenario() {
    if (allScenarios.length === 0) return;
    // PRD F-03: satu skenario baru setiap hari berbasis tanggal, bukan selalu [0]
    const todayStr = new Date().toISOString().split("T")[0];
    let daily = null;
    if (window.SIAGA_STORAGE) {
      daily = window.SIAGA_STORAGE.getDailyStatus();
    }
    let todayScenario = null;
    if (daily && daily.date === todayStr && daily.scenarioId != null) {
      todayScenario = allScenarios.find(s => s.id === daily.scenarioId) || allScenarios[0];
    } else {
      const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
      todayScenario = allScenarios[dayOfYear % allScenarios.length];
      if (window.SIAGA_STORAGE) {
        window.SIAGA_STORAGE.setDailyStatus({ date: todayStr, scenarioId: todayScenario.id, done: false });
      }
    }
    if (heroTitleEl) heroTitleEl.textContent = todayScenario.title;
    if (heroDescEl) heroDescEl.textContent = todayScenario.situation;
    if (btnHeroStart) {
      btnHeroStart.onclick = () => openScenario(todayScenario.id);
    }
  }

  // ------------------------------------------------------------
  // SCENARIO GRID & FILTERS
  // ------------------------------------------------------------
  function renderScenarioGrid() {
    if (!scenarioGridContainer) return;
    scenarioGridContainer.innerHTML = "";

    const filtered = currentCategory === "all"
      ? allScenarios
      : allScenarios.filter(s => s.category === currentCategory);

    if (filtered.length === 0) {
      scenarioGridContainer.innerHTML = `
        <div class="col-span-full py-space-2xl text-center text-on-surface-variant">
          Belum ada skenario untuk kategori ini.
        </div>
      `;
      return;
    }

    filtered.forEach(scenario => {
      const meta = CATEGORY_META[scenario.category] || { label: scenario.category, icon: "shield", color: "text-primary" };
      
      const card = document.createElement("div");
      card.className = "group bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between hover:-translate-y-1";
      card.innerHTML = `
        <div class="flex flex-col gap-space-sm">
          <div class="flex items-center justify-between">
            <span class="inline-flex items-center gap-1 px-space-xs py-space-2xs rounded-full bg-surface-container-high ${meta.color} font-label-caps text-[11px] font-bold tracking-wider">
              <span class="material-symbols-outlined text-[14px]">${meta.icon}</span>
              ${meta.label.toUpperCase()}
            </span>
            <span class="px-space-xs py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-caps text-[10px] font-bold">
              ${scenario.difficulty || "Sedang"}
            </span>
          </div>
          <div>
            <h3 class="font-headline-sm text-headline-sm text-on-surface font-bold group-hover:text-primary transition-colors">
              ${scenario.title}
            </h3>
            <p class="font-body-sm text-body-sm text-on-surface-variant mt-space-2xs line-clamp-2 leading-relaxed">
              ${scenario.situation}
            </p>
          </div>
        </div>
        <div class="pt-space-md mt-space-md flex items-center justify-between bg-surface-container-low/50 -mx-space-lg -mb-space-lg px-space-lg py-space-sm rounded-b-2xl">
          <div class="flex items-center gap-space-xs font-code-telemetry text-code-telemetry text-on-surface-variant">
            <span>2 min</span>
            <span>•</span>
            <span class="text-primary font-semibold">+${scenario.xp || 50} XP</span>
          </div>
          <button class="btn-start-scenario inline-flex items-center gap-1 font-headline-sm text-body-sm font-semibold text-primary group-hover:gap-2 transition-all cursor-pointer" data-id="${scenario.id}">
            <span>Mulai Skenario</span>
            <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      `;
      scenarioGridContainer.appendChild(card);
    });

    // Attach click listeners to "Mulai Skenario" buttons
    const startBtns = scenarioGridContainer.querySelectorAll(".btn-start-scenario");
    startBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = parseInt(e.currentTarget.getAttribute("data-id"));
        openScenario(id);
      });
    });
  }

  function setupCategoryFilters() {
    if (!categoryFilterBar) return;
    const tabs = categoryFilterBar.querySelectorAll(".cat-tab");
    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        tabs.forEach(t => {
          t.className = "cat-tab px-space-md py-space-xs rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface font-headline-sm text-body-sm font-medium flex items-center gap-space-xs shrink-0 transition-colors";
        });
        tab.className = "cat-tab px-space-md py-space-xs rounded-full bg-inverse-surface text-inverse-on-surface font-headline-sm text-body-sm font-semibold flex items-center gap-space-xs shrink-0 shadow-xs";

        currentCategory = tab.getAttribute("data-cat");
        renderScenarioGrid();
      });
    });
  }

  // ------------------------------------------------------------
  // SCENARIO SIMULATION / INTERACTION
  // ------------------------------------------------------------
  function openScenario(id) {
    currentScenario = allScenarios.find(s => s.id === id) || allScenarios[0];
    if (!currentScenario) return;

    selectedOptionIndex = null;
    if (submitBtn) submitBtn.disabled = true;

    // Populate scenario metadata
    const meta = CATEGORY_META[currentScenario.category] || { label: "Skenario", icon: "shield" };
    if (activeCatBadge) activeCatBadge.innerHTML = `<span class="material-symbols-outlined text-[15px]">${meta.icon}</span> ${meta.label.toUpperCase()}`;
    if (activeScenarioCode) activeScenarioCode.textContent = `SKENARIO_#0${currentScenario.id}`;
    if (activeScenarioXp) activeScenarioXp.textContent = `+${currentScenario.xp || 50} XP`;
    if (activeDifficulty) activeDifficulty.textContent = `SKENARIO ${currentScenario.difficulty ? currentScenario.difficulty.toUpperCase() : "SEDANG"}`;
    if (activeTitle) activeTitle.textContent = currentScenario.title;
    if (activeSituation) activeSituation.textContent = currentScenario.situation;

    // Render option cards
    renderOptions(currentScenario.options);

    // View Transition
    showView(viewDrill);
    startTimer();
  }

  function renderOptions(options) {
    if (!decisionOptionsContainer) return;
    decisionOptionsContainer.innerHTML = "";

    const labels = ["A", "B", "C", "D"];
    options.forEach((opt, idx) => {
      const letter = labels[idx] || (idx + 1);
      const optionCard = document.createElement("div");
      optionCard.className = "option-card group cursor-pointer p-5 rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all flex items-start gap-4 border border-transparent";
      optionCard.setAttribute("data-index", idx);
      
      optionCard.innerHTML = `
        <div class="badge-box shrink-0 w-10 h-10 rounded-xl bg-surface-container-low text-on-surface font-headline-md text-headline-sm font-bold flex items-center justify-center transition-colors">
          ${letter}
        </div>
        <div class="flex flex-col flex-grow">
          <h3 class="option-title font-headline-sm text-headline-sm font-semibold text-on-surface transition-colors">${opt.text}</h3>
        </div>
      `;

      optionCard.addEventListener("click", () => {
        const allCards = decisionOptionsContainer.querySelectorAll(".option-card");
        allCards.forEach(c => {
          c.classList.remove("border-primary", "bg-surface-container-low", "shadow-md");
          c.classList.add("bg-surface-container-lowest", "shadow-sm");
          const title = c.querySelector(".option-title");
          if (title) title.classList.remove("text-primary");
          const badge = c.querySelector(".badge-box");
          if (badge) {
            badge.classList.remove("bg-primary-container", "text-on-primary");
            badge.classList.add("bg-surface-container-low", "text-on-surface");
          }
        });

        optionCard.classList.add("border-primary", "bg-surface-container-low", "shadow-md");
        optionCard.classList.remove("bg-surface-container-lowest", "shadow-sm");
        const title = optionCard.querySelector(".option-title");
        if (title) title.classList.add("text-primary");
        const badge = optionCard.querySelector(".badge-box");
        if (badge) {
          badge.classList.add("bg-primary-container", "text-on-primary");
          badge.classList.remove("bg-surface-container-low", "text-on-surface");
        }

        selectedOptionIndex = idx;
        if (submitBtn) submitBtn.disabled = false;
      });

      decisionOptionsContainer.appendChild(optionCard);
    });
  }

  // ------------------------------------------------------------
  // SUBMIT & EVALUATION
  // ------------------------------------------------------------
  function submitDecision() {
    if (selectedOptionIndex === null || !currentScenario) return;
    stopTimer();

    const chosenOption = currentScenario.options[selectedOptionIndex];
    const isCorrect = chosenOption.correct;

    // PRD F-05: catat completion + skill + badge untuk benar maupun salah.
    // XP hanya diberikan saat keputusan benar agar insentif tetap bermakna.
    if (window.SIAGA_STORAGE) {
      window.SIAGA_STORAGE.markScenarioCompleted(currentScenario.id, isCorrect);
      const skillKey = CATEGORY_TO_SKILL[currentScenario.category];
      if (skillKey) {
        window.SIAGA_STORAGE.updateSkillPoints(skillKey, isCorrect ? 10 : 2);
      }
      // Tandai daily selesai jika skenario hari ini yang dikerjakan
      try {
        const todayStr = new Date().toISOString().split("T")[0];
        const daily = window.SIAGA_STORAGE.getDailyStatus();
        if (daily && daily.scenarioId === currentScenario.id && daily.date === todayStr && !daily.done) {
          window.SIAGA_STORAGE.setDailyStatus({ date: todayStr, scenarioId: currentScenario.id, done: true });
        }
      } catch (e) { /* abaikan, daily opsional */ }
      checkAndUnlockBadges();
    }

    if (verdictBanner && verdictIconBox && resultIcon && resultTitle && resultDesc) {
      if (isCorrect) {
        verdictBanner.className = "relative overflow-hidden rounded-2xl bg-[#E8F8F0] p-space-lg shadow-sm border border-[#0F6A44]/20";
        verdictIconBox.className = "shrink-0 w-12 h-12 rounded-xl bg-[#0F6A44]/15 flex items-center justify-center text-[#0F6A44]";
        resultIcon.textContent = "verified";
        resultTitle.textContent = "Refleks Pertahanan Optimal!";
        resultTitle.className = "font-headline-md text-headline-md font-bold text-[#0F6A44]";
        resultDesc.textContent = chosenOption.feedback || "Keputusanmu tepat! Kamu berhasil mengenali ancaman dan mengambil tindakan yang paling aman.";
        resultDesc.className = "font-body-md text-body-md text-[#0F6A44] leading-relaxed";

        if (window.SIAGA_STORAGE) {
          window.SIAGA_STORAGE.addXp(currentScenario.xp || 50);
          updateTelemetry();
        }
      } else {
        verdictBanner.className = "relative overflow-hidden rounded-2xl bg-error-container/40 p-space-lg shadow-sm border border-error/20";
        verdictIconBox.className = "shrink-0 w-12 h-12 rounded-xl bg-error/15 flex items-center justify-center text-error";
        resultIcon.textContent = "warning";
        resultTitle.textContent = "Tindakan Ini Berisiko!";
        resultTitle.className = "font-headline-md text-headline-md font-bold text-error";
        resultDesc.textContent = chosenOption.feedback || "Tindakan tersebut rentan terhadap risiko keamanan digital.";
        resultDesc.className = "font-body-md text-body-md text-error leading-relaxed";
        if (window.SIAGA_STORAGE) {
          updateTelemetry();
        }
      }
    }

    if (resultLearning) {
      resultLearning.textContent = currentScenario.learningBridge || "Cermati selalu ciri-ciri pesan dan permintaan tidak wajar sebelum bertindak.";
    }

    showView(viewResult);
  }

  // ------------------------------------------------------------
  // TIMER & HELPER FUNCTIONS
  // ------------------------------------------------------------
  function startTimer() {
    secondsLeft = 120;
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      if (secondsLeft > 0) {
        secondsLeft--;
        const mins = Math.floor(secondsLeft / 60).toString().padStart(2, "0");
        const secs = (secondsLeft % 60).toString().padStart(2, "0");
        if (countdownEl) countdownEl.textContent = `${mins}:${secs}`;
      } else {
        stopTimer();
      }
    }, 1000);
  }

  function stopTimer() {
    if (timerInterval) clearInterval(timerInterval);
  }

  // PRD §9.3: badge berbasis jumlah skenario per kategori yang selesai
  function checkAndUnlockBadges() {
    if (!window.SIAGA_STORAGE) return;
    const completed = window.SIAGA_STORAGE.getCompletedScenarios();
    if (completed.length >= 1) window.SIAGA_STORAGE.unlockBadge("first-decision");
    const countByCat = { safety: 0, information: 0, ai: 0, finance: 0 };
    completed.forEach(c => {
      const sc = allScenarios.find(s => s.id === c.scenarioId);
      if (sc && countByCat[sc.category] !== undefined) countByCat[sc.category] += 1;
    });
    if (countByCat.safety >= 5) window.SIAGA_STORAGE.unlockBadge("scam-survivor");
    if (countByCat.information >= 5) window.SIAGA_STORAGE.unlockBadge("fact-finder");
    if (countByCat.ai >= 5) window.SIAGA_STORAGE.unlockBadge("ai-detector");
    if (countByCat.finance >= 5) window.SIAGA_STORAGE.unlockBadge("safe-trader");
  }

  function showView(viewToShow) {
    [viewHub, viewDrill, viewResult].forEach(v => {
      if (v) v.classList.add("hidden");
    });
    if (viewToShow) viewToShow.classList.remove("hidden");
    window.scrollTo(0, 0);
  }

  function setupEventHandlers() {
    if (submitBtn) {
      submitBtn.addEventListener("click", submitDecision);
    }
    if (btnSkipDrill) {
      btnSkipDrill.addEventListener("click", () => {
        stopTimer();
        showView(viewHub);
      });
    }
    if (btnExitResult) {
      btnExitResult.addEventListener("click", () => {
        showView(viewHub);
      });
    }
    if (btnBackHub) {
      btnBackHub.addEventListener("click", () => {
        showView(viewHub);
      });
    }
  }

  // RUN INIT
  init();
});
