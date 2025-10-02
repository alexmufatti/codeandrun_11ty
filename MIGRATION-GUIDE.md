# Migrazione da Eleventy a WordPress

Questa guida completa ti aiuterà a migrare il blog "Code and Run" da Eleventy v3 a WordPress, preservando tutti i contenuti, immagini e funzionalità.

## 📋 Panoramica

Il processo di migrazione include:

- ✅ **~80 post tecnici** (2006-2025)
- ✅ **~500+ attività running** (2019-2025)
- ✅ **Immagini** (co-locate con i contenuti)
- ✅ **Metadata** (tags, categorie, custom fields)
- ✅ **Shortcodes** (Strava, YouTube, figure)
- ✅ **Custom Post Type** per le attività running

## 🚀 Fase 1: Eseguire la Migrazione

### Prerequisiti

- Node.js v18 o superiore
- WordPress installato e funzionante
- Accesso amministrativo a WordPress

### 1.1 Eseguire lo Script di Migrazione

```bash
# Dalla root del progetto Eleventy
node migrate-to-wordpress.js
```

Lo script genererà:

```
wordpress-migration/
├── wordpress-export.xml     # File WXR da importare in WordPress
├── images/                   # Tutte le immagini estratte
└── migration-report.json     # Report dettagliato
```

### 1.2 Verificare il Report

Controlla `wordpress-migration/migration-report.json` per:

- Numero di post/attività migrate
- Eventuali errori o warning
- Statistiche sulle immagini

## 🔧 Fase 2: Preparare WordPress

### 2.1 Installare Plugin Necessari

Nel tuo pannello WordPress:

1. **WordPress Importer** (obbligatorio)

   - Vai su: Plugin → Aggiungi nuovo
   - Cerca: "WordPress Importer"
   - Installa e attiva

2. **Code and Run Companion** (obbligatorio - custom plugin)
   - Copia la cartella `wordpress-plugin/` sul tuo server WordPress
   - Rinomina in: `wp-content/plugins/codeandrun-companion/`
   - Attiva dal pannello Plugin

### 2.2 Configurazione Consigliata

**Permalink Settings:**

```
Settings → Permalink
Seleziona: "Post name" (/sample-post/)
```

**Media Settings:**

```
Settings → Media
Abilita: "Organize my uploads into month- and year-based folders"
```

## 📥 Fase 3: Importare i Contenuti

### 3.1 Importare il File WXR

1. Vai su: **Tools → Import → WordPress**
2. Clicca "Run Importer"
3. Upload `wordpress-export.xml`
4. Assegna l'autore (o creane uno nuovo)
5. ✅ Spunta: "Download and import file attachments"
6. Clicca "Submit"

⏱️ **Tempo stimato:** 5-15 minuti (dipende dalla dimensione)

### 3.2 Importare le Immagini

**Opzione A: Upload Manuale** (consigliato per controllo completo)

```bash
# Via FTP/SSH, carica la cartella images/ in:
wp-content/uploads/eleventy-images/
```

Poi aggiorna i riferimenti nel database:

```sql
-- Nel phpMyAdmin o console MySQL
UPDATE wp_posts
SET post_content = REPLACE(post_content, 'src="', 'src="/wp-content/uploads/eleventy-images/')
WHERE post_type IN ('post', 'activity');
```

**Opzione B: Plugin "Add From Server"**

1. Installa plugin "Add From Server"
2. Carica images/ via FTP in `wp-content/uploads/`
3. Usa il plugin per importarle nella libreria media

### 3.3 Verificare l'Importazione

Controlla:

- [ ] Posts visibili in **Posts → All Posts**
- [ ] Activities visibili in **Activities → All Activities**
- [ ] Tags e categorie corrette
- [ ] Immagini visualizzate correttamente

## 🎨 Fase 4: Personalizzazione WordPress

### 4.1 Custom Post Type "Activity"

Il plugin crea automaticamente il post type "Activity" con:

- Menu dedicato nel backend
- Support per: titolo, editor, immagine in evidenza, excerpt
- Custom fields: training_types, training_feelings, places

