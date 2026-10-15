// Páginas de la tienda en el estilo de Style 4 (apple.com): catálogo, ficha de producto, carrito,
// checkout, confirmación y consulta del pedido. El carrito y los pedidos son un prototipo: se
// guardan en este navegador ("lab-cart" y "lab-orders", las mismas claves que lab-lab).
import { PRODUCTS, GUIDES, STUDIES, FAQ_GROUPS, COUNTRIES, SHIPPING, d } from './data.mjs';
import {
  money, esc, hero, sechead, productCard, guideCard, paperCard, accordion, tiles, kv, note, more, btn, PLEDGES,
} from './layout.mjs';

const findQ = (q) => FAQ_GROUPS.flatMap((g) => g.items).find((it) => it.q === q);
const shopTrail = (extra = []) => [{ label: 'Tienda', path: 'productos/' }, ...extra];

/* ---------- Comparador (la misma tabla que el index) ---------- */

export function compareTable(r) {
  const rows = [
    ['Formato', (p) => d(`Aquí el formato ${p.n}`)],
    ['Concentración', () => d('Aquí el dato')],
    ['Contenido', () => d('Aquí el contenido')],
    ['Uso según la ficha', () => d('Aquí el uso oficial')],
    ['Duración del envase', () => d('Aquí los días')],
    ['Precio', (p) => `<b>${money(p.price)}</b><small>IVA incluido</small>`],
    ['Pago', () => 'Al recibirlo'],
  ];
  const opts = (sel) => PRODUCTS.map((p) => `<option value="${p.n}"${p.n === sel ? ' selected' : ''}>${p.name}</option>`).join('');
  return `
        <div class="cmp reveal" data-cmp>
          <div class="cmp__pick" aria-label="Elige qué dos productos comparar">
            <label class="select"><span class="sr-only">Primer producto</span><select data-cmp-select="0">${opts(1)}</select><i class="ph ph-caret-down" aria-hidden="true"></i></label>
            <label class="select"><span class="sr-only">Segundo producto</span><select data-cmp-select="1">${opts(2)}</select><i class="ph ph-caret-down" aria-hidden="true"></i></label>
          </div>
          <div class="cmp__scroll">
            <table class="cmp__table">
              <caption class="sr-only">Comparación de los 4 productos</caption>
              <thead>
                <tr>
                  <td class="cmp__corner"></td>${PRODUCTS.map((p) => `
                  <th scope="col" data-col="${p.n}">
                    <img src="${r(p.img)}" width="420" height="775" alt="" loading="lazy" decoding="async" style="--tilt: ${p.tilt}deg">
                    <a class="cmp__name" href="${r(`productos/${p.slug}/`)}">${p.name}</a>
                    <span class="cmp__price">${money(p.price)}</span>
                    <button class="btn btn--buy btn--sm" type="button" data-add="${p.id}" aria-label="Añadir ${p.name} al carrito">Añadir</button>
                  </th>`).join('')}
                </tr>
              </thead>
              <tbody>${rows.map(([label, cell]) => `
                <tr>
                  <th scope="row">${label}</th>${PRODUCTS.map((p) => `
                  <td data-col="${p.n}">${cell(p)}</td>`).join('')}
                </tr>`).join('')}
              </tbody>
            </table>
          </div>
        </div>`;
}

const pledgeCards = (r) => `
          <ul class="pcards">${PLEDGES.map(([icon, t, s, href]) => `
            <li class="pcard reveal">
              <i class="ph-light ${icon}" aria-hidden="true"></i>
              <h3 class="pcard__title">${t}</h3>
              <p class="pcard__text">${s}</p>
              ${more(r(href), 'Más información')}
            </li>`).join('')}
          </ul>`;

/* ---------- Catálogo ---------- */

