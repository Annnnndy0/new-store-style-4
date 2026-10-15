// Piezas comunes de las subpáginas de Style 4: <head>, barra global, barra de la página, pie con
// migas (como en apple.com) y tarjetas que se repiten. Todo con rutas relativas: r('productos/')
// devuelve la ruta correcta desde la página donde se pinte.
import { PRODUCTS, SHIPPING, SITE, d } from './data.mjs';

export const ORIGIN = 'https://example.com/'; // cámbialo por tu dominio

const fmt = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });
const fmt0 = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
// Los importes redondos sin decimales (150 €); los precios, con ellos (24,90 €)
export const money = (n) => (Number.isInteger(n) ? fmt0 : fmt).format(n).replace(/\s/, '&nbsp;');
export const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
export const strip = (s) => String(s).replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

export const makeR = (root) => (path = '') => (root + path) || './';

/* ---------- Iconos y banderas ---------- */

export const sprite = () => `
  <svg class="sprite" aria-hidden="true" focusable="false">
    <symbol id="i-brand" viewBox="-50 -50 100 100">
      <g stroke="currentColor" stroke-width="5" stroke-linecap="round">
        <path d="M0-46V-12M0 12V46M-46 0H-12M12 0H46M-32.5-32.5L-8.5-8.5M8.5 8.5L32.5 32.5M32.5-32.5L8.5-8.5M-8.5 8.5L-32.5 32.5"/>
        <path d="M17.6-42.5L4.6-11.1M-4.6 11.1L-17.6 42.5M42.5-17.6L11.1-4.6M-11.1 4.6L-42.5 17.6M42.5 17.6L11.1 4.6M-11.1-4.6L-42.5-17.6M17.6 42.5L4.6 11.1M-4.6-11.1L-17.6-42.5" stroke-width="3.5"/>
      </g>
      <circle r="7" fill="currentColor"/>
    </symbol>
  </svg>`;

/* ---------- Barra global (la misma que la del index; build.mjs la copia allí) ---------- */

