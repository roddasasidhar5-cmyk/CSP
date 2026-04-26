function startMockTest() {
  const subject = document.getElementById('subject-select').value;
  let numQuestions = parseInt(document.getElementById('num-questions').value);

  const allQs = [...(questionBank[subject] || [])];
  for (let i = allQs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allQs[i], allQs[j]] = [allQs[j], allQs[i]];
  }

  if (numQuestions > allQs.length) numQuestions = allQs.length;
  
  testState.subject = subject;
  testState.numQuestions = numQuestions;
  testState.activeQuestions = allQs.slice(0, numQuestions);
  testState.currentQuestion = 0;
  testState.selectedAnswers = new Array(numQuestions).fill(null);
  testState.startTime = Date.now();
  testState.duration = numQuestions * 2 * 60;

  testInProgress = true;
  enableTestSecurity();

  document.getElementById('test-container').classList.remove('hidden');
  document.getElementById('test-form').innerHTML = '';
  document.getElementById('test-result').classList.add('hidden');
  document.getElementById('submit-test').classList.remove('hidden');
  document.getElementById('load-more').classList.add('hidden');

  displayQuestion();
  startTimer();
}

function displayQuestion() {
  let allQuestionsHTML = '';
  
  testState.activeQuestions.forEach((question, idx) => {
    allQuestionsHTML += '<div class="question-card" id="qcard-' + idx + '">' +
        '<div class="question-meta">' +
          '<span>Question ' + (idx + 1) + ' of ' + testState.numQuestions + '</span>' +
          '<span class="difficulty-' + question.difficulty.toLowerCase() + '">' + question.difficulty + '</span>' +
        '</div>' +
        '<p>' + question.question + '</p>' +
        '<div class="answer-group">' +
          question.options.map((option) =>
            '<label><input type="radio" name="answer-' + idx + '" value="' + option + '" ' + (testState.selectedAnswers[idx] === option ? 'checked' : '') + ' />' +
            '<span>' + option + '</span></label>'
          ).join('') +
        '</div>' +
        '<div class="explanation hidden" id="expl-' + idx + '">' +
           '<p style="margin-bottom:8px"><strong>Correct answer:</strong> ' + question.answer + '</p>' +
           '<p><strong>Explanation:</strong> ' + question.explanation + '</p>' +
        '</div>' +
      '</div>';
  });

  document.getElementById('test-form').innerHTML = allQuestionsHTML;
  updateProgress();

  testState.activeQuestions.forEach((_, idx) => {
    document.querySelectorAll('input[name="answer-' + idx + '"]').forEach(input => {
      input.addEventListener('change', (e) => {
        testState.selectedAnswers[idx] = e.target.value;
        updateProgress();
      });
    });
  });
}

function updateProgress() {
  const answered = testState.selectedAnswers.filter(a => a !== null).length;
  const filled = testState.numQuestions > 0 ? (answered / testState.numQuestions) * 100 : 0;
  document.getElementById('progress-fill').style.width = filled + '%';
  document.getElementById('progress-info').textContent = 'Answered ' + answered + ' of ' + testState.numQuestions;
}

function startTimer() {
  if(window.mockTestTimerInterval) clearInterval(window.mockTestTimerInterval);

  window.mockTestTimerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - testState.startTime) / 1000);
    const remaining = testState.duration - elapsed;

    if (remaining <= 0) {
      clearInterval(window.mockTestTimerInterval);
      submitTest();
      return;
    }

    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    document.getElementById('timer').textContent = String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
  }, 1000);
}

function submitTest() {
  testInProgress = false;
  disableTestSecurity();
  if(window.mockTestTimerInterval) clearInterval(window.mockTestTimerInterval);

  let correctCount = 0;

  testState.selectedAnswers.forEach((answer, idx) => {
    const question = testState.activeQuestions[idx];
    const isCorrect = answer === question.answer;
    if (isCorrect) correctCount++;

    const card = document.getElementById('qcard-' + idx);
    if(card) {
       card.classList.add(isCorrect ? 'correct' : 'incorrect');
       const expl = document.getElementById('expl-' + idx);
       if(expl) expl.classList.remove('hidden');

       card.querySelectorAll('label').forEach(label => {
            const input = label.querySelector('input');
            input.disabled = true; 
            if(input.value === question.answer) {
                 label.style.color = '#22c55e';
                 label.style.fontWeight = 'bold';
            } else if (input.checked && !isCorrect) {
                 label.style.color = '#ef4444';
                 label.style.textDecoration = 'line-through';
            }
       });
    }
  });

  const rawScore = testState.numQuestions > 0 ? (correctCount / testState.numQuestions) * 100 : 0;
  const score = rawScore.toFixed(2);
  const timeTaken = Math.floor((Date.now() - testState.startTime) / 1000);

  const testResultHTML = '<div class="result-score">' + score + '%</div>' +
    '<div class="result-details">' +
      '<div class="result-item">' +
        '<div class="result-item-label">Correct</div>' +
        '<div class="result-item-value">' + correctCount + '/' + testState.numQuestions + '</div>' +
      '</div>' +
      '<div class="result-item">' +
        '<div class="result-item-label">Accuracy</div>' +
        '<div class="result-item-value">' + score + '%</div>' +
      '</div>' +
      '<div class="result-item">' +
        '<div class="result-item-label">Time Taken</div>' +
        '<div class="result-item-value">' + timeTaken + 's</div>' +
      '</div>' +
    '</div>';

  const resultsBlock = document.getElementById('test-result');
  resultsBlock.innerHTML = testResultHTML;
  resultsBlock.classList.remove('hidden');
  document.getElementById('submit-test').classList.add('hidden');
  document.getElementById('load-more').classList.remove('hidden');
  document.getElementById('load-more').textContent = 'Next Test';

  saveStats(score, testState.numQuestions);
  updateStats();
  
  resultsBlock.scrollIntoView({ behavior: 'smooth' });
}

function resetSession() {
  localStorage.removeItem('testStats');

  testInProgress = false;
  disableTestSecurity();
  if(window.mockTestTimerInterval) clearInterval(window.mockTestTimerInterval);
  
  testState = {
    currentQuestion: 0,
    activeQuestions: [],
    selectedAnswers: [],
    subject: '',
    numQuestions: 0,
    startTime: null,
    duration: 0,
  };

  document.getElementById('test-container').classList.add('hidden');
  document.getElementById('test-form').innerHTML = '';
  document.getElementById('test-result').classList.add('hidden');
  document.getElementById('submit-test').classList.remove('hidden');
  document.getElementById('load-more').classList.add('hidden');

  updateStats();
  alert('✅ Progress reset successfully!');
}
