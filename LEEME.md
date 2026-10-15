# Brand · propuesta «Style 4»

Rediseño completo de lab-lab (la página principal y sus 31 subpáginas) con el estilo de la página del iPhone Duo de Apple (ver `DESIGN.md`). Mismo contenido y mismos enlaces que lab-lab; cambia cómo se presenta y cómo se ordena: galería blanca, producto protagonista, tipografía grande y compacta, bandas gris claro con tarjetas blancas y el azul solo para comprar.

Publicado en **https://annnnndy0.github.io/new-store-style-4/** (repositorio `Annnnndy0/new-store-style-4`).

## Ver en local

```bash
python -m http.server 5186 --directory "C:/new store/style 4"
```

También está en `.claude/launch.json` como `style-4` (puerto 5186).

| Archivo | Qué es |
|---|---|
| `index.html` | La página principal (a mano). Todo el texto está en el HTML (SEO) y se lee también sin JavaScript. Su barra global y su pie los reescribe `build.mjs` entre las marcas `<!-- barra:… -->` y `<!-- pie:… -->`. |
| `build.mjs` + `_src/` | Generador de las 31 subpáginas (ver «Subpáginas»). |
| `estilos.css` | Colores, tipografía (SF Pro en Apple, Inter en el resto), secciones y móvil. Lo usan todas las páginas. |
| `paginas.css` | Piezas propias de las subpáginas: ficha de producto, carrito, checkout, artículos, formularios… |
| `interfaz.js` | Común a todas: barra con paneles, menú móvil, carrito desplegable, barra de secciones, carrusel, comparador, «Ayúdame a elegir», preguntas, pie y apariciones. Sin librerías. |
| `tienda.js` | Subpáginas: galería y cantidad de la ficha, página del carrito, checkout, pedido confirmado, consulta del pedido, contacto, filtros y buscadores. |
| `catalog.js`, `sitemap.xml`, `robots.txt` | Los genera `build.mjs`. |
| `PROMPTS-IMAGENES.md` | Prompts para generar con Gemini / Nano Banana las fotos que faltan (sobre todo las de tus 4 productos). |
| `assets/` | Imágenes en WebP (las de IA y las reutilizadas de lab-lab) y `og-imagen.jpg` para compartir. |
| `referencias-ia/` | Originales PNG de las imágenes generadas con IA. |
| `DESIGN.md` | Resumen del sistema de diseño de la referencia. |

Iconos: Phosphor (unpkg). Fuente: Inter (Google Fonts).

## Orden de la página

Pensado para que cualquiera encuentre rápido lo que busca: primero qué es y por qué fiarse, luego los productos, y después la información para decidir.

| # | Sección | Fondo | Patrón de la referencia |
|---|---|---|---|
| — | Barra global (Tienda · Aprende · Ayuda · Mi pedido · Carrito) | translúcido | Barra de 44 px con paneles grandes |
| — | Cinta «No pagas nada por adelantado» | gris | Cinta «Save time at pre-order» |
| — | Barra de secciones fija con «Comprar» | translúcido | Barra local que flota con 20 px |
| 01 | Portada: titular, texto, botones, foto en mano y cápsula de precio | blanco | Portada «Hello, hello» |
| 02 | Garantías: pago al recibir, envío discreto, 14 días, fuentes | blanco | Iconos de ventajas |
| 03 | Cuatro fórmulas (foto, texto, precio, añadir) | gris | Tarjetas blancas en banda gris |
| 04 | ¿Cuál es la tuya? (tabla) + Ayúdame a elegir | blanco | Comparador de modelos |
| 05 | Compra con tranquilidad (carrusel de 5 tarjetas) | gris | «Get the highlights» |
| 06 | Pide hoy. Paga al recibirlo (4 pasos) + Enviamos a tu país | blanco | Bloque editorial + cifras grandes |
| 07 | Guías (texto SEO + 6 tarjetas con respuesta rápida) | gris | Tarjetas con botón + |
| 08 | A quién va dirigido: carrusel de 7 perfiles (Artistas con vídeo, Estudiantes y académicos, Atletas, Ingenieros, Gamers y diseñadores, Doctores, Cualquier persona que requiera concentración) | blanco | «Set to stunning.»: tarjetas de foto grandes, frase debajo y flechas abajo a la derecha |
| 09 | Estudios + Cómo revisamos la información | gris | Bloque editorial con imagen que entra por el lado |
| 10 | Preguntas frecuentes | blanco | Acordeón con + |
| 11 | Empieza cuando quieras (3 accesos) | gris | «Ways to buy» |
| — | Pie con notas y directorio | gris | Directorio de Apple |

