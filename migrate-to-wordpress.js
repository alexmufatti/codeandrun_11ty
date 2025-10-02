#!/usr/bin/env node

/**
 * Eleventy to WordPress Migration Script
 *
 * Questo script migra il blog Eleventy (posts + activities) in formato WordPress WXR
 *
 * Output:
 * - wordpress-export.xml (file WXR importabile in WordPress)
 * - wordpress-images/ (cartella con tutte le immagini)
 * - migration-report.json (report dettagliato della migrazione)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';
import { marked } from 'marked';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurazione
const CONFIG = {
  contentDir: path.join(__dirname, 'content'),
  postsDir: path.join(__dirname, 'content/posts'),
  activitiesDir: path.join(__dirname, 'content/activities'),
  outputDir: path.join(__dirname, 'wordpress-migration'),
  imagesDir: path.join(__dirname, 'wordpress-migration/images'),
  wxrFile: path.join(__dirname, 'wordpress-migration/wordpress-export.xml'),
  reportFile: path.join(__dirname, 'wordpress-migration/migration-report.json'),
  siteUrl: 'https://codeandrun.it',
  siteName: 'Code and Run',
  siteDescription: 'Software Development & Running',
  author: {
    login: 'alexmufatti',
    email: 'me@alexmufatti.it',
    displayName: 'Alex Mufatti',
    firstName: 'Alex',
    lastName: 'Mufatti'
  }
};

// Utilities
class MigrationStats {
  constructor() {
    this.posts = 0;
    this.activities = 0;
    this.images = 0;
    this.errors = [];
    this.warnings = [];
  }

  addError(file, message) {
    this.errors.push({ file, message });
  }

  addWarning(file, message) {
    this.warnings.push({ file, message });
  }

  toJSON() {
    return {
      summary: {
        totalPosts: this.posts,
        totalActivities: this.activities,
        totalImages: this.images,
        totalErrors: this.errors.length,
        totalWarnings: this.warnings.length
      },
      errors: this.errors,
      warnings: this.warnings
    };
  }
}

const stats = new MigrationStats();

// Configura marked per output WordPress-friendly
marked.setOptions({
  gfm: true, // GitHub Flavored Markdown
  breaks: true, // Converti line breaks in <br>
  headerIds: false, // Non aggiungere ID agli header
  mangle: false, // Non modificare email addresses
});

// Parser del front matter
function parseFrontMatter(content) {
  const frontMatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontMatterRegex);

  if (!match) {
    return { metadata: {}, content };
  }

  const [, frontMatter, bodyContent] = match;
  const metadata = {};

  // Parse YAML-like front matter
  const lines = frontMatter.split('\n');
  let currentKey = null;
  let arrayBuffer = [];

  for (let line of lines) {
    // Skip empty lines
    if (!line.trim()) continue;

    // Array items
    if (line.trim().startsWith('- ')) {
      if (currentKey) {
        arrayBuffer.push(line.trim().substring(2).trim());
      }
      continue;
    }

    // Save previous array
    if (currentKey && arrayBuffer.length > 0) {
      metadata[currentKey] = arrayBuffer;
      arrayBuffer = [];
    }

    // Key-value pairs
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();

      // Remove quotes
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }

      // Handle arrays in single line
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1).split(',').map(v => v.trim()).filter(Boolean);
      }

      currentKey = key;

      if (value) {
        metadata[key] = value;
      } else {
        arrayBuffer = [];
      }
    }
  }

  // Save last array
  if (currentKey && arrayBuffer.length > 0) {
    metadata[currentKey] = arrayBuffer;
  }

  return { metadata, content: bodyContent };
}

// Converti shortcodes Eleventy in HTML/shortcodes WordPress + Markdown to HTML
function convertShortcodes(content, basePath) {
  let converted = content;
  const imageReferences = [];

  // PLACEHOLDER per proteggere HTML e shortcodes dalla conversione markdown
  // Usiamo un placeholder che non verrà interpretato da marked: commento HTML
  const placeholders = [];
  let placeholderIndex = 0;

  // Proteggi {% figure %} - supporta sia ' che "
  converted = converted.replace(
    /\{%\s*figure\s*\{\s*src:\s*['"]([^'"]+)['"](?:\s*,\s*title:\s*['"]([^'"]+)['"])?\s*\}\s*%\}/g,
    (match, src, title) => {
      imageReferences.push(src);
      const alt = title || '';
      const caption = title ? `<figcaption>${escapeXml(title)}</figcaption>` : '';
      const html = `<figure class="wp-block-image"><img src="${src}" alt="${escapeXml(alt)}" />${caption}</figure>`;
      const placeholder = `<!--PLACEHOLDER_${placeholderIndex}-->`;
      placeholders[placeholderIndex] = html;
      placeholderIndex++;
      return placeholder;
    }
  );

  // Proteggi {% strava %} - supporta sia ' che " e noEmbed opzionale
  converted = converted.replace(
    /\{%\s*strava\s*\{\s*id:\s*['"]([^'"]+)['"](?:\s*,\s*embedId:\s*['"]([^'"]+)['"])?(?:\s*,\s*noEmbed:\s*(?:true|false))?\s*\}\s*%\}/g,
    (match, id, embedId) => {
      const shortcode = `[strava id="${id}" embed_id="${embedId || ''}"]`;
      const placeholder = `<!--PLACEHOLDER_${placeholderIndex}-->`;
      placeholders[placeholderIndex] = shortcode;
      placeholderIndex++;
      return placeholder;
    }
  );

  // Proteggi {% youtube %} - supporta sia ' che "
  converted = converted.replace(
    /\{%\s*youtube\s*\{\s*id:\s*['"]([^'"]+)['"](?:\s*,\s*title:\s*['"]([^'"]+)['"])?\s*\}\s*%\}/g,
    (match, id, title) => {
      const shortcode = `[youtube id="${id}"]`;
      const placeholder = `<!--PLACEHOLDER_${placeholderIndex}-->`;
      placeholders[placeholderIndex] = shortcode;
      placeholderIndex++;
      return placeholder;
    }
  );

  // CONVERTI MARKDOWN IN HTML
  try {
    // marked.parse converte tutto il markdown in HTML
    converted = marked.parse(converted);

    // Ripristina i placeholder (commenti HTML) con l'HTML/shortcode originale
    placeholders.forEach((html, index) => {
      // I commenti HTML vengono preservati da marked, quindi basta sostituirli
      converted = converted.replace(
        new RegExp(`<!--PLACEHOLDER_${index}-->`, 'g'),
        html
      );
    });
  } catch (error) {
    console.warn('Warning: markdown conversion failed for content, using as-is');
  }

  return { content: converted, imageReferences };
}

// Escape XML
function escapeXml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Formatta data per WordPress
function formatDate(dateStr) {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return new Date().toISOString();
  }
  return date.toISOString();
}

// Estrai excerpt (contenuto prima di <!--more-->)
function extractExcerpt(content) {
  const moreTag = content.indexOf('<!--more-->');
  if (moreTag === -1) {
    // Primi 200 caratteri se non c'è il tag
    return content.substring(0, 200).trim() + '...';
  }
  return content.substring(0, moreTag).trim();
}

// Processa un singolo file markdown
async function processMarkdownFile(filePath, type = 'post') {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const { metadata, content: bodyContent } = parseFrontMatter(content);

    const dirName = path.dirname(filePath);
    const { content: convertedContent, imageReferences } = convertShortcodes(bodyContent, dirName);

    // Estrai lo slug dalla cartella (es: "2025-09-20-settimana_38" diventa "2025-09-20-settimana_38")
    // La cartella è il parent del file index.md
    const folderName = path.basename(dirName);

    // Copia immagini
    for (const imgRef of imageReferences) {
      if (!imgRef.startsWith('http')) {
        const imgPath = path.join(dirName, imgRef);
        if (fs.existsSync(imgPath)) {
          const imgDest = path.join(CONFIG.imagesDir, path.basename(imgPath));
          fs.copyFileSync(imgPath, imgDest);
          stats.images++;
        }
      }
    }

    // Gestisci feature_image
    let featuredImageUrl = null;
    if (metadata.feature_image) {
      const imgPath = path.join(dirName, metadata.feature_image);
      if (fs.existsSync(imgPath)) {
        const imgBasename = path.basename(imgPath);
        const imgDest = path.join(CONFIG.imagesDir, imgBasename);
        fs.copyFileSync(imgPath, imgDest);
        stats.images++;
        // URL WordPress per featured image
        featuredImageUrl = `/wp-content/uploads/eleventy-images/${imgBasename}`;
      }
    }

    const post = {
      title: metadata.title || 'Untitled',
      date: formatDate(metadata.date || fs.statSync(filePath).birthtime),
      content: convertedContent,
      excerpt: extractExcerpt(convertedContent),
      tags: Array.isArray(metadata.tags) ? metadata.tags : [],
      categories: type === 'activity' ? ['Running', 'Sport'] : ['Blog'],
      status: metadata.draft ? 'draft' : 'publish',
      type: type === 'activity' ? 'activity' : 'post',
      customFields: {},
      featured_image: featuredImageUrl,
      slug: folderName // Usa il nome della cartella come slug
    };

    // Custom fields per activities
    if (type === 'activity') {
      if (metadata.trainingTypes) {
        post.customFields.training_types = Array.isArray(metadata.trainingTypes)
          ? metadata.trainingTypes.join(',')
          : metadata.trainingTypes;
      }
      if (metadata.trainingFeelings) {
        post.customFields.training_feelings = Array.isArray(metadata.trainingFeelings)
          ? metadata.trainingFeelings.join(',')
          : metadata.trainingFeelings;
      }
      if (metadata.places) {
        post.customFields.places = Array.isArray(metadata.places)
          ? metadata.places.join(',')
          : metadata.places;
      }
    }

    if (type === 'activity') {
      stats.activities++;
    } else {
      stats.posts++;
    }

    return post;
  } catch (error) {
    stats.addError(filePath, error.message);
    console.error(`Error processing ${filePath}:`, error.message);
    return null;
  }
}

// Genera WXR XML
function generateWXR(posts) {
  const now = new Date().toISOString();
  let postId = 1;

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:excerpt="http://wordpress.org/export/1.2/excerpt/"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:wfw="http://wellformedweb.org/CommentAPI/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:wp="http://wordpress.org/export/1.2/">

  <channel>
    <title>${escapeXml(CONFIG.siteName)}</title>
    <link>${CONFIG.siteUrl}</link>
    <description>${escapeXml(CONFIG.siteDescription)}</description>
    <pubDate>${now}</pubDate>
    <language>it-IT</language>
    <wp:wxr_version>1.2</wp:wxr_version>
    <wp:base_site_url>${CONFIG.siteUrl}</wp:base_site_url>
    <wp:base_blog_url>${CONFIG.siteUrl}</wp:base_blog_url>

    <wp:author>
      <wp:author_id>1</wp:author_id>
      <wp:author_login><![CDATA[${CONFIG.author.login}]]></wp:author_login>
      <wp:author_email><![CDATA[${CONFIG.author.email}]]></wp:author_email>
      <wp:author_display_name><![CDATA[${CONFIG.author.displayName}]]></wp:author_display_name>
      <wp:author_first_name><![CDATA[${CONFIG.author.firstName}]]></wp:author_first_name>
      <wp:author_last_name><![CDATA[${CONFIG.author.lastName}]]></wp:author_last_name>
    </wp:author>

`;

  // Categorie uniche
  const categories = new Set();
  posts.forEach(post => {
    if (post.categories) {
      post.categories.forEach(cat => categories.add(cat));
    }
  });

  let catId = 1;
  const categoryMap = {};
  categories.forEach(cat => {
    const slug = cat.toLowerCase().replace(/\s+/g, '-');
    categoryMap[cat] = catId;
    xml += `    <wp:category>
      <wp:term_id>${catId}</wp:term_id>
      <wp:category_nicename><![CDATA[${slug}]]></wp:category_nicename>
      <wp:category_parent><![CDATA[]]></wp:category_parent>
      <wp:cat_name><![CDATA[${escapeXml(cat)}]]></wp:cat_name>
    </wp:category>

`;
    catId++;
  });

  // Tags unici
  const tags = new Set();
  posts.forEach(post => {
    if (post.tags) {
      post.tags.forEach(tag => tags.add(tag));
    }
  });

  let tagId = 1;
  const tagMap = {};
  tags.forEach(tag => {
    const slug = tag.toLowerCase().replace(/\s+/g, '-');
    tagMap[tag] = tagId;
    xml += `    <wp:tag>
      <wp:term_id>${tagId}</wp:term_id>
      <wp:tag_slug><![CDATA[${slug}]]></wp:tag_slug>
      <wp:tag_name><![CDATA[${escapeXml(tag)}]]></wp:tag_name>
    </wp:tag>

`;
    tagId++;
  });

  // Posts (salviamo la featured_image URL come postmeta temporaneo)
  posts.forEach(post => {
    if (!post) return;

    // Usa lo slug dalla cartella invece di generarlo dal titolo
    const postSlug = post.slug || post.title.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 200);

    xml += `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${CONFIG.siteUrl}/${postSlug}/</link>
      <pubDate>${post.date}</pubDate>
      <dc:creator><![CDATA[${CONFIG.author.login}]]></dc:creator>
      <guid isPermaLink="false">${CONFIG.siteUrl}/?p=${postId}</guid>
      <description></description>
      <content:encoded><![CDATA[${post.content}]]></content:encoded>
      <excerpt:encoded><![CDATA[${post.excerpt}]]></excerpt:encoded>
      <wp:post_id>${postId}</wp:post_id>
      <wp:post_date><![CDATA[${post.date}]]></wp:post_date>
      <wp:post_date_gmt><![CDATA[${post.date}]]></wp:post_date_gmt>
      <wp:post_modified><![CDATA[${post.date}]]></wp:post_modified>
      <wp:post_modified_gmt><![CDATA[${post.date}]]></wp:post_modified_gmt>
      <wp:comment_status><![CDATA[open]]></wp:comment_status>
      <wp:ping_status><![CDATA[open]]></wp:ping_status>
      <wp:post_name><![CDATA[${postSlug}]]></wp:post_name>
      <wp:status><![CDATA[${post.status}]]></wp:status>
      <wp:post_parent>0</wp:post_parent>
      <wp:menu_order>0</wp:menu_order>
      <wp:post_type><![CDATA[${post.type}]]></wp:post_type>
      <wp:post_password><![CDATA[]]></wp:post_password>
      <wp:is_sticky>0</wp:is_sticky>
`;

    // Categorie
    if (post.categories) {
      post.categories.forEach(cat => {
        const slug = cat.toLowerCase().replace(/\s+/g, '-');
        xml += `      <category domain="category" nicename="${slug}"><![CDATA[${escapeXml(cat)}]]></category>\n`;
      });
    }

    // Tags
    if (post.tags) {
      post.tags.forEach(tag => {
        const slug = tag.toLowerCase().replace(/\s+/g, '-');
        xml += `      <category domain="post_tag" nicename="${slug}"><![CDATA[${escapeXml(tag)}]]></category>\n`;
      });
    }

    // Custom fields
    if (post.customFields) {
      Object.entries(post.customFields).forEach(([key, value]) => {
        xml += `      <wp:postmeta>
        <wp:meta_key><![CDATA[${key}]]></wp:meta_key>
        <wp:meta_value><![CDATA[${value}]]></wp:meta_value>
      </wp:postmeta>
`;
      });
    }

    // Featured image URL - salviamo come postmeta temporaneo
    // Dopo l'import userai uno script PHP per creare gli attachment
    if (post.featured_image) {
      xml += `      <wp:postmeta>
        <wp:meta_key><![CDATA[_featured_image_url]]></wp:meta_key>
        <wp:meta_value><![CDATA[${post.featured_image}]]></wp:meta_value>
      </wp:postmeta>
`;
    }

    xml += `    </item>

`;
    postId++;
  });

  xml += `  </channel>
</rss>`;

  return xml;
}

// Main execution
async function migrate() {
  console.log('🚀 Iniziando migrazione Eleventy → WordPress...\n');

  // Crea directory di output
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
  }
  if (!fs.existsSync(CONFIG.imagesDir)) {
    fs.mkdirSync(CONFIG.imagesDir, { recursive: true });
  }

  console.log('📝 Processando posts...');
  const postFiles = await glob('**/index.md', { cwd: CONFIG.postsDir });
  const posts = [];

  for (const file of postFiles) {
    const fullPath = path.join(CONFIG.postsDir, file);
    const post = await processMarkdownFile(fullPath, 'post');
    if (post) posts.push(post);
  }

  console.log(`✅ ${stats.posts} posts processati\n`);

  console.log('🏃 Processando activities...');
  const activityFiles = await glob('**/index.md', { cwd: CONFIG.activitiesDir });

  for (const file of activityFiles) {
    const fullPath = path.join(CONFIG.activitiesDir, file);
    const activity = await processMarkdownFile(fullPath, 'activity');
    if (activity) posts.push(activity);
  }

  console.log(`✅ ${stats.activities} activities processate\n`);

  console.log('🖼️  Generando XML WXR...');
  const wxr = generateWXR(posts);
  fs.writeFileSync(CONFIG.wxrFile, wxr, 'utf-8');
  console.log(`✅ File WXR generato: ${CONFIG.wxrFile}\n`);

  console.log('📊 Generando report...');
  const report = stats.toJSON();
  fs.writeFileSync(CONFIG.reportFile, JSON.stringify(report, null, 2), 'utf-8');
  console.log(`✅ Report salvato: ${CONFIG.reportFile}\n`);

  console.log('=' .repeat(60));
  console.log('✨ MIGRAZIONE COMPLETATA!\n');
  console.log(`📊 Statistiche:`);
  console.log(`   - Posts: ${stats.posts}`);
  console.log(`   - Activities: ${stats.activities}`);
  console.log(`   - Immagini: ${stats.images}`);
  console.log(`   - Errori: ${stats.errors.length}`);
  console.log(`   - Warning: ${stats.warnings.length}`);
  console.log('\n📁 Output generato in:', CONFIG.outputDir);
  console.log('\n📖 Prossimi passi:');
  console.log('   1. Installa WordPress');
  console.log('   2. Installa plugin "WordPress Importer"');
  console.log('   3. Vai su Tools → Import → WordPress');
  console.log('   4. Carica il file wordpress-export.xml');
  console.log('   5. Carica le immagini dalla cartella images/');
  console.log('   6. [OPZIONALE] Installa plugin per custom post type "activity"');
  console.log('   7. [OPZIONALE] Crea shortcodes per Strava embed');
  console.log('=' .repeat(60));
}

// Aggiungi supporto per glob
async function installGlob() {
  try {
    await import('glob');
  } catch {
    console.log('📦 Installando dipendenze necessarie...');
    const { execSync } = await import('child_process');
    execSync('npm install glob', { stdio: 'inherit' });
  }
}

// Run
installGlob().then(() => migrate()).catch(console.error);
