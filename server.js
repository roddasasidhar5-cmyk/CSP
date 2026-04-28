import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3000;
const JWT_SECRET = 'your_jwt_secret_key_change_in_production';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(__dirname));

// MongoDB Connection
const MONGO_URL = 'mongodb+srv://placementmaster:sasi1231214v@placement.duww6qz.mongodb.net/?appName=placement';

// User Schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    required: true,
  },
  name: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('User', userSchema);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// Initialize default users (Admin and User)
async function initializeDefaultUsers() {
  try {
    const adminExists = await User.findOne({ email: 'admin@placement.com' });
    if (!adminExists) {
      await User.create({
        email: 'admin@placement.com',
        password: 'admin123', // In production, use bcrypt
        role: 'admin',
        name: 'Admin User',
      });
      console.log('✓ Default admin user created');
    } else {
      await User.updateOne({ email: 'admin@placement.com' }, { password: 'admin123' });
      console.log('✓ Admin user password synced');
    }

    const userExists = await User.findOne({ email: 'user@placement.com' });
    if (!userExists) {
      await User.create({
        email: 'user@placement.com',
        password: 'user123', // In production, use bcrypt
        role: 'user',
        name: 'Test User',
      });
      console.log('✓ Default user created');
    } else {
      await User.updateOne({ email: 'user@placement.com' }, { password: 'user123' });
      console.log('✓ User password synced');
    }
  } catch (error) {
    console.error('Error initializing default users:', error);
  }
}

// MongoDB Connection - initialize users after connection
mongoose
  .connect(MONGO_URL)
  .then(async () => {
    console.log('✓ MongoDB connected successfully');
    await initializeDefaultUsers();
  })
  .catch(err => console.error('✗ MongoDB connection error:', err));