function productsHub() {
  return {
    path: 'productos/',
    title: 'Tienda: las 4 fórmulas',
    desc: `Compra las 4 fórmulas de [producto] con su precio con IVA incluido. Compáralas lado a lado, pagas al recibir el pedido y el envío es gratis a partir de ${SHIPPING.freeFrom} €.`,
    trail: [{ label: 'Tienda' }],
    ld: {
      '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Tienda', inLanguage: 'es',
      mainEntity: { '@type': 'ItemList', itemListElement: PRODUCTS.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: `https://example.com/productos/${p.slug}/`, name: p.name })) },
    },
    lnav: (r) => ({ title: 'Tienda', links: [['#formulas', 'Productos'], ['#comparar', 'Comparar'], ['#diferencia', 'Por qué aquí'], ['#ayuda', 'Ayuda']], cta: { href: '#formulas', label: 'Comprar' } }),
    main: (r) => `
    <section class="shead" aria-labelledby="page-title">
      <div class="wrap wrap--wide shead__in">
        <h1 class="shead__title" id="page-title">Tienda. <span class="soft">La forma más sencilla de comprar tu fórmula: pagas al recibirla.</span></h1>
        <div class="shead__help">
          <p><i class="ph-light ph-chat-circle-text" aria-hidden="true"></i><span>¿Necesitas ayuda para elegir?<br>${more(r('#elegir'), 'Ayúdame a elegir')}</span></p>
          <p><i class="ph-light ph-package" aria-hidden="true"></i><span>¿Ya hiciste un pedido?<br>${more(r('cuenta/'), 'Consultar mi pedido')}</span></p>
        </div>
      </div>
    </section>

    <section class="sec sec--mist sec--tight" id="formulas" aria-labelledby="formulas-title">
      <div class="wrap wrap--wide">
        ${sechead({ title: 'Las 4 fórmulas. <span class="soft">Elige la tuya.</span>', id: 'formulas-title', lede: d('Aquí una línea que presente la gama y en qué se diferencian los cuatro productos.') })}
        <ul class="products">${PRODUCTS.map((p) => productCard(r, p, 'h3')).join('')}</ul>
        ${note()}
      </div>
    </section>

    <section class="sec" id="comparar" aria-labelledby="comparar-title">
      <div class="wrap wrap--wide">
        ${sechead({ kicker: 'Comparar', title: '¿Cuál es la tuya?', id: 'comparar-title', lede: 'Formato, contenido, uso según la ficha, duración del envase y precio, uno al lado del otro.', center: true })}
        ${compareTable(r)}
        <p class="center reveal">¿Aún dudas? ${more(r('#elegir'), 'Ayúdame a elegir')}</p>
      </div>
    </section>

    <section class="sec sec--mist" id="diferencia" aria-labelledby="dif-title">
      <div class="wrap wrap--wide">
        ${sechead({ title: `La diferencia de comprar en Brand. <span class="soft">Sin pagar nada por adelantado.</span>`, id: 'dif-title' })}
        ${pledgeCards(r)}
      </div>
    </section>

    <section class="sec" id="ayuda" aria-labelledby="ayuda-title">
      <div class="wrap">
        ${sechead({ title: '¿Necesitas ayuda?', id: 'ayuda-title', center: true })}
        ${tiles([
          { href: r('#elegir'), icon: 'ph-sparkle', title: 'Ayúdame a elegir', text: 'Tres preguntas prácticas, nunca sobre síntomas.', label: 'Empezar' },
          { href: r('#pedido'), icon: 'ph-path', title: 'Cómo funciona tu pedido', text: 'Cuatro pasos y pagas al recibirlo.', label: 'Ver los pasos' },
          { href: r('preguntas-frecuentes/'), icon: 'ph-chats-circle', title: 'Preguntas frecuentes', text: 'Pago, envío, devoluciones y uso.', label: 'Ver respuestas' },
        ])}
      </div>
    </section>`,
  };
}

/* ---------- Ficha de producto (la misma plantilla para los 4) ---------- */

