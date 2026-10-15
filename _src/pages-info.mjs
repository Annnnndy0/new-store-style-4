// Páginas informativas en el estilo de Style 4: guías (como los artículos de Apple Newsroom),
// perfiles, estudios, preguntas frecuentes, envíos, devoluciones, contacto y textos legales.
import { PRODUCTS, GUIDES, PROFILES, STUDIES, FAQ_GROUPS, COUNTRIES, LEGAL, SHIPPING, d } from './data.mjs';
import {
  money, esc, strip, hero, sechead, guideCard, paperCard, accordion, tiles, kv, note, more, btn, PLEDGES,
} from './layout.mjs';

const TOPICS = [...new Set(GUIDES.map((g) => g.tag))];

const chips = (label, values) => `
        <div class="chips reveal" role="group" aria-label="${label}" data-filter>
          <button class="chip is-on" type="button" aria-pressed="true" data-value="">Todos</button>${values.map((v) => `
          <button class="chip" type="button" aria-pressed="false" data-value="${esc(v)}">${v}</button>`).join('')}
        </div>`;

const banner = ({ k, title, text, href, label, img = '' }) => `
        <aside class="banner reveal">
          <div class="banner__text">
            <p class="kicker">${k}</p>
            <h2 class="banner__title">${title}</h2>
            <p class="banner__lede">${text}</p>
            ${btn(href, label)}
          </div>${img ? `
          <div class="banner__media">${img}</div>` : ''}
        </aside>`;

const specRow = (id, title, body) => `
          <section class="spec reveal" id="${id}" aria-labelledby="h-${id}">
            <h2 class="spec__title" id="h-${id}">${title}</h2>
            <div class="spec__body">${body}</div>
          </section>`;

/* ---------- Guías ---------- */

function guidesHub() {
  const [first, ...rest] = GUIDES;
  return {
    path: 'guias/',
    title: 'Guías: todo lo que necesitas saber sobre [producto]',
    desc: 'Guías revisadas sobre [producto]: qué es, para qué se usa, cómo se toma y en qué dosis, efectos secundarios, quién no debería usarlo y mitos, con sus fuentes.',
    trail: [{ label: 'Guías' }],
    ld: {
      '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Guías', inLanguage: 'es',
      hasPart: GUIDES.map((g) => ({ '@type': 'Article', headline: strip(g.title), url: `https://example.com/guias/${g.slug}/` })),
    },
    lnav: () => ({ title: 'Guías', links: [['#destacada', 'Empieza aquí'], ['#todas', 'Todas las guías'], ['#revision', 'Cómo las revisamos']], cta: { href: '#todas', label: 'Ver guías' } }),
    main: (r) => `
    <section class="shead" aria-labelledby="page-title">
      <div class="wrap wrap--wide shead__in">
        <h1 class="shead__title" id="page-title">Guías. <span class="soft">Todo lo que necesitas saber sobre [producto], con sus fuentes.</span></h1>
        <div class="shead__media">
          <!-- IMAGEN · guias: prospecto doblado (ver PROMPTS-IMAGENES.md) -->
          <img src="${r('assets/prospecto.webp')}" width="1264" height="848" alt="Prospecto de papel doblado sobre fondo blanco" fetchpriority="high">
        </div>
      </div>
    </section>

    <section class="sec sec--tight" id="destacada" aria-labelledby="feat-title">
      <div class="wrap wrap--wide">
        <h2 class="sr-only" id="feat-title">Empieza por aquí</h2>
        <article class="gfeat reveal">
          <a class="gfeat__pic" href="${r(`guias/${first.slug}/`)}" tabindex="-1" aria-hidden="true"><img src="${r(first.big)}" width="${first.bw}" height="${first.bh}" alt="" decoding="async"></a>
          <div class="gfeat__body">
            <p class="gcard__tag">Empieza aquí · ${first.tag} · ${first.min} min</p>
            <h3 class="gfeat__title"><a href="${r(`guias/${first.slug}/`)}">${first.title}</a></h3>
            <p class="gfeat__lede">${d(first.lede)}</p>
            ${btn(r(`guias/${first.slug}/`), 'Leer la guía')}
          </div>
        </article>
      </div>
    </section>

    <section class="sec sec--mist" id="todas" aria-labelledby="all-title">
      <div class="wrap wrap--wide">
        ${sechead({ title: 'Todas las guías.', id: 'all-title', lede: d('Aquí una línea que presente las guías y cómo se revisan.') })}
        ${chips('Filtrar por tema', TOPICS)}
        <div class="gcards" data-filter-list>${GUIDES.map((g) => guideCard(r, g)).join('')}</div>
      </div>
    </section>

    <section class="sec" id="revision" aria-labelledby="rev-title">
      <div class="wrap wrap--wide">
        <div class="review">
          <h2 class="review__title reveal" id="rev-title">Cómo revisamos las guías.</h2>
          <dl class="review__grid reveal">
            <div><dt><i class="ph-light ph-pen-nib" aria-hidden="true"></i>Quién las escribe</dt><dd>${d('Aquí el nombre y la formación de quien redacta las guías.')}</dd></div>
            <div><dt><i class="ph-light ph-stethoscope" aria-hidden="true"></i>Quién las revisa</dt><dd>${d('Aquí el profesional sanitario que revisa cada texto y su número de colegiado.')}</dd></div>
            <div><dt><i class="ph-light ph-books" aria-hidden="true"></i>Qué fuentes usamos</dt><dd>Fichas oficiales, publicaciones revisadas por pares y ensayos registrados, siempre citados con su referencia.</dd></div>
            <div><dt><i class="ph-light ph-calendar-check" aria-hidden="true"></i>Cada cuánto se actualizan</dt><dd>${d('Aquí cada cuánto se revisan y la fecha de la última revisión.')}</dd></div>
          </dl>
        </div>
      </div>
    </section>

    <section class="sec sec--mist" aria-labelledby="more-title">
      <div class="wrap">
        ${sechead({ title: '¿Buscas otra cosa?', id: 'more-title', center: true })}
        ${tiles([
          { href: r('preguntas-frecuentes/'), icon: 'ph-chats-circle', title: 'Preguntas frecuentes', text: 'Pago al recibir, plazos, devoluciones y uso.', label: 'Ver respuestas' },
          { href: r('evidencia/'), icon: 'ph-flask', title: 'Estudios', text: 'Las publicaciones que citan las guías, con su DOI.', label: 'Ver estudios' },
          { href: r('productos/'), icon: 'ph-handbag', title: 'Las 4 fórmulas', text: 'Con su precio y su ficha técnica.', label: 'Ir a la tienda' },
        ])}
      </div>
    </section>`,
  };
}