export function gnav(r) {
  const big = (items) => `<ul class="fly__big">${items.map(([h, t]) => `<li><a href="${r(h)}">${t}</a></li>`).join('')}</ul>`;
  const small = (items) => `<ul class="fly__small">${items.map(([h, t]) => `<li><a href="${r(h)}">${t}</a></li>`).join('')}</ul>`;
  const fly = (id, cols) => `
          <div class="fly" id="${id}" data-fly>
            <div class="fly__in wrap">${cols.map(([h, list, main], i) => `
              <div class="fly__col${i === 0 ? ' fly__col--main' : ''}">
                <p class="fly__h">${h}</p>
                ${main ? big(list) : small(list)}
              </div>`).join('')}
            </div>
          </div>`;
  const item = (href, label, id, cols) => `
        <li class="gnav__item" data-gnav-item>
          <a class="gnav__link" href="${r(href)}" data-gnav-link>${label}</a>
          <button class="gnav__open" type="button" aria-expanded="false" aria-controls="${id}" aria-label="Abrir el menú ${label}"><i class="ph ph-caret-down" aria-hidden="true"></i></button>${fly(id, cols)}
        </li>`;
  return `
  <header class="gnav" data-gnav>
    <nav class="gnav__bar wrap" aria-label="Principal">
      <a class="gnav__logo" href="${r('')}" aria-label="${SITE.brand}, inicio">
        <svg aria-hidden="true"><use href="#i-brand"/></svg><span translate="no">${SITE.brand}</span>
      </a>
      <ul class="gnav__list" data-gnav-list>${item('productos/', 'Tienda', 'fly-tienda', [
        ['Comprar', [['productos/', 'Todos los productos'], ...PRODUCTS.map((p) => [`productos/${p.slug}/`, p.name])], true],
        ['Elegir', [['productos/#comparar', 'Comparar los 4 productos'], ['#elegir', 'Ayúdame a elegir'], ['#perfiles', 'A quién va dirigido'], ['carrito/', 'Carrito']]],
        ['Tu pedido', [['#pedido', 'Cómo funciona tu pedido'], ['envios/', 'Envíos y plazos'], ['devoluciones/', 'Devoluciones'], ['cuenta/', 'Consultar mi pedido']]],
      ])}${item('guias/', 'Aprende', 'fly-aprende', [
        ['Guías', [['guias/que-es/', '¿Qué es [producto]?'], ['guias/para-que-se-usa/', '¿Para qué se usa?'], ['guias/como-se-toma/', 'Cómo se toma y dosis'], ['guias/efectos-secundarios/', 'Efectos e interacciones'], ['guias/', 'Todas las guías']], true],
        ['¿Para quién?', [['perfiles/neuro-regulacion/', 'Neuro-regulación'], ['perfiles/cronobiologia-y-sueno/', 'Cronobiología y sueño'], ['perfiles/modulacion-inflamatoria/', 'Modulación inflamatoria'], ['#perfiles', 'Los 6 perfiles']]],
        ['Evidencia', [['evidencia/', 'Estudios con su fuente'], ['#revision', 'Cómo revisamos la información'], ['guias/quien-no-deberia-usarlo/', 'Quién no debería usarlo'], ['guias/mitos-y-verdades/', 'Mitos y verdades']]],
      ])}${item('preguntas-frecuentes/', 'Ayuda', 'fly-ayuda', [
        ['Ayuda', [['preguntas-frecuentes/', 'Preguntas frecuentes'], ['envios/', 'Envíos y plazos'], ['devoluciones/', 'Devoluciones'], ['cuenta/', 'Consultar mi pedido'], ['contacto/', 'Contacto']], true],
        ['Lo esencial', [['#pedido', 'Pagas al recibirlo'], ['envios/#paises', 'Países a los que enviamos'], ['preguntas-frecuentes/', 'Todas las preguntas']]],
        ['Legal', [['terminos/', 'Términos de venta'], ['privacidad/', 'Privacidad'], ['aviso-legal/', 'Aviso legal'], ['cookies/', 'Cookies']]],
      ])}
      </ul>

      <div class="gnav__end">
        <a class="gnav__icon gnav__order" href="${r('cuenta/')}" aria-label="Consultar mi pedido">
          <i class="ph ph-package" aria-hidden="true"></i><span class="gnav__icon-label">Mi pedido</span>
        </a>
        <a class="gnav__icon gnav__bag" href="${r('carrito/')}" aria-label="Carrito" aria-controls="bag" data-bag-toggle>
          <i class="ph ph-handbag" aria-hidden="true"></i><span class="gnav__count" data-cart-count hidden>0</span>
        </a>
        <button class="gnav__burger" type="button" aria-expanded="false" aria-controls="gnav-menu" aria-label="Abrir menú" data-burger>
          <span aria-hidden="true"></span><span aria-hidden="true"></span>
        </button>
      </div>
    </nav>
  </header>
  <div class="scrim" data-scrim aria-hidden="true"></div>

  <!-- Carrito y menú móvil van fuera de la barra: su desenfoque (backdrop-filter) haría que los
       elementos fijos se colocaran respecto a ella y no respecto a la ventana. -->
  <div class="bag" id="bag" role="dialog" aria-label="Carrito" hidden data-bag>
    <div class="bag__in">
      <p class="bag__title" data-bag-title>Tu carrito está vacío.</p>
      <ul class="bag__list" data-bag-list></ul>
      <p class="bag__total" data-bag-total hidden></p>
      <a class="btn btn--buy bag__go" href="${r('carrito/')}" data-bag-go hidden>Ver el carrito</a>
      <p class="bag__h">Mi cuenta</p>
      <ul class="bag__links">
        <li><a href="${r('cuenta/')}"><i class="ph-light ph-package" aria-hidden="true"></i>Consultar mi pedido</a></li>
        <li><a href="${r('productos/')}"><i class="ph-light ph-squares-four" aria-hidden="true"></i>Ver los productos</a></li>
        <li><a href="${r('contacto/')}"><i class="ph-light ph-envelope-simple" aria-hidden="true"></i>Contacto</a></li>
      </ul>
    </div>
  </div>

  <div class="mnav" id="gnav-menu" hidden data-mnav>
    <div class="mnav__panel" data-mnav-root>
      <ul class="mnav__list">
        <li><button type="button" data-mnav-open="fly-tienda">Tienda<i class="ph ph-caret-right" aria-hidden="true"></i></button></li>
        <li><button type="button" data-mnav-open="fly-aprende">Aprende<i class="ph ph-caret-right" aria-hidden="true"></i></button></li>
        <li><button type="button" data-mnav-open="fly-ayuda">Ayuda<i class="ph ph-caret-right" aria-hidden="true"></i></button></li>
        <li><a href="${r('cuenta/')}">Mi pedido</a></li>
        <li><a href="${r('carrito/')}">Carrito</a></li>
      </ul>
      <p class="mnav__note"><i class="ph-light ph-hand-coins" aria-hidden="true"></i>Pagas al recibir tu pedido.</p>
    </div>
    <div class="mnav__panel mnav__panel--sub" data-mnav-sub hidden>
      <button class="mnav__back" type="button" data-mnav-back><i class="ph ph-caret-left" aria-hidden="true"></i>Volver</button>
      <div data-mnav-slot></div>
    </div>
  </div>`;
}

