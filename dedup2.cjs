const fs = require('fs');

let code = fs.readFileSync('script.js', 'utf8');
let lines = code.split('\n');

// Remove line 966: `let sessionManager = new SessionManager();` (it's a duplicate)
// The first is `const sessionManager` at line 417
const dupLine = lines.findIndex((l, i) => i >= 960 && l.trim().startsWith('let sessionManager = new SessionManager'));
if (dupLine !== -1) {
  console.log('Removing duplicate sessionManager at line', dupLine + 1);
  lines.splice(dupLine, 1);
} else {
  console.log('Duplicate not found by exact search, trying broader');
  // try broader
  const all = lines.reduce((acc, l, i) => { 
    if (l.includes('sessionManager = new SessionManager')) acc.push(i);
    return acc;
  }, []);
  console.log('All sessionManager new declarations at:', all.map(i => i+1));
  // Keep first, delete rest
  for (let k = all.length - 1; k >= 1; k--) {
    lines.splice(all[k], 1);
    console.log('Removed line', all[k] + 1);
  }
}

code = lines.join('\n');
fs.writeFileSync('script.js', code);
console.log('Done. Lines:', lines.length);
