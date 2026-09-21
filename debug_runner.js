import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');

lines.forEach((l, i) => {
  if (l.includes('buildSeed')) {
    console.log(`${i + 1}: ${l}`);
  }
});
