# ✅ Checklist Migrazione WordPress

Usa questa checklist per tracciare il progresso della migrazione.

## Fase 1: Preparazione ✨

- [ ] Hai letto `WORDPRESS-MIGRATION.md`
- [ ] Hai letto `MIGRATION-GUIDE.md` completo
- [ ] Hai un backup del sito Eleventy attuale
- [ ] Hai WordPress installato (versione 5.0+)
- [ ] Hai accesso amministrativo a WordPress
- [ ] Hai PHP 7.4+ sul server

## Fase 2: Test dello Script 🧪

- [ ] Eseguito `npm run migrate:test`
- [ ] Verificato `test-migration/test-report.json`
- [ ] Nessun errore nel test
- [ ] Parser funziona correttamente
- [ ] Shortcodes identificati correttamente

## Fase 3: Esecuzione Migrazione 🚀

- [ ] Eseguito `npm run migrate:wordpress`
- [ ] Generato `wordpress-migration/wordpress-export.xml`
- [ ] Generata cartella `wordpress-migration/images/`
- [ ] Verificato `wordpress-migration/migration-report.json`
- [ ] Controllato numero post: ~80
- [ ] Controllato numero activities: ~500+
- [ ] Controllato numero immagini estratte

## Fase 4: Preparazione WordPress 🔧

### Plugin Obbligatori

- [ ] Installato "WordPress Importer"
- [ ] Attivato "WordPress Importer"
- [ ] Copiato `wordpress-plugin/` in `wp-content/plugins/codeandrun-companion/`
- [ ] Attivato "Code and Run Companion"

### Plugin Consigliati (Opzionali)

- [ ] Yoast SEO o Rank Math (SEO)
- [ ] EWWW Image Optimizer (immagini)
- [ ] WP Rocket (caching)
- [ ] Redirection (redirect 301)

### Configurazioni WordPress

- [ ] Settings → Permalinks → "Post name" selezionato
- [ ] Settings → Media → "Organize uploads" abilitato
- [ ] Settings → Reading → Homepage configurata
- [ ] Creato menu di navigazione

## Fase 5: Importazione Contenuti 📥

### Import WXR

- [ ] Tools → Import → WordPress → "Run Importer"
- [ ] Caricato `wordpress-export.xml`
- [ ] Assegnato autore corretto
- [ ] Spuntato "Download and import file attachments"
- [ ] Importazione completata senza errori
- [ ] Verificato Posts → All Posts (dovrebbero essere ~80)
- [ ] Verificato Activities → All Activities (dovrebbero essere ~500+)

### Import Immagini

- [ ] Caricato `wordpress-migration/images/` via FTP in `wp-content/uploads/eleventy-images/`
- [ ] Verificato permessi cartella (755 per cartelle, 644 per file)
- [ ] Aggiornato riferimenti immagini nel database (vedi MIGRATION-GUIDE.md)
- [ ] Testato alcune immagini: visualizzate correttamente

## Fase 6: Verifica Contenuti ✓

### Posts

- [ ] Post visibili in frontend
- [ ] Post formattati correttamente
- [ ] Immagini visibili nei post
- [ ] Tags corretti
- [ ] Categorie corrette
- [ ] Permalink funzionanti
- [ ] Syntax highlighting codice funzionante

### Activities

- [ ] Activities visibili in frontend
- [ ] Activities formattate correttamente
- [ ] Custom fields popolati (training_types, training_feelings)
- [ ] Immagini in evidenza visibili
- [ ] Shortcodes Strava funzionanti
- [ ] Embed mappe/grafici visualizzati
- [ ] Archivio activities funzionante: `/activities/`

### Shortcodes

- [ ] Test Strava embed: visualizzato correttamente
- [ ] Script Strava caricato (verifica console browser)
- [ ] Test YouTube embed: video visualizzato
- [ ] Figure/immagini con caption: formattate correttamente

## Fase 7: Personalizzazione Template 🎨

