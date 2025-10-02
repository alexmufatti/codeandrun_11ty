# 🎉 Guida Completa: Custom Fields nei Template WordPress

## ✅ Cosa È Stato Fatto

Ho aggiunto **funzioni helper complete** per usare facilmente i custom fields `training_types`, `training_feelings` e `places` nei template del tuo tema WordPress, senza dover usare manualmente `get_post_meta()`.

## 📁 File Creati/Modificati

### 1. `template-functions.php` ⭐ NUOVO

Contiene tutte le funzioni helper per i template.

### 2. `codeandrun-companion.php`

Aggiornato per includere `template-functions.php`.

### 3. `TEMPLATE-USAGE.md` ⭐ NUOVO

Guida completa con esempi pratici per ogni scenario.

### 4. `README.md`

Aggiornato con riferimenti alle nuove funzioni.

### 5. `theme-snippets.php`

Già presente, contiene snippet avanzati opzionali.

---

## 🚀 Come Usare nei Template

### Metodo Super Veloce (Consigliato)

Nel tuo template (es: `single-activity.php`):

```php
<?php
// Visualizza TUTTO in un box formattato
codeandrun_the_activity_meta();
?>
```

**Output:**

```
┌─────────────────────────────────────────┐
│ TRAINING TYPES    TRAINING FEELINGS     │
│ 🟢 🔴 🟢          😭 😀 🙂               │
│                                         │
│ PLACES                                  │
│ Lugano, Monte Brè                       │
└─────────────────────────────────────────┘
```

### Funzioni Singole

```php
<?php
// Visualizza solo training types
codeandrun_the_training_types();
// Output: 🟢 🔴 🟢

// Visualizza solo training feelings
codeandrun_the_training_feelings();
// Output: 😭 😀 🙂

// Visualizza solo luoghi
codeandrun_the_places();
// Output: Lugano, Monte Brè

// Controlla se ci sono meta
if (codeandrun_has_activity_meta()) {
    echo "Questa activity ha dei meta!";
}
?>
```

### Ottieni Valori (senza stampare)

```php
<?php
// Ottieni stringhe
$types = codeandrun_get_training_types();      // "🟢,🔴,🟢"
$feelings = codeandrun_get_training_feelings(); // "😭,😀,🙂"
$places = codeandrun_get_places();              // "Lugano, Monte Brè"

// Usa per logica
if (strpos($types, '🔴') !== false) {
    echo "Allenamento intenso!";
}
?>
```

---

## 📋 Esempi Pratici

### Template Singola Activity

**File: `single-activity.php` nel tuo tema**

```php
<?php get_header(); ?>

<main>
    <?php while (have_posts()) : the_post(); ?>

        <article>
            <h1><?php the_title(); ?></h1>
            <time><?php the_date(); ?></time>

            <?php if (has_post_thumbnail()) : ?>
                <?php the_post_thumbnail('large'); ?>
            <?php endif; ?>

            <!-- 🎯 USA QUESTA FUNZIONE! -->
            <?php codeandrun_the_activity_meta(); ?>

            <div class="content">
                <?php the_content(); ?>
            </div>
        </article>

    <?php endwhile; ?>
</main>

<?php get_footer(); ?>
```

### Archive Activities

**File: `archive-activity.php` nel tuo tema**

```php
<?php get_header(); ?>

<main>
    <h1>Attività Running</h1>

    <?php if (have_posts()) : ?>
        <div class="activities-grid">
            <?php while (have_posts()) : the_post(); ?>

                <article class="activity-card">
                    <?php the_post_thumbnail('medium'); ?>
                    <h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
                    <time><?php the_date(); ?></time>

                    <!-- 🎯 Mostra solo training types nella lista -->
                    <?php codeandrun_the_training_types(); ?>

                    <?php the_excerpt(); ?>
                </article>

            <?php endwhile; ?>
        </div>
    <?php endif; ?>
</main>

<?php get_footer(); ?>
```

### Home con Posts + Activities

**File: `index.php` o `home.php` nel tuo tema**

```php
<?php get_header(); ?>

<main>
    <?php if (have_posts()) : ?>
        <?php while (have_posts()) : the_post(); ?>

            <article>
                <h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
                <time><?php the_date(); ?></time>

                <!-- 🎯 Mostra meta SOLO per activities -->
                <?php if (get_post_type() === 'activity') : ?>
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

---

## 🎨 CSS Styling

Aggiungi al `style.css` del tuo tema:

```css
/* Box meta completo */
.activity-meta {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	gap: 1.5rem;
	padding: 2rem;
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
	color: #6c757d;
}

.activity-meta__value {
	font-size: 1.5rem;
}

/* Training emoji */
.training-types,
.training-feelings {
	display: flex;
	gap: 0.5rem;
	font-size: 1.5rem;
}

/* Hover effect sugli emoji */
.training-type-item:hover,
.training-feeling-item:hover {
	transform: scale(1.3);
	transition: transform 0.2s;
}

/* Luoghi */
.places {
	color: #495057;
}

/* Per le card negli archivi */
.activity-card .training-types {
	font-size: 1.2rem;
	margin: 1rem 0;
}