function guidePage(g, gi) {
  const related = [1, 2, 3].map((k) => GUIDES[(gi + k) % GUIDES.length]);
  const product = PRODUCTS[gi % PRODUCTS.length];
  const refs = [gi % 6, (gi + 2) % 6, (gi + 4) % 6];
  const cite = (n) => `<sup class="cite"><a href="#ref-${n}" aria-label="Fuente ${n}">[${n}]</a></sup>`;
  const h2 = (t, i) => (g.myths && i < 3 ? `<span class="verdict">${d('Mito')}</span> ${d(t)}` : t);
  const tocItems = g.sections.map((t, i) => [`s${i + 1}`, g.myths && i < 3 ? `Mito ${i + 1}` : t]);
  const faq = [1, 2, 3].map((n) => ({ q: d(`Aquí la pregunta frecuente ${n} de esta guía`), a: `<p>${d('Aquí la respuesta, de 40 a 80 palabras.')}</p>` }));
  const img = g.big || g.img;
  const [w, h] = g.big ? [g.bw, g.bh] : [g.w, g.h];

  const body = g.sections.map((t, i) => `
          <section class="art__sec reveal" id="s${i + 1}">
            <h2>${h2(t, i)}</h2>
            <p>${d('Aquí un párrafo corto que responda la pregunta en las dos primeras frases.')}${cite(Math.min(i + 1, 3))}</p>
            <p>${d('Aquí el desarrollo con datos concretos, siempre con su fuente. Frases cortas y sin promesas de resultados.')}</p>${i === 1 ? `
            <div class="table-wrap">
              <table class="table">
                <caption class="sr-only">Tabla de la guía</caption>
                <thead><tr><th scope="col">${d('Columna 1')}</th><th scope="col">${d('Columna 2')}</th><th scope="col">${d('Columna 3')}</th></tr></thead>
                <tbody>
                  <tr><th scope="row">${d('Dato')}</th><td>${d('Dato')}</td><td>${d('Dato')}</td></tr>
                  <tr><th scope="row">${d('Dato')}</th><td>${d('Dato')}</td><td>${d('Dato')}</td></tr>
                </tbody>
              </table>
            </div>
            ${note('Información educativa: no sustituye el consejo de un profesional sanitario.')}` : ''}${i === 2 ? `
            <ul class="ticks"><li>${d('Aquí un punto clave')}</li><li>${d('Aquí otro punto clave')}</li><li>${d('Aquí un tercer punto clave')}</li></ul>` : ''}
          </section>`).join('');

  return {
    path: `guias/${g.slug}/`,
    title: g.title,
    desc: `${g.lede} Guía revisada, con fuentes verificables y fecha de actualización.`,
    trail: [{ label: 'Guías', path: 'guias/' }, { label: g.title }],
    bodyClass: 'is-guide',
    ogType: 'article',
    preload: img,
    ld: {
      '@context': 'https://schema.org', '@type': 'Article', headline: strip(g.title), description: g.lede, inLanguage: 'es',
      image: `https://example.com/${img}`, mainEntityOfPage: `https://example.com/guias/${g.slug}/`,
      publisher: { '@type': 'Organization', name: 'Brand' },
    },
    lnav: () => ({ title: 'Guías', href: '#main', links: [['#respuesta', 'Respuesta rápida'], ['#contenido', 'Contenido'], ['#preguntas', 'Preguntas'], ['#fuentes', 'Fuentes']], cta: { href: '#relacionado', label: 'Ver producto' } }),
    main: (r) => `
    <article class="art" aria-labelledby="g-title">
      <header class="art__head wrap wrap--text">
        <p class="art__k"><a href="${r('guias/')}">Guías</a> · ${g.tag} · ${g.min} min de lectura</p>
        <h1 class="art__title" id="g-title">${g.title}</h1>
        <p class="art__lede">${d(g.lede)}</p>
        <dl class="byline">
          <div><dt>Escrito por</dt><dd>${d('[nombre]')}</dd></div>
          <div><dt>Revisión médica</dt><dd>${d('[nombre y nº de colegiado]')}</dd></div>
          <div><dt>Actualizada</dt><dd>${d('fecha')}</dd></div>
        </dl>
      </header>

      <figure class="art__media wrap wrap--wide">
        <img src="${r(img)}" width="${w}" height="${h}" alt="${esc(g.alt)}" fetchpriority="high"${g.focus ? ` style="object-position: ${g.focus}"` : ''}>
      </figure>

      <div class="art__body wrap wrap--text">
        <div class="answer reveal" id="respuesta">
          <p class="answer__k"><i class="ph ph-lightning" aria-hidden="true"></i>Respuesta rápida</p>
          <p>${d(g.answer)}</p>
        </div>

        <nav class="toc reveal" id="contenido" aria-label="En esta guía">
          <p class="toc__h">En esta guía</p>
          <ol>${tocItems.map(([id, t]) => `<li><a href="#${id}">${t}</a></li>`).join('')}<li><a href="#preguntas">Preguntas</a></li><li><a href="#fuentes">Fuentes</a></li></ol>
        </nav>
        ${body}

        <aside class="relprod reveal" id="relacionado" aria-label="Producto relacionado">
          <img src="${r(product.img)}" width="420" height="775" alt="" loading="lazy" decoding="async" style="--tilt: ${product.tilt}deg">
          <div class="relprod__text">
            <p class="relprod__k">Producto relacionado</p>
            <p class="relprod__name">${product.name}</p>
            <p class="relprod__line">${money(product.price)} · Pagas al recibirlo</p>
          </div>
          <div class="relprod__actions">
            <button class="btn btn--buy btn--sm" type="button" data-add="${product.id}">Añadir al carrito</button>
            ${more(r(`productos/${product.slug}/`), 'Ver la ficha')}
          </div>
        </aside>

        <section class="art__sec reveal" id="preguntas">
          <h2>Preguntas sobre esta guía</h2>
          ${accordion(faq, `gf${gi + 1}`, { openFirst: false })}
        </section>

        <section class="art__sec reveal" id="fuentes">
          <h2>Fuentes</h2>
          <ol class="refs">${refs.map((si, n) => `
            <li id="ref-${n + 1}">${d('Autores et al.')} <em>${d(STUDIES[si].title)}</em> ${d('Revista, año.')} ${more(r(`evidencia/#estudio-${si + 1}`), 'Ver la ficha del estudio')}</li>`).join('')}
          </ol>
          <p class="refs__note">Fuentes comprobadas el ${d('fecha')}. ¿Has visto un error? ${more(r('contacto/'), 'Escríbenos')}</p>
        </section>
      </div>
    </article>

    <section class="sec sec--mist" aria-labelledby="g-more">
      <div class="wrap wrap--wide">
        ${sechead({ title: 'Sigue leyendo.', id: 'g-more', link: more(r('guias/'), 'Todas las guías') })}
        <div class="gcards">${related.map((x) => guideCard(r, x)).join('')}</div>
      </div>
    </section>`,
  };
}