**Visualizzare i custom fields nel template:**

Modifica `single-activity.php` nel tuo theme:

```php
<?php
$training_types = get_post_meta(get_the_ID(), 'training_types', true);
$training_feelings = get_post_meta(get_the_ID(), 'training_feelings', true);

if ($training_types) {
    echo '<div class="training-types">' . esc_html($training_types) . '</div>';
}
if ($training_feelings) {
    echo '<div class="training-feelings">' . esc_html($training_feelings) . '</div>';
}
?>
```

### 4.2 Shortcodes Disponibili

**Strava Embed:**

```
[strava id="15884483721" embed_id="3b9e3abd3844b89a3f2284c35d69f1b672e51e48"]
```

**YouTube Embed:**

```
[youtube id="VIDEO_ID"]
```

Questi shortcodes sono già presenti nei contenuti importati e funzioneranno automaticamente.

### 4.3 Creare Template Personalizzati

**Per le Activities** - crea `single-activity.php`:

```php
<?php get_header(); ?>

<main class="activity-single">
    <?php while (have_posts()) : the_post(); ?>

        <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
            <header>
                <h1><?php the_title(); ?></h1>
                <div class="activity-meta">
                    <?php
                    $training_types = get_post_meta(get_the_ID(), 'training_types', true);
                    $training_feelings = get_post_meta(get_the_ID(), 'training_feelings', true);
                    ?>

                    <?php if ($training_types): ?>
                        <div class="activity-meta-item">
                            <span class="activity-meta-label">Tipo:</span>
                            <span class="training-types"><?php echo esc_html($training_types); ?></span>
                        </div>
                    <?php endif; ?>

                    <?php if ($training_feelings): ?>
                        <div class="activity-meta-item">
                            <span class="activity-meta-label">Sensazioni:</span>
                            <span class="training-feelings"><?php echo esc_html($training_feelings); ?></span>
                        </div>
                    <?php endif; ?>
                </div>
            </header>

            <div class="entry-content">
                <?php the_content(); ?>
            </div>

            <footer class="entry-footer">
                <?php the_tags('<div class="tags">', ', ', '</div>'); ?>
            </footer>
        </article>

    <?php endwhile; ?>
</main>

<?php get_footer(); ?>
```

**Archivio Activities** - crea `archive-activity.php`:

```php
<?php get_header(); ?>

<main class="activities-archive">
    <header class="page-header">
        <h1>Activities Running</h1>
    </header>

    <?php if (have_posts()) : ?>
        <div class="activities-grid">
            <?php while (have_posts()) : the_post(); ?>
                <article id="post-<?php the_ID(); ?>" <?php post_class('activity-card'); ?>>
                    <?php if (has_post_thumbnail()) : ?>
                        <div class="activity-thumbnail">
                            <a href="<?php the_permalink(); ?>">
                                <?php the_post_thumbnail('medium'); ?>
                            </a>
                        </div>
                    <?php endif; ?>

                    <div class="activity-content">
                        <h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
                        <time datetime="<?php echo get_the_date('c'); ?>"><?php echo get_the_date(); ?></time>
                        <?php the_excerpt(); ?>
                    </div>
                </article>
            <?php endwhile; ?>
        </div>

        <?php the_posts_pagination(); ?>
    <?php endif; ?>
</main>

<?php get_footer(); ?>
```

## 🔍 Fase 5: Ottimizzazione e SEO

### 5.1 Redirect URLs (se cambia la struttura)

Se gli URL cambiano, crea redirect 301. Installa **Redirection** plugin:

```
Post Eleventy: /posts/2006-04-09-ciao-mondo/
Post WordPress: /ciao-mondo/

Activity Eleventy: /activities/2025-09-29-settimana_38-39/
Activity WordPress: /activities/settimana-38-39/
```

### 5.2 Plugin SEO Consigliati

- **Yoast SEO** o **Rank Math**: per meta description, sitemap
- **EWWW Image Optimizer**: ottimizzazione immagini
- **WP Rocket**: caching e performance

### 5.3 Performance

```bash
# Rigenera thumbnail immagini
wp media regenerate --yes

# Flush cache
wp cache flush
```

