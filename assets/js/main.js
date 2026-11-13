/* ==========================================================================
   AUTHENTIK — JS thuần (không thư viện), dùng chung cho mọi trang.
   Mỗi khối chỉ chạy khi trang có phần tử tương ứng.
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
  $$('img').forEach(img => {
    if (img.loading !== 'lazy' && img.complete && img.naturalWidth === 0 && !img.closest('.brand')) img.style.visibility = 'hidden';
    img.addEventListener('error', () => { img.style.visibility = 'hidden'; });
  });

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
  // Link menu « Circuits » (href = trang chủ#circuits-prive / #circuits-groupe):
  // trên trang chủ → lọc + cuộn tới khối Circuits; ở trang khác → mở trang chủ, lọc khi tải xong.
  const goCircuits = f => {
    applyFilter(f);
    const sec = $('#circuits');
    if (sec) sec.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    history.replaceState(null, '', '#circuits');
  };
  if ($('#cards')) {
    $$('[data-filter-link]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); $$('[data-dd].is-open').forEach(dd => dd.classList.remove('is-open')); goCircuits(a.dataset.filterLink); }));
    const m = location.hash.match(/^#circuits-(prive|groupe)$/);
    if (m) window.addEventListener('load', () => goCircuits(m[1]));
  }

  /* ---------- Avis : slider citations (không tự chạy) ---------- */
  const quotes = $$('#quotes .quote');
  let qi = 0;
  const pad = n => String(n).padStart(2, '0');
  if (quotes.length) {
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
  }

  /* ---------- Blog : lọc bài theo chủ đề + điểm đến (URL ?theme=…&dest=… để chia sẻ được) ---------- */
  const posts = $$('#posts .post-card');
  if (posts.length) {
    const state = { theme: 'all', dest: 'all' };
    const params = new URLSearchParams(location.search);
    ['theme', 'dest'].forEach(k => { if (params.get(k) && $(`[data-blog-filter="${k}"][data-value="${params.get(k)}"]`)) state[k] = params.get(k); });
    const count = $('#postCount');
    const empty = $('#postEmpty');
    const applyBlog = () => {
      let n = 0;
      posts.forEach(p => {
        const okT = state.theme === 'all' || p.dataset.theme === state.theme;
        const okD = state.dest === 'all' || (p.dataset.dest || '').split(' ').includes(state.dest);
        p.hidden = !(okT && okD);
        if (!p.hidden) { n++; p.classList.add('is-in'); }
      });
      $$('[data-blog-filter]').forEach(b => b.setAttribute('aria-pressed', String(state[b.dataset.blogFilter] === b.dataset.value)));
      if (count) count.textContent = n + (n > 1 ? ' articles' : ' article');
      if (empty) empty.hidden = n > 0;
      const q = new URLSearchParams();
      if (state.theme !== 'all') q.set('theme', state.theme);
      if (state.dest !== 'all') q.set('dest', state.dest);
      history.replaceState(null, '', location.pathname + (q.toString() ? '?' + q : '') + location.hash);
    };
    $$('[data-blog-filter]').forEach(b => b.addEventListener('click', () => { state[b.dataset.blogFilter] = b.dataset.value; applyBlog(); }));
    $$('[data-blog-reset]').forEach(b => b.addEventListener('click', () => { state.theme = 'all'; state.dest = 'all'; applyBlog(); }));
    applyBlog();
  }

  /* ---------- Bài viết : mục lục (mobile thu gọn, desktop dính cột phải, tô mục đang đọc) ---------- */
  const toc = $('#toc');
  if (toc) {
    const det = $('details', toc);
    const mq = window.matchMedia('(max-width: 1024px)');
    const setOpen = () => { if (det) det.open = !mq.matches; };
    setOpen(); mq.addEventListener('change', setOpen);
    $$('a', toc).forEach(a => a.addEventListener('click', () => { if (mq.matches && det) det.open = false; }));
    const links = $$('a[href^="#"]', toc);
    const heads = links.map(a => document.getElementById(a.getAttribute('href').slice(1))).filter(Boolean);
    if (heads.length) {
      // mục đang đọc = tiêu đề cuối cùng đã đi qua 1/3 trên của màn hình
      let ticking = false;
      const update = () => {
        let current = '';
        heads.forEach(h => { if (h.getBoundingClientRect().top < window.innerHeight * 0.35) current = h.id; });
        links.forEach(a => a.toggleAttribute('aria-current', a.getAttribute('href') === '#' + current));
        ticking = false;
      };
      window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
      update();
    }
  }

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

  /* ---------- Form devis : điền sẵn khi đến từ trang circuit (FD06) ----------
     Link dạng index.html?circuit=…&depart=2027-03-04&type=groupe&duree=19#devis */
  const qs = new URLSearchParams(location.search);
  if (form && qs.get('circuit')) {
    const circuit = qs.get('circuit').slice(0, 120);
    const dep = /^\d{4}-\d{2}-\d{2}$/.test(qs.get('depart') || '') ? qs.get('depart') : '';
    let txt = `Circuit : ${circuit}`;
    if (dep) txt += ` — départ du ${new Date(dep + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`;
    const msg = $('#f-msg');
    if (msg && !msg.value) msg.value = txt + '.\n';
    if (dep && monthSel && $(`option[value="${dep.slice(0, 7)}"]`, monthSel)) monthSel.value = dep.slice(0, 7);
    const way = $(`input[name="way"][value="${(qs.get('type') || '').replace(/[^a-z]/g, '')}"]`, form);
    if (way) way.checked = true;
    const du = parseInt(qs.get('duree'), 10), len = $('#f-length');
    if (du && len) len.selectedIndex = du < 10 ? 0 : du <= 15 ? 1 : du <= 21 ? 2 : 3;
  }

  /* ---------- Trang circuit : thanh tab dính, tô mục đang xem (TD03) ---------- */
  const tourTabs = $('#tourTabs');
  if (tourTabs) {
    const list = $('.tour-tabs__list', tourTabs);
    const links = $$('a[href^="#"]', list);
    const secs = links.map(a => document.getElementById(a.getAttribute('href').slice(1))).filter(Boolean);
    let cur = null, tick = false;
    const update = () => {
      const line = tourTabs.getBoundingClientRect().bottom + 90; // khớp scroll-margin-top của .tour-sec
      let id = '';
      secs.forEach(s => { if (s.getBoundingClientRect().top <= line) id = s.id; });
      if (id !== cur) {
        cur = id;
        links.forEach(a => { if (a.getAttribute('href') === '#' + id) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
        const act = links.find(a => a.hasAttribute('aria-current'));
        if (act && list.scrollWidth > list.clientWidth) list.scrollTo({ left: act.offsetLeft - list.offsetLeft - 24, behavior: reduceMotion ? 'auto' : 'smooth' });
      }
      tick = false;
    };
    window.addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  /* ---------- Trang circuit : lịch trình — « Tout déplier / Tout replier » (TD05) ---------- */
  const daysToggle = $('#daysToggle');
  if (daysToggle) {
    const dets = $$('.days details');
    const sync = () => {
      const all = dets.every(d => d.open);
      daysToggle.textContent = all ? 'Tout replier' : 'Tout déplier';
      daysToggle.setAttribute('aria-expanded', String(all));
    };
    daysToggle.addEventListener('click', () => { const all = dets.every(d => d.open); dets.forEach(d => { d.open = !all; }); sync(); });
    dets.forEach(d => d.addEventListener('toggle', sync));
    const h = location.hash.match(/^#jour-\d{2}$/);   // link thẳng tới 1 ngày : …#jour-05
    if (h && $(h[0])) $(h[0]).open = true;
    sync();
  }

  /* ---------- Trang circuit : thanh CTA cố định mobile (TD04) — hiện sau hero, ẩn ở CTA cuối trang ---------- */
  const tourBar = $('#tourBar');
  if (tourBar) {
    const heroEl = $('.page-hero');
    const endEl = $('.end-cta');
    const tb = () => {
      const past = heroEl ? heroEl.getBoundingClientRect().bottom < 80 : window.scrollY > 400;
      const atEnd = endEl ? endEl.getBoundingClientRect().top < window.innerHeight : false;
      const on = past && !atEnd;
      tourBar.classList.toggle('is-visible', on);
      document.body.classList.toggle('tourbar-on', on);
    };
    window.addEventListener('scroll', tb, { passive: true });
    tb();
  }

  /* ---------- Lightbox ảnh (TD01) : a[data-gallery="nhóm"] + nút [data-open-gallery="nhóm"] ---------- */
  const lb = $('#lightbox');
  if (lb) {
    const lbImg = $('#lbImg'), lbCap = $('#lbCap'), lbCount = $('#lbCount');
    let items = [], li = 0, opener = null;
    const show = i => {
      li = (i + items.length) % items.length;
      const a = items[li];
      lbImg.style.visibility = '';
      lbImg.src = a.getAttribute('href');
      lbImg.alt = a.dataset.caption || '';
      lbCap.textContent = a.dataset.caption || '';
      lbCount.textContent = items.length > 1 ? `${pad(li + 1)} / ${pad(items.length)}` : '';
      $$('.lightbox__nav', lb).forEach(b => { b.hidden = items.length < 2; });
      if (items.length > 1) (new Image()).src = items[(li + 1) % items.length].getAttribute('href'); // tải trước ảnh sau
    };
    const openLb = (group, i = 0) => {
      items = $$(`[data-gallery="${group}"]`);
      if (!items.length) return;
      opener = document.activeElement;
      lb.hidden = false; document.body.classList.add('is-locked');
      show(i);
      $('[data-lb="close"]', lb).focus();
    };
    const closeLb = () => {
      lb.hidden = true; lbImg.removeAttribute('src'); document.body.classList.remove('is-locked');
      if (opener) opener.focus();
    };
    $$('[data-gallery]').forEach(a => a.addEventListener('click', e => {
      e.preventDefault();
      openLb(a.dataset.gallery, $$(`[data-gallery="${a.dataset.gallery}"]`).indexOf(a));
    }));
    $$('[data-open-gallery]').forEach(b => b.addEventListener('click', () => openLb(b.dataset.openGallery, 0)));
    $('[data-lb="close"]', lb).addEventListener('click', closeLb);
    $('[data-lb="prev"]', lb).addEventListener('click', () => show(li - 1));
    $('[data-lb="next"]', lb).addEventListener('click', () => show(li + 1));
    lb.addEventListener('click', e => { if (e.target === lb || e.target.classList.contains('lightbox__fig')) closeLb(); });
    document.addEventListener('keydown', e => {
      if (lb.hidden) return;
      if (e.key === 'Escape') closeLb();
      else if (e.key === 'ArrowLeft') show(li - 1);
      else if (e.key === 'ArrowRight') show(li + 1);
    });
    let lx = null;
    lb.addEventListener('touchstart', e => { lx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', e => {
      if (lx === null) return;
      const dx = e.changedTouches[0].clientX - lx;
      if (Math.abs(dx) > 40 && items.length > 1) show(li + (dx < 0 ? 1 : -1));
      lx = null;
    });
  }

  /* ---------- Trang tổng hợp circuit : lọc + « Afficher plus » (LS01–LS05, LS07) ----------
     Thẻ: data-type (prive|groupe) · data-dest (vn|la|kh|combine) · data-envie (nhiều giá trị) · data-days
     URL chia sẻ được: ?type=groupe&dest=vn&envie=ethnies&duree=long */
  const tourList = $('#tourList');
  if (tourList) {
    const items = $$('.card[data-type]', tourList);
    const band = $('#listBand');
    const more = $('#listMore'), moreN = $('#listMoreN');
    const count = $('#listCount'), empty = $('#listEmpty'), fCount = $('#filterCount');
    const STEP = 12;
    const st = { type: 'all', dest: 'all', envie: 'all', duree: 'all' };
    let limit = STEP;
    const qp = new URLSearchParams(location.search);
    Object.keys(st).forEach(k => { const v = qp.get(k); if (v && $(`[data-list-filter="${k}"][data-value="${v}"]`)) st[k] = v; });
    const bucket = d => (d <= 7 ? 'court' : d <= 14 ? 'moyen' : 'long');
    const match = c => (st.type === 'all' || c.dataset.type === st.type)
      && (st.dest === 'all' || c.dataset.dest === st.dest)
      && (st.envie === 'all' || (c.dataset.envie || '').split(' ').includes(st.envie))
      && (st.duree === 'all' || bucket(+c.dataset.days) === st.duree);
    const render = (pushUrl = true) => {
      const ok = items.filter(match);
      items.forEach(c => { c.hidden = true; });
      ok.forEach((c, i) => { c.hidden = i >= limit; if (!c.hidden) c.classList.add('is-in'); });
      if (band) {   // dải CTA luôn nằm sau thẻ thứ 8 đang hiện (hoặc sau thẻ cuối nếu ít hơn)
        band.hidden = ok.length === 0;
        const shown = ok.slice(0, limit);
        if (shown.length) shown[Math.min(7, shown.length - 1)].after(band);
      }
      count.textContent = ok.length + (ok.length > 1 ? ' voyages' : ' voyage');
      empty.hidden = ok.length > 0;
      more.hidden = ok.length <= limit;
      if (moreN) moreN.textContent = `(${ok.length - Math.min(limit, ok.length)})`;
      $$('[data-list-filter]').forEach(b => b.setAttribute('aria-pressed', String(st[b.dataset.listFilter] === b.dataset.value)));
      const active = ['dest', 'envie', 'duree'].filter(k => st[k] !== 'all').length;
      if (fCount) { fCount.textContent = active; fCount.hidden = !active; }
      $$('[data-list-reset]').forEach(b => { if (!b.closest('#listEmpty')) b.hidden = !(active || st.type !== 'all'); });
      if (pushUrl) {
        const q = new URLSearchParams();
        Object.entries(st).forEach(([k, v]) => { if (v !== 'all') q.set(k, v); });
        history.replaceState(null, '', location.pathname + (q.toString() ? '?' + q : '') + location.hash);
      }
    };
    $$('[data-list-filter]').forEach(b => b.addEventListener('click', () => { st[b.dataset.listFilter] = b.dataset.value; limit = STEP; render(); }));
    $$('[data-list-reset]').forEach(b => b.addEventListener('click', () => { Object.keys(st).forEach(k => { st[k] = 'all'; }); limit = STEP; render(); }));
    $('button', more).addEventListener('click', () => { limit += STEP; render(false); });
    // mobile: bộ lọc thu gọn (mở sẵn nếu đang có lọc) · desktop: luôn mở
    const lf = $('#listFilters');
    if (lf) {
      const mq = window.matchMedia('(max-width: 760px)');
      const setLf = () => { lf.open = !mq.matches || ['dest', 'envie', 'duree'].some(k => st[k] !== 'all'); };
      setLf(); mq.addEventListener('change', setLf);
    }
    render(false);
    // đến từ menu « Petite communauté » (?type=groupe) → cuộn tới danh sách
    if (qp.toString() && !location.hash) window.addEventListener('load', () => $('#voyages').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }));
  }

  /* ---------- Trang contact : form « Écrivez-nous » ----------
     CONTACT_ENDPOINT : coder nối xử lý PHP + lưu database sau khi triển khai (tạm thời chỉ demo) */
  const cForm = $('#contactForm');
  if (cForm) {
    const CONTACT_ENDPOINT = ''; // vd '/contact/envoyer'
    const cMsg = $('textarea[name="message"]', cForm);
    const cInputs = $$('input[name="name"], input[name="email"], input[name="phone"], input[name="consent"]', cForm);
    const checkMsg = () => { const bad = cMsg.value.trim().length < 5; setErr(cMsg, bad ? 'Merci d’écrire votre message.' : ''); return !bad; };
    cInputs.forEach(i => i.addEventListener(i.type === 'checkbox' ? 'change' : 'blur', () => check(i)));
    cMsg.addEventListener('blur', checkMsg);
    cForm.addEventListener('submit', async e => {
      e.preventDefault();
      if (cForm.website.value) return; // honeypot
      const ok = [...cInputs.map(check), checkMsg()].every(Boolean);
      if (!ok) { $('.is-invalid input, .is-invalid textarea', cForm)?.focus(); return; }
      const btn = $('button[type="submit"]', cForm);
      btn.disabled = true; btn.style.opacity = '.6';
      const data = Object.fromEntries(new FormData(cForm));
      data.page = location.href; data.lang = document.documentElement.lang;
      try {
        if (CONTACT_ENDPOINT) await fetch(CONTACT_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
        else console.info('[Demo] Message contact :', data);
        cForm.style.display = 'none';
        const s = $('#contactSuccess'); s.classList.add('is-visible'); s.focus();
      } catch (err) {
        btn.disabled = false; btn.style.opacity = '';
        alert('Une erreur est survenue. Écrivez-nous sur WhatsApp ou à info@authentikvietnam.com');
      }
    });
  }

  /* ---------- Trang contact : giờ Hà Nội (Asia/Ho_Chi_Minh), cập nhật mỗi 30 s ---------- */
  const clock = $('[data-clock]');
  if (clock) {
    try {
      const fmt = new Intl.DateTimeFormat('fr-FR', { timeZone: 'Asia/Ho_Chi_Minh', hour: 'numeric', minute: '2-digit', hourCycle: 'h23' });
      const tick = () => {
        const p = Object.fromEntries(fmt.formatToParts(new Date()).map(x => [x.type, x.value]));
        clock.textContent = `${p.hour} h ${p.minute}`;
      };
      tick(); setInterval(tick, 30000);
      clock.closest('[hidden]')?.removeAttribute('hidden');
    } catch (e) { /* trình duyệt cũ : giữ ẩn dòng giờ */ }
  }

  /* ---------- Năm copyright tự động ---------- */
  const y = $('#year'); if (y) y.textContent = new Date().getFullYear();
})();
