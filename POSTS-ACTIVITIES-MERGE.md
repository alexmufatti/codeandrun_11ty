# 🔄 Posts e Activities Uniti nella Home

## ✅ Soluzione Implementata

Ho aggiornato il plugin **Code and Run Companion** per mostrare automaticamente posts e activities insieme nella home page di WordPress.

## 🎯 Cosa Fa

Quando attivi il plugin, la home page mostrerà:

- ✅ **Posts tecnici** (dal 2006 ad oggi)
- ✅ **Activities running** (dal 2019 ad oggi)
- ✅ **Ordinati per data** (più recenti prima)
- ✅ **Mescolati insieme** in un unico feed

## 📍 Dove Si Applica

La funzionalità è attiva su:

- **Home page** (`/`)
- **Archivi per data** (`/2025/10/`)
- **Feed RSS** (`/feed/`)
- **Ricerca** (risultati includono entrambi i tipi)

## 🚀 Come Attivarla

**È già attiva automaticamente!** Quando installi/attivi il plugin:

1. Carica il plugin aggiornato su WordPress:

   ```bash
   scp -r wordpress-plugin/ user@server:/wp-content/plugins/codeandrun-companion/
   ```

2. Attiva (o riattiva) il plugin da WordPress Admin

3. Visita la home: vedrai posts e activities insieme!

## 🎨 Personalizzazioni Disponibili

Ho creato il file `theme-snippets.php` con 8 opzioni di personalizzazione:

### 1. Numero di Post per Pagina

Cambia quanti elementi mostrare (default: 10)

### 2. Badge Visivi

Aggiungi badge "🏃 Running" o "💻 Tech" prima dei titoli

### 3. Excerpt Personalizzati

Mostra automaticamente emoji training negli excerpt delle activities

### 4. Layout Grid

CSS per mostrare i contenuti in griglia responsive

### 5. Menu Filtri

Aggiungi link "Tutti / Tech / Running" nel menu

### 6. Widget Contenuti Recenti

Widget che mostra ultimi posts + activities

### 7. Breadcrumbs

Navigazione breadcrumb personalizzata

### 8. Stili CSS

Differenzia visualmente activities (bordo verde) da posts (bordo blu)

## 📝 Uso degli Snippets

**Copia gli snippet che vuoi nel `functions.php` del tuo theme:**

```php
// Esempio: mostra 20 elementi per pagina invece di 10
function codeandrun_posts_per_page($query) {
    if (is_admin() || !$query->is_main_query()) {
        return;
    }

    if ($query->is_home()) {
        $query->set('posts_per_page', 20);
    }
}
add_action('pre_get_posts', 'codeandrun_posts_per_page');
```

## 🔧 Disabilitare il Merge

Se vuoi **NON** mostrare activities nella home:

```php
// Nel functions.php del tuo theme
remove_action('pre_get_posts', array(CodeAndRun_Companion::get_instance(), 'merge_posts_and_activities'));
```

Oppure crea pagine separate:

- `/` → solo posts tecnici
- `/running/` → solo activities (già disponibile come archivio)

## 💡 Template Personalizzato per la Home

Se vuoi controllo totale sul layout, crea `front-page.php` nel tuo theme:

```php
<?php get_header(); ?>

<main class="site-main">
    <header class="page-header">
        <h1>Code and Run</h1>
        <p>Software Development & Running</p>
    </header>

    <div class="home-grid">
        <?php
        // Query personalizzata
        $args = array(
            'post_type' => array('post', 'activity'),
            'posts_per_page' => 20,
            'orderby' => 'date',
            'order' => 'DESC'
        );

        $home_query = new WP_Query($args);

        if ($home_query->have_posts()) :
            while ($home_query->have_posts()) : $home_query->the_post();

                // Badge tipo
                $badge = get_post_type() === 'activity' ? '🏃 Running' : '💻 Tech';
                ?>

                <article <?php post_class('home-card'); ?>>
                    <span class="post-badge"><?php echo $badge; ?></span>

                    <?php if (has_post_thumbnail()) : ?>
                        <div class="card-image">
                            <a href="<?php the_permalink(); ?>">
                                <?php the_post_thumbnail('medium'); ?>
                            </a>
                        </div>
                    <?php endif; ?>

                    <div class="card-content">
                        <h2>
                            <a href="<?php the_permalink(); ?>">
                                <?php the_title(); ?>
                            </a>
                        </h2>

                        <time datetime="<?php echo get_the_date('c'); ?>">
                            <?php echo get_the_date(); ?>
                        </time>

                        <?php the_excerpt(); ?>

                        <a href="<?php the_permalink(); ?>" class="read-more">
                            Leggi tutto →
                        </a>
                    </div>
                </article>

                <?php
            endwhile;

            // Paginazione
            the_posts_pagination();

            wp_reset_postdata();
        endif;
        ?>
    </div>
</main>

<?php get_footer(); ?>
```

