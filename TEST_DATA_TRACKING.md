# 📊 TEST DATA TRACKING GUIDE

## ✅ Fixed: Enhanced Test Result Saving

When you submit a mock test, the system now saves **COMPLETE TEST DETAILS** including:

---

## 📋 DATA SAVED PER TEST

### **1. Test Metadata**
```
✅ testId (Unique ID for each test)
✅ userId (Student ID/Email)
✅ userName (Student Name)
✅ userRole (Admin/User)
✅ subject (Test Subject)
✅ date (ISO timestamp of submission)
✅ startTime (When test started)
✅ endTime (When test ended)
✅ duration (Total time available)
✅ timeTaken (Actual time spent)
```

### **2. Scoring Details**
```
✅ score (Percentage: 0-100)
✅ correctCount (Number of correct answers)
✅ wrongCount (Number of wrong answers)
✅ numQuestions (Total questions in test)
```

### **3. For EACH Question**
```
✅ questionNumber (Q1, Q2, etc.)
✅ question (The question text)
✅ userAnswer (What student answered)
✅ correctAnswer (The correct answer)
✅ isCorrect (Boolean: true/false)
✅ options (All 4 options for the question)
✅ difficulty (Easy/Medium/Hard)
✅ explanation (Why this is correct)
```

### **4. Browser Information**
```
✅ userAgent (Browser details)
✅ timestamp (Local time of submission)
```

---

## 💾 WHERE DATA IS STORED

### **localStorage Structure**

**1. Test Summary List**
```javascript
Key: "testStats"
Value: [
  {
    testId: "1718...",
    userId: "user@placement.com",
    subject: "algorithms",
    score: 85.5,
    correctCount: 8,
    numQuestions: 10,
    date: "2026-04-25T...",
    ...
  },
  { ... more tests ... }
]
```

**2. Complete Test Details**
```javascript
Key: "test_1718..."  // Individual test record
Value: {
  testId: "1718...",
  userId: "user@placement.com",
  userName: "User Name",
  subject: "algorithms",
  score: 85.5,
  correctCount: 8,
  numQuestions: 10,
  questionDetails: [
    {
      questionNumber: 1,
      question: "What is...",
      userAnswer: "Stack",
      correctAnswer: "Stack",
      isCorrect: true,
      difficulty: "Easy",
      explanation: "...",
      options: ["Queue", "Stack", "Heap", "Graph"]
    },
    { ... more questions ... }
  ],
  timeTaken: 245,
  date: "2026-04-25T...",
  browserInfo: { ... }
}
```

---

## 🔍 HOW TO VIEW SAVED DATA

### **Method 1: Browser Console**
```javascript
// View all tests
const allTests = JSON.parse(localStorage.getItem('testStats'));
console.log(allTests);

// View specific test
const testId = allTests[0].testId;
const testData = JSON.parse(localStorage.getItem('test_' + testId));
console.log(testData);

// View question details
console.log(testData.questionDetails);
```

### **Method 2: Via Dashboard**
The statistics section now displays:
- ✅ Test subject
- ✅ Score percentage
- ✅ Correct/Total questions
- ✅ Test date
- ✅ Color coding (Green=70%+, Orange=50-70%, Red=<50%)

### **Method 3: Export Data**
```javascript
// Get all tests as JSON
const allTests = JSON.parse(localStorage.getItem('testStats'));
console.table(allTests);

// Download as JSON file
const data = JSON.stringify(allTests, null, 2);
const blob = new Blob([data], {type: 'application/json'});
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'test-results.json';
a.click();
```

---

## 📊 EXAMPLE TEST RECORD

```json
{
  "testId": "1718038400000",
  "userId": "user@placement.com",
  "userName": "Test User",
  "userRole": "user",
  "subject": "data-structures",
  "score": 80.0,
  "numQuestions": 10,
  "correctCount": 8,
  "wrongCount": 2,
  "timeTaken": 456,
  "date": "2026-04-25T10:30:00.000Z",
  "startTime": "2026-04-25T10:20:00.000Z",
  "endTime": "2026-04-25T10:30:00.000Z",
  "duration": 1200,
  "questionDetails": [
    {
      "questionNumber": 1,
      "question": "Which data structure uses LIFO ordering?",
      "userAnswer": "Stack",
      "correctAnswer": "Stack",
      "isCorrect": true,
      "options": ["Queue", "Stack", "Heap", "Graph"],
      "difficulty": "Easy",
      "explanation": "A stack follows Last-In, First-Out behavior."
    },
    {
      "questionNumber": 2,
      "question": "What is the time complexity of binary search?",
      "userAnswer": "O(n)",
      "correctAnswer": "O(log n)",
      "isCorrect": false,
      "options": ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
      "difficulty": "Easy",
      "explanation": "Binary search eliminates half..."
    }
    // ... more questions ...
  ],
  "browserInfo": {
    "userAgent": "Mozilla/5.0...",
    "timestamp": "4/25/2026, 10:30:00 AM"
  }
}
```

