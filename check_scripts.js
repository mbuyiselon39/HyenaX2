import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');
console.log('HTML size:', html.length);

const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let match;
let count = 0;

while ((match = scriptRegex.exec(html)) !== null) {
  count++;
  const fullTag = match[0];
  const content = match[1];
  const srcMatch = fullTag.match(/src=["']([^"']+)["']/i);
  const typeMatch = fullTag.match(/type=["']([^"']+)["']/i);
  
  console.log(`\n--- Script ${count} ---`);
  if (typeMatch) console.log('Type:', typeMatch[1]);
  if (srcMatch) {
    console.log('Src:', srcMatch[1]);
  } else {
    console.log('Inline script, length:', content.length);
    // Check if it's JS
    if (!typeMatch || typeMatch[1].includes('javascript') || typeMatch[1] === '') {
      try {
        new Function(content);
        console.log('Syntax: OK');
      } catch (err) {
        console.error('Syntax ERROR:', err.message);
      }
    }
  }
}
