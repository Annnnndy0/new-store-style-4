# Prompts de imágenes · Style 4

Para generar con **Gemini / Nano Banana** las fotos que faltan o que conviene sustituir. Todas siguen el mismo estilo que el resto del sitio (fotografía de producto como la de Apple: fondo blanco o gris muy claro, luz suave, mucho aire, sin textos).

Los prompts van en inglés porque los modelos de imagen responden mejor así; debajo de cada uno tienes en español qué es y dónde va.

## Cómo usarlas

1. Genera la imagen (horizontal 3:2 salvo que se indique otra cosa; mínimo 1264 px de ancho).
2. Conviértela a WebP (o guárdala en PNG/JPG y cambia la extensión en el código).
3. Guárdala en `style 4/assets/` **con el mismo nombre** que se indica: la página la recoge sola.
4. Si cambias imágenes de producto, ejecuta `node build.mjs` para regenerar las subpáginas.

> **Truco para Nano Banana:** en las fotos de tus productos, **adjunta una foto real del envase** y empieza el prompt con «Use the attached photo as the exact product. Keep its shape, colours and printed design unchanged.» Así no inventa otra caja.

### Estilo común (añádelo al final de cualquier prompt si quieres reforzarlo)

```
Apple-style product photography, seamless white (#ffffff) or very light grey (#f5f5f7) background, soft diffused studio light, subtle natural contact shadow, generous negative space, minimal, premium, photorealistic, sharp detail. No text, no logos, no watermarks.
```

---

## 1. Fotos de tus 4 productos (las más importantes)

Ahora las 4 fichas usan la misma foto de prueba del blíster. Haz una por producto.

### `producto-1.webp` … `producto-4.webp` · envase recortado
Dónde: tarjetas de producto, tabla comparativa, ficha (foto principal), carrito y carrusel del index. Formato vertical 9:16, **fondo transparente** (PNG) o blanco puro.

```
Use the attached photo as the exact product. Keep its shape, colours and printed design unchanged. Studio packshot of the product standing upright, slightly turned three-quarters to the left, centred, isolated on a pure white background (or transparent), soft diffused light from the top left, very subtle contact shadow, crisp edges, Apple-style product photography, vertical 9:16, no extra text, no props.
```

Después, en `_src/data.mjs` cambia `img: 'assets/producto-1.webp'` por el archivo de cada producto (y lo mismo en `index.html`, buscando `producto-1.webp`).

### `producto-N-mano.webp` · el producto en la mano
Dónde: ficha de producto, miniatura «En la mano» (sustituye a `hero-mano-800.webp`). Horizontal 2:1.

```
Use the attached photo as the exact product. Keep its shape, colours and printed design unchanged. A single elegant hand enters from the bottom right and holds the product, shown large in the centre of the frame, on a pure seamless white background. Soft diffused studio light, subtle natural shadow, lots of white space, Apple-style launch photograph, photorealistic, wide 2:1.
```

### `producto-N-etiqueta.webp` · etiqueta en detalle
Dónde: ficha de producto (galería). Cuadrada 1:1.

```
Use the attached photo as the exact product. Keep its printed design unchanged. Macro close-up of the product label, slightly angled, shallow depth of field so only the central part of the label is sharp, on a very light grey background (#f5f5f7), soft diffused light, Apple-style detail shot, square 1:1.
```

### `producto-N-prospecto.webp` · prospecto real
Dónde: ficha de producto, miniatura «Prospecto» (ahora es un hueco vacío). Horizontal 3:2.

```
Use the attached photo of the leaflet as the exact document. A folded patient information leaflet, partially unfolded in accordion folds, lying at a slight angle next to its box, on a seamless very light grey background (#f5f5f7), soft top light, subtle contact shadow, calm and trustworthy, Apple-style product photography, 3:2.
```

Para añadir las fotos de la galería: en `_src/pages-shop.mjs`, en `shots`, cambia `src` de cada miniatura (o quita `empty` en la del prospecto y pon su `src`).

---

## 2. Imagen para compartir en redes

### `og-imagen.jpg` · 1200 × 630
Dónde: la vista previa cuando alguien comparte el enlace (WhatsApp, Facebook, LinkedIn…). Ahora es un recorte de la portada.