/* Barra mínima para el checkout (como la de apple.com al pagar): solo el logo y el paso */
const gnavMinimal = (r, label) => `
  <header class="gnav gnav--min">
    <div class="gnav__bar wrap">
      <a class="gnav__logo" href="${r('')}" aria-label="${SITE.brand}, inicio"><svg aria-hidden="true"><use href="#i-brand"/></svg><span translate="no">${SITE.brand}</span></a>
      <p class="gnav__step"><i class="ph ph-lock-simple" aria-hidden="true"></i>${label}</p>
    </div>
  </header>`;

export const ribbon = (r) => `
  <aside class="ribbon" aria-label="Aviso">
    <p class="wrap">No pagas nada por adelantado: pagas cuando recibes tu pedido. <a class="more" href="${r('#pedido')}">Cómo funciona</a></p>
  </aside>`;

/* ---------- Barra de la página: nombre, accesos a sus secciones y la acción principal ---------- */

export function lnav(r, { title, href = '#main', links = [], cta }) {
  const action = cta && (cta.add
    ? `<button class="btn btn--buy btn--sm lnav__buy" type="button" data-add="${cta.add}">${cta.label}</button>`
    : `<a class="btn btn--buy btn--sm lnav__buy" href="${cta.href}">${cta.label}</a>`);
  return `
  <nav class="lnav" aria-label="Secciones de la página" data-lnav>
    <div class="lnav__bar">
      <div class="lnav__title">
        <a href="${href}">${title}</a>${links.length ? `
        <button class="lnav__toggle" type="button" aria-expanded="false" aria-controls="lnav-menu" aria-label="Ver secciones" data-lnav-toggle><i class="ph ph-caret-down" aria-hidden="true"></i></button>` : ''}
      </div>${links.length ? `
      <div class="lnav__menu" id="lnav-menu" data-lnav-menu>
        <ul class="lnav__links">${links.map(([h, t]) => `<li><a href="${h}">${t}</a></li>`).join('')}</ul>
      </div>` : ''}
      ${action || ''}
    </div>
  </nav>`;
}

/* ---------- Pie con migas ---------- */

