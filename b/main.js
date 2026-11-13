// RAZNAЯ — variant B «Пудра». Rendering from data.js + GSAP motion.
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const IMG = '../img/';
const LITE = window.matchMedia('(max-width: 960px), (hover: none)').matches;
document.documentElement.classList.add('js');
if (LITE) document.documentElement.classList.add('lite');

/* ---------- links & contacts ---------- */
const extLink = (a, url) => { a.href = url; a.target = '_blank'; a.rel = 'noopener'; };
$$('[data-booking]').forEach((a) => extLink(a, SALON.booking));
$$('[data-yandex]').forEach((a) => extLink(a, SALON.yandex));
$$('[data-wa]').forEach((a) => extLink(a, SALON.whatsapp));
$$('[data-tg]').forEach((a) => extLink(a, SALON.telegram));
$$('[data-vk]').forEach((a) => extLink(a, SALON.vk));
$$('[data-route]').forEach((a) => extLink(a, SALON.route));
$$('[data-phone]').forEach((a) => { a.href = SALON.phoneHref; a.textContent = SALON.phone; });
$$('[data-phone-icon]').forEach((a) => (a.href = SALON.phoneHref));
$$('[data-address]').forEach((el) => (el.textContent = SALON.city + ', ' + SALON.address));
$$('[data-near]').forEach((el) => (el.textContent = SALON.near));
const paintStatus = () => { const s = openStatus(); $$('[data-status]').forEach((el) => { el.classList.toggle('is-open', s.open); $('b', el).textContent = s.text; }); };
paintStatus(); setInterval(paintStatus, 60000);

/* ---------- services index ---------- */
const SERVICES = [
  { id: 'nails', t: 'Маникюр', d: 'Японский, комбинированный, укрепление гелем, наращивание, дизайн', img: 'nails-10', from: 1700 },
  { id: 'pedi', t: 'Педикюр', d: 'Express или полный — с покрытием и без', img: 'pedi-01', from: 2600 },
  { id: 'lash', t: 'Ресницы', d: 'Наращивание 1D–5D, LED, ламинирование, ботокс', img: 'lash-08', from: 2400 },
  { id: 'brow', t: 'Брови', d: 'Архитектура, окрашивание хной, долговременная укладка', img: 'brow-01', from: 1000 },
  { id: 'makeup', t: 'Макияж', d: 'Дневной, вечерний, свадебный и с укладкой', img: 'makeup-waves', from: 3500 },
  { id: 'edu', t: 'Обучение', d: 'Курсы бровиста, наращивания ресниц и «Макияж для себя»', img: 'face-lashes', from: 7000 },
];
$('#svcIndex').innerHTML = SERVICES.map((s, i) => `
  <li class="irow" data-reveal data-id="${s.id}" data-img="${IMG}${s.img}.webp">
    <span class="irow__n">0${i + 1}</span>
    <h3>${s.t}<small>${s.d}</small></h3>
    <span class="irow__p"><small>от</small>${fmtPrice(s.from)}</span>
    <span class="irow__go">→</span>
  </li>`).join('');

// floating photo that follows the cursor over the index
if (!LITE) {
  const peek = $('#peek'), pimg = $('img', peek);
  let tx = 0, ty = 0, x = 0, y = 0;
  $('#svcIndex').addEventListener('pointerover', (e) => { const r = e.target.closest('.irow'); if (r) { pimg.src = r.dataset.img; peek.classList.add('is-on'); } });
  $('#svcIndex').addEventListener('pointerleave', () => peek.classList.remove('is-on'));
  addEventListener('pointermove', (e) => { tx = e.clientX + 170; ty = e.clientY; }, { passive: true });
  (function loop() { x += (tx - x) * .14; y += (ty - y) * .14; peek.style.left = x + 'px'; peek.style.top = y + 'px'; requestAnimationFrame(loop); })();
}

