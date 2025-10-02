<?php
/**
 * Theme Customization Snippets per Code and Run
 *
 * Aggiungi questi snippet al file functions.php del tuo theme WordPress
 * per personalizzare ulteriormente il comportamento di posts e activities
 */

// ============================================================================
// OPZIONE 1: Merge Posts e Activities (GIÀ INCLUSO NEL PLUGIN)
// ============================================================================
// Il plugin già include questa funzionalità, ma se vuoi disabilitarla
// e gestirla manualmente, usa questo filtro:

/*
add_filter('codeandrun_merge_post_types', '__return_false');

// E poi aggiungi questo nel functions.php:
function my_merge_posts_and_activities($query) {
    if (is_admin() || !$query->is_main_query()) {
        return;
    }

    if ($query->is_home() || $query->is_archive() || $query->is_feed()) {
        $query->set('post_type', array('post', 'activity'));
    }
}
add_action('pre_get_posts', 'my_merge_posts_and_activities');
*/


// ============================================================================
// OPZIONE 2: Personalizza il Numero di Post per Pagina
// ============================================================================
// Mostra più elementi nella home (es: 20 invece di 10)

function codeandrun_posts_per_page($query) {
    if (is_admin() || !$query->is_main_query()) {
        return;
    }

    // Home: 20 elementi per pagina
    if ($query->is_home()) {
        $query->set('posts_per_page', 20);
    }

    // Archivio activities: 30 elementi per pagina
    if ($query->is_post_type_archive('activity')) {
        $query->set('posts_per_page', 30);
    }
}
add_action('pre_get_posts', 'codeandrun_posts_per_page');


// ============================================================================
// OPZIONE 3: Aggiungi Indicatore Visuale per Tipo di Post
// ============================================================================
// Mostra un badge "Running" o "Tech" prima del titolo

function codeandrun_post_type_badge() {
    $post_type = get_post_type();

    if ($post_type === 'activity') {
        echo '<span class="post-type-badge activity-badge">🏃 Running</span> ';
    } elseif ($post_type === 'post') {
        // Determina badge in base alla categoria
        if (has_category('running')) {
            echo '<span class="post-type-badge running-badge">🏃 Running</span> ';
        } else {
            echo '<span class="post-type-badge tech-badge">💻 Tech</span> ';
        }
    }
}

// Usa nel template: <?php codeandrun_post_type_badge(); the_title(); ?>


// ============================================================================
// OPZIONE 4: Personalizza l'Excerpt per Activities
// ============================================================================
// Mostra automaticamente training info nell'excerpt

function codeandrun_custom_excerpt($excerpt) {
    if (get_post_type() === 'activity') {
        $training_types = get_post_meta(get_the_ID(), 'training_types', true);
        $training_feelings = get_post_meta(get_the_ID(), 'training_feelings', true);

        $meta_html = '<div class="activity-excerpt-meta">';

        if ($training_types) {
            $meta_html .= '<span class="training-types">' . esc_html($training_types) . '</span> ';
        }

        if ($training_feelings) {
            $meta_html .= '<span class="training-feelings">' . esc_html($training_feelings) . '</span>';
        }

        $meta_html .= '</div>';

        return $meta_html . $excerpt;
    }

    return $excerpt;
}
add_filter('the_excerpt', 'codeandrun_custom_excerpt');


// ============================================================================
// OPZIONE 5: CSS Personalizzato per i Badge
// ============================================================================

function codeandrun_custom_styles() {
    ?>
    <style>
        /* Post Type Badges */
        .post-type-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 4px;
            font-size: 0.85em;
            font-weight: 600;
            margin-right: 8px;
            text-transform: uppercase;
        }

        .activity-badge,
        .running-badge {
            background: #4CAF50;
            color: white;
        }

        .tech-badge {
            background: #2196F3;
            color: white;
        }

        /* Activity Meta in Excerpt */
        .activity-excerpt-meta {
            margin-bottom: 1rem;
            padding: 0.5rem;
            background: #f5f5f5;
            border-radius: 4px;
            font-size: 1.2em;
        }

        .activity-excerpt-meta .training-types,
        .activity-excerpt-meta .training-feelings {
            margin-right: 0.5rem;
        }

        /* Layout Grid per Home */
        .home .site-main {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 2rem;
        }

        /* Differenzia visualmente activities da posts */
        article.activity {
            border-left: 4px solid #4CAF50;
        }

        article.post {
            border-left: 4px solid #2196F3;
        }
    </style>
    <?php
}
add_action('wp_head', 'codeandrun_custom_styles');


// ============================================================================
// OPZIONE 6: Filtri per Separare Posts e Activities
// ============================================================================
// Aggiungi link nel menu per filtrare solo posts o solo activities

function codeandrun_filter_menu($items, $args) {
    // Solo nel menu principale
    if ($args->theme_location == 'primary') {
        $current_type = get_query_var('post_type');

        $items .= '<li class="menu-item' . ($current_type === '' ? ' current-menu-item' : '') . '">';
        $items .= '<a href="' . home_url('/') . '">Tutti</a>';
        $items .= '</li>';

        $items .= '<li class="menu-item' . ($current_type === 'post' ? ' current-menu-item' : '') . '">';
        $items .= '<a href="' . home_url('/?post_type=post') . '">Tech Posts</a>';
        $items .= '</li>';

        $items .= '<li class="menu-item' . ($current_type === 'activity' ? ' current-menu-item' : '') . '">';
        $items .= '<a href="' . get_post_type_archive_link('activity') . '">Running</a>';
        $items .= '</li>';
    }

    return $items;
}
add_filter('wp_nav_menu_items', 'codeandrun_filter_menu', 10, 2);


