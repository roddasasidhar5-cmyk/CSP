const fs = require('fs');

let lines = fs.readFileSync('script.js', 'utf8').split('\n');

// Find end of a function block starting at startLine
function findFunctionEnd(lines, startLine) {
  let depth = 0;
  let started = false;
  for (let i = startLine; i < lines.length; i++) {
    depth += (lines[i].match(/\{/g) || []).length;
    depth -= (lines[i].match(/\}/g) || []).length;
    if (depth > 0) started = true;
    if (started && depth <= 0) return i;
  }
  return lines.length - 1;
}

// All duplicate functions — keep first, delete second onward
const duplicateFunctions = [
  "updateProgress", "startTimer", "enableTestSecurity", "disableTestSecurity",
  "preventCopyPasteKeys", "handleVisibilityChange", "terminateTest", "updateStats",
  "displayAssignmentStatus", "startScheduledTest", "handleAdminScheduleSubmit",
  "displayAdminTests", "deleteAdminTest"
];

// Also keep list of variable dups
const toDeleteLines = new Set();

// For each dup function, find all occurrences and mark 2nd+ for deletion
for (const fnName of duplicateFunctions) {
  const occurrences = [];
  lines.forEach((l, i) => {
    const m = l.match(/^function ([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/);
    if (m && m[1] === fnName) occurrences.push(i);
  });
  
  // Delete all but the first (keep index 0, delete index 1+)
  for (let k = 1; k < occurrences.length; k++) {
    const start = occurrences[k];
    const end = findFunctionEnd(lines, start);
    console.log(`DELETE dup ${fnName}: lines ${start+1}–${end+1}`);
    for (let i = start; i <= end; i++) toDeleteLines.add(i);
    // Also delete any blank lines immediately after
    if (end + 1 < lines.length && lines[end + 1].trim() === '') toDeleteLines.add(end + 1);
  }
}

console.log(`Total lines to delete: ${toDeleteLines.size}`);

// Filter out marked lines
const result = lines.filter((_, i) => !toDeleteLines.has(i));
fs.writeFileSync('script.js', result.join('\n'));
console.log('Done. Lines:', result.length);