function productPage(p) {
  const others = PRODUCTS.filter((x) => x.id !== p.id);
  const guides = [(p.n - 1) % 6, (p.n + 1) % 6, (p.n + 3) % 6].map((i) => GUIDES[i]);
  const studies = [p.n - 1, p.n % 5];
  const faq = ['¿Cuándo pago mi pedido?', '¿Cuánto tarda la entrega?', '¿Necesito receta?', '¿Puedo tomarlo con otros medicamentos?'].map(findQ);
  // Galería: la foto del envase y fotos de apoyo; los huecos vacíos son las fotos que faltan.
  // IMAGEN · producto-N-etiqueta / -prospecto: ver PROMPTS-IMAGENES.md
  const shots = [
    { cap: 'Envase', src: p.img, w: 420, h: 775, fit: 'contain', alt: `Envase de ${p.name}` },
    { cap: 'En la mano', src: 'assets/hero-mano-800.webp', w: 800, h: 400, fit: 'cover', alt: `${p.name} en la mano` },
    { cap: 'Contenido', src: 'assets/comprimidos-700.webp', w: 700, h: 470, fit: 'cover', alt: 'Comprimidos fuera del blíster' },
    { cap: 'Prospecto', empty: 'Aquí la foto del prospecto', icon: 'ph-file-text' },
  ];
  const specRow = (id, title, body) => `
          <section class="spec reveal" id="${id}" aria-labelledby="h-${id}">
            <h2 class="spec__title" id="h-${id}">${title}</h2>
            <div class="spec__body">${body}</div>
          </section>`;

  return {
    path: `productos/${p.slug}/`,
    title: `${p.name}: precio, composición y modo de uso`,
    desc: `${p.name}: ${money(p.price).replace('&nbsp;', ' ')} con IVA incluido. Composición, modo de uso, advertencias y ficha técnica. Pagas al recibir el pedido y el envío es gratis a partir de ${SHIPPING.freeFrom} €.`,
    trail: shopTrail([{ label: p.name }]),
    bodyClass: 'is-pdp',
    preload: p.img,
    ogImage: 'assets/og-imagen.jpg',
    ld: {
      '@context': 'https://schema.org', '@type': 'Product', name: p.name, sku: p.id, description: p.copy,
      image: `https://example.com/${p.img}`, brand: { '@type': 'Brand', name: 'Brand' },
      offers: { '@type': 'Offer', url: `https://example.com/productos/${p.slug}/`, price: p.price.toFixed(2), priceCurrency: 'EUR', availability: 'https://schema.org/InStock' },
    },
    lnav: () => ({
      title: p.name,
      links: [['#descripcion', 'Descripción'], ['#composicion', 'Composición'], ['#uso', 'Modo de uso'], ['#advertencias', 'Advertencias'], ['#ficha', 'Ficha técnica'], ['#preguntas', 'Preguntas']],
      cta: { add: p.id, label: 'Añadir al carrito' },
    }),
    main: (r) => `
    <section class="buy" aria-labelledby="pdp-title">
      <div class="wrap wrap--wide buy__grid">
        <div class="gallery" data-gallery>
          <figure class="gallery__stage">
            <img class="gallery__img" data-gallery-img src="${r(p.img)}" width="420" height="775" alt="Envase de ${p.name}" fetchpriority="high" style="--tilt: ${p.tilt}deg">
            <div class="gallery__empty" data-gallery-empty hidden><i class="ph-light ph-image" aria-hidden="true"></i><span class="draft" data-gallery-empty-text></span></div>
          </figure>
          <ul class="gallery__thumbs" aria-label="Fotos del producto">${shots.map((s, i) => `
            <li><button class="gallery__thumb${s.empty ? ' gallery__thumb--empty' : ''}" type="button" aria-pressed="${i === 0}" aria-label="Foto: ${s.cap.toLowerCase()}"
              ${s.empty ? `data-empty="${esc(s.empty)}"` : `data-src="${r(s.src)}" data-alt="${esc(s.alt)}" data-fit="${s.fit}"`}>
              ${s.empty ? `<i class="ph-light ${s.icon}" aria-hidden="true"></i>` : `<img src="${r(s.src)}" width="${s.w}" height="${s.h}" alt="" loading="lazy" decoding="async"${s.fit === 'contain' ? ` class="is-contain" style="--tilt: ${p.tilt}deg"` : ''}>`}
              <span>${s.cap}</span>
            </button></li>`).join('')}
          </ul>
        </div>

        <div class="buy__panel" data-buy data-id="${p.id}">
          <p class="buy__n">Fórmula ${p.n} · ${d(`Aquí el formato ${p.n} · contenido`)}</p>
          <h1 class="buy__title" id="pdp-title">${p.name}</h1>
          <p class="buy__lede">${p.copy}</p>
          <p class="buy__price"><b>${money(p.price)}</b> <span>IVA incluido · ${d('Aquí los días que dura un envase')}</span></p>

          <div class="buy__row">
            <div class="qty" role="group" aria-label="Cantidad">
              <button type="button" data-step="-1" aria-label="Quitar una unidad" disabled><i class="ph ph-minus" aria-hidden="true"></i></button>
              <output data-qty aria-live="polite">1</output>
              <button type="button" data-step="1" aria-label="Añadir una unidad"><i class="ph ph-plus" aria-hidden="true"></i></button>
            </div>
            <button class="btn btn--buy buy__add" type="button" data-add="${p.id}">Añadir al carrito</button>
          </div>
          <button class="btn btn--ghost buy__now" type="button" data-add="${p.id}" data-then="checkout">Comprar ahora · pagas al recibirlo</button>

          <ul class="perks">
            <li><i class="ph-light ph-truck" aria-hidden="true"></i><p><b>Entrega en ${SHIPPING.days}</b><span>Con seguimiento. Gratis a partir de ${money(SHIPPING.freeFrom)}. ${more(r('envios/'), 'Envíos y plazos')}</span></p></li>
            <li><i class="ph-light ph-hand-coins" aria-hidden="true"></i><p><b>Pagas al recibirlo</b><span>No pagas nada hasta que llega a tu puerta.</span></p></li>
            <li><i class="ph-light ph-package" aria-hidden="true"></i><p><b>Envío discreto</b><span>Cartón neutro, sin marcas ni alusiones al contenido.</span></p></li>
            <li><i class="ph-light ph-arrow-u-up-left" aria-hidden="true"></i><p><b>14 días para desistir</b><span>${more(r('devoluciones/'), 'Cómo devolver un pedido')}</span></p></li>
          </ul>
          ${note()}
        </div>
      </div>
    </section>

    <section class="sec sec--mist sec--tight" aria-labelledby="esencial-title">
      <div class="wrap">
        <h2 class="sr-only" id="esencial-title">Lo esencial de ${p.name}</h2>
        <ul class="stats stats--center reveal">
          <li><span class="stats__pre">Formato</span><b class="stats__num stats__num--md">${d(`Formato ${p.n}`)}</b><span class="stats__post">${d('Aquí cómo se presenta')}</span></li>
          <li><span class="stats__pre">Contenido</span><b class="stats__num stats__num--md">${d('XX uds.')}</b><span class="stats__post">${d('Aquí el contenido por envase')}</span></li>
          <li><span class="stats__pre">Un envase dura</span><b class="stats__num stats__num--md">${d('XX días')}</b><span class="stats__post">${d('Aquí según la pauta habitual')}</span></li>
        </ul>
      </div>
    </section>

    <div class="sec">
      <div class="wrap specs">
        ${specRow('descripcion', 'Descripción', `
              <p>${d('Aquí la descripción completa y factual: qué es, cómo se presenta y en qué se diferencia de los otros tres productos.')}</p>
              <p>${d('Aquí un segundo párrafo si hace falta, sin promesas de curación ni resultados garantizados.')}</p>`)}
        ${specRow('composicion', 'Composición', `
              <p class="spec__lede">Tal como figura en la ficha oficial del producto.</p>
              <div class="table-wrap">
                <table class="table">
                  <caption class="sr-only">Composición de ${p.name}</caption>
                  <thead><tr><th scope="col">Componente</th><th scope="col">Por unidad</th><th scope="col">Función</th></tr></thead>
                  <tbody>
                    <tr><th scope="row">${d('Aquí el principio activo')}</th><td>${d('XX mg')}</td><td>${d('Principio activo')}</td></tr>
                    <tr><th scope="row">${d('Aquí el componente 2')}</th><td>${d('XX mg')}</td><td>${d('Aquí su función')}</td></tr>
                    <tr><th scope="row">${d('Aquí el componente 3')}</th><td>${d('XX mg')}</td><td>${d('Aquí su función')}</td></tr>
                  </tbody>
                </table>
              </div>
              ${kv([['Excipientes', d('Aquí la lista de excipientes')], ['Alérgenos', d('Aquí los alérgenos o «no contiene»')]])}`)}
        ${specRow('uso', 'Modo de uso', `
              <p>${d('Aquí el modo de uso según el prospecto, en una frase.')}</p>
              <ol class="nlist">
                <li>${d('Aquí el primer paso: cuánto se toma.')}</li>
                <li>${d('Aquí el segundo paso: cuándo y cómo (con o sin comida).')}</li>
                <li>${d('Aquí el tercer paso: durante cuánto tiempo y qué hacer si se olvida una toma.')}</li>
              </ol>
              ${more(r('guias/como-se-toma/'), 'Guía: cómo se toma y en qué dosis')}`)}
        ${specRow('advertencias', 'Advertencias', `
              <ul class="warn">
                <li>${d('Aquí la primera contraindicación de la ficha oficial.')}</li>
                <li>${d('Aquí la advertencia sobre embarazo, lactancia y menores.')}</li>
                <li>${d('Aquí las interacciones con otros medicamentos.')}</li>
              </ul>
              ${note('Si tienes síntomas o dudas médicas, consulta a un profesional sanitario antes de usarlo.')}
              <p class="links">${more(r('guias/quien-no-deberia-usarlo/'), 'Quién no debería usarlo')} ${more(r('guias/efectos-secundarios/'), 'Efectos secundarios e interacciones')}</p>`)}
        ${specRow('conservacion', 'Conservación', kv([
          ['Temperatura', d('Aquí la temperatura de conservación')],
          ['Una vez abierto', d('Aquí cuánto dura abierto y cómo guardarlo')],
          ['Caducidad', d('Aquí dónde se lee la fecha de caducidad en el envase')],
        ]))}
        ${specRow('ficha', 'Ficha técnica', `${kv([
          ['Formato', d(`Aquí el formato ${p.n}`)],
          ['Contenido', d('Aquí el contenido')],
          ['Principio activo', d('Aquí el principio activo')],
          ['Uso según la ficha', d('Aquí el uso oficial')],
          ['Duración del envase', d('Aquí los días')],
          ['Clasificación en la UE', d('Aquí: medicamento, complemento o producto sanitario')],
          ['Nº de registro', d('Aquí el número de registro')],
          ['Titular y fabricante', d('Aquí el titular y el fabricante')],
          ['Lote y análisis', d('Aquí dónde consultar el análisis de cada lote')],
        ])}
              <p class="spec__file"><i class="ph-light ph-file-pdf" aria-hidden="true"></i>${d('Aquí el prospecto en PDF')}</p>`)}
      </div>
    </div>

    <section class="sec sec--mist" id="estudios" aria-labelledby="h-estudios">
      <div class="wrap wrap--wide">
        ${sechead({ title: 'Estudios relacionados.', id: 'h-estudios', lede: d('Aquí qué estudios citan este producto o su principio activo.'), link: more(r('evidencia/'), 'Ver todos los estudios') })}
        <div class="papers papers--two">${studies.map((i) => paperCard(r, STUDIES[i], i)).join('')}</div>
      </div>
    </section>

    <section class="sec" id="preguntas" aria-labelledby="h-preguntas">
      <div class="wrap faq">
        <h2 class="sec__title faq__title reveal" id="h-preguntas">Preguntas sobre ${p.name}.</h2>
        <div class="reveal">${accordion(faq.map((f) => ({ q: f.q, a: f.a(r) })), `pf${p.n}`)}</div>
        <div class="faq__foot reveal">${more(r('preguntas-frecuentes/'), 'Ver todas las preguntas frecuentes')}<p>¿Tienes otra pregunta? ${more(r('contacto/'), 'Escríbenos')}</p></div>
      </div>
    </section>

    <section class="sec sec--mist" aria-labelledby="rel-guides">
      <div class="wrap wrap--wide">
        ${sechead({ title: 'Antes de empezar.', id: 'rel-guides', lede: 'Guías revisadas para entender el producto, cómo se toma y quién no debería usarlo.', link: more(r('guias/'), 'Todas las guías') })}
        <div class="gcards">${guides.map((g) => guideCard(r, g)).join('')}</div>
      </div>
    </section>

    <section class="sec" aria-labelledby="rel-products">
      <div class="wrap wrap--wide">
        ${sechead({ title: 'Otras fórmulas.', id: 'rel-products', link: more(r('productos/#comparar'), 'Comparar las 4') })}
        <ul class="products products--three">${others.map((x) => productCard(r, x)).join('')}</ul>
      </div>
    </section>

    <!-- Barra de compra fija en el móvil (aparece al pasar la caja de compra) -->
    <div class="buybar" data-buybar hidden>
      <img src="${r(p.img)}" width="420" height="775" alt="" loading="lazy" decoding="async">
      <p class="buybar__info"><b>${p.name}</b><span>${money(p.price)}</span></p>
      <button class="btn btn--buy btn--sm" type="button" data-add="${p.id}">Añadir</button>
    </div>`,
  };
}

