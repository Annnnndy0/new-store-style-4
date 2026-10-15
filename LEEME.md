# Brand · propuesta «Style 4» (página principal)

Rediseño completo del index de lab-lab con el estilo de la página del iPhone Duo de Apple (ver `DESIGN.md`). Mismo contenido y mismos enlaces que lab-lab; cambia cómo se presenta y cómo se ordena: galería blanca, producto protagonista, tipografía grande y compacta, bandas gris claro con tarjetas blancas y el azul solo para comprar.

## Ver en local

```bash
python -m http.server 5186 --directory "C:/new store/style 4"
```

También está en `.claude/launch.json` como `style-4` (puerto 5186).

| Archivo | Qué es |
|---|---|
| `index.html` | La página. Todo el texto está en el HTML (SEO) y se lee también sin JavaScript. |
| `estilos.css` | Colores, tipografía (SF Pro en Apple, Inter en el resto), secciones y móvil. |
| `interfaz.js` | Barra con paneles, menú móvil, carrito, barra de secciones, carrusel, comparador, «Ayúdame a elegir», guías, preguntas, pie y apariciones. Sin librerías. |
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
| 08 | A quién va dirigido (6 perfiles) | blanco | Iconos grandes |
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

Reutilizadas de lab-lab: `producto-1.webp` (la foto de prueba del blíster, en los 4 productos), los perfiles (`aud-*`), las guías (`read-*`), el cerebro (`brain.webp`) y los objetos de los pasos (`order-*`).

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

- Los enlaces llevan a las rutas de las subpáginas de lab-lab (`productos/`, `guias/que-es/`…); en esta carpeta todavía no existen.
- El carrito guarda en el navegador con la misma clave que lab-lab (`lab-cart`) y muestra lo añadido en el desplegable; no hay página de carrito aquí.
- «Ayúdame a elegir» usa una regla provisional (en `interfaz.js`): el formato N recomienda el Producto N; si no hay formato, decide el presupuesto (≤30 € → 1, ≤50 € → 3, más → 4); si tampoco, la frecuencia.
- El buscador de Estudios envía `?q=` a `evidencia/`, que aún no filtra.
- «Europa · Español» del pie es solo texto hasta que haya versión en inglés.