- [ ] Creato `single-activity.php` nel theme (se necessario)
- [ ] Creato `archive-activity.php` nel theme (se necessario)
- [ ] Personalizzato CSS per activities (se necessario)
- [ ] Testato layout responsive
- [ ] Verificato su mobile
- [ ] Verificato su tablet

## Fase 8: SEO e Redirect 🔍

### SEO

- [ ] Plugin SEO installato e configurato
- [ ] Meta description configurate
- [ ] Sitemap XML generata
- [ ] Sitemap inviata a Google Search Console
- [ ] Robots.txt configurato
- [ ] Open Graph tags configurati

### Redirect (se URL cambiano)

- [ ] Installato plugin Redirection
- [ ] Creati redirect 301 per post
- [ ] Creati redirect 301 per activities
- [ ] Testato alcuni redirect
- [ ] Monitorato 404 in Search Console

## Fase 9: Performance e Ottimizzazione ⚡

- [ ] Installato plugin caching
- [ ] Configurato caching browser
- [ ] Ottimizzate immagini
- [ ] Rigenerato thumbnail: `wp media regenerate --yes`
- [ ] Minificato CSS/JS
- [ ] Abilitato Gzip/Brotli
- [ ] Test Lighthouse: score > 70
- [ ] Test PageSpeed Insights: performance OK
- [ ] Test GTmetrix: grade B o superiore

## Fase 10: Testing Finale 🎯

### Test Funzionali

- [ ] Homepage caricata correttamente
- [ ] Navigazione menu funzionante
- [ ] Ricerca funzionante
- [ ] Feed RSS funzionante: `/feed/`
- [ ] Archivi per data funzionanti
- [ ] Archivi per tag funzionanti
- [ ] Archivi per categoria funzionanti
- [ ] Paginazione funzionante

### Test Browser

- [ ] Chrome/Edge: tutto OK
- [ ] Firefox: tutto OK
- [ ] Safari: tutto OK
- [ ] Mobile Safari: tutto OK
- [ ] Mobile Chrome: tutto OK

### Test Accessibilità

- [ ] Test lettore schermo (base)
- [ ] Contrasto colori OK
- [ ] Navigazione da tastiera OK
- [ ] Alt text immagini presenti

## Fase 11: Go Live 🚢

### Pre-Launch

- [ ] Backup completo WordPress creato
- [ ] Database esportato
- [ ] File esportati
- [ ] DNS configurato (se serve)
- [ ] SSL/HTTPS configurato
- [ ] Test finale su URL produzione

### Launch

- [ ] Sito WordPress live
- [ ] Vecchio sito Eleventy redirect o disattivato
- [ ] Monitorato errori prime ore
- [ ] Verificato Analytics funzionante
- [ ] Verificato Search Console nessun errore critico

### Post-Launch (1-7 giorni)

- [ ] Monitorato traffico
- [ ] Verificato nessun picco 404
- [ ] Risposto a eventuali issue utenti
- [ ] Performance stabile
- [ ] Indicizzazione Google OK

## Fase 12: Cleanup 🧹

- [ ] Rimosso file migrazione da server WordPress (opzionale)
- [ ] Backup finale WordPress post-migrazione
- [ ] Documentato eventuali customizzazioni
- [ ] Archiviato repository Eleventy
- [ ] Aggiornato documentazione interna

## 🎉 Migrazione Completata!

Congratulazioni! Il tuo blog è ora su WordPress.

### Prossimi Step Raccomandati

1. **Monitoraggio**: primi 30 giorni

   - Google Search Console: errori 404
   - Google Analytics: traffico
   - Performance: uptime e velocità

2. **Manutenzione Regolare**

   - Backup settimanali/giornalieri
   - Aggiornamenti WordPress/plugin mensili
   - Pulizia database trimestrale

3. **Miglioramenti Continui**
   - A/B testing layout
   - Ottimizzazione conversioni
   - Nuove funzionalità basate su feedback

---

**Data migrazione:** ******\_******

## **Note aggiuntive:**

-
- ***

Made for Code and Run - https://codeandrun.it
