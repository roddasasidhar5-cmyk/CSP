const fs = require('fs');
let raw = fs.readFileSync('locales/te/translation.json', 'utf8');

let inString = false;
let escape = false;
const badPositions = [];
for (let i = 0; i < raw.length; i++) {
  const ch = raw[i];
  if (escape) {
    escape = false;
    continue;
  }
  if (ch === '\\') {
    escape = true;
    continue;
  }
  if (ch === '"' && !inString) {
    inString = true;
    continue;
  }
  if (ch === '"' && inString) {
    inString = false;
    continue;
  }
  if (inString) {
    const code = raw.charCodeAt(i);
    if (code === 13 || code === 10) {
      badPositions.push({pos: i, code, char: code === 10 ? 'LF' : 'CR', context: raw.slice(Math.max(0,i-20), i+20).replace(/\r/g, '[CR]').replace(/\n/g, '[LF]')});
    }
  }
}
console.log('Bad chars found:', badPositions.length);
badPositions.forEach(b => console.log(b));

