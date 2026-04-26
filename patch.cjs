const fs = require('fs');
let code = fs.readFileSync('script.js', 'utf8');

const oldStartTimer = /function startTimer\(\) \{[\s\S]*?\}, 1000\);\r?\n\}/m;
const newStartTimer = `function startTimer() {
  const numQuestions = parseInt(numQuestionsSelect.value) || 10;
  const durationInSeconds = numQuestions * 2 * 60; // 2 minutes per question
  startTime = Date.now();
  
  if (timerDisplay) {
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = durationInSeconds % 60;
    timerDisplay.textContent = \`\${String(minutes).padStart(2, '0')}:\${String(seconds).padStart(2, '0')}\`;
  }
  
  timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const remaining = durationInSeconds - elapsed;
    
    if (remaining <= 0) {
      clearInterval(timerInterval);
      submitTest();
      return;
    }
    
    if (timerDisplay) {
      const minutes = Math.floor(remaining / 60);
      const seconds = remaining % 60;
      timerDisplay.textContent = \`\${String(minutes).padStart(2, '0')}:\${String(seconds).padStart(2, '0')}\`;
    }
  }, 1000);
}`;

code = code.replace(oldStartTimer, newStartTimer);

code = code.replace("testResultContent.innerHTML =", "testResult.innerHTML =");

fs.writeFileSync('script.js', code);
console.log("Successfully patched script.js");