/* ---------- gallery ---------- */
const G = [
  ['face-pearls', 'Макияж'], ['nails-01', 'Маникюр'], ['lash-03', 'Ресницы'], ['nails-08', 'Маникюр'],
  ['brow-02', 'Брови'], ['nails-04', 'Маникюр'], ['lash-01', 'Ресницы'], ['nails-11', 'Маникюр'],
  ['face-lashes', 'Ресницы'], ['nails-06', 'Маникюр'], ['brow-03', 'Брови'], ['nails-12', 'Маникюр'],
  ['lash-09', 'Ресницы'], ['nails-09', 'Дизайн'], ['brow-04', 'Брови'],
];
const cols = $$('.col');
G.forEach(([f, c], i) => cols[i % 3].insertAdjacentHTML('beforeend', `<figure><img src="${IMG}${f}.webp" alt="${c} — работа студии RAZNAЯ" loading="lazy"><figcaption>${c}</figcaption></figure>`));

/* ---------- masters ---------- */
$('#mastersGrid').innerHTML = MASTERS.map((m) => `
  <article class="master" data-reveal>
    <div class="master__ph">${m.img ? `<img src="${IMG}${m.img}.webp" alt="${m.role} ${m.name}" loading="lazy">` : `<span class="letter">${m.name[0]}</span>`}</div>
    <small>${m.role}</small><h3>${m.name}</h3><p>${m.note}</p>
  </article>`).join('');

/* ---------- prices accordion ---------- */
$('#acc').innerHTML = PRICES.map((c, i) => `
  <div class="acc__item${i ? '' : ' is-open'}" id="acc-${c.id}">
    <button class="acc__btn" aria-expanded="${!i}"><span>${c.name}</span><small>${c.items.length} позиций</small><em>+</em></button>
    <div class="acc__panel"><div class="acc__inner">
      ${c.items.map(([t, p, from]) => `<div class="acc__row"><span>${t}</span><b>${from ? 'от ' : ''}${fmtPrice(p)}</b></div>`).join('')}
    </div></div>
  </div>`).join('');
