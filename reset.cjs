const fs = require('fs');
let code = fs.readFileSync('script.js', 'utf8');

// 1. Add variable query for resetSessionButton
const startBtnDec = "const startTestButton = document.getElementById('start-test');";
const resetBtnDec = "\nconst resetSessionButton = document.getElementById('reset-session');";
code = code.replace(startBtnDec, startBtnDec + resetBtnDec);

// 2. Add event listener
const startTestL = "  if (startTestButton) startTestButton.addEventListener('click', startMockTest);";
const resetSessionL = "\n  if (resetSessionButton) resetSessionButton.addEventListener('click', () => {\n    if (confirm('Are you sure you want to completely reset all your Mock Test statistics? This cannot be undone.')) {\n      localStorage.removeItem(sessionManager.statsKey);\n      localStorage.removeItem('testStats');\n      loadStats();\n    }\n  });";
code = code.replace(startTestL, startTestL + resetSessionL);

fs.writeFileSync('script.js', code);
console.log('patched script.js');
