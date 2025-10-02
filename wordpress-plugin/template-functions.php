<?php
/**
 * Template Functions per Code and Run Companion
 *
 * Funzioni helper da usare nei template del tema per visualizzare
 * i custom fields delle Activities
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Ottiene i training types di un'activity
 *
 * @param int|null $post_id ID del post (null = post corrente)
 * @return string Stringa con emoji separati da virgola
 */
function codeandrun_get_training_types($post_id = null) {
    if (!$post_id) {
        $post_id = get_the_ID();
    }

    return get_post_meta($post_id, 'training_types', true);
}

/**
 * Ottiene i training feelings di un'activity
 *
 * @param int|null $post_id ID del post (null = post corrente)
 * @return string Stringa con emoji separati da virgola
 */
function codeandrun_get_training_feelings($post_id = null) {
    if (!$post_id) {
        $post_id = get_the_ID();
    }

    return get_post_meta($post_id, 'training_feelings', true);
}

/**
 * Ottiene i luoghi di un'activity
 *
 * @param int|null $post_id ID del post (null = post corrente)
 * @return string Stringa con luoghi separati da virgola
 */
function codeandrun_get_places($post_id = null) {
    if (!$post_id) {
        $post_id = get_the_ID();
    }

    return get_post_meta($post_id, 'places', true);
}

/**
 * Converte stringa emoji in array
 *
 * @param string $emoji_string Stringa con emoji separati da virgola
 * @return array Array di emoji singoli
 */
function codeandrun_parse_emoji($emoji_string) {
    if (empty($emoji_string)) {
        return array();
    }

    return array_map('trim', explode(',', $emoji_string));
}

/**
 * Visualizza i training types come lista di emoji
 *
 * @param int|null $post_id ID del post (null = post corrente)
 * @param string $wrapper_class Classe CSS per il wrapper
 * @param bool $echo Echo o return
 * @return string|void HTML output
 */
function codeandrun_the_training_types($post_id = null, $wrapper_class = 'training-types', $echo = true) {
    $types = codeandrun_get_training_types($post_id);

    if (empty($types)) {
        return '';
    }

    $emoji_array = codeandrun_parse_emoji($types);

    $output = '<div class="' . esc_attr($wrapper_class) . '">';
    foreach ($emoji_array as $emoji) {
        $output .= '<span class="training-type-item">' . esc_html($emoji) . '</span>';
    }
    $output .= '</div>';

    if ($echo) {
        echo $output;
    } else {
        return $output;
    }
}

/**
 * Visualizza i training feelings come lista di emoji
 *
 * @param int|null $post_id ID del post (null = post corrente)
 * @param string $wrapper_class Classe CSS per il wrapper
 * @param bool $echo Echo o return
 * @return string|void HTML output
 */
function codeandrun_the_training_feelings($post_id = null, $wrapper_class = 'training-feelings', $echo = true) {
    $feelings = codeandrun_get_training_feelings($post_id);

    if (empty($feelings)) {
        return '';
    }

    $emoji_array = codeandrun_parse_emoji($feelings);

    $output = '<div class="' . esc_attr($wrapper_class) . '">';
    foreach ($emoji_array as $emoji) {
        $output .= '<span class="training-feeling-item">' . esc_html($emoji) . '</span>';
    }
    $output .= '</div>';

    if ($echo) {
        echo $output;
    } else {
        return $output;
    }
}

/**
 * Visualizza i luoghi come lista
 *
 * @param int|null $post_id ID del post (null = post corrente)
 * @param string $wrapper_class Classe CSS per il wrapper
 * @param string $separator Separatore tra luoghi
 * @param bool $echo Echo o return
 * @return string|void HTML output
 */
function codeandrun_the_places($post_id = null, $wrapper_class = 'places', $separator = ', ', $echo = true) {
    $places = codeandrun_get_places($post_id);

    if (empty($places)) {
        return '';
    }

    $places_array = array_map('trim', explode(',', $places));

    $output = '<div class="' . esc_attr($wrapper_class) . '">';
    $output .= esc_html(implode($separator, $places_array));
    $output .= '</div>';

    if ($echo) {
        echo $output;
    } else {
        return $output;
    }
}

