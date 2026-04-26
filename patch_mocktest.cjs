const fs = require('fs');

const scriptOld = fs.readFileSync('script_old.js', 'utf8');
let script = fs.readFileSync('script.js', 'utf8');

// 1. Extract the full question bank from script_old.js (line 910+)
const qbStartOld = scriptOld.indexOf('\\nconst questionBank = {', 30000); 
let qbEndOld = scriptOld.indexOf('\\n};\\n\\nconst subjectData =', qbStartOld);
if (qbEndOld === -1) {
    qbEndOld = scriptOld.indexOf('\\n};', qbStartOld + 100); 
}
const fullQuestionBank = scriptOld.substring(qbStartOld + 1, qbEndOld + 3); 

// 2. Locate the truncated questionBank in script.js and replace it
const qbStart = script.indexOf('const questionBank = {');
const qbEnd = script.indexOf('\\n};\\n\\n// ==================== SESSION MANAGER ====================');

script = script.substring(0, qbStart) + fullQuestionBank.trim() + script.substring(qbEnd + 3);

// 3. Update testState to hold activeQuestions
const testStateOriginal = "let testState = {\\n  currentQuestion: 0,\\n  selectedAnswers: [],\\n  subject: '',\\n  numQuestions: 0,\\n  startTime: null,\\n  duration: 0,\\n};";
const testStateNew = "let testState = {\\n  currentQuestion: 0,\\n  activeQuestions: [],\\n  selectedAnswers: [],\\n  subject: '',\\n  numQuestions: 0,\\n  startTime: null,\\n  duration: 0,\\n};";
script = script.replace(testStateOriginal, testStateNew);

const funcsStart = script.indexOf('function startMockTest() {');
const funcsEnd = script.indexOf('function loadMoreQuestions() {');

const fixedFunctions = fs.readFileSync('functions_patch.js', 'utf8');

script = script.substring(0, funcsStart) + fixedFunctions + "\\n" + script.substring(funcsEnd);

// Patch startScheduledTest logic for activeQuestions
const schedStart = script.indexOf('function startScheduledTest(testId) {');
if(schedStart !== -1) {
   const oldSchedLogic = "testState.numQuestions = test.numQuestions;\\n  testState.currentQuestion = 0;\\n  testState.selectedAnswers = new Array(test.numQuestions).fill(null);\\n  testState.startTime = Date.now();\\n  testState.duration = test.duration * 60;\\n\\n  testInProgress = true;";
   
   const newSchedLogic = "testState.currentQuestion = 0;\\n  \\n  const activeQ = [...(questionBank[test.subject] || [])];\\n  for (let i = activeQ.length - 1; i > 0; i--) {\\n      const j = Math.floor(Math.random() * (i + 1));\\n      [activeQ[i], activeQ[j]] = [activeQ[j], activeQ[i]];\\n  }\\n  const finalQuestions = activeQ.slice(0, test.numQuestions);\\n  testState.activeQuestions = finalQuestions;\\n  testState.numQuestions = finalQuestions.length;\\n  \\n  testState.selectedAnswers = new Array(testState.numQuestions).fill(null);\\n  testState.startTime = Date.now();\\n  testState.duration = (test.duration || 60) * 60;\\n\\n  testInProgress = true;";
   
   script = script.replace(oldSchedLogic, newSchedLogic);
}

fs.writeFileSync('script.js', script);
console.log('script.js successfully patched!');