/* ---------- Totales y medidor de envío gratis ---------- */

const totals = (label = 'Total a pagar al recibirlo') => `
              <dl class="totals" data-totals>
                <div><dt>Subtotal</dt><dd data-t-sub>—</dd></div>
                <div><dt>Envío <small>${d('importe de muestra')}</small></dt><dd data-t-ship>—</dd></div>
                <div class="totals__sum"><dt>${label}</dt><dd data-t-total>—</dd></div>
              </dl>`;

const meter = () => `
              <div class="meter" data-meter>
                <p class="meter__text" data-meter-text>Envío gratis a partir de ${money(SHIPPING.freeFrom)}</p>
                <span class="meter__bar" aria-hidden="true"><span data-meter-bar></span></span>
              </div>`;

/* ---------- Carrito ---------- */

function cartPage() {
  return {
    path: 'carrito/',
    title: 'Tu carrito',
    desc: 'Revisa los productos de tu pedido. Hoy no pagas nada: pagas al recibirlo.',
    noindex: true,
    ribbon: false,
    trail: [{ label: 'Carrito' }],
    bodyClass: 'is-cart',
    main: (r) => `
    <section class="bagp" aria-labelledby="cart-title" data-cart>
      <div class="wrap">
        <header class="bagp__head">
          <h1 class="bagp__title" id="cart-title" data-cart-title>Revisa tu carrito.</h1>
          <p class="bagp__sub" data-cart-sub>Envío gratis a partir de ${money(SHIPPING.freeFrom)}. Hoy no pagas nada.</p>
          <a class="btn btn--buy" href="${r('checkout/')}" data-cart-go>Finalizar pedido</a>
        </header>

        <ul class="blines" data-cart-items></ul>

        <div class="bsum" data-cart-summary hidden>
          <div class="bsum__in">
            ${meter()}
            ${totals()}
            <p class="bsum__pay"><i class="ph-light ph-hand-coins" aria-hidden="true"></i><span><b>Hoy no pagas nada.</b> Pagas al recibirlo, en la puerta.</span></p>
            <a class="btn btn--buy btn--wide" href="${r('checkout/')}">Finalizar pedido</a>
            <p class="center">${more(r('productos/'), 'Seguir comprando')}</p>
          </div>
        </div>

        <div class="empty" data-cart-empty hidden>
          <i class="ph-light ph-handbag" aria-hidden="true"></i>
          <p class="empty__text">Elige entre nuestras 4 fórmulas. Pagas al recibirlas.</p>
          ${btn(r('productos/'), 'Ver los productos')}
        </div>
        <noscript><p class="note">Para hacer un pedido necesitas activar JavaScript.</p></noscript>
      </div>
    </section>

    <section class="sec sec--mist" aria-labelledby="cart-more">
      <div class="wrap wrap--wide">
        ${sechead({ title: 'Añade otra fórmula.', id: 'cart-more', link: more(r('productos/#comparar'), 'Comparar las 4') })}
        <ul class="products">${PRODUCTS.map((x) => productCard(r, x)).join('')}</ul>
      </div>
    </section>`,
  };
}

