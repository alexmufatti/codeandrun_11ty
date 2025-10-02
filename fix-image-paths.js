#!/usr/bin/env node

/**
 * Fix Image Paths in WXR
 *
 * Questo script aggiorna i riferimenti alle immagini nel file WXR
 * per puntare al corretto path WordPress
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG = {
  wxrFile: path.join(__dirname, 'wordpress-migration/wordpress-export.xml'),
  wxrFixedFile: path.join(__dirname, 'wordpress-migration/wordpress-export-fixed.xml'),
  imagesBaseUrl: '/wp-content/uploads/eleventy-images/', // Cambia se necessario
  // Oppure usa URL completo: 'https://tuosito.com/wp-content/uploads/eleventy-images/'
};

console.log('🔧 Fixing image paths in WXR file...\n');

// Leggi il file WXR
let wxrContent = fs.readFileSync(CONFIG.wxrFile, 'utf-8');
const originalSize = wxrContent.length;

// Conta quante sostituzioni faremo
let replacements = 0;

// Pattern per trovare i tag img con src relativi
// Sostituisce: <img src="nomefile.jpg" con <img src="/wp-content/uploads/eleventy-images/nomefile.jpg"
wxrContent = wxrContent.replace(
  /<img([^>]*?)src="([^"http][^"]*?)"/g,
  (match, attributes, src) => {
    // Ignora se è già un URL completo o path assoluto
    if (src.startsWith('http') || src.startsWith('/')) {
      return match;
    }

    // Estrai solo il nome file (rimuovi eventuali path relativi)
    const fileName = path.basename(src);
    const newSrc = `${CONFIG.imagesBaseUrl}${fileName}`;

    replacements++;
    return `<img${attributes}src="${newSrc}"`;
  }
);

// Sostituisci anche eventuali reference in figure blocks
wxrContent = wxrContent.replace(
  /<figure class="wp-block-image"><img src="([^"http][^"]*?)"/g,
  (match, src) => {
    if (src.startsWith('http') || src.startsWith('/')) {
      return match;
    }

    const fileName = path.basename(src);
    const newSrc = `${CONFIG.imagesBaseUrl}${fileName}`;

    replacements++;
    return `<figure class="wp-block-image"><img src="${newSrc}"`;
  }
);

// Salva il file corretto
fs.writeFileSync(CONFIG.wxrFixedFile, wxrContent, 'utf-8');

const newSize = wxrContent.length;

console.log('✅ Fix completato!\n');
console.log(`📊 Statistiche:`);
console.log(`   - Riferimenti immagini aggiornati: ${replacements}`);
console.log(`   - Dimensione file originale: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
console.log(`   - Dimensione file nuovo: ${(newSize / 1024 / 1024).toFixed(2)} MB`);
console.log(`\n📁 File generato:`);
console.log(`   ${CONFIG.wxrFixedFile}`);
console.log(`\n🎯 Prossimi passi:`);
console.log(`   1. Carica le immagini su WordPress:`);
console.log(`      $ scp -r wordpress-migration/images/* user@server:${CONFIG.imagesBaseUrl}`);
console.log(`\n   2. Importa il file FIXED in WordPress:`);
console.log(`      Tools → Import → WordPress`);
console.log(`      Carica: wordpress-export-fixed.xml (NON quello originale!)`);
console.log(`\n   3. Se hai già importato quello originale:`);
console.log(`      - Elimina tutti i post/activities`);
console.log(`      - Importa nuovamente con il file fixed`);
console.log(`\n💡 Nota: Se le immagini sono in un path diverso, modifica CONFIG.imagesBaseUrl`);
console.log(`   nel file fix-image-paths.js prima di rieseguirlo.`);
