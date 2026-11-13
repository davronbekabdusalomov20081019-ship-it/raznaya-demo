// RAZNAЯ — variant A «Неон». Rendering from data.js + GSAP motion.
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const IMG = '../img/';
// Phones / no-mouse devices get a lighter version (scroll animations stutter there)
const LITE = window.matchMedia('(max-width: 960px), (hover: none)').matches;
document.documentElement.classList.add('js');
if (LITE) document.documentElement.classList.add('lite');

/* ---------- links & contacts ---------- */
$$('[data-booking]').forEach((a) => { a.href = SALON.booking; a.target = '_blank'; a.rel = 'noopener'; });
$$('[data-phone]').forEach((a) => { a.href = SALON.phoneHref; a.textContent = SALON.phone; });
$$('[data-phone-icon]').forEach((a) => { a.href = SALON.phoneHref; });
$$('[data-yandex]').forEach((a) => { a.href = SALON.yandex; a.target = '_blank'; a.rel = 'noopener'; });
const ext = { '[data-wa]': SALON.whatsapp, '[data-tg]': SALON.telegram, '[data-vk]': SALON.vk, '[data-route]': SALON.route };
Object.entries(ext).forEach(([sel, url]) => $$(sel).forEach((a) => { a.href = url; a.target = '_blank'; a.rel = 'noopener'; }));
$$('[data-address]').forEach((el) => (el.textContent = SALON.city + ', ' + SALON.address));
$$('[data-near]').forEach((el) => (el.textContent = SALON.near));
function paintStatus() {
  const s = openStatus();
  $$('[data-status]').forEach((el) => { el.classList.toggle('is-open', s.open); $('b', el).textContent = s.text; });
}
paintStatus(); setInterval(paintStatus, 60000);

/* ---------- services ---------- */
const SERVICES = [
  { id: 'nails', t: 'Маникюр', d: 'Комбинированный, японский, наращивание и дизайн', img: 'nails-03', from: 1700 },
  { id: 'pedi', t: 'Педикюр', d: 'Express или полный, с покрытием и без', img: 'pedi-01', from: 2600 },
  { id: 'lash', t: 'Ресницы', d: 'Наращивание 1D–5D, LED, ламинирование', img: 'lash-03', from: 2400 },
  { id: 'brow', t: 'Брови', d: 'Архитектура, окрашивание, ламинирование', img: 'brow-02', from: 1000 },
  { id: 'makeup', t: 'Макияж', d: 'Дневной, вечерний и свадебный', img: 'face-natural', from: 3500 },
  { id: 'edu', t: 'Обучение', d: 'Курсы бровиста, lash-мастера и макияж для себя', img: 'face-lashes', from: 7000 },
];
$('#svcGrid').innerHTML = SERVICES.map((s, i) => `
  <button class="svc" data-reveal data-tab="${s.id}">
    <img src="${IMG}${s.img}.webp" alt="${s.t} — работа студии" loading="lazy">
    <span class="svc__num">0${i + 1}</span>
    <div class="svc__body">
      <div><h3>${s.t}</h3><p>${s.d}<br>от <b>${fmtPrice(s.from)}</b></p></div>
      <span class="svc__arrow">→</span>
    </div>
  </button>`).join('');

/* ---------- works ---------- */
const WORKS = [
  ['nails-01', 'Маникюр'], ['lash-01', 'Ресницы'], ['brow-01', 'Брови'], ['nails-10', 'Маникюр'], ['face-pearls', 'Макияж'],
  ['lash-08', 'Ресницы'], ['nails-07', 'Френч'], ['brow-03', 'Брови'], ['nails-11', 'Маникюр'], ['lash-05', 'Ресницы'],
  ['nails-09', 'Дизайн'], ['makeup-waves', 'Макияж и укладка'], ['nails-12', 'Маникюр'], ['lash-07', 'Ресницы'], ['brow-05', 'Брови'], ['nails-04', 'Маникюр'],
];
$('#worksTrack').innerHTML = WORKS.map(([f, c]) => `<figure class="work"><img src="${IMG}${f}.webp" alt="${c} — работа студии RAZNAЯ" loading="lazy"><span>${c}</span></figure>`).join('');