/* ---------- Perfiles ---------- */

function profilePage(pr, pi) {
  const area = pr.area || d('Aquí el área');
  const title = pr.title || d('Aquí el perfil al que va dirigido');
  const plain = pr.area || `Perfil ${pr.n}`;
  const others = PROFILES.filter((x) => x !== pr);
  const studies = [pi % 6, (pi + 3) % 6];
  return {
    path: `perfiles/${pr.slug}/`,
    title: pr.title ? `${plain}: ${pr.title.charAt(0).toLowerCase()}${pr.title.slice(1)}` : plain,
    desc: `Perfil ${pr.n} · ${plain}: para quién está pensado, qué dice la ficha oficial de los productos y qué conviene saber antes de empezar.`,
    trail: [{ label: 'A quién va dirigido', path: '#perfiles' }, { label: plain }],
    bodyClass: 'is-profile',
    preload: `${pr.card}${pr.video ? '-760' : ''}.webp`,
    lnav: () => ({ title: pr.short || plain, links: [['#para-quien', 'Para quién'], ['#ficha', 'Qué dice la ficha'], ['#antes', 'Antes de empezar'], ['#estudios', 'Estudios']], cta: { href: '#productos-perfil', label: 'Ver fórmulas' } }),
    main: (r) => `
${hero({
  kicker: `Perfil ${pr.n}`,
  title: pr.text ? `${area}. <span class="soft">${pr.text}</span>` : title,
  lede: d('Aquí para quién está pensado este perfil y qué dice la ficha oficial del producto, sin prometer resultados.'),
  // El perfil de artistas lleva el vídeo; el resto, su foto
  media: pr.video
    ? `<figure class="pmedia pmedia--wide"><video src="${r(pr.video)}.mp4" poster="${r(pr.card)}-760.webp" muted loop playsinline autoplay preload="metadata" aria-label="${esc(pr.alt)}" data-autoplay></video></figure>`
    : `<figure class="pmedia pmedia--wide"><img src="${r(pr.card)}.webp" width="1400" height="781" alt="${esc(pr.alt)}" fetchpriority="high"></figure>`,
  after: `
          <div class="phero__ctas">${btn(r('#elegir'), 'Descubrir mi fórmula')} ${more(r('productos/'), 'Ver las 4 fórmulas')}</div>
          <p class="fine"><i class="ph-light ph-shield-check" aria-hidden="true"></i><span>${d('Aquí quién supervisa estos perfiles y con qué fuentes.')}</span></p>`,
})}
    <section class="sec sec--mist sec--tight" aria-label="En cifras">
      <div class="wrap">
        <ul class="stats stats--center reveal">
          <li><span class="stats__pre">${d('Aquí qué mide')}</span><b class="stats__num stats__num--md">${d('XX %')}</b><span class="stats__post">${d('Aquí la fuente')}</span></li>
          <li><span class="stats__pre">${d('Aquí qué mide')}</span><b class="stats__num stats__num--md">${d('XX %')}</b><span class="stats__post">${d('Aquí la fuente')}</span></li>
          <li><span class="stats__pre">${d('Aquí qué mide')}</span><b class="stats__num stats__num--md">${d('XX')}</b><span class="stats__post">${d('Aquí la fuente')}</span></li>
        </ul>
      </div>
    </section>

    <div class="sec">
      <div class="wrap specs">
        ${specRow('para-quien', 'Para quién está pensado', `
              <p>${d('Aquí la descripción del perfil: situación, rutina y necesidades, sin nombrar enfermedades que la ficha no recoja.')}</p>
              <ul class="ticks"><li>${d('Aquí una situación típica de este perfil')}</li><li>${d('Aquí otra situación')}</li><li>${d('Aquí una tercera situación')}</li></ul>`)}
        ${specRow('ficha', 'Qué dice la ficha oficial', `
              <p>${d('Aquí qué recoge la ficha oficial de cada producto para este perfil. Solo lo que figure en ella.')}</p>
              <div class="table-wrap" id="productos-perfil">
                <table class="table">
                  <caption class="sr-only">Productos y ficha oficial para este perfil</caption>
                  <thead><tr><th scope="col">Producto</th><th scope="col">Qué dice su ficha para este perfil</th></tr></thead>
                  <tbody>${PRODUCTS.map((p) => `<tr><th scope="row"><a href="${r(`productos/${p.slug}/`)}">${p.name}</a></th><td>${d('Aquí si lo recoge y en qué términos')}</td></tr>`).join('')}</tbody>
                </table>
              </div>`)}
        ${specRow('antes', 'Antes de empezar', `
              <p>${d('Aquí qué conviene saber antes de empezar y cuándo consultar a un profesional.')}</p>
              ${note('Si tienes síntomas o dudas médicas, consulta a un profesional sanitario. Esta página no ofrece diagnósticos ni tratamientos.')}
              <p class="links">${more(r('guias/quien-no-deberia-usarlo/'), 'Quién no debería usarlo')} ${more(r('guias/efectos-secundarios/'), 'Efectos secundarios e interacciones')}</p>`)}
      </div>
    </div>

    <section class="sec sec--mist" id="estudios" aria-labelledby="h-estudios">
      <div class="wrap wrap--wide">
        ${sechead({ title: 'Estudios relacionados.', id: 'h-estudios', link: more(r('evidencia/'), 'Ver todos los estudios') })}
        <div class="papers papers--two">${studies.map((i) => paperCard(r, STUDIES[i], i)).join('')}</div>
      </div>
    </section>

    <section class="sec" aria-labelledby="pr-more">
      <div class="wrap">
        ${sechead({ title: 'Otros perfiles.', id: 'pr-more', center: true })}
        <ul class="profiles">${others.map((x) => `
          <li class="reveal"><a class="profile" href="${r(`perfiles/${x.slug}/`)}">
            <span class="profile__pic"><img src="${r(x.img)}" width="${x.w}" height="${x.h}" alt="" loading="lazy" decoding="async"></span>
            <span class="profile__name">${x.area || d(`Perfil ${x.n}`)}</span><span class="more">Ver perfil</span></a></li>`).join('')}
        </ul>
      </div>
    </section>`,
  };
}

