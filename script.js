const heroSlides = [...document.querySelectorAll('.hero-slide')];
let activeSlide = 0;
function showSlide(index) {
  activeSlide = (index + heroSlides.length) % heroSlides.length;
  heroSlides.forEach((slide, i) => slide.classList.toggle('active', i === activeSlide));
  document.querySelector('#slide-current').textContent = String(activeSlide + 1).padStart(2, '0');
}
document.querySelector('#hero-next').addEventListener('click', () => showSlide(activeSlide + 1));
document.querySelector('#hero-prev').addEventListener('click', () => showSlide(activeSlide - 1));
let touchStart = 0;
document.querySelector('.hero').addEventListener('touchstart', event => { touchStart = event.changedTouches[0].clientX; }, { passive: true });
document.querySelector('.hero').addEventListener('touchend', event => {
  const distance = event.changedTouches[0].clientX - touchStart;
  if (Math.abs(distance) > 55) showSlide(activeSlide + (distance < 0 ? 1 : -1));
}, { passive: true });
window.setInterval(() => showSlide(activeSlide + 1), 6500);
const track = document.querySelector('#destination-track');
const progress = document.querySelector('#track-progress');
document.querySelector('#dest-next').addEventListener('click', () => track.scrollBy({ left: track.clientWidth * 0.75, behavior: 'smooth' }));
document.querySelector('#dest-prev').addEventListener('click', () => track.scrollBy({ left: -track.clientWidth * 0.75, behavior: 'smooth' }));
document.querySelectorAll('[data-destination-slideshow]').forEach(card => {
  const slides = [...card.querySelectorAll('.destination-image')];
  const counter = card.querySelector('.destination-slide-count');
  let current = 0;
  let timer;
  function showDestinationSlide(index) {
    slides[current].classList.remove('is-active');
    slides[current].setAttribute('aria-hidden', 'true');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('is-active');
    slides[current].setAttribute('aria-hidden', 'false');
    counter.textContent = `${current + 1} / ${slides.length}`;
    counter.setAttribute('aria-label', `Photo ${current + 1} of ${slides.length}`);
  }
  const stop = () => window.clearInterval(timer);
  const start = () => {
    stop();
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      timer = window.setInterval(() => showDestinationSlide(current + 1), 5200);
    }
  };
  slides.forEach((slide, index) => slide.setAttribute('aria-hidden', String(index !== current)));
  card.querySelector('.dest-slide-prev').addEventListener('click', () => showDestinationSlide(current - 1));
  card.querySelector('.dest-slide-next').addEventListener('click', () => showDestinationSlide(current + 1));
  card.addEventListener('mouseenter', stop);
  card.addEventListener('mouseleave', start);
  card.addEventListener('focusin', stop);
  card.addEventListener('focusout', event => { if (!card.contains(event.relatedTarget)) start(); });
  start();
});
track.addEventListener('scroll', () => {
  const max = track.scrollWidth - track.clientWidth;
  progress.style.width = `${max > 0 ? 25 + (track.scrollLeft / max) * 75 : 100}%`;
}, { passive: true });
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
menuButton.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));
document.querySelector('#year').textContent = new Date().getFullYear();
const counters = [...document.querySelectorAll('.service-number')];
const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (!entry.isIntersecting) return;
  const element = entry.target;
  const target = Number(element.dataset.count);
  const suffix = element.dataset.suffix || '';
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / 1300, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = `${Math.floor(target * eased).toLocaleString()}${suffix}`;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  observer.unobserve(element);
}), { threshold: 0.4 });
counters.forEach(counter => observer.observe(counter));