export function footer(r, trail = []) {
  const col = (title, items) => `
        <div class="dir" data-dir>
          <h3 class="dir__h"><button type="button" aria-expanded="false" data-dir-toggle>${title}<i class="ph ph-plus" aria-hidden="true"></i></button><span>${title}</span></h3>
          <ul>${items.map(([h, t]) => `<li><a href="${r(h)}">${t}</a></li>`).join('')}</ul>
        </div>`;
  const crumbs = trail.length ? `
      <nav class="crumbs" aria-label="Estás en">
        <ol>
          <li><a href="${r('')}" aria-label="Inicio"><svg aria-hidden="true"><use href="#i-brand"/></svg></a></li>${trail.map((t, i) => `
          <li>${t.path !== undefined && i < trail.length - 1 ? `<a href="${r(t.path)}">${t.label}</a>` : `<span aria-current="page">${t.label}</span>`}</li>`).join('')}
        </ol>
      </nav>` : '';
  return `
  <footer class="foot">
    <div class="wrap">
      <div class="foot__notes">
        <p>La información de este sitio es educativa y no sustituye el consejo de un profesional sanitario. Consulta a tu médico o farmacéutico antes de empezar cualquier tratamiento.</p>
        <p>Precios con IVA incluido. Envío gratis a partir de ${money(SHIPPING.freeFrom)}; por debajo, ${d('aquí el coste del envío')}. Fuera de la UE el envío puede pasar aduana.</p>
      </div>${crumbs}

      <nav class="foot__dir" aria-label="Directorio del sitio">${col('Tienda', [['productos/', 'Todos los productos'], ...PRODUCTS.map((p) => [`productos/${p.slug}/`, p.name]), ['productos/#comparar', 'Comparar'], ['carrito/', 'Carrito']])}${col('Información', [['guias/', 'Guías'], ['evidencia/', 'Estudios'], ['#perfiles', 'A quién va dirigido'], ['#pedido', 'Cómo funciona tu pedido'], ['#revision', 'Cómo revisamos la información']])}${col('Ayuda', [['preguntas-frecuentes/', 'Preguntas frecuentes'], ['envios/', 'Envíos y plazos'], ['devoluciones/', 'Devoluciones'], ['cuenta/', 'Consultar mi pedido'], ['contacto/', 'Contacto']])}${col('Legal', [['aviso-legal/', 'Aviso legal'], ['privacidad/', 'Privacidad'], ['cookies/', 'Cookies'], ['terminos/', 'Términos de venta']])}
      </nav>

      <p class="foot__help">¿Dudas con tu compra? <a href="${r('contacto/')}">Escríbenos</a> o <a href="${r('cuenta/')}">consulta tu pedido</a>.</p>

      <div class="foot__base">
        <p>© ${SITE.year} <span translate="no">${SITE.brand}</span>. ${d('Aquí la razón social, el NIF y la dirección del titular')}</p>
        <ul class="foot__legal"><li><a href="${r('privacidad/')}">Privacidad</a></li><li><a href="${r('cookies/')}">Cookies</a></li><li><a href="${r('terminos/')}">Términos de venta</a></li><li><a href="${r('aviso-legal/')}">Aviso legal</a></li></ul>
        <p class="foot__lang"><i class="ph ph-globe" aria-hidden="true"></i>Europa · Español</p>
      </div>
    </div>
  </footer>`;
}

/* ---------- Página completa ---------- */

export function page(p) {
  const depth = p.path.split('/').filter(Boolean).length;
  const root = '../'.repeat(depth);
  const r = makeR(root);
  const url = ORIGIN + p.path;
  const title = `${strip(p.title)} | ${SITE.brand}`;
  const trail = p.trail || [];
  const crumbsLd = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Inicio', url: ORIGIN }, ...trail.map((t, i) => ({ name: strip(t.label), url: i === trail.length - 1 ? url : ORIGIN + (t.path || '') }))]
      .map((x, i) => ({ '@type': 'ListItem', position: i + 1, name: x.name, item: x.url })),
  };
  const lds = [crumbsLd, ...(p.ld ? [].concat(p.ld) : [])];
  return `<!doctype html>
<html lang="es" class="no-js">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(strip(p.desc))}">
  <meta name="robots" content="${p.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large'}">
  <link rel="canonical" href="${url}">
  <meta name="theme-color" content="#ffffff">
  <meta property="og:type" content="${p.ogType || 'website'}">
  <meta property="og:locale" content="es_ES">
  <meta property="og:site_name" content="${SITE.brand}">
  <meta property="og:title" content="${esc(strip(p.title))}">
  <meta property="og:description" content="${esc(strip(p.desc))}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${ORIGIN}${p.ogImage || 'assets/og-imagen.jpg'}">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-50 -50 100 100'%3E%3Cg stroke='%231d1d1f' stroke-width='6' stroke-linecap='round'%3E%3Cpath d='M0-46V-10M0 10V46M-46 0H-10M10 0H46M-32.5-32.5L-7-7M7 7L32.5 32.5M32.5-32.5L7-7M-7 7L-32.5 32.5'/%3E%3C/g%3E%3Ccircle r='8' fill='%231d1d1f'/%3E%3C/svg%3E">${p.preload ? `
  <link rel="preload" as="image" href="${r(p.preload)}" fetchpriority="high">` : ''}
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400..600&display=swap">
  <link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/regular/style.css">
  <link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/light/style.css">
  <link rel="stylesheet" href="${r('estilos.css')}?v=${VERSION}">
  <link rel="stylesheet" href="${r('paginas.css')}?v=${VERSION}">
  <script>document.documentElement.classList.replace('no-js', 'js');</script>
${lds.map((ld) => `  <script type="application/ld+json">${JSON.stringify(ld)}</script>`).join('\n')}
</head>
<body class="sub ${p.bodyClass || ''}" data-root="${root}">
  <a class="skip" href="#main">Saltar al contenido</a>
${sprite()}
${p.minimal ? gnavMinimal(r, p.minimal) : gnav(r)}${p.ribbon === false || p.minimal ? '' : ribbon(r)}${p.lnav ? lnav(r, p.lnav(r)) : ''}

  <main id="main">
${p.main(r)}
  </main>
${p.minimal ? `
  <footer class="foot foot--min"><div class="wrap foot__base"><p>© ${SITE.year} <span translate="no">${SITE.brand}</span>. Pagas al recibir tu pedido.</p><ul class="foot__legal"><li><a href="${r('privacidad/')}">Privacidad</a></li><li><a href="${r('terminos/')}">Términos de venta</a></li><li><a href="${r('contacto/')}">Contacto</a></li></ul></div></footer>` : footer(r, trail)}

  <script src="${r('catalog.js')}?v=${VERSION}" defer></script>
  <script src="${r('interfaz.js')}?v=${VERSION}" defer></script>
  <script src="${r('tienda.js')}?v=${VERSION}" defer></script>
</body>
</html>
`;
}