## 📊 Fase 6: Verifica Finale

### Checklist Post-Migrazione

- [ ] Tutti i post sono visibili
- [ ] Tutte le attività sono visibili
- [ ] Immagini caricate e visualizzate
- [ ] Tags e categorie corrette
- [ ] Shortcodes Strava funzionanti
- [ ] Shortcodes YouTube funzionanti
- [ ] Custom fields activities popolati
- [ ] Permalink funzionanti
- [ ] Feed RSS funzionante
- [ ] Sitemap generata
- [ ] Performance accettabili (Lighthouse > 70)

### Test Specifici

**Test Strava Embed:**

1. Apri un'activity con embed Strava
2. Verifica che lo script si carichi: https://strava-embeds.com/embed.js
3. L'embed dovrebbe apparire dopo 2-3 secondi

**Test Custom Fields:**

```php
// In qualsiasi template
$activities = get_posts(array(
    'post_type' => 'activity',
    'posts_per_page' => 5
));

foreach ($activities as $activity) {
    echo $activity->post_title . ': ';
    echo get_post_meta($activity->ID, 'training_types', true);
    echo "\n";
}
```

## 🛠️ Troubleshooting

### Problema: Immagini non visualizzate

**Soluzione:**

```bash
# Verifica permessi cartella uploads
chmod 755 wp-content/uploads/
chmod 644 wp-content/uploads/eleventy-images/*

# Rigenera miniature
wp media regenerate --yes
```

### Problema: Shortcodes Strava non funzionano

**Verifica:**

1. Plugin "Code and Run Companion" attivo
2. Console browser: script https://strava-embeds.com/embed.js caricato
3. Shortcode sintassi corretta: `[strava id="123"]`

### Problema: Custom Post Type "Activity" non visibile

**Soluzione:**

```php
// Dashboard → Settings → Permalinks → Save Changes
// Questo flush le rewrite rules
```

### Problema: Errori durante l'import WXR

**Soluzioni:**

1. Aumenta limiti PHP:

```ini
; php.ini
upload_max_filesize = 128M
post_max_size = 128M
max_execution_time = 300
memory_limit = 256M
```

2. Dividi il file WXR:

```bash
# Installa WXR splitter
npm install -g wordpress-export-splitter

# Dividi in chunk da 100 post
wordpress-export-splitter wordpress-export.xml 100
```

## 📈 Statistiche Previste

In base al tuo sito:

- **Posts tecnici:** ~80
- **Activities running:** ~500+
- **Immagini totali:** ~1000+
- **Tags unici:** ~50+
- **Tempo migrazione:** 1-2 ore

## 🎓 Risorse Aggiuntive

### Documentazione WordPress

- [WordPress Importer](https://wordpress.org/plugins/wordpress-importer/)
- [WXR Format](https://codex.wordpress.org/Tools_Export_Screen)
- [Custom Post Types](https://developer.wordpress.org/plugins/post-types/)
- [Shortcode API](https://developer.wordpress.org/plugins/shortcodes/)

### Strava Embed

- [Strava Embeds Documentation](https://developers.strava.com/docs/embeds/)

### PHP & WordPress Dev

- [WordPress Developer Handbook](https://developer.wordpress.org/)
- [WordPress Coding Standards](https://developer.wordpress.org/coding-standards/)

## 💡 Suggerimenti Finali

1. **Backup Eleventy**: mantieni il sito Eleventy funzionante durante la migrazione
2. **Test su Staging**: prova la migrazione su un ambiente di test prima
3. **Graduale**: migra prima i post, poi le activities
4. **Monitoraggio**: usa Google Search Console per monitorare eventuali errori 404
5. **Cache**: configura bene il caching per mantenere le performance

## 📞 Supporto

Se incontri problemi:

1. Controlla `migration-report.json` per errori specifici
2. Verifica i log WordPress: `wp-content/debug.log`
3. Console browser per errori JavaScript
4. Forum WordPress: https://it.wordpress.org/support/

---

**Buona migrazione! 🚀**

_Script creato per Code and Run - https://codeandrun.it_
