const fs = require('fs');

const INPUT = 'locales/te/translation.json';
const OUTPUT = 'locales/te/translation.json';

let raw = fs.readFileSync(INPUT, 'utf8');

// Strategy: JSON.parse will fail if there are raw CR/LF inside string values.
// We need to find and fix them. The safest approach is to:
// 1. Try to parse
// 2. If it fails, scan for raw CR/LF characters that appear inside quoted strings
//    and replace them with escaped \n or remove them.

function findBadChars(str) {
  let inString = false;
  let escape = false;
  const bad = [];
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if (escape) {
      escape = false;
      continue;
    }
    if (ch === '\\') {
      escape = true;
      continue;
    }
    if (ch === '"') {
      inString = !inString;
      continue;
    }
    if (inString) {
      const code = str.charCodeAt(i);
      if (code === 0x0D || code === 0x0A) {
        bad.push({ pos: i, code, char: code === 0x0D ? 'CR' : 'LF' });
      }
    }
  }
  return bad;
}

let bad = findBadChars(raw);
console.log('Bad chars found:', bad.length);

if (bad.length === 0) {
  console.log('No bad control chars found. Checking parse...');
  try {
    JSON.parse(raw);
    console.log('JSON is valid!');
    process.exit(0);
  } catch (e) {
    console.log('Parse error:', e.message);
    process.exit(1);
  }
}

// Show first few bad chars with context
bad.slice(0, 5).forEach(b => {
  const start = Math.max(0, b.pos - 40);
  const end = Math.min(raw.length, b.pos + 40);
  let ctx = raw.slice(start, end);
  ctx = ctx.replace(/\r/g, '\\r').replace(/\n/g, '\\n');
  console.log(`Pos ${b.pos} (${b.char}): ...${ctx}...`);
});

// Fix: replace raw CR/LF inside strings with a space (or escaped \\n)
// Since these are likely accidental line breaks in translations,
// we'll replace them with a space to preserve readability.
let fixed = '';
let inString = false;
let escape = false;
for (let i = 0; i < raw.length; i++) {
  const ch = raw[i];
  if (escape) {
    fixed += ch;
    escape = false;
    continue;
  }
  if (ch === '\\') {
    fixed += ch;
    escape = true;
    continue;
  }
  if (ch === '"') {
    fixed += ch;
    inString = !inString;
    continue;
  }
  if (inString) {
    const code = raw.charCodeAt(i);
    if (code === 0x0D || code === 0x0A) {
      fixed += ' '; // Replace bad newline with space
      continue;
    }
  }
  fixed += ch;
}

// Verify fix
bad = findBadChars(fixed);
console.log('Bad chars after fix:', bad.length);

try {
  const data = JSON.parse(fixed);
  console.log('JSON parse successful!');

  // Check questionBank completeness
  if (data.questionBank) {
    const subjects = Object.keys(data.questionBank);
    console.log('QuestionBank subjects:', subjects);
    let totalQs = 0;
    for (const sub of subjects) {
      const count = data.questionBank[sub].length;
      totalQs += count;
      console.log(`  ${sub}: ${count} questions`);
    }
    console.log('Total questions:', totalQs);
  } else {
    console.log('WARNING: No questionBank found!');
  }

  fs.writeFileSync(OUTPUT, fixed, 'utf8');
  console.log('Fixed file written to', OUTPUT);
} catch (e) {
  console.log('Still failing to parse:', e.message);
  fs.writeFileSync(OUTPUT + '.debug', fixed, 'utf8');
  console.log('Debug file written to', OUTPUT + '.debug');
  process.exit(1);
}