---

## 🎯 WHAT YOU CAN DO WITH THIS DATA

### **For Students**
- ✅ Review all past test attempts
- ✅ See which questions they answered incorrectly
- ✅ Read explanations to understand answers
- ✅ Track score improvement over time
- ✅ Identify weak areas (by subject/difficulty)

### **For Admins**
- ✅ View student performance on each test
- ✅ Analyze class-wide performance
- ✅ Generate performance reports
- ✅ Identify common problem areas
- ✅ Export data for analytics

### **For Analysis**
- ✅ Calculate statistics (average, median, mode)
- ✅ Identify trends over time
- ✅ Compare performance by subject
- ✅ Find questions with high/low accuracy
- ✅ Generate leaderboards

---

## 🔧 TECHNICAL IMPLEMENTATION

### **Changes Made to script.js**

1. **Enhanced saveTestResult()** - Now saves complete test data with all question details
2. **Improved displayStats()** - Shows statistics with:
   - Individual test cards with color-coded scores
   - Test history summary (Total tests, Average, Best, Worst)
   - Correct/Total ratio
   - Date of each test
   
3. **New Functions Added**:
   - `viewTestDetails(testId)` - View detailed review of specific test
   - `showTestHistory()` - Display table of all tests taken
   - `formatTime(seconds)` - Format time display (e.g., "5m 30s")

### **Storage Keys**
```javascript
"testStats"        → Array of all test summaries
"test_[testId]"    → Complete details of individual test
```

---

## ✅ TESTING THE FEATURE

### **Step 1: Run Application**
```bash
npm start
```

### **Step 2: Login as User**
- Email: `user@placement.com`
- Password: `user123`

### **Step 3: Take a Mock Test**
1. Go to Mock Test section
2. Select a subject
3. Answer questions
4. Click Submit

### **Step 4: Check Saved Data**
1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Run:
```javascript
JSON.parse(localStorage.getItem('testStats'))
```

### **Step 5: View Test Details**
```javascript
const testId = JSON.parse(localStorage.getItem('testStats'))[0].testId;
const test = JSON.parse(localStorage.getItem('test_' + testId));
console.table(test.questionDetails);
```

---

## 📈 VERIFICATION CHECKLIST

After taking a test, verify:

- [ ] Test appears in Statistics section
- [ ] Score is displayed correctly
- [ ] Correct/Total count is accurate
- [ ] Test date is shown
- [ ] localStorage contains complete data
- [ ] questionDetails array has all questions
- [ ] userAnswer matches what you selected
- [ ] correctAnswer is shown
- [ ] Explanation is displayed
- [ ] isCorrect flag is accurate

---

## 🐛 TROUBLESHOOTING

### **"Test not saving"**
1. Check browser console for errors (F12)
2. Verify localStorage is enabled
3. Check available storage space
4. Try clearing cache and reloading

### **"Incomplete data saved"**
1. Ensure all questions were answered or skipped
2. Check testState.activeQuestions has content
3. Verify testState.selectedAnswers array is correct

### **"Can't find test record"**
1. Check localStorage with:
```javascript
console.log(Object.keys(localStorage))
```
2. Look for keys starting with "test_"
3. Verify testIds match between testStats and individual records

---

## 📝 CONSOLE COMMANDS REFERENCE

```javascript
// Get all tests
JSON.parse(localStorage.getItem('testStats'))

// Get specific test
JSON.parse(localStorage.getItem('test_[testId]'))

// Clear all tests (careful!)
localStorage.removeItem('testStats')

// Get test count
JSON.parse(localStorage.getItem('testStats')).length

// Get average score
const tests = JSON.parse(localStorage.getItem('testStats'));
const avg = tests.reduce((sum, t) => sum + t.score, 0) / tests.length;
console.log('Average:', avg.toFixed(1) + '%')

// Export to file
const data = JSON.stringify(JSON.parse(localStorage.getItem('testStats')), null, 2);
copy(data)
```

---

## ✨ SUMMARY

✅ **All test details are now saved automatically**
✅ **Complete question-by-question tracking**
✅ **Student performance analytics**
✅ **Multiple view options for reviewing tests**
✅ **Ready for reporting and analysis**

The system is now fully capable of tracking and recording comprehensive test data!