/* ---------- Estudios ---------- */

function evidencePage() {
  const criteria = [
    ['ph-seal-check', 'Revisados por pares', d('Aquí qué revistas e índices se aceptan (PubMed / MEDLINE…).')],
    ['ph-clipboard-text', 'Ensayos registrados', d('Aquí el criterio: registro en ClinicalTrials.gov o en el registro europeo.')],
    ['ph-scales', 'Diseño y tamaño', d('Aquí qué diseños se priorizan y cómo se indica el tamaño de la muestra.')],
    ['ph-link-simple', 'Identificador comprobado', d('Aquí cómo se comprueba cada DOI o PMID y cada cuánto se revisa.')],
  ];
  const levels = [
    ['Revisión sistemática', 'Reúne y analiza todos los estudios publicados sobre una misma pregunta.'],
    ['Ensayo clínico aleatorizado', 'Compara grupos de personas asignadas al azar a un tratamiento o a un control.'],
    ['Estudio observacional', 'Observa a personas en su vida real sin asignarles un tratamiento: muestra asociaciones, no causas.'],
    ['Estudio preclínico', 'Hecho en células o en animales: orienta la investigación, pero no demuestra efectos en personas.'],
    ['Fuente oficial', 'Fichas técnicas, prospectos y documentos de agencias del medicamento.'],
  ];
  return {
    path: 'evidencia/',
    title: 'Estudios e información científica sobre [producto]',
    desc: 'Catálogo de estudios, ensayos clínicos y fuentes oficiales que citan las guías, con su DOI, PMID o número de registro, y cómo se eligen.',
    trail: [{ label: 'Estudios' }],
    lnav: () => ({ title: 'Estudios', links: [['#catalogo', 'Catálogo'], ['#criterios', 'Cómo elegimos'], ['#tipos', 'Tipos de estudio'], ['#farmacovigilancia', 'Efectos adversos']], cta: { href: '#catalogo', label: 'Ver estudios' } }),
    main: (r) => `
${hero({
  kicker: 'Evidencia',
  title: 'Estudios con su fuente. <span class="soft">Sin letra pequeña.</span>',
  lede: `Publicaciones revisadas por pares, ensayos clínicos registrados y monografías de referencia, con su <strong>DOI o PMID</strong> para que puedas comprobarlo todo. ${d('Aquí una línea sobre la base documental.')}`,
  media: `<img class="phero__render" src="${r('assets/brain.webp')}" width="640" height="640" alt="" aria-hidden="true">`,
  after: `
          <form class="search" action="./" method="get" role="search" data-evid-search>
            <label class="sr-only" for="evid-q">Buscar estudios</label>
            <i class="ph ph-magnifying-glass" aria-hidden="true"></i>
            <input id="evid-q" name="q" type="search" placeholder="Buscar estudios o temas" autocomplete="off">
            <button type="submit" aria-label="Buscar"><i class="ph ph-arrow-right" aria-hidden="true"></i></button>
          </form>`,
})}
    <section class="sec sec--mist" id="catalogo" aria-labelledby="cat-title">
      <div class="wrap wrap--wide">
        ${sechead({ title: 'Monografías de referencia clínica.', id: 'cat-title', lede: d('Estudios con rigor metodológico aprobados por comités de ética independientes. Se revisan periódicamente en los indexadores biomédicos.') })}
        ${chips('Filtrar por tema', STUDIES.map((s) => s.tag))}
        <p class="search__count" data-evid-count aria-live="polite"></p>
        <div class="papers" data-filter-list>${STUDIES.map((s, i) => paperCard(r, s, i, { link: false })).join('')}</div>
        <div class="empty empty--inline" data-evid-none hidden><i class="ph-light ph-magnifying-glass" aria-hidden="true"></i><p class="empty__text">Ningún estudio coincide con la búsqueda. ${more('./', 'Ver todos')}</p></div>
      </div>
    </section>

    <section class="sec" id="criterios" aria-labelledby="crit-title">
      <div class="wrap wrap--wide">
        ${sechead({ title: 'Cómo elegimos las fuentes.', id: 'crit-title', lede: d('Aquí una línea sobre quién selecciona y revisa los estudios.'), center: true })}
        <ul class="pcards">${criteria.map(([icon, t, s]) => `
          <li class="pcard reveal"><i class="ph-light ${icon}" aria-hidden="true"></i><h3 class="pcard__title">${t}</h3><p class="pcard__text">${s}</p></li>`).join('')}
        </ul>
      </div>
    </section>

    <section class="sec sec--mist" id="tipos" aria-labelledby="tipos-title">
      <div class="wrap duo">
        <div class="reveal">
          <h2 class="sec__title" id="tipos-title">No todos los estudios pesan lo mismo.</h2>
          <p class="sec__lede">Así se lee cada tipo de fuente que citamos, de más a menos peso.</p>
        </div>
        <ol class="levels reveal">${levels.map(([t, s]) => `
          <li><b>${t}</b><span>${s}</span></li>`).join('')}
        </ol>
      </div>
    </section>

    <section class="sec" id="farmacovigilancia" aria-label="Notificar un efecto adverso">
      <div class="wrap wrap--wide">
        ${banner({
          k: 'Farmacovigilancia',
          title: '¿Has notado un efecto adverso?',
          text: `Cualquier efecto adverso se puede notificar al sistema de farmacovigilancia de tu país. ${d('Aquí el enlace al formulario de notificación de cada país.')}`,
          href: r('guias/efectos-secundarios/'),
          label: 'Leer la guía de efectos',
          img: `<img src="${r('assets/laboratorio-700.webp')}" width="700" height="470" alt="" loading="lazy" decoding="async">`,
        })}
      </div>
    </section>`,
  };
}