/* ---------- Checkout ---------- */

function checkoutPage() {
  const field = (label, name, attrs = '', hint = '', cls = '') => `
                <div class="field ${cls}">
                  <input id="co-${name}" name="${name}" placeholder=" " ${attrs}>
                  <label for="co-${name}">${label}</label>
                  ${hint ? `<p class="field__hint" id="co-${name}-hint">${hint}</p>` : ''}
                  <p class="field__err" id="co-${name}-err" hidden></p>
                </div>`;
  const eu = COUNTRIES.filter((c) => c[2] === 'ue');
  const out = COUNTRIES.filter((c) => c[2] === 'out');
  const opts = (list) => list.map(([code, name]) => `<option value="${code}"${code === 'ES' ? ' selected' : ''}>${name}</option>`).join('');
  const where = [
    ['home', 'ph-house', 'Domicilio particular', 'Te lo llevamos a la dirección que indiques.'],
    ['point', 'ph-storefront', 'Punto de recogida', d('Aquí si se puede pagar al recibir en el punto.')],
    ['locker', 'ph-lock-key', 'Casillero automático', d('Aquí si se puede pagar al recibir en el casillero.')],
  ];

  return {
    path: 'checkout/',
    title: 'Finalizar pedido',
    desc: 'Datos de contacto y de entrega. Hoy no pagas nada: pagas al recibir el pedido.',
    noindex: true,
    minimal: 'Finalizar pedido · pagas al recibirlo',
    bodyClass: 'is-checkout',
    main: (r) => `
    <section class="co" aria-labelledby="co-title">
      <div class="wrap wrap--wide co__grid" data-checkout-wrap>
        <form class="co__form" data-checkout novalidate aria-labelledby="co-title">
          <h1 class="co__title" id="co-title">Finalizar pedido.</h1>
          <p class="co__banner"><i class="ph-light ph-hand-coins" aria-hidden="true"></i><span><b>Hoy no pagas nada.</b> Pagas al recibir el pedido, en la puerta.</span></p>

          <fieldset class="co__step">
            <legend><span class="co__n">1</span>¿Cómo te contactamos?</legend>
            <div class="co__row">
              ${field('Email', 'email', 'type="email" autocomplete="email" required aria-describedby="co-email-err"')}
              ${field('Teléfono', 'phone', 'type="tel" autocomplete="tel" required aria-describedby="co-phone-hint co-phone-err"', d('Aquí para qué se usa: confirmar el pedido y que el transportista pueda avisarte.'))}
            </div>
          </fieldset>

          <fieldset class="co__step">
            <legend><span class="co__n">2</span>¿Dónde lo recibes?</legend>
            <div class="choices">${where.map(([v, icon, t, s], i) => `
              <label class="choice">
                <input type="radio" name="delivery" value="${v}"${i === 0 ? ' checked' : ''}>
                <span class="choice__box"><i class="ph-light ${icon}" aria-hidden="true"></i><b>${t}</b><small>${s}</small></span>
              </label>`).join('')}
            </div>
            <p class="note" data-pickup-note hidden><i class="ph-light ph-map-pin" aria-hidden="true"></i><span>${d('Aquí el buscador de puntos de recogida y casilleros del transportista. Mientras tanto, indica abajo la dirección del punto elegido.')}</span></p>
          </fieldset>

          <fieldset class="co__step">
            <legend><span class="co__n">3</span>Dirección de entrega</legend>
            ${field('Nombre y apellidos', 'name', 'autocomplete="name" required aria-describedby="co-name-err"')}
            ${field('Dirección', 'address', 'autocomplete="address-line1" required aria-describedby="co-address-err"')}
            ${field('Piso, puerta… (opcional)', 'address2', 'autocomplete="address-line2"')}
            <div class="co__row co__row--3">
              ${field('Código postal', 'zip', 'autocomplete="postal-code" required aria-describedby="co-zip-err"')}
              ${field('Ciudad', 'city', 'autocomplete="address-level2" required aria-describedby="co-city-err"')}
              <div class="field field--select">
                <select id="co-country" name="country" autocomplete="country" required data-country>
                  <optgroup label="Unión Europea">${opts(eu)}</optgroup>
                  <optgroup label="Fuera de la UE">${opts(out)}</optgroup>
                </select>
                <label for="co-country">País</label>
                <i class="ph ph-caret-down" aria-hidden="true"></i>
              </div>
            </div>
            <p class="note" data-customs-note hidden><i class="ph-light ph-globe-hemisphere-west" aria-hidden="true"></i><span>Sale de la UE: el envío puede pasar aduana. ${d('Aquí quién paga los impuestos de importación.')}</span></p>
            <div class="field field--area">
              <textarea id="co-notes" name="notes" rows="2" placeholder=" "></textarea>
              <label for="co-notes">Notas para el repartidor (opcional)</label>
            </div>
          </fieldset>

          <fieldset class="co__step">
            <legend><span class="co__n">4</span>¿Cómo pagas?</legend>
            <label class="choice choice--wide">
              <input type="radio" name="payment" value="cod" checked>
              <span class="choice__box"><i class="ph-light ph-hand-coins" aria-hidden="true"></i><b>Pago al recibir (contra reembolso)</b><small>${d('Aquí qué acepta el transportista en la puerta: efectivo, tarjeta o móvil.')}</small></span>
            </label>
          </fieldset>

          <div class="co__checks">
            <label class="check"><input type="checkbox" name="terms" required><span>He leído y acepto los <a href="${r('terminos/')}" target="_blank" rel="noopener">términos de venta</a>.</span></label>
            <label class="check"><input type="checkbox" name="withdrawal" required><span>He leído la información sobre el <a href="${r('devoluciones/')}" target="_blank" rel="noopener">derecho de desistimiento</a> (14 días).</span></label>
            <p class="field__err" data-checks-err hidden>Marca las dos casillas para continuar.</p>
          </div>

          <button class="btn btn--buy btn--wide btn--lg" type="submit">Confirmar pedido · pagas al recibirlo</button>
          <p class="co__msg" data-co-msg role="alert"></p>
          ${note(`Prototipo: el pedido se guarda solo en este navegador y no se envía a ningún servidor. ${d('Aquí irá la conexión con la plataforma de la tienda.')}`)}
        </form>

        <aside class="co__sum" aria-labelledby="co-sum-title" data-co-sum>
          <div class="co__sumhead">
            <h2 class="co__sumtitle" id="co-sum-title">Tu pedido <span data-sum-total-head></span></h2>
            <button class="co__sumtoggle" type="button" aria-expanded="true" data-sum-toggle>Ver detalle<i class="ph ph-caret-down" aria-hidden="true"></i></button>
          </div>
          <div class="co__sumbody" data-sum-body>
            <ul class="slines" data-sum-items></ul>
            ${meter()}
            ${totals()}
            <p class="center">${more(r('carrito/'), 'Editar el carrito')}</p>
          </div>
        </aside>
      </div>

      <div class="wrap empty" data-checkout-empty hidden>
        <i class="ph-light ph-handbag" aria-hidden="true"></i>
        <h2 class="empty__title">Tu carrito está vacío.</h2>
        <p class="empty__text">Añade alguna fórmula para poder finalizar el pedido.</p>
        ${btn(r('productos/'), 'Ver los productos')}
      </div>
    </section>`,
  };
}

