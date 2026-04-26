const fs = require('fs');
let lines = fs.readFileSync('script.js', 'utf8').split('\n');

// Track all `const X` and `let X` declarations and remove duplicates beyond first
const declared = new Set();
const toDelete = new Set();

// Patterns to detect declarations: const/let <identifier> = ...
const declPattern = /^(const|let)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(=|;)/;

lines.forEach((line, i) => {
  const m = line.match(declPattern);
  if (m) {
    const name = m[2];
    if (declared.has(name)) {
      // This is a duplicate; mark for deletion only if it's a simple one-liner declaration
      // (not a function body or complex block)
      if (!line.includes('{') || line.trim().endsWith('= {') || line.trim().endsWith('= new ')) {
        toDelete.add(i);
        console.log(`Dup at line ${i+1}: ${line.trim().substring(0,60)}`);
      }
    } else {
      declared.add(name);
    }
  }
});

// Also handle `let sessionManager` being a dup of `const sessionManager`
// by tracking by identifier globally
// Remove marked lines
const result = lines.filter((_, i) => !toDelete.has(i));
fs.writeFileSync('script.js', result.join('\n'));
console.log(`Removed ${toDelete.size} duplicate declarations. Lines: ${result.length}`);
