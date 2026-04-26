const fs = require('fs');
const lines = fs.readFileSync('script.js', 'utf8').split('\n');

console.log('Total lines:', lines.length);

const markers = [
  'const questionBank',
  'class SessionManager',
  'const sessionManager = new SessionManager();',
  'let testInProgress = false;',
  'function initializeApp()',
  'function setupEventListeners()',
  'function handleNavigation(',
  'function startMockTest()',
  'function displayQuestion()',
  'function updateProgress()',
  'function startTimer()',
  'function submitTest()',
  'function resetSession()',
  'function loadMoreQuestions()',
  'function enableTestSecurity()',
  'function disableTestSecurity()',
  'function handleAdminScheduleSubmit(',
  'function displayAdminTests()',
  'function displayAssignmentStatus()',
  'function loadStats()',
];

markers.forEach(marker => {
  const found = [];
  lines.forEach((line, idx) => {
    if (line.trim().startsWith(marker)) {
      found.push(idx + 1);
    }
  });
  if (found.length > 0) {
    console.log(`${marker}: lines ${found.join(', ')}`);
  }
});

// Check last 20 lines to see where file ends
console.log('\n--- Last 20 lines ---');
for (let i = Math.max(0, lines.length - 20); i < lines.length; i++) {
  console.log(`${i + 1}: ${lines[i].substring(0, 100)}`);
}

