#!/usr/bin/env node

// Test regex per shortcode

const testCases = [
  `{% figure { src: 'image.jpg', title: 'Caption' } %}`,
  `{% figure { src: "image.jpg", title: "Caption" } %}`,
  `{% strava { id: '12067827538', embedId: '2bb086f62fabb4a387b68f85177d96945e295238' } %}`,
  `{% strava { id: "12067827538", embedId: "2bb086f62fabb4a387b68f85177d96945e295238" } %}`,
  `{% strava { id: '11562742420', embedId: 'fe7a11f243910d2c8edbff87947126ab4a236260', noEmbed: true } %}`,
  `{% youtube { id: 'videoId', title: 'Title' } %}`,
];

// Regex attuali
const figureRegex = /\{%\s*figure\s*\{\s*src:\s*['"]([^'"]+)['"](?:\s*,\s*title:\s*['"]([^'"]+)['"])?\s*\}\s*%\}/g;
const stravaRegex = /\{%\s*strava\s*\{\s*id:\s*['"]([^'"]+)['"](?:\s*,\s*embedId:\s*['"]([^'"]+)['"])?(?:\s*,\s*noEmbed:\s*(?:true|false))?\s*\}\s*%\}/g;
const youtubeRegex = /\{%\s*youtube\s*\{\s*id:\s*['"]([^'"]+)['"](?:\s*,\s*title:\s*['"]([^'"]+)['"])?\s*\}\s*%\}/g;

console.log('🧪 Test Regex Shortcode\n');
console.log('='.repeat(60));

testCases.forEach((test, index) => {
  console.log(`\n${index + 1}. Input: ${test}`);

  if (test.includes('figure')) {
    const match = figureRegex.exec(test);
    figureRegex.lastIndex = 0;
    console.log(`   Figure Match: ${match ? '✅ YES' : '❌ NO'}`);
    if (match) console.log(`   - src: ${match[1]}, title: ${match[2]}`);
  } else if (test.includes('strava')) {
    const match = stravaRegex.exec(test);
    stravaRegex.lastIndex = 0;
    console.log(`   Strava Match: ${match ? '✅ YES' : '❌ NO'}`);
    if (match) console.log(`   - id: ${match[1]}, embedId: ${match[2]}`);
  } else if (test.includes('youtube')) {
    const match = youtubeRegex.exec(test);
    youtubeRegex.lastIndex = 0;
    console.log(`   YouTube Match: ${match ? '✅ YES' : '❌ NO'}`);
    if (match) console.log(`   - id: ${match[1]}, title: ${match[2]}`);
  }
});

console.log('\n' + '='.repeat(60));
