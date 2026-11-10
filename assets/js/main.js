/* ==========================================================================
   AUTHENTIK — TRANG CHỦ · JS thuần (không thư viện)
   ========================================================================== */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Logo : nếu không tải được → hiện wordmark chữ ---------- */
  $$('.brand').forEach(b => {
    const img = $('.brand__logo', b);
    if (!img) return;
    const fail = () => b.classList.add('is-fallback');
    if (img.complete && img.naturalWidth === 0) fail();
    img.addEventListener('error', fail);
  });

  /* ---------- Ảnh lỗi → giữ nền tối (không hiện icon ảnh vỡ) ---------- */
  $$('img').forEach(img => img.addEventListener('error', () => { img.style.visibility = 'hidden'; }));

  /* ---------- Navbar : thu gọn khi cuộn, ẩn khi cuộn xuống, hiện khi cuộn lên ---------- */
  const nav = $('#nav');
  let lastY = window.scrollY;
  const toTop = $('#toTop');
  const ring = toTop && $('.ring .fg', toTop);
  const RING = 2 * Math.PI * 23;
  if (ring) { ring.style.strokeDasharray = RING; ring.style.strokeDashoffset = RING; }

  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle('is-scrolled', y > 40);
    const menuOpen = document.body.classList.contains('is-locked') || $('.dd.is-open');
    if (!menuOpen) nav.classList.toggle('is-hidden', y > lastY && y > window.innerHeight * 0.9);
    lastY = y;

    // back-to-top : chỉ hiện sau 1 màn hình + vòng tiến độ đọc
    if (toTop) {
      toTop.classList.toggle('is-visible', y > window.innerHeight);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (ring && max > 0) ring.style.strokeDashoffset = RING * (1 - Math.min(y / max, 1));
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Dropdown (Circuits, langue) : hover desktop + click + Échap ---------- */
  $$('[data-dd]').forEach(dd => {
    const btn = $('button', dd);
    let t;
    const open = () => { clearTimeout(t); $$('[data-dd].is-open').forEach(o => o !== dd && close(o)); dd.classList.add('is-open'); btn.setAttribute('aria-expanded', 'true'); };
    const close = (el = dd) => { el.classList.remove('is-open'); $('button', el).setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', e => { e.stopPropagation(); dd.classList.contains('is-open') ? close() : open(); });
    if (window.matchMedia('(hover: hover)').matches) {
      dd.addEventListener('mouseenter', () => { t = setTimeout(open, 150); });
      dd.addEventListener('mouseleave', () => { clearTimeout(t); t = setTimeout(() => close(), 200); });
    }
    dd.addEventListener('keydown', e => { if (e.key === 'Escape') { close(); btn.focus(); } });
  });
  document.addEventListener('click', e => { $$('[data-dd].is-open').forEach(dd => { if (!dd.contains(e.target)) { dd.classList.remove('is-open'); $('button', dd).setAttribute('aria-expanded', 'false'); } }); });

  /* ---------- Menu mobile ---------- */
  const burger = $('#burger');
  const mnav = $('#mnav');
  const setMenu = openIt => {
    burger.setAttribute('aria-expanded', String(openIt));
    burger.setAttribute('aria-label', openIt ? 'Fermer le menu' : 'Ouvrir le menu');
    mnav.classList.toggle('is-open', openIt);
    mnav.setAttribute('aria-hidden', String(!openIt));
    document.body.classList.toggle('is-locked', openIt);
    nav.classList.remove('is-hidden');
  };
  burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
  $$('[data-close]', mnav).forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && mnav.classList.contains('is-open')) setMenu(false); });

  /* ---------- Hero vidéo : phát nếu có file, sinon poster + Ken Burns ---------- */
  const hero = $('.hero');
  const video = $('#heroVideo');
  if (video && !reduceMotion) {
    video.addEventListener('canplay', () => { hero.classList.add('has-video'); video.play().catch(() => {}); }, { once: true });
    const sources = $$('source', video);
    let failed = 0;
    sources.forEach(s => s.addEventListener('error', () => { if (++failed === sources.length) hero.classList.add('no-video'); }));
    video.addEventListener('error', () => hero.classList.add('no-video'));
    video.load();
    setTimeout(() => { if (!hero.classList.contains('has-video')) hero.classList.add('no-video'); }, 2500);
  }

  /* ---------- Modal film (YouTube nocookie, chỉ tải khi bấm) ---------- */
  const modal = $('#filmModal');
  const box = $('#filmBox');
  const closeModal = () => { modal.classList.remove('is-open'); box.innerHTML = ''; document.body.classList.remove('is-locked'); };
  $$('[data-film]').forEach(b => b.addEventListener('click', () => {
    box.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${b.dataset.film}?autoplay=1&rel=0" title="Film Authentik Vietnam" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
    modal.classList.add('is-open'); document.body.classList.add('is-locked');
    $('[data-close-modal]', modal).focus();
  }));
  $('[data-close-modal]', modal).addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal(); });

  /* ---------- Reveal khi cuộn ---------- */
  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    }), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(el => io.observe(el));
  } else reveals.forEach(el => el.classList.add('is-in'));

  /* ---------- Circuits : lọc Inspirations / Petits groupes ---------- */
  const tabs = $$('.tabs [data-filter]');
  const cards = $$('#cards .card');
  const applyFilter = f => {
    tabs.forEach(t => t.setAttribute('aria-selected', String(t.dataset.filter === f)));
    cards.forEach(c => { c.hidden = !(f === 'all' || c.dataset.type === f || c.dataset.type === 'all'); if (!c.hidden) c.classList.add('is-in'); });
    const track = $('#cards'); if (track) track.scrollLeft = 0;
  };
  tabs.forEach(t => t.addEventListener('click', () => applyFilter(t.dataset.filter)));
  $$('[data-filter-link]').forEach(a => a.addEventListener('click', () => applyFilter(a.dataset.filterLink)));

  /* ---------- Avis : slider citations (không tự chạy) ---------- */
  const quotes = $$('#quotes .quote');
  let qi = 0;
  const pad = n => String(n).padStart(2, '0');
  const showQ = i => {
    qi = (i + quotes.length) % quotes.length;
    quotes.forEach((q, k) => q.classList.toggle('is-active', k === qi));
    $('#qNow').textContent = pad(qi + 1);
  };
  $('#qTotal').textContent = pad(quotes.length);
  $$('[data-q]').forEach(b => b.addEventListener('click', () => showQ(qi + (b.dataset.q === 'next' ? 1 : -1))));
  // vuốt trên mobile
  let x0 = null;
  const track = $('#quotes');
  track.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) showQ(qi + (dx < 0 ? 1 : -1)); x0 = null; });

  /* ---------- Form devis ---------- */
  // Tháng : từ tháng sau, 15 tháng
  const monthSel = $('#f-month');
  if (monthSel) {
    const d = new Date(); d.setDate(1);
    for (let i = 1; i <= 15; i++) {
      const m = new Date(d.getFullYear(), d.getMonth() + i, 1);
      const label = m.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
      monthSel.insertAdjacentHTML('beforeend', `<option value="${m.getFullYear()}-${pad(m.getMonth() + 1)}">${label.charAt(0).toUpperCase() + label.slice(1)}</option>`);
    }
  }

  const form = $('#devisForm');
  const FORM_ENDPOINT = ''; // PHP: điền URL xử lý, vd '/devis/envoyer'
  const msgs = {
    name: 'Merci d’indiquer votre nom.',
    email: 'Merci d’indiquer une adresse e-mail valide.',
    phone: 'Format conseillé : +33 6 12 34 56 78',
    consent: 'Merci d’accepter la politique de confidentialité.'
  };
  const setErr = (input, msg) => {
    const field = input.closest('.field');
    field.classList.toggle('is-invalid', !!msg);
    const err = $('.field__err', field); if (err) err.textContent = msg || '';
  };
  const check = input => {
    let msg = '';
    if (input.name === 'name' && input.value.trim().length < 2) msg = msgs.name;
    if (input.name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.value.trim())) msg = msgs.email;
    if (input.name === 'phone' && input.value.trim() && !/^\+?[\d\s().-]{8,}$/.test(input.value.trim())) msg = msgs.phone;
    if (input.name === 'consent' && !input.checked) msg = msgs.consent;
    setErr(input, msg);
    return !msg;
  };
  if (form) {
    const inputs = $$('input[name="name"], input[name="email"], input[name="phone"], input[name="consent"]', form);
    inputs.forEach(i => i.addEventListener(i.type === 'checkbox' ? 'change' : 'blur', () => check(i)));
    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (form.website.value) return; // honeypot
      const ok = inputs.map(check).every(Boolean);
      if (!ok) { $('.is-invalid input, .is-invalid select', form)?.focus(); return; }
      const btn = $('button[type="submit"]', form);
      btn.disabled = true; btn.style.opacity = '.6';
      const data = Object.fromEntries(new FormData(form));
      data.page = location.href; data.lang = document.documentElement.lang;
      try {
        if (FORM_ENDPOINT) await fetch(FORM_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
        else console.info('[Demo] Demande de devis :', data);
        form.style.display = 'none';
        const s = $('#formSuccess'); s.classList.add('is-visible'); s.focus();
      } catch (err) {
        btn.disabled = false; btn.style.opacity = '';
        alert('Une erreur est survenue. Écrivez-nous sur WhatsApp ou à info@authentikvietnam.com');
      }
    });
  }

  /* ---------- Năm copyright tự động ---------- */
  const y = $('#year'); if (y) y.textContent = new Date().getFullYear();
})();
