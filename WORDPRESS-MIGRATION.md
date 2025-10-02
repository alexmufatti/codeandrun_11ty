# 🚀 Migrazione Eleventy → WordPress

Questo repository contiene tutti gli strumenti necessari per migrare il blog "Code and Run" da Eleventy a WordPress.

## 📦 Cosa è Incluso

### 1. Script di Migrazione

- **`migrate-to-wordpress.js`** - Script principale per esportare contenuti in formato WXR
- **`test-migration.js`** - Script di test su un subset di contenuti

### 2. Plugin WordPress

- **`wordpress-plugin/`** - Plugin "Code and Run Companion"
  - Custom Post Type "Activity" per attività running
  - Shortcodes per Strava e YouTube
  - Custom fields per dati allenamento
  - Stili CSS inclusi

### 3. Documentazione

- **`MIGRATION-GUIDE.md`** - Guida completa passo-passo
- **`wordpress-plugin/README.md`** - Documentazione plugin

## ⚡ Quick Start

### Test (Consigliato Prima)

```bash
# Testa la migrazione su 3 post + 3 activities
node test-migration.js
```

### Migrazione Completa

```bash
# Esporta tutti i contenuti in WordPress WXR format
node migrate-to-wordpress.js
```

Output generato in `wordpress-migration/`:

- `wordpress-export.xml` - File da importare in WordPress
- `images/` - Tutte le immagini estratte
- `migration-report.json` - Report dettagliato

## 📖 Processo Completo

1. **Esporta da Eleventy** (qui)

   ```bash
   node migrate-to-wordpress.js
   ```

2. **Prepara WordPress**

   - Installa WordPress
   - Installa plugin "WordPress Importer"
   - Copia `wordpress-plugin/` in `wp-content/plugins/`
   - Attiva "Code and Run Companion" plugin

3. **Importa in WordPress**

   - Tools → Import → WordPress
   - Carica `wordpress-export.xml`
   - Carica immagini da `images/` folder

4. **Verifica e Personalizza**
   - Verifica post e activities
   - Personalizza template
   - Configura permalink

👉 **Leggi la guida completa:** [MIGRATION-GUIDE.md](./MIGRATION-GUIDE.md)

## 📊 Contenuti da Migrare

In base al tuo blog:

- **~80 post tecnici** (2006-2025)
- **~500+ attività running** (2019-2025)
- **~1000+ immagini**
- **Tags, categorie, metadata**
- **Shortcodes** (Strava, YouTube, figure)

## 🛠️ Funzionalità Plugin WordPress

Il plugin "Code and Run Companion" aggiunge:

### Custom Post Type: Activity

```php
// Query activities
$activities = new WP_Query(array(
    'post_type' => 'activity',
    'posts_per_page' => 10
));
```

### Shortcodes

```
[strava id="123456789" embed_id="abc123"]
[youtube id="VIDEO_ID"]
```

### Custom Fields

- `training_types` - 🟢🔴🟡 emoji allenamento
- `training_feelings` - 😀🙂😭 emoji sensazioni
- `places` - Lista luoghi

## 📝 Struttura File

```
.
├── migrate-to-wordpress.js       # Script principale migrazione
├── test-migration.js             # Script di test
├── MIGRATION-GUIDE.md            # Guida completa
│
├── wordpress-plugin/             # Plugin WordPress
│   ├── codeandrun-companion.php  # File principale plugin
│   ├── assets/
│   │   └── style.css             # Stili plugin
│   └── README.md                 # Doc plugin
│
└── wordpress-migration/          # Output (generato)
    ├── wordpress-export.xml      # File WXR
    ├── images/                   # Immagini
    └── migration-report.json     # Report
```

## 🔍 Verifiche Post-Migrazione

- [ ] Post visibili e formattati
- [ ] Activities visibili con custom fields
- [ ] Immagini caricate e visualizzate
- [ ] Shortcodes Strava funzionanti
- [ ] Tags e categorie corrette
- [ ] Permalink funzionanti
- [ ] Performance accettabili

## 💡 Tips

1. **Testa prima**: usa `test-migration.js` per verificare
2. **Backup**: mantieni il sito Eleventy attivo durante la migrazione
3. **Staging**: prova su ambiente di test prima
4. **Graduale**: migra prima i post, poi le activities
5. **Monitoring**: usa Google Search Console per errori 404

## 🐛 Troubleshooting

### Immagini non visualizzate

```bash
chmod 755 wp-content/uploads/
wp media regenerate --yes
```

### Shortcodes Strava non funzionano

- Verifica plugin attivo
- Console browser: controlla errori JS
- Script Strava caricato

### Custom Post Type non visibile

```
Settings → Permalinks → Save Changes
(flush rewrite rules)
```

## 📞 Supporto

Controlla:

1. `migration-report.json` per errori specifici
2. Log WordPress: `wp-content/debug.log`
3. Console browser per errori JavaScript

## 🎯 Prossimi Passi

Dopo aver letto questo README:

1. 📖 Leggi [MIGRATION-GUIDE.md](./MIGRATION-GUIDE.md) completo
2. 🧪 Esegui `node test-migration.js`
3. 📦 Prepara ambiente WordPress
4. 🚀 Esegui `node migrate-to-wordpress.js`
5. 📥 Importa in WordPress
6. ✅ Verifica risultati

---

**Good luck with your migration! 🎉**

Made for Code and Run - https://codeandrun.it