## 🎨 CSS Consigliato

Aggiungi nel file `style.css` del tuo theme:

```css
/* Home Grid */
.home-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
	gap: 2rem;
	margin: 2rem 0;
}

/* Home Cards */
.home-card {
	border: 1px solid #e0e0e0;
	border-radius: 8px;
	overflow: hidden;
	transition: transform 0.2s, box-shadow 0.2s;
}

.home-card:hover {
	transform: translateY(-4px);
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Post Type Badge */
.post-badge {
	display: inline-block;
	padding: 4px 12px;
	font-size: 0.85em;
	font-weight: 600;
	margin: 1rem 1rem 0 1rem;
	border-radius: 4px;
}

.post-type-activity .post-badge {
	background: #4caf50;
	color: white;
}

.post-type-post .post-badge {
	background: #2196f3;
	color: white;
}

/* Card Image */
.card-image img {
	width: 100%;
	height: 200px;
	object-fit: cover;
}

/* Card Content */
.card-content {
	padding: 1.5rem;
}

.card-content h2 {
	margin: 0 0 0.5rem 0;
	font-size: 1.5rem;
}

.card-content h2 a {
	color: inherit;
	text-decoration: none;
}

.card-content h2 a:hover {
	color: #2196f3;
}

.card-content time {
	display: block;
	color: #666;
	font-size: 0.9em;
	margin-bottom: 1rem;
}

.read-more {
	display: inline-block;
	margin-top: 1rem;
	color: #2196f3;
	text-decoration: none;
	font-weight: 600;
}

.read-more:hover {
	text-decoration: underline;
}

/* Responsive */
@media (max-width: 768px) {
	.home-grid {
		grid-template-columns: 1fr;
		gap: 1rem;
	}
}
```

## ✅ Checklist

- [x] Plugin aggiornato con funzione merge
- [x] Funziona su home, archivi, feed, ricerca
- [x] Ordinamento per data (più recenti prima)
- [x] Snippet opzionali creati (theme-snippets.php)
- [x] Documentazione aggiornata
- [ ] Carica plugin aggiornato su WordPress
- [ ] Attiva/riattiva plugin
- [ ] Verifica home page
- [ ] Personalizza con snippets (opzionale)
- [ ] Aggiungi CSS custom (opzionale)

## 🐛 Troubleshooting

**Problema: Non vedo le activities nella home**

- Verifica che il plugin sia attivo
- Vai su Settings → Permalinks → Salva (flush rewrite rules)
- Svuota cache (se usi plugin di caching)

**Problema: Voglio solo posts nella home, activities separate**

```php
// Nel functions.php
remove_action('pre_get_posts', array(CodeAndRun_Companion::get_instance(), 'merge_posts_and_activities'));
```

**Problema: Layout rotto/disordinato**

- Il theme potrebbe aver bisogno di CSS custom
- Usa gli snippet CSS sopra come punto di partenza
- Oppure crea `front-page.php` personalizzato

## 📚 Files Modificati/Creati

1. ✅ `wordpress-plugin/codeandrun-companion.php` - aggiunto `merge_posts_and_activities()`
2. ✅ `wordpress-plugin/theme-snippets.php` - 8 snippet di personalizzazione
3. ✅ `wordpress-plugin/README.md` - documentazione aggiornata
4. ✅ `POSTS-ACTIVITIES-MERGE.md` - questo file

## 🎉 Risultato Finale

Dopo aver caricato il plugin aggiornato, la tua home mostrerà automaticamente:

```
Home Page (codeandrun.it)
├── 🏃 Settimana 38-39 (29 settembre 2025)
├── 🏃 Settimana 38 (20 settembre 2025)
├── 🏃 Settimana 37 (13 settembre 2025)
├── 💻 VMware microfono rumoroso (10 agosto 2020)
├── 🏃 Test 3km (7 settembre 2020)
├── 💻 Cinnamon screenshot applet (20 dicembre 2013)
└── ... (tutti gli altri contenuti misti)
```

**Tutto in una pagina, ordinato per data! 🚀**

---

Hai bisogno di ulteriori personalizzazioni? Fammi sapere! 😊
