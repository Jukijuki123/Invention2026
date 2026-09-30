document.addEventListener("DOMContentLoaded", () => {
  // DOM — hero
  const viewStart = document.getElementById("view-start");
  const viewDrill = document.getElementById("view-drill");
  const viewResult = document.getElementById("view-result");

  const challengeTitle = document.getElementById("challenge-title");
  const challengeDesc = document.getElementById("challenge-desc");
  const challengeList = document.getElementById("challenge-list");
  const challengeProgressText = document.getElementById("challenge-progress-text");
  const challengeProgressBar = document.getElementById("challenge-progress-bar");
  const challengeStatusNote = document.getElementById("challenge-status-note");
  const challengeRewardLabel = document.getElementById("challenge-reward-label");
  const btnStartChallenge = document.getElementById("btn-start-challenge");

  // DOM — misi harian & library (pengganti halaman Survival)
  const dailyTitleEl = document.getElementById("daily-title");
  const dailyDescEl = document.getElementById("daily-desc");
  const btnDailyStart = document.getElementById("btn-daily-start");
  const dailyStatusEl = document.getElementById("daily-status");
  const libraryFilterBar = document.getElementById("library-filter-bar");
  const scenarioGrid = document.getElementById("scenario-grid");
  const drillMissionBar = document.getElementById("drill-mission-bar");
  const drillProgressWrap = document.getElementById("drill-progress-wrap");
  const btnToLibrary = document.getElementById("btn-to-library");

  // DOM — drill
  const challengeCounter = document.getElementById("challenge-counter");
  const drillProgressBar = document.getElementById("drill-progress-bar");
  const drillScoreLabel = document.getElementById("drill-score-label");
  const activeCategory = document.getElementById("active-category");
  const activeTitle = document.getElementById("active-title");
  const activeSituation = document.getElementById("active-situation");
  const activeMeta = document.getElementById("active-meta");
  const drillFrame = document.getElementById("drill-frame");
  const btnFeedbackToggle = document.getElementById("btn-feedback-toggle");
  const decisionOptions = document.getElementById("decision-options");
  const submitBtn = document.getElementById("submit-btn");
  const btnNext = document.getElementById("btn-next");
  const btnQuitChallenge = document.getElementById("btn-quit-challenge");
  const feedbackBox = document.getElementById("feedback-box");
  const feedbackIcon = document.getElementById("feedback-icon");
  const feedbackTitle = document.getElementById("feedback-title");
  const feedbackDesc = document.getElementById("feedback-desc");
  const feedbackLearning = document.getElementById("feedback-learning");

  // DOM — result
  const resultTitle = document.getElementById("result-title");
  const resultDesc = document.getElementById("result-desc");
  const resultScore = document.getElementById("result-score");
  const resultXp = document.getElementById("result-xp");
  const resultBadge = document.getElementById("result-badge");
  const resultSummary = document.getElementById("result-summary");
  const btnRetry = document.getElementById("btn-retry");

  // DOM — toast
  const toast = document.getElementById("toast");
  const toastText = document.getElementById("toast-text");
  let toastTimer = null;

  // Data: ambil weeklyChallenges[0], resolve scenarioIds -> scenarios
  const store = window.SIAGA_STORAGE || null;
  const data = window.SIAGA_DATA || {};
  const challenge = (data.weeklyChallenges && data.weeklyChallenges[0]) || {
    id: 1,
    title: "Minggu Ketahanan Digital #1",
    description: "Hadapi 5 skenario campuran untuk menguji seluruh skill SIAGA-mu minggu ini.",
    scenarioIds: [1, 3, 4, 5, 7],
    rewardXp: 250,
    rewardBadgeId: "digital-guardian"
  };
  const allScenarios = data.scenarios || [];
  const missionScenarios = (challenge.scenarioIds || []).map((sid) =>
    allScenarios.find((s) => s.id === sid)
  ).filter(Boolean);

  // State
  let index = 0;
  let score = 0;
  let selectedOptionIndex = null;
  let answered = false;
  let answers = [];
  let drillMode = "mission";
  let singleScenario = null;
  let currentCategory = "all";

  // Feedback multisensori: suara (Web Audio, tanpa file) + getar.
  // Menghormati toggle pengguna & prefers-reduced-motion via components.js.
  function buzz(style) {
    try {
      if (window.SIAGA_COMPONENTS && window.SIAGA_COMPONENTS.triggerHapticFeedback) {
        window.SIAGA_COMPONENTS.triggerHapticFeedback(style || "light");
      }
    } catch (e) { /* abaikan */ }
  }

  function beep(style) {
    try {
      if (window.SIAGA_COMPONENTS && window.SIAGA_COMPONENTS.triggerSoundFeedback) {
        window.SIAGA_COMPONENTS.triggerSoundFeedback(style || "tap");
      }
    } catch (e) { /* abaikan */ }
  }

  function floatXp(text) {
    if (!drillFrame) return;
    const chip = document.createElement("span");
    chip.className = "xp-float";
    chip.textContent = text;
    chip.setAttribute("aria-hidden", "true");
    drillFrame.appendChild(chip);
    chip.addEventListener("animationend", () => chip.remove());
    setTimeout(() => { if (chip.parentNode) chip.remove(); }, 1500);
  }

  function refreshFeedbackToggle() {
    if (!btnFeedbackToggle) return;
    let on = true;
    try {
      if (window.SIAGA_COMPONENTS && window.SIAGA_COMPONENTS.isFeedbackEnabled) {
        on = window.SIAGA_COMPONENTS.isFeedbackEnabled();
      }
    } catch (e) { /* abaikan */ }
    const icon = btnFeedbackToggle.querySelector(".material-symbols-outlined");
    if (icon) icon.textContent = on ? "volume_up" : "volume_off";
    btnFeedbackToggle.setAttribute("aria-pressed", String(on));
  }

  //  Helpers 
  function showToast(msg) {
    if (!toast || !toastText) return;
    toastText.textContent = msg;
    toast.classList.remove("hidden");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.add("hidden"), 3200);
  }

  function showView(view) {
    [viewStart, viewDrill, viewResult].forEach((v) => {
      if (!v) return;
      v.classList.add("hidden");
      v.classList.remove("flex");
    });
    if (view) {
      view.classList.remove("hidden");
      if (view === viewStart) view.classList.add("flex");
      if (view === viewDrill) view.classList.add("flex");
      if (view === viewResult) view.classList.add("flex");
    }
    window.scrollTo(0, 0);
  }

  function refreshHeroProgress() {
    const status = store ? store.getChallengeStatus() : { challengeId: null, progress: 0, done: false };
    const sameMission = status && status.challengeId === challenge.id;
    const progress = sameMission ? (status.progress || 0) : 0;
    const total = missionScenarios.length || 5;
    if (challengeProgressText) challengeProgressText.textContent = `${Math.min(progress, total)}/${total}`;
    if (challengeProgressBar) challengeProgressBar.style.width = `${Math.min(100, (progress / total) * 100)}%`;
    if (challengeStatusNote) {
      challengeStatusNote.textContent = status && status.done && sameMission
        ? "Misi minggu ini sudah selesai. Kamu bisa mengulanginya untuk latihan."
        : "Progres tersimpan otomatis setiap jawaban.";
    }
    if (btnStartChallenge) {
      btnStartChallenge.querySelector("span").textContent =
        progress > 0 && !status.done ? "Mulai Ulang Misi" : (status.done ? "Ulangi Misi" : "Mulai Misi");
    }
  }

  function renderHero() {
    if (challengeTitle) challengeTitle.textContent = challenge.title;
    if (challengeDesc) challengeDesc.textContent = challenge.description;
    if (challengeRewardLabel) challengeRewardLabel.textContent = `Hadiah: +${challenge.rewardXp || 250} XP`;
    if (!challengeList) return;
    challengeList.innerHTML = "";
    missionScenarios.forEach((sc, i) => {
      const card = document.createElement("div");
      card.className = "bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm flex flex-col gap-space-sm";
      card.innerHTML = `
        <div class="flex items-center justify-between">
          <span class="px-3 py-1 rounded-full bg-surface-container-high text-on-surface font-label-caps text-label-caps font-bold">MISI ${i + 1}</span>
          <span class="text-[11px] font-bold text-primary">+${sc.xp || 50} XP</span>
        </div>
        <h3 class="font-bold">${sc.title}</h3>
        <p class="text-sm text-on-surface-variant line-clamp-2 leading-relaxed">${sc.situation}</p>
        <span class="text-[11px] uppercase tracking-widest text-on-surface-variant font-bold">${sc.category || ""}</span>
      `;
      challengeList.appendChild(card);
    });
    refreshHeroProgress();
  }

  // Misi harian & library
  const CATEGORY_META = {
    safety: { label: "Keamanan Digital", icon: "shield" },
    information: { label: "Informasi & Berita", icon: "newspaper" },
    ai: { label: "AI & Sintetis", icon: "smart_toy" },
    finance: { label: "Finansial", icon: "credit_card" }
  };
  const CATEGORY_TO_SKILL = {
    safety: "safety",
    information: "criticalThinking",
    ai: "aiLiteracy",
    finance: "financialSecurity"
  };

  function todayDaily() {
    if (!allScenarios.length) return null;
    const now = new Date();
    const doy = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
    return allScenarios[doy % allScenarios.length];
  }

  function renderDaily() {
    const d = todayDaily();
    if (!d) return;
    if (dailyTitleEl) dailyTitleEl.textContent = d.title;
    if (dailyDescEl) dailyDescEl.textContent = d.situation;
    const todayStr = new Date().toISOString().split("T")[0];
    const daily = store ? store.getDailyStatus() : null;
    const done = daily && daily.date === todayStr && daily.scenarioId === d.id && daily.done;
    if (dailyStatusEl) {
      dailyStatusEl.textContent = done
        ? "Selesai hari ini — ulangi untuk latihan."
        : `+${d.xp || 50} XP • ±2 menit`;
    }
  }

  function renderLibrary() {
    if (!scenarioGrid) return;
    scenarioGrid.innerHTML = "";
    const list = currentCategory === "all"
      ? allScenarios
      : allScenarios.filter((s) => s.category === currentCategory);
    if (!list.length) {
      scenarioGrid.innerHTML = '<p class="col-span-full py-space-xl text-center text-on-surface-variant">Belum ada skenario pada kategori ini.</p>';
      return;
    }
    list.forEach((sc) => {
      const meta = CATEGORY_META[sc.category] || { label: sc.category, icon: "shield" };
      const card = document.createElement("div");
      card.className = "bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm hover:shadow-md transition-all flex flex-col gap-space-sm hover:-translate-y-1";
      card.innerHTML =
        '<div class="flex items-center justify-between gap-2">' +
        `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface font-label-caps text-label-badge font-bold uppercase"><span class="material-symbols-outlined text-[15px]">${meta.icon}</span>${meta.label}</span>` +
        `<span class="text-[11px] font-bold text-primary">+${sc.xp || 50} XP</span>` +
        "</div>" +
        `<h3 class="font-bold">${sc.title}</h3>` +
        `<p class="text-sm text-on-surface-variant line-clamp-2 leading-relaxed">${sc.situation}</p>` +
        `<button type="button" data-id="${sc.id}" class="btn-start-scenario mt-auto self-start inline-flex items-center gap-1 font-headline-sm text-body-sm font-semibold text-primary">Mulai Skenario<span class="material-symbols-outlined text-[16px]">arrow_forward</span></button>`;
      scenarioGrid.appendChild(card);
    });
    scenarioGrid.querySelectorAll(".btn-start-scenario").forEach((btn) => {
      btn.addEventListener("click", () => openSingle(parseInt(btn.getAttribute("data-id"), 10)));
    });
  }

  function setupLibraryFilters() {
    if (!libraryFilterBar) return;
    const tabs = libraryFilterBar.querySelectorAll(".cat-tab");
    const idle = "cat-tab px-space-md py-space-xs rounded-full bg-surface-container-low hover:bg-surface-container font-headline-sm text-body-sm font-medium shrink-0 transition-colors flex items-center gap-1.5";
    const on = "cat-tab px-space-md py-space-xs rounded-full bg-inverse-surface text-inverse-on-surface font-headline-sm text-body-sm font-semibold shrink-0 shadow-xs flex items-center gap-1.5";
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((x) => { x.className = idle; });
        tab.className = on;
        currentCategory = tab.getAttribute("data-cat");
        renderLibrary();
      });
    });
  }

  function openSingle(id) {
    const sc = allScenarios.find((s) => s.id === id);
    if (!sc) return;
    shuffleInPlace(sc.options || []);
    drillMode = "single";
    singleScenario = sc;
    selectedOptionIndex = null;
    answered = false;
    const meta = CATEGORY_META[sc.category] || { label: sc.category, icon: "shield" };
    if (drillMissionBar) drillMissionBar.style.display = "none";
    if (drillProgressWrap) drillProgressWrap.style.display = "none";
    if (challengeCounter) challengeCounter.textContent = "Latihan Bebas";
    if (activeCategory) activeCategory.textContent = meta.label.toUpperCase();
    if (activeTitle) activeTitle.textContent = sc.title;
    if (activeSituation) activeSituation.textContent = sc.situation;
    if (activeMeta) activeMeta.textContent = `${sc.difficulty || "Sedang"} • +${sc.xp || 50} XP`;
    if (feedbackBox) feedbackBox.classList.add("hidden");
    if (submitBtn) { submitBtn.disabled = true; submitBtn.classList.remove("hidden"); }
    if (btnNext) btnNext.classList.add("hidden");
    renderOptions(sc);
    showView(viewDrill);
  }

  function awardSingle(sc, isCorrect) {
    if (!store) return;
    store.markScenarioCompleted(sc.id, isCorrect);
    const skill = CATEGORY_TO_SKILL[sc.category];
    if (skill && store.updateSkillPoints) store.updateSkillPoints(skill, isCorrect ? 10 : 2);
    try {
      const todayStr = new Date().toISOString().split("T")[0];
      const today = todayDaily();
      if (today && sc.id === today.id) {
        store.setDailyStatus({ date: todayStr, scenarioId: today.id, done: true });
      }
    } catch (e) { /* daily opsional */ }
    checkAndUnlockBadges();
    if (isCorrect) {
      store.addXp(sc.xp || 50);
      showToast(`Keputusan tepat! +${sc.xp || 50} XP.`);
    } else {
      showToast("Belum tepat — baca umpan baliknya lalu coba lagi.");
    }
    renderDaily();
  }

  function checkAndUnlockBadges() {
    if (!store || !store.unlockBadge) return;
    const done = store.getCompletedScenarios();
    if (done.length >= 1) store.unlockBadge("first-decision");
    const n = { safety: 0, information: 0, ai: 0, finance: 0 };
    done.forEach((c) => {
      const s = allScenarios.find((x) => x.id === c.scenarioId);
      if (s && n[s.category] !== undefined) n[s.category] += 1;
    });
    if (n.safety >= 5) store.unlockBadge("scam-survivor");
    if (n.information >= 5) store.unlockBadge("fact-finder");
    if (n.ai >= 5) store.unlockBadge("ai-detector");
    if (n.finance >= 5) store.unlockBadge("safe-trader");
  }

  // Fisher-Yates: acak urutan opsi agar posisi jawaban benar
  // berbeda tiap sesi (anti-contekan positional).
  function shuffleInPlace(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  //  Drill 
  function startChallenge() {
    drillMode = "mission";
    singleScenario = null;
    if (drillMissionBar) drillMissionBar.style.display = "";
    if (drillProgressWrap) drillProgressWrap.style.display = "";
    missionScenarios.forEach((s) => shuffleInPlace(s.options || []));
    index = 0;
    score = 0;
    answers = [];
    if (store) {
      const prev = store.getChallengeStatus();
      if (!prev || prev.challengeId !== challenge.id) {
        store.setChallengeStatus({ challengeId: challenge.id, progress: 0, done: false });
      }
    }
    renderScenario();
    showView(viewDrill);
  }

  function renderScenario() {
    const sc = missionScenarios[index];
    if (!sc) { finishChallenge(); return; }
    selectedOptionIndex = null;
    answered = false;
    const total = missionScenarios.length;

    if (challengeCounter) challengeCounter.textContent = `Misi ${index + 1}/${total}`;
    if (drillProgressBar) drillProgressBar.style.width = `${(index / total) * 100}%`;
    if (drillScoreLabel) drillScoreLabel.textContent = `Skor: ${score}`;
    if (activeCategory) activeCategory.textContent = `SKENARIO ${index + 1} • ${(sc.category || "").toUpperCase()}`;
    if (activeTitle) activeTitle.textContent = sc.title;
    if (activeSituation) activeSituation.textContent = sc.situation;
    if (activeMeta) activeMeta.textContent = `${sc.difficulty || "Sedang"} • +${sc.xp || 50} XP`;
    if (feedbackBox) feedbackBox.classList.add("hidden");
    if (submitBtn) { submitBtn.disabled = true; submitBtn.classList.remove("hidden"); }
    if (btnNext) btnNext.classList.add("hidden");

    renderOptions(sc);
  }

  function renderOptions(sc) {
    if (!decisionOptions) return;
    decisionOptions.innerHTML = "";
    const labels = ["A", "B", "C", "D"];
    sc.options.forEach((opt, idx) => {
      const letter = labels[idx] || (idx + 1);
      const card = document.createElement("div");
      card.className = "option-card cursor-pointer p-5 rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all flex items-start gap-4 border border-transparent";
      card.setAttribute("data-index", idx);
      card.innerHTML = `
        <div class="badge-box shrink-0 w-10 h-10 rounded-xl bg-surface-container-low text-on-surface font-bold flex items-center justify-center">${letter}</div>
        <div class="flex flex-col flex-grow">
          <h3 class="option-title font-semibold text-on-surface">${opt.text}</h3>
        </div>
      `;
      card.addEventListener("click", () => {
        if (answered) return;
        decisionOptions.querySelectorAll(".option-card").forEach((c) => {
          c.classList.remove("border-primary", "shadow-md");
          const b = c.querySelector(".badge-box");
          if (b) { b.classList.remove("bg-primary-container", "text-on-primary"); b.classList.add("bg-surface-container-low"); }
        });
        card.classList.add("border-primary", "shadow-md");
        const badge = card.querySelector(".badge-box");
        if (badge) { badge.classList.add("bg-primary-container", "text-on-primary"); badge.classList.remove("bg-surface-container-low"); }
        selectedOptionIndex = idx;
        if (submitBtn) submitBtn.disabled = false;
        buzz("light");
        beep("tap");
      });
      decisionOptions.appendChild(card);
    });
  }

  // Tiga tingkat: benar (hijau) / kurang tepat (kuning) / salah (merah)
  function gradeAnswer(sc, chosenIdx) {
    const chosen = sc.options[chosenIdx];
    if (chosen.correct) return "benar";
    const correctIdx = sc.options.findIndex((o) => o.correct);
    if (chosenIdx !== correctIdx && chosenIdx === sc.options.length - 1) return "kurang";
    return "salah";
  }

  function submitAnswer() {
    if (selectedOptionIndex === null || answered) return;
    const sc = drillMode === "single" ? singleScenario : missionScenarios[index];
    if (!sc) return;
    const chosen = sc.options[selectedOptionIndex];
    const grade = gradeAnswer(sc, selectedOptionIndex);
    answered = true;

    const isCorrect = grade === "benar";
    if (drillMode === "single") {
      awardSingle(sc, isCorrect);
    } else {
      if (isCorrect) score += 1;
      answers.push({ scenarioId: sc.id, title: sc.title, grade, feedback: chosen.feedback });

      // Tandai selesai + update progress via setChallengeStatus
      if (store) {
        store.markScenarioCompleted(sc.id, isCorrect);
        store.setChallengeStatus({ challengeId: challenge.id, progress: index + 1, done: false });
      }
      if (drillScoreLabel) drillScoreLabel.textContent = `Skor: ${score}`;
      if (drillProgressBar) drillProgressBar.style.width = `${((index + 1) / missionScenarios.length) * 100}%`;
    }

    // Kunci opsi + tandai pilihan + animasi penegas
    decisionOptions.querySelectorAll(".option-card").forEach((c) => {
      c.classList.add("pointer-events-none", "opacity-80");
      const i = parseInt(c.getAttribute("data-index"), 10);
      if (i === selectedOptionIndex) {
        c.classList.remove("border-primary");
        if (grade === "benar") {
          c.classList.add("border-green-600", "feedback-benar");
          beep("success");
          buzz("success");
          floatXp(drillMode === "single" ? `+${sc.xp || 50} XP` : "+1");
        } else if (grade === "kurang") {
          c.classList.add("border-amber-500");
          beep("tap");
          buzz("light");
        } else {
          c.classList.add("border-red-500", "feedback-salah");
          beep("error");
          buzz("error");
        }
      }
    });

    // Feedback box
    if (feedbackBox) {
      feedbackBox.classList.remove("hidden");
      if (grade === "benar") {
        feedbackBox.className = "rounded-xl p-5 border flex flex-col gap-2 bg-[#E8F8F0] border-[#0F6A44]/20 text-[#0F6A44]";
        if (feedbackIcon) feedbackIcon.textContent = "verified";
        if (feedbackTitle) feedbackTitle.textContent = "Benar! Keputusan tepat.";
      } else if (grade === "kurang") {
        feedbackBox.className = "rounded-xl p-5 border flex flex-col gap-2 bg-amber-50 border-amber-300/60 text-amber-800";
        if (feedbackIcon) feedbackIcon.textContent = "info";
        if (feedbackTitle) feedbackTitle.textContent = "Kurang tepat — masih bisa lebih baik.";
      } else {
        feedbackBox.className = "rounded-xl p-5 border flex flex-col gap-2 bg-error-container/40 border-error/20 text-error";
        if (feedbackIcon) feedbackIcon.textContent = "warning";
        if (feedbackTitle) feedbackTitle.textContent = "Salah — tindakan ini berisiko.";
      }
      if (feedbackDesc) feedbackDesc.textContent = chosen.feedback || "";
      if (feedbackLearning) feedbackLearning.textContent = sc.learningBridge ? `Prinsip: ${sc.learningBridge}` : "";
    }

    if (submitBtn) submitBtn.classList.add("hidden");
    if (btnNext) {
      btnNext.classList.remove("hidden");
      btnNext.textContent = drillMode === "single"
        ? "Kembali"
        : (index === missionScenarios.length - 1 ? "Lihat Hasil" : "Lanjut");
    }
    if (drillMode === "single") {
      renderDaily();
    } else {
      refreshHeroProgress();
    }
  }

  function nextStep() {
    if (drillMode === "single") {
      showView(viewStart);
      const lib = document.getElementById("jelajahi");
      if (lib) lib.scrollIntoView({ behavior: "smooth" });
      return;
    }
    if (index < missionScenarios.length - 1) {
      index += 1;
      renderScenario();
    } else {
      finishChallenge();
    }
  }

  function finishChallenge() {
    const total = missionScenarios.length;
    const rewardXp = challenge.rewardXp || 250;
    const badgeId = challenge.rewardBadgeId || "digital-guardian";

    // Klaim hadiah: +250 XP & badge unlock + toast (sekali per misi)
    let firstTime = true;
    if (store) {
      const prev = store.getChallengeStatus();
      firstTime = !(prev && prev.challengeId === challenge.id && prev.done);
      store.setChallengeStatus({ challengeId: challenge.id, progress: total, done: true });
      if (firstTime) {
        store.addXp(rewardXp);
        store.unlockBadge(badgeId);
        showToast(`Misi selesai! +${rewardXp} XP & badge ${badgeId} terbuka.`);
      } else {
        showToast("Misi selesai lagi! Hadiah sudah diklaim sebelumnya.");
      }
    }
    beep("success");
    buzz("success");

    if (resultScore) resultScore.textContent = `${score}/${total}`;
    if (resultXp) resultXp.textContent = firstTime ? `+${rewardXp} XP` : "Sudah diklaim";
    if (resultBadge) resultBadge.textContent = "Digital Guardian";
    const perfect = score === total;
    const missed = total - score;
    if (resultTitle) resultTitle.textContent = score === total
      ? "Sempurna! Kamu Digital Guardian!"
      : score >= 3 ? "Misi Selesai! Hampir sempurna." : "Misi Selesai! Terus berlatih.";

    const btnPrimaryNext = document.getElementById("btn-primary-next");
    const btnPrimaryLabel = document.getElementById("btn-primary-next-label");
    const nextDesc = document.getElementById("result-next-desc");
    if (perfect) {
      if (nextDesc) nextDesc.textContent = "Sempurna! Progres dan badge barumu sudah tercatat — pantau di My SIAGA, atau bagikan pengalamanmu agar orang lain ikut belajar.";
      if (btnPrimaryNext) btnPrimaryNext.setAttribute("href", "progress.html");
      if (btnPrimaryLabel) btnPrimaryLabel.textContent = "Lihat My SIAGA";
    } else {
      if (nextDesc) nextDesc.textContent = `Kamu meleset ${missed} dari ${total} skenario. Perkuat polanya lewat microlesson 4 menit di Learn, lalu kembali uji dirimu di sini.`;
      if (btnPrimaryNext) btnPrimaryNext.setAttribute("href", "learn.html");
      if (btnPrimaryLabel) btnPrimaryLabel.textContent = "Pelajari Polanya di Learn";
    }
    if (resultDesc) resultDesc.textContent = firstTime
      ? `Kamu menjawab benar ${score} dari ${total} skenario dan meraih +${rewardXp} XP beserta badge Digital Guardian.`
      : `Kamu menjawab benar ${score} dari ${total} skenario. Hadiah +${rewardXp} XP sudah diklaim sebelumnya.`;

    if (resultSummary) {
      resultSummary.innerHTML = "";
      const iconByGrade = { benar: "check_circle", kurang: "info", salah: "cancel" };
      answers.forEach((a, i) => {
        const row = document.createElement("div");
        row.className = "flex items-start gap-3 rounded-xl bg-surface-container-low px-4 py-3";
        row.innerHTML = `
          <span class="material-symbols-outlined text-[20px] ${a.grade === "benar" ? "text-green-700" : a.grade === "kurang" ? "text-amber-600" : "text-error"}">${iconByGrade[a.grade] || "info"}</span>
          <div class="flex flex-col">
            <span class="text-sm font-bold">Misi ${i + 1}: ${a.title} — ${a.grade === "benar" ? "Benar" : a.grade === "kurang" ? "Kurang tepat" : "Salah"}</span>
            <span class="text-[13px] text-on-surface-variant leading-relaxed">${a.feedback || ""}</span>
          </div>
        `;
        resultSummary.appendChild(row);
      });
    }

    refreshHeroProgress();
    showView(viewResult);
  }

  //  Events 
  if (btnStartChallenge) btnStartChallenge.addEventListener("click", startChallenge);
  if (submitBtn) submitBtn.addEventListener("click", submitAnswer);
  if (btnNext) btnNext.addEventListener("click", nextStep);
  if (btnQuitChallenge) btnQuitChallenge.addEventListener("click", () => { refreshHeroProgress(); showView(viewStart); });
  if (btnRetry) btnRetry.addEventListener("click", startChallenge);
  if (btnFeedbackToggle) btnFeedbackToggle.addEventListener("click", () => {
    try {
      if (window.SIAGA_COMPONENTS && window.SIAGA_COMPONENTS.toggleFeedbackSetting) {
        const on = window.SIAGA_COMPONENTS.toggleFeedbackSetting();
        showToast(on ? "Suara & getar dinyalakan." : "Suara & getar dimatikan.");
      }
    } catch (e) { /* abaikan */ }
    refreshFeedbackToggle();
  });
  if (btnDailyStart) btnDailyStart.addEventListener("click", () => {
    const d = todayDaily();
    if (d) openSingle(d.id);
  });
  if (btnToLibrary) btnToLibrary.addEventListener("click", (e) => {
    e.preventDefault();
    showView(viewStart);
    const lib = document.getElementById("jelajahi");
    if (lib) lib.scrollIntoView({ behavior: "smooth" });
  });

  // Init
  if (store && store.initializeIfFirstVisit) store.initializeIfFirstVisit();
  renderHero();
  renderDaily();
  renderLibrary();
  setupLibraryFilters();
  refreshFeedbackToggle();
  const params = new URLSearchParams(window.location.search);
  const deepId = parseInt(params.get("scenario"), 10);
  if (deepId && allScenarios.some((s) => s.id === deepId)) {
    openSingle(deepId);
  } else {
    showView(viewStart);
  }
});