export const VERSION = 3;

/* ---------- Piezas ---------- */

export const more = (href, label, extra = '') => `<a class="more${extra ? ` ${extra}` : ''}" href="${href}">${label}</a>`;
export const btn = (href, label, cls = 'btn--buy') => `<a class="btn ${cls}" href="${href}">${label}</a>`;
export const note = (text = 'Consulta a tu médico o farmacéutico antes de empezar cualquier tratamiento.') =>
  `<p class="note"><i class="ph-light ph-info" aria-hidden="true"></i><span>${text}</span></p>`;

// Cabecera de página. center: titular centrado; media: imagen a la derecha; stats: cifras grandes.
export function hero({ kicker, title, lede, id = 'page-title', center = false, media = '', after = '', cls = '' }) {
  return `
    <section class="phero${center ? ' phero--center' : ''}${media ? ' phero--split' : ''} ${cls}" aria-labelledby="${id}">
      <div class="wrap${media ? ' wrap--wide' : ''} phero__in">
        <div class="phero__text">
          ${kicker ? `<p class="kicker">${kicker}</p>` : ''}
          <h1 class="phero__title" id="${id}">${title}</h1>
          ${lede ? `<p class="phero__lede">${lede}</p>` : ''}
          ${after}
        </div>${media ? `
        <div class="phero__media">${media}</div>` : ''}
      </div>
    </section>`;
}

export const sechead = ({ kicker, title, lede, id, link, center = false }) => `
        <header class="sec__head ${center ? 'sec__head--center' : link ? 'sec__head--split' : ''} reveal">
          <div class="sec__headtext">
            ${kicker ? `<p class="kicker">${kicker}</p>` : ''}
            <h2 class="sec__title" id="${id}">${title}</h2>
            ${lede ? `<p class="sec__lede">${lede}</p>` : ''}
          </div>
          ${link || ''}
        </header>`;

export const productCard = (r, p, h = 'h3') => `
          <li class="product reveal">
            <a class="product__media" href="${r(`productos/${p.slug}/`)}" tabindex="-1" aria-hidden="true">
              <img src="${r(p.img)}" width="420" height="775" alt="" loading="lazy" decoding="async" style="--tilt: ${p.tilt}deg">
            </a>
            <p class="product__n">Fórmula ${p.n}</p>
            <${h} class="product__name"><a href="${r(`productos/${p.slug}/`)}">${p.name}</a></${h}>
            <p class="product__copy">${p.copy}</p>
            <p class="product__price"><b>${money(p.price)}</b> <span>IVA incluido</span></p>
            <div class="product__actions">
              <button class="btn btn--buy btn--sm" type="button" data-add="${p.id}">Añadir al carrito</button>
              <a class="more" href="${r(`productos/${p.slug}/`)}">Más información<span class="sr-only"> sobre ${p.name}</span></a>
            </div>
          </li>`;

