# Usare i Custom Fields nei Template WordPress

Questa guida mostra come usare i campi `training_types`, `training_feelings` e `places` nei template del tuo tema WordPress.

## File Necessari

Il plugin ora include `template-functions.php` che fornisce funzioni helper per accedere facilmente ai custom fields nei template.

## Funzioni Disponibili

### Funzioni Base (get)

```php
// Ottiene training types (stringa con emoji)
$types = codeandrun_get_training_types();
// Output: "🟢,🔴,🟢"

// Ottiene training feelings (stringa con emoji)
$feelings = codeandrun_get_training_feelings();
// Output: "😭,😀,🙂"

// Ottiene luoghi
$places = codeandrun_get_places();
// Output: "Lugano, Monte Brè"
```

### Funzioni di Output (the)

```php
// Visualizza training types formattati
codeandrun_the_training_types();

// Visualizza training feelings formattati
codeandrun_the_training_feelings();

// Visualizza luoghi formattati
codeandrun_the_places();

// Visualizza TUTTI i meta in un box completo
codeandrun_the_activity_meta();
```

### Funzioni Helper

```php
// Controlla se l'activity ha meta fields
if (codeandrun_has_activity_meta()) {
    // Mostra qualcosa
}

// Conta quanti allenamenti ci sono
$count = codeandrun_count_trainings();

// Ottiene specifico emoji per indice
$primo_type = codeandrun_get_training_type_by_index(0);
$primo_feeling = codeandrun_get_training_feeling_by_index(0);
```

## Esempi Pratici

### 1. Template Singola Activity (single-activity.php)

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

            <!-- VISUALIZZA TUTTI I META IN UN BOX -->
            <?php codeandrun_the_activity_meta(); ?>

            <div class="entry-content">
                <?php the_content(); ?>
            </div>

        </article>

    <?php endwhile; ?>
</main>

<?php get_footer(); ?>
```

### 2. Visualizzazione Personalizzata con Etichette

```php
<?php if (codeandrun_has_activity_meta()) : ?>
    <div class="activity-details">

        <?php if ($types = codeandrun_get_training_types()) : ?>
            <div class="detail-row">
                <strong>Intensità:</strong>
                <?php codeandrun_the_training_types(); ?>
            </div>
        <?php endif; ?>

        <?php if ($feelings = codeandrun_get_training_feelings()) : ?>
            <div class="detail-row">
                <strong>Sensazioni:</strong>
                <?php codeandrun_the_training_feelings(); ?>
            </div>
        <?php endif; ?>

        <?php if ($places = codeandrun_get_places()) : ?>
            <div class="detail-row">
                <strong>Luoghi:</strong>
                <?php codeandrun_the_places(); ?>
            </div>
        <?php endif; ?>

    </div>
<?php endif; ?>
```

### 3. Archive Activities (archive-activity.php)

```php
<?php get_header(); ?>

<main class="site-main">
    <header class="page-header">
        <h1>Attività Running</h1>
    </header>

    <?php if (have_posts()) : ?>
        <div class="activities-list">
            <?php while (have_posts()) : the_post(); ?>

                <article class="activity-card">

                    <?php if (has_post_thumbnail()) : ?>
                        <a href="<?php the_permalink(); ?>">
                            <?php the_post_thumbnail('medium'); ?>
                        </a>
                    <?php endif; ?>

                    <h2>
                        <a href="<?php the_permalink(); ?>">
                            <?php the_title(); ?>
                        </a>
                    </h2>

                    <time><?php echo get_the_date(); ?></time>

                    <!-- Mostra solo training types nella lista -->
                    <?php if ($types = codeandrun_get_training_types()) : ?>
                        <div class="card-meta">
                            <?php codeandrun_the_training_types(); ?>
                        </div>
                    <?php endif; ?>

                    <?php the_excerpt(); ?>

                </article>

            <?php endwhile; ?>
        </div>

        <?php the_posts_pagination(); ?>
    <?php endif; ?>
</main>

<?php get_footer(); ?>
```

### 4. Loop Misto (Posts + Activities nella Home)

```php
<?php get_header(); ?>

<main class="site-main">
    <?php if (have_posts()) : ?>

        <?php while (have_posts()) : the_post(); ?>

            <article <?php post_class(); ?>>

                <h2>
                    <a href="<?php the_permalink(); ?>">
                        <?php the_title(); ?>
                    </a>
                </h2>

                <time><?php echo get_the_date(); ?></time>

                <!-- Mostra meta solo se è un'activity -->
                <?php if (get_post_type() === 'activity' && codeandrun_has_activity_meta()) : ?>
                    <div class="inline-meta">
                        <?php codeandrun_the_training_types(); ?>
                        <?php codeandrun_the_training_feelings(); ?>
                    </div>
                <?php endif; ?>

                <?php the_excerpt(); ?>

            </article>

        <?php endwhile; ?>

    <?php endif; ?>