/* ---------- Preguntas frecuentes ---------- */

function faqPage() {
  const total = FAQ_GROUPS.reduce((n, g) => n + g.items.length, 0);
  const R0 = (p) => `https://example.com/${p}`;
  // Datos estructurados solo con las respuestas que ya tienen texto definitivo
  const answered = FAQ_GROUPS.flatMap((g) => g.items).map((it) => {
    const text = strip(it.a(R0).replace(/<span class="draft">[\s\S]*?<\/span>/g, '').replace(/<a [\s\S]*?<\/a>/g, ''));
    return text.length > 8 ? { '@type': 'Question', name: it.q, acceptedAnswer: { '@type': 'Answer', text } } : null;
  }).filter(Boolean);
  return {
    path: 'preguntas-frecuentes/',
    title: 'Preguntas frecuentes: pedido, pago al recibir, envíos y uso',
    desc: 'Respuestas sobre el pedido y el pago al recibir, los plazos y países de envío, las devoluciones y el uso del producto.',
    trail: [{ label: 'Preguntas frecuentes' }],
    bodyClass: 'is-faq',
    ld: { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: answered },
    lnav: () => ({ title: 'Ayuda', links: FAQ_GROUPS.map((g) => [`#tema-${g.id}`, g.title]), cta: { href: '#hablar', label: 'Contacto' } }),
    main: (r) => `
${hero({
  title: 'Preguntas frecuentes.',
  lede: `${total} respuestas sobre el pedido, el envío, las devoluciones y el uso del producto.`,
  center: true,
  after: `
          <div class="search search--big" data-faq-scope>
            <i class="ph ph-magnifying-glass" aria-hidden="true"></i>
            <label class="sr-only" for="faq-search">Buscar una pregunta</label>
            <input id="faq-search" type="search" placeholder="Busca: pago, aduana, receta…" autocomplete="off" data-faq-search>
          </div>
          <p class="search__count" data-faq-count aria-live="polite"></p>`,
})}
    <section class="sec sec--top0" aria-label="Temas">
      <div class="wrap">
        <ul class="topics reveal">${FAQ_GROUPS.map((g) => `
          <li><a href="#tema-${g.id}"><i class="ph-light ${g.icon}" aria-hidden="true"></i><b>${g.title}</b><span>${g.items.length} preguntas</span></a></li>`).join('')}
        </ul>
      </div>
    </section>

    <section class="sec sec--tight" aria-label="Preguntas">
      <div class="wrap">${FAQ_GROUPS.map((g, gi) => `
        <section class="fgroup reveal" id="tema-${g.id}" aria-labelledby="tema-${g.id}-t" data-faq-group>
          <h2 class="fgroup__title" id="tema-${g.id}-t">${g.title}.</h2>
          ${accordion(g.items.map((it) => ({ q: it.q, a: it.a(r), search: `${it.q} ${strip(it.a(r))}` })), `fq-${g.id}`, { openFirst: gi === 0 })}
        </section>`).join('')}
        <div class="empty empty--inline" data-faq-none hidden>
          <i class="ph-light ph-magnifying-glass" aria-hidden="true"></i>
          <p class="empty__text">No hay ninguna pregunta con esas palabras. Prueba con otra o ${more(r('contacto/'), 'escríbenos')}</p>
        </div>
      </div>
    </section>

    <section class="sec sec--mist" id="hablar" aria-labelledby="talk-title">
      <div class="wrap">
        ${sechead({ title: '¿No encuentras tu respuesta?', id: 'talk-title', lede: 'Te respondemos en español y en inglés.', center: true })}
        ${tiles([
          { href: r('contacto/'), icon: 'ph-chat-circle-text', title: 'Escríbenos', text: 'Sobre tu pedido, un producto o una guía.', label: 'Contacto' },
          { href: r('cuenta/'), icon: 'ph-package', title: 'Consultar mi pedido', text: 'Con tu número de pedido y tu email.', label: 'Consultar' },
          { href: r('guias/'), icon: 'ph-book-open', title: 'Guías', text: 'Todo sobre [producto], con sus fuentes.', label: 'Ver guías' },
        ])}
      </div>
    </section>`,
  };
}