/* ---------- Pedido confirmado ---------- */

function confirmedPage() {
  const next = [
    ['ph-seal-check', 'Verificamos tu pedido', d('Aquí cómo se confirma el pedido: llamada, SMS o email, y en cuánto tiempo.')],
    ['ph-truck', 'Lo enviamos con seguimiento', `Entrega en ${SHIPPING.days}, en un embalaje neutro y sin marcas. ${d('Aquí cuándo llega el número de seguimiento.')}`],
    ['ph-hand-coins', 'Pagas al recibirlo', d('Aquí qué acepta el transportista en la puerta: efectivo, tarjeta o móvil.')],
  ];
  return {
    path: 'pedido-confirmado/',
    title: 'Pedido recibido',
    desc: 'Hemos recibido tu pedido. Hoy no has pagado nada: pagas al recibirlo.',
    noindex: true,
    ribbon: false,
    trail: [{ label: 'Pedido recibido' }],
    bodyClass: 'is-confirmed',
    main: (r) => `
    <section class="ok" aria-labelledby="ok-title">
      <div class="wrap ok__in" data-confirmed>
        <span class="ok__tick" aria-hidden="true"><svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="24"/><path d="M15 27l7 7 15-16"/></svg></span>
        <h1 class="ok__title" id="ok-title">Gracias. <span class="soft">Hoy no has pagado nada.</span></h1>
        <p class="ok__lede">Pagarás cuando recibas el pedido. <span data-order-line hidden>Tu número de pedido es <b data-order-id></b>: guárdalo para consultar su estado.</span></p>

        <ol class="nexts">${next.map(([icon, t, s], i) => `
          <li class="reveal"><i class="ph-light ${icon}" aria-hidden="true"></i><p class="nexts__k">Paso ${i + 1}</p><h2 class="nexts__title">${t}</h2><p class="nexts__text">${s}</p></li>`).join('')}
        </ol>

        <div class="osum" data-order-summary hidden></div>

        <div class="ok__actions">
          ${btn(r('cuenta/'), 'Consultar mi pedido')}
          ${more(r(''), 'Volver al inicio')}
        </div>
      </div>

      <div class="wrap empty" data-no-order hidden>
        <i class="ph-light ph-receipt" aria-hidden="true"></i>
        <h2 class="empty__title">No hay ningún pedido reciente.</h2>
        <p class="empty__text">No encontramos un pedido hecho en este navegador.</p>
        ${btn(r('productos/'), 'Ver los productos')}
      </div>
    </section>`,
  };
}

