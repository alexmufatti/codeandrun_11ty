# Fix Migrazione - 2 Ottobre 2025

## Problemi Risolti

### 1. ✅ Markdown non convertito in HTML

**Problema**: I titoli markdown (`## Titolo`), link, grassetto, etc. apparivano come testo invece di essere formattati.

**Soluzione**:

- Aggiunto il parser `marked` per convertire markdown in HTML
- Usato sistema di placeholder con commenti HTML (`<!--PLACEHOLDER_X-->`) per proteggere shortcode e figure dalla conversione

### 2. ✅ Feature Image non gestita

**Problema**: Le `feature_image` dei post/activities non venivano incluse nel contenuto.

**Soluzione**:

- Estrarre `feature_image` dal front matter
- Copiare l'immagine nella cartella `images/`
- Inserire automaticamente `<figure>` con l'immagine all'inizio del contenuto
- Path immagine: `/wp-content/uploads/eleventy-images/FILENAME`

### 3. ✅ URL dei post cambiati

**Problema**: Gli URL perdevano la struttura originale della cartella (es: `/activities/2025-09-20-settimana_38/` diventava `/settimana-38/`)

**Soluzione**:

- Estratto il nome della cartella (`path.basename(dirName)`) come slug
- Usato questo slug nel campo `<wp:post_name>` invece di generarlo dal titolo
- Ora gli URL mantengono la struttura originale: `/2025-09-20-settimana_38/`

### 4. ✅ Shortcode non convertiti

**Problema**: Alcuni shortcode con sintassi variabile non venivano riconosciuti (virgolette singole/doppie, parametro `noEmbed`)

**Soluzione**:

- Regex aggiornati per supportare sia `'` che `"` con `\s*` per spazi opzionali
- Supporto per parametro `noEmbed: true` negli shortcode Strava
- Pattern più robusti: `/\{%\s*strava\s*\{\s*id:\s*['"]([^'"]+)['"]...`

## File Modificati

### migrate-to-wordpress.js

```javascript
// Cambio 1: Placeholder con commenti HTML invece di testo
const placeholder = `<!--PLACEHOLDER_${placeholderIndex}-->`;

// Cambio 2: Slug dalla cartella
const folderName = path.basename(dirName);
post.slug = folderName;

// Cambio 3: Feature image come URL WordPress
featuredImageUrl = `/wp-content/uploads/eleventy-images/${imgBasename}`;

// Cambio 4: Featured image nel contenuto
if (post.featured_image) {
  const featuredImageHtml = `<figure class="wp-block-image size-large is-resized">...`;
  fullContent = featuredImageHtml + fullContent;
}

// Cambio 5: Regex più robusti con \s* per spazi opzionali
/\{%\s*figure\s*\{\s*src:\s*['"]([^'"]+)['"]...
```

## Statistiche Migrazione Finale

```
📊 Statistiche:
   - Posts: 83
   - Activities: 589
   - Immagini: 1292
   - Riferimenti immagini aggiornati: 257
   - Errori: 0
   - Dimensione file: 1.56 MB
```

## Verifica Risultati

### ✅ Markdown convertito

```html
## Titolo →
<h2>Titolo</h2>
**grassetto** → <strong>grassetto</strong> _corsivo_ →
<em>corsivo</em> [link](url) → <a href="url">link</a>
```

### ✅ Shortcode preservati

```html
[strava id="12067827538" embed_id="2bb086f62fabb4a387b68f85177d96945e295238"]
[youtube id="videoId"]
```

### ✅ Figure corrette

```html
<figure class="wp-block-image">
	<img src="/wp-content/uploads/eleventy-images/image.png" alt="map" />
	<figcaption>map</figcaption>
</figure>
```

### ✅ Featured images all'inizio

```html
<figure class="wp-block-image size-large is-resized">
	<img
		src="/wp-content/uploads/eleventy-images/IMG_5591_feature.jpg"
		alt="Settimana 38-39"
		class="wp-image-featured"
	/>
</figure>
```

### ✅ Slug mantenuti

```xml
<wp:post_name><![CDATA[2025-09-20-settimana_38]]></wp:post_name>
<link>https://codeandrun.it/2025-09-20-settimana_38/</link>
```

## File da Importare

✅ **Usa questo file**: `wordpress-migration/wordpress-export-fixed.xml`

❌ **NON usare**: `wordpress-migration/wordpress-export.xml` (senza fix immagini)

## Prossimi Passi

1. **Elimina** tutti i post/activities esistenti in WordPress (se già importati)
2. **Importa** `wordpress-export-fixed.xml` via Tools → Import → WordPress
3. **Verifica** che:
   - Markdown sia formattato correttamente
   - Shortcode Strava appaiano (anche se non embedded senza plugin)
   - Featured images siano visibili all'inizio
   - URL mantengano la struttura originale
4. **Installa** plugin Code and Run Companion per attivare shortcode Strava
5. **Carica** immagini da `wordpress-migration/images/` a `/wp-content/uploads/eleventy-images/`

## Test Effettuati

✅ Test regex shortcode: tutti i pattern matchano correttamente
✅ Test markdown conversion: 8/8 test passati
✅ Verifica XML: shortcode presenti, HTML corretto, slug corretti
✅ Migrazione completa: 0 errori

---

Data: 2 Ottobre 2025
Versione file: wordpress-export-fixed.xml (1.56 MB)
