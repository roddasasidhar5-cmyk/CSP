const fs = require('fs');

// Read the original (which has duplicates)
const original = fs.readFileSync('script_old.js', 'utf8');
const lines = original.split('\n');

// Find positions of all top-level blocks
function findBlockLines(lines, searchStr) {
  const results = [];
  lines.forEach((l, i) => { if (l.includes(searchStr)) results.push(i); });
  return results;
}

// Find the end of a block starting at startLine (by counting braces)
function findBlockEnd(lines, startLine) {
  let depth = 0;
  let started = false;
  for (let i = startLine; i < lines.length; i++) {
    const l = lines[i];
    depth += (l.match(/\{/g) || []).length;
    depth -= (l.match(/\}/g) || []).length;
    if (depth > 0) started = true;
    if (started && depth <= 0) return i;
  }
  return lines.length - 1;
}

const qbPos = findBlockLines(lines, 'const questionBank = {');
const smPos = findBlockLines(lines, 'class SessionManager {');

console.log('questionBank at:', qbPos.map(i => i+1));
console.log('SessionManager at:', smPos.map(i => i+1));

// We want: keep first questionBank, first SessionManager; delete duplicates
// Build a set of ranges to delete (second occurrences onward)
const deleteRanges = [];

if (qbPos.length > 1) {
  for (let k = 1; k < qbPos.length; k++) {
    const start = qbPos[k];
    const end = findBlockEnd(lines, start);
    deleteRanges.push([start, end]);
    console.log(`Delete duplicate questionBank: lines ${start+1}–${end+1}`);
  }
}

if (smPos.length > 1) {
  for (let k = 1; k < smPos.length; k++) {
    const start = smPos[k];
    const end = findBlockEnd(lines, start);
    deleteRanges.push([start, end]);
    console.log(`Delete duplicate SessionManager: lines ${start+1}–${end+1}`);
  }
}

// Sort ranges in reverse order so splicing doesn't shift indices
deleteRanges.sort((a, b) => b[0] - a[0]);
let result = [...lines];
for (const [s, e] of deleteRanges) {
  result.splice(s, e - s + 1);
}

const newCode = result.join('\n');
fs.writeFileSync('script.js', newCode);
console.log('Written script.js with', result.length, 'lines');