## Imágenes

Generadas con IA en Figma (archivo «New store · imágenes de laboratorio»), con fondos blancos o gris claro como las fotos de producto de Apple:

| Archivo | Dónde |
|---|---|
| `hero-mano.webp` (+ `-800`) | Portada. Fondo pasado a blanco puro y recortado arriba. |
| `entrega-manos.webp` | Carrusel: «Pagas al recibirlo» |
| `caja-discreta.webp` | Carrusel: «Envío discreto» |
| `laboratorio.webp` | Carrusel: «Información con sus fuentes» |
| `comprimidos.webp` | Guía «¿Qué es [producto]?» |

Reutilizadas de lab-lab: `producto-1.webp` (la foto de prueba del blíster, en los 4 productos), las guías (`read-*`), el cerebro (`brain.webp`) y los objetos de los pasos (`order-*`).

Para poner la foto real de cada producto, cambia el `src` de su imagen en `index.html` (tarjetas de «Cuatro fórmulas», cabecera de la tabla y carrusel) o sustituye `assets/producto-1.webp`. Mejor con fondo transparente.

## SEO incluido

- Un solo H1 con la palabra clave y el lema; H2 por sección y H3 por elemento.
- `title`, `description`, `canonical`, `robots`, Open Graph (con `og-imagen.jpg` de 1200×630) y Twitter.
- Datos estructurados: organización, web, página, los 4 productos con su precio y las preguntas frecuentes que ya tienen respuesta.
- Texto editorial con las búsquedas principales en negrita (qué es, para qué se usa, cómo se toma, efectos, quién no debería usarlo), respuestas directas de 60–120 palabras en el HTML de cada guía, enlaces internos con texto descriptivo y textos alternativos en las imágenes.
- «Cómo revisamos la información» (quién escribe, quién revisa, fuentes y fecha): en temas de salud Google lo tiene muy en cuenta.
- Rendimiento: imágenes WebP con `width`/`height`, `srcset`, carga diferida y la de portada precargada.
- Pendiente: cambiar `example.com` por tu dominio; activar los `hreflang` del `<head>` cuando exista la versión en inglés; confirmar `availability` de los productos en los datos estructurados.

## Texto de muestra

Lo subrayado con puntos (clase `.draft`) hay que sustituirlo, igual que en lab-lab: fichas, estudios, revisores, certificaciones, coste del envío y razón social. «[producto]» es la palabra clave y «Brand» la marca. Precios y plazos (3–7 días, gratis desde 150 €) son los de lab-lab.

## Qué no hace todavía

- El carrito y los pedidos se guardan solo en el navegador (`lab-cart` y `lab-orders`, como en lab-lab) y no se envían a ningún servidor. De cada pedido se guardan el email, el nombre, la ciudad, el país y los productos; nunca el teléfono ni la dirección.
- El formulario de contacto muestra un mensaje, pero no envía nada.
- La versión en inglés todavía no existe.
- «Ayúdame a elegir» usa una regla provisional (en `interfaz.js`): el formato N recomienda el Producto N; si no hay formato, decide el presupuesto (≤30 € → 1, ≤50 € → 3, más → 4); si tampoco, la frecuencia.
- «Europa · Español» del pie es solo texto hasta que haya versión en inglés.