```
Use the attached photo as the exact product. Wide banner composition 1200x630: the product on the right third, slightly tilted, on a pure white background, soft studio light, lots of clean white space on the left for a headline (leave it empty, no text), Apple-style product photography.
```

---

## 3. Perfiles 4, 5 y 6 (cuando estén definidos)

Ahora reutilizan imágenes de las guías. Mantén el estilo de los perfiles 1–3: escultura blanca de porcelana, como un objeto de museo. Cuadradas 1:1.

### `aud-perfil-4.webp` (cambia `img` en `_src/data.mjs` → PROFILES)
```
A white porcelain sculpture representing [describe the profile, e.g. "a runner in motion"], smooth matte surface, displayed like a museum object on a very light grey background (#f5f5f7), soft diffused light, subtle shadow, minimal, calm, Apple-style still life, square 1:1. No text.
```
Repite con `aud-perfil-5.webp` y `aud-perfil-6.webp`, cambiando la descripción del perfil.

---

## 4. Opcionales para mejorar páginas

### `contacto.webp` · cabecera de Contacto (hoy sin imagen)
```
A modern smartphone lying on a seamless very light grey surface (#f5f5f7) next to a small plain kraft parcel, the phone screen turned off, soft diffused daylight, subtle shadows, minimal and friendly, Apple-style product photography, 3:2. No text, no logos.
```

### `cuenta.webp` · «Consultar mi pedido» (hoy sin imagen)
```
A small plain kraft cardboard parcel with a blank white shipping label (no text) on a seamless white background, seen from a three-quarter angle, soft studio light, subtle contact shadow, Apple-style product photography, 3:2.
```

### `revision.webp` · «Cómo revisamos la información»
```
Close-up of a health professional's hands (white coat sleeve visible) reviewing a printed document with a pen on a clean white desk, no readable text, no faces, soft daylight, calm and trustworthy, shallow depth of field, Apple-style editorial photograph, 3:2.
```

---

## 5. Imágenes ya generadas con IA (por si quieres variantes)

Están en `referencias-ia/` (originales PNG) y en `assets/` (WebP). Se hicieron con estos prompts:

| Archivo | Dónde | Prompt |
|---|---|---|
| `hero-mano` | Portada del index | Apple-style product launch photograph on a pure seamless white background. A single elegant human hand enters from the bottom right and holds a premium silver aluminium pharmaceutical blister pack of 10 round white tablets, tilted slightly, shown large in the centre. Soft diffused studio lighting, crisp detail on the embossed foil, very subtle natural contact shadow, lots of clean white negative space, minimal, high-end, photorealistic, no text, no logo. |
| `entrega-manos` | Carrusel «Pagas al recibirlo», banner de Devoluciones | Apple-style minimal product photograph on a seamless very light grey background (#f5f5f7). Close-up of two hands meeting in the centre: one hand passes a small plain unbranded kraft cardboard parcel to the other hand, a calm, trustworthy home-delivery moment. Soft diffused daylight, shallow depth of field, lots of negative space. No text, no logos, no faces. |
| `caja-discreta` | Carrusel «Envío discreto», Envíos | Apple-style studio product photograph on a seamless very light grey background. A small plain unbranded kraft cardboard shipping box, closed and sealed with brown paper tape, at a slight three-quarter angle. No printing, no logos. Soft top light, subtle contact shadow. |
| `laboratorio` | Carrusel «Información con sus fuentes», Estudios | Apple-style editorial photograph of a clean modern pharmaceutical laboratory bench, all white and light grey. A hand in a white nitrile glove holds a small clear glass vial up to soft light; beakers and a printed scientific paper softly out of focus. No readable text, no faces. |
| `comprimidos` | Guía «¿Qué es [producto]?» | Apple-style macro product photograph on a pure seamless white background. A few round white biconvex tablets and one opened silver aluminium blister strip, low three-quarter angle, subtle reflection, generous white space on the left. No text. |
| `prospecto` | Cabecera de Guías | Apple-style minimal studio photograph on a seamless very light grey background. A folded white pharmaceutical patient information leaflet, partially unfolded in accordion folds, tiny unreadable grey text lines. No readable text, no logos. |
| `devolucion` | Cabecera de Devoluciones | Apple-style minimal product photograph on a seamless very light grey background. Two hands sealing a small plain unbranded kraft cardboard box with brown paper tape, ready to be returned by post. No text, no logos, no faces. |