export const guideCard = (r, g) => `
          <article class="gcard reveal" data-tag="${esc(g.tag)}">
            <a class="gcard__pic" href="${r(`guias/${g.slug}/`)}" tabindex="-1" aria-hidden="true"><img src="${r(g.img)}" width="${g.w}" height="${g.h}" alt="" loading="lazy" decoding="async"${g.focus ? ` style="object-position: ${g.focus}"` : ''}></a>
            <div class="gcard__body">
              <p class="gcard__tag">${g.tag} · ${g.min} min</p>
              <h3 class="gcard__title"><a href="${r(`guias/${g.slug}/`)}">${g.title}</a></h3>
              <p class="gcard__lede">${d(g.lede)}</p>
              <span class="more gcard__more" aria-hidden="true">Leer la guía</span>
            </div>
          </article>`;

export const paperCard = (r, s, i, { link = true } = {}) => `
          <article class="paper reveal" id="estudio-${i + 1}" data-tag="${esc(s.tag)}">
            <p class="paper__top"><span>${s.tag}</span>${s.trial ? `<span class="paper__live">${d('En curso')}</span>` : `<span>${d(s.year)}</span>`}</p>
            <p class="paper__source">${d(s.trial ? 'Registro: ClinicalTrials.gov' : 'Revista: aquí la revista')}</p>
            <h3 class="paper__title">${d(s.title)}</h3>
            <p class="paper__text">${d(s.text)}</p>
            <dl class="paper__ids">${s.ids.map(([k, v]) => `<div><dt>${k}</dt><dd>${d(v)}</dd></div>`).join('')}</dl>
            ${link ? `<a class="more" href="${r(`evidencia/#estudio-${i + 1}`)}">${s.link}</a>` : `<span class="paper__off">${d('Aquí el enlace a la fuente (PubMed, DOI o registro)')}</span>`}
          </article>`;

// Acordeón con los mismos estilos y el mismo comportamiento que las preguntas del index
export const accordion = (items, prefix, { openFirst = true } = {}) => `
          <div class="faq__list" data-faq>${items.map((it, i) => `
            <div class="faq__item"${it.search ? ` data-search="${esc(it.search.toLowerCase())}"` : ''}>
              <h3><button class="faq__q" type="button" aria-expanded="${openFirst && i === 0}" aria-controls="${prefix}-${i + 1}" id="${prefix}-q${i + 1}">${it.q}<i class="ph ph-plus" aria-hidden="true"></i></button></h3>
              <div class="faq__a" id="${prefix}-${i + 1}" role="region" aria-labelledby="${prefix}-q${i + 1}">${it.a}</div>
            </div>`).join('')}
          </div>`;

// Filas de enlace grandes (como los accesos de "Ways to buy")
export const tiles = (items) => `
          <div class="ends">${items.map((it) => `
            <a class="end reveal" href="${it.href}">
              <i class="ph-light ${it.icon}" aria-hidden="true"></i>
              <span class="end__title">${it.title}</span>
              <span class="end__text">${it.text}</span>
              <span class="more">${it.label}</span>
            </a>`).join('')}
          </div>`;

export const kv = (rows, cls = '') => `<dl class="kv ${cls}">${rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>`;

export const PLEDGES = [
  ['ph-hand-coins', 'Pagas al recibirlo', 'No pagas nada hasta que el pedido llega a tu puerta.', '#pedido'],
  ['ph-package', 'Envío discreto', 'Cartón neutro, sin marcas ni alusiones al contenido.', 'envios/'],
  ['ph-truck', SHIPPING.days, 'Con seguimiento, desde nuestro almacén en la UE.', 'envios/'],
  ['ph-arrow-u-up-left', '14 días para desistir', 'Si cambias de opinión, lo devuelves.', 'devoluciones/'],
];
