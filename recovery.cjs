const fs = require('fs');
let code = fs.readFileSync('script.js', 'utf8');

const startMarker = "<p><strong>Score:</strong> ${score} out of ${activeQuestions.length}</p>";
const endMarker = "  document.addEventListener('contextmenu', preventAction);";

const startIdx = code.indexOf(startMarker);
const endIdx = code.indexOf(endMarker, startIdx);

if (startIdx > -1 && endIdx > -1) {
  const intendedBlock = `<p><strong>Score:</strong> \${score} out of \${activeQuestions.length}</p>
      <p><strong>Percentage:</strong> \${percentage}%</p>
      <p><strong>Answered:</strong> \${answeredCount} out of \${activeQuestions.length}</p>
    </div>
  \`;

  submitTestButton.disabled = true;
  submitTestButton.textContent = 'Submitted';
  submitTestButton.classList.add('hidden');
  const loadMoreBtn = document.getElementById('load-more');
  if (loadMoreBtn) loadMoreBtn.classList.remove('hidden');
  loadStats();
}

// ==================== SECURITY FUNCTIONS ====================
function enableTestSecurity() {
  // Prevent copy-paste
`;
  
  code = code.substring(0, startIdx) + intendedBlock + code.substring(endIdx);
  fs.writeFileSync('script.js', code);
  console.log('Successfully recovered and patched the code!');
} else {
  console.log('Could not find markers');
}