/**
 * Visualizza tutti i meta dell'activity in un box completo
 *
 * @param int|null $post_id ID del post (null = post corrente)
 * @param bool $echo Echo o return
 * @return string|void HTML output
 */
function codeandrun_the_activity_meta($post_id = null, $echo = true) {
    if (!$post_id) {
        $post_id = get_the_ID();
    }

    // Verifica che sia un'activity
    if (get_post_type($post_id) !== 'activity') {
        return '';
    }

    $types = codeandrun_get_training_types($post_id);
    $feelings = codeandrun_get_training_feelings($post_id);
    $places = codeandrun_get_places($post_id);

    // Se non ci sono meta, non visualizzare nulla
    if (empty($types) && empty($feelings) && empty($places)) {
        return '';
    }

    $output = '<div class="activity-meta">';

    if (!empty($types)) {
        $output .= '<div class="activity-meta__item">';
        $output .= '<span class="activity-meta__label">' . __('Training Types', 'codeandrun-companion') . '</span>';
        $output .= codeandrun_the_training_types($post_id, 'activity-meta__value', false);
        $output .= '</div>';
    }

    if (!empty($feelings)) {
        $output .= '<div class="activity-meta__item">';
        $output .= '<span class="activity-meta__label">' . __('Training Feelings', 'codeandrun-companion') . '</span>';
        $output .= codeandrun_the_training_feelings($post_id, 'activity-meta__value', false);
        $output .= '</div>';
    }

    if (!empty($places)) {
        $output .= '<div class="activity-meta__item">';
        $output .= '<span class="activity-meta__label">' . __('Places', 'codeandrun-companion') . '</span>';
        $output .= codeandrun_the_places($post_id, 'activity-meta__value', ', ', false);
        $output .= '</div>';
    }

    $output .= '</div>';

    if ($echo) {
        echo $output;
    } else {
        return $output;
    }
}

/**
 * Verifica se il post corrente è un'activity con meta fields
 *
 * @param int|null $post_id ID del post (null = post corrente)
 * @return bool True se è un'activity con almeno un meta field
 */
function codeandrun_has_activity_meta($post_id = null) {
    if (!$post_id) {
        $post_id = get_the_ID();
    }

    if (get_post_type($post_id) !== 'activity') {
        return false;
    }

    $types = codeandrun_get_training_types($post_id);
    $feelings = codeandrun_get_training_feelings($post_id);
    $places = codeandrun_get_places($post_id);

    return !empty($types) || !empty($feelings) || !empty($places);
}

/**
 * Ottiene l'emoji del training type per indice
 * Utile per loop su array di allenamenti
 *
 * @param int $index Indice (0-based)
 * @param int|null $post_id ID del post
 * @return string Singolo emoji o stringa vuota
 */
function codeandrun_get_training_type_by_index($index, $post_id = null) {
    $types = codeandrun_get_training_types($post_id);
    if (empty($types)) {
        return '';
    }

    $emoji_array = codeandrun_parse_emoji($types);
    return isset($emoji_array[$index]) ? $emoji_array[$index] : '';
}

/**
 * Ottiene l'emoji del training feeling per indice
 *
 * @param int $index Indice (0-based)
 * @param int|null $post_id ID del post
 * @return string Singolo emoji o stringa vuota
 */
function codeandrun_get_training_feeling_by_index($index, $post_id = null) {
    $feelings = codeandrun_get_training_feelings($post_id);
    if (empty($feelings)) {
        return '';
    }

    $emoji_array = codeandrun_parse_emoji($feelings);
    return isset($emoji_array[$index]) ? $emoji_array[$index] : '';
}

/**
 * Conta quanti allenamenti ci sono (basato su training_types)
 *
 * @param int|null $post_id ID del post
 * @return int Numero di allenamenti
 */
function codeandrun_count_trainings($post_id = null) {
    $types = codeandrun_get_training_types($post_id);
    if (empty($types)) {
        return 0;
    }

    return count(codeandrun_parse_emoji($types));
}
