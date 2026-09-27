// js/community.js — Community — Story Feed + Story Detail + Share Experience Memenuhi PRD F-09 (Story Feed & Detail) & F...
(function () {
  "use strict";

  var HELPFUL_KEY = "siaga_helpful_extra";
  var activeStoryId = null;

  // ---------- Helpers ----------
  function esc(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function getData() {
    return (window.SIAGA_DATA || { defaultStories: [], scenarios: [] });
  }

  function getStore() {
    return window.SIAGA_STORAGE || null;
  }

  function readHelpfulMap() {
    try {
      var raw = localStorage.getItem(HELPFUL_KEY);
      if (!raw) return {};
      var parsed = JSON.parse(raw);
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch (e) {
      return {};
    }
  }

  function writeHelpfulMap(map) {
    try {
      localStorage.setItem(HELPFUL_KEY, JSON.stringify(map));
    } catch (e) { /* abaikan: kuota penuh */ }
  }

  function getHelpfulCount(story) {
    var map = readHelpfulMap();
    var extra = Number(map[story.id] || 0);
    return Number(story.helpfulCount || 0) + extra;
  }

  function incrementHelpful(storyId) {
    var map = readHelpfulMap();
    map[storyId] = Number(map[storyId] || 0) + 1;
    writeHelpfulMap(map);
    return map[storyId];
  }

  function getScenarioTitle(id) {
    var scenarios = getData().scenarios || [];
    var found = scenarios.find(function (s) { return String(s.id) === String(id); });
    return found ? found.title : "Skenario #" + id;
  }

  function getAllStories() {
    var defaults = getData().defaultStories || [];
    var store = getStore();
    var userStories = store ? store.getUserStories() : [];
    return [].concat(userStories || [], defaults || []);
  }

  var toastTimer = null;
  function showToast(msg) {
    var toast = document.getElementById("toast");
    var label = document.getElementById("toast-message");
    if (!toast || !label) return;
    label.textContent = msg;
    toast.classList.remove("hidden");
    toast.classList.add("flex");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.add("hidden");
      toast.classList.remove("flex");
    }, 2800);
  }

  function showFormError(msg) {
    var el = document.getElementById("form-error");
    if (!el) return;
    if (!msg) {
      el.classList.add("hidden");
      el.textContent = "";
    } else {
      el.textContent = msg;
      el.classList.remove("hidden");
    }
  }

  // ---------- Render: scenario select ----------
  function renderScenarioOptions() {
    var select = document.getElementById("story-scenario");
    if (!select) return;
    var scenarios = getData().scenarios || [];
    select.innerHTML = '<option value="">-- Pilih skenario terkait --</option>';
    scenarios.forEach(function (s) {
      var opt = document.createElement("option");
      opt.value = String(s.id);
      opt.textContent = s.title;
      select.appendChild(opt);
    });
  }

  // ---------- Render: feed ----------
  function renderFeed() {
    var feed = document.getElementById("story-feed");
    var empty = document.getElementById("feed-empty");
    var countEl = document.getElementById("story-count");
    if (!feed) return;

    var stories = getAllStories();
    feed.innerHTML = "";

    if (countEl) countEl.textContent = stories.length + " Cerita";
    if (empty) empty.classList.toggle("hidden", stories.length > 0);

    stories.forEach(function (story) {
      var card = document.createElement("article");
      card.className = "rounded-2xl bg-surface-container-lowest shadow-md hover:shadow-xl transition-shadow p-space-lg flex flex-col gap-space-sm cursor-pointer text-left";
      card.setAttribute("data-story-id", story.id);
      card.setAttribute("tabindex", "0");
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", "Baca cerita: " + story.title);

      var isUser = String(story.id).indexOf("user-") === 0;
      var badge = isUser
        ? '<span class="px-2.5 py-1 rounded-full bg-secondary-container/30 text-on-secondary-container font-label-badge text-label-badge font-bold">CERITA KAMU</span>'
        : '<span class="px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-label-badge text-label-badge font-bold">KOMUNITAS</span>';

      card.innerHTML =
        '<div class="flex items-center justify-between gap-2 flex-wrap">' + badge +
        '<span class="font-code-telemetry text-code-telemetry text-on-surface-variant">' + esc(getScenarioTitle(story.relatedScenarioId)) + '</span></div>' +
        '<h3 class="font-headline-sm text-headline-sm font-bold text-on-surface tracking-tight">' + esc(story.title) + '</h3>' +
        '<p class="font-body-sm text-body-sm text-on-surface-variant">Oleh <span class="font-semibold text-on-surface">' + esc(story.author || "Anonim") + '</span></p>' +
        '<p class="font-body-md text-body-sm text-on-surface-variant leading-relaxed line-clamp-3">' + esc(story.whatHappened) + '</p>' +
        '<div class="pt-1 mt-auto flex items-center justify-between gap-2">' +
          '<span class="inline-flex items-center gap-1.5 font-headline-sm text-body-sm font-semibold text-primary">Baca cerita <span class="material-symbols-outlined text-[18px]">arrow_forward</span></span>' +
          '<button type="button" data-helpful="' + esc(story.id) + '" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface-variant font-body-sm text-body-sm font-medium transition-colors" aria-label="Tandai membantu">' +
            '<span class="material-symbols-outlined text-[16px]">thumb_up</span>' +
            '<span data-helpful-count="' + esc(story.id) + '">' + getHelpfulCount(story) + '</span>' +
          '</button>' +
        '</div>';

      card.addEventListener("click", function (e) {
        if (e.target.closest("[data-helpful]")) return;
        openDetail(story.id);
      });
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openDetail(story.id);
        }
      });

      var helpfulBtn = card.querySelector("[data-helpful]");
      if (helpfulBtn) {
        helpfulBtn.addEventListener("click", function (e) {
          e.stopPropagation();
          incrementHelpful(story.id);
          refreshHelpfulLabels(story.id);
          showToast("Terima kasih! Cerita ditandai membantu.");
        });
      }

      feed.appendChild(card);
    });
  }

  function refreshHelpfulLabels(storyId) {
    var stories = getAllStories();
    var story = stories.find(function (s) { return String(s.id) === String(storyId); });
    if (!story) return;
    var count = getHelpfulCount(story);
    document.querySelectorAll('[data-helpful-count="' + CSS.escape(String(storyId)) + '"]').forEach(function (el) {
      el.textContent = String(count);
    });
    if (String(activeStoryId) === String(storyId)) {
      var mc = document.getElementById("modal-helpful-count");
      var dc = document.getElementById("detail-helpful-count");
      if (mc) mc.textContent = String(count);
      if (dc) dc.textContent = String(count);
    }
  }

  function findStory(id) {
    return getAllStories().find(function (s) { return String(s.id) === String(id); });
  }

  // ---------- Detail: modal + inline section ----------
  function fillDetail(prefix, story) {
    var title = document.getElementById(prefix + "-title");
    var author = document.getElementById(prefix + "-author");
    var happened = document.getElementById(prefix + "-happened");
    var decision = document.getElementById(prefix + "-decision");
    var wrong = document.getElementById(prefix + "-wrong");
    var learned = document.getElementById(prefix + "-learned");
    var tryLink = document.getElementById(prefix + "-try-link");
    var helpfulCount = document.getElementById(prefix + "-helpful-count");
    var scenarioBadge = document.getElementById(prefix + "-scenario-badge");
    var scenarioText = document.getElementById("detail-scenario-text");

    if (title) title.textContent = story.title;
    if (author) author.textContent = story.author || "Anonim";
    if (happened) happened.textContent = story.whatHappened;
    if (decision) decision.textContent = story.theDecision;
    if (wrong) wrong.textContent = story.whatWentWrong;
    if (learned) learned.textContent = story.whatILearned;
    if (helpfulCount) helpfulCount.textContent = String(getHelpfulCount(story));
    if (tryLink) tryLink.href = "survival.html?scenario=" + encodeURIComponent(story.relatedScenarioId);

    var label = "Terkait: " + getScenarioTitle(story.relatedScenarioId);
    if (prefix === "modal" && scenarioBadge) scenarioBadge.textContent = label;
    if (prefix === "detail" && scenarioText) scenarioText.textContent = label;
  }

  function openDetail(storyId) {
    var story = findStory(storyId);
    if (!story) return;
    activeStoryId = story.id;

    // Isi modal (utama) + section inline (cadangan / anchor)
    fillDetail("modal", story);
    fillDetail("detail", story);

    var modal = document.getElementById("story-modal");
    if (modal) {
      modal.classList.remove("hidden");
      modal.classList.add("flex");
      document.body.style.overflow = "hidden";
    }
    var section = document.getElementById("story-detail");
    if (section) {
      section.classList.remove("hidden");
      section.classList.add("flex");
    }
  }

  function closeDetail() {
    activeStoryId = null;
    var modal = document.getElementById("story-modal");
    if (modal) {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
      document.body.style.overflow = "";
    }
  }

  function wireDetail() {
    var btnCloseModal = document.getElementById("btn-close-modal");
    var backdrop = document.getElementById("modal-backdrop");
    var btnCloseSection = document.getElementById("btn-close-detail");
    if (btnCloseModal) btnCloseModal.addEventListener("click", closeDetail);
    if (backdrop) backdrop.addEventListener("click", closeDetail);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeDetail();
    });
    if (btnCloseSection) {
      btnCloseSection.addEventListener("click", function () {
        var section = document.getElementById("story-detail");
        if (section) {
          section.classList.add("hidden");
          section.classList.remove("flex");
        }
        closeDetail();
      });
    }

    var modalHelpful = document.getElementById("modal-helpful-btn");
    if (modalHelpful) {
      modalHelpful.addEventListener("click", function () {
        if (!activeStoryId) return;
        incrementHelpful(activeStoryId);
        refreshHelpfulLabels(activeStoryId);
        showToast("Terima kasih! Cerita ditandai membantu.");
      });
    }
    var detailHelpful = document.getElementById("detail-helpful-btn");
    if (detailHelpful) {
      detailHelpful.addEventListener("click", function () {
        if (!activeStoryId) return;
        incrementHelpful(activeStoryId);
        refreshHelpfulLabels(activeStoryId);
        showToast("Terima kasih! Cerita ditandai membantu.");
      });
    }
  }

  // ---------- Form: Share Experience ----------
  function wireForm() {
    var form = document.getElementById("story-form");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      showFormError("");

      var author = document.getElementById("story-author").value.trim();
      var title = document.getElementById("story-title").value.trim();
      var scenarioVal = document.getElementById("story-scenario").value.trim();
      var happened = document.getElementById("story-happened").value.trim();
      var decision = document.getElementById("story-decision").value.trim();
      var wrong = document.getElementById("story-wrong").value.trim();
      var learned = document.getElementById("story-learned").value.trim();

      if (!author || !title || !scenarioVal || !happened || !decision || !wrong || !learned) {
        showFormError("Semua kolom wajib diisi. Lengkapi nama, judul, skenario terkait, dan keempat bagian cerita.");
        showToast("Lengkapi semua kolom terlebih dahulu.");
        return;
      }

      var store = getStore();
      if (!store) {
        showFormError("Penyimpanan tidak tersedia di browser ini.");
        return;
      }

      store.saveUserStory({
        author: author,
        title: title,
        relatedScenarioId: Number(scenarioVal),
        whatHappened: happened,
        theDecision: decision,
        whatWentWrong: wrong,
        whatILearned: learned
      });
      store.addXP(75);

      form.reset();
      renderFeed();
      showToast("Cerita terkirim! +75 XP untukmu.");
      document.getElementById("story-feed").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  // ---------- Init ----------
  document.addEventListener("DOMContentLoaded", function () {
    var store = getStore();
    if (store && store.initializeIfFirstVisit) store.initializeIfFirstVisit();
    renderScenarioOptions();
    renderFeed();
    wireDetail();
    wireForm();
  });
})();
