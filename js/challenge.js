// js/challenge.js — Logic Halaman Weekly Challenge (PRD F-07) Bergantung pada: window.SIAGA_DATA, window.SIAGA_STORAGE A...
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

  // DOM — drill
  const challengeCounter = document.getElementById("challenge-counter");
  const drillProgressBar = document.getElementById("drill-progress-bar");
  const drillScoreLabel = document.getElementById("drill-score-label");
  const activeCategory = document.getElementById("active-category");
  const activeTitle = document.getElementById("active-title");
  const activeSituation = document.getElementById("active-situation");
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
    scenarioIds: [1, 3, 4, 5, 6],
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

  // ---------- Helpers ----------
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
        progress > 0 && !status.done ? "Lanjutkan Misi" : (status.done ? "Ulangi Misi" : "Mulai Misi");
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

  // ---------- Drill ----------
  function startChallenge() {
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
      });
      decisionOptions.appendChild(card);
    });
  }

  // Tiga tingkat: benar (hijau) / kurang tepat (kuning, opsi pasif index non-benar terakhir) / salah (merah)
  function gradeAnswer(sc, chosenIdx) {
    const chosen = sc.options[chosenIdx];
    if (chosen.correct) return "benar";
    const correctIdx = sc.options.findIndex((o) => o.correct);
    if (chosenIdx !== correctIdx && chosenIdx === sc.options.length - 1) return "kurang";
    return "salah";
  }

  function submitAnswer() {
    if (selectedOptionIndex === null || answered) return;
    const sc = missionScenarios[index];
    const chosen = sc.options[selectedOptionIndex];
    const grade = gradeAnswer(sc, selectedOptionIndex);
    answered = true;

    const isCorrect = grade === "benar";
    if (isCorrect) score += 1;
    answers.push({ scenarioId: sc.id, title: sc.title, grade, feedback: chosen.feedback });

    // Tandai selesai + update progress via setChallengeStatus
    if (store) {
      store.markScenarioCompleted(sc.id, isCorrect);
      store.setChallengeStatus({ challengeId: challenge.id, progress: index + 1, done: false });
    }
    if (drillScoreLabel) drillScoreLabel.textContent = `Skor: ${score}`;
    if (drillProgressBar) drillProgressBar.style.width = `${((index + 1) / missionScenarios.length) * 100}%`;

    // Kunci opsi + tandai pilihan
    decisionOptions.querySelectorAll(".option-card").forEach((c) => {
      c.classList.add("pointer-events-none", "opacity-80");
      const i = parseInt(c.getAttribute("data-index"), 10);
      if (i === selectedOptionIndex) {
        c.classList.remove("border-primary");
        if (grade === "benar") c.classList.add("border-green-600");
        else if (grade === "kurang") c.classList.add("border-amber-500");
        else c.classList.add("border-red-500");
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
      btnNext.textContent = index === missionScenarios.length - 1 ? "Lihat Hasil" : "Lanjut";
    }
    refreshHeroProgress();
  }

  function nextStep() {
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

    if (resultScore) resultScore.textContent = `${score}/${total}`;
    if (resultXp) resultXp.textContent = firstTime ? `+${rewardXp} XP` : "Sudah diklaim";
    if (resultBadge) resultBadge.textContent = "Digital Guardian";
    if (resultTitle) resultTitle.textContent = score === total
      ? "Sempurna! Kamu Digital Guardian!"
      : score >= 3 ? "Misi Selesai! Hampir sempurna." : "Misi Selesai! Terus berlatih.";
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

  // ---------- Events ----------
  if (btnStartChallenge) btnStartChallenge.addEventListener("click", startChallenge);
  if (submitBtn) submitBtn.addEventListener("click", submitAnswer);
  if (btnNext) btnNext.addEventListener("click", nextStep);
  if (btnQuitChallenge) btnQuitChallenge.addEventListener("click", () => { refreshHeroProgress(); showView(viewStart); });
  if (btnRetry) btnRetry.addEventListener("click", startChallenge);

  // Init
  if (store && store.initializeIfFirstVisit) store.initializeIfFirstVisit();
  renderHero();
  showView(viewStart);
});
