
(() => {
  const sectionIds = ['survival', 'learn', 'challenge', 'community', 'tentang', 'faq', 'my-siaga'];
  const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);
  const navLinks = [...document.querySelectorAll('header nav a[href^="#"]')];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  sections.forEach((section) => section.classList.add('section-reveal'));
  if (reduceMotion || !('IntersectionObserver' in window)) {
    sections.forEach((section) => section.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    sections.forEach((section) => revealObserver.observe(section));
  }

  const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        const active = link.getAttribute('href') === `#${entry.target.id}`;
        link.classList.toggle('text-primary', active);
        link.classList.toggle('font-semibold', active);
        link.setAttribute('aria-current', active ? 'location' : 'false');
      });
    });
  }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
  sections.forEach((section) => activeObserver.observe(section));

  initCenteredNav();
  initAboutTabs();
  initDailyCountdown();
})();

function initDailyCountdown() {
  const el = document.getElementById('daily-countdown');
  if (!el) return;
  const pad = (n) => String(n).padStart(2, '0');
  const tick = () => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const diff = Math.max(0, midnight - now);
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    el.textContent = `RESET DALAM ${pad(h)}j ${pad(m)}m ${pad(s)}d`;
  };
  tick();
  setInterval(tick, 1000);
}
// Switch Tentang SIAGA <-> Visi & Misi (segmented tabs + panel).
function initAboutTabs() {
  const tabTentang = document.getElementById('tab-tentang');
  const tabVisi = document.getElementById('tab-visimisi');
  const panelTentang = document.getElementById('panel-tentang');
  const panelVisi = document.getElementById('panel-visimisi');
  if (!tabTentang || !tabVisi || !panelTentang || !panelVisi) return;
  const ACTIVE = ['bg-primary', 'text-on-primary', 'font-bold', 'shadow-sm'];
  const IDLE = ['text-on-surface-variant', 'font-semibold'];
  function select(showTentang) {
    panelTentang.classList.toggle('hidden', !showTentang);
    panelVisi.classList.toggle('hidden', showTentang);
    tabTentang.setAttribute('aria-selected', String(showTentang));
    tabVisi.setAttribute('aria-selected', String(!showTentang));
    tabTentang.classList.remove(...ACTIVE, ...IDLE);
    tabVisi.classList.remove(...ACTIVE, ...IDLE);
    tabTentang.classList.add(...(showTentang ? ACTIVE : IDLE));
    tabVisi.classList.add(...(showTentang ? IDLE : ACTIVE));
  }
  tabTentang.addEventListener('click', () => select(true));
  tabVisi.addEventListener('click', () => select(false));
}

function initCenteredNav() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const HEADER_GAP = 92;
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    const hash = link.getAttribute('href');
    if (!hash || hash.length < 2) return;
    link.addEventListener('click', (e) => {
      const target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      const rect = target.getBoundingClientRect();
      const offset = rect.height >= window.innerHeight
        ? HEADER_GAP
        : Math.max(HEADER_GAP, (window.innerHeight - rect.height) / 2);
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const top = Math.min(Math.max(0, rect.top + window.scrollY - offset), Math.max(0, maxScroll));
      try {
        window.history.pushState(null, '', hash);
      } catch (err) { /* abaikan */ }
      window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
      const panel = document.getElementById('mobile-nav');
      const btn = document.getElementById('btn-mobile-nav');
      if (panel && !panel.classList.contains('hidden')) {
        panel.classList.add('hidden');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

