const fs = require('fs');
let code = fs.readFileSync('script.js', 'utf8');

// 1. timerDisplay & loadMoreButton
code = code.replace(
  "const timerDisplay = document.getElementById('timer-display');",
  "const timerDisplay = document.getElementById('timer');\nconst loadMoreButton = document.getElementById('load-more');"
);

// 2. event listener for loadMoreButton
code = code.replace(
  "if (submitTestButton) submitTestButton.addEventListener('click', submitTest);",
  "if (submitTestButton) submitTestButton.addEventListener('click', submitTest);\n  if (typeof loadMoreButton !== 'undefined' && loadMoreButton) loadMoreButton.addEventListener('click', startMockTest);"
);

// 3. submitTest changes (at the end of the very long submitTest function)
code = code.replace(
  "  submitTestButton.textContent = 'Submitted';\n}",
  "  submitTestButton.textContent = 'Submitted';\n  submitTestButton.classList.add('hidden');\n  if (typeof loadMoreButton !== 'undefined' && loadMoreButton) loadMoreButton.classList.remove('hidden');\n  loadStats();\n}"
);

// 4. startMockTest changes
code = code.replace(
  "  submitTestButton.textContent = 'Submit Test';",
  "  submitTestButton.textContent = 'Submit Test';\n  if (typeof loadMoreButton !== 'undefined' && loadMoreButton) loadMoreButton.classList.add('hidden');"
);

// 5. Replace loadStats() globally
const loadStatsRegex = /function loadStats\(\) \{[\s\S]*?\n\}/m;
const newLoadStats = `function loadStats() {
  const stats = sessionManager.getAllStats();
  
  let totalAttempts = 0;
  let totalScore = 0;
  let totalQuestionsUsed = 0;
  
  Object.keys(stats).forEach(subject => {
    const stat = stats[subject];
    totalAttempts += stat.attempts;
    totalScore += stat.totalScore;
    totalQuestionsUsed += stat.questionsUsed * stat.attempts;
  });

  const avgScore = totalAttempts > 0 ? ((totalScore / totalQuestionsUsed) * 100).toFixed(1) : 0;
  
  const elAttempted = document.getElementById('total-attempted');
  const elAvgScore = document.getElementById('avg-score');
  const elQuestionsUsed = document.getElementById('questions-used');
  const elUniqueQuestions = document.getElementById('unique-questions');

  if (elAttempted) elAttempted.textContent = totalAttempts;
  if (elAvgScore) elAvgScore.textContent = avgScore + '%';
  if (elQuestionsUsed) elQuestionsUsed.textContent = totalQuestionsUsed;

  let totalUnique = 0;
  Object.values(questionBank).forEach(q => { totalUnique += q.length });
  if (elUniqueQuestions) elUniqueQuestions.textContent = totalUnique;
}`;

// Actually replacing it needs a slightly better regex since the previous one matches to the first \n} which might truncate the file incorrectly if there's nested blocks.
// Looking at the original script.js, loadStats() is relatively simple.
// I will just use string replacement:
const oldLoadStats = `function loadStats() {
  const stats = sessionManager.getAllStats();
  const statsList = document.getElementById('stats-list');

  if (!statsList) return;

  let html = '<h3>Test Statistics</h3>';
  if (Object.keys(stats).length === 0) {
    html += '<p>No test attempts yet.</p>';
  } else {
    Object.keys(stats).forEach(subject => {
      const stat = stats[subject];
      html += \`
        <div class="stat-item">
          <strong>\${subjectData[subject]}</strong>
          <p>Attempts: \${stat.attempts}</p>
          <p>Average Score: \${stat.avgScore}% (\${stat.totalScore}/\${stat.questionsUsed * stat.attempts})</p>
        </div>
      \`;
    });
  }
  statsList.innerHTML = html;
}`;
if(code.indexOf(oldLoadStats) > -1) {
  code = code.replace(oldLoadStats, newLoadStats);
} else {
  // Try regex if exact match fails
  const fallbackRegex = /function loadStats\(\) \{[\s\S]*?statsList\.innerHTML = html;\n\}/m;
  code = code.replace(fallbackRegex, newLoadStats);
}

fs.writeFileSync('script.js', code);
console.log('script.js updated successfully');
