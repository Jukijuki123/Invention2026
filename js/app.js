const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.desktop-nav');

menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  nav?.classList.toggle('nav-open', !open);
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', () => {
    menuButton?.setAttribute('aria-expanded', 'false');
    nav?.classList.remove('nav-open');
  });
});

const state = JSON.parse(localStorage.getItem('siaga_user') || '{}');
if (!state.createdAt) {
  localStorage.setItem('siaga_user', JSON.stringify({ createdAt: new Date().toISOString(), xp: 0, level: 'Digital Rookie' }));
}