// Authentication Routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    console.log(`[LOGIN] Attempt: ${email} (${role})`);

    // Validate input
    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Email, password, and role are required' });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    console.log(`[LOGIN] User found: ${user ? 'YES' : 'NO'}`);

    if (!user) {
      console.log(`[LOGIN] User not found for email: ${email}`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Verify role matches
    if (user.role !== role) {
      console.log(`[LOGIN] Role mismatch: user.role=${user.role}, requested=${role}`);
      return res.status(401).json({ message: `This account is not registered as ${role}` });
    }

    // Verify password (in production, use bcrypt for comparison)
    if (user.password !== password) {
      console.log(`[LOGIN] Password mismatch for ${email}`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log(`[LOGIN] Success: ${email} (${role})`);

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user data and token
    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error('[LOGIN] Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, role = 'user' } = req.body;
    console.log(`[REGISTER] Attempt: ${email} (${role})`);

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Email, password, and name are required' });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      console.log(`[REGISTER] Email already registered: ${email}`);
      return res.status(409).json({ message: 'Email already registered. Please log in.' });
    }

    // Sanitize role (only allow admin or user)
    const sanitizedRole = role === 'admin' ? 'admin' : 'user';

    // Create new user
    const newUser = await User.create({
      email: email.toLowerCase(),
      password,
      name,
      role: sanitizedRole,
    });

    console.log(`[REGISTER] Success: ${email} (${sanitizedRole})`);

    res.status(201).json({
      message: 'Registration successful',
      user: {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error('[REGISTER] Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify token middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Protected route: Get current user
app.get('/api/auth/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Logout endpoint
app.post('/api/auth/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

// ==================== AI CHATBOT API ====================
app.post('/api/chatbot', (req, res) => {
  try {
    const { message, userId } = req.body;
    if (!message) {
      return res.status(400).json({ reply: 'Please send a message.' });
    }

    const lowerMsg = message.toLowerCase();
    let reply = '';

    // Helper to check keywords
    const has = (words) => words.some(w => lowerMsg.includes(w));

    // ===== EXAM ELIGIBILITY =====
    if (has(['ssc cgl', 'cgl eligibility', 'cgl qualification'])) {
      reply = 'SSC CGL Eligibility:\n• Education: Bachelor\'s degree from a recognized university\n• Age: 18-32 years (varies by post)\n• Nationality: Indian\n• Attempts: No fixed limit\n\nThe exam has 4 tiers: Tier-I (CBT), Tier-II (CBT), Tier-III (Descriptive), Tier-IV (Skill Test/Document Verification).';
    } else if (has(['ssc chsl', 'chsl eligibility', 'chsl qualification'])) {
      reply = 'SSC CHSL Eligibility:\n• Education: 12th Standard pass\n• Age: 18-27 years\n• Posts: LDC, DEO, Postal/Sorting Assistant\n\nExam Pattern: Tier-I (CBT), Tier-II (Descriptive), Tier-III (Skill/Typing Test).';
    } else if (has(['ssc mts', 'mts eligibility'])) {
      reply = 'SSC MTS Eligibility:\n• Education: 10th Standard pass\n• Age: 18-25 years\n• Posts: Multi Tasking Staff (Group C non-gazetted)\n\nExam: Paper-I (Online CBT), Paper-II (Descriptive).';
    } else if (has(['ibps po', 'po eligibility', 'probationary officer'])) {
      reply = 'IBPS PO Eligibility:\n• Education: Graduate in any discipline\n• Age: 20-30 years\n• Nationality: Indian/Nepal/Bhutan/Tibetan refugee\n\nSelection: Prelims → Mains → Interview.\nSalary: ₹36,000 - ₹63,840 (Scale I).';
    } else if (has(['sbi po', 'sbi probationary'])) {
      reply = 'SBI PO Eligibility:\n• Education: Graduate in any discipline\n• Age: 21-30 years\n• Attempts: General-4, OBC-7, SC/ST-No limit\n\nSelection: Prelims → Mains → Group Exercise & Interview.\nSalary: ₹41,960 - ₹76,025 (Scale I). This is the most prestigious banking job in India!';
    } else if (has(['rbi grade b', 'rbi officer'])) {
      reply = 'RBI Grade B Eligibility:\n• Education: 60% in Graduation (50% for SC/ST/PwBD)\n• Age: 21-30 years (PhD holders up to 34)\n• Attempts: General-6, OBC-9, SC/ST-No limit\n\nSelection: Phase-I → Phase-II → Interview.\nSalary: ₹55,000 - ₹85,000 approx. One of the most prestigious banking jobs!';
    } else if (has(['upsc cse', 'ias eligibility', 'ips eligibility', 'civil services'])) {
      reply = 'UPSC CSE (IAS/IPS/IFS) Eligibility:\n• Education: Graduate in any discipline\n• Age: 21-32 years (General), 21-35 (OBC), 21-37 (SC/ST)\n• Attempts: General-6, OBC-9, SC/ST-Unlimited\n\nExam: Prelims (2 papers) → Mains (9 papers) → Interview.\nSalary: ₹56,100 - ₹2,50,000 (Level 10-18).';
    } else if (has(['nda', 'nda eligibility'])) {
      reply = 'UPSC NDA Eligibility:\n• Education: 12th pass (10+2 pattern)\n• Age: 16.5 - 19.5 years\n• Gender: Male & Female (both eligible since 2021)\n• Marital Status: Unmarried\n\nExam: Written (Math + GAT) → SSB Interview → Medical.\nTraining: 3 years at NDA Khadakwasla, then 1 year at IMA/INA/AFA.';
    } else if (has(['cds', 'cds eligibility'])) {
      reply = 'UPSC CDS Eligibility:\n• Education: Graduate (for IMA/OTA), B.Sc/BE (for INA), B.Sc/BE (for AFA)\n• Age: 19-24 years (IMA), 19-22 (INA), 20-24 (AFA), 19-25 (OTA)\n• Gender: Male (IMA/INA/AFA), Male & Female (OTA)\n\nExam: Written (English, GK, Elementary Math) → SSB Interview.';
    } else if (has(['afcat', 'afcat eligibility'])) {
      reply = 'AFCAT Eligibility:\n• Education: Graduate (60%)/BE/B.Tech (60%)\n• Age: 20-24 years (Flying), 20-26 (Ground Duty)\n• Gender: Male & Female\n\nBranches: Flying, Ground Duty (Technical & Non-Technical).\nSelection: Online Test → AFSB Interview → Medical.';
    } else if (has(['rrb ntpc', 'ntpc eligibility'])) {
      reply = 'RRB NTPC Eligibility:\n• Education: 12th pass (Graduate for some posts)\n• Age: 18-33 years (varies by post)\n• Posts: Clerk, Ticket Examiner, Commercial Apprentice, etc.\n\nExam: CBT-1 → CBT-2 → Typing Skill Test/CBAT → Document Verification.';
    } else if (has(['rrb group d', 'group d eligibility'])) {
      reply = 'RRB Group D Eligibility:\n• Education: 10th pass + ITI/NCVT certificate\n• Age: 18-33 years\n• Posts: Track Maintainer, Helper, Assistant Pointsman, Porter\n\nExam: CBT → PET → Document Verification.\nSalary: ₹18,000 (Level 1).';
    } else if (has(['ctet', 'ctet eligibility'])) {
      reply = 'CTET Eligibility:\n• Paper-I (Classes 1-5): 12th pass + Diploma in Elementary Education\n• Paper-II (Classes 6-8): Graduate + B.Ed/Diploma\n• No age limit\n\nValidity: Lifetime (since 2021). Conducted twice a year.';
    } else if (has(['teaching', 'teacher eligibility', 'tet'])) {
      reply = 'Teaching Exam Eligibility:\n• CTET: For Central Government schools (KVS, NVS, etc.)\n• State TET: For state government schools\n• Education: 12th + D.El.Ed (Primary) or Graduation + B.Ed (Upper Primary)\n• No age limit for most teaching exams\n\nCTET is valid for lifetime. State TET validity varies by state.';
    }

    // ===== EXAM PATTERN / SYLLABUS =====
    else if (has(['exam pattern', 'syllabus', 'subjects', 'topics'])) {
      reply = 'Most competitive exams in India follow this pattern:\n\n1. Quantitative Aptitude (Math):\n   - Number System, HCF/LCM, Percentage, Profit/Loss\n   - Ratio, Time-Work, Time-Distance, Algebra\n   - Geometry, Trigonometry, Data Interpretation\n\n2. Reasoning Ability:\n   - Analogy, Coding-Decoding, Blood Relations\n   - Syllogism, Seating Arrangement, Puzzles\n   - Direction Sense, Series, Venn Diagrams\n\n3. English Language:\n   - Reading Comprehension, Cloze Test\n   - Error Spotting, Sentence Correction\n   - Synonyms/Antonyms, Idioms, Para Jumbles\n\n4. General Awareness:\n   - Current Affairs (last 6-12 months)\n   - Static GK: History, Geography, Polity, Economy\n   - Science & Technology, Awards, Sports';
    }

    // ===== SALARY / CAREER GROWTH =====
    else if (has(['salary', 'pay', 'income', 'package'])) {
      reply = 'Salary Ranges for Popular Exams:\n\n• UPSC CSE (IAS/IPS): ₹56,100 - ₹2,50,000 + allowances\n• RBI Grade B: ₹55,000 - ₹85,000 + perks\n• SBI PO: ₹41,960 - ₹76,025 + allowances\n• IBPS PO: ₹36,000 - ₹63,840\n• SSC CGL: ₹25,500 - ₹1,51,100 (varies by post)\n• SSC CHSL: ₹19,900 - ₹63,200\n• RRB NTPC: ₹19,900 - ₹35,400\n• Defence (CDS/NDA): ₹56,100 + military perks\n\nAdditional benefits: HRA, DA, Medical, Pension, LTC, etc.';
    }

    // ===== PREPARATION TIPS =====
    else if (has(['preparation', 'prepare', 'study plan', 'strategy', 'tips'])) {
      reply = 'Effective Preparation Strategy:\n\n📚 Daily Schedule (4-6 hours):\n• 2 hrs: Quantitative Aptitude\n• 1.5 hrs: Reasoning\n• 1.5 hrs: English\n• 1 hr: General Awareness/Current Affairs\n\n🎯 Weekly Plan:\n• Monday-Friday: Topic-wise study + practice\n• Saturday: Full-length mock test\n• Sunday: Review mistakes + revise weak areas\n\n📖 Recommended Books:\n• Quant: R.S. Aggarwal, Arun Sharma\n• Reasoning: R.S. Aggarwal, M.K. Pandey\n• English: S.P. Bakshi, Wren & Martin\n• GK: Lucent\'s GK, Manorama Yearbook\n\n💡 Pro Tips:\n• Solve previous 10 years papers\n• Take weekly mock tests on CSP\n• Read daily current affairs\n• Focus on weak areas identified in mocks';
    }

    // ===== SUBJECT-SPECIFIC TIPS =====
    else if (has(['math', 'quant', 'quantitative'])) {
      reply = 'Quantitative Aptitude Tips:\n\n1. Start with basics: Number System, HCF/LCM, Percentage\n2. Learn short tricks and Vedic math techniques\n3. Practice Data Interpretation daily (very important for Mains)\n4. Focus on high-weightage topics:\n   - Arithmetic: 40-50% questions\n   - Algebra & Geometry: 20-30%\n   - DI: 20-30%\n\nRecommended: R.S. Aggarwal (basic), Arun Sharma (advanced), Quantum CAT';
    } else if (has(['english', 'grammar', 'vocabulary'])) {
      reply = 'English Language Tips:\n\n1. Read English newspapers daily (The Hindu, Indian Express)\n2. Focus on Reading Comprehension (highest weightage)\n3. Learn 10 new words daily with usage\n4. Practice Cloze Tests and Para Jumbles\n5. Revise grammar rules: Tenses, Subject-Verb Agreement, Articles\n\nRecommended: S.P. Bakshi, Word Power Made Easy, Wren & Martin';
    } else if (has(['reasoning', 'logical'])) {
      reply = 'Reasoning Ability Tips:\n\n1. Start with easy topics: Analogy, Series, Coding-Decoding\n2. Practice Puzzles and Seating Arrangement daily\n3. Learn to make diagrams for Blood Relations and Direction Sense\n4. For high-level exams, focus on:\n   - Input-Output\n   - Data Sufficiency\n   - Critical Reasoning\n\nRecommended: R.S. Aggarwal, M.K. Pandey (Analytical Reasoning)';
    } else if (has(['gk', 'general knowledge', 'current affairs'])) {
      reply = 'GK & Current Affairs Tips:\n\n1. Read daily current affairs from reliable sources\n2. Follow monthly magazines: Pratiyogita Darpan, Competition Success Review\n3. Focus areas:\n   - National & International News\n   - Government Schemes (very important)\n   - Awards & Honors\n   - Sports & Defense\n   - Science & Technology\n4. Revise Static GK weekly using Lucent\'s GK\n\nApps: Adda247, Gradeup, Testbook for daily CA quizzes';
    }

    // ===== PHYSICAL FITNESS (Defence) =====
    else if (has(['physical', 'fitness', 'running', 'height', 'medical'])) {
      reply = 'Defence Exam Physical Requirements:\n\n🏃 Running:\n• NDA/CDS: 2.4 km in 15-17 minutes\n• SSC GD: 5 km in 24 minutes (male), 1.6 km in 8.5 min (female)\n\n💪 Other Tests:\n• Push-ups, Sit-ups, Chin-ups\n• 9 feet ditch jump\n• Zig-zag balance beam\n\n📏 Height Requirements:\n• Male: 157-170 cm (varies by force)\n• Female: 152-157 cm\n\n👁️ Medical:\n• Vision: 6/6 or 6/9 (correctable for some posts)\n• No color blindness for flying branch\n• BMI within prescribed limits\n\nStart physical training at least 3-6 months before the exam!';
    }

    // ===== AGE LIMITS =====
    else if (has(['age', 'age limit', 'maximum age'])) {
      reply = 'Age Limits for Major Exams:\n\n• UPSC CSE: 21-32 years (General)\n• SSC CGL: 18-32 years\n• SSC CHSL: 18-27 years\n• SSC MTS: 18-25 years\n• IBPS/SBI PO: 20-30 years\n• RBI Grade B: 21-30 years\n• NDA: 16.5 - 19.5 years\n• CDS: 19-24 years (varies by academy)\n• AFCAT: 20-24 years (Flying), 20-26 (Ground Duty)\n• RRB NTPC/Group D: 18-33 years\n• CTET: No age limit\n\nAge relaxation: OBC-3 years, SC/ST-5 years, PwBD-10 years';
    }

    // ===== APPLICATION PROCESS =====
    else if (has(['apply', 'application', 'form', 'registration', 'how to apply'])) {
      reply = 'How to Apply for Competitive Exams:\n\n1. Visit the official website:\n   • UPSC: upsc.gov.in\n   • SSC: ssc.nic.in\n   • IBPS: ibps.in\n   • SBI: sbi.co.in/careers\n   • RRB: rrbcdg.gov.in\n\n2. Register with valid email and mobile number\n3. Fill the application form carefully\n4. Upload scanned photo and signature\n5. Pay application fee online\n6. Download and print the confirmation page\n\n⚠️ Important:\n• Use the same name as in 10th certificate\n• Keep documents ready: Photo, Signature, ID proof, Certificates\n• Apply well before the last date to avoid server issues';
    }

    // ===== BEST BOOKS =====
    else if (has(['books', 'best book', 'study material', 'resource'])) {
      reply = 'Best Books for Competitive Exams:\n\n📐 Quantitative Aptitude:\n• R.S. Aggarwal - Quantitative Aptitude (Basic)\n• Arun Sharma - Quantitative Aptitude (CAT level)\n• Sarvesh Verma - Quantum CAT\n\n🧠 Reasoning:\n• R.S. Aggarwal - Verbal & Non-Verbal Reasoning\n• M.K. Pandey - Analytical Reasoning\n• B.S. Sijwali - A New Approach to Reasoning\n\n📖 English:\n• S.P. Bakshi - Objective General English\n• Norman Lewis - Word Power Made Easy\n• Wren & Martin - High School English Grammar\n\n🌍 General Awareness:\n• Lucent\'s General Knowledge\n• Manorama Yearbook\n• Arihant General Knowledge\n\n📰 Current Affairs:\n• The Hindu/Indian Express (daily)\n• Pratiyogita Darpan (monthly)\n• Adda247/Gradeup apps for daily quizzes';
    }

    // ===== MOCK TESTS =====
    else if (has(['mock test', 'practice test', 'test series'])) {
      reply = 'Importance of Mock Tests:\n\n✅ Why take mock tests?\n• Understand exam pattern and difficulty\n• Improve time management\n• Identify weak areas\n• Build exam temperament\n\n📊 How to analyze mocks?\n• Check accuracy vs attempt ratio\n• Identify topics with maximum errors\n• Compare scores with previous mocks\n• Focus on improving weak sections\n\n🎯 Target scores:\n• Prelims: 75-80% accuracy\n• Mains: 65-70% with good speed\n\nUse CSP\'s Mock Test section for subject-wise and full-length tests!';
    }

    // ===== DEFAULT / FALLBACK =====
    else {
      reply = 'I\'m here to help with your career guidance doubts! You can ask me about:\n\n• Exam eligibility (SSC, Banking, UPSC, Defence, Railway, Teaching)\n• Exam pattern and syllabus\n• Salary and career growth\n• Preparation strategy and study plans\n• Subject-wise tips (Math, English, Reasoning, GK)\n• Best books and study materials\n• Application process and important dates\n• Physical fitness requirements\n• Mock test strategies\n\nWhat would you like to know?';
    }

    res.json({ reply, userId: userId || 'guest' });
  } catch (error) {
    console.error('Chatbot API error:', error);
    res.status(500).json({ reply: 'Sorry, I encountered an error. Please try again later.' });
  }
});

// Demo reset endpoint (call once to fix password)
app.post('/api/reset-demo', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin only' });
    }

    const { email } = req.body;
    if (!email || !['admin@placement.com', 'user@placement.com'].includes(email)) {
      return res.status(400).json({ message: 'Valid demo email required' });
    }

    await User.updateOne({ email }, { password: email === 'admin@placement.com' ? 'admin123' : 'user123' });
    console.log(`[RESET] Password reset for ${email}`);
    res.json({ message: `Password reset for ${email} to ${email === 'admin@placement.com' ? 'admin123' : 'user123'}` });
  } catch (error) {
    console.error('[RESET] Error:', error);
    res.status(500).json({ message: 'Reset failed' });
  }
});

// ==================== CUSTOM MOCK TEST API ====================
function generateQuestionsFromText(text, numQuestions = 10) {
  // Clean and split text into sentences
  const sentences = text
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 20 && s.length < 300);

  if (sentences.length < 4) {
    return [];
  }

  const questions = [];
  const usedIndices = new Set();
  const maxQuestions = Math.min(numQuestions, sentences.length);

  // Extract important words (nouns, numbers, capitalized words, key terms)
  function extractKeyTerms(sentence) {
    const words = sentence.match(/\b[A-Z][a-z]{2,}\b|\b\d+\b|\b[A-Za-z]{5,}\b/g) || [];
    return [...new Set(words)].filter(w => w.length > 3);
  }

  for (let i = 0; i < maxQuestions; i++) {
    // Pick a sentence that hasn't been used
    let sentenceIndex;
    let attempts = 0;
    do {
      sentenceIndex = Math.floor(Math.random() * sentences.length);
      attempts++;
    } while (usedIndices.has(sentenceIndex) && attempts < 50);
    
    if (usedIndices.has(sentenceIndex)) break;
    usedIndices.add(sentenceIndex);

    const sentence = sentences[sentenceIndex];
    const keyTerms = extractKeyTerms(sentence);

    if (keyTerms.length === 0) { i--; continue; }

    // Pick a key term as the answer
    const answerTerm = keyTerms[Math.floor(Math.random() * keyTerms.length)];

    // Create question by blanking out the answer term
    const questionText = sentence.replace(answerTerm, '__________');

    // Generate distractors from other sentences
    const distractors = [];
    const otherTerms = sentences
      .filter((_, idx) => idx !== sentenceIndex)
      .flatMap(s => extractKeyTerms(s))
      .filter(t => t.toLowerCase() !== answerTerm.toLowerCase());

    // Get unique distractors
    const uniqueDistractors = [...new Set(otherTerms)];
    
    while (distractors.length < 3 && uniqueDistractors.length > 0) {
      const idx = Math.floor(Math.random() * uniqueDistractors.length);
      const term = uniqueDistractors.splice(idx, 1)[0];
      if (term && term !== answerTerm) {
        distractors.push(term);
      }
    }

    // If not enough distractors, generate some generic ones
    while (distractors.length < 3) {
      distractors.push(`Option ${distractors.length + 1}`);
    }

    const options = [answerTerm, ...distractors.slice(0, 3)];
    // Shuffle options
    for (let j = options.length - 1; j > 0; j--) {
      const k = Math.floor(Math.random() * (j + 1));
      [options[j], options[k]] = [options[k], options[j]];
    }

    questions.push({
      question: questionText,
      options: options,
      answer: answerTerm,
      difficulty: sentence.length > 150 ? 'Hard' : sentence.length > 80 ? 'Medium' : 'Easy',
      explanation: `The correct answer is "${answerTerm}" as found in the original text: "${sentence}"`,
    });
  }

  return questions;
}

app.post('/api/custom-mocktest/generate', async (req, res) => {
  try {
    let text = '';
    const numQuestions = parseInt(req.body.numQuestions) || 10;

    if (req.body.text) {
      text = req.body.text;
      console.log(`[CUSTOM MOCK TEST] Text received, ${text.length} characters`);
    } else {
      return res.status(400).json({ message: 'Please provide text content.' });
    }

    if (text.trim().length < 50) {
      return res.status(400).json({ message: 'Content is too short. Please provide at least 50 characters.' });
    }

    const questions = generateQuestionsFromText(text, numQuestions);

    if (questions.length === 0) {
      return res.status(400).json({ message: 'Could not generate questions from the provided content. Please try with more detailed text.' });
    }

    res.json({
      success: true,
      questions: questions,
      totalGenerated: questions.length,
      sourceLength: text.length,
    });
  } catch (error) {
    console.error('[CUSTOM MOCK TEST] Error:', error);
    res.status(500).json({ message: 'Failed to generate custom mock test. Please try again.' });
  }
});


// Serve login page as default
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`\n===========================================`);
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`\n📝 Login Credentials:`);
  console.log(`   Admin: admin@placement.com / admin123`);
  console.log(`   User:  user@placement.com / user123`);
  console.log(`===========================================\n`);
});