</main>

<?php get_footer(); ?>
```

### 5. Loop su Singoli Allenamenti

Se hai più allenamenti in una settimana (es: 3 allenamenti = 3 emoji):

```php
<?php
$num_trainings = codeandrun_count_trainings();

if ($num_trainings > 0) : ?>
    <div class="training-breakdown">
        <h3>Allenamenti della settimana (<?php echo $num_trainings; ?>)</h3>

        <ul class="training-list">
            <?php for ($i = 0; $i < $num_trainings; $i++) : ?>
                <li class="training-item">
                    <span class="training-number">Allenamento <?php echo ($i + 1); ?>:</span>

                    <?php if ($type = codeandrun_get_training_type_by_index($i)) : ?>
                        <span class="type"><?php echo esc_html($type); ?></span>
                    <?php endif; ?>

                    <?php if ($feeling = codeandrun_get_training_feeling_by_index($i)) : ?>
                        <span class="feeling"><?php echo esc_html($feeling); ?></span>
                    <?php endif; ?>
                </li>
            <?php endfor; ?>
        </ul>
    </div>
<?php endif; ?>
```

### 6. Widget Sidebar

```php
<!-- In sidebar.php o widget personalizzato -->
<?php if (is_singular('activity') && codeandrun_has_activity_meta()) : ?>
    <aside class="widget activity-info-widget">
        <h3 class="widget-title">Info Allenamento</h3>

        <?php codeandrun_the_activity_meta(); ?>

        <?php if ($places = codeandrun_get_places()) : ?>
            <div class="widget-map">
                <!-- Qui potresti aggiungere una mappa -->
                <p>📍 <?php echo esc_html($places); ?></p>
            </div>
        <?php endif; ?>
    </aside>
<?php endif; ?>
```

### 7. Shortcode Personalizzato

Crea uno shortcode per usare i meta fields ovunque:

```php
// Nel functions.php del tuo tema
function activity_meta_shortcode($atts) {
    $atts = shortcode_atts(array(
        'id' => get_the_ID(),
        'field' => 'all', // types, feelings, places, all
    ), $atts);

    $post_id = intval($atts['id']);

    ob_start();

    switch ($atts['field']) {
        case 'types':
            codeandrun_the_training_types($post_id);
            break;
        case 'feelings':
            codeandrun_the_training_feelings($post_id);
            break;
        case 'places':
            codeandrun_the_places($post_id);
            break;
        default:
            codeandrun_the_activity_meta($post_id);
    }

    return ob_get_clean();
}
add_shortcode('activity_meta', 'activity_meta_shortcode');

// Uso: [activity_meta field="types"]
// Uso: [activity_meta field="feelings" id="123"]
```

### 8. Query Personalizzata con Meta

```php
<?php
// Trova tutte le activities con training feelings
$activities_with_feelings = new WP_Query(array(
    'post_type' => 'activity',
    'posts_per_page' => 10,
    'meta_query' => array(
        array(
            'key' => 'training_feelings',
            'value' => '',
            'compare' => '!='
        )
    )
));

if ($activities_with_feelings->have_posts()) : ?>
    <div class="activities-with-feelings">
        <?php while ($activities_with_feelings->have_posts()) : $activities_with_feelings->the_post(); ?>
            <article>
                <h3><?php the_title(); ?></h3>
                <?php codeandrun_the_training_feelings(); ?>
            </article>
        <?php endwhile; ?>
    </div>
    <?php wp_reset_postdata(); ?>
<?php endif; ?>
```

## Personalizzazione Output

### Cambiare le Classi CSS

```php
// Default
codeandrun_the_training_types();

// Custom class
codeandrun_the_training_types(null, 'my-custom-class');

// HTML output:
// <div class="my-custom-class">
//   <span class="training-type-item">🟢</span>
//   <span class="training-type-item">🔴</span>
// </div>
```

### Cambiare il Separatore dei Luoghi

```php
// Default (virgola + spazio)
codeandrun_the_places();
// Output: "Lugano, Monte Brè"

// Separatore personalizzato
codeandrun_the_places(null, 'places', ' • ');
// Output: "Lugano • Monte Brè"

