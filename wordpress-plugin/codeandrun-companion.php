<?php
/**
 * Plugin Name: Code and Run Companion
 * Plugin URI: https://codeandrun.it
 * Description: Plugin companion per supportare contenuti migrati da Eleventy: shortcodes Strava/YouTube, custom post type Activities, custom fields running
 * Version: 1.0.0
 * Author: Alex Mufatti
 * Author URI: https://alexmufatti.it
 * License: MIT
 * Text Domain: codeandrun-companion
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

class CodeAndRun_Companion {

    private static $instance = null;

    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        // Theme support
        add_action('after_setup_theme', array($this, 'add_theme_support'));

        // Register hooks
        add_action('init', array($this, 'register_custom_post_types'));
        add_action('init', array($this, 'register_taxonomies'));
        add_action('init', array($this, 'register_meta_fields'));
        add_action('init', array($this, 'register_blocks'));
        // Meta box classico disabilitato - usiamo solo il pannello Gutenberg nella sidebar
        // add_action('add_meta_boxes', array($this, 'add_activity_meta_boxes'));
        // add_action('save_post_activity', array($this, 'save_activity_meta'), 10, 2);

        // Register shortcodes
        add_shortcode('strava', array($this, 'strava_shortcode'));
        add_shortcode('youtube', array($this, 'youtube_shortcode'));

        // Enqueue styles
        add_action('wp_enqueue_scripts', array($this, 'enqueue_styles'));

        // Enqueue Gutenberg editor assets
        add_action('enqueue_block_editor_assets', array($this, 'enqueue_editor_assets'));

        // Merge posts and activities in main query
        add_action('pre_get_posts', array($this, 'merge_posts_and_activities'));
    }

    /**
     * Add theme support for features needed by the plugin
     */
    public function add_theme_support() {
        // Enable post thumbnails (featured images)
        add_theme_support('post-thumbnails');

        // Custom image sizes for activities
        add_image_size('activity-thumbnail', 400, 300, true);    // For archive/list views
        add_image_size('activity-hero', 1200, 600, true);        // For single activity header
        add_image_size('activity-card', 600, 400, true);         // For card layouts
    }

    /**
     * Register Custom Post Type: Activity
     */
    public function register_custom_post_types() {
        $labels = array(
            'name'               => _x('Activities', 'post type general name', 'codeandrun-companion'),
            'singular_name'      => _x('Activity', 'post type singular name', 'codeandrun-companion'),
            'menu_name'          => _x('Activities', 'admin menu', 'codeandrun-companion'),
            'name_admin_bar'     => _x('Activity', 'add new on admin bar', 'codeandrun-companion'),
            'add_new'            => _x('Add New', 'activity', 'codeandrun-companion'),
            'add_new_item'       => __('Add New Activity', 'codeandrun-companion'),
            'new_item'           => __('New Activity', 'codeandrun-companion'),
            'edit_item'          => __('Edit Activity', 'codeandrun-companion'),
            'view_item'          => __('View Activity', 'codeandrun-companion'),
            'all_items'          => __('All Activities', 'codeandrun-companion'),
            'search_items'       => __('Search Activities', 'codeandrun-companion'),
            'parent_item_colon'  => __('Parent Activities:', 'codeandrun-companion'),
            'not_found'          => __('No activities found.', 'codeandrun-companion'),
            'not_found_in_trash' => __('No activities found in Trash.', 'codeandrun-companion')
        );

        $args = array(
            'labels'             => $labels,
            'description'        => __('Running training activities', 'codeandrun-companion'),
            'public'             => true,
            'publicly_queryable' => true,
            'show_ui'            => true,
            'show_in_menu'       => true,
            'query_var'          => true,
            'rewrite'            => array('slug' => 'activities'),
            'capability_type'    => 'post',
            'has_archive'        => true,
            'hierarchical'       => false,
            'menu_position'      => 5,
            'menu_icon'          => 'dashicons-chart-line',
            'supports'           => array('title', 'editor', 'author', 'thumbnail', 'excerpt', 'comments', 'custom-fields'),
            'taxonomies'         => array('post_tag', 'category'),
            'show_in_rest'       => true, // Enable Gutenberg editor
        );

        register_post_type('activity', $args);
    }

    /**
     * Register Custom Taxonomies if needed
     */
    public function register_taxonomies() {
        // Potresti voler registrare taxonomy personalizzate per i luoghi, tipi di allenamento, etc.
        // Per ora usiamo le taxonomy standard (tags, categories)
    }

    /**
     * Register Gutenberg Blocks
     */
    public function register_blocks() {
        // Registra il blocco Activity Metadata
        register_block_type('codeandrun/activity-meta', array(
            'editor_script' => 'codeandrun-activity-meta-block',
            'editor_style'  => 'codeandrun-editor',
            'style'         => 'codeandrun-companion',
            'render_callback' => array($this, 'render_activity_meta_block'),
        ));
    }

    /**
     * Render callback per il blocco Activity Metadata
     */
    public function render_activity_meta_block($attributes, $content) {
        // Ottieni il post corrente
        $post_id = get_the_ID();

        if (!$post_id || get_post_type($post_id) !== 'activity') {
            return '';
        }

        // Default attributes
        $show_types = isset($attributes['showTypes']) ? $attributes['showTypes'] : true;
        $show_feelings = isset($attributes['showFeelings']) ? $attributes['showFeelings'] : true;
        $show_places = isset($attributes['showPlaces']) ? $attributes['showPlaces'] : true;
        $style_variant = isset($attributes['styleVariant']) ? $attributes['styleVariant'] : 'default';

        // Ottieni i metadata
        $types = get_post_meta($post_id, 'training_types', true);
        $feelings = get_post_meta($post_id, 'training_feelings', true);
        $places = get_post_meta($post_id, 'places', true);

        // Se non ci sono metadata, non renderizzare nulla
        if (empty($types) && empty($feelings) && empty($places)) {
            return '';
        }

        // Classe CSS
        $meta_class = 'activity-meta';
        if ($style_variant === 'minimal') {
            $meta_class .= ' activity-meta--minimal';
        } elseif ($style_variant === 'dark') {
            $meta_class .= ' activity-meta--dark';
        }

        // Costruisci l'HTML
        $output = '<div class="' . esc_attr($meta_class) . '">';

        // Crea coppie type-feeling per ogni allenamento
        $types_array = !empty($types) ? array_map('trim', explode(',', $types)) : array();
        $feelings_array = !empty($feelings) ? array_map('trim', explode(',', $feelings)) : array();
        $max_trainings = max(count($types_array), count($feelings_array));

        // Mostra le coppie type-feeling
        if (($show_types || $show_feelings) && $max_trainings > 0) {
            $output .= '<div class="activity-meta__item activity-meta__trainings">';
            $output .= '<span class="activity-meta__label">' . __('Trainings', 'codeandrun-companion') . '</span>';
            $output .= '<div class="activity-meta__value training-pairs">';

            for ($i = 0; $i < $max_trainings; $i++) {
                $type = isset($types_array[$i]) ? $types_array[$i] : '';
                $feeling = isset($feelings_array[$i]) ? $feelings_array[$i] : '';

                // Salta se entrambi sono vuoti
                if (empty($type) && empty($feeling)) {
                    continue;
                }

                $output .= '<div class="training-pair">';

                if ($show_types && !empty($type)) {
                    $output .= '<span class="training-type-item">' . esc_html($type) . '</span>';
                }

                // Separatore solo se entrambi presenti
                if ($show_types && $show_feelings && !empty($type) && !empty($feeling)) {
                    $output .= '<span class="training-separator">+</span>';
                }

                if ($show_feelings && !empty($feeling)) {
                    $output .= '<span class="training-feeling-item">' . esc_html($feeling) . '</span>';
                }

                $output .= '</div>';
            }

            $output .= '</div></div>';
        }

        // Places
        if ($show_places && !empty($places)) {
            $output .= '<div class="activity-meta__item">';
            $output .= '<span class="activity-meta__label">' . __('Places', 'codeandrun-companion') . '</span>';
            $output .= '<div class="activity-meta__value places">' . esc_html($places) . '</div>';
            $output .= '</div>';
        }

        $output .= '</div>';

        return $output;
    }

    /**
     * Register meta fields for Gutenberg/REST API
     */
    public function register_meta_fields() {
        // Training Types
        register_post_meta('activity', 'training_types', array(
            'type' => 'string',
            'description' => __('Training intensity types (emoji)', 'codeandrun-companion'),
            'single' => true,
            'show_in_rest' => true,
            'auth_callback' => function() {
                return current_user_can('edit_posts');
            }
        ));

        // Training Feelings
        register_post_meta('activity', 'training_feelings', array(
            'type' => 'string',
            'description' => __('Training feelings (emoji)', 'codeandrun-companion'),
            'single' => true,
            'show_in_rest' => true,
            'auth_callback' => function() {
                return current_user_can('edit_posts');
            }
        ));

        // Places
        register_post_meta('activity', 'places', array(
            'type' => 'string',
            'description' => __('Training places', 'codeandrun-companion'),
            'single' => true,
            'show_in_rest' => true,
            'auth_callback' => function() {
                return current_user_can('edit_posts');
            }
        ));
    }

    /**
     * Add meta boxes for activity custom fields
     */
    public function add_activity_meta_boxes() {
        add_meta_box(
            'activity_training_details',
            __('Training Details', 'codeandrun-companion'),
            array($this, 'render_activity_meta_box'),
            'activity',
            'normal',
            'high'
        );
    }

    /**
     * Render activity meta box
     */
    public function render_activity_meta_box($post) {
        wp_nonce_field('activity_meta_box', 'activity_meta_box_nonce');

        $training_types = get_post_meta($post->ID, 'training_types', true);
        $training_feelings = get_post_meta($post->ID, 'training_feelings', true);
        $places = get_post_meta($post->ID, 'places', true);

        ?>
        <table class="form-table">
            <tr>
                <th><label for="training_types"><?php _e('Training Types', 'codeandrun-companion'); ?></label></th>
                <td>
                    <input type="text" id="training_types" name="training_types" value="<?php echo esc_attr($training_types); ?>" class="regular-text" />
                    <p class="description"><?php _e('Emoji separati da virgola (es: 🟢,🔴,🟢)', 'codeandrun-companion'); ?></p>
                </td>
            </tr>
            <tr>
                <th><label for="training_feelings"><?php _e('Training Feelings', 'codeandrun-companion'); ?></label></th>
                <td>
                    <input type="text" id="training_feelings" name="training_feelings" value="<?php echo esc_attr($training_feelings); ?>" class="regular-text" />
                    <p class="description"><?php _e('Emoji separati da virgola (es: 😭,😀,🙂)', 'codeandrun-companion'); ?></p>
                </td>
            </tr>
            <tr>
                <th><label for="places"><?php _e('Places', 'codeandrun-companion'); ?></label></th>
                <td>
                    <input type="text" id="places" name="places" value="<?php echo esc_attr($places); ?>" class="regular-text" />
                    <p class="description"><?php _e('Luoghi separati da virgola', 'codeandrun-companion'); ?></p>
                </td>
            </tr>
        </table>
        <?php
    }

    /**
     * Save activity meta box data
     */
    public function save_activity_meta($post_id, $post) {
        // Check nonce
        if (!isset($_POST['activity_meta_box_nonce']) || !wp_verify_nonce($_POST['activity_meta_box_nonce'], 'activity_meta_box')) {
            return;
        }

        // Check autosave
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }

        // Check permissions
        if (!current_user_can('edit_post', $post_id)) {
            return;
        }

        // Save fields
        if (isset($_POST['training_types'])) {
            update_post_meta($post_id, 'training_types', sanitize_text_field($_POST['training_types']));
        }

        if (isset($_POST['training_feelings'])) {
            update_post_meta($post_id, 'training_feelings', sanitize_text_field($_POST['training_feelings']));
        }

        if (isset($_POST['places'])) {
            update_post_meta($post_id, 'places', sanitize_text_field($_POST['places']));
        }
    }

    /**
     * Strava Shortcode
     * Usage: [strava id="123456789" embed_id="abc123def456"]
     */
    public function strava_shortcode($atts) {
        $atts = shortcode_atts(array(
            'id' => '',
            'embed_id' => '',
        ), $atts, 'strava');

        if (empty($atts['id'])) {
            return '<p><em>Strava activity ID required</em></p>';
        }

        $activity_id = esc_attr($atts['id']);
        $embed_id = esc_attr($atts['embed_id']);

        // Strava embed iframe
        $iframe = sprintf(
            '<div class="strava-embed-placeholder" data-embed-type="activity" data-embed-id="%s" data-style="standard"></div>',
            $activity_id
        );

        // Load Strava embed script
        wp_enqueue_script('strava-embeds', 'https://strava-embeds.com/embed.js', array(), null, true);

        return $iframe;
    }

    /**
     * YouTube Shortcode
     * Usage: [youtube id="VIDEO_ID"]
     */
    public function youtube_shortcode($atts) {
        $atts = shortcode_atts(array(
            'id' => '',
            'width' => '560',
            'height' => '315',
        ), $atts, 'youtube');

        if (empty($atts['id'])) {
            return '<p><em>YouTube video ID required</em></p>';
        }

        $video_id = esc_attr($atts['id']);
        $width = intval($atts['width']);
        $height = intval($atts['height']);

        return sprintf(
            '<div class="youtube-embed" style="position:relative;padding-bottom:56.25%%;height:0;overflow:hidden;max-width:100%%;"><iframe style="position:absolute;top:0;left:0;width:100%%;height:100%%;" src="https://www.youtube.com/embed/%s" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>',
            $video_id
        );
    }

    /**
     * Enqueue frontend styles
     */
    public function enqueue_styles() {
        wp_enqueue_style(
            'codeandrun-companion',
            plugin_dir_url(__FILE__) . 'assets/style.css',
            array(),
            '1.0.0'
        );
    }

    /**
     * Enqueue Gutenberg editor assets
     */
    public function enqueue_editor_assets() {
        $screen = get_current_screen();

        // Pannello sidebar metadata - solo per il post type 'activity'
        if ($screen && $screen->post_type === 'activity') {
            wp_enqueue_script(
                'codeandrun-activity-meta',
                plugin_dir_url(__FILE__) . 'assets/activity-meta.js',
                array('wp-plugins', 'wp-edit-post', 'wp-element', 'wp-components', 'wp-data'),
                '1.0.0',
                true
            );
        }

        // Blocco Activity Metadata - disponibile ovunque (post, activity, editor tema)
        wp_enqueue_script(
            'codeandrun-activity-meta-block',
            plugin_dir_url(__FILE__) . 'assets/activity-meta-block.js',
            array('wp-blocks', 'wp-element', 'wp-components', 'wp-data', 'wp-block-editor'),
            '1.0.0',
            true
        );

        wp_enqueue_style(
            'codeandrun-editor',
            plugin_dir_url(__FILE__) . 'assets/style.css',
            array('wp-edit-blocks'),
            '1.0.0'
        );
    }

    /**
     * Merge posts and activities in main query
     * Mostra sia posts che activities nella home e negli archivi
     */
    public function merge_posts_and_activities($query) {
        // Solo per la query principale nel frontend
        if (is_admin() || !$query->is_main_query()) {
            return;
        }

        // Applica a: home page, archivi per data, feed RSS
        if ($query->is_home() || $query->is_archive() || $query->is_feed()) {
            // Aggiungi 'activity' ai post types da mostrare
            $post_types = array('post', 'activity');
            $query->set('post_type', $post_types);

            // Ordina per data (più recenti prima)
            $query->set('orderby', 'date');
            $query->set('order', 'DESC');
        }

        // Opzionale: includi activities anche nella ricerca
        if ($query->is_search()) {
            $query->set('post_type', array('post', 'activity'));
        }
    }
}

// Initialize plugin
function codeandrun_companion_init() {
    return CodeAndRun_Companion::get_instance();
}
add_action('plugins_loaded', 'codeandrun_companion_init');

/**
 * Activation hook - flush rewrite rules
 */
function codeandrun_companion_activate() {
    $companion = CodeAndRun_Companion::get_instance();
    $companion->register_custom_post_types();
    flush_rewrite_rules();
}
register_activation_hook(__FILE__, 'codeandrun_companion_activate');

/**
 * Deactivation hook - flush rewrite rules
 */
function codeandrun_companion_deactivate() {
    flush_rewrite_rules();
}
register_deactivation_hook(__FILE__, 'codeandrun_companion_deactivate');
