#!/usr/bin/env node

/**
 * Test Script - Migrazione Eleventy → WordPress
 *
 * Questo script esegue un test della migrazione su un piccolo subset di contenuti
 * per verificare che tutto funzioni correttamente prima della migrazione completa.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG = {
  contentDir: path.join(__dirname, 'content'),
  postsDir: path.join(__dirname, 'content/posts'),
  activitiesDir: path.join(__dirname, 'content/activities'),
  testOutputDir: path.join(__dirname, 'test-migration'),
  maxPostsToTest: 3,
  maxActivitiesToTest: 3
};

// Parser del front matter (versione semplificata)
function parseFrontMatter(content) {
  const frontMatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontMatterRegex);

  if (!match) {
    return { metadata: {}, content };
  }

  const [, frontMatter, bodyContent] = match;
  const metadata = {};

  const lines = frontMatter.split('\n');
  let currentKey = null;
  let arrayBuffer = [];

  for (let line of lines) {
    if (!line.trim()) continue;

    if (line.trim().startsWith('- ')) {
      if (currentKey) {
        arrayBuffer.push(line.trim().substring(2).trim());
      }
      continue;
    }

    if (currentKey && arrayBuffer.length > 0) {
      metadata[currentKey] = arrayBuffer;
      arrayBuffer = [];
    }

    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();

      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }

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

  if (currentKey && arrayBuffer.length > 0) {
    metadata[currentKey] = arrayBuffer;
  }

  return { metadata, content: bodyContent };
}

// Test parser e conversione shortcodes
function testShortcodes(content) {
  const tests = {
    figure: /\{% figure/.test(content),
    strava: /\{% strava/.test(content),
    youtube: /\{% youtube/.test(content),
  };
  return tests;
}

// Test principale
async function runTests() {
  console.log('🧪 Test Migrazione Eleventy → WordPress\n');
  console.log('=' .repeat(60));

  // Crea directory di output
  if (!fs.existsSync(CONFIG.testOutputDir)) {
    fs.mkdirSync(CONFIG.testOutputDir, { recursive: true });
  }

  const results = {
    posts: [],
    activities: [],
    shortcodes: { figure: 0, strava: 0, youtube: 0 },
    errors: []
  };

  // Test Posts
  console.log('\n📝 Testing Posts...');
  try {
    const postFiles = await glob('**/index.md', { cwd: CONFIG.postsDir });
    const testPosts = postFiles.slice(0, CONFIG.maxPostsToTest);

    for (const file of testPosts) {
      const fullPath = path.join(CONFIG.postsDir, file);
      const content = fs.readFileSync(fullPath, 'utf-8');
      const { metadata, content: bodyContent } = parseFrontMatter(content);

      const shortcodes = testShortcodes(bodyContent);
      if (shortcodes.figure) results.shortcodes.figure++;
      if (shortcodes.strava) results.shortcodes.strava++;
      if (shortcodes.youtube) results.shortcodes.youtube++;

      results.posts.push({
        file,
        title: metadata.title || 'N/A',
        date: metadata.date || 'N/A',
        tags: metadata.tags || [],
        hasShortcodes: shortcodes,
        contentLength: bodyContent.length
      });

      console.log(`   ✓ ${metadata.title || file}`);
    }
  } catch (error) {
    results.errors.push({ section: 'posts', error: error.message });
    console.error(`   ✗ Error: ${error.message}`);
  }

  // Test Activities
  console.log('\n🏃 Testing Activities...');
  try {
    const activityFiles = await glob('**/index.md', { cwd: CONFIG.activitiesDir });
    const testActivities = activityFiles.slice(0, CONFIG.maxActivitiesToTest);

    for (const file of testActivities) {
      const fullPath = path.join(CONFIG.activitiesDir, file);
      const content = fs.readFileSync(fullPath, 'utf-8');
      const { metadata, content: bodyContent } = parseFrontMatter(content);

      const shortcodes = testShortcodes(bodyContent);
      if (shortcodes.figure) results.shortcodes.figure++;
      if (shortcodes.strava) results.shortcodes.strava++;
      if (shortcodes.youtube) results.shortcodes.youtube++;

      results.activities.push({
        file,
        title: metadata.title || 'N/A',
        date: metadata.date || 'N/A',
        trainingTypes: metadata.trainingTypes || [],
        trainingFeelings: metadata.trainingFeelings || [],
        hasShortcodes: shortcodes,
        contentLength: bodyContent.length
      });

      console.log(`   ✓ ${metadata.title || file}`);
    }
  } catch (error) {
    results.errors.push({ section: 'activities', error: error.message });
    console.error(`   ✗ Error: ${error.message}`);
  }

  // Salva risultati
  const reportPath = path.join(CONFIG.testOutputDir, 'test-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2), 'utf-8');

  // Stampa riepilogo
  console.log('\n' + '=' .repeat(60));
  console.log('📊 Riepilogo Test\n');
  console.log(`Posts testati: ${results.posts.length}`);
  console.log(`Activities testate: ${results.activities.length}`);
  console.log(`\nShortcodes trovati:`);
  console.log(`   - Figure: ${results.shortcodes.figure}`);
  console.log(`   - Strava: ${results.shortcodes.strava}`);
  console.log(`   - YouTube: ${results.shortcodes.youtube}`);
  console.log(`\nErrori: ${results.errors.length}`);

  if (results.errors.length > 0) {
    console.log('\n❌ Errori trovati:');
    results.errors.forEach(err => {
      console.log(`   - ${err.section}: ${err.error}`);
    });
  }

  console.log(`\n📄 Report salvato: ${reportPath}`);
  console.log('=' .repeat(60));

  // Esempi di contenuto
  console.log('\n📋 Esempio Post:');
  if (results.posts[0]) {
    console.log(JSON.stringify(results.posts[0], null, 2));
  }

  console.log('\n📋 Esempio Activity:');
  if (results.activities[0]) {
    console.log(JSON.stringify(results.activities[0], null, 2));
  }

  // Verifica finale
  console.log('\n✅ Test completato!');
  console.log('\nSe i risultati sono OK, esegui la migrazione completa:');
  console.log('   node migrate-to-wordpress.js\n');

  return results.errors.length === 0;
}

// Run
runTests().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
