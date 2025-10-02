# Code and Run Companion Plugin

Plugin WordPress per supportare i contenuti migrati dal blog Eleventy "Code and Run".

## Funzionalità

### 🏃 Custom Post Type: Activity

Registra un custom post type "Activity" per gestire le attività running con:

- Supporto completo editor Gutenberg
- Immagine in evidenza
- Tags e categorie
- Custom fields per dati running
- Archivio dedicato

### 🔄 Merge Posts e Activities (NUOVO!)

**Il plugin mostra automaticamente posts e activities insieme nella home page!**

Quando attivi il plugin, posts tecnici e activities running appariranno mescolati nella pagina principale del blog, ordinati per data (più recenti prima).

Questo vale per:

- ✅ Home page
- ✅ Archivi per data
- ✅ Feed RSS
- ✅ Risultati ricerca

**Per disabilitare questa funzionalità:**

```php
// Nel functions.php del tuo theme
add_filter('codeandrun_merge_post_types', '__return_false');
```

### 🎯 Custom Fields

Ogni Activity può avere:

- **training_types**: Emoji che rappresentano il tipo di allenamento (🟢 facile, 🔴 intenso, 🟡 medio)
- **training_feelings**: Emoji che rappresentano le sensazioni (😀 ottimo, 🙂 buono, 😭 difficile)
- **places**: Lista di luoghi dove si è svolta l'attività

### 📺 Shortcodes

#### Strava Embed

```
[strava id="15884483721" embed_id="3b9e3abd3844b89a3f2284c35d69f1b672e51e48"]
```

Parametri:

- `id`: ID attività Strava (obbligatorio)
- `embed_id`: ID embed Strava (opzionale)

#### YouTube Embed

```
[youtube id="VIDEO_ID"]
```

Parametri:

- `id`: ID video YouTube (obbligatorio)
- `width`: Larghezza (default: 560)
- `height`: Altezza (default: 315)

## Installazione

1. **Via Upload:**

   - Scarica il plugin come ZIP
   - WordPress Admin → Plugin → Aggiungi nuovo → Carica plugin
   - Seleziona il file ZIP e installa

2. **Via FTP/SSH:**

   ```bash
   # Copia la cartella plugin su WordPress
   scp -r codeandrun-companion/ user@server:/var/www/html/wp-content/plugins/

   # O via WP-CLI
   wp plugin install /path/to/codeandrun-companion.zip --activate
   ```

3. **Attivazione:**
   - WordPress Admin → Plugin
   - Trova "Code and Run Companion"
   - Clicca "Attiva"

## Uso

### Creare un'Activity

1. Dashboard → Activities → Aggiungi nuovo
2. Inserisci titolo e contenuto
3. Compila i campi "Training Details":
   - **Training Types**: es. `🟢,🔴,🟢`
   - **Training Feelings**: es. `😭,😀,🙂`
   - **Places**: es. `Barcelona, Park Güell`
4. Aggiungi immagine in evidenza
5. Pubblica

### Visualizzare Activities nel Template

#### Nel Loop

```php
<?php
if (have_posts()) :
    while (have_posts()) : the_post();
        if (get_post_type() == 'activity') {
            // È un'activity
            $training_types = get_post_meta(get_the_ID(), 'training_types', true);
            echo '<div class="training-types">' . esc_html($training_types) . '</div>';
        }
        the_content();
    endwhile;
endif;
?>
```

#### Query Personalizzata

```php
<?php
$activities = new WP_Query(array(
    'post_type' => 'activity',
    'posts_per_page' => 10,
    'orderby' => 'date',
    'order' => 'DESC'
));

if ($activities->have_posts()) :
    while ($activities->have_posts()) : $activities->the_post();
        ?>
        <article class="activity">
            <h2><?php the_title(); ?></h2>
            <time><?php echo get_the_date(); ?></time>

            <?php
            $types = get_post_meta(get_the_ID(), 'training_types', true);
            $feelings = get_post_meta(get_the_ID(), 'training_feelings', true);
            ?>

            <div class="meta">
                <?php if ($types): ?>
                    <span class="types"><?php echo esc_html($types); ?></span>
                <?php endif; ?>

                <?php if ($feelings): ?>
                    <span class="feelings"><?php echo esc_html($feelings); ?></span>
                <?php endif; ?>
            </div>

            <?php the_excerpt(); ?>
            <a href="<?php the_permalink(); ?>">Leggi tutto</a>
        </article>
        <?php
    endwhile;
    wp_reset_postdata();
endif;
?>
```

### Template Personalizzati

#### single-activity.php

Per personalizzare la visualizzazione di una singola activity, crea `single-activity.php` nel tuo theme:

```php
<?php get_header(); ?>

<main class="site-main">
    <?php while (have_posts()) : the_post(); ?>
        <article id="activity-<?php the_ID(); ?>" <?php post_class(); ?>>

            <header class="entry-header">
                <h1><?php the_title(); ?></h1>
                <time datetime="<?php echo get_the_date('c'); ?>">
                    <?php echo get_the_date('d F Y'); ?>
                </time>
            </header>

            <?php if (has_post_thumbnail()) : ?>
                <div class="featured-image">
                    <?php the_post_thumbnail('large'); ?>
                </div>
            <?php endif; ?>

            <div class="activity-meta">
                <?php
                $training_types = get_post_meta(get_the_ID(), 'training_types', true);
                $training_feelings = get_post_meta(get_the_ID(), 'training_feelings', true);
                $places = get_post_meta(get_the_ID(), 'places', true);
                ?>

                <?php if ($training_types): ?>
                    <div class="meta-item">
                        <strong>Tipo allenamento:</strong>
                        <span class="training-types"><?php echo esc_html($training_types); ?></span>
                    </div>
                <?php endif; ?>

                <?php if ($training_feelings): ?>
                    <div class="meta-item">
                        <strong>Sensazioni:</strong>
                        <span class="training-feelings"><?php echo esc_html($training_feelings); ?></span>
                    </div>
                <?php endif; ?>

                <?php if ($places): ?>
                    <div class="meta-item">
                        <strong>Luoghi:</strong>
                        <span class="places"><?php echo esc_html($places); ?></span>
                    </div>
                <?php endif; ?>
            </div>

            <div class="entry-content">
                <?php the_content(); ?>
            </div>

            <footer class="entry-footer">
                <?php the_tags('<div class="tags">Tags: ', ', ', '</div>'); ?>
            </footer>

        </article>
    <?php endwhile; ?>
</main>

<?php get_footer(); ?>
```

