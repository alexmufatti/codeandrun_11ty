# 🖼️ Featured Images - Guida Import WordPress

## 🔍 Problema Risolto

**Problema originale**: WordPress Importer non riusciva a importare gli attachment delle featured images perché gli URL erano relativi e le immagini non erano ancora sul server.

**Soluzione implementata**:

1. Salvare l'URL della featured image come postmeta `_featured_image_url`
2. Importare il WXR (senza errori di attachment)
3. Caricare manualmente le immagini sul server
4. Eseguire script PHP per creare gli attachment e collegarli ai post

## 📋 Processo di Import Step-by-Step

### Step 1: Importa il file WXR

```bash
1. WordPress Admin → Tools → Import → WordPress
2. Scegli: wordpress-export-fixed.xml
3. Seleziona autore o crea nuovo
4. ⚠️ NON selezionare "Download and import file attachments"
   (tanto non ci sono attachment nel file ora)
5. Click "Submit"
```

✅ **Risultato**:

- 83 posts importati
- 589 activities importate
- Ogni post ha un postmeta `_featured_image_url` con il path dell'immagine

### Step 2: Carica le Immagini

Carica tutte le immagini dalla cartella `wordpress-migration/images/` nella cartella WordPress:

**Via FTP/SFTP**:

```
Locale:  wordpress-migration/images/*
Remoto:  /wp-content/uploads/eleventy-images/
```

**Via SSH**:

```bash
cd /path/to/wordpress-migration
scp -r images/* user@server:/var/www/html/wp-content/uploads/eleventy-images/
```

**Via pannello hosting**:

- Crea cartella: `/wp-content/uploads/eleventy-images/`
- Carica i 1292 file dalla cartella `images/`

### Step 3: Crea gli Attachment

1. **Carica lo script PHP**:

   ```
   Locale:  wordpress-migration/create-featured-images.php
   Remoto:  /var/www/html/create-featured-images.php (root WordPress)
   ```

2. **Esegui lo script**:

   ```
   Vai su: https://tuo-sito.com/create-featured-images.php
   ```

3. **Attendi l'elaborazione**:

   - Lo script processerà tutti i post con `_featured_image_url`
   - Per ogni post:
     - ✅ Copia l'immagine nella libreria media
     - ✅ Crea l'attachment WordPress
     - ✅ Genera thumbnails automatiche
     - ✅ Collega l'attachment al post (`_thumbnail_id`)
     - ✅ Rimuove il postmeta temporaneo `_featured_image_url`

4. **Verifica i risultati**:

   ```
   ✅ Successo: 197
   ❌ Errori: 0
   ⏭️ Saltati: 0
   ```

5. **IMPORTANTE**:
   ```bash
   # Elimina lo script per sicurezza
   rm create-featured-images.php
   ```

### Step 4: Verifica

1. **Nell'editor WordPress**:

   - Apri un post o activity
   - Guarda la colonna destra
   - Dovrebbe esserci "Immagine in evidenza" con l'immagine

2. **Nel tema**:

   ```php
   <?php if ( has_post_thumbnail() ) : ?>
     <?php the_post_thumbnail('large'); ?>
   <?php endif; ?>
   ```

3. **Nella libreria media**:
   - Media → Libreria
   - Dovresti vedere le 197 featured images importate

## 🔧 Troubleshooting

### Errore: "File non trovato"

```
❌ Post #123: File non trovato: /var/www/html/wp-content/uploads/eleventy-images/IMG_XXX.jpg
```

**Soluzione**:

- Verifica che le immagini siano state caricate in `/wp-content/uploads/eleventy-images/`
- Controlla i permessi: `chmod 755 /wp-content/uploads/eleventy-images/`

### Errore: "Errore copia file"

```
❌ Post #123: Errore copia file
```

**Soluzione**:

- Verifica permessi cartella upload: `chmod 755 /wp-content/uploads/`
- Verifica ownership: `chown www-data:www-data /wp-content/uploads/ -R`

### Errore: "Errore creazione attachment"

```
❌ Post #123: Errore creazione attachment
```

**Soluzione**:

- Verifica che la libreria GD o ImageMagick sia installata: `php -m | grep -E 'gd|imagick'`
- Aumenta memory_limit in php.ini: `memory_limit = 256M`

### Script timeout

```
Maximum execution time of 30 seconds exceeded
```

**Soluzione**:

```php
// Aggiungi all'inizio dello script create-featured-images.php
set_time_limit(300); // 5 minuti
ini_set('memory_limit', '256M');
```

## 📊 Struttura Dati

### Nel Database (dopo import WXR)

```sql
wp_postmeta:
- post_id: 123
- meta_key: _featured_image_url
- meta_value: /wp-content/uploads/eleventy-images/IMG_5591_feature.jpg
```

### Nel Database (dopo script PHP)

```sql
wp_posts:
- ID: 10001
- post_type: attachment
- guid: https://sito.com/wp-content/uploads/2025/10/IMG_5591_feature.jpg

wp_postmeta:
- post_id: 123
- meta_key: _thumbnail_id
- meta_value: 10001

(il postmeta _featured_image_url viene rimosso)
```

## 🎨 Utilizzo nel Tema

### Template Standard

```php
// single.php
if ( has_post_thumbnail() ) {
    the_post_thumbnail( 'large', array(
        'class' => 'featured-image',
        'alt' => get_the_title()
    ));
}
```

### Custom Sizes (definite nel plugin)

```php
// activity-thumbnail (400x300) - per archivi
the_post_thumbnail('activity-thumbnail');

// activity-hero (1200x600) - per header single
the_post_thumbnail('activity-hero');

// activity-card (600x400) - per layout card
the_post_thumbnail('activity-card');
```

### Ottenere URL

```php
$thumb_url = get_the_post_thumbnail_url( get_the_ID(), 'large' );
if ( $thumb_url ) {
    echo '<meta property="og:image" content="' . esc_url($thumb_url) . '">';
}
```

## ✅ Checklist Completa

- [ ] Import WXR in WordPress
- [ ] Verifica che i post siano importati correttamente
- [ ] Carica le immagini in `/wp-content/uploads/eleventy-images/`
- [ ] Carica `create-featured-images.php` nella root WordPress
- [ ] Esegui lo script visitando l'URL
- [ ] Verifica i risultati (197 successi)
- [ ] Controlla un post nell'editor (dovrebbe avere "Immagine in evidenza")
- [ ] Elimina `create-featured-images.php` per sicurezza
- [ ] Personalizza il tema per mostrare le featured images

## 📈 Statistiche Finali

```
✅ 197 featured images da processare
✅ 1292 immagini totali migrate
✅ 0 attachment nel WXR (nessun errore di import)
✅ Script PHP automatico per creare attachment
✅ Featured images WordPress standard
```

## 🆘 Supporto

Se lo script PHP non funziona, puoi collegare manualmente le featured images:

1. Vai su Media → Libreria
2. Carica manualmente le immagini featured
3. Per ogni post:
   - Apri l'editor
   - Clicca "Imposta immagine in evidenza"
   - Seleziona l'immagine corrispondente

Oppure modifica lo script per usare gli URL completi del tuo sito.

---

**Data**: 2 Ottobre 2025
**Versione**: wordpress-export-fixed.xml (senza attachment)
**Script**: create-featured-images.php (automatico post-import)