/* ---------- Envíos ---------- */

function shippingPage() {
  const eu = COUNTRIES.filter((c) => c[2] === 'ue');
  const out = COUNTRIES.filter((c) => c[2] === 'out');
  const table = (caption, list, customs) => `
            <div class="table-wrap reveal">
              <table class="table table--countries">
                <caption>${caption}</caption>
                <thead><tr><th scope="col">País</th><th scope="col">Plazo estimado</th><th scope="col">Pago al recibir</th><th scope="col">Aduana</th></tr></thead>
                <tbody>${list.map(([code, name]) => `
                  <tr><th scope="row"><span class="cc">${code}</span>${name}</th><td>${SHIPPING.days}</td><td>${d('Sí / no')}</td><td>${customs}</td></tr>`).join('')}
                </tbody>
              </table>
            </div>`;
  const where = [
    ['ph-house', 'Domicilio particular', 'Tu casa o la dirección que prefieras.'],
    ['ph-storefront', 'Punto de recogida', `Un punto seguro cerca de ti. ${d('Aquí si admite pago al recibir.')}`],
    ['ph-lock-key', 'Casillero automático', `Lo recoges cuando quieras con un código. ${d('Aquí si admite pago al recibir.')}`],
  ];
  return {
    path: 'envios/',
    title: 'Envíos y plazos de entrega en Europa',
    desc: `Entrega con seguimiento en ${SHIPPING.days} a toda la UE y a Reino Unido, Suiza, Noruega e Islandia. Envío discreto y gratis a partir de ${SHIPPING.freeFrom} €.`,
    trail: [{ label: 'Envíos' }],
    lnav: (r) => ({ title: 'Envíos', links: [['#donde', 'Dónde lo recibes'], ['#discreto', 'Embalaje'], ['#paises', 'Países y plazos'], ['#costes', 'Costes']], cta: { href: r('productos/'), label: 'Comprar' } }),
    main: (r) => `
${hero({ kicker: 'Envíos', title: 'Lo recibes en casa. <span class="soft">Y lo pagas allí.</span>', lede: `Entrega con seguimiento en ${SHIPPING.days} a cualquier destino de Europa, gratis a partir de ${money(SHIPPING.freeFrom)}.`, center: true })}
    <section class="sec sec--top0" aria-label="Envío en cifras">
      <div class="wrap">
        <ul class="stats reveal">
          <li><span class="stats__pre">Entrega en</span><b class="stats__num">3–7 días</b><span class="stats__post">laborables, con seguimiento</span></li>
          <li><span class="stats__pre">Envío gratis desde</span><b class="stats__num">${money(SHIPPING.freeFrom)}</b><span class="stats__post">en cualquier destino</span></li>
          <li><span class="stats__pre">Países a los que enviamos</span><b class="stats__num">${COUNTRIES.length}</b><span class="stats__post">${eu.length} de la UE y ${out.length} fuera de ella</span></li>
        </ul>
      </div>
    </section>

    <section class="sec sec--mist" id="donde" aria-labelledby="where-title">
      <div class="wrap wrap--wide">
        ${sechead({ title: 'Dónde lo recibes.', id: 'where-title', lede: 'Lo eliges al hacer el pedido.' })}
        <ul class="pcards pcards--three">${where.map(([icon, t, s]) => `
          <li class="pcard reveal"><i class="ph-light ${icon}" aria-hidden="true"></i><h3 class="pcard__title">${t}</h3><p class="pcard__text">${s}</p></li>`).join('')}
        </ul>
      </div>
    </section>

    <section class="sec" id="discreto" aria-labelledby="pack-title">
      <div class="wrap wrap--wide ed2">
        <figure class="ed2__media reveal"><img src="${r('assets/caja-discreta.webp')}" width="1264" height="848" alt="Caja de cartón cerrada con cinta de papel, sin ninguna marca" loading="lazy" decoding="async"></figure>
        <div class="ed2__text reveal">
          <p class="kicker">Embalaje</p>
          <h2 class="sec__title" id="pack-title">Envío discreto.</h2>
          <p class="sec__lede">Embalaje exterior de cartón crudo neutro, <strong>sin distintivos, marcas ni alusiones al contenido</strong>.</p>
          ${kv([
            ['Remitente', d('Aquí qué nombre aparece como remitente')],
            ['Seguimiento', d('Aquí cuándo y cómo llega el número de seguimiento')],
            ['Si no estás en casa', d('Aquí cuántos intentos hace el transportista y cómo reprogramar')],
            ['Transportista', d('Aquí el transportista de cada zona')],
          ])}
        </div>
      </div>
    </section>

    <section class="sec sec--mist" id="paises" aria-labelledby="countries-title">
      <div class="wrap wrap--wide">
        ${sechead({ title: 'Plazos por país.', id: 'countries-title', lede: 'Desde nuestro almacén en la UE, sin importación desde terceros países. Fuera de la UE el envío puede pasar aduana.' })}
        <div class="duo duo--top">
          ${table('Unión Europea', eu, 'No')}
          <div class="stack">
            ${table('Fuera de la UE', out, 'Puede aplicarse')}
            <div class="costs reveal" id="costes">
              <h3 class="costs__h">Costes</h3>
              ${kv([
                [`Pedidos desde ${money(SHIPPING.freeFrom)}`, 'Gratis'],
                [`Pedidos de menos de ${money(SHIPPING.freeFrom)}`, d('Aquí el coste')],
                ['Tasa por pagar al recibir', d('Aquí si hay tasa o no')],
                ['Impuestos fuera de la UE', d('Aquí quién los paga')],
              ])}
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="sec" aria-label="Siguiente paso">
      <div class="wrap">
        ${tiles([
          { href: r('#pedido'), icon: 'ph-hand-coins', title: 'Pagas al recibirlo', text: 'Nada por adelantado: pagas al transportista.', label: 'Cómo funciona' },
          { href: r('devoluciones/'), icon: 'ph-arrow-u-up-left', title: '14 días para desistir', text: 'También si pagaste al recibir.', label: 'Devoluciones' },
          { href: r('productos/'), icon: 'ph-handbag', title: 'Las 4 fórmulas', text: 'Con su precio con IVA incluido.', label: 'Ir a la tienda' },
        ])}
      </div>
    </section>`,
  };
}