#### archive-activity.php

Per l'archivio delle activities:

```php
<?php get_header(); ?>

<main class="site-main">
    <header class="page-header">
        <h1>Attività Running</h1>
    </header>

    <?php if (have_posts()) : ?>
        <div class="activities-grid">
            <?php while (have_posts()) : the_post(); ?>
                <article class="activity-card">
                    <?php if (has_post_thumbnail()) : ?>
                        <a href="<?php the_permalink(); ?>">
                            <?php the_post_thumbnail('medium'); ?>
                        </a>
                    <?php endif; ?>

                    <h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
                    <time><?php echo get_the_date(); ?></time>

                    <?php
                    $types = get_post_meta(get_the_ID(), 'training_types', true);
                    if ($types):
                    ?>
                        <div class="training-types"><?php echo esc_html($types); ?></div>
                    <?php endif; ?>

                    <?php the_excerpt(); ?>
                </article>
            <?php endwhile; ?>
        </div>

        <?php the_posts_pagination(); ?>
    <?php else : ?>
        <p>Nessuna attività trovata.</p>
    <?php endif; ?>
</main>

<?php get_footer(); ?>
```

## Stili CSS

Il plugin include stili base in `assets/style.css`. Puoi personalizzarli nel tuo theme:

```css
/* Nel file style.css del tuo theme */

/* Activity Cards */
.activity-card {
	border: 1px solid #ddd;
	border-radius: 8px;
	padding: 1.5rem;
	margin-bottom: 2rem;
}

/* Training Meta */
.training-types,
.training-feelings {
	font-size: 1.5em;
	letter-spacing: 0.25em;
}

/* Activity Grid */
.activities-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
	gap: 2rem;
}
```

## Hooks e Filtri

### Filtri Disponibili

```php
// Modifica output training types
add_filter('codeandrun_training_types_output', function($output, $types, $post_id) {
    // Personalizza output
    return $output;
}, 10, 3);

// Modifica args del custom post type
add_filter('codeandrun_activity_post_type_args', function($args) {
    $args['menu_position'] = 20;
    return $args;
});
```

### Azioni Disponibili

```php
// Dopo il salvataggio di un'activity
add_action('codeandrun_after_save_activity', function($post_id) {
    // Fai qualcosa dopo il salvataggio
}, 10, 1);
```

## FAQ

### Come posso aggiungere altri custom fields?

Modifica il plugin in `codeandrun-companion.php`, nella funzione `render_activity_meta_box`:

```php
// Aggiungi nel metabox
<tr>
    <th><label for="distance">Distanza (km)</label></th>
    <td>
        <input type="number" id="distance" name="distance"
               value="<?php echo esc_attr(get_post_meta($post->ID, 'distance', true)); ?>"
               step="0.1" />
    </td>
</tr>

// E nella funzione save_activity_meta
if (isset($_POST['distance'])) {
    update_post_meta($post_id, 'distance', floatval($_POST['distance']));
}
```

### Come creare widget per le activities?

```php
// Nel file functions.php del tuo theme
class Recent_Activities_Widget extends WP_Widget {
    function __construct() {
        parent::__construct('recent_activities', 'Attività Recenti');
    }

    function widget($args, $instance) {
        echo $args['before_widget'];
        echo $args['before_title'] . 'Attività Recenti' . $args['after_title'];

        $activities = new WP_Query(array(
            'post_type' => 'activity',
            'posts_per_page' => 5
        ));

        echo '<ul>';
        while ($activities->have_posts()) : $activities->the_post();
            echo '<li><a href="' . get_permalink() . '">' . get_the_title() . '</a></li>';
        endwhile;
        echo '</ul>';

        wp_reset_postdata();
        echo $args['after_widget'];
    }
}

add_action('widgets_init', function() {
    register_widget('Recent_Activities_Widget');
});
```

### Lo shortcode Strava non funziona

Verifica:

1. Plugin attivo
2. Console browser: nessun errore JavaScript
3. Script Strava caricato: https://strava-embeds.com/embed.js
4. ID Strava corretto

### Come disabilitare il custom post type?

Usa un filtro:

```php
// Nel functions.php
add_filter('codeandrun_register_activity_cpt', '__return_false');
```

## Requisiti

- WordPress 5.0+
- PHP 7.4+
- Plugin "WordPress Importer" (per importazione iniziale)

## Changelog

### 1.0.0

- Primo rilascio
- Custom Post Type Activity
- Shortcodes Strava e YouTube
- Custom fields per training data
- Stili base

## Supporto

Per problemi o domande:

- Email: me@alexmufatti.it
- Website: https://codeandrun.it

## Licenza

MIT License - vedi LICENSE file

---

Made with ❤️ for Code and Run
