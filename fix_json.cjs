const fs = require('fs');

const raw = fs.readFileSync('locales/en/translation.json', 'utf8');
const data = JSON.parse(raw);

console.log('Current keys:', Object.keys(data));
console.log('dashboard keys:', Object.keys(data.dashboard || {}));
console.log('mockTest keys:', Object.keys(data.mockTest || {}));
console.log('Has questionBank?', !!data.questionBank);
if (data.questionBank) {
  console.log('questionBank subjects:', Object.keys(data.questionBank));
}

const correctData = {
  "common": data.common,
  "navigation": data.navigation,
  "sidebar": data.sidebar,
  "dashboard": {
    "title": "Dashboard",
    "subtitle": "Track your progress, upcoming tests, and interview preparation status.",
    "performance": "Performance",
    "performanceDesc": "Review your latest mock test scores and improvement areas.",
    "schedule": "Schedule",
    "scheduleDesc": "See planned mock tests, interview slots, and study sessions.",
    "recentTests": "Recent Tests",
    "subjectPerformance": "Subject Performance",
    "quickActions": "Quick Actions",
    "viewAll": "View All",
    "noTestsYet": "No tests taken yet. Start your first mock test!",
    "noSubjectData": "Take tests to see your subject-wise performance.",
    "noUpcoming": "No upcoming tests assigned.",
    "testsTaken": "Tests Taken",
    "avgScore": "Average Score",
    "bestScore": "Best Score",
    "totalTime": "Total Time",
    "welcomeBack": "Welcome back, {name}! Here's your preparation overview.",
    "clearProgress": "Clear Progress",
    "upcomingTests": "Upcoming Tests",
    "startMockTest": "Start Mock Test",
    "careerGuidance": "Career Guidance",
    "assignedTests": "Assigned Tests",
    "viewHistory": "View History"
  },
  "mockTest": {
    "title": "Mock Test",
    "subtitle": "Select a subject to start a professional mock test with randomly generated questions.",
    "startTest": "Start Test",
    "selectSubject": "Select a Subject",
    "dataStructures": "Data Structures",
    "algorithms": "Algorithms",
    "webDevelopment": "Web Development",
    "subject": "Subject",
    "numQuestions": "Number of Questions",
    "resetProgress": "Reset Progress",
    "testStatistics": "Test Statistics",
    "testsAttempted": "Tests Attempted",
    "averageScore": "Average Score",
    "questionsUsed": "Questions Used",
    "uniqueQuestions": "Unique Questions in Bank",
    "testTitle": "Mock Test",
    "testDescription": "Answer {num} questions in {min} minutes.",
    "answered": "Answered {answered} of {total}",
    "questionOf": "Question {current} of {total}",
    "correctAnswer": "Correct answer:",
    "explanation": "Explanation:",
    "noQuestionsAvailable": "No questions are available for the selected subject. Please choose a different subject.",
    "submitTest": "Submit Test",
    "nextTest": "Next Test",
    "correct": "Correct",
    "accuracy": "Accuracy",
    "timeTaken": "Time Taken",
    "retakeTest": "Retake Test",
    "loadMore": "Load More",
    "timeRemaining": "Time Remaining:"
  },
  "login": data.login,
  "questions": data.questions,
  "aiInterview": data.aiInterview,
  "careerGuidance": data.careerGuidance,
  "career": data.career,
  "admin": data.admin,
  "scheduledTest": data.scheduledTest,
  "messages": data.messages,
  "questionBank": data.questionBank,
  "errors": data.errors
};

fs.writeFileSync('locales/en/translation.json', JSON.stringify(correctData, null, 2) + '\n', 'utf8');
console.log('English translation file fixed successfully!');