/* ---------- Devoluciones ---------- */

function returnsPage() {
  const steps = [
    ['ph-chat-circle', 'Avísanos', d('Aquí cómo comunicar que desistes: email, formulario o modelo descargable.')],
    ['ph-package', 'Prepara el paquete', d('Aquí cómo embalar la devolución y qué incluir.')],
    ['ph-truck', 'Envíalo', d('Aquí la dirección de devolución, el transportista y quién paga el envío.')],
    ['ph-hand-coins', 'Recibe el reembolso', d('Aquí el plazo y el método del reembolso si pagaste al recibir.')],
  ];
  return {
    path: 'devoluciones/',
    title: 'Devoluciones y desistimiento en 14 días',
    desc: 'Tienes 14 días para desistir de una compra a distancia, también si pagaste al recibir. Cómo hacerlo, paso a paso, y sus excepciones.',
    trail: [{ label: 'Devoluciones' }],
    lnav: (r) => ({ title: 'Devoluciones', links: [['#pasos', 'Paso a paso'], ['#excepciones', 'Excepciones'], ['#modelo', 'Modelo'], ['#ayuda', 'Ayuda']], cta: { href: r('contacto/'), label: 'Escríbenos' } }),
    main: (r) => `
${hero({
  kicker: 'Devoluciones',
  title: 'Tienes 14 días. <span class="soft">Sin dar explicaciones.</span>',
  lede: 'Puedes desistir de una compra a distancia durante 14 días naturales desde que recibes el pedido, también si pagaste al recibirlo.',
  media: `<figure class="pmedia pmedia--wide"><!-- IMAGEN · devolucion (ver PROMPTS-IMAGENES.md) --><img src="${r('assets/devolucion.webp')}" width="1264" height="848" alt="Unas manos cierran con cinta una caja de cartón sin marcas" fetchpriority="high"></figure>`,
})}
    <section class="sec sec--mist sec--tight" aria-label="Lo esencial">
      <div class="wrap">
        <ul class="stats stats--center reveal">
          <li><span class="stats__pre">Plazo</span><b class="stats__num">14 días</b><span class="stats__post">naturales desde la entrega</span></li>
          <li><span class="stats__pre">Motivo</span><b class="stats__num">Ninguno</b><span class="stats__post">no tienes que explicar por qué</span></li>
          <li><span class="stats__pre">Pago al recibir</span><b class="stats__num">También</b><span class="stats__post">se puede desistir</span></li>
        </ul>
      </div>
    </section>

    <section class="sec" id="pasos" aria-labelledby="steps-title">
      <div class="wrap wrap--wide">
        ${sechead({ title: 'Cómo devolverlo, paso a paso.', id: 'steps-title', center: true })}
        <ol class="pcards">${steps.map(([icon, t, s], i) => `
          <li class="pcard reveal"><i class="ph-light ${icon}" aria-hidden="true"></i><p class="pcard__k">Paso ${i + 1}</p><h3 class="pcard__title">${t}</h3><p class="pcard__text">${s}</p></li>`).join('')}
        </ol>
      </div>
    </section>

    <div class="sec sec--top0">
      <div class="wrap specs">
        ${specRow('excepciones', 'Excepciones', `
              <p>${d('Aquí las excepciones: por ejemplo, productos precintados por motivos de salud o higiene que se hayan abierto después de la entrega.')}</p>
              <h3>Si llega dañado o incompleto</h3>
              <p>${d('Aquí qué hacer: plazo para avisar, fotos que pedimos y cómo se repone.')}</p>`)}
        ${specRow('modelo', 'Modelo de desistimiento', `
              <p>Puedes usar el modelo de formulario o comunicarlo con cualquier declaración clara.</p>
              <p class="spec__file"><i class="ph-light ph-file-pdf" aria-hidden="true"></i>${d('Aquí el modelo en PDF')}</p>
              ${more(r('terminos/'), 'Términos de venta')}`)}
      </div>
    </div>

    <section class="sec sec--mist" id="ayuda" aria-label="Ayuda">
      <div class="wrap wrap--wide">
        ${banner({ k: 'Ayuda', title: '¿Quieres devolver un pedido?', text: 'Escríbenos con tu número de pedido y te indicamos los pasos.', href: r('contacto/'), label: 'Escríbenos', img: `<img src="${r('assets/entrega-manos-700.webp')}" width="700" height="470" alt="" loading="lazy" decoding="async">` })}
      </div>
    </section>`,
  };
}

/* ---------- Contacto ---------- */

