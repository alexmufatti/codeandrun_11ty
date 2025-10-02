# 🎯 Cheat Sheet: Funzioni Template

## Una Funzione per Tutto

```php
<?php codeandrun_the_activity_meta(); ?>
```

Visualizza training_types, training_feelings e places in un box formattato.

---

## Funzioni Singole

```php
<?php codeandrun_the_training_types(); ?>      // 🟢 🔴 🟢
<?php codeandrun_the_training_feelings(); ?>   // 😭 😀 🙂
<?php codeandrun_the_places(); ?>              // Lugano, Monte Brè
```

---

## Ottieni Valori

```php
<?php
$types = codeandrun_get_training_types();
$feelings = codeandrun_get_training_feelings();
$places = codeandrun_get_places();
?>
```

---

## Controlli

```php
<?php
// Ha meta fields?
if (codeandrun_has_activity_meta()) { ... }

// Quanti allenamenti?
$n = codeandrun_count_trainings();

// È un'activity?
if (get_post_type() === 'activity') { ... }
?>
```

---

## Template Base

### single-activity.php

```php
<?php get_header(); ?>

<?php while (have_posts()) : the_post(); ?>
    <h1><?php the_title(); ?></h1>
    <?php the_post_thumbnail(); ?>
    <?php codeandrun_the_activity_meta(); ?>
    <?php the_content(); ?>
<?php endwhile; ?>

<?php get_footer(); ?>
```

### archive-activity.php

```php
<?php get_header(); ?>

<h1>Running Activities</h1>

<?php while (have_posts()) : the_post(); ?>
    <article>
        <h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
        <?php codeandrun_the_training_types(); ?>
        <?php the_excerpt(); ?>
    </article>
<?php endwhile; ?>

<?php get_footer(); ?>
```

### home.php (posts + activities)

```php
<?php get_header(); ?>

<?php while (have_posts()) : the_post(); ?>
    <article>
        <h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>

        <?php if (get_post_type() === 'activity') : ?>
            <?php codeandrun_the_training_types(); ?>
        <?php endif; ?>

        <?php the_excerpt(); ?>
    </article>
<?php endwhile; ?>

<?php get_footer(); ?>
```

---

## CSS Essenziale

```css
.activity-meta {
	padding: 2rem;
	background: #f8f9fa;
	border-radius: 8px;
	margin: 2rem 0;
}

.training-types,
.training-feelings {
	font-size: 1.5rem;
	display: flex;
	gap: 0.5rem;
}
```

---

## Docs Completi

- [QUICK-START-TEMPLATES.md](QUICK-START-TEMPLATES.md) - Guida illustrata completa
- [TEMPLATE-USAGE.md](TEMPLATE-USAGE.md) - Esempi avanzati
- [README.md](README.md) - Documentazione generale