/* Layout responsive */
@media (max-width: 768px) {
	.activity-meta {
		grid-template-columns: 1fr;
	}
}
```

---

## 📚 Funzioni Disponibili

### Funzioni di Visualizzazione (the\_)

| Funzione                             | Cosa fa                           | Parametri                                           |
| ------------------------------------ | --------------------------------- | --------------------------------------------------- |
| `codeandrun_the_activity_meta()`     | Visualizza tutti i meta in un box | `$post_id`, `$echo`                                 |
| `codeandrun_the_training_types()`    | Visualizza training types         | `$post_id`, `$wrapper_class`, `$echo`               |
| `codeandrun_the_training_feelings()` | Visualizza training feelings      | `$post_id`, `$wrapper_class`, `$echo`               |
| `codeandrun_the_places()`            | Visualizza luoghi                 | `$post_id`, `$wrapper_class`, `$separator`, `$echo` |

### Funzioni di Recupero (get\_)

| Funzione                             | Ritorna        | Uso                     |
| ------------------------------------ | -------------- | ----------------------- |
| `codeandrun_get_training_types()`    | Stringa emoji  | Per logica condizionale |
| `codeandrun_get_training_feelings()` | Stringa emoji  | Per logica condizionale |
| `codeandrun_get_places()`            | Stringa luoghi | Per logica condizionale |

### Funzioni Helper

| Funzione                                       | Cosa fa                   |
| ---------------------------------------------- | ------------------------- |
| `codeandrun_has_activity_meta()`               | Verifica se ci sono meta  |
| `codeandrun_count_trainings()`                 | Conta numero allenamenti  |
| `codeandrun_get_training_type_by_index($i)`    | Ottiene emoji per indice  |
| `codeandrun_get_training_feeling_by_index($i)` | Ottiene emoji per indice  |
| `codeandrun_parse_emoji($string)`              | Converte stringa in array |

---

## 🔧 Personalizzazioni

### Cambiare Classi CSS

```php
// Default
<?php codeandrun_the_training_types(); ?>
// Output: <div class="training-types">...</div>

// Custom class
<?php codeandrun_the_training_types(null, 'my-custom-class'); ?>
// Output: <div class="my-custom-class">...</div>
```

### Cambiare Separatore Luoghi

```php
// Default (virgola + spazio)
<?php codeandrun_the_places(); ?>
// Output: Lugano, Monte Brè

// Bullet point
<?php codeandrun_the_places(null, 'places', ' • '); ?>
// Output: Lugano • Monte Brè
```

### Ottenere HTML Senza Stampare

```php
// Return invece di echo
$html = codeandrun_the_training_types(null, 'my-class', false);

// Manipola
if (strpos($html, '🔴') !== false) {
    echo '<div class="intense">' . $html . '</div>';
}
```

---

## 🎯 Casi d'Uso Avanzati

### Loop su Allenamenti Multipli

```php
<?php
$num = codeandrun_count_trainings();

for ($i = 0; $i < $num; $i++) {
    $type = codeandrun_get_training_type_by_index($i);
    $feeling = codeandrun_get_training_feeling_by_index($i);

    echo "Allenamento " . ($i + 1) . ": $type $feeling<br>";
}
?>
```

### Condizioni Basate sui Meta

```php
<?php
$types = codeandrun_get_training_types();

if (strpos($types, '🔴') !== false) {
    echo '<div class="alert">Allenamento intenso!</div>';
}

if (codeandrun_count_trainings() > 3) {
    echo '<div class="badge">Settimana intensa</div>';
}
?>
```

### Query Activities con Meta

```php
<?php
$query = new WP_Query(array(
    'post_type' => 'activity',
    'meta_query' => array(
        array(
            'key' => 'training_feelings',
            'value' => '😀',
            'compare' => 'LIKE'
        )
    )
));

// Trova solo activities con feeling felice
?>
```

---

## 📖 Documentazione Completa

Per esempi dettagliati e casi d'uso specifici, consulta:

- **[TEMPLATE-USAGE.md](TEMPLATE-USAGE.md)** - Guida completa con 8+ esempi
- **[README.md](README.md)** - Documentazione generale del plugin
- **[theme-snippets.php](theme-snippets.php)** - Snippet avanzati opzionali

---

## ✅ Checklist Veloce

Quando crei un template per activities:

- [ ] Includi `<?php codeandrun_the_activity_meta(); ?>` dove serve
- [ ] Controlla con `codeandrun_has_activity_meta()` prima di visualizzare
- [ ] Usa classi CSS del plugin o personalizza
- [ ] Testa con activities che hanno e non hanno meta
- [ ] Verifica responsività mobile

---

## 🆘 Troubleshooting

### Non vedo i meta fields

1. ✅ Verifica che sia un post type 'activity'
2. ✅ Compila i campi nell'editor Gutenberg
3. ✅ Controlla con: `var_dump(codeandrun_get_training_types());`

### Emoji non visualizzati

Aggiungi in `<head>`:

```html
<meta charset="UTF-8" />
```

### Stili non applicati

Controlla che il CSS del plugin sia caricato:

```php
// Nel browser: Ispeziona → Network → Cerca "style.css"
```

---

## 🎊 Conclusione

Ora hai **tutto il necessario** per usare i custom fields nei template!

**Funzione principale da ricordare:**

```php
<?php codeandrun_the_activity_meta(); ?>
```

Questa singola funzione visualizza automaticamente tutti i meta fields in modo formattato. È tutto ciò che ti serve nella maggior parte dei casi! 🚀

---

Made with ❤️ for Code and Run
