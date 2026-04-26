const fs = require('fs');
let lines = fs.readFileSync('script.js', 'utf8').split('\n');

// ── Find the two questionBank declarations ─────────────────────────────────
const qbLines = []; // indices (0-based)
lines.forEach((l, i) => { if (l.startsWith('const questionBank')) qbLines.push(i); });
console.log('questionBank at lines:', qbLines.map(i => i + 1));

if (qbLines.length !== 2) { console.log('Expected 2 declarations, aborting'); process.exit(1); }

// ── Remove the second one (and the entire 2nd bank block until its closing `};`) ──
let startRemove = qbLines[1];      // 0-based index of the second `const questionBank = {`
let depth = 0;
let endRemove = startRemove;
for (let i = startRemove; i < lines.length; i++) {
  const l = lines[i];
  depth += (l.match(/\{/g) || []).length;
  depth -= (l.match(/\}/g) || []).length;
  endRemove = i;
  if (depth <= 0 && i > startRemove) break;
}
console.log(`Removing lines ${startRemove + 1}–${endRemove + 1}`);
lines.splice(startRemove, endRemove - startRemove + 1);

// ── Now inject the DOM variable declarations and DOMContentLoaded fix ──────
// Find where DOMContentLoaded is
const domIdx = lines.findIndex(l => l.includes('document.addEventListener(\'DOMContentLoaded\''));
console.log('DOMContentLoaded at line:', domIdx + 1);

// Build the DOM assignment block
const domAssignments = `document.addEventListener('DOMContentLoaded', async () => {
  // Assign all DOM elements here so they're available when DOM is ready
  dashboardView = document.getElementById('dashboard');
  mockTestView = document.getElementById('mock-test');
  scheduleTestView = document.getElementById('schedule-test');
  adminPanelView = document.getElementById('admin');
  adminNavBtn = document.getElementById('admin-nav-btn');
  testContainer = document.getElementById('test-container');
  testForm = document.getElementById('test-form');
  testResult = document.getElementById('test-result');
  testResultContent = document.getElementById('test-result-content');
  subjectSelect = document.getElementById('subject-select');
  numQuestionsSelect = document.getElementById('num-questions');
  startTestButton = document.getElementById('start-test');
  resetSessionButton = document.getElementById('reset-session');
  submitTestButton = document.getElementById('submit-test');
  logoutButton = document.getElementById('logout-btn');
  navItems = document.querySelectorAll('.nav-item');
  scheduleForm = document.getElementById('schedule-form');
  scheduleStatus = document.getElementById('schedule-status');
  scheduleSubject = document.getElementById('schedule-subject');
  scheduleDate = document.getElementById('schedule-date');
  scheduleTime = document.getElementById('schedule-time');
  scheduleDuration = document.getElementById('schedule-duration');
  scheduleQuestions = document.getElementById('schedule-questions');
  adminTestsList = document.getElementById('admin-tests-list');
  scheduleTestsList = document.getElementById('schedule-tests-list');
  progressFill = document.getElementById('progress-fill');
  progressInfo = document.getElementById('progress-info');
  timerDisplay = document.getElementById('timer');
  loadMoreButton = document.getElementById('load-more');
  userNameDisplay = document.getElementById('user-name');
  userRoleDisplay = document.getElementById('user-role');`;

// Replace the old DOMContentLoaded opening line with the new one that includes DOM assignments
const oldDomLine = lines[domIdx];
lines[domIdx] = domAssignments;

// Now flip const DOM declarations to let, and remove getElementById calls
// Find where the first getElementsById block starts and ends
const constDomStart = lines.findIndex(l => l.includes('// DOM Elements') && !l.includes('DOMContentLoaded'));
if (constDomStart !== -1) {
  console.log('Found // DOM Elements at line:', constDomStart + 1);
  // Replace the old const declarations block with let declarations
  // Find end of block (blank line or next comment)
  let constDomEnd = constDomStart;
  for (let i = constDomStart + 1; i < lines.length; i++) {
    if (lines[i].trim() === '' || lines[i].startsWith('//') || lines[i].startsWith('let ') || lines[i].startsWith('function ')) {
      constDomEnd = i - 1;
      break;
    }
  }
  console.log(`DOM Elements block: ${constDomStart + 1}–${constDomEnd + 1}`);
  const newDecls = [
    '// DOM Elements — declared here, assigned inside DOMContentLoaded',
    'let dashboardView, mockTestView, scheduleTestView, adminPanelView, adminNavBtn;',
    'let testContainer, testForm, testResult, testResultContent;',
    'let subjectSelect, numQuestionsSelect;',
    'let startTestButton, resetSessionButton, submitTestButton, logoutButton;',
    'let navItems;',
    'let scheduleForm, scheduleStatus, scheduleSubject, scheduleDate, scheduleTime, scheduleDuration, scheduleQuestions;',
    'let adminTestsList, scheduleTestsList;',
    'let progressFill, progressInfo, timerDisplay, loadMoreButton;',
    'let userNameDisplay, userRoleDisplay;',
  ];
  lines.splice(constDomStart, constDomEnd - constDomStart + 1, ...newDecls);
}

// Now add the reset session button event listener in setupEventListeners
const setupIdx = lines.findIndex(l => l.includes('function setupEventListeners()'));
if (setupIdx !== -1) {
  // Find the line with startTestButton listener to insert reset after it
  for (let i = setupIdx; i < setupIdx + 30; i++) {
    if (lines[i] && lines[i].includes('startTestButton') && lines[i].includes('startMockTest')) {
      // Check if reset listener already exists
      const already = lines.slice(i, i + 5).some(l => l.includes('resetSessionButton'));
      if (!already) {
        lines.splice(i + 1, 0, `  if (resetSessionButton) resetSessionButton.addEventListener('click', resetMockTestSession);`);
      }
      break;
    }
  }
}

// Add resetMockTestSession function before startMockTest if not already present
if (!lines.some(l => l.includes('function resetMockTestSession'))) {
  const startMockTestIdx = lines.findIndex(l => l.includes('function startMockTest()'));
  const resetFunc = `
function resetMockTestSession() {
  if (!confirm('Are you sure you want to reset all your Mock Test progress? This cannot be undone.')) return;
  localStorage.removeItem(sessionManager.statsKey);
  const subjects = Object.keys(questionBank);
  subjects.forEach(subject => sessionManager.resetSession(subject));
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
  loadStats();
  alert('Progress reset successfully!');
}
`.split('\n');
  lines.splice(startMockTestIdx, 0, ...resetFunc);
}

fs.writeFileSync('script.js', lines.join('\n'));
console.log('Done. Total lines:', lines.length);
