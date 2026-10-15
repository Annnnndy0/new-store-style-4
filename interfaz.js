// Brand · propuesta «Style 4». Todo el comportamiento de la página, sin librerías:
// barra global con paneles, menú móvil, carrito (localStorage "lab-cart", la misma clave que
// lab-lab), barra de la página, carrusel "Compra con tranquilidad", comparador en móvil,
// "Ayúdame a elegir", respuestas rápidas de las guías, preguntas frecuentes, pie plegable y
// apariciones al hacer scroll. Sin JavaScript la página se ve entera y los enlaces funcionan.
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = window.matchMedia('(min-width: 834px)');

  // ---------------------------------------------------------------------------------------------
  // Catálogo (precios de muestra de lab-lab; mismos ids que catalog.js)
  // ---------------------------------------------------------------------------------------------
  const CATALOG = {
    p1: { name: 'Producto 1', price: 24.9, url: 'productos/producto-1/', img: 'assets/producto-1.webp' },
    p2: { name: 'Producto 2', price: 34.9, url: 'productos/producto-2/', img: 'assets/producto-1.webp' },
    p3: { name: 'Producto 3', price: 44.9, url: 'productos/producto-3/', img: 'assets/producto-1.webp' },
    p4: { name: 'Producto 4', price: 59.9, url: 'productos/producto-4/', img: 'assets/producto-1.webp' },
  };
  const FREE_FROM = 150;
  const eur = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });

  // ---------------------------------------------------------------------------------------------
  // Barra global: paneles al pasar el ratón (con una pequeña espera, como apple.com), con el botón
  // ⌄ desde el teclado, y Esc para cerrar. El resto de la página se desenfoca.
  // ---------------------------------------------------------------------------------------------
  const scrim = $('[data-scrim]');
  const items = $$('[data-gnav-item]');
  let openItem = null;
  let hoverTimer = 0;

  function openFly(item) {
    if (openItem === item) return;
    closeBag();
    if (openItem) setItem(openItem, false);
    openItem = item;
    setItem(item, true);
    scrim.classList.add('is-on');
  }
  function closeFly() {
    if (!openItem) return;
    setItem(openItem, false);
    openItem = null;
    if (!bagOpen) scrim.classList.remove('is-on');
  }
  function setItem(item, on) {
    item.classList.toggle('is-open', on);
    item.querySelector('.gnav__open').setAttribute('aria-expanded', String(on));
  }

  items.forEach((item) => {
    item.addEventListener('pointerenter', (e) => {
      if (e.pointerType !== 'mouse' || !desktop.matches) return;
      clearTimeout(hoverTimer);
      hoverTimer = setTimeout(() => openFly(item), openItem ? 0 : 160);
    });
    item.querySelector('.gnav__open').addEventListener('click', () => {
      if (openItem === item) closeFly();
      else {
        openFly(item);
        item.querySelector('.fly a')?.focus();
      }
    });
    // Al salir del panel con el tabulador, se cierra
    item.addEventListener('focusout', (e) => {
      if (openItem === item && !item.contains(e.relatedTarget)) closeFly();
    });
  });
  $('[data-gnav]').addEventListener('pointerleave', (e) => {
    if (e.pointerType !== 'mouse') return;
    clearTimeout(hoverTimer);
    hoverTimer = setTimeout(closeFly, 120);
  });
  $('[data-gnav]').addEventListener('pointerenter', () => clearTimeout(hoverTimer));
  scrim.addEventListener('click', () => { closeFly(); closeBag(); });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (openItem) {
      const btn = openItem.querySelector('.gnav__open');
      closeFly();
      btn.focus();
    }
    if (bagOpen) { closeBag(); bagToggle.focus(); }
    if (mnavOpen) setMnav(false);
  });
  // Un clic en un enlace del panel que lleva a esta misma página cierra el panel
  $$('.fly a[href^="#"]').forEach((a) => a.addEventListener('click', () => { closeFly(); setMnav(false); }));

  // ---------------------------------------------------------------------------------------------
  // Menú móvil: lista grande; cada sección abre su submenú (el mismo contenido que los paneles)
  // ---------------------------------------------------------------------------------------------
  const burger = $('[data-burger]');
  const mnav = $('[data-mnav]');
  const mRoot = $('[data-mnav-root]');
  const mSub = $('[data-mnav-sub]');
  const mSlot = $('[data-mnav-slot]');
  let mnavOpen = false;

  function setMnav(on) {
    if (mnavOpen === on) return;
    mnavOpen = on;
    burger.setAttribute('aria-expanded', String(on));
    burger.setAttribute('aria-label', on ? 'Cerrar menú' : 'Abrir menú');
    mnav.hidden = !on;
    document.documentElement.classList.toggle('mnav-open', on);
    if (on) { closeBag(); showRoot(); }
  }
  function showRoot() {
    mSub.hidden = true;
    mRoot.hidden = false;
    mSlot.replaceChildren();
  }
  burger.addEventListener('click', () => setMnav(!mnavOpen));
  $$('[data-mnav-open]').forEach((btn) => btn.addEventListener('click', () => {
    const src = document.getElementById(btn.dataset.mnavOpen);
    const copy = src.querySelector('.fly__in').cloneNode(true);
    copy.classList.remove('wrap');
    copy.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMnav(false)));
    mSlot.replaceChildren(copy);
    mRoot.hidden = true;
    mSub.hidden = false;
    $('[data-mnav-back]').focus();
  }));
  $('[data-mnav-back]').addEventListener('click', showRoot);
  $$('.mnav__list a').forEach((a) => a.addEventListener('click', () => setMnav(false)));
  desktop.addEventListener('change', (e) => { if (e.matches) setMnav(false); });

  // ---------------------------------------------------------------------------------------------
  // Carrito: mismo formato que lab-lab ([{ id, qty }] en "lab-cart"). El desplegable confirma lo
  // añadido. El enlace del carrito lleva a carrito/ si se abre en otra pestaña o sin JavaScript.
  // ---------------------------------------------------------------------------------------------
  const CART = 'lab-cart';
  const bag = $('[data-bag]');
  const bagToggle = $('[data-bag-toggle]');
  let bagOpen = false;
  let bagTimer = 0;

  function readCart() {
    try {
      const v = JSON.parse(localStorage.getItem(CART) || '[]');
      return Array.isArray(v) ? v.filter((l) => CATALOG[l.id] && l.qty > 0) : [];
    } catch { return []; }
  }
  function writeCart(lines) {
    try { localStorage.setItem(CART, JSON.stringify(lines)); } catch { /* modo privado */ }
  }
  function addToCart(id) {
    const lines = readCart();
    const line = lines.find((l) => l.id === id);
    if (line) line.qty += 1; else lines.push({ id, qty: 1 });
    writeCart(lines);
    renderCart(id);
  }
  function renderCart(justAdded) {
    const lines = readCart();
    const count = lines.reduce((n, l) => n + l.qty, 0);
    const total = lines.reduce((n, l) => n + l.qty * CATALOG[l.id].price, 0);
    $$('[data-cart-count]').forEach((el) => { el.hidden = count === 0; el.textContent = count; });
    bagToggle.setAttribute('aria-label', count ? `Carrito, ${count} ${count === 1 ? 'producto' : 'productos'}` : 'Carrito');

    const title = $('[data-bag-title]');
    const list = $('[data-bag-list]');
    const tot = $('[data-bag-total]');
    const go = $('[data-bag-go]');
    title.textContent = justAdded ? `Añadido: ${CATALOG[justAdded].name}.` : count ? 'Tu carrito' : 'Tu carrito está vacío.';
    list.replaceChildren(...lines.map((l) => {
      const p = CATALOG[l.id];
      const li = document.createElement('li');
      li.innerHTML = `<img src="${p.img}" alt=""><span><b></b><small></small></span><span></span>`;
      li.querySelector('b').textContent = p.name;
      li.querySelector('small').textContent = `Cantidad: ${l.qty}`;
      li.lastElementChild.textContent = eur.format(p.price * l.qty);
      return li;
    }));
    tot.hidden = go.hidden = count === 0;
    if (count) {
      const left = FREE_FROM - total;
      tot.innerHTML = `<span>Total</span><span>${eur.format(total)}</span>`;
      tot.title = left > 0 ? `Te faltan ${eur.format(left)} para el envío gratis` : 'Envío gratis';
    }
  }
  function openBag() {
    closeFly();
    // Justo debajo de la barra que esté a la vista (la global arriba del todo o la fija de la página)
    const below = Math.max($('[data-gnav]').getBoundingClientRect().bottom, $('[data-lnav]').getBoundingClientRect().bottom);
    bag.style.top = `${Math.max(0, below) + 8}px`;
    bag.hidden = false;
    bagOpen = true;
    bagToggle.setAttribute('aria-expanded', 'true');
  }
  function closeBag() {
    if (!bagOpen) return;
    bag.hidden = true;
    bagOpen = false;
    bagToggle.setAttribute('aria-expanded', 'false');
  }
  bagToggle.setAttribute('aria-expanded', 'false');
  bagToggle.addEventListener('click', (e) => {
    e.preventDefault();
    if (bagOpen) closeBag();
    else { renderCart(); openBag(); }
  });
  document.addEventListener('click', (e) => {
    if (bagOpen && !bag.contains(e.target) && !bagToggle.contains(e.target)) closeBag();
  });
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-add]');
    if (!btn) return;
    addToCart(btn.dataset.add);
    // Confirmación en el propio botón y en el desplegable
    const label = btn.textContent;
    btn.classList.add('is-added');
    btn.textContent = 'Añadido ✓';
    setTimeout(() => { btn.classList.remove('is-added'); btn.textContent = label; }, 1600);
    openBag();
    // Abierto por "Añadir": se cierra solo a los 5 s si no se está usando
    clearTimeout(bagTimer);
    bagTimer = setTimeout(() => { if (!bag.matches(':hover, :focus-within')) closeBag(); }, 5000);
  });
  window.addEventListener('storage', (e) => { if (e.key === CART) renderCart(); });
  renderCart();

  // ---------------------------------------------------------------------------------------------
  // Barra de la página: flota al quedarse fija, marca la sección visible y en móvil despliega los
  // accesos con la flecha.
  // ---------------------------------------------------------------------------------------------
  const lnav = $('[data-lnav]');
  const lToggle = $('[data-lnav-toggle]');
  const lMenu = $('[data-lnav-menu]');
  const setLmenu = (on) => {
    lToggle.setAttribute('aria-expanded', String(on));
    lMenu.classList.toggle('is-open', on);
  };
  lToggle.addEventListener('click', () => setLmenu(lToggle.getAttribute('aria-expanded') !== 'true'));
  $$('a', lMenu).forEach((a) => a.addEventListener('click', () => setLmenu(false)));

  const onScroll = () => {
    const stuck = lnav.getBoundingClientRect().top <= 0 && window.scrollY > 0;
    lnav.classList.toggle('is-stuck', stuck);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const links = $$('.lnav__links a');
  const targets = links.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      links.forEach((a) => a.classList.toggle('is-current', a.getAttribute('href') === `#${en.target.id}`));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  targets.forEach((t) => spy.observe(t));

  // ---------------------------------------------------------------------------------------------
  // Carrusel "Compra con tranquilidad": se desliza con el dedo (scroll-snap) o con la píldora
  // ---------------------------------------------------------------------------------------------
  const hl = $('[data-hl]');
  if (hl) {
    const track = $('[data-hl-track]', hl);
    const cards = $$('.hl__card', track);
    const dotsBox = $('[data-hl-dots]', hl);
    const prev = $('[data-hl-prev]', hl);
    const next = $('[data-hl-next]', hl);
    const dots = cards.map((c, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', `Ir a la diapositiva ${i + 1}`);
      b.addEventListener('click', () => go(i));
      dotsBox.append(b);
      return b;
    });
    let current = 0;
    const go = (i) => {
      i = Math.max(0, Math.min(cards.length - 1, i));
      const pad = parseFloat(getComputedStyle(track).scrollPaddingLeft) || 0;
      track.scrollTo({ left: cards[i].offsetLeft - pad, behavior: reduce.matches ? 'auto' : 'smooth' });
    };
    const sync = () => {
      const pad = parseFloat(getComputedStyle(track).scrollPaddingLeft) || 0;
      const x = track.scrollLeft + pad;
      let best = 0;
      cards.forEach((c, i) => { if (Math.abs(c.offsetLeft - x) < Math.abs(cards[best].offsetLeft - x)) best = i; });
      // Al final del recorrido, el último
      if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 4) best = cards.length - 1;
      current = best;
      dots.forEach((d, i) => d.setAttribute('aria-current', String(i === best)));
      prev.disabled = best === 0;
      next.disabled = best === cards.length - 1;
    };
    prev.addEventListener('click', () => go(current - 1));
    next.addEventListener('click', () => go(current + 1));
    let raf = 0;
    track.addEventListener('scroll', () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(sync); }, { passive: true });
    window.addEventListener('resize', sync);
    sync();
  }

  // ---------------------------------------------------------------------------------------------
  // Comparador en móvil: dos columnas a la vez, elegidas con los selectores
  // ---------------------------------------------------------------------------------------------
  const cmp = $('[data-cmp]');
  if (cmp) {
    $$('tbody tr', cmp).forEach((tr) => { tr.dataset.label = tr.querySelector('th').textContent.trim(); });
    const sels = $$('[data-cmp-select]', cmp);
    const apply = () => {
      const show = sels.map((s) => s.value);
      $$('[data-col]', cmp).forEach((cell) => cell.classList.toggle('is-off', !show.includes(cell.dataset.col)));
      // Mismo orden que los selectores
      $$('tr', cmp).forEach((tr) => {
        show.forEach((col, k) => { const cell = tr.querySelector(`[data-col="${col}"]`); if (cell) cell.style.order = k; });
      });
    };
    sels.forEach((s, k) => s.addEventListener('change', () => {
      // Si eligen el mismo en los dos, el otro pasa al siguiente libre
      const other = sels[1 - k];
      if (other.value === s.value) other.value = String((Number(s.value) % 4) + 1);
      apply();
    }));
    apply();
  }

  // ---------------------------------------------------------------------------------------------
  // Ayúdame a elegir. REGLA PROVISIONAL (cámbiala cuando estén las fichas):
  //   formato N → Producto N; si no hay formato, el presupuesto (≤30 € → 1, ≤50 € → 3, más → 4);
  //   si tampoco, la frecuencia (a diario → 2, de vez en cuando → 1).
  // ---------------------------------------------------------------------------------------------
  const quiz = $('[data-quiz]');
  if (quiz) {
    const out = $('[data-quiz-result]', quiz);
    quiz.addEventListener('submit', (e) => {
      e.preventDefault();
      const f = new FormData(quiz);
      const fmt = f.get('fmt');
      const budget = f.get('budget');
      const use = f.get('use');
      let id = null;
      if (fmt) id = `p${fmt}`;
      else if (budget) id = budget === '30' ? 'p1' : budget === '50' ? 'p3' : 'p4';
      else if (use) id = use === 'daily' ? 'p2' : 'p1';
      out.hidden = false;
      if (!id) {
        out.className = 'quiz__result quiz__result--empty';
        out.innerHTML = '<p>Responde al menos una pregunta y te diremos cuál encaja mejor.</p>';
        return;
      }
      const p = CATALOG[id];
      out.className = 'quiz__result';
      out.innerHTML = `
        <img src="${p.img}" alt="">
        <p>Te recomendamos</p>
        <h4>${p.name} · ${eur.format(p.price)}</h4>
        <div class="quiz__result-actions">
          <button class="btn btn--buy btn--sm" type="button" data-add="${id}">Añadir al carrito</button>
          <a class="more" href="${p.url}">Ver la ficha</a>
        </div>`;
    });
  }

  // ---------------------------------------------------------------------------------------------
  // Guías: el botón + abre la respuesta rápida en la propia tarjeta
  // ---------------------------------------------------------------------------------------------
  $$('[data-answer-toggle]').forEach((btn) => {
    const panel = document.getElementById(btn.getAttribute('aria-controls'));
    btn.addEventListener('click', () => {
      const on = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(on));
      btn.querySelector('span').textContent = on ? 'Cerrar' : 'Respuesta rápida';
      panel.classList.toggle('is-open', on);
      if (on && !reduce.matches) panel.animate([{ opacity: 0, transform: 'translateY(-6px)' }, { opacity: 1, transform: 'none' }], { duration: 360, easing: 'cubic-bezier(0.28, 0.11, 0.32, 1)' });
    });
  });

  // ---------------------------------------------------------------------------------------------
  // Preguntas frecuentes: cada pregunta abre o cierra su respuesta (la primera empieza abierta)
  // ---------------------------------------------------------------------------------------------
  $$('.faq__q').forEach((btn) => {
    const panel = document.getElementById(btn.getAttribute('aria-controls'));
    panel.classList.toggle('is-open', btn.getAttribute('aria-expanded') === 'true');
    btn.addEventListener('click', () => {
      const on = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(on));
      panel.classList.toggle('is-open', on);
      if (on && !reduce.matches) panel.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, easing: 'ease-out' });
    });
  });

  // ---------------------------------------------------------------------------------------------
  // Pie: en móvil cada columna del directorio se pliega
  // ---------------------------------------------------------------------------------------------
  $$('[data-dir-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const on = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(on));
      btn.closest('[data-dir]').classList.toggle('is-open', on);
    });
  });

  // ---------------------------------------------------------------------------------------------
  // Apariciones al hacer scroll (en grupos, con un pequeño escalonado)
  // ---------------------------------------------------------------------------------------------
  const reveals = $$('.reveal');
  if (reduce.matches || !('IntersectionObserver' in window)) {
    reveals.forEach((el) => el.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      const shown = entries.filter((en) => en.isIntersecting);
      shown.forEach((en, i) => {
        en.target.style.transitionDelay = `${Math.min(i, 5) * 70}ms`;
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach((el) => io.observe(el));
  }
})();
