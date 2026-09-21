import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');

// Match attribute with double quotes: name="..." or single quotes: name='...'
const attrDoubleRegex = /\s(:[a-zA-Z0-9_\-\.]+|@[a-zA-Z0-9_\-\.]+|x-[a-zA-Z0-9_\-\.]+)\s*=\s*"([^"]*)"/g;
const attrSingleRegex = /\s(:[a-zA-Z0-9_\-\.]+|@[a-zA-Z0-9_\-\.]+|x-[a-zA-Z0-9_\-\.]+)\s*=\s*'([^']*)'/g;

function checkMatch(dir, rawExpr, index) {
  let expr = rawExpr.trim();
  if (!expr) return;

  if (dir === 'x-for') {
    const forMatch = expr.match(/^\s*(?:\(?\s*([$\w]+)\s*(?:,\s*([$\w]+))?\s*\)?)\s+in\s+([\s\S]+)$/);
    if (forMatch) {
      expr = forMatch[3];
    }
  }

  expr = expr.replace(/&amp;/g, '&')
             .replace(/&lt;/g, '<')
             .replace(/&gt;/g, '>')
             .replace(/&quot;/g, '"')
             .replace(/&#39;/g, "'");

  try {
    new Function(`
      const $data = {};
      const $el = {};
      const $event = {};
      const $dispatch = () => {};
      const $nextTick = () => {};
      const $watch = () => {};
      with ($data) {
        return (${expr});
      }
    `);
  } catch (err1) {
    try {
      new Function(`
        const $data = {};
        const $el = {};
        const $event = {};
        const $dispatch = () => {};
        const $nextTick = () => {};
        const $watch = () => {};
        with ($data) {
          ${expr};
        }
      `);
    } catch (err2) {
      const lineNum = html.substring(0, index).split('\n').length;
      console.error(`\n[SYNTAX ERROR] at line ${lineNum}: ${dir}="${rawExpr}"`);
      console.error(`Error: ${err2.message}`);
      return 1;
    }
  }
  return 0;
}

let total = 0;
let errors = 0;

let m;
while ((m = attrDoubleRegex.exec(html)) !== null) {
  total++;
  if (checkMatch(m[1], m[2], m.index)) errors++;
}

while ((m = attrSingleRegex.exec(html)) !== null) {
  total++;
  if (checkMatch(m[1], m[2], m.index)) errors++;
}

console.log(`\nValidated ${total} Alpine directives. Found ${errors} actual syntax errors.`);
