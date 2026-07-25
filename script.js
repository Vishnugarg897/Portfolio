const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('nav');
const themeButton = document.querySelector('.theme-toggle');
const savedTheme = localStorage.getItem('portfolio-theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const isDark = theme === 'dark';
  themeButton.setAttribute('aria-pressed', isDark);
  themeButton.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  themeButton.querySelector('b').textContent = isDark ? 'Light' : 'Dark';
}
setTheme(savedTheme || (prefersDark ? 'dark' : 'light'));
themeButton.addEventListener('click', () => {
  const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('portfolio-theme', nextTheme);
  setTheme(nextTheme);
});
menuButton.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', open);
  menuButton.textContent = open ? 'Close' : 'Menu';
});
document.querySelectorAll('nav a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.textContent = 'Menu';
}));

const board = document.querySelector('.draggable-panel');
document.querySelectorAll('.draggable').forEach(card => {
  let offsetX = 0, offsetY = 0;
  card.addEventListener('pointerdown', event => {
    const cardBox = card.getBoundingClientRect();
    offsetX = event.clientX - cardBox.left;
    offsetY = event.clientY - cardBox.top;
    card.classList.add('dragging');
    card.setPointerCapture(event.pointerId);
  });
  card.addEventListener('pointermove', event => {
    if (!card.hasPointerCapture(event.pointerId)) return;
    const boardBox = board.getBoundingClientRect();
    const left = Math.max(0, Math.min(event.clientX - boardBox.left - offsetX, boardBox.width - card.offsetWidth));
    const top = Math.max(0, Math.min(event.clientY - boardBox.top - offsetY, boardBox.height - card.offsetHeight));
    card.style.left = `${left}px`;
    card.style.top = `${top}px`;
    card.style.transform = 'rotate(0deg)';
  });
  const release = event => {
    if (card.hasPointerCapture(event.pointerId)) card.releasePointerCapture(event.pointerId);
    card.classList.remove('dragging');
  };
  card.addEventListener('pointerup', release);
  card.addEventListener('pointercancel', release);
});

const learningTrack = document.querySelector('.learning-track');
const previousLearning = document.querySelector('.learning-prev');
const nextLearning = document.querySelector('.learning-next');
let learningIndex = 0;

function moveLearning(direction) {
  const card = learningTrack.querySelector('article');
  const trackStyle = window.getComputedStyle(learningTrack);
  const gap = Number.parseFloat(trackStyle.gap) || 0;
  const step = card.getBoundingClientRect().width + gap;
  learningIndex = (learningIndex + direction + 3) % 3;
  learningTrack.classList.add('is-controlled');
  learningTrack.style.transform = `translateX(${-learningIndex * step}px)`;
}
previousLearning.addEventListener('click', () => moveLearning(-1));
nextLearning.addEventListener('click', () => moveLearning(1));
