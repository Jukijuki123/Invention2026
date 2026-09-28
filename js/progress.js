// js/progress.js — My SIAGA (Progress) — F-11 & F-12 Load semua via SIAGA_STORAGE, render, edit nama, reset.
(function () {
  // LEVEL_THRESHOLDS disalin dari js/storage.js (tidak diekspor global)
  var LEVEL_THRESHOLDS = [
    { min: 0, max: 199, name: "Digital Rookie" },
    { min: 200, max: 499, name: "Aware User" },
    { min: 500, max: 999, name: "Digital Defender" },
    { min: 1000, max: 1499, name: "Digital Detective" },
    { min: 1500, max: 2499, name: "Digital Guardian" },
    { min: 2500, max: Infinity, name: "Community Protector" }
  ];

  var SKILL_META = [
    { key: "safety", label: "Digital Safety", icon: "shield" },
    { key: "criticalThinking", label: "Critical Thinking", icon: "psychology" },
    { key: "aiLiteracy", label: "AI Literacy", icon: "smart_toy" },
    { key: "financialSecurity", label: "Financial Security", icon: "account_balance_wallet" }
  ];

  function levelInfoFor(xp) {
    var idx = LEVEL_THRESHOLDS.findIndex(function (l) { return xp >= l.min && xp <= l.max; });
    if (idx === -1) idx = LEVEL_THRESHOLDS.length - 1;
    var current = LEVEL_THRESHOLDS[idx];
    var next = LEVEL_THRESHOLDS[idx + 1] || null;
    var rangeMax = current.max === Infinity ? xp : current.max;
    var rangeMin = current.min;
    var span = Math.max(rangeMax - rangeMin, 1);
    var pct = next ? Math.min(100, Math.max(0, ((xp - rangeMin) / span) * 100)) : 100;
    var remaining = next ? (next.min - xp) : 0;
    return { current: current, next: next, pct: pct, remaining: remaining };
  }

  function scenarioById(id) {
    var list = (window.SIAGA_DATA && window.SIAGA_DATA.scenarios) || [];
    return list.find(function (s) { return String(s.id) === String(id); }) || null;
  }

  function esc(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function renderSkillMap(skills) {
    var wrap = document.getElementById("skill-map");
    if (!wrap) return;
    var values = SKILL_META.map(function (m) { return Number(skills[m.key] || 0); });
    var max = Math.max.apply(null, values.concat([1]));
    wrap.innerHTML = SKILL_META.map(function (m) {
      var v = Number(skills[m.key] || 0);
      var pct = Math.round((v / max) * 100);
      return (
        '<div class="flex flex-col gap-1">' +
          '<div class="flex items-center justify-between">' +
            '<span class="inline-flex items-center gap-2 font-headline-sm text-body-sm font-semibold">' +
              '<span class="material-symbols-outlined text-[18px] text-primary">' + m.icon + "</span>" + esc(m.label) +
            "</span>" +
            '<span class="font-code-telemetry text-code-telemetry text-on-surface-variant">' + v + " poin</span>" +
          "</div>" +
          '<div class="w-full h-2.5 rounded-full bg-surface-container overflow-hidden">' +
            '<div class="h-full rounded-full bg-gradient-to-r from-secondary-container to-primary transition-all duration-500" style="width:' + pct + '%"></div>' +
          "</div>" +
        "</div>"
      );
    }).join("");
  }

  // Misi berikutnya personal: arahkan ke modul skill terlemah.
  // Bila belum ada poin sama sekali, tampilkan ajakan Check-Up di peta skill.
  function renderNextMission(skills) {
    var keys = ["safety", "criticalThinking", "aiLiteracy", "financialSecurity"];
    var total = keys.reduce(function (s, k) { return s + Number(skills[k] || 0); }, 0);
    var wrap = document.getElementById("skill-map");
    if (wrap && total === 0) {
      var cta = document.createElement("a");
      cta.href = "checkup.html";
      cta.className = "flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-primary text-on-primary font-headline-sm text-body-sm font-bold shadow-md transition-all hover:bg-primary-container mb-space-md";
      cta.innerHTML = '<span class="material-symbols-outlined text-[20px]">track_changes</span><span>Mulai Check-Up untuk memetakan skill-mu</span>';
      wrap.insertBefore(cta, wrap.firstChild);
    }
    var weakest = keys.slice().sort(function (a, b) {
      return Number(skills[a] || 0) - Number(skills[b] || 0);
    })[0];
    var lessons = (window.SIAGA_DATA && window.SIAGA_DATA.lessons) || [];
    var match = lessons.filter(function (l) { return l.skillTag === weakest; })[0] || lessons[0];
    var btn = document.getElementById("btn-next-learn");
    var desc = document.getElementById("next-mission-desc");
    if (total > 0 && match && btn) {
      btn.href = "learn.html?lesson=" + match.id;
      btn.textContent = "Fokus: " + match.title;
    }
    if (total > 0 && match && desc) {
      desc.textContent = "Titik lemahmu terdeteksi. Perkuat lewat modul \"" + match.title + "\" atau uji langsung di Tantangan.";
    }
  }

  function renderBadges(unlocked) {
    var grid = document.getElementById("badges-grid");
    var count = document.getElementById("badges-count");
    if (!grid) return;
    var all = (window.SIAGA_DATA && window.SIAGA_DATA.badges) || [];
    if (count) count.textContent = unlocked.length + "/" + all.length + " terbuka";
    grid.innerHTML = all.map(function (b) {
      var has = unlocked.indexOf(b.id) !== -1;
      return (
        '<div class="rounded-2xl border p-space-md flex flex-col items-center text-center gap-1 ' +
          (has ? "border-primary/30 bg-primary-fixed/30" : "border-outline-variant/50 bg-surface-container-low opacity-70") + '">' +
          '<div class="w-11 h-11 rounded-xl flex items-center justify-center ' +
            (has ? "bg-primary text-on-primary" : "bg-surface-container text-on-surface-variant") + '">' +
            '<span class="material-symbols-outlined text-[24px]" aria-hidden="true">' + esc(b.icon || "military_tech") + "</span>" +
          "</div>" +
          '<p class="font-headline-sm text-body-sm font-bold leading-tight">' + esc(b.title) + "</p>" +
          '<p class="font-body-sm text-[12px] text-on-surface-variant leading-snug">' + esc(b.description) + "</p>" +
          '<span class="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-label-badge text-label-badge ' +
            (has ? "bg-primary text-on-primary" : "bg-surface-container text-on-surface-variant") + '">' +
            '<span class="material-symbols-outlined text-[14px]">' + (has ? "lock_open" : "lock") + "</span>" +
            (has ? "Terbuka" : "Terkunci") +
          "</span>" +
        "</div>"
      );
    }).join("");
  }

  function renderActivity(completed) {
    var log = document.getElementById("activity-log");
    var count = document.getElementById("activity-count");
    if (!log) return;
    if (count) count.textContent = completed.length + " selesai";
    if (!completed.length) {
      log.innerHTML =
        '<div class="rounded-xl bg-surface-container-low p-space-md text-center">' +
          '<p class="font-headline-sm text-body-sm font-semibold">Belum ada aktivitas.</p>' +
          '<p class="font-body-sm text-body-sm text-on-surface-variant">Selesaikan skenario Tantangan untuk mengisi riwayatmu.</p>' +
          '<a href="challenge.html" class="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-on-primary font-headline-sm text-body-sm font-semibold">' +
            "<span>Mulai Tantangan</span>" +
            '<span class="material-symbols-outlined text-[18px]">arrow_forward</span>' +
          "</a>" +
        "</div>";
      return;
    }
    var sorted = completed.slice().reverse();
    log.innerHTML = sorted.map(function (c) {
      var sc = scenarioById(c.scenarioId);
      var title = sc ? sc.title : ("Skenario #" + esc(c.scenarioId));
      var date = c.completedAt ? new Date(c.completedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "-";
      var ok = !!c.wasCorrect;
      return (
        '<div class="flex items-start gap-space-sm rounded-xl border border-outline-variant/50 bg-surface-container-low p-space-sm">' +
          '<div class="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ' + (ok ? "bg-secondary-container/40 text-secondary" : "bg-error-container text-on-error-container") + '">' +
            '<span class="material-symbols-outlined text-[20px]">' + (ok ? "check_circle" : "cancel") + "</span>" +
          "</div>" +
          '<div class="min-w-0 flex-1">' +
            '<p class="font-headline-sm text-body-sm font-semibold truncate">' + esc(title) + "</p>" +
            '<p class="font-body-sm text-[12px] text-on-surface-variant">' + (ok ? "Keputusan tepat" : "Keputusan kurang tepat") + " • " + esc(date) + "</p>" +
          "</div>" +
        "</div>"
      );
    }).join("");
  }

  function renderAll() {
    var S = window.SIAGA_STORAGE;
    if (!S) return;
    var profile = S.getUserProfile() || {};
    var checkup = S.getCheckupResult() || {};
    var xp = S.getXP() || 0;
    var level = S.getLevel() || LEVEL_THRESHOLDS[0].name;
    var skills = S.getSkills() || {};
    var completed = S.getCompletedScenarios() || [];
    var badges = S.getBadges() || [];
    var streak = { count: 0 };
    try { streak = S.getStreakData() || streak; } catch (e) {}

    var nameEl = document.getElementById("greeting-name");
    if (nameEl) nameEl.textContent = profile.name || "Pengguna SIAGA";

    var scoreEl = document.getElementById("score-value");
    if (scoreEl) scoreEl.textContent = (checkup.score == null ? 0 : checkup.score);
    var scoreDesc = document.getElementById("score-desc");
    if (scoreDesc) {
      scoreDesc.textContent = checkup.score == null
        ? "Selesaikan Check-Up untuk mendapatkan skormu."
        : "Skor kesiapsiagaan digitalmu dari hasil Check-Up.";
    }

    var info = levelInfoFor(xp);
    var levelEl = document.getElementById("level-name");
    if (levelEl) levelEl.textContent = level || info.current.name;
    var xpEl = document.getElementById("xp-value");
    if (xpEl) xpEl.textContent = xp;
    var bar = document.getElementById("xp-progress-bar");
    if (bar) bar.style.width = info.pct + "%";
    var rem = document.getElementById("xp-remaining");
    if (rem) {
      rem.textContent = info.next
        ? (info.remaining + " XP lagi menuju " + info.next.name + ".")
        : "Level maksimal tercapai. Pertahankan!";
    }
    var streakEl = document.getElementById("streak-value");
    if (streakEl) {
      streakEl.innerHTML =
        '<span class="material-symbols-outlined text-[15px] text-primary">local_fire_department</span> ' +
        esc(streak.count || 0) + " hari";
    }

    renderSkillMap(skills);
    renderBadges(badges);
    renderActivity(completed);
    renderNextMission(skills);

    var input = document.getElementById("input-name");
    if (input && document.activeElement !== input) input.value = profile.name || "";
  }

  function toast(msg, type) {
    if (window.SIAGA_COMPONENTS && window.SIAGA_COMPONENTS.showToast) {
      window.SIAGA_COMPONENTS.showToast(msg, type || "info");
    }
  }
  function closeModal(id) {
    if (window.SIAGA_COMPONENTS && window.SIAGA_COMPONENTS.closeModal) {
      window.SIAGA_COMPONENTS.closeModal(id);
    } else {
      var m = document.getElementById(id);
      if (m) m.classList.add("hidden");
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (window.SIAGA_STORAGE && window.SIAGA_STORAGE.initializeIfFirstVisit) {
      window.SIAGA_STORAGE.initializeIfFirstVisit();
    }
    renderAll();

    var btnSave = document.getElementById("btn-save-name");
    if (btnSave) {
      btnSave.addEventListener("click", function () {
        var input = document.getElementById("input-name");
        var name = input ? input.value.trim() : "";
        if (!name) { toast("Nama tidak boleh kosong.", "warning"); return; }
        window.SIAGA_STORAGE.updateUserProfile({ name: name });
        toast("Nama berhasil diperbarui.", "success");
        closeModal("modal-edit-name");
        renderAll();
      });
    }

    var btnConfirmReset = document.getElementById("btn-confirm-reset");
    if (btnConfirmReset) {
      btnConfirmReset.addEventListener("click", function () {
        window.SIAGA_STORAGE.resetAllProgress();
        closeModal("modal-reset");
        toast("Progres direset.", "info");
        window.location.reload();
      });
    }
  });
})();