/* ---------- Consultar mi pedido ---------- */

function accountPage() {
  return {
    path: 'cuenta/',
    title: 'Consulta tu pedido',
    desc: 'Consulta el estado de tu pedido con el número de pedido y el email. No necesitas crear una cuenta para comprar.',
    noindex: true,
    trail: [{ label: 'Consultar mi pedido' }],
    bodyClass: 'is-account',
    main: (r) => `
${hero({ title: 'Consulta tu pedido.', lede: 'No necesitas cuenta: compras sin registrarte y consultas el estado con tu número de pedido y el email que usaste.', center: true })}
    <section class="sec sec--top0" aria-label="Consulta">
      <div class="wrap track">
        <form class="track__form reveal" data-track novalidate aria-labelledby="track-title">
          <h2 class="sr-only" id="track-title">Buscar un pedido</h2>
          <div class="co__row">
            <div class="field">
              <input id="tr-id" name="id" required placeholder=" " autocomplete="off" spellcheck="false" aria-describedby="tr-id-err">
              <label for="tr-id">Número de pedido (BR-XXXXXX)</label>
              <p class="field__err" id="tr-id-err" hidden></p>
            </div>
            <div class="field">
              <input id="tr-email" name="email" type="email" required placeholder=" " autocomplete="email" aria-describedby="tr-email-err">
              <label for="tr-email">Email</label>
              <p class="field__err" id="tr-email-err" hidden></p>
            </div>
          </div>
          <button class="btn btn--buy" type="submit">Consultar</button>
          ${note(`Prototipo: solo encuentra los pedidos hechos en este navegador. ${d('Aquí se consultará el sistema de pedidos de la tienda.')}`)}
        </form>
        <div class="track__result" data-track-result aria-live="polite"></div>

        <div class="track__list reveal">
          <h2 class="track__h">Pedidos en este navegador</h2>
          <ul class="olist" data-orders></ul>
          <p class="olist__empty" data-orders-empty>Todavía no has hecho ningún pedido desde este navegador.</p>
        </div>
      </div>
    </section>

    <section class="sec sec--mist" aria-labelledby="help-title">
      <div class="wrap">
        ${sechead({ title: '¿Necesitas ayuda?', id: 'help-title', center: true })}
        ${tiles([
          { href: r('envios/'), icon: 'ph-truck', title: 'Envíos y plazos', text: `${SHIPPING.days}, con seguimiento.`, label: 'Ver plazos' },
          { href: r('devoluciones/'), icon: 'ph-arrow-u-up-left', title: 'Devoluciones', text: '14 días para desistir.', label: 'Cómo devolverlo' },
          { href: r('contacto/'), icon: 'ph-chat-circle-text', title: 'Contacto', text: 'Escríbenos con tu número de pedido.', label: 'Escríbenos' },
        ])}
      </div>
    </section>`,
  };
}

export const shopPages = [
  productsHub(),
  ...PRODUCTS.map(productPage),
  cartPage(),
  checkoutPage(),
  confirmedPage(),
  accountPage(),
];