function openAcc(id) {
  $$('.acc__item').forEach((it) => { const on = it.id === 'acc-' + id && !it.classList.contains('is-open'); it.classList.toggle('is-open', on); $('.acc__btn', it).setAttribute('aria-expanded', on); });
  setTimeout(() => window.ScrollTrigger && ScrollTrigger.refresh(), 600);
}
$('#acc').addEventListener('click', (e) => { const b = e.target.closest('.acc__btn'); if (b) openAcc(b.parentElement.id.slice(4)); });
$('#svcIndex').addEventListener('click', (e) => {
  const r = e.target.closest('.irow'); if (!r) return;
  const it = $('#acc-' + r.dataset.id); if (!it.classList.contains('is-open')) openAcc(r.dataset.id);
  setTimeout(() => it.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
});

/* ---------- reviews marquee ---------- */
const card = (r) => `<article class="rcard"><p>«${r.t}»</p><cite><span class="st">★★★★★</span><b>${r.a}</b> · Яндекс Карты</cite></article>`;
const half = Math.ceil(REVIEWS.length / 2);
[[REVIEWS.slice(0, half), '#rrow1'], [REVIEWS.slice(half), '#rrow2']].forEach(([arr, sel]) => {
  const html = arr.map(card).join('');
  $('.rrow__track', $(sel)).innerHTML = html + html; // doubled for a seamless loop
});

/* ---------- header & mobile menu ---------- */
const hdr = $('#hdr');
addEventListener('scroll', () => hdr.classList.toggle('is-solid', scrollY > 40), { passive: true });
const burger = $('#burger'), mnav = $('#mnav');
burger.onclick = () => { const o = !mnav.classList.contains('is-open'); mnav.classList.toggle('is-open', o); burger.setAttribute('aria-expanded', o); };
$$('a', mnav).forEach((a) => (a.onclick = () => { mnav.classList.remove('is-open'); burger.setAttribute('aria-expanded', false); }));

/* ---------- manifesto words ---------- */
const man = $('#manifesto');
man.innerHTML = man.innerHTML.split(/(\s+)/).map((w) => (w.trim() ? `<span class="w">${w}</span>` : w)).join('');

/* ---------- motion ---------- */
let introDone = false;
function intro() {
  if (introDone) return; introDone = true;
  if (!window.gsap) { $('#curtain').remove(); return; }
  const tl = gsap.timeline();
  tl.from('.curtain__word', { opacity: 0, y: 30, duration: .8, ease: 'power3.out' })
    .to('.curtain__word', { opacity: 0, y: -20, duration: .5, ease: 'power2.in' }, '+=.35')
    .to('#curtain', { clipPath: 'inset(0 0 100% 0)', duration: 1, ease: 'expo.inOut' })
    .set('#curtain', { display: 'none' })
    .from('.hero__title .row > span', { yPercent: 105, duration: 1.2, stagger: .1, ease: 'expo.out' }, '-=.55')
    .from('#heroArch', { clipPath: 'inset(100% 0 0 0 round 999px 999px 18px 18px)', duration: 1.3, ease: 'expo.inOut' }, '-=1.3')
    .from('#heroArch img', { scale: 1.4, duration: 1.8, ease: 'expo.out' }, '<')
    .from('.arch--side', { opacity: 0, y: 80, duration: 1.1, stagger: .12, ease: 'power3.out' }, '-=1.4')
    .from('.hero__kicker, .hero__meta, .hdr', { opacity: 0, duration: .9, stagger: .08 }, '-=1');
}
addEventListener('load', () => setTimeout(intro, 150));
setTimeout(intro, 3500); // safety if some image hangs

if (window.gsap) {
  gsap.registerPlugin(ScrollTrigger, SplitText);
  document.fonts.ready.then(() => {
    $$('.split').forEach((h) => {
      const s = SplitText.create(h, { type: 'lines', mask: 'lines' });
      gsap.from(s.lines, { yPercent: 105, duration: 1.1, stagger: .1, ease: 'expo.out', scrollTrigger: { trigger: h, start: 'top 86%' } });
    });
    ScrollTrigger.refresh();
  });
  ScrollTrigger.batch('[data-reveal]', { start: 'top 90%', onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 1, stagger: .08, ease: 'power3.out', overwrite: true }) });

  // manifesto: words light up with scroll
  gsap.to('#manifesto .w', { opacity: 1, stagger: .05, ease: 'none', scrollTrigger: { trigger: '#manifesto', start: 'top 80%', end: 'bottom 45%', scrub: true } });

  if (!LITE) {
    // hero: the arch grows to full screen, title splits apart
    const htl = gsap.timeline({ scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom bottom', scrub: .8 } });
    htl.to('#heroArch', { width: '100vw', height: '100vh', borderRadius: 0, ease: 'power2.inOut', duration: 1 }, 0)
      .to('#heroArch img', { scale: 1.02, ease: 'none', duration: 1 }, 0)
      .to('.row--1', { xPercent: -60, opacity: 0, duration: .7 }, 0)
      .to('.row--3', { xPercent: 60, opacity: 0, duration: .7 }, 0)
      .to('.row--2', { scale: .6, opacity: 0, duration: .5 }, 0)
      .to('.arch--l', { y: 300, opacity: 0, duration: .6 }, 0)
      .to('.arch--r', { y: -300, opacity: 0, duration: .6 }, 0)
      .to('.hero__kicker, .hero__meta', { opacity: 0, duration: .3 }, 0)
      .to('.arch__cap', { opacity: 1, y: -10, duration: .3 }, .7);

    // gallery columns at different speeds
    $$('.col').forEach((c) => gsap.to(c, { yPercent: +c.dataset.speed * 100, ease: 'none', scrollTrigger: { trigger: '#gallery', start: 'top bottom', end: 'bottom top', scrub: true } }));
    // studio image parallax + strip
    gsap.to('.studio__img img', { yPercent: -18, ease: 'none', scrollTrigger: { trigger: '.studio', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.from('.studio__strip figure', { y: 80, opacity: 0, duration: 1.1, stagger: .12, ease: 'power3.out', scrollTrigger: { trigger: '.studio__strip', start: 'top 85%' } });
    gsap.from('.ftr__word', { yPercent: 50, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.ftr', start: 'top 85%' } });
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
