const fs = require('fs');
let code = fs.readFileSync('script.js', 'utf8');

if (!code.includes('resetSessionButton')) {
  // Add the button declaration near the top of DOM elements
  const btnSearchStr = "const submitTestButton = document.getElementById('submit-test');";
  const startIdx = code.indexOf(btnSearchStr);
  
  if (startIdx !== -1) {
    code = code.substring(0, startIdx) + 
      "const resetSessionButton = document.getElementById('reset-session');\n" + 
      code.substring(startIdx);
  } else {
    code = "const resetSessionButton = document.getElementById('reset-session');\n" + code;
  }

  // Add the event listener inside setupEventListeners
  const setupIdx = code.indexOf('function setupEventListeners() {');
  if (setupIdx !== -1) {
    const insertIdx = code.indexOf('{', setupIdx) + 1;
    const listenerHtml = `
  if (resetSessionButton) {
    resetSessionButton.addEventListener('click', () => {
      if (confirm('Are you sure you want to completely reset all your Mock Test statistics? This cannot be undone.')) {
        localStorage.removeItem(sessionManager.statsKey);
        localStorage.removeItem('testStats');
        loadStats();
      }
    });
  }
`;
    // Add logic to refresh stats properly, loadStats needs to be visible
    code = code.substring(0, insertIdx) + listenerHtml + code.substring(insertIdx);
  }
  
  fs.writeFileSync('script.js', code);
  console.log('Successfully injected reset logic.');
} else {
  console.log('resetSessionButton logic already exists.');
}
