// js/learn.js — Learn Microlesson Controller (SIAGA) — Grid dari window.SIAGA_DATA.lessons, rekomendasi skill terlemah, deep-link ?lesson=id, Quick Check i...
(function () {
  "use strict";

  var SKILL_LABELS = {
    safety: "Digital Safety",
    criticalThinking: "Berpikir Kritis",
    aiLiteracy: "Literasi AI",
    financialSecurity: "Keamanan Finansial"
  };

  var CATEGORY_ICONS = {
    "Digital Safety": "shield",
    "Information Literacy": "newspaper",
    "AI Literacy": "smart_toy",
    "Financial Security": "credit_card"
  };

  var state = { activeFilter: "all", activeLessonId: null, quickCheckPassed: false };

  function toast(msg, type) {
    if (window.SIAGA_COMPONENTS && typeof window.SIAGA_COMPONENTS.showToast === "function") {
      window.SIAGA_COMPONENTS.showToast(msg, type || "info");
    } else {
      alert(msg);
    }
  }

  function getLessons() {
    if (window.SIAGA_DATA && Array.isArray(window.SIAGA_DATA.lessons)) return window.SIAGA_DATA.lessons;
    return [];
  }

  function getSkillsSafe() {
    try {
      if (window.SIAGA_STORAGE && typeof window.SIAGA_STORAGE.getCheckupResult === "function") {
        var res = window.SIAGA_STORAGE.getCheckupResult();
        if (res && res.skills) return res.skills;
      }
      if (window.SIAGA_STORAGE && typeof window.SIAGA_STORAGE.getSkills === "function") {
        return window.SIAGA_STORAGE.getSkills();
      }
    } catch (e) { /* abaikan, pakai default */ }
    return { safety: 0, criticalThinking: 0, aiLiteracy: 0, financialSecurity: 0 };
  }

  function weakestSkill(skills) {
    var keys = Object.keys(skills);
    if (!keys.length) return "safety";
    var min = keys[0];
    keys.forEach(function (k) { if ((skills[k] || 0) < (skills[min] || 0)) min = k; });
    return min;
  }

  function lessonDoneKey(id) { return "lesson-" + id; }

  function isLessonDone(id) {
    try {
      if (window.SIAGA_STORAGE && typeof window.SIAGA_STORAGE.isScenarioCompleted === "function") {
        return window.SIAGA_STORAGE.isScenarioCompleted(lessonDoneKey(id));
      }
    } catch (e) { /* abaikan */ }
    return false;
  }

  // ---------- Rekomendasi ----------
  function renderRecommendation() {
    var lessons = getLessons();
    if (!lessons.length) return;
    var skills = getSkillsSafe();
    var weak = weakestSkill(skills);
    var match = lessons.find(function (l) { return l.skillTag === weak; }) || lessons[0];

    var hasCheckup = false;
    try {
      var r = window.SIAGA_STORAGE.getCheckupResult();
      hasCheckup = r && r.score !== null && r.score !== undefined;
    } catch (e) { /* abaikan */ }

    document.getElementById("reco-badge").textContent = hasCheckup
      ? "BERDASARKAN SKILL TERLEMAH: " + (SKILL_LABELS[weak] || weak).toUpperCase()
      : "MULAI DARI SINI — COBA CHECK-UP UNTUK REKOMENDASI PERSONAL";
    document.getElementById("reco-title").textContent = match.title;
    document.getElementById("reco-desc").textContent =
      (hasCheckup ? "Skill \"" + (SKILL_LABELS[weak] || weak) + "\" perlu penguatan. " : "Belum ada hasil Check-Up — modul ini cocok untuk fondasi. ") +
      match.content.situation;

    var cta = document.getElementById("reco-cta");
    cta.onclick = function () { openLesson(match.id, true); };
  }

  // ---------- Grid ----------
  function renderGrid() {
    var lessons = getLessons();
    var grid = document.getElementById("lesson-grid");
    grid.innerHTML = "";

    var filtered = state.activeFilter === "all"
      ? lessons
      : lessons.filter(function (l) { return l.category === state.activeFilter; });

    document.getElementById("stat-total-lessons").textContent = lessons.length + " Modul";
    var doneCount = lessons.filter(function (l) { return isLessonDone(l.id); }).length;
    document.getElementById("stat-done-lessons").textContent = doneCount + " Modul";

    if (!filtered.length) {
      grid.innerHTML = '<p class="text-body-md text-on-surface-variant col-span-full">Tidak ada modul pada kategori ini.</p>';
      return;
    }

    filtered.forEach(function (lesson) {
      var done = isLessonDone(lesson.id);
      var icon = CATEGORY_ICONS[lesson.category] || "menu_book";
      var card = document.createElement("article");
      card.className = "bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-sm hover:shadow-card-hover hover:-translate-y-1 transition-all p-space-lg flex flex-col gap-space-md";
      card.innerHTML =
        '<div class="flex items-center justify-between">' +
          '<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed/60 text-primary font-label-badge text-label-badge font-bold uppercase"><span class="material-symbols-outlined text-[15px]">' + icon + '</span>' + lesson.category + '</span>' +
          (done ? '<span class="inline-flex items-center gap-1 text-emerald-600 font-label-badge text-label-badge font-bold"><span class="material-symbols-outlined text-[16px]">task_alt</span>SELESAI</span>' : "") +
        '</div>' +
        '<h3 class="font-headline-md text-headline-sm font-bold leading-snug">' + lesson.title + '</h3>' +
        '<p class="font-body-sm text-body-sm text-on-surface-variant leading-relaxed line-clamp-3">' + lesson.content.situation + '</p>' +
        '<div class="flex items-center gap-2 font-code-telemetry text-code-telemetry text-on-surface-variant">' +
          '<span class="inline-flex items-center gap-1"><span class="material-symbols-outlined text-[15px] text-primary">military_tech</span>+' + (lesson.xp || 40) + ' XP</span>' +
          '<span>•</span><span>' + (SKILL_LABELS[lesson.skillTag] || lesson.skillTag) + '</span>' +
        '</div>' +
        '<button class="mt-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-white font-bold text-body-sm hover:bg-blue-700 transition-all active:scale-95" data-lesson-id="' + lesson.id + '"><span>Pelajari Modul</span><span class="material-symbols-outlined text-[18px]">arrow_forward</span></button>';
      grid.appendChild(card);
    });

    grid.querySelectorAll("[data-lesson-id]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        openLesson(Number(btn.getAttribute("data-lesson-id")), true);
      });
    });
  }

  // ---------- Detail ----------
  function openLesson(id, pushState) {
    var lesson = getLessons().find(function (l) { return l.id === id; });
    if (!lesson) { toast("Modul tidak ditemukan.", "error"); return; }
    state.activeLessonId = id;
    state.quickCheckPassed = false;

    document.getElementById("detail-cat-badge").textContent = lesson.category.toUpperCase();
    document.getElementById("detail-title").textContent = lesson.title;
    document.getElementById("detail-skill").textContent = "Melatih skill: " + (SKILL_LABELS[lesson.skillTag] || lesson.skillTag) + " • Estimasi ~4 menit";
    document.getElementById("detail-xp-badge").innerHTML = '<span class="material-symbols-outlined text-[16px]">military_tech</span><span>+' + (lesson.xp || 40) + ' XP</span>';
    document.getElementById("detail-situation").textContent = lesson.content.situation;

    var sigList = document.getElementById("detail-signals");
    sigList.innerHTML = "";
    lesson.content.signals.forEach(function (s) {
      var li = document.createElement("li");
      li.className = "flex items-start gap-2.5 rounded-xl bg-amber-50 border border-amber-200/70 px-4 py-3 text-body-sm";
      li.innerHTML = '<span class="material-symbols-outlined text-amber-600 text-[18px] shrink-0 mt-0.5">warning</span><span>' + s + '</span>';
      sigList.appendChild(li);
    });

    document.getElementById("detail-whattodo").textContent = lesson.content.whatToDo;
    document.getElementById("detail-question").textContent = lesson.content.quickCheck.question;

    var optWrap = document.getElementById("quickcheck-options");
    var feedback = document.getElementById("quickcheck-feedback");
    optWrap.innerHTML = "";
    feedback.classList.add("hidden");
    var completeBtn = document.getElementById("btn-complete-lesson");
    completeBtn.disabled = true;
    if (isLessonDone(id)) {
      completeBtn.querySelector("span:last-child").textContent = "Modul Selesai — Ulangi Tetap Dapat Manfaat";
    } else {
      completeBtn.querySelector("span:last-child").textContent = "Selesaikan Modul (+" + (lesson.xp || 40) + " XP)";
    }

    lesson.content.quickCheck.options.forEach(function (opt, idx) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "text-left px-5 py-4 rounded-xl border-2 border-outline-variant bg-surface-container-lowest hover:border-primary hover:bg-primary-fixed/30 transition-all font-body-md text-body-md font-medium";
      b.textContent = opt;
      b.addEventListener("click", function () {
        var correct = idx === lesson.content.quickCheck.correctIndex;
        optWrap.querySelectorAll("button").forEach(function (el) {
          el.disabled = true;
          el.classList.add("opacity-70");
        });
        if (correct) {
          b.classList.remove("border-outline-variant", "opacity-70");
          b.classList.add("border-emerald-500", "bg-emerald-50");
          feedback.classList.remove("hidden");
          feedback.className = "mt-3 text-body-sm font-semibold text-emerald-600 flex items-center gap-1.5";
          feedback.textContent = "Benar! Pemahamanmu terkunci — silakan selesaikan modul.";
          state.quickCheckPassed = true;
          completeBtn.disabled = false;
          toast("Jawaban tepat! Kamu bisa menyelesaikan modul.", "success");
        } else {
          b.classList.remove("border-outline-variant", "opacity-70");
          b.classList.add("border-error", "bg-error-container/40");
          feedback.classList.remove("hidden");
          feedback.className = "mt-3 text-body-sm font-semibold text-error";
          feedback.textContent = "Kurang tepat — coba baca lagi bagian Signals & What Should You Do, lalu muat ulang modul untuk mencoba lagi.";
          toast("Kurang tepat. Pelajari lagi polanya, ya.", "error");
          var retry = document.createElement("button");
          retry.type = "button";
          retry.className = "mt-3 text-body-sm font-bold text-primary underline underline-offset-2";
          retry.textContent = "Coba lagi";
          retry.addEventListener("click", function () { openLesson(id, false); });
          feedback.appendChild(document.createElement("br"));
          feedback.appendChild(retry);
        }
      });
      optWrap.appendChild(b);
    });

    document.getElementById("view-list").classList.add("hidden");
    document.getElementById("view-detail").classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (pushState) {
      var url = new URL(window.location.href);
      url.searchParams.set("lesson", String(id));
      window.history.replaceState({}, "", url.toString());
    }
  }

  function backToList() {
    state.activeLessonId = null;
    document.getElementById("view-detail").classList.add("hidden");
    document.getElementById("view-list").classList.remove("hidden");
    var url = new URL(window.location.href);
    url.searchParams.delete("lesson");
    window.history.replaceState({}, "", url.toString());
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function completeLesson() {
    var lesson = getLessons().find(function (l) { return l.id === state.activeLessonId; });
    if (!lesson) return;
    if (!state.quickCheckPassed) {
      toast("Jawab Quick Check dengan benar terlebih dahulu.", "warning");
      return;
    }
    if (isLessonDone(lesson.id)) {
      toast("Modul ini sudah selesai — XP tidak diberikan dua kali.", "info");
      backToList();
      return;
    }
    var xpGain = lesson.xp || 40;
    try {
      if (typeof window.SIAGA_STORAGE.addXp === "function") window.SIAGA_STORAGE.addXp(xpGain);
      else window.SIAGA_STORAGE.addXP(xpGain);
      window.SIAGA_STORAGE.updateSkillPoints(lesson.skillTag, 5);
      window.SIAGA_STORAGE.markScenarioCompleted(lessonDoneKey(lesson.id), true);
    } catch (e) {
      toast("Gagal menyimpan progres.", "error");
      return;
    }
    toast("Modul selesai! +" + xpGain + " XP & +5 poin " + (SKILL_LABELS[lesson.skillTag] || lesson.skillTag) + ".", "success");
    renderGrid();
    renderRecommendation();
    setTimeout(backToList, 900);
  }

  // ---------- Init ----------
  document.addEventListener("DOMContentLoaded", function () {
    if (window.SIAGA_STORAGE && typeof window.SIAGA_STORAGE.initializeIfFirstVisit === "function") {
      window.SIAGA_STORAGE.initializeIfFirstVisit();
    }
    if (window.SIAGA_COMPONENTS && typeof window.SIAGA_COMPONENTS.highlightActiveNavLink === "function") {
      window.SIAGA_COMPONENTS.highlightActiveNavLink();
    }

    // Toggle hamburger ditangani global oleh js/components.js (initMobileNav).

    document.querySelectorAll("#category-filter-bar .cat-tab").forEach(function (tab) {
      tab.addEventListener("click", function () {
        state.activeFilter = tab.getAttribute("data-cat");
        document.querySelectorAll("#category-filter-bar .cat-tab").forEach(function (t) {
          var active = t === tab;
          t.classList.toggle("bg-inverse-surface", active);
          t.classList.toggle("text-inverse-on-surface", active);
          t.classList.toggle("bg-surface-container-low", !active);
        });
        renderGrid();
      });
    });

    document.getElementById("btn-back-list").addEventListener("click", backToList);
    document.getElementById("btn-complete-lesson").addEventListener("click", completeLesson);

    renderRecommendation();
    renderGrid();

    var params = new URLSearchParams(window.location.search);
    var deepId = Number(params.get("lesson"));
    if (deepId) openLesson(deepId, false);
  });
})();