// ============================================================================
// OPZIONE 7: Widget Recent Posts & Activities
// ============================================================================

class CodeAndRun_Recent_Widget extends WP_Widget {

    function __construct() {
        parent::__construct(
            'codeandrun_recent',
            'Code and Run: Recenti',
            array('description' => 'Mostra posts e activities recenti')
        );
    }

    function widget($args, $instance) {
        $title = !empty($instance['title']) ? $instance['title'] : 'Contenuti Recenti';
        $number = !empty($instance['number']) ? absint($instance['number']) : 5;

        echo $args['before_widget'];
        echo $args['before_title'] . esc_html($title) . $args['after_title'];

        $recent = new WP_Query(array(
            'post_type' => array('post', 'activity'),
            'posts_per_page' => $number,
            'orderby' => 'date',
            'order' => 'DESC'
        ));

        if ($recent->have_posts()) {
            echo '<ul class="codeandrun-recent-list">';
            while ($recent->have_posts()) : $recent->the_post();
                $type_label = get_post_type() === 'activity' ? '🏃' : '💻';
                echo '<li>';
                echo '<span class="post-type-icon">' . $type_label . '</span> ';
                echo '<a href="' . get_permalink() . '">' . get_the_title() . '</a>';
                echo '<span class="post-date"> - ' . get_the_date() . '</span>';
                echo '</li>';
            endwhile;
            echo '</ul>';
            wp_reset_postdata();
        }

        echo $args['after_widget'];
    }

    function form($instance) {
        $title = !empty($instance['title']) ? $instance['title'] : 'Contenuti Recenti';
        $number = !empty($instance['number']) ? absint($instance['number']) : 5;
        ?>
        <p>
            <label for="<?php echo esc_attr($this->get_field_id('title')); ?>">Titolo:</label>
            <input class="widefat" id="<?php echo esc_attr($this->get_field_id('title')); ?>"
                   name="<?php echo esc_attr($this->get_field_name('title')); ?>" type="text"
                   value="<?php echo esc_attr($title); ?>">
        </p>
        <p>
            <label for="<?php echo esc_attr($this->get_field_id('number')); ?>">Numero di elementi:</label>
            <input class="tiny-text" id="<?php echo esc_attr($this->get_field_id('number')); ?>"
                   name="<?php echo esc_attr($this->get_field_name('number')); ?>" type="number"
                   step="1" min="1" value="<?php echo esc_attr($number); ?>" size="3">
        </p>
        <?php
    }

    function update($new_instance, $old_instance) {
        $instance = array();
        $instance['title'] = (!empty($new_instance['title'])) ? sanitize_text_field($new_instance['title']) : '';
        $instance['number'] = (!empty($new_instance['number'])) ? absint($new_instance['number']) : 5;
        return $instance;
    }
}

function codeandrun_register_widgets() {
    register_widget('CodeAndRun_Recent_Widget');
}
add_action('widgets_init', 'codeandrun_register_widgets');


// ============================================================================
// OPZIONE 8: Breadcrumbs Personalizzati
// ============================================================================

function codeandrun_breadcrumbs() {
    if (is_front_page()) {
        return;
    }

    echo '<nav class="breadcrumbs">';
    echo '<a href="' . home_url('/') . '">Home</a> / ';

    if (is_singular('activity')) {
        echo '<a href="' . get_post_type_archive_link('activity') . '">Running</a> / ';
        echo '<span>' . get_the_title() . '</span>';
    } elseif (is_post_type_archive('activity')) {
        echo '<span>Running Activities</span>';
    } elseif (is_single()) {
        the_category(' / ');
        echo ' / <span>' . get_the_title() . '</span>';
    } elseif (is_category()) {
        echo '<span>' . single_cat_title('', false) . '</span>';
    } elseif (is_tag()) {
        echo '<span>' . single_tag_title('', false) . '</span>';
    } elseif (is_archive()) {
        echo '<span>Archivio</span>';
    } elseif (is_search()) {
        echo '<span>Risultati per: ' . get_search_query() . '</span>';
    }

    echo '</nav>';
}

// Usa nel template: <?php codeandrun_breadcrumbs(); ?>


// ============================================================================
// FINE SNIPPETS
// ============================================================================

/*
 * ISTRUZIONI:
 *
 * 1. Copia gli snippet che ti servono nel functions.php del tuo theme
 * 2. Attiva/disattiva le opzioni decommentando/commentando
 * 3. Personalizza gli stili CSS secondo il tuo design
 * 4. Testa ogni snippet dopo averlo aggiunto
 *
 * IMPORTANTE:
 * - Il plugin già include il merge di posts e activities
 * - Questi snippet sono OPZIONALI per personalizzazioni avanzate
 * - Non è necessario usarli tutti, scegli solo quelli che ti servono
 */
