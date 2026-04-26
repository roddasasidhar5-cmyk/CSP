const fs = require('fs');

const part1 = `// ==================== SESSION MANAGEMENT ====================
let currentUser = null;

function t(key, fallback) {
  return window.i18n ? window.i18n.t(key, fallback) : fallback;
}

function setupLanguageSwitcher() {
  const langBtns = document.querySelectorAll('.app-language-switcher .lang-btn');
  if (!langBtns.length) return;
  const currentLang = window.i18n ? window.i18n.getLanguage() : 'en';
  langBtns.forEach(btn => {
    const btnLang = btn.getAttribute('data-lang');
    if (btnLang === currentLang) btn.classList.add('active');
    else btn.classList.remove('active');

    btn.addEventListener('click', async () => {
      const newLang = btn.getAttribute('data-lang');
      if (window.i18n) {
        await window.i18n.setLanguage(newLang);
        langBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        window.i18n.translatePage();
        document.title = window.i18n.t('common.appName', 'CSP - Anukuntunna');
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const user = sessionStorage.getItem('user');
  const token = sessionStorage.getItem('token');
  if (!user || !token) {
    window.location.href = 'login.html';
    return;
  }
  currentUser = JSON.parse(user);
  document.getElementById('user-name').textContent = currentUser.name || currentUser.email;
  document.getElementById('user-role').textContent = currentUser.role;
  if (currentUser.role === 'admin') {
    document.getElementById('admin-nav-btn').classList.remove('hidden');
  }
  if (typeof initializeI18n === 'function') {
    await initializeI18n();
    setupLanguageSwitcher();
    window.i18n.translatePage();
    document.title = window.i18n.t('common.appName', 'CSP - Anukuntunna');
  }
  initializeApp();
});

document.getElementById('logout-btn').addEventListener('click', () => {
  sessionStorage.removeItem('user');
  sessionStorage.removeItem('token');
  window.location.href = 'login.html';
});

// ==================== COMPREHENSIVE QUESTION BANK ====================
const questionBank = {
  'data-structures': [
    { question: 'Which data structure uses LIFO ordering?', options: ['Queue', 'Stack', 'Heap', 'Graph'], answer: 'Stack', difficulty: 'Easy', explanation: 'A stack follows Last-In, First-Out behavior.' },
    { question: 'What is the time complexity of accessing an element by index in an array?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], answer: 'O(1)', difficulty: 'Easy', explanation: 'Arrays provide constant-time indexed access.' },
    { question: 'Which data structure is best suited for breadth-first search?', options: ['Stack', 'Queue', 'Hash Table', 'Binary Search Tree'], answer: 'Queue', difficulty: 'Medium', explanation: 'BFS explores nodes level by level, and a queue preserves the order.' },
    { question: 'What is the worst-case time complexity of inserting an element in a binary search tree?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)'], answer: 'O(n)', difficulty: 'Medium', explanation: 'If the BST becomes unbalanced, insertion can take O(n) time.' },
    { question: 'Which of the following is NOT a linear data structure?', options: ['Array', 'Linked List', 'Tree', 'Queue'], answer: 'Tree', difficulty: 'Easy', explanation: 'Trees are hierarchical/non-linear data structures.' },
    { question: 'What is the space complexity of a recursive function that calculates factorial?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], answer: 'O(n)', difficulty: 'Medium', explanation: 'Each recursive call is added to the call stack.' },
    { question: 'In a max heap, what is the relationship between parent and child nodes?', options: ['Parent >= Children', 'Parent <= Children', 'Parent = Children', 'No specific order'], answer: 'Parent >= Children', difficulty: 'Medium', explanation: 'In a max heap, each parent node is greater than or equal to its children.' },
    { question: 'What is the minimum number of comparisons needed to find both minimum and maximum in an array of n elements?', options: ['2n - 2', '1.5n - 2', '3n/2 - 2', 'n - 1'], answer: '3n/2 - 2', difficulty: 'Hard', explanation: 'The optimal algorithm compares elements in pairs and tracks min/max.' },
    { question: 'Which data structure would you use to implement a LRU cache?', options: ['Array', 'Hash Map + Doubly Linked List', 'Binary Search Tree', 'Queue'], answer: 'Hash Map + Doubly Linked List', difficulty: 'Hard', explanation: 'Hash map provides O(1) access, while doubly linked list maintains order.' },
    { question: 'What is the time complexity of searching in a balanced binary search tree?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], answer: 'O(log n)', difficulty: 'Medium', explanation: 'A balanced BST eliminates half of the remaining elements with each comparison.' },
    { question: 'In a hash table with chaining, what is the average time complexity of insertion?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)'], answer: 'O(1)', difficulty: 'Medium', explanation: 'With a good hash function, insertion in a hash table is O(1) on average.' },
    { question: 'What is the main disadvantage of using an array over a linked list?', options: ['Slower access time', 'Larger memory overhead', 'Costly insertion/deletion', 'Fixed size limitation'], answer: 'Costly insertion/deletion', difficulty: 'Medium', explanation: 'Arrays require shifting elements during insertion/deletion.' },
    { question: 'Which traversal of a binary search tree yields elements in sorted order?', options: ['Pre-order', 'In-order', 'Post-order', 'Level-order'], answer: 'In-order', difficulty: 'Medium', explanation: 'In-order traversal of a BST produces elements in ascending sorted order.' },
    { question: 'What is the time complexity of merge sort in all cases?', options: ['O(n)', 'O(n log n)', 'O(n^2)', 'O(log n)'], answer: 'O(n log n)', difficulty: 'Medium', explanation: 'Merge sort always divides the array in half and merges.' },
    { question: 'In a graph with V vertices and E edges, what is the space complexity of adjacency list representation?', options: ['O(V)', 'O(E)', 'O(V + E)', 'O(V * E)'], answer: 'O(V + E)', difficulty: 'Hard', explanation: 'Adjacency list stores V lists with a total of 2E entries for undirected graphs.' },
  ],
  algorithms: [
    { question: 'What is the average time complexity of quicksort?', options: ['O(n)', 'O(n log n)', 'O(n^2)', 'O(log n)'], answer: 'O(n log n)', difficulty: 'Medium', explanation: 'Quicksort typically achieves O(n log n) average time.' },
    { question: 'Which algorithm is best suited for finding the shortest path in a weighted graph?', options: ['BFS', 'DFS', "Dijkstra's algorithm", 'Bubble sort'], answer: "Dijkstra's algorithm", difficulty: 'Medium', explanation: "Dijkstra's algorithm efficiently finds the shortest path." },
    { question: 'What is the time complexity of binary search?', options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'], answer: 'O(log n)', difficulty: 'Easy', explanation: 'Binary search eliminates half of the remaining elements each time.' },
    { question: 'Which sorting algorithm is most efficient for nearly sorted arrays?', options: ['Bubble sort', 'Insertion sort', 'Merge sort', 'Quicksort'], answer: 'Insertion sort', difficulty: 'Medium', explanation: 'Insertion sort performs best on nearly sorted arrays.' },
    { question: 'What is the space complexity of the recursive implementation of binary search?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)'], answer: 'O(log n)', difficulty: 'Medium', explanation: 'Recursion adds O(log n) space due to the call stack depth.' },
    { question: 'Which approach is used in the knapsack problem?', options: ['Greedy', 'Divide and conquer', 'Dynamic programming', 'Brute force'], answer: 'Dynamic programming', difficulty: 'Hard', explanation: 'Dynamic programming efficiently solves the knapsack problem.' },
    { question: 'What is the longest common subsequence (LCS) problem solved using?', options: ['Greedy', 'Dynamic programming', 'Recursion', 'Iteration'], answer: 'Dynamic programming', difficulty: 'Hard', explanation: 'LCS uses dynamic programming to build a table of optimal subproblem solutions.' },
    { question: 'In the A* algorithm, what does the heuristic function estimate?', options: ['Distance from start', 'Distance to goal', 'Total cost', 'Time taken'], answer: 'Distance to goal', difficulty: 'Hard', explanation: 'A* uses a heuristic function to estimate the cost to the goal.' },
    { question: 'What is the worst-case time complexity of heapsort?', options: ['O(n)', 'O(n log n)', 'O(n^2)', 'O(log n)'], answer: 'O(n log n)', difficulty: 'Medium', explanation: 'Heapsort guarantees O(n log n) time complexity in all cases.' },
    { question: 'Which algorithm uses the divide-and-conquer approach?', options: ['Insertion sort', 'Merge sort', 'Selection sort', 'Bubble sort'], answer: 'Merge sort', difficulty: 'Easy', explanation: 'Merge sort divides the array into halves, recursively sorts them, and then merges.' },
    { question: 'What is the minimum spanning tree used for?', options: ['Finding cycles', 'Shortest paths', 'Connecting all vertices with minimum weight', 'Topological sorting'], answer: 'Connecting all vertices with minimum weight', difficulty: 'Medium', explanation: 'MST connects all vertices with the minimum possible total edge weight.' },
    { question: 'In topological sorting, what must the graph be?', options: ['Cyclic', 'Acyclic', 'Connected', 'Weighted'], answer: 'Acyclic', difficulty: 'Medium', explanation: 'Topological sorting requires a directed acyclic graph (DAG).' },
    { question: 'What is the time complexity of the Floyd-Warshall algorithm?', options: ['O(V^2)', 'O(V^3)', 'O(E log V)', 'O(V + E)'], answer: 'O(V^3)', difficulty: 'Hard', explanation: 'Floyd-Warshall uses three nested loops, resulting in O(V^3) time.' },
    { question: 'Which algorithm is used for finding strongly connected components?', options: ['DFS', "Tarjan's algorithm", "Dijkstra's", 'BFS'], answer: "Tarjan's algorithm", difficulty: 'Hard', explanation: "Tarjan's algorithm efficiently finds strongly connected components using DFS." },
    { question: 'What is the recurrence relation for the time complexity of merge sort?', options: ['T(n) = T(n-1) + n', 'T(n) = 2T(n/2) + n', 'T(n) = T(n/2) + 1', 'T(n) = T(n-1) + 1'], answer: 'T(n) = 2T(n/2) + n', difficulty: 'Hard', explanation: 'Merge sort divides into two halves and merges.' },
  ],
  'system-design': [
    { question: 'What is the primary purpose of load balancing?', options: ['Encrypt data', 'Distribute traffic', 'Store data', 'Compile code'], answer: 'Distribute traffic', difficulty: 'Easy', explanation: 'Load balancing distributes incoming requests across multiple servers.' },
    { question: 'Which caching strategy is used in most modern web applications?', options: ['FIFO', 'LRU', 'LIFO', 'Random'], answer: 'LRU', difficulty: 'Medium', explanation: 'LRU caching removes the least recently accessed items when the cache is full.' },
    { question: 'What is the CAP theorem?', options: ['CPU, API, Path', 'Consistency, Availability, Partition tolerance', 'Cache, API, Protocol', 'CPU, Availability, Performance'], answer: 'Consistency, Availability, Partition tolerance', difficulty: 'Hard', explanation: 'The CAP theorem states distributed systems can guarantee at most two of three properties.' },
    { question: 'Which database is suitable for fast read operations with less write frequency?', options: ['Write-optimized', 'Read-optimized', 'Balanced', 'Graph DB'], answer: 'Read-optimized', difficulty: 'Medium', explanation: 'Read-optimized databases use indexing and caching to speed up reads.' },
    { question: 'What is horizontal scaling?', options: ['Adding more power to existing servers', 'Adding more servers', 'Upgrading hardware', 'Reducing load'], answer: 'Adding more servers', difficulty: 'Easy', explanation: 'Horizontal scaling adds more servers to distribute the load.' },
    { question: 'Which pattern is used for handling eventual consistency?', options: ['ACID', 'BASE', 'SOLID', 'DRY'], answer: 'BASE', difficulty: 'Hard', explanation: 'BASE pattern handles eventual consistency.' },
    { question: 'What is a message queue used for?', options: ['Storing data', 'Asynchronous communication', 'Authentication', 'Encryption'], answer: 'Asynchronous communication', difficulty: 'Medium', explanation: 'Message queues enable asynchronous communication between system parts.' },
    { question: 'Which technique reduces database load by serving frequently accessed data from memory?', options: ['Indexing', 'Sharding', 'Caching', 'Replication'], answer: 'Caching', difficulty: 'Easy', explanation: 'Caching stores frequently accessed data in fast memory to reduce database queries.' },
  ],
  'machine-learning': [
    { question: 'What is the primary goal of supervised learning?', options: ['Clustering', 'Prediction', 'Dimensionality reduction', 'Feature extraction'], answer: 'Prediction', difficulty: 'Easy', explanation: 'Supervised learning uses labeled data to train models for making predictions.' },
    { question: 'Which algorithm is commonly used for binary classification?', options: ['K-means', 'Logistic regression', 'PCA', 'Gaussian Mixture Model'], answer: 'Logistic regression', difficulty: 'Medium', explanation: 'Logistic regression is popular for binary classification.' },
    { question: 'What does overfitting mean?', options: ['Model is too simple', 'Model memorizes training data', 'Model has high bias', 'Model is underfitted'], answer: 'Model memorizes training data', difficulty: 'Medium', explanation: 'Overfitting occurs when a model learns training data too well, including noise.' },
    { question: 'Which technique is used to prevent overfitting?', options: ['Increasing model complexity', 'Regularization', 'More training', 'Fewer features'], answer: 'Regularization', difficulty: 'Medium', explanation: 'Regularization adds penalties to the loss function to prevent overfitting.' },
    { question: 'What is cross-validation used for?', options: ['Feature scaling', 'Model evaluation', 'Data augmentation', 'Hyperparameter tuning'], answer: 'Model evaluation', difficulty: 'Medium', explanation: 'Cross-validation evaluates model performance by splitting data into multiple folds.' },
  ],
  databases: [
    { question: 'What is ACID in databases?', options: ['Atomicity, Consistency, Isolation, Durability', 'Analysis, Classification, Index, Data', 'API, Cache, Interface, Database', 'Attribute, Class, Instance, Data'], answer: 'Atomicity, Consistency, Isolation, Durability', difficulty: 'Easy', explanation: 'ACID ensures reliable database transactions.' },
    { question: 'Which key uniquely identifies a record in a table?', options: ['Foreign key', 'Primary key', 'Composite key', 'Candidate key'], answer: 'Primary key', difficulty: 'Easy', explanation: 'A primary key uniquely identifies each record in a table.' },
    { question: 'What is the purpose of an index in a database?', options: ['Store data', 'Improve query performance', 'Backup data', 'Encrypt data'], answer: 'Improve query performance', difficulty: 'Medium', explanation: 'Indexes speed up data retrieval by creating faster lookup structures.' },
    { question: 'What is a foreign key?', options: ['A unique identifier', 'A reference to primary key in another table', 'A backup key', 'A composite key'], answer: 'A reference to primary key in another table', difficulty: 'Easy', explanation: 'A foreign key establishes a relationship between tables by referencing a primary key.' },
    { question: 'What is a transaction in a database?', options: ['A single query', 'A set of operations treated as a unit', 'A backup', 'An index'], answer: 'A set of operations treated as a unit', difficulty: 'Medium', explanation: 'A transaction is a sequence of operations that must all succeed or all fail together.' },
  ],
};

// ==================== SESSION MANAGER ====================
class SessionManager {
  constructor() {
    this.key = 'scheduledTests';
  }

  scheduleTest(testData) {
    const tests = this.getScheduledTests();
    const newTest = { id: Date.now().toString(), ...testData };
    tests.push(newTest);
    localStorage.setItem(this.key, JSON.stringify(tests));
    return newTest;
  }

  getScheduledTests() {
    const tests = localStorage.getItem(this.key);
    if (!tests) return [];
    return JSON.parse(tests).sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  deleteScheduledTest(testId) {
    const tests = this.getScheduledTests();
    const updated = tests.filter(t => t.id !== testId);
    localStorage.setItem(this.key, JSON.stringify(updated));
  }
}

const sessionManager = new SessionManager();

// ==================== GLOBAL STATE ====================
let testInProgress = false;
let tabSwitches = 0;
const maxTabSwitches = 3;
let testState = {
  currentQuestion: 0,
  activeQuestions: [],
  selectedAnswers: [],
  subject: '',
  numQuestions: 0,
  startTime: null,
  duration: 0,
};

// ==================== INITIALIZATION ====================
function initializeApp() {
  setupEventListeners();
  displayAssignmentStatus();
  if (currentUser.role === 'admin') {
    displayAdminTests();
  }
  loadStats();
}

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', handleNavigation);
  });

  document.getElementById('start-test').addEventListener('click', startMockTest);
  document.getElementById('submit-test').addEventListener('click', submitTest);
  document.getElementById('reset-session').addEventListener('click', resetSession);
  document.getElementById('load-more').addEventListener('click', loadMoreQuestions);

  setupCareerGuidanceListeners();

  if (currentUser.role === 'admin') {
    document.getElementById('admin-schedule-form').addEventListener('submit', handleAdminScheduleSubmit);
  }
}

function setupCareerGuidanceListeners() {
  const levelButtons = document.querySelectorAll('.level-btn');
  levelButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      levelButtons.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      const level = e.target.getAttribute('data-level');
      document.querySelectorAll('.guidance-content').forEach(content => content.classList.remove('active'));
      const target = document.getElementById('guidance-' + level);
      if (target) target.classList.add('active');
    });
  });
}

// ==================== NAVIGATION ====================
function handleNavigation(e) {
  const view = e.target.getAttribute('data-view');
  if (view === 'admin' && currentUser.role !== 'admin') {
    alert(t('common.adminAccessRequired', 'Admin access required'));
    return;
  }
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(view).classList.add('active');
  document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
  e.target.classList.add('active');
}

// ==================== MOCK TEST FUNCTIONALITY ====================
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
  tabSwitches = 0;

  testInProgress = true;
  enableTestSecurity();

  document.getElementById('test-container').classList.remove('hidden');
  document.getElementById('test-form').innerHTML = '';
  document.getElementById('test-result').classList.add('hidden');
  document.getElementById('submit-test').classList.remove('hidden');
  document.getElementById('load-more').classList.add('hidden');
  document.getElementById('start-test').disabled = true;
  document.getElementById('test-title').textContent = t('mockTest.testTitle', 'Mock Test') + ' - ' + subject.replace(/-/g, ' ');
  document.getElementById('test-description').textContent = t('mockTest.testDescription', 'Answer {num} questions in {min} minutes.')
    .replace('{num}', numQuestions)
    .replace('{min}', testState.duration / 60);

  displayQuestion();
  startTimer();
  document.getElementById('test-container').scrollIntoView({ behavior: 'smooth' });
}

function displayQuestion() {
  if (!Array.isArray(testState.activeQuestions) || testState.activeQuestions.length === 0) {
    document.getElementById('test-form').innerHTML = '<p style="color: #ef4444;">' + t('mockTest.noQuestionsAvailable', 'No questions are available for the selected subject. Please choose a different subject.') + '</p>';
    return;
  }

  let allQuestionsHTML = '';

  testState.activeQuestions.forEach((question, idx) => {
    const diffLabel = t('questions.' + question.difficulty.toLowerCase(), question.difficulty);
    allQuestionsHTML += '<div class="question-card" id="qcard-' + idx + '">' +
      '<div class="question-meta">' +
      '<span>' + t('mockTest.questionOf', 'Question {current} of {total}').replace('{current}', idx + 1).replace('{total}', testState.numQuestions) + '</span>' +
      '<span class="difficulty-' + question.difficulty.toLowerCase() + '">' + diffLabel + '</span>' +
      '</div>' +
      '<p>' + question.question + '</p>' +
      '<div class="answer-group">' +
      question.options.map((option) =>
        '<label><input type="radio" name="answer-' + idx + '" value="' + option + '" ' + (testState.selectedAnswers[idx] === option ? 'checked' : '') + ' />' +
        '<span>' + option + '</span></label>'
      ).join('') +
      '</div>' +
      '<div class="explanation hidden" id="expl-' + idx + '">' +
      '<p style="margin-bottom:8px"><strong>' + t('mockTest.correctAnswer', 'Correct answer:') + '</strong> ' + question.answer + '</p>' +
      '<p><strong>' + t('mockTest.explanation', 'Explanation:') + '</strong> ' + question.explanation + '</p>' +
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
  document.getElementById('progress-info').textContent = t('mockTest.answered', 'Answered {answered} of {total}')
    .replace('{answered}', answered)
    .replace('{total}', testState.numQuestions);
}

function startTimer() {
  if (window.mockTestTimerInterval) clearInterval(window.mockTestTimerInterval);

  const updateTimerDisplay = () => {
    const elapsed = Math.floor((Date.now() - testState.startTime) / 1000);
    const remaining = testState.duration - elapsed;

    if (remaining <= 0) {
      document.getElementById('timer').textContent = '00:00';
      clearInterval(window.mockTestTimerInterval);
      submitTest();
      return;
    }

    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    document.getElementById('timer').textContent = String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
  };

  updateTimerDisplay();
  window.mockTestTimerInterval = setInterval(updateTimerDisplay, 1000);
}

function submitTest() {
  testInProgress = false;
  disableTestSecurity();
  if (window.mockTestTimerInterval) clearInterval(window.mockTestTimerInterval);

  let correctCount = 0;

  testState.selectedAnswers.forEach((answer, idx) => {
    const question = testState.activeQuestions[idx];
    const isCorrect = answer === question.answer;
    if (isCorrect) correctCount++;

    const card = document.getElementById('qcard-' + idx);
    if (card) {
      card.classList.add(isCorrect ? 'correct' : 'incorrect');
      const expl = document.getElementById('expl-' + idx);
      if (expl) expl.classList.remove('hidden');

      card.querySelectorAll('label').forEach(label => {
        const input = label.querySelector('input');
        input.disabled = true;
        if (input.value === question.answer) {
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
    '<div class="result-item-label">' + t('mockTest.correct', 'Correct') + '</div>' +
    '<div class="result-item-value">' + correctCount + '/' + testState.numQuestions + '</div>' +
    '</div>' +
    '<div class="result-item">' +
    '<div class="result-item-label">' + t('mockTest.accuracy', 'Accuracy') + '</div>' +
    '<div class="result-item-value">' + score + '%</div>' +
    '</div>' +
    '<div class="result-item">' +
    '<div class="result-item-label">' + t('mockTest.timeTaken', 'Time Taken') + '</div>' +
    '<div class="result-item-value">' + timeTaken + 's</div>' +
    '</div>' +
    '</div>';

  const resultsBlock = document.getElementById('test-result');
  resultsBlock.innerHTML = testResultHTML;
  resultsBlock.classList.remove('hidden');
  document.getElementById('submit-test').classList.add('hidden');
  document.getElementById('load-more').classList.remove('hidden');
  document.getElementById('load-more').textContent = t('mockTest.nextTest', 'Next Test');
  document.getElementById('start-test').disabled = false;

  saveStats(score, testState.numQuestions);
  loadStats();

  resultsBlock.scrollIntoView({ behavior: 'smooth' });
}

function resetSession() {
  testInProgress = false;
  disableTestSecurity();
  if (window.mockTestTimerInterval) clearInterval(window.mockTestTimerInterval);

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
  document.getElementById('start-test').disabled = false;
  updateStats();
  alert(t('common.progressReset', 'Progress reset successfully!'));
}

function loadMoreQuestions() {
  resetSession();
  document.getElementById('subject-select').value = testState.subject;
  document.getElementById('num-questions').value = testState.numQuestions;
  startMockTest();
}

// ==================== SECURITY FUNCTIONS ====================
function enableTestSecurity() {
  document.addEventListener('copy', preventAction);
  document.addEventListener('cut', preventAction);
  document.addEventListener('paste', preventAction);
  document.addEventListener('contextmenu', preventAction);
  document.addEventListener('keydown', preventCopyPasteKeys);
  document.addEventListener('keydown', preventDevTools);
  document.addEventListener('visibilitychange', handleVisibilityChange);

  if (document.body.requestFullscreen) {
    document.body.requestFullscreen().catch(() => {});
  }
}

function disableTestSecurity() {
  document.removeEventListener('copy', preventAction);
  document.removeEventListener('cut', preventAction);
  document.removeEventListener('paste', preventAction);
  document.removeEventListener('contextmenu', preventAction);
  document.removeEventListener('keydown', preventCopyPasteKeys);
  document.removeEventListener('keydown', preventDevTools);
  document.removeEventListener('visibilitychange', handleVisibilityChange);

  if (document.fullscreenElement) {
    document.exitFullscreen().catch(() => {});
  }
}

function preventAction(e) {
  if (testInProgress) {
    e.preventDefault();
  }
}

function preventCopyPasteKeys(e) {
  if (!testInProgress) return;
  if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'v' || e.key === 'x' || e.key === 'a')) {
    e.preventDefault();
  }
}

function preventDevTools(e) {
  if (!testInProgress) return;
  if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I') || (e.ctrlKey && e.key === 'u')) {
    e.preventDefault();
  }
}

function handleVisibilityChange() {
  if (!testInProgress) return;
  if (document.hidden) {
    tabSwitches++;
    if (tabSwitches >= maxTabSwitches) {
      terminateTest();
    }
  }
}

function terminateTest() {
  testInProgress = false;
  disableTestSecurity();

  document.getElementById('warning-message').textContent =
    t('messages.testTerminated', 'Your test has been terminated. You switched tabs {switches} times.').replace('{switches}', tabSwitches);
  document.getElementById('security-warning').classList.remove('hidden');

  setTimeout(() => {
    document.getElementById('security-warning').classList.add('hidden');
    resetSession();
  }, 5000);
}

// ==================== STATS MANAGEMENT ====================
function saveStats(score, numQuestions) {
  let stats = JSON.parse(localStorage.getItem('testStats')) || {
    totalTests: 0,
    totalScore: 0,
    totalQuestions: 0,
  };

  stats.totalTests++;
  stats.totalScore += parseFloat(score);
  stats.totalQuestions += numQuestions;

  localStorage.setItem('testStats', JSON.stringify(stats));
}

function loadStats() {
  const stats = JSON.parse(localStorage.getItem('testStats')) || {
    totalTests: 0,
    totalScore: 0,
    totalQuestions: 0,
  };
  updateStats();
}

function updateStats() {
  const stats = JSON.parse(localStorage.getItem('testStats')) || {
    totalTests: 0,
    totalScore: 0,
    totalQuestions: 0,
  };

  document.getElementById('total-attempted').textContent = stats.totalTests;
  document.getElementById('avg-score').textContent = stats.totalTests > 0 ? (stats.totalScore / stats.totalTests).toFixed(1) + '%' : '0%';
  document.getElementById('questions-used').textContent = stats.totalQuestions;

  let totalUnique = 0;
  Object.values(questionBank).forEach(subject => {
    totalUnique += subject.length;
  });
  document.getElementById('unique-questions').textContent = totalUnique;
}

// ==================== SCHEDULED TEST FUNCTIONS ====================
function displayAssignmentStatus() {
  const tests = sessionManager.getScheduledTests();
  let html = '';

  if (tests.length === 0) {
    html = '<p>' + t('scheduledTest.noTestAssigned', 'No test assigned yet.') + '</p>';
  } else {
    const now = new Date();
    let foundActive = false;

    for (const test of tests) {
      const testDateTime = new Date(test.date + 'T' + test.time);
      const testEndTime = new Date(testDateTime.getTime() + test.duration * 60000);

      let status = '';
      if (testDateTime <= now && now <= testEndTime) {
        status = 'active';
        foundActive = true;
      } else if (testDateTime > now) {
        status = 'upcoming';
      } else {
        status = 'past';
      }

      const statusBadgeColor = status === 'active' ? '#22c55e' : status === 'upcoming' ? '#f59e0b' : '#6b7280';
      const statusBadge = '<span style="color: ' + statusBadgeColor + '; font-weight: 600;">' +
        (status === 'active' ? t('scheduledTest.active', 'ACTIVE') : status === 'upcoming' ? t('scheduledTest.upcoming', 'UPCOMING') : t('scheduledTest.past', 'PAST')) +
        '</span>';

      html += '<div class="scheduled-test-card ' + status + '">' +
        '<div class="test-info">' +
        '<h3>' + test.subject + '</h3>' +
        '
