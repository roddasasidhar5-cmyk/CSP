const fs = require('fs');
let raw = fs.readFileSync('locales/te/translation.json', 'utf8');

// Fix raw CR/LF inside JSON strings by replacing them with space
// We need to be careful to only replace inside strings, not structural newlines
let inString = false;
let escape = false;
let result = '';
for (let i = 0; i < raw.length; i++) {
  const ch = raw[i];
  const code = raw.charCodeAt(i);
  if (escape) {
    result += ch;
    escape = false;
    continue;
  }
  if (ch === '\\') {
    result += ch;
    escape = true;
    continue;
  }
  if (ch === '"' && !inString) {
    inString = true;
    result += ch;
    continue;
  }
  if (ch === '"' && inString) {
    inString = false;
    result += ch;
    continue;
  }
  if (inString && (code === 13 || code === 10)) {
    result += ' '; // replace raw newline inside string with space
    continue;
  }
  result += ch;
}

fs.writeFileSync('locales/te/translation.json', result, 'utf8');

// Validate
try {
  const data = JSON.parse(result);
  console.log('JSON is now valid!');
  if (data.questionBank) {
    console.log('Subjects:', Object.keys(data.questionBank));
    for (const [s, qs] of Object.entries(data.questionBank)) {
      console.log(s + ': ' + qs.length + ' questions');
    }
  } else {
    console.log('No questionBank found');
  }
} catch (e) {
  console.log('Still invalid:', e.message);
}