/* ---------- masters ---------- */
$('#mastersGrid').innerHTML = MASTERS.map((m) => `
  <article class="master" data-reveal>
    <div class="master__ph">${m.img ? `<img src="${IMG}${m.img}.webp" alt="${m.role} ${m.name}" loading="lazy">` : `<span class="letter">${m.name[0]}</span>`}</div>
    <div class="master__body"><small>${m.role}</small><h3>${m.name}</h3><p>${m.note}</p></div>
  </article>`).join('');

/* ---------- prices ---------- */
const tabs = $('#priceTabs'), list = $('#priceList');
tabs.innerHTML = PRICES.map((c, i) => `<button class="tab${i ? '' : ' is-active'}" role="tab" data-id="${c.id}">${c.name}</button>`).join('');
function showPrices(id) {
  const cat = PRICES.find((c) => c.id === id);
  $$('.tab', tabs).forEach((t) => t.classList.toggle('is-active', t.dataset.id === id));
  list.innerHTML = cat.items.map(([t, p, from]) => `<div class="prow"><span>${t}</span><b>${from ? '<small>от</small>' : ''}${fmtPrice(p)}</b></div>`).join('');
  if (window.gsap) gsap.from('.prow', { opacity: 0, y: 14, duration: .45, stagger: .03, ease: 'power2.out' });
}
tabs.addEventListener('click', (e) => { const b = e.target.closest('.tab'); if (b) showPrices(b.dataset.id); });
showPrices(PRICES[0].id);
$('#svcGrid').addEventListener('click', (e) => {
  const b = e.target.closest('.svc'); if (!b) return;
  showPrices(b.dataset.tab); $('#prices').scrollIntoView({ behavior: 'smooth' });
});

/* ---------- reviews ---------- */
const rvTrack = $('#rvTrack');
rvTrack.innerHTML = REVIEWS.map((r) => `<div class="rv__item"><blockquote>${r.t}</blockquote><cite><span class="stars">★★★★★</span><b>${r.a}</b> · отзыв на Яндекс Картах</cite></div>`).join('');
let rvI = 0;
function rvGo(d) {
  rvI = (rvI + d + REVIEWS.length) % REVIEWS.length;
  rvTrack.style.transform = `translateX(${-rvI * 100}%)`;
  $('#rvNum').textContent = String(rvI + 1).padStart(2, '0') + ' / ' + String(REVIEWS.length).padStart(2, '0');
}
$('#rvPrev').onclick = () => { rvGo(-1); rvRestart(); };
$('#rvNext').onclick = () => { rvGo(1); rvRestart(); };
let rvTimer; const rvRestart = () => { clearInterval(rvTimer); rvTimer = setInterval(() => rvGo(1), 7000); };
rvRestart();
// swipe on touch
let sx = null;
rvTrack.addEventListener('touchstart', (e) => (sx = e.touches[0].clientX), { passive: true });
rvTrack.addEventListener('touchend', (e) => { if (sx === null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) { rvGo(dx < 0 ? 1 : -1); rvRestart(); } sx = null; });

/* ---------- header & mobile menu ---------- */
const hdr = $('#hdr'); let lastY = 0;
addEventListener('scroll', () => { const y = scrollY; hdr.classList.toggle('is-hidden', y > 300 && y > lastY); lastY = y; }, { passive: true });
const burger = $('#burger'), mnav = $('#mnav');
burger.onclick = () => { const o = !mnav.classList.contains('is-open'); mnav.classList.toggle('is-open', o); burger.setAttribute('aria-expanded', o); };
$$('a', mnav).forEach((a) => (a.onclick = () => { mnav.classList.remove('is-open'); burger.setAttribute('aria-expanded', false); }));

