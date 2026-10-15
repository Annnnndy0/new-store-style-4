/* Brand · Style 4 · comportamiento de las subpáginas (prototipo, sin servidor).

   - Ficha de producto: galería, selector de cantidad y barra de compra fija en el móvil.
   - Carrito, checkout, pedido confirmado y "Consultar mi pedido". El carrito lo lleva interfaz.js
     (window.BrandCart, localStorage "lab-cart"); los pedidos se guardan en "lab-orders", las mismas
     claves que lab-lab. De cada pedido solo se guardan el email (para consultarlo), el nombre, la
     ciudad, el país y los productos; nunca el teléfono ni la dirección.
   - Formulario de contacto (solo muestra un mensaje), filtros por tema, buscador de preguntas y
     buscador de estudios (?q=). */
(() => {
  'use strict';

  const Cart = window.BrandCart;
  const CAT = window.CATALOG;
  if (!Cart || !CAT) return;

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const ROOT = Cart.root;
  const P = CAT.products;
  const ORDERS = 'lab-orders';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fmt = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });
  const money = (cents) => fmt.format(cents / 100);
  const cents = (n) => Math.round(n * 100);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
  const longDate = (iso) => new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

  const load = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
  const save = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* modo privado */ } };

  function totals(lines) {
    const sub = lines.reduce((s, l) => s + cents(P[l.id].price) * l.qty, 0);
    const free = sub >= cents(CAT.shipping.freeFrom);
    const ship = sub === 0 || free ? 0 : cents(CAT.shipping.cost);
    return { sub, ship, total: sub + ship, free, left: Math.max(0, cents(CAT.shipping.freeFrom) - sub) };
  }

  function fillTotals(box, t) {
    if (!box) return;
    $$('[data-t-sub]', box).forEach((el) => { el.textContent = money(t.sub); });
    $$('[data-t-ship]', box).forEach((el) => { el.textContent = t.ship ? money(t.ship) : 'Gratis'; });
    $$('[data-t-total]', box).forEach((el) => { el.textContent = money(t.total); });
    $$('[data-meter]', box).forEach((m) => {
      $('[data-meter-text]', m).innerHTML = t.free
        ? '<b>Tu envío es gratis.</b>'
        : `Te faltan <b>${money(t.left)}</b> para el envío gratis.`;
      $('[data-meter-bar]', m).style.width = `${Math.min(100, (t.sub / cents(CAT.shipping.freeFrom)) * 100)}%`;
    });
  }

  /* ---------- Ficha de producto ---------- */

  const buy = $('[data-buy]');
  if (buy) {
    const out = $('[data-qty]', buy);
    const minus = $('[data-step="-1"]', buy);
    const plus = $('[data-step="1"]', buy);
    const set = (n) => {
      const q = Math.max(1, Math.min(Cart.max, n));
      out.textContent = String(q);
      minus.disabled = q <= 1;
      plus.disabled = q >= Cart.max;
    };
    buy.addEventListener('click', (e) => {
      const step = e.target.closest('[data-step]');
      if (step) set(Number(out.textContent) + Number(step.dataset.step));
    });

    // Barra de compra fija en el móvil: aparece cuando la caja de compra sale de la pantalla
    const bar = $('[data-buybar]');
    if (bar && 'IntersectionObserver' in window) {
      new IntersectionObserver(([en]) => {
        bar.hidden = en.isIntersecting || en.boundingClientRect.top > 0;
      }).observe($('.buy__row', buy));
    }
  }

  const gallery = $('[data-gallery]');
  if (gallery) {
    const img = $('[data-gallery-img]', gallery);
    const empty = $('[data-gallery-empty]', gallery);
    const emptyText = $('[data-gallery-empty-text]', gallery);
    const thumbs = $$('.gallery__thumb', gallery);
    gallery.addEventListener('click', (e) => {
      const t = e.target.closest('.gallery__thumb');
      if (!t) return;
      thumbs.forEach((x) => x.setAttribute('aria-pressed', String(x === t)));
      if (t.dataset.empty) {
        img.hidden = true;
        empty.hidden = false;
        emptyText.textContent = t.dataset.empty;
        return;
      }
      empty.hidden = true;
      img.hidden = false;
      img.src = t.dataset.src;
      img.alt = t.dataset.alt;
      img.classList.toggle('is-cover', t.dataset.fit === 'cover');
      if (!reduce) img.animate([{ opacity: 0, transform: 'scale(.98)' }, { opacity: 1, transform: 'none' }], { duration: 420, easing: 'cubic-bezier(.28,.11,.32,1)' });
    });
  }

  /* ---------- Carrito ---------- */

  const cartWrap = $('[data-cart]');
  if (cartWrap) {
    const list = $('[data-cart-items]', cartWrap);
    const sum = $('[data-cart-summary]', cartWrap);
    const empty = $('[data-cart-empty]', cartWrap);
    const title = $('[data-cart-title]', cartWrap);
    const sub = $('[data-cart-sub]', cartWrap);
    const goTop = $('[data-cart-go]', cartWrap);

    const row = (l) => {
      const p = P[l.id];
      const opts = Array.from({ length: Cart.max }, (_, i) => `<option value="${i + 1}"${i + 1 === l.qty ? ' selected' : ''}>${i + 1}</option>`).join('');
      return `
        <li class="bline" data-id="${l.id}">
          <a class="bline__pic" href="${ROOT}${p.url}" tabindex="-1" aria-hidden="true"><img src="${ROOT}${p.img}" alt=""></a>
          <div class="bline__info">
            <h2 class="bline__name"><a href="${ROOT}${p.url}">${esc(p.name)}</a></h2>
            <p class="bline__meta">${money(cents(p.price))} / unidad · Pagas al recibirlo</p>
          </div>
          <label class="select bline__qty"><span class="sr-only">Cantidad de ${esc(p.name)}</span>
            <select data-qty-select>${opts}</select><i class="ph ph-caret-down" aria-hidden="true"></i></label>
          <div class="bline__end">
            <p class="bline__price">${money(cents(p.price) * l.qty)}</p>
            <button class="bline__del" type="button" data-del>Eliminar<span class="sr-only"> ${esc(p.name)}</span></button>
          </div>
        </li>`;
    };

    const render = (lines) => {
      const has = lines.length > 0;
      const t = totals(lines);
      list.innerHTML = lines.map(row).join('');
      list.hidden = !has;
      sum.hidden = !has;
      empty.hidden = has;
      goTop.hidden = !has;
      title.textContent = has ? `Tu carrito suma ${money(t.total)}.` : 'Tu carrito está vacío.';
      sub.textContent = has
        ? `${plural(lines.reduce((n, l) => n + l.qty, 0), 'producto', 'productos')} · ${t.free ? 'Envío gratis' : `Envío gratis a partir de ${money(cents(CAT.shipping.freeFrom))}`} · Hoy no pagas nada.`
        : 'Elige una fórmula y la recibes en 3–7 días laborables.';
      fillTotals(sum, t);
    };
    Cart.onChange(render);

    cartWrap.addEventListener('change', (e) => {
      const sel = e.target.closest('[data-qty-select]');
      if (!sel) return;
      const id = sel.closest('.bline').dataset.id;
      Cart.write(Cart.read().map((l) => (l.id === id ? { ...l, qty: Number(sel.value) } : l)));
      cartWrap.querySelector(`.bline[data-id="${id}"] [data-qty-select]`)?.focus();
    });
    cartWrap.addEventListener('click', (e) => {
      const del = e.target.closest('[data-del]');
      if (!del) return;
      const li = del.closest('.bline');
      const go = () => Cart.write(Cart.read().filter((l) => l.id !== li.dataset.id));
      if (reduce) go();
      else li.animate([{ opacity: 1 }, { opacity: 0, transform: 'translateX(-12px)' }], { duration: 260, easing: 'ease-in' }).finished.then(go);
    });
  }

  /* ---------- Validación de formularios ---------- */

  const MSG = {
    required: 'Este campo es obligatorio.',
    email: 'Escribe un email válido, como nombre@dominio.com.',
    phone: 'Escribe un teléfono válido, con el prefijo si es de otro país.',
  };
  const fieldError = (el) => {
    const v = el.value.trim();
    if (el.required && !v) return MSG.required;
    if (v && el.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return MSG.email;
    if (v && el.type === 'tel' && !/^\+?[\d\s().-]{6,20}$/.test(v)) return MSG.phone;
    return '';
  };
  const showError = (el, msg) => {
    el.setAttribute('aria-invalid', msg ? 'true' : 'false');
    el.closest('.field')?.classList.toggle('is-bad', !!msg);
    const err = el.id && document.getElementById(`${el.id}-err`);
    if (err) { err.textContent = msg; err.hidden = !msg; }
  };
  function validate(form) {
    let first = null;
    $$('input:not([type=checkbox]):not([type=radio]), textarea', form).forEach((el) => {
      const msg = fieldError(el);
      showError(el, msg);
      if (msg && !first) first = el;
    });
    const boxes = $$('input[type=checkbox][required]', form);
    const missing = boxes.filter((b) => !b.checked);
    const err = $('[data-checks-err]', form);
    if (err) err.hidden = missing.length === 0;
    if (!first && missing.length) first = missing[0];
    return first;
  }
  const liveValidation = (form) => {
    form.addEventListener('focusout', (e) => {
      const el = e.target;
      if (el.matches('input:not([type=checkbox]):not([type=radio]), textarea') && el.value) showError(el, fieldError(el));
    });
    form.addEventListener('input', (e) => {
      if (e.target.getAttribute('aria-invalid') === 'true') showError(e.target, fieldError(e.target));
    });
  };

  /* ---------- Checkout ---------- */

  const coForm = $('[data-checkout]');
  if (coForm) {
    const wrap = $('[data-checkout-wrap]');
    const emptyBox = $('[data-checkout-empty]');
    const sumBox = $('[data-co-sum]');
    const items = $('[data-sum-items]');
    const head = $('[data-sum-total-head]');
    const toggle = $('[data-sum-toggle]');
    const body = $('[data-sum-body]');
    const msg = $('[data-co-msg]', coForm);
    const country = $('[data-country]', coForm);
    const customs = $('[data-customs-note]', coForm);
    const pickup = $('[data-pickup-note]', coForm);
    const mobile = window.matchMedia('(max-width: 1068px)');

    Cart.onChange((lines) => {
      const has = lines.length > 0;
      wrap.hidden = !has;
      emptyBox.hidden = has;
      const t = totals(lines);
      items.innerHTML = lines.map((l) => `
        <li><img src="${ROOT}${P[l.id].img}" alt=""><span><b>${esc(P[l.id].name)}</b><small>Cantidad: ${l.qty}</small></span><span>${money(cents(P[l.id].price) * l.qty)}</span></li>`).join('');
      head.textContent = `· ${money(t.total)}`;
      fillTotals(sumBox, t);
    });

    // En móvil el resumen empieza plegado (una línea con el total)
    const setSum = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.firstChild.textContent = open ? 'Ocultar detalle' : 'Ver detalle';
      body.hidden = !open;
    };
    toggle.addEventListener('click', () => setSum(toggle.getAttribute('aria-expanded') !== 'true'));
    const syncSum = () => setSum(!mobile.matches);
    mobile.addEventListener('change', syncSum);
    syncSum();

    const syncCountry = () => { customs.hidden = !CAT.outsideEU.includes(country.value); };
    syncCountry();
    coForm.addEventListener('change', (e) => {
      if (e.target.name === 'delivery') pickup.hidden = e.target.value === 'home';
      if (e.target === country) syncCountry();
    });
    liveValidation(coForm);

    coForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const lines = Cart.read();
      if (!lines.length) return;
      const bad = validate(coForm);
      if (bad) {
        msg.textContent = 'Revisa los campos marcados en rojo.';
        bad.focus();
        return;
      }
      msg.textContent = '';
      const data = new FormData(coForm);
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      const bytes = crypto.getRandomValues(new Uint8Array(6));
      const order = {
        id: `BR-${[...bytes].map((b) => chars[b % chars.length]).join('')}`,
        date: new Date().toISOString(),
        items: lines.map((l) => ({ ...l })),
        totals: totals(lines),
        email: String(data.get('email')).trim().toLowerCase(),
        name: String(data.get('name')).trim(),
        city: String(data.get('city')).trim(),
        country: String(data.get('country')),
        delivery: String(data.get('delivery')),
      };
      save(ORDERS, [order, ...load(ORDERS, [])].slice(0, 20));
      Cart.write([]);
      location.href = `${ROOT}pedido-confirmado/`;
    });
  }

  /* ---------- Resumen de un pedido ---------- */

  const STATUS = ['Recibido', 'Verificado', 'Enviado', 'Entregado y pagado'];
  const orderSummary = (o, withStatus = false) => `
    ${withStatus ? `
    <div class="ostatus">
      <p class="ostatus__h">Estado del pedido</p>
      <ol class="ostatus__steps">${STATUS.map((s, i) => `<li class="${i === 0 ? 'is-now' : ''}">${s}</li>`).join('')}</ol>
      <p class="ostatus__note"><span class="draft">Aquí el estado real que devuelva el sistema de pedidos.</span></p>
    </div>` : ''}
    <dl class="kv">
      <div><dt>Pedido</dt><dd>${esc(o.id)}</dd></div>
      <div><dt>Fecha</dt><dd>${longDate(o.date)}</dd></div>
      <div><dt>A nombre de</dt><dd>${esc(o.name)}</dd></div>
      <div><dt>Entrega en</dt><dd>${esc(o.city)}, ${esc(CAT.countries[o.country] || o.country)}</dd></div>
    </dl>
    <ul class="slines">${o.items.filter((l) => P[l.id]).map((l) => `
      <li><img src="${ROOT}${P[l.id].img}" alt=""><span><b>${esc(P[l.id].name)}</b><small>Cantidad: ${l.qty}</small></span><span>${money(cents(P[l.id].price) * l.qty)}</span></li>`).join('')}
    </ul>
    <dl class="totals">
      <div><dt>Subtotal</dt><dd>${money(o.totals.sub)}</dd></div>
      <div><dt>Envío</dt><dd>${o.totals.ship ? money(o.totals.ship) : 'Gratis'}</dd></div>
      <div class="totals__sum"><dt>A pagar al recibirlo</dt><dd>${money(o.totals.total)}</dd></div>
    </dl>`;

  /* ---------- Pedido confirmado ---------- */

  const okBox = $('[data-confirmed]');
  if (okBox) {
    const o = load(ORDERS, [])[0];
    if (!o || !Array.isArray(o.items)) {
      okBox.hidden = true;
      $('[data-no-order]').hidden = false;
    } else {
      $('[data-order-line]').hidden = false;
      $('[data-order-id]').textContent = o.id;
      const box = $('[data-order-summary]');
      box.innerHTML = orderSummary(o);
      box.hidden = false;
    }
  }

  /* ---------- Consultar mi pedido ---------- */

  const track = $('[data-track]');
  if (track) {
    const result = $('[data-track-result]');
    const listBox = $('[data-orders]');
    const none = $('[data-orders-empty]');
    const orders = load(ORDERS, []).filter((o) => o && o.id && Array.isArray(o.items));
    listBox.innerHTML = orders.map((o) => `
      <li><button type="button" data-pick="${esc(o.id)}" data-email="${esc(o.email)}"><b>${esc(o.id)}</b><span>${longDate(o.date)} · ${money(o.totals.total)}</span><i class="ph ph-caret-right" aria-hidden="true"></i></button></li>`).join('');
    none.hidden = orders.length > 0;
    listBox.addEventListener('click', (e) => {
      const b = e.target.closest('[data-pick]');
      if (!b) return;
      track.elements.id.value = b.dataset.pick;
      track.elements.email.value = b.dataset.email;
      track.requestSubmit();
    });
    liveValidation(track);
    track.addEventListener('submit', (e) => {
      e.preventDefault();
      const bad = validate(track);
      if (bad) { bad.focus(); return; }
      const id = track.elements.id.value.trim().toUpperCase();
      const email = track.elements.email.value.trim().toLowerCase();
      const o = orders.find((x) => x.id === id && x.email === email);
      result.innerHTML = o
        ? `<div class="osum reveal is-in">${orderSummary(o, true)}</div>`
        : `<div class="empty empty--inline"><i class="ph-light ph-magnifying-glass" aria-hidden="true"></i><p class="empty__text">No encontramos ese pedido. Revisa el número (empieza por BR-) y el email con el que lo hiciste, o <a href="${ROOT}contacto/">escríbenos</a>.</p></div>`;
      result.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest' });
    });
  }

  /* ---------- Contacto ---------- */

  const contact = $('[data-contact]');
  if (contact) {
    const msg = $('[data-contact-msg]', contact);
    liveValidation(contact);
    contact.addEventListener('submit', (e) => {
      e.preventDefault();
      const bad = validate(contact);
      if (bad) { msg.textContent = 'Revisa los campos marcados en rojo.'; bad.focus(); return; }
      msg.innerHTML = '<b>Gracias, hemos recibido tu mensaje.</b> <span class="draft">Prototipo: aquí se enviará a la tienda. Todavía no se envía nada.</span>';
      contact.reset();
    });
  }

  /* ---------- Filtros por tema (guías y estudios) ---------- */

  $$('[data-filter]').forEach((group) => {
    const list = group.parentElement.querySelector('[data-filter-list]');
    if (!list) return;
    group.addEventListener('click', (e) => {
      const b = e.target.closest('.chip');
      if (!b) return;
      $$('.chip', group).forEach((x) => { x.classList.toggle('is-on', x === b); x.setAttribute('aria-pressed', String(x === b)); });
      const v = b.dataset.value;
      [...list.children].forEach((card) => { card.hidden = !!v && card.dataset.tag !== v; });
    });
  });

  /* ---------- Buscador de preguntas ---------- */

  const faqSearch = $('[data-faq-search]');
  if (faqSearch) {
    const items = $$('.faq__item[data-search]');
    const groups = $$('[data-faq-group]');
    const count = $('[data-faq-count]');
    const none = $('[data-faq-none]');
    const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    faqSearch.addEventListener('input', () => {
      const words = norm(faqSearch.value.trim()).split(/\s+/).filter(Boolean);
      let shown = 0;
      items.forEach((it) => {
        const ok = words.every((w) => norm(it.dataset.search).includes(w));
        it.hidden = !ok;
        if (ok) shown += 1;
      });
      groups.forEach((g) => { g.hidden = !$$('.faq__item', g).some((it) => !it.hidden); });
      none.hidden = shown > 0;
      count.textContent = words.length ? plural(shown, 'resultado', 'resultados') : '';
    });
  }

  /* ---------- Buscador de estudios (?q= desde el index) ---------- */

  const evid = $('[data-evid-search]');
  if (evid) {
    const input = evid.elements.q;
    const cards = $$('.paper');
    const count = $('[data-evid-count]');
    const none = $('[data-evid-none]');
    const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    const run = () => {
      const words = norm(input.value.trim()).split(/\s+/).filter(Boolean);
      let shown = 0;
      cards.forEach((c) => {
        const ok = words.every((w) => norm(c.textContent).includes(w));
        c.hidden = !ok;
        if (ok) shown += 1;
      });
      none.hidden = shown > 0;
      count.textContent = words.length ? `${plural(shown, 'estudio', 'estudios')} para «${input.value.trim()}»` : '';
    };
    const q = new URLSearchParams(location.search).get('q');
    if (q) { input.value = q; run(); }
    evid.addEventListener('submit', (e) => {
      e.preventDefault();
      run();
      $('#catalogo').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    });
    input.addEventListener('input', run);
  }
})();