// Separatore bullet point
codeandrun_the_places(null, 'places', ' ⋅ ');
// Output: "Lugano ⋅ Monte Brè"
```

### Return invece di Echo

```php
// Di default fa echo
codeandrun_the_training_types(); // Stampa direttamente

// Ottieni la stringa HTML
$html = codeandrun_the_training_types(null, 'my-class', false);

// Ora puoi manipolare
if (strpos($html, '🔴') !== false) {
    echo '<div class="intense-workout">' . $html . '</div>';
}
```

## CSS Styling

Esempio di stili per i meta fields:

```css
/* Nel file style.css del tuo tema */

/* Box meta completo */
.activity-meta {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
	gap: 1.5rem;
	padding: 1.5rem;
	background: #f8f9fa;
	border-radius: 8px;
	margin: 2rem 0;
}

.activity-meta__item {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.activity-meta__label {
	font-size: 0.75rem;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.05em;
	color: #6c757d;
}

.activity-meta__value {
	display: flex;
	gap: 0.5rem;
	font-size: 1.5rem;
}

/* Training types e feelings */
.training-types,
.training-feelings {
	display: flex;
	gap: 0.5rem;
	font-size: 1.5rem;
	flex-wrap: wrap;
}

.training-type-item,
.training-feeling-item {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-width: 2rem;
	min-height: 2rem;
}

/* Hover effect */
.training-type-item:hover,
.training-feeling-item:hover {
	transform: scale(1.2);
	transition: transform 0.2s ease;
}

/* Places */
.places {
	font-size: 0.9rem;
	color: #495057;
}

/* Per card in archivi */
.activity-card .training-types {
	font-size: 1.2rem;
	margin: 0.5rem 0;
}

/* Inline nella home */
.inline-meta {
	display: flex;
	gap: 1rem;
	margin: 0.5rem 0;
}

.inline-meta .training-types,
.inline-meta .training-feelings {
	font-size: 1rem;
}
```

## Best Practices

### 1. Controlla Sempre se i Dati Esistono

```php
// ✅ BUONO
<?php if (codeandrun_has_activity_meta()) : ?>
    <?php codeandrun_the_activity_meta(); ?>
<?php endif; ?>

// ❌ EVITA (può mostrare contenitori vuoti)
<div class="activity-meta">
    <?php codeandrun_the_activity_meta(); ?>
</div>
```

### 2. Usa le Funzioni Giuste per il Contesto

```php
// Nei template: usa le funzioni "the_"
codeandrun_the_training_types();

// Per logica/condizioni: usa le funzioni "get_"
if (strpos(codeandrun_get_training_types(), '🔴') !== false) {
    echo '<p>Allenamento intenso!</p>';
}
```

### 3. Specifica Post ID nelle Query Custom

```php
$query = new WP_Query(array('post_type' => 'activity'));

while ($query->have_posts()) : $query->the_post();
    // ✅ BUONO - specifica l'ID
    codeandrun_the_training_types(get_the_ID());
endwhile;

wp_reset_postdata();
```

### 4. Combina con Altri Template Tags WordPress

```php
<article class="activity">
    <?php the_post_thumbnail('medium'); ?>
    <h2><?php the_title(); ?></h2>
    <time><?php the_time('j F Y'); ?></time>

    <?php codeandrun_the_activity_meta(); ?>

    <?php the_excerpt(); ?>
    <?php the_tags('<div class="tags">', ', ', '</div>'); ?>
</article>
```

## Troubleshooting

### I campi non appaiono

1. Verifica che il post type sia 'activity'
2. Controlla che i meta fields siano compilati nell'editor
3. Usa `var_dump()` per debug:

```php
<?php
$types = codeandrun_get_training_types();
var_dump($types); // Mostra cosa contiene

if (empty($types)) {
    echo "Nessun training type trovato";
}
?>
```

### Emoji non visualizzati correttamente

Aggiungi al `<head>` del tuo tema:

```html
<meta charset="UTF-8" />
```

### Stili non applicati

Verifica che il CSS del plugin sia caricato:

```php
// Nel functions.php
function my_theme_styles() {
    // Forza ricaricamento CSS plugin
    wp_dequeue_style('codeandrun-companion');
    wp_enqueue_style('codeandrun-companion', plugin_dir_url(__FILE__) . '../plugins/codeandrun-companion/assets/style.css');
}
add_action('wp_enqueue_scripts', 'my_theme_styles', 20);
```

---

Con queste funzioni puoi facilmente visualizzare i custom fields in qualsiasi template del tuo tema WordPress! 🎉