/* ---------- cursor glow ---------- */
if (!LITE) {
  const g = $('.cursor-glow');
  addEventListener('pointermove', (e) => { g.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`; }, { passive: true });
}

/* ---------- loader + motion ---------- */
let introDone = false;
function intro() {
  if (introDone) return; introDone = true;
  document.body.classList.add('loaded');
  if (!window.gsap) { $('#loader').remove(); return; }
  const tl = gsap.timeline();
  tl.to('#loader', { yPercent: -100, duration: 1, ease: 'expo.inOut' })
    .set('#loader', { display: 'none' })
    .from('.hero__title .line > span', { yPercent: 110, duration: 1.1, stagger: .09, ease: 'expo.out' }, '-=.45')
    .from('.hero .eyebrow, .hero__lead, .hero__cta, .hero__chips', { opacity: 0, y: 24, duration: .8, stagger: .08, ease: 'power3.out' }, '-=.8')
    .from('.hero__main', { clipPath: 'inset(100% 0 0 0 round 240px 240px 22px 22px)', duration: 1.3, ease: 'expo.inOut' }, '-=1.3')
    .from('.hero__main img', { scale: 1.5, duration: 1.8, ease: 'expo.out' }, '<')
    .from('.hero__float, .hero__badge', { opacity: 0, y: 60, scale: .9, duration: 1, stagger: .12, ease: 'power3.out' }, '-=1.1')
    .from('.hdr', { y: -90, opacity: 0, duration: .8, ease: 'power3.out' }, '-=1');
}
// fake-but-honest counter: follows real image loading of the hero
(function loader() {
  const imgs = $$('.hero img, .loader img');
  let done = 0; const num = $('#loadNum');
  const tick = () => { done++; num.textContent = Math.round((done / imgs.length) * 100); if (done === imgs.length) setTimeout(intro, 350); };
  imgs.forEach((im) => (im.complete ? tick() : (im.addEventListener('load', tick), im.addEventListener('error', tick))));
  setTimeout(() => { if (!document.body.classList.contains('loaded')) intro(); }, 4000); // safety
})();

if (window.gsap) {
  gsap.registerPlugin(ScrollTrigger, SplitText);

  // section headings: line-by-line reveal
  document.fonts.ready.then(() => {
    $$('.split').forEach((h) => {
      const s = SplitText.create(h, { type: 'lines', mask: 'lines' });
      gsap.from(s.lines, { yPercent: 105, duration: 1, stagger: .1, ease: 'expo.out', scrollTrigger: { trigger: h, start: 'top 85%' } });
    });
    ScrollTrigger.refresh();
  });
  // cards
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 88%',
    onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: .9, stagger: .08, ease: 'power3.out', overwrite: true }),
  });
  // stats count-up
  $$('[data-count]').forEach((el) => {
    const end = +el.dataset.count, dec = +(el.dataset.dec || 0), plus = 'plus' in el.dataset;
    const o = { v: 0 };
    gsap.to(o, { v: end, duration: 1.8, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 90%' },
      onUpdate: () => (el.textContent = o.v.toFixed(dec).replace('.', ',') + (plus ? '+' : '')) });
  });

  if (!LITE) {
    // hero parallax on scroll
    gsap.to('.hero__main img', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero__float--1', { y: -120, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero__float--2', { y: 90, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero__title', { yPercent: -18, opacity: .2, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

    // works: pinned horizontal scroll
    const track = $('#worksTrack');
    const dist = () => track.scrollWidth - innerWidth;
    gsap.to(track, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: { trigger: '.works', pin: '.works__pin', start: 'top top', end: () => '+=' + dist(), scrub: .6, invalidateOnRefresh: true,
        onUpdate: (st) => ($('#worksBar').style.width = st.progress * 100 + '%') },
    });

    // studio photos parallax
    $$('[data-speed]').forEach((el) => gsap.to(el, { yPercent: +el.dataset.speed * 100, ease: 'none', scrollTrigger: { trigger: '.studio', start: 'top bottom', end: 'bottom top', scrub: true } }));

    // promo big number
    gsap.from('.promo__big', { scale: .6, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.promo', start: 'top 75%' } });
    // footer wordmark
    gsap.from('.ftr__word', { yPercent: 40, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.ftr', start: 'top 90%' } });
  }
  addEventListener('load', () => ScrollTrigger.refresh());
}

/* test hook for headless screenshots: ?shot=<px> or ?shot=<css selector> */
(function () {
  const q = new URLSearchParams(location.search).get('shot');
  if (!q) return;
  setTimeout(() => {
    const el = /^\d+$/.test(q) ? null : document.querySelector(q);
    const y = el ? el.getBoundingClientRect().top + scrollY : +q;
    document.documentElement.style.scrollBehavior = 'auto';
    scrollTo(0, y);
  }, 3000);
})();
