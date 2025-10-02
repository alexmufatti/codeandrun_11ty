# Featured Images - WordPress Standard

## ✅ Implementazione Corretta

Le **featured images** sono ora gestite secondo lo standard WordPress:

### 1. Attachment Separati

Ogni featured image viene importata come `attachment` (tipo di post WordPress per i media):

```xml
<item>
  <title>IMG_5591_feature</title>
  <wp:post_id>100000</wp:post_id>
  <wp:post_type><![CDATA[attachment]]></wp:post_type>
  <wp:attachment_url><![CDATA[/wp-content/uploads/eleventy-images/IMG_5591_feature.jpg]]></wp:attachment_url>
</item>
```

### 2. Collegamento tramite \_thumbnail_id

Ogni post ha un postmeta che collega l'attachment:

```xml
<wp:postmeta>
  <wp:meta_key><![CDATA[_thumbnail_id]]></wp:meta_key>
  <wp:meta_value><![CDATA[100000]]></wp:meta_value>
</wp:postmeta>
```

### 3. Contenuto Pulito

Il contenuto del post NON contiene più la featured image inline:

**Prima (sbagliato)**:

```html
<content:encoded
	><![CDATA[ <figure class="wp-block-image size-large is-resized"> <img
	src="..." class="wp-image-featured"/> </figure> <p>Testo del post...</p>
	]]></content:encoded
>
```

**Dopo (corretto)**:

```html
<content:encoded><![CDATA[ <p>Testo del post...</p> ]]></content:encoded>
```

## 🎯 Vantaggi

1. **Home page**: WordPress può mostrare automaticamente la featured image negli archivi
2. **Single post**: Il tema può decidere dove mostrare la featured image (header, sidebar, etc.)
3. **Flessibilità**: Puoi cambiare come viene mostrata senza modificare il contenuto
4. **SEO**: WordPress riconosce correttamente la featured image per Open Graph e meta tags
5. **Mobile**: Il tema responsive può ottimizzare la visualizzazione

## 📊 Statistiche Migrazione

```
✅ 197 featured images importate come attachment
✅ 197 post/activities con _thumbnail_id collegato
✅ Contenuto pulito senza immagini duplicate
```

## 🔧 Utilizzo nel Tema WordPress

### Mostrare la Featured Image

**In archive.php / index.php (home)**:

```php
<?php if ( has_post_thumbnail() ) : ?>
  <div class="post-thumbnail">
    <?php the_post_thumbnail( 'medium' ); ?>
  </div>
<?php endif; ?>
```

**In single.php**:

```php
<?php if ( has_post_thumbnail() ) : ?>
  <div class="post-hero">
    <?php the_post_thumbnail( 'large' ); ?>
  </div>
<?php endif; ?>
```

**Con custom size**:

```php
<?php
if ( has_post_thumbnail() ) {
  the_post_thumbnail( 'post-thumbnail', array(
    'class' => 'featured-image',
    'loading' => 'lazy'
  ));
}
?>
```

### Ottenere URL Immagine

```php
<?php
$thumbnail_url = get_the_post_thumbnail_url( get_the_ID(), 'large' );
if ( $thumbnail_url ) {
  echo '<meta property="og:image" content="' . esc_url( $thumbnail_url ) . '">';
}
?>
```

## 📝 File da Importare

✅ **Usa questo**: `wordpress-migration/wordpress-export-fixed.xml`

## ⚙️ Post Import

Dopo l'import, WordPress:

1. ✅ Creerà gli attachment nella libreria media
2. ✅ Collegherà automaticamente i `_thumbnail_id`
3. ✅ Le featured images saranno visibili in "Immagine in evidenza" nell'editor
4. ✅ Il tema potrà usare `the_post_thumbnail()` per mostrarle

## 🎨 Personalizzazione Tema

Nel plugin **Code and Run Companion**, puoi aggiungere supporto per le featured images:

```php
// In codeandrun-companion.php

add_theme_support( 'post-thumbnails' );

// Custom image sizes per il tema
add_image_size( 'activity-thumb', 400, 300, true );
add_image_size( 'activity-hero', 1200, 600, true );

// Mostra featured image automaticamente negli activity
add_filter( 'the_content', 'add_featured_image_to_activity' );
function add_featured_image_to_activity( $content ) {
  if ( is_singular( 'activity' ) && has_post_thumbnail() ) {
    $image = '<div class="activity-hero">' . get_the_post_thumbnail( null, 'activity-hero' ) . '</div>';
    $content = $image . $content;
  }
  return $content;
}
```

---

**Data**: 2 Ottobre 2025
**Versione**: wordpress-export-fixed.xml con featured images standard
