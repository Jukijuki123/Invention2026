// js/splash.js — Splashscreen "Security Scan Boot" (khusus index.html)
// Overlay disuntik via JS agar aman: tanpa JS, splash tidak pernah muncul.
// Tampil sekali per sesi (sessionStorage), hormati prefers-reduced-motion.
(function () {
    "use strict";

    var SEEN_KEY = "siaga_splash_seen";
    var MIN_MS = 4000;
    var EXIT_MS = 500;

    function alreadySeen() {
        try {
            return sessionStorage.getItem(SEEN_KEY) === "1";
        } catch (e) {
            return false;
        }
    }

    function markSeen() {
        try {
            sessionStorage.setItem(SEEN_KEY, "1");
        } catch (e) { /* abaikan: mode privat */ }
    }

    function reducedMotion() {
        return window.matchMedia &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }

    function buildOverlay() {
        var el = document.createElement("div");
        el.id = "siaga-splash";
        el.setAttribute("role", "status");
        el.setAttribute("aria-label", "Memuat SIAGA");
        el.innerHTML =
            '<div class="splash-grid"></div>' +
            '<div class="splash-core">' +
            '  <div class="splash-logo-wrap">' +
            '    <span class="splash-pulse"></span>' +
            '    <span class="splash-pulse splash-pulse-2"></span>' +
            '    <svg class="splash-ring" viewBox="0 0 120 120" aria-hidden="true">' +
            '      <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(87,223,254,0.18)" stroke-width="3"/>' +
            '      <circle class="splash-ring-arc" cx="60" cy="60" r="54" fill="none" stroke="#57DFFE" stroke-width="3" stroke-linecap="round"/>' +
            '    </svg>' +
            '    <img class="splash-logo" src="assets/images/logo.png" alt="Logo SIAGA" />' +
            '  </div>' +
            '  <div class="splash-word" aria-hidden="true">' +
            '    <span style="animation-delay:.55s">S</span>' +
            '    <span style="animation-delay:.62s">I</span>' +
            '    <span style="animation-delay:.69s">A</span>' +
            '    <span style="animation-delay:.76s">G</span>' +
            '    <span style="animation-delay:.83s">A</span>' +
            '  </div>' +
            '  <p class="splash-tag">Siap. Cek. Putuskan. Bertindak Aman.</p>' +
            '  <div class="splash-bar"><span></span></div>' +
            '  <p class="splash-status">Memeriksa ancaman…</p>' +
            '</div>' +
            '<button type="button" class="splash-skip">Lewati</button>';
        return el;
    }

    if (alreadySeen() || reducedMotion()) {
        markSeen();
        return;
    }

    var overlay = buildOverlay();
    document.body.appendChild(overlay);
    document.body.classList.add("overflow-hidden");

    var statusEl = overlay.querySelector(".splash-status");
    var timers = [];
    timers.push(setTimeout(function () {
        if (statusEl) statusEl.textContent = "Memindai vektor serangan…";
    }, 1100));
    timers.push(setTimeout(function () {
        if (statusEl) statusEl.textContent = "Sistem aman. Selamat datang.";
    }, 2200));

    var hidden = false;
    function hide() {
        if (hidden) return;
        hidden = true;
        timers.forEach(clearTimeout);
        markSeen();
        overlay.classList.add("splash-exit");
        setTimeout(function () {
            if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
            document.body.classList.remove("overflow-hidden");
        }, EXIT_MS);
    }

    overlay.querySelector(".splash-skip").addEventListener("click", hide);

    var start = Date.now();
    function hideWhenReady() {
        var wait = Math.max(0, MIN_MS - (Date.now() - start));
        setTimeout(hide, wait);
    }
    if (document.readyState === "complete") {
        hideWhenReady();
    } else {
        window.addEventListener("load", hideWhenReady);
        setTimeout(hide, MIN_MS + 2500); // pengaman bila load menggantung
    }
})();
