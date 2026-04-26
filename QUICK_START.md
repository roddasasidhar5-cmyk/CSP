# 🚀 QUICK START GUIDE - PLACEMENT DASHBOARD

## ✅ All Errors Fixed + Enhanced Test Tracking

---

## 🎯 WHAT'S NEW

✅ **Complete Test Details Saving**
- Every question answered
- Correct/incorrect status
- Explanations stored
- Student performance tracked
- Test history maintained

✅ **npm Dependency Issue Fixed**
- Removed incompatible i18next packages
- All 111 packages installed successfully

✅ **Database Ready**
- MongoDB configured
- Default users set up
- Authentication working

---

## ▶️ HOW TO START

### **Step 1: Open PowerShell**
```powershell
# Navigate to project folder
cd "c:\Users\SASIDHAR\OneDrive\Desktop\Placement 2"
```

### **Step 2: Start the Server**
```powershell
npm start
```

**Expected Output:**
```
✓ MongoDB connected successfully
✓ Default admin user created
✓ Default user created

===========================================
🚀 Server running on http://localhost:3000

📝 Login Credentials:
   Admin: admin@placement.com / admin123
   User:  user@placement.com / user123
===========================================
```

### **Step 3: Open Browser**
- Go to: `http://localhost:3000`
- Login page will appear

### **Step 4: Login**

**Option A - As Admin:**
```
Email: admin@placement.com
Password: admin123
```

**Option B - As User:**
```
Email: user@placement.com
Password: user123
```

---

## 🧪 TESTING MOCK TESTS

### **Take a Test (As User)**

1. **Login** as `user@placement.com`
2. **Click** "Mock Test" in sidebar
3. **Select** a subject (e.g., "Data Structures")
4. **Choose** number of questions (10)
5. **Click** "Start Test"
6. **Answer** the questions
7. **Click** "Submit Test"

### **View Results**

After submitting:
- ✅ Score shown as percentage
- ✅ Correct/Total count displayed
- ✅ Time taken shown
- ✅ Detailed results with explanations
- ✅ All data saved to browser storage

### **Check Statistics**

After test:
1. Go to Dashboard
2. Scroll down to "Your Statistics" section
3. See all past tests
4. View score history
5. Check performance trends

---

## 📊 VERIFY DATA IS BEING SAVED

### **Open Browser Developer Tools**

1. **Press** `F12` or `Right-click` → `Inspect`
2. **Click** `Console` tab
3. **Paste** this command:

```javascript
JSON.parse(localStorage.getItem('testStats'))
```

**You should see:**
```javascript
[
  {
    testId: "1718...",
    userId: "user@placement.com",
    userName: "Test User",
    subject: "data-structures",
    score: 85,
    correctCount: 8,
    numQuestions: 10,
    date: "2026-04-25T...",
    questionDetails: [...]
  }
]
```

### **View Detailed Test Record**

```javascript
// Get the test ID from above
const testId = "1718..."; // Copy from testStats

// Get complete test details
const test = JSON.parse(localStorage.getItem('test_' + testId));
console.log(test);

// View all questions answered
console.table(test.questionDetails);
```

---

## 👨‍💼 ADMIN FEATURES

### **Login as Admin**

```
admin@placement.com / admin123
```

### **Schedule a Test**

1. **Click** "Admin Panel" in sidebar
2. **Fill** the form:
   - Subject: Select from dropdown
   - Date: Pick a date
   - Time: Set time
   - Duration: Enter in minutes
3. **Click** "Schedule Test"
4. **See** scheduled tests in list below

### **View All Tests**

1. Go to **Admin Panel**
2. **Scheduled Tests** section shows:
   - Subject name
   - Date and time
   - Delete button

---

## 📋 COMMAND REFERENCE

| Command | Purpose |
|---------|---------|
| `npm start` | Start server on localhost:3000 |
| `npm run dev` | Start with auto-reload |
| `npm install` | Install dependencies |

---

## 🔍 CHECKING TEST DETAILS

### **After Completing a Test**

**What Gets Saved:**

```
✓ Unique Test ID
✓ Student name and ID
✓ Subject name
✓ Score percentage
✓ Correct/Wrong count
✓ Time taken
✓ Start and end time
✓ Questions with answers
✓ Explanations
✓ Correct answers
✓ Difficulty levels
✓ Browser info
✓ Timestamp
```

### **View in Console:**

```javascript
// See all saved tests
const allTests = JSON.parse(localStorage.getItem('testStats'));
console.log('Total tests taken:', allTests.length);

// See latest test score
console.log('Latest score:', allTests[allTests.length-1].score + '%');

// See average performance
const avg = allTests.reduce((sum, t) => sum + t.score, 0) / allTests.length;
console.log('Average score:', avg.toFixed(1) + '%');

// View details of a specific test
const latestTest = JSON.parse(localStorage.getItem('test_' + allTests[allTests.length-1].testId));
console.log(latestTest);
```

---

## ✅ VERIFICATION CHECKLIST

After starting and testing:

- [ ] Server running on http://localhost:3000
- [ ] Login page loads
- [ ] Admin login works
- [ ] User login works
- [ ] Dashboard accessible
- [ ] Mock Test section loads
- [ ] Can start a test
- [ ] Questions display
- [ ] Timer counts down
- [ ] Can answer questions
- [ ] Can submit test
- [ ] Results show correctly
- [ ] Statistics updated
- [ ] Data saved to localStorage
- [ ] Console shows test record

---

## 🐛 TROUBLESHOOTING

### **Server won't start**
```powershell
# Check if port 3000 is in use
netstat -ano | findstr :3000

# If in use, kill the process:
taskkill /PID [PID] /F

# Try again:
npm start
```

### **npm packages won't install**
```powershell
# Clear npm cache
npm cache clean --force

# Remove old files
Remove-Item node_modules -Recurse -Force
Remove-Item package-lock.json -Force

# Fresh install
npm install
```

### **MongoDB connection error**
```powershell
# Server should auto-connect
# If error, check:
# 1. MongoDB URL in server.js is correct
# 2. Internet connection is active
# 3. MongoDB Atlas IP whitelist includes your IP
```

### **Test data not saving**
```javascript
// Check if localStorage is accessible:
localStorage.setItem('test', 'data');
console.log(localStorage.getItem('test')); // Should show 'data'

// Check storage size:
Object.keys(localStorage).length  // Should show test keys
```

---

## 📞 IMPORTANT NOTES

- **Default Users**: Both users are pre-configured in MongoDB
- **No Registration**: Users can't self-register
- **Test Security**: During tests, copy/paste and dev tools are blocked
- **Automatic Timer**: Tests auto-submit when time runs out
- **Data Persistence**: All test results saved in browser localStorage
- **Multiple Tests**: Can take unlimited tests, all saved separately

---

## 🎊 YOU'RE READY!

Everything is set up and working. Start taking tests and track your performance!

**Quick Start:**
```powershell
cd "c:\Users\SASIDHAR\OneDrive\Desktop\Placement 2"
npm start
# Open http://localhost:3000
# Login: user@placement.com / user123
# Take a mock test
```

**Happy Testing!** ✅