function contactPage() {
  const channels = [
    ['ph-envelope-simple', 'Email', d('Aquí el email de atención')],
    ['ph-phone', 'Teléfono / WhatsApp', d('Aquí el teléfono')],
    ['ph-clock', 'Horario', d('Aquí el horario de atención')],
    ['ph-buildings', 'Dirección', d('Aquí la dirección de la empresa')],
  ];
  const field = (label, name, attrs = '') => `
              <div class="field">
                <input id="ct-${name}" name="${name}" placeholder=" " ${attrs}>
                <label for="ct-${name}">${label}</label>
                <p class="field__err" id="ct-${name}-err" hidden></p>
              </div>`;
  return {
    path: 'contacto/',
    title: 'Contacto',
    desc: 'Escríbenos sobre tu pedido, un producto, una guía o una corrección. Te respondemos en español y en inglés.',
    trail: [{ label: 'Contacto' }],
    lnav: (r) => ({ title: 'Contacto', links: [['#escribenos', 'Escríbenos'], ['#canales', 'Otros canales']], cta: { href: r('preguntas-frecuentes/'), label: 'Preguntas' } }),
    main: (r) => `
${hero({ title: 'Contacto.', lede: 'Sobre tu pedido, un producto, una guía o una corrección. Te respondemos en español y en inglés.', center: true })}
    <section class="sec sec--top0" aria-label="Formulario y canales">
      <div class="wrap wrap--wide contact">
        <form class="contact__form reveal" id="escribenos" data-contact novalidate aria-labelledby="ct-title">
          <h2 class="contact__h" id="ct-title">Escríbenos.</h2>
          <div class="co__row">
            ${field('Nombre', 'name', 'autocomplete="name" required aria-describedby="ct-name-err"')}
            ${field('Email', 'email', 'type="email" autocomplete="email" required aria-describedby="ct-email-err"')}
          </div>
          <div class="co__row">
            ${field('Nº de pedido (opcional)', 'order', 'spellcheck="false"')}
            <div class="field field--select">
              <select id="ct-topic" name="topic"><option>Mi pedido</option><option>Un producto</option><option>Una guía o un estudio</option><option>Una corrección</option><option>Devoluciones</option><option>Otro</option></select>
              <label for="ct-topic">Motivo</label>
              <i class="ph ph-caret-down" aria-hidden="true"></i>
            </div>
          </div>
          <div class="field field--area">
            <textarea id="ct-msg" name="message" rows="6" required placeholder=" " aria-describedby="ct-msg-err"></textarea>
            <label for="ct-msg">Mensaje</label>
            <p class="field__err" id="ct-msg-err" hidden></p>
          </div>
          <label class="check"><input type="checkbox" name="consent" required><span>${d('Aquí el texto de consentimiento')} <a href="${r('privacidad/')}">Política de privacidad</a></span></label>
          <p class="field__err" data-checks-err hidden>Marca la casilla para continuar.</p>
          <button class="btn btn--buy" type="submit">Enviar mensaje</button>
          <p class="co__msg" data-contact-msg role="status"></p>
        </form>

        <aside class="contact__aside reveal" id="canales" aria-label="Otros canales">
          <ul class="channels">${channels.map(([icon, t, s]) => `
            <li><i class="ph-light ${icon}" aria-hidden="true"></i><div><p class="channels__k">${t}</p><p class="channels__v">${s}</p></div></li>`).join('')}
          </ul>
          <a class="end end--row" href="${r('preguntas-frecuentes/')}">
            <i class="ph-light ph-lightning" aria-hidden="true"></i>
            <span class="end__title">¿Prisa? Quizá ya está respondida.</span>
            <span class="more">Preguntas frecuentes</span>
          </a>
        </aside>
      </div>
    </section>`,
  };
}

/* ---------- Legales ---------- */

function legalPage(L) {
  const list = L.parts.map((t, i) => [`l${i + 1}`, t]);
  return {
    path: `${L.slug}/`,
    title: L.plain,
    desc: L.desc,
    trail: [{ label: L.plain }],
    bodyClass: 'is-legal',
    main: (r) => `
    <article class="legal" aria-labelledby="page-title">
      <header class="legal__head wrap wrap--text">
        <p class="art__k">Legal</p>
        <h1 class="art__title" id="page-title">${L.plain}.</h1>
        <p class="art__lede">${d('Aquí el texto legal redactado por tu asesor. Esta página solo marca los apartados.')}</p>
        <p class="legal__date">Última actualización: ${d('fecha')}</p>
      </header>
      <div class="wrap wrap--text legal__body">
        <nav class="toc" aria-label="En esta página">
          <p class="toc__h">En esta página</p>
          <ol>${list.map(([id, t]) => `<li><a href="#${id}">${t}</a></li>`).join('')}</ol>
        </nav>${list.map(([id, t]) => `
        <section class="art__sec" id="${id}" aria-labelledby="${id}-t">
          <h2 id="${id}-t">${t}</h2>
          <p>${d('Aquí el texto de este apartado.')}</p>${L.storage && id === 'l2' ? `
          <p>Este sitio no usa cookies de terceros ni de analítica. Usa el almacenamiento local del navegador para que funcione la tienda:</p>
          <div class="table-wrap">
            <table class="table">
              <caption class="sr-only">Almacenamiento que usa este sitio</caption>
              <thead><tr><th scope="col">Nombre</th><th scope="col">Para qué sirve</th><th scope="col">Tipo</th><th scope="col">Duración</th></tr></thead>
              <tbody>
                <tr><th scope="row"><code>lab-cart</code></th><td>Guarda los productos de tu pedido</td><td>Técnico</td><td>Hasta que lo vacías o finalizas el pedido</td></tr>
                <tr><th scope="row"><code>lab-orders</code></th><td>Guarda tus pedidos para que puedas consultarlos</td><td>Técnico</td><td>${d('Aquí cuánto tiempo se conservan')}</td></tr>
              </tbody>
            </table>
          </div>` : ''}
        </section>`).join('')}
      </div>
    </article>`,
  };
}

export const infoPages = [
  guidesHub(),
  ...GUIDES.map(guidePage),
  ...PROFILES.map(profilePage),
  evidencePage(),
  faqPage(),
  shippingPage(),
  returnsPage(),
  contactPage(),
  ...LEGAL.map(legalPage),
];