## Subpáginas

Se generan con:

```bash
node build.mjs
```

Escribe las 31 subpáginas, `catalog.js`, `sitemap.xml` y `robots.txt`, copia la barra global y el pie al index y avisa si hay enlaces internos rotos. Las carpetas generadas (`productos/`, `guias/`…) no se editan a mano.

| Qué | Dónde |
|---|---|
| Productos, precios, envío, guías, perfiles, estudios, países, preguntas, legales | `_src/data.mjs` (copiado de lab-lab y adaptado a estas imágenes) |
| `<head>`, barra global, barra de la página, pie con migas, tarjetas comunes | `_src/layout.mjs` |
| Tienda, fichas, carrito, checkout, confirmación, consultar pedido | `_src/pages-shop.mjs` |
| Guías, perfiles, estudios, preguntas, envíos, devoluciones, contacto, legales | `_src/pages-info.mjs` |

| Página | Patrón de la referencia |
|---|---|
| `productos/` | Cabecera «Tienda.» con la segunda parte en gris, tarjetas de las 4 fórmulas, comparador y «La diferencia de comprar en Brand» |
| `productos/producto-N/` | Página de compra de Apple: galería fija a la izquierda, compra a la derecha (cantidad, «Añadir al carrito», «Comprar ahora», caja de entrega), cifras grandes y la información en filas como las especificaciones técnicas; barra de compra fija en el móvil |
| `carrito/` | «Revisa tu carrito.»: líneas con cantidad y «Eliminar», medidor de envío gratis y total |
| `checkout/` | Barra mínima con candado, campos con la etiqueta dentro, opciones en tarjetas y resumen fijo (en móvil, plegado en una línea con el total) |
| `pedido-confirmado/`, `cuenta/` | Confirmación con los siguientes pasos y consulta del pedido con su estado |
| `guias/` y las 6 guías | Artículos tipo Apple Newsroom: titular, autoría y revisión, foto grande, «Respuesta rápida», índice, secciones, producto relacionado, preguntas y fuentes |
| `perfiles/…` | Cabecera partida con la imagen, cifras y filas de información |
| `evidencia/` | Bloque editorial con el cerebro, filtros por tema y buscador (`?q=` desde el index ya filtra) |
| `preguntas-frecuentes/` | Buscador grande, temas en tarjetas y acordeones |
| `envios/`, `devoluciones/`, `contacto/`, legales | Cifras grandes, tarjetas de pasos, tablas por país, formulario y textos en columna estrecha |

SEO en las subpáginas: `title` y `description` propios, `canonical`, Open Graph, migas en el pie con sus datos estructurados (`BreadcrumbList`), `Product` en las fichas, `Article` en las guías, `FAQPage` con las respuestas definitivas, `noindex` en carrito, checkout, confirmación y consulta, y `sitemap.xml`.

Las imágenes nuevas de las subpáginas (`prospecto.webp` y `devolucion.webp`) también se generaron con IA en Figma. Las fotos de tus productos solo puedes darlas tú: en `PROMPTS-IMAGENES.md` están los prompts para hacerlas a partir de una foto real del envase.

## Publicar cambios

```bash
git add -A
git commit -m "Describe el cambio"
git push
```

GitHub Pages vuelve a publicar en uno o dos minutos.

## Perfiles (A quién va dirigido)

Fotos y vídeo aportados por ti: `assets/perfil-*.webp` (tarjeta horizontal, versión de 760 px y recorte cuadrado) y `assets/perfil-artistas.webm` / `.mp4` (vídeo sin sonido, 4 s en bucle; solo se reproduce cuando está en pantalla y se puede pausar). Para cambiar uno, sustituye el archivo con el mismo nombre. Las frases de cada tarjeta son texto de muestra: están en `index.html` y en `_src/data.mjs` (`PROFILES`), que también genera sus páginas `perfiles/…`.
