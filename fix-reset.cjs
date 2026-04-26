const fs = require('fs');
let code = fs.readFileSync('script.js', 'utf8');

const wrongListener = `  if (resetSessionButton) resetSessionButton.addEventListener('click', () => {
    if (confirm('Are you sure you want to completely reset all your Mock Test statistics? This cannot be undone.')) {
      localStorage.removeItem(sessionManager.statsKey);
      localStorage.removeItem('testStats');
      loadStats();
    }
  });`;

const correctListener = `  if (resetSessionButton) resetSessionButton.addEventListener('click', resetMockTestSession);`;

const wrongListener2 = `  if (resetSessionButton) {
    resetSessionButton.addEventListener('click', () => {
      if (confirm('Are you sure you want to completely reset all your Mock Test statistics? This cannot be undone.')) {
        localStorage.removeItem(sessionManager.statsKey);
        localStorage.removeItem('testStats');
        loadStats();
      }
    });
  }`;

code = code.replace(wrongListener, correctListener);
code = code.replace(wrongListener2, correctListener);

const resetFunc = `
function resetMockTestSession() {
  testInProgress = false;
  stopTimer();
  disableTestSecurity();
  
  if (testContainer) testContainer.classList.add('hidden');
  if (testForm) testForm.innerHTML = '';
  if (testResult) testResult.classList.add('hidden');
  
  if (submitTestButton) {
    submitTestButton.disabled = false;
    submitTestButton.textContent = 'Submit Test';
    submitTestButton.classList.remove('hidden');
  }
  
  const loadMoreBtn = document.getElementById('load-more');
  if (loadMoreBtn) loadMoreBtn.classList.add('hidden');
}
`;

// Inject the function before startMockTest
const injectPt = code.indexOf('function startMockTest() {');
if(injectPt > -1) {
    code = code.substring(0, injectPt) + resetFunc + "\n" + code.substring(injectPt);
}

fs.writeFileSync('script.js', code);
console.log('Fixed Reset Progress button');
