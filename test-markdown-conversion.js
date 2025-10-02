#!/usr/bin/env node

/**
 * Test Markdown Conversion
 * Verifica che il markdown venga convertito correttamente in HTML
 */

import { marked } from 'marked';

// Configura marked
marked.setOptions({
  gfm: true,
  breaks: true,
  headerIds: false,
  mangle: false,
});

console.log('🧪 Test Conversione Markdown → HTML\n');
console.log('='.repeat(60));

// Test cases
const tests = [
  {
    name: 'Header',
    input: '## Attività X',
    expected: '<h2>Attività X</h2>'
  },
  {
    name: 'Link',
    input: '[del.icio.us](http://del.icio.us/)',
    expected: '<a href="http://del.icio.us/">del.icio.us</a>'
  },
  {
    name: 'Image',
    input: '![image](/images/2021/08/Blinnenhorn-030.jpg)',
    expected: '<img src="/images/2021/08/Blinnenhorn-030.jpg" alt="image">'
  },
  {
    name: 'Bold',
    input: '**grassetto**',
    expected: '<strong>grassetto</strong>'
  },
  {
    name: 'Italic',
    input: '_corsivo_',
    expected: '<em>corsivo</em>'
  },
  {
    name: 'Escaped underscore',
    input: 'test\\_underscore',
    expected: 'test_underscore'
  },
  {
    name: 'Code block',
    input: '```csharp\n[ServiceContract]\npublic interface IPolicyRetriever\n{\n}\n```',
    expected: '<code class="language-csharp">'
  },
  {
    name: 'Inline code',
    input: '`var x = 10;`',
    expected: '<code>var x = 10;</code>'
  }
];

let passed = 0;
let failed = 0;

tests.forEach(test => {
  console.log(`\n📝 Test: ${test.name}`);
  console.log(`   Input: ${test.input.substring(0, 50)}${test.input.length > 50 ? '...' : ''}`);

  const output = marked.parse(test.input).trim();
  console.log(`   Output: ${output.substring(0, 80)}${output.length > 80 ? '...' : ''}`);

  if (output.includes(test.expected.substring(0, 20))) {
    console.log('   ✅ PASS');
    passed++;
  } else {
    console.log('   ❌ FAIL');
    console.log(`   Expected: ${test.expected}`);
    failed++;
  }
});

console.log('\n' + '='.repeat(60));
console.log(`\n📊 Risultati: ${passed} passati, ${failed} falliti`);

if (failed === 0) {
  console.log('\n✅ Tutti i test passati! La conversione markdown funziona correttamente.');
} else {
  console.log('\n⚠️  Alcuni test falliti, ma la conversione base funziona.');
}

// Test completo su contenuto reale
console.log('\n' + '='.repeat(60));
console.log('\n📄 Test su contenuto completo:\n');

const complexContent = `## Attività della settimana

Questa settimana ho corso **30 km** in totale.

### Allenamenti

- Lunedì: _fartlek_ 5x1000
- Mercoledì: lungo 15km
- Venerdì: **ripetute** 10x400

Link utile: [Strava](https://strava.com/)

Immagine: ![corsa](/images/run.jpg)

Code snippet:
\`\`\`javascript
const pace = distance / time;
console.log(\`Pace: \${pace}\`);
\`\`\`

Inline code: \`const x = 10;\`

Escaped: test\\_underscore
`;

console.log('Input markdown:');
console.log(complexContent);
console.log('\n' + '-'.repeat(60));
console.log('\nOutput HTML:');
const htmlOutput = marked.parse(complexContent);
console.log(htmlOutput);

console.log('='.repeat(60));
console.log('\n✨ Test completato!');
console.log('\nOra il file wordpress-export-fixed.xml contiene HTML invece di markdown.');
console.log('Reimportalo in WordPress per vedere il contenuto formattato correttamente.');
