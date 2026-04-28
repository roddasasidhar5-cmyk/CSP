// ==================== SESSION MANAGEMENT ====================
let currentUser = null;

// Helper for translations
function t(key, fallback) {
  return window.i18n ? window.i18n.t(key, fallback) : fallback;
}

// Setup language switcher for main app
function setupLanguageSwitcher() {
  const langBtns = document.querySelectorAll('.app-language-switcher .lang-btn');
  if (!langBtns.length) return;

  const currentLang = window.i18n ? window.i18n.getLanguage() : 'en';

  langBtns.forEach(btn => {
    const btnLang = btn.getAttribute('data-lang');
    if (btnLang === currentLang) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }

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

// Check session on page load
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
  mathematics: [
    { question: 'What is the value of (25)^2 - (24)^2?', options: ['1', '25', '49', '625'], answer: '49', difficulty: 'Easy', explanation: 'Using a^2 - b^2 = (a+b)(a-b), we get (25+24)(25-24) = 49 x 1 = 49.' },
    { question: 'If a:b = 2:3 and b:c = 4:5, then a:c = ?', options: ['8:15', '6:20', '2:5', '3:4'], answer: '8:15', difficulty: 'Medium', explanation: 'a/c = (a/b) x (b/c) = (2/3) x (4/5) = 8/15, so a:c = 8:15.' },
    { question: 'A train 150m long crosses a pole in 15 seconds. What is its speed in km/hr?', options: ['36', '45', '54', '60'], answer: '36', difficulty: 'Easy', explanation: 'Speed = Distance/Time = 150/15 = 10 m/s = 10 x 18/5 = 36 km/hr.' },
    { question: 'The average of 5 numbers is 25. If one number is excluded, the average becomes 20. What is the excluded number?', options: ['25', '35', '45', '55'], answer: '45', difficulty: 'Medium', explanation: 'Sum of 5 numbers = 5 x 25 = 125. Sum of 4 numbers = 4 x 20 = 80. Excluded number = 125 - 80 = 45.' },
    { question: 'What is the compound interest on Rs.8000 at 10% per annum for 2 years?', options: ['Rs.1600', 'Rs.1680', 'Rs.1760', 'Rs.1800'], answer: 'Rs.1680', difficulty: 'Medium', explanation: 'CI = P[(1 + r/100)^n - 1] = 8000[(1.1)^2 - 1] = 8000 x 0.21 = Rs.1680.' },
    { question: 'In how many ways can 6 people be arranged in a row?', options: ['120', '720', '360', '5040'], answer: '720', difficulty: 'Easy', explanation: '6 people can be arranged in 6! = 6x5x4x3x2x1 = 720 ways.' },
    { question: 'What is the HCF of 36, 48, and 72?', options: ['6', '12', '18', '24'], answer: '12', difficulty: 'Easy', explanation: 'Factors: 36=2^2x3^2, 48=2^4x3, 72=2^3x3^2. HCF = 2^2x3 = 12.' },
    { question: 'A shopkeeper marks an article 25% above cost price and gives 10% discount. What is his profit percentage?', options: ['10%', '12.5%', '15%', '20%'], answer: '12.5%', difficulty: 'Medium', explanation: 'Let CP=100. MP=125. SP=125x0.9=112.5. Profit%=(112.5-100)/100 x 100 = 12.5%.' },
    { question: 'Solve: 3x + 7 = 2x + 15', options: ['5', '6', '7', '8'], answer: '8', difficulty: 'Easy', explanation: '3x + 7 = 2x + 15 => 3x - 2x = 15 - 7 => x = 8.' },
    { question: 'If 15 men can complete a work in 24 days, how many days will 18 men take?', options: ['18', '20', '22', '24'], answer: '20', difficulty: 'Medium', explanation: 'M1xD1 = M2xD2 => 15x24 = 18xD2 => D2 = 360/18 = 20 days.' },
    { question: 'A can do a work in 10 days and B in 15 days. How many days will they take together?', options: ['5', '6', '7', '8'], answer: '6', difficulty: 'Medium', explanation: 'A does 1/10 per day, B does 1/15 per day. Together: 1/10 + 1/15 = 5/30 = 1/6. So 6 days.' },
    { question: 'The ratio of ages of A and B is 3:5. After 6 years it becomes 2:3. What is B\'s present age?', options: ['20', '25', '30', '35'], answer: '30', difficulty: 'Hard', explanation: 'Let ages be 3x and 5x. (3x+6)/(5x+6) = 2/3 => 9x+18 = 10x+12 => x=6. B = 5x6 = 30.' },
    { question: 'What is the simple interest on Rs.5000 at 8% per annum for 3 years?', options: ['Rs.1000', 'Rs.1200', 'Rs.1500', 'Rs.1800'], answer: 'Rs.1200', difficulty: 'Easy', explanation: 'SI = P x R x T / 100 = 5000 x 8 x 3 / 100 = Rs.1200.' },
    { question: 'A man buys an article for Rs.450 and sells it for Rs.540. What is the gain percentage?', options: ['15%', '18%', '20%', '25%'], answer: '20%', difficulty: 'Easy', explanation: 'Gain = 540 - 450 = 90. Gain% = 90/450 x 100 = 20%.' },
    { question: 'If the perimeter of a square is 64 cm, what is its area?', options: ['196', '225', '256', '324'], answer: '256', difficulty: 'Easy', explanation: 'Side = 64/4 = 16 cm. Area = 16 x 16 = 256 sq cm.' },
  ],
  english: [
    { question: 'Choose the synonym of ABUNDANT.', options: ['Plentiful', 'Rare', 'Scarce', 'Meager'], answer: 'Plentiful', difficulty: 'Easy', explanation: 'Abundant means existing in large quantities; plentiful.' },
    { question: 'Choose the antonym of FICKLE.', options: ['Steadfast', 'Changeable', 'Unpredictable', 'Volatile'], answer: 'Steadfast', difficulty: 'Medium', explanation: 'Fickle means changing frequently; steadfast means firm and unchanging.' },
    { question: 'Identify the error: "Neither of the two candidates have submitted their forms."', options: ['Neither', 'have', 'their', 'No error'], answer: 'have', difficulty: 'Medium', explanation: 'With "Neither of", the verb should be singular: "has submitted".' },
    { question: 'Fill in the blank: "The committee ___ unanimous in its decision."', options: ['are', 'were', 'is', 'have been'], answer: 'is', difficulty: 'Medium', explanation: 'Collective nouns like committee usually take a singular verb when acting as a unit.' },
    { question: 'Choose the correctly spelled word.', options: ['Accommodate', 'Acommodate', 'Accomodate', 'Acomodate'], answer: 'Accommodate', difficulty: 'Easy', explanation: 'The correct spelling is accommodate with double c and double m.' },
    { question: 'One word substitution: A person who knows many languages.', options: ['Polyglot', 'Polygraph', 'Polyphony', 'Polymer'], answer: 'Polyglot', difficulty: 'Medium', explanation: 'A polyglot is a person who knows and uses several languages.' },
    { question: '"To burn the midnight oil" means:', options: ['To work late into the night', 'To waste oil', 'To study chemistry', 'To sleep early'], answer: 'To work late into the night', difficulty: 'Easy', explanation: 'This idiom means to study or work late at night.' },
    { question: 'Convert to passive voice: "They will have completed the project by Monday."', options: ['The project will have been completed by them by Monday.', 'The project will be completed by Monday.', 'The project would have been completed by Monday.', 'The project is completed by them.'], answer: 'The project will have been completed by them by Monday.', difficulty: 'Hard', explanation: 'Future perfect active becomes future perfect passive: will have + been + past participle.' },
    { question: '"He said, \"I am tired.\"" Convert to indirect speech.', options: ['He said that he was tired.', 'He said that he is tired.', 'He said that I was tired.', 'He said he had been tired.'], answer: 'He said that he was tired.', difficulty: 'Medium', explanation: 'Present tense in reported speech changes to past tense; first person changes to third.' },
    { question: 'Choose the synonym of ESOTERIC.', options: ['Common', 'Obscure', 'Popular', 'Simple'], answer: 'Obscure', difficulty: 'Hard', explanation: 'Esoteric means intended for or likely to be understood by only a small number of people; obscure.' },
    { question: 'Choose the antonym of BENEVOLENT.', options: ['Kind', 'Generous', 'Malevolent', 'Charitable'], answer: 'Malevolent', difficulty: 'Hard', explanation: 'Benevolent means well-meaning and kindly; malevolent means having ill will.' },
    { question: 'Identify the error in tense: "She has went to the market."', options: ['She', 'has', 'went', 'market'], answer: 'went', difficulty: 'Easy', explanation: 'After has/have, the past participle "gone" should be used, not "went".' },
    { question: 'Fill in the preposition: "He is addicted ___ smoking."', options: ['to', 'with', 'for', 'on'], answer: 'to', difficulty: 'Easy', explanation: 'The correct phrase is "addicted to".' },
    { question: 'Rearrange: P-He / Q-finished / R-his / S-work. The correct order is:', options: ['PQRS', 'PRQS', 'PRSQ', 'PSQR'], answer: 'PRSQ', difficulty: 'Medium', explanation: '"He finished his work" => P (He) R (his) S (work) Q (finished) is wrong. Correct: P-Q-R-S is "He finished his work" => P Q R S.' },
    { question: 'Which of the following is a compound sentence?', options: ['He ran fast but missed the bus.', 'Running fast, he missed the bus.', 'Having run fast, he missed the bus.', 'He missed the bus because of running fast.'], answer: 'He ran fast but missed the bus.', difficulty: 'Hard', explanation: 'A compound sentence has two independent clauses joined by a coordinating conjunction like but.' },
  ],
  'logical-reasoning': [
    { question: 'Find the odd one out: 2, 3, 5, 9, 11, 13', options: ['2', '3', '9', '11'], answer: '9', difficulty: 'Easy', explanation: 'All except 9 are prime numbers.' },
    { question: 'Complete the series: 2, 6, 12, 20, 30, ?', options: ['36', '38', '40', '42'], answer: '42', difficulty: 'Medium', explanation: 'The pattern is n(n+1): 1x2, 2x3, 3x4, 4x5, 5x6, so next is 6x7 = 42.' },
    { question: 'If TEACHER is coded as VGCEJGT, how is CHILDREN coded?', options: ['EJKNFTGP', 'EJKNETGP', 'EJKNFGTP', 'EJKNEGTP'], answer: 'EJKNFTGP', difficulty: 'Hard', explanation: 'Each letter is shifted by +2: C->E, H->J, I->K, L->N, D->F, R->T, E->G, N->P.' },
    { question: 'Pointing to a photograph, a man said, "She is the daughter of my grandfather\'s only son." How is the woman related to the man?', options: ['Sister', 'Cousin', 'Mother', 'Aunt'], answer: 'Sister', difficulty: 'Medium', explanation: 'Grandfather\'s only son = the man\'s father. Daughter of his father = his sister.' },
    { question: 'A man walks 5 km north, turns right and walks 3 km, then turns right again and walks 5 km. How far is he from the starting point?', options: ['3 km', '5 km', '8 km', '13 km'], answer: '3 km', difficulty: 'Easy', explanation: 'He ends up 3 km to the east of the starting point (forms a rectangle).' },
    { question: 'All roses are flowers. Some flowers are red. Which conclusion follows?', options: ['All roses are red.', 'Some roses are red.', 'Some red things are flowers.', 'None follows'], answer: 'Some red things are flowers.', difficulty: 'Medium', explanation: 'Since some flowers are red, it follows that some red things are flowers.' },
    { question: 'Doctor : Hospital :: Teacher : ?', options: ['School', 'Student', 'Class', 'Book'], answer: 'School', difficulty: 'Easy', explanation: 'A doctor works in a hospital; a teacher works in a school.' },
    { question: 'What was the day of the week on 15th August 1947?', options: ['Monday', 'Tuesday', 'Wednesday', 'Friday'], answer: 'Friday', difficulty: 'Hard', explanation: '15 August 1947 was a Friday.' },
    { question: 'At what time between 3 and 4 o\'clock do the hands of a clock coincide?', options: ['3:16 4/11', '3:15', '3:18', '3:20'], answer: '3:16 4/11', difficulty: 'Hard', explanation: 'The hands coincide at 3:16 4/11 minutes. Formula: 30H = 5.5M.' },
    { question: 'Five friends sit in a row. A is to the left of B but right of C. D is to the right of B but left of E. Who is in the middle?', options: ['A', 'B', 'C', 'D'], answer: 'B', difficulty: 'Medium', explanation: 'Order: C, A, B, D, E. B is in the middle.' },
    { question: 'Number series: 1, 1, 2, 3, 5, 8, ?', options: ['11', '12', '13', '21'], answer: '13', difficulty: 'Easy', explanation: 'Fibonacci series: each number is the sum of the two preceding ones. 5+8=13.' },
    { question: 'In a Venn diagram, if Circle A represents actors, Circle B represents politicians, and Circle C represents dancers, where would "actor politicians who are not dancers" be represented?', options: ['A intersect B only', 'A intersect C only', 'B intersect C only', 'A intersect B intersect C'], answer: 'A intersect B only', difficulty: 'Medium', explanation: 'Actor politicians who are not dancers = intersection of A and B excluding C.' },
    { question: 'Statement: All birds can fly. Assumption: Ostriches are birds. Conclusion: Ostriches can fly. Is the conclusion valid?', options: ['Yes', 'No', 'Cannot say', 'Data insufficient'], answer: 'No', difficulty: 'Medium', explanation: 'While logically deducible from the (false) statement, in reality ostriches cannot fly. However, strictly logically, it follows. The best reasoning answer here is that the major premise is factually false, making the conclusion unsound.' },
    { question: 'Data Sufficiency: What is the value of x? (1) x^2 = 16 (2) x > 0', options: ['Statement 1 alone', 'Statement 2 alone', 'Both together', 'Neither'], answer: 'Both together', difficulty: 'Medium', explanation: 'From (1), x = 4 or -4. From (2), x > 0. Combined: x = 4.' },
    { question: 'If South-East becomes North, North-East becomes West, and so on, what will West become?', options: ['South-East', 'North-East', 'South-West', 'North-West'], answer: 'South-East', difficulty: 'Hard', explanation: 'The directions are rotated 135 degrees clockwise. West becomes South-East.' },
  ],
  'general-knowledge': [
    { question: 'Who is the current President of India (as of 2024)?', options: ['Ram Nath Kovind', 'Droupadi Murmu', 'Pratibha Patil', 'APJ Abdul Kalam'], answer: 'Droupadi Murmu', difficulty: 'Easy', explanation: 'Droupadi Murmu became the 15th President of India in July 2022.' },
    { question: 'What is the capital of Australia?', options: ['Sydney', 'Melbourne', 'Canberra', 'Perth'], answer: 'Canberra', difficulty: 'Easy', explanation: 'Canberra is the capital city of Australia, not Sydney or Melbourne.' },
    { question: 'In which year was the Indian Constitution adopted?', options: ['1947', '1949', '1950', '1952'], answer: '1949', difficulty: 'Medium', explanation: 'The Constituent Assembly adopted the Indian Constitution on 26 November 1949.' },
    { question: 'Who wrote "The Discovery of India"?', options: ['Mahatma Gandhi', 'Jawaharlal Nehru', 'Subhas Chandra Bose', 'Rabindranath Tagore'], answer: 'Jawaharlal Nehru', difficulty: 'Easy', explanation: 'Jawaharlal Nehru wrote The Discovery of India during his imprisonment in 1942-1946.' },
    { question: 'Which is the longest river in India?', options: ['Yamuna', 'Godavari', 'Ganga', 'Brahmaputra'], answer: 'Ganga', difficulty: 'Easy', explanation: 'The Ganga is the longest river in India, flowing entirely within the country.' },
    { question: 'What is the currency of Japan?', options: ['Yuan', 'Won', 'Yen', 'Ringgit'], answer: 'Yen', difficulty: 'Easy', explanation: 'The Japanese Yen is the official currency of Japan.' },
    { question: 'Who won the Nobel Peace Prize in 2023?', options: ['Greta Thunberg', 'Narges Mohammadi', 'Malala Yousafzai', 'Abiy Ahmed'], answer: 'Narges Mohammadi', difficulty: 'Hard', explanation: 'Narges Mohammadi, an Iranian activist, won the 2023 Nobel Peace Prize.' },
    { question: 'Which planet is known as the Red Planet?', options: ['Venus', 'Mars', 'Jupiter', 'Saturn'], answer: 'Mars', difficulty: 'Easy', explanation: 'Mars is called the Red Planet due to iron oxide on its surface.' },
    { question: 'What is the national animal of India?', options: ['Lion', 'Elephant', 'Tiger', 'Leopard'], answer: 'Tiger', difficulty: 'Easy', explanation: 'The Royal Bengal Tiger is the national animal of India.' },
    { question: 'Who is known as the Father of the Indian Constitution?', options: ['Mahatma Gandhi', 'B.R. Ambedkar', 'Jawaharlal Nehru', 'Sardar Patel'], answer: 'B.R. Ambedkar', difficulty: 'Easy', explanation: 'Dr. B.R. Ambedkar is known as the Father of the Indian Constitution.' },
    { question: 'Which state is the largest producer of cotton in India?', options: ['Punjab', 'Maharashtra', 'Gujarat', 'Telangana'], answer: 'Gujarat', difficulty: 'Medium', explanation: 'Gujarat is the largest producer of cotton in India.' },
    { question: 'What does GDP stand for?', options: ['Gross Domestic Product', 'General Domestic Product', 'Gross Development Product', 'Global Domestic Product'], answer: 'Gross Domestic Product', difficulty: 'Easy', explanation: 'GDP stands for Gross Domestic Product, the total value of goods and services produced.' },
    { question: 'Which article of the Indian Constitution deals with Fundamental Rights?', options: ['Article 14', 'Article 21', 'Article 32', 'Articles 12-35'], answer: 'Articles 12-35', difficulty: 'Medium', explanation: 'Fundamental Rights are covered in Part III of the Constitution, Articles 12 to 35.' },
    { question: 'Who was the first woman Prime Minister of India?', options: ['Indira Gandhi', 'Sonia Gandhi', 'Sarojini Naidu', 'Pratibha Patil'], answer: 'Indira Gandhi', difficulty: 'Easy', explanation: 'Indira Gandhi became the first woman Prime Minister of India in 1966.' },
    { question: 'What is the full form of NASA?', options: ['National Aeronautics and Space Administration', 'National Air and Space Association', 'North American Space Agency', 'National Aerospace and Space Administration'], answer: 'National Aeronautics and Space Administration', difficulty: 'Easy', explanation: 'NASA stands for National Aeronautics and Space Administration, the US space agency.' },
  ],
  'science-technology': [
    { question: 'What is the chemical formula of water?', options: ['CO2', 'H2O', 'O2', 'NaCl'], answer: 'H2O', difficulty: 'Easy', explanation: 'Water consists of two hydrogen atoms and one oxygen atom: H2O.' },
    { question: 'Which gas is most abundant in Earth\'s atmosphere?', options: ['Oxygen', 'Carbon dioxide', 'Nitrogen', 'Hydrogen'], answer: 'Nitrogen', difficulty: 'Easy', explanation: 'Nitrogen makes up about 78% of Earth\'s atmosphere.' },
    { question: 'What is the SI unit of electric current?', options: ['Volt', 'Watt', 'Ampere', 'Ohm'], answer: 'Ampere', difficulty: 'Easy', explanation: 'The ampere (A) is the SI unit of electric current.' },
    { question: 'Who discovered penicillin?', options: ['Louis Pasteur', 'Alexander Fleming', 'Robert Koch', 'Joseph Lister'], answer: 'Alexander Fleming', difficulty: 'Medium', explanation: 'Alexander Fleming discovered penicillin in 1928 from the Penicillium mold.' },
    { question: 'What does DNA stand for?', options: ['Deoxyribonucleic Acid', 'Dinucleic Acid', 'Dioxyribose Acid', 'Dual Nucleic Acid'], answer: 'Deoxyribonucleic Acid', difficulty: 'Easy', explanation: 'DNA stands for Deoxyribonucleic Acid, the molecule carrying genetic instructions.' },
    { question: 'Which organ in the human body produces insulin?', options: ['Liver', 'Pancreas', 'Kidney', 'Stomach'], answer: 'Pancreas', difficulty: 'Easy', explanation: 'The pancreas produces insulin in its beta cells to regulate blood sugar.' },
    { question: 'What is the approximate speed of light in vacuum?', options: ['3 x 10^6 m/s', '3 x 10^8 m/s', '3 x 10^10 m/s', '3 x 10^4 m/s'], answer: '3 x 10^8 m/s', difficulty: 'Easy', explanation: 'Light travels at approximately 3 x 10^8 meters per second in vacuum.' },
    { question: 'Which element has the atomic number 1?', options: ['Helium', 'Hydrogen', 'Lithium', 'Carbon'], answer: 'Hydrogen', difficulty: 'Easy', explanation: 'Hydrogen is the first element in the periodic table with atomic number 1.' },
    { question: 'What is the hardest natural substance on Earth?', options: ['Gold', 'Iron', 'Diamond', 'Quartz'], answer: 'Diamond', difficulty: 'Easy', explanation: 'Diamond, an allotrope of carbon, is the hardest known natural material.' },
    { question: 'Which part of the plant conducts photosynthesis?', options: ['Root', 'Stem', 'Leaf', 'Flower'], answer: 'Leaf', difficulty: 'Easy', explanation: 'Leaves contain chlorophyll and are the primary site of photosynthesis.' },
    { question: 'What does CPU stand for?', options: ['Central Processing Unit', 'Computer Personal Unit', 'Central Power Unit', 'Central Program Unit'], answer: 'Central Processing Unit', difficulty: 'Easy', explanation: 'CPU stands for Central Processing Unit, the brain of a computer.' },
    { question: 'What is the full form of HTTP?', options: ['HyperText Transfer Protocol', 'HyperText Transmission Process', 'HighText Transfer Protocol', 'HyperText Transfer Process'], answer: 'HyperText Transfer Protocol', difficulty: 'Easy', explanation: 'HTTP is the protocol used for transferring web pages on the internet.' },
    { question: 'Which programming language is known as the language of the web?', options: ['Python', 'C++', 'JavaScript', 'Java'], answer: 'JavaScript', difficulty: 'Easy', explanation: 'JavaScript is the primary scripting language used to create dynamic web content.' },
    { question: 'What is the main function of RAM in a computer?', options: ['Permanent storage', 'Temporary memory', 'Processing data', 'Display output'], answer: 'Temporary memory', difficulty: 'Easy', explanation: 'RAM provides temporary volatile memory for active programs and data.' },
    { question: 'Who is considered the father of Computers?', options: ['Alan Turing', 'Charles Babbage', 'John von Neumann', 'Bill Gates'], answer: 'Charles Babbage', difficulty: 'Medium', explanation: 'Charles Babbage originated the concept of a digital programmable computer.' },
  ],
};

// Get question bank from i18n translations if available, else fallback to hardcoded English
function getQuestionBank() {
  if (window.i18n) {
    const translated = window.i18n.t('questionBank', null);
    if (translated && typeof translated === 'object') {
      return translated;
    }
  }
  return questionBank;
}

// Listen for language changes to re-render active test questions in the new language
window.addEventListener('languageChanged', (e) => {
  if (testInProgress && testState.activeQuestions.length > 0) {
    const bank = getQuestionBank();
    const subject = testState.subject;
    const translatedQuestions = bank[subject] || [];
    if (translatedQuestions.length > 0) {
      // Map each active question to its translated version by matching the answer
      testState.activeQuestions = testState.activeQuestions.map((activeQ) => {
        const match = translatedQuestions.find(tq => tq.answer === activeQ.answer);
        return match || activeQ;
      });
      displayQuestion();
    }
  }
});

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
  setupCustomMockTestListeners();
  displayAssignmentStatus();
  if (currentUser.role === 'admin') {
    displayAdminTests();
  }
  loadStats();
  initializeCareerGuidance();
}

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
  // Navigation
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', handleNavigation);
  });

  // Mock test
  document.getElementById('start-test').addEventListener('click', startMockTest);
  document.getElementById('submit-test').addEventListener('click', submitTest);
  document.getElementById('reset-session').addEventListener('click', resetSession);
  document.getElementById('load-more').addEventListener('click', loadMoreQuestions);

  // Career Guidance
  setupCareerGuidanceListeners();

  // Admin
  if (currentUser.role === 'admin') {
    document.getElementById('admin-schedule-form').addEventListener('submit', handleAdminScheduleSubmit);
  }

  // Security listeners
  window.addEventListener('blur', handleTabSwitch);
  document.addEventListener('keydown', preventDevTools);
  document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('copy', e => { if (testInProgress) e.preventDefault(); });
  document.addEventListener('cut', e => { if (testInProgress) e.preventDefault(); });
}

// ==================== CAREER GUIDANCE FUNCTIONALITY ====================
function setupCareerGuidanceListeners() {
  const form = document.getElementById('career-preference-form');
  if (form) {
    form.addEventListener('submit', handleCareerFormSubmit);
  }
}

function initializeCareerGuidance() {
  setupCareerGuidanceListeners();
  loadSavedPreferences();
}

function handleCareerFormSubmit(e) {
  e.preventDefault();
  const education = document.getElementById('cg-education').value;
  const interest = document.getElementById('cg-interest').value;
  const subject = document.getElementById('cg-subject').value;
  const location = document.getElementById('cg-location').value;

  if (!education || !interest || !subject || !location) {
    alert(t('career.fillAllFields', 'Please fill in all fields'));
    return;
  }

  const preferences = { education, interest, subject, location };
  localStorage.setItem('careerPreferences', JSON.stringify(preferences));
  renderExamRecommendations(preferences);
}

function loadSavedPreferences() {
  const saved = localStorage.getItem('careerPreferences');
  if (saved) {
    const prefs = JSON.parse(saved);
    document.getElementById('cg-education').value = prefs.education;
    document.getElementById('cg-interest').value = prefs.interest;
    document.getElementById('cg-subject').value = prefs.subject;
    document.getElementById('cg-location').value = prefs.location;
    renderExamRecommendations(prefs);
  }
}

// Comprehensive exam database with eligibility and matching criteria
const examDatabase = [
  {
    name: 'SSC CGL',
    fullName: 'Staff Selection Commission - Combined Graduate Level',
    category: 'government',
    minEducation: 'graduate',
    subjects: ['math', 'english', 'reasoning', 'gk'],
    location: ['central', 'any'],
    description: 'Group B & C posts in various ministries and departments. Most popular SSC exam.',
    salary: '₹25,500 - ₹1,51,100 (Level 4-8)',
    examPattern: 'Tier-I (Online), Tier-II (Online), Tier-III (Descriptive), Tier-IV (Skill Test)',
    frequency: 'Once a year',
    difficulty: 'High',
  },
  {
    name: 'SSC CHSL',
    fullName: 'SSC - Combined Higher Secondary Level',
    category: 'government',
    minEducation: '12th',
    subjects: ['math', 'english', 'reasoning', 'gk'],
    location: ['central', 'any'],
    description: 'Data Entry Operator (DEO) and Lower Division Clerk (LDC) posts.',
    salary: '₹19,900 - ₹63,200 (Level 2-4)',
    examPattern: 'Tier-I (Online), Tier-II (Descriptive), Tier-III (Skill/Typing Test)',
    frequency: 'Once a year',
    difficulty: 'Medium',
  },
  {
    name: 'SSC MTS',
    fullName: 'SSC - Multi Tasking Staff',
    category: 'government',
    minEducation: '10th',
    subjects: ['math', 'english', 'reasoning', 'gk'],
    location: ['central', 'any'],
    description: 'Group C non-gazetted posts in various central government offices.',
    salary: '₹18,000 - ₹56,900 (Level 1)',
    examPattern: 'Paper-I (Online), Paper-II (Descriptive)',
    frequency: 'Once a year',
    difficulty: 'Easy-Medium',
  },
  {
    name: 'SSC GD',
    fullName: 'SSC - General Duty Constable',
    category: 'defence',
    minEducation: '10th',
    subjects: ['math', 'english', 'reasoning', 'gk'],
    location: ['central', 'any'],
    description: 'Constable posts in CAPFs, NIA, SSF, and Rifleman in Assam Rifles.',
    salary: '₹21,700 - ₹69,100 (Level 3)',
    examPattern: 'Online CBT, Physical Test, Medical Test',
    frequency: 'Once a year',
    difficulty: 'Medium',
  },
  {
    name: 'IBPS PO',
    fullName: 'Institute of Banking Personnel Selection - Probationary Officer',
    category: 'banking',
    minEducation: 'graduate',
    subjects: ['math', 'english', 'reasoning', 'gk'],
    location: ['any'],
    description: 'Management trainee positions leading to Officer role in public sector banks.',
    salary: '₹36,000 - ₹63,840 (Scale I)',
    examPattern: 'Prelims (Online), Mains (Online), Interview',
    frequency: 'Once a year',
    difficulty: 'High',
  },
  {
    name: 'IBPS Clerk',
    fullName: 'IBPS - Clerk',
    category: 'banking',
    minEducation: 'graduate',
    subjects: ['math', 'english', 'reasoning', 'gk'],
    location: ['any'],
    description: 'Clerical cadre positions in public sector banks across India.',
    salary: '₹19,900 - ₹47,920',
    examPattern: 'Prelims (Online), Mains (Online)',
    frequency: 'Once a year',
    difficulty: 'Medium',
  },
  {
    name: 'SBI PO',
    fullName: 'State Bank of India - Probationary Officer',
    category: 'banking',
    minEducation: 'graduate',
    subjects: ['math', 'english', 'reasoning', 'gk'],
    location: ['any'],
    description: 'Most prestigious banking job. Officer role in SBI with fast career growth.',
    salary: '₹41,960 - ₹76,025 (Scale I)',
    examPattern: 'Prelims (Online), Mains (Online), Group Exercise & Interview',
    frequency: 'Once a year',
    difficulty: 'Very High',
  },
  {
    name: 'SBI Clerk',
    fullName: 'SBI - Junior Associate',
    category: 'banking',
    minEducation: 'graduate',
    subjects: ['math', 'english', 'reasoning', 'gk'],
    location: ['any'],
    description: 'Clerical positions in State Bank of India branches across India.',
    salary: '₹26,000 - ₹38,000 approx',
    examPattern: 'Prelims (Online), Mains (Online)',
    frequency: 'Once a year',
    difficulty: 'Medium-High',
  },
  {
    name: 'RBI Grade B',
    fullName: 'Reserve Bank of India - Grade B Officer',
    category: 'banking',
    minEducation: 'graduate',
    subjects: ['math', 'english', 'reasoning', 'gk'],
    location: ['any'],
    description: 'Officers in Reserve Bank of India. One of the most prestigious banking jobs.',
    salary: '₹55,000 - ₹85,000 approx',
    examPattern: 'Phase-I (Online), Phase-II (Online + Descriptive), Interview',
    frequency: 'Once a year',
    difficulty: 'Very High',
  },
  {
    name: 'UPSC CSE',
    fullName: 'UPSC Civil Services Examination (IAS/IPS/IFS/IRS)',
    category: 'government',
    minEducation: 'graduate',
    subjects: ['gk', 'english', 'reasoning'],
    location: ['central', 'any'],
    description: 'The most prestigious exam in India. Leads to IAS, IPS, IFS, and other All India Services.',
    salary: '₹56,100 - ₹2,50,000 (Level 10-18)',
    examPattern: 'Prelims (GS + CSAT), Mains (9 Papers), Interview',
    frequency: 'Once a year',
    difficulty: 'Very High',
  },
  {
    name: 'UPSC CDS',
    fullName: 'Combined Defence Services',
    category: 'defence',
    minEducation: '12th',
    subjects: ['math', 'english', 'gk', 'science'],
    location: ['central', 'any'],
    description: 'Entry to Indian Military Academy, Naval Academy, and Air Force Academy.',
    salary: '₹56,100 - ₹2,50,000 (Level 10)',
    examPattern: 'Written Exam (English, GK, Elementary Math), SSB Interview',
    frequency: 'Twice a year',
    difficulty: 'High',
  },
  {
    name: 'UPSC NDA',
    fullName: 'National Defence Academy',
    category: 'defence',
    minEducation: '12th',
    subjects: ['math', 'english', 'gk', 'science'],
    location: ['central', 'any'],
    description: 'Entry to Army, Navy, and Air Force wings of NDA after 10+2.',
    salary: 'Stipend during training, then Level 10 pay scale',
    examPattern: 'Written (Math, GAT), SSB Interview, Medical',
    frequency: 'Twice a year',
    difficulty: 'High',
  },
  {
    name: 'AFCAT',
    fullName: 'Air Force Common Admission Test',
    category: 'defence',
    minEducation: 'graduate',
    subjects: ['math', 'english', 'reasoning', 'gk'],
    location: ['central', 'any'],
    description: 'Flying Branch, Ground Duty (Technical & Non-Technical) in Indian Air Force.',
    salary: '₹56,100 - ₹2,50,000 (Level 10)',
    examPattern: 'Online Test, AFSB Interview, Medical',
    frequency: 'Twice a year',
    difficulty: 'High',
  },
  {
    name: 'RRB NTPC',
    fullName: 'Railway Recruitment Board - Non-Technical Popular Categories',
    category: 'railway',
    minEducation: '12th',
    subjects: ['math', 'english', 'reasoning', 'gk'],
    location: ['central', 'any'],
    description: 'Various non-technical posts like Clerk, Ticket Examiner, Commercial Apprentice.',
    salary: '₹19,900 - ₹35,400 (Level 2-5)',
    examPattern: 'CBT-1, CBT-2, Typing Skill Test / Computer Based Aptitude Test',
    frequency: 'Once a year',
    difficulty: 'Medium-High',
  },
  {
    name: 'RRB Group D',
    fullName: 'RRB - Level 1 Posts',
    category: 'railway',
    minEducation: '10th',
    subjects: ['math', 'english', 'reasoning', 'gk'],
    location: ['central', 'any'],
    description: 'Track Maintainer, Helper, Assistant Pointsman, Porter and other Level-1 posts.',
    salary: '₹18,000 (Level 1)',
    examPattern: 'CBT, Physical Efficiency Test, Document Verification',
    frequency: 'Once a year',
    difficulty: 'Medium',
  },
  {
    name: 'CTET',
    fullName: 'Central Teacher Eligibility Test',
    category: 'teaching',
    minEducation: '12th',
    subjects: ['math', 'english', 'reasoning', 'gk'],
    location: ['central', 'any'],
    description: 'Mandatory qualification for teaching classes I to VIII in central government schools.',
    salary: 'Depends on school (₹35,000 - ₹70,000 approx)',
    examPattern: 'Paper-I (Classes 1-5), Paper-II (Classes 6-8)',
    frequency: 'Twice a year',
    difficulty: 'Medium',
  },
  {
    name: 'State TET',
    fullName: 'Teacher Eligibility Test (State Level)',
    category: 'teaching',
    minEducation: '12th',
    subjects: ['math', 'english', 'reasoning', 'gk'],
    location: ['state', 'any'],
    description: 'State-level teacher eligibility for government schools in respective states.',
    salary: 'State-dependent (₹25,000 - ₹60,000 approx)',
    examPattern: 'Similar to CTET structure',
    frequency: 'Varies by state',
    difficulty: 'Medium',
  },
  {
    name: 'LIC AAO',
    fullName: 'Life Insurance Corporation - Assistant Administrative Officer',
    category: 'insurance',
    minEducation: 'graduate',
    subjects: ['math', 'english', 'reasoning', 'gk'],
    location: ['any'],
    description: 'Administrative officer positions in LIC with managerial growth path.',
    salary: '₹53,000 - ₹85,000 approx',
    examPattern: 'Prelims, Mains, Interview',
    frequency: 'Once a year (irregular)',
    difficulty: 'High',
  },
  {
    name: 'NICL AO',
    fullName: 'National Insurance Company - Administrative Officer',
    category: 'insurance',
    minEducation: 'graduate',
    subjects: ['math', 'english', 'reasoning', 'gk'],
    location: ['any'],
    description: 'Administrative Officer in National Insurance Company Limited.',
    salary: '₹50,000 - ₹75,000 approx',
    examPattern: 'Prelims, Mains, Interview',
    frequency: 'Once a year (irregular)',
    difficulty: 'High',
  },
];

const educationRanks = { '10th': 1, '12th': 2, 'graduate': 3, 'pg': 4 };

function isEligible(exam, prefs) {
  const userEduRank = educationRanks[prefs.education] || 0;
  const examEduRank = educationRanks[exam.minEducation] || 0;
  if (userEduRank < examEduRank) return false;

  if (prefs.interest !== 'any' && exam.category !== prefs.interest) return false;

  if (!exam.location.includes(prefs.location) && !exam.location.includes('any')) return false;

  return true;
}

function calculateMatchScore(exam, prefs) {
  let score = 0;

  // Subject match bonus
  if (exam.subjects.includes(prefs.subject)) {
    score += 30;
  } else if (prefs.subject === 'all') {
    score += 20;
  } else {
    score += 10;
  }

  // Education over-qualification bonus
  const userEduRank = educationRanks[prefs.education] || 0;
  const examEduRank = educationRanks[exam.minEducation] || 0;
  if (userEduRank > examEduRank) score += 10;

  // Interest exact match bonus
  if (prefs.interest === 'any') score += 15;
  else if (exam.category === prefs.interest) score += 20;

  // Location match bonus
  if (exam.location.includes(prefs.location)) score += 15;
  else if (exam.location.includes('any')) score += 10;

  return score;
}

function renderExamRecommendations(prefs) {
  const container = document.getElementById('exam-recommendations');
  if (!container) return;

  const eligibleExams = examDatabase
    .filter(exam => isEligible(exam, prefs))
    .map(exam => ({ ...exam, matchScore: calculateMatchScore(exam, prefs) }))
    .sort((a, b) => b.matchScore - a.matchScore);

  if (eligibleExams.length === 0) {
    container.innerHTML =
      '<div class="recommendation-card info">' +
      '<h4>🎯 ' + t('career.noMatchTitle', 'No Exact Matches Found') + '</h4>' +
      '<p>' + t('career.noMatchDesc', 'Try selecting "Open to All" for Career Interest or a different education level to see more options.') + '</p>' +
      '</div>';
    return;
  }

  let html = '<div class="recommendations-header"><h3>📋 ' + t('career.yourRecommendations', 'Recommended Exams for You') + '</h3></div>';
  html += '<div class="recommendations-grid">';

  eligibleExams.forEach((exam, index) => {
    const priorityClass = index === 0 ? 'high' : index <= 2 ? 'medium' : 'low';
    const badgeText = index === 0 ? t('career.bestMatch', 'BEST MATCH') : index <= 2 ? t('career.goodMatch', 'GOOD MATCH') : t('career.eligible', 'ELIGIBLE');

    html += '<div class="recommendation-card ' + priorityClass + '">' +
      '<div class="rec-badge">' + badgeText + '</div>' +
      '<h4>' + exam.name + '</h4>' +
      '<p class="exam-fullname">' + exam.fullName + '</p>' +
      '<p><strong>' + t('career.examDesc', 'Description:') + '</strong> ' + exam.description + '</p>' +
      '<p><strong>' + t('career.examSalary', 'Salary:') + '</strong> <span class="salary-highlight">' + exam.salary + '</span></p>' +
      '<p><strong>' + t('career.examPattern', 'Pattern:') + '</strong> ' + exam.examPattern + '</p>' +
      '<p><strong>' + t('career.examFrequency', 'Frequency:') + '</strong> ' + exam.frequency + '</p>' +
      '<p><strong>' + t('career.examDifficulty', 'Difficulty:') + '</strong> ' + exam.difficulty + '</p>' +
      '<div class="exam-match-bar">' +
        '<div class="match-fill" style="width:' + exam.matchScore + '%"></div>' +
        '<span>' + exam.matchScore + '% ' + t('career.matchScore', 'Match') + '</span>' +
      '</div>' +
      '</div>';
  });

  html += '</div>';
  container.innerHTML = html;
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
  try {
    const subject = document.getElementById('subject-select').value;
    let numQuestions = parseInt(document.getElementById('num-questions').value);

    const allQs = [...(getQuestionBank()[subject] || [])];
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
  } catch (err) {
    console.error('❌ startMockTest failed:', err);
    alert('Failed to start mock test. Error: ' + err.message);
    // Recovery: reset UI so user can try again
    disableTestSecurity();
    testInProgress = false;
    document.getElementById('start-test').disabled = false;
  }
}

function displayQuestion() {
  if (!Array.isArray(testState.activeQuestions) || testState.activeQuestions.length === 0) {
    document.getElementById('test-form').innerHTML = '<p style="color: #ef4444;">' + t('mockTest.noQuestionsAvailable', 'No questions available.') + '</p>';
    return;
  }

  let allQuestionsHTML = '';

  testState.activeQuestions.forEach((question, idx) => {
    // Defensive validation: skip malformed questions
    if (!question || typeof question !== 'object') {
      console.warn('Skipping invalid question at index', idx);
      return;
    }
    if (!Array.isArray(question.options) || question.options.length === 0) {
      console.warn('Skipping question with missing/invalid options at index', idx, question);
      return;
    }
    const difficulty = (question.difficulty || 'Easy').toLowerCase();
    const diffLabel = t('questions.' + difficulty, question.difficulty || 'Easy');
    allQuestionsHTML += '<div class="question-card" id="qcard-' + idx + '">' +
      '<div class="question-meta">' +
      '<span>' + t('mockTest.questionOf', 'Question {current} of {total}').replace('{current}', idx + 1).replace('{total}', testState.numQuestions) + '</span>' +
      '<span class="difficulty-' + difficulty + '">' + diffLabel + '</span>' +
      '</div>' +
      '<p>' + (question.question || 'Question text missing') + '</p>' +
      '<div class="answer-group">' +
      question.options.map((option) =>
        '<label><input type="radio" name="answer-' + idx + '" value="' + option + '" ' + (testState.selectedAnswers[idx] === option ? 'checked' : '') + ' />' +
        '<span>' + option + '</span></label>'
      ).join('') +
      '</div>' +
      '<div class="explanation hidden" id="expl-' + idx + '">' +
      '<p style="margin-bottom:8px"><strong>' + t('mockTest.correctAnswer', 'Correct answer:') + '</strong> ' + (question.answer || 'N/A') + '</p>' +
      '<p><strong>' + t('mockTest.explanation', 'Explanation:') + '</strong> ' + (question.explanation || '') + '</p>' +
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
    '<div class="result-item-label">' + t('mockTest.timeTaken', 'Time Taken') + '</div>' +
    '<div class="result-item-value">' + formatTime(timeTaken) + '</div>' +
    '</div>' +
    '</div>' +
    '<button class="action-button" onclick="resetSession()" data-i18n="mockTest.retakeTest">Retake Test</button>';

  document.getElementById('test-result').innerHTML = testResultHTML;
  document.getElementById('test-result').classList.remove('hidden');
  document.getElementById('submit-test').classList.add('hidden');
  document.getElementById('start-test').disabled = false;

  // Save COMPLETE test result with all details
  saveTestResult({
    testId: Date.now().toString(),
    userId: currentUser.id || currentUser.email,
    userName: currentUser.name || currentUser.email,
    userRole: currentUser.role,
    subject: testState.subject,
    score: parseFloat(score),
    numQuestions: testState.numQuestions,
    correctCount: correctCount,
    wrongCount: testState.numQuestions - correctCount,
    timeTaken: timeTaken,
    date: new Date().toISOString(),
    startTime: new Date(testState.startTime).toISOString(),
    endTime: new Date().toISOString(),
    duration: testState.duration,
    questionDetails: testState.activeQuestions.map((question, idx) => ({
      questionNumber: idx + 1,
      question: question.question,
      userAnswer: testState.selectedAnswers[idx] || 'Not Answered',
      correctAnswer: question.answer,
      isCorrect: testState.selectedAnswers[idx] === question.answer,
      options: question.options,
      difficulty: question.difficulty,
      explanation: question.explanation,
    })),
    browserInfo: {
      userAgent: navigator.userAgent,
      timestamp: new Date().toLocaleString(),
    },
  });
}

function resetSession() {
  testInProgress = false;
  tabSwitches = 0;
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
  document.getElementById('submit-test').classList.add('hidden');
  document.getElementById('load-more').classList.add('hidden');
  document.getElementById('start-test').disabled = false;
}

function loadMoreQuestions() {
  alert(t('common.notImplemented', 'Load more functionality coming soon'));
}

// ==================== CUSTOM MOCK TEST FUNCTIONALITY ====================
let customTestState = {
  generatedQuestions: [],
  activeQuestions: [],
  selectedAnswers: [],
  numQuestions: 0,
  startTime: null,
  duration: 0,
};
let customTestInProgress = false;

function setupCustomMockTestListeners() {
  const generateBtn = document.getElementById('generate-custom-test');
  const startBtn = document.getElementById('start-custom-test-btn');
  const regenerateBtn = document.getElementById('regenerate-custom-test');
  const submitBtn = document.getElementById('custom-submit-test');

  if (generateBtn) {
    generateBtn.addEventListener('click', generateCustomMockTest);
  }
  if (startBtn) {
    startBtn.addEventListener('click', startCustomTest);
  }
  if (regenerateBtn) {
    regenerateBtn.addEventListener('click', generateCustomMockTest);
  }
  if (submitBtn) {
    submitBtn.addEventListener('click', submitCustomTest);
  }
}

async function generateCustomMockTest() {
  const textInput = document.getElementById('custom-text-input');
  const numQuestionsSelect = document.getElementById('custom-num-questions');
  const generateBtn = document.getElementById('generate-custom-test');

  if (!textInput || !textInput.value.trim()) {
    alert(t('customMockTest.provideContent', 'Please paste some text content.'));
    return;
  }

  generateBtn.disabled = true;
  generateBtn.textContent = t('customMockTest.generating', 'Generating...');

  try {
    const formData = new FormData();
    formData.append('numQuestions', numQuestionsSelect ? numQuestionsSelect.value : '10');
    formData.append('text', textInput.value.trim());

    const response = await fetch('/api/custom-mocktest/generate', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      alert(data.message || t('customMockTest.generationFailed', 'Failed to generate questions. Please try again.'));
      return;
    }

    customTestState.generatedQuestions = data.questions;
    displayCustomQuestionsPreview(data.questions);

  } catch (error) {
    console.error('Custom mock test generation error:', error);
    alert(t('customMockTest.generationError', 'Error generating questions. Please check your connection and try again.'));
  } finally {
    generateBtn.disabled = false;
    generateBtn.textContent = t('customMockTest.generateQuestions', 'Generate Questions');
  }
}

function displayCustomQuestionsPreview(questions) {
  const previewContainer = document.getElementById('custom-questions-preview');
  const questionsList = document.getElementById('custom-questions-list');

  if (!previewContainer || !questionsList) return;

  let html = '';
  questions.forEach((q, idx) => {
    html += '<div class="custom-question-preview">' +
      '<div class="custom-question-number">Q' + (idx + 1) + '</div>' +
      '<div class="custom-question-text">' + q.question + '</div>' +
      '<div class="custom-question-options">' +
      q.options.map(opt => '<span class="custom-option-badge">' + opt + '</span>').join('') +
      '</div>' +
      '<div class="custom-question-answer">✓ ' + q.answer + '</div>' +
      '</div>';
  });

  questionsList.innerHTML = html;
  previewContainer.classList.remove('hidden');
  previewContainer.scrollIntoView({ behavior: 'smooth' });
}

function startCustomTest() {
  if (!customTestState.generatedQuestions || customTestState.generatedQuestions.length === 0) {
    alert(t('customMockTest.noQuestions', 'No questions generated. Please generate questions first.'));
    return;
  }

  const numQuestions = customTestState.generatedQuestions.length;

  customTestState.activeQuestions = [...customTestState.generatedQuestions];
  customTestState.selectedAnswers = new Array(numQuestions).fill(null);
  customTestState.numQuestions = numQuestions;
  customTestState.startTime = Date.now();
  customTestState.duration = numQuestions * 2 * 60;
  customTestInProgress = true;
  tabSwitches = 0;

  // Hide preview, show test container
  document.getElementById('custom-questions-preview').classList.add('hidden');
  document.getElementById('custom-test-container').classList.remove('hidden');
  document.getElementById('custom-test-result').classList.add('hidden');
  document.getElementById('custom-submit-test').classList.remove('hidden');

  document.getElementById('custom-test-title').textContent = t('customMockTest.title', 'Custom Mock Test');
  document.getElementById('custom-test-description').textContent =
    t('mockTest.testDescription', 'Answer {num} questions in {min} minutes.')
      .replace('{num}', numQuestions)
      .replace('{min}', customTestState.duration / 60);

  displayCustomQuestions();
  startCustomTimer();
  enableTestSecurity();
  document.getElementById('custom-test-container').scrollIntoView({ behavior: 'smooth' });
}

function displayCustomQuestions() {
  const form = document.getElementById('custom-test-form');
  if (!form) return;

  let html = '';
  customTestState.activeQuestions.forEach((question, idx) => {
    const difficulty = (question.difficulty || 'Easy').toLowerCase();
    html += '<div class="question-card" id="custom-qcard-' + idx + '">' +
      '<div class="question-meta">' +
      '<span>' + t('mockTest.questionOf', 'Question {current} of {total}').replace('{current}', idx + 1).replace('{total}', customTestState.numQuestions) + '</span>' +
      '<span class="difficulty-' + difficulty + '">' + (question.difficulty || 'Easy') + '</span>' +
      '</div>' +
      '<p>' + (question.question || 'Question text missing') + '</p>' +
      '<div class="answer-group">' +
      question.options.map((option) =>
        '<label><input type="radio" name="custom-answer-' + idx + '" value="' + option + '" ' + (customTestState.selectedAnswers[idx] === option ? 'checked' : '') + ' />' +
        '<span>' + option + '</span></label>'
      ).join('') +
      '</div>' +
      '<div class="explanation hidden" id="custom-expl-' + idx + '">' +
      '<p style="margin-bottom:8px"><strong>' + t('mockTest.correctAnswer', 'Correct answer:') + '</strong> ' + (question.answer || 'N/A') + '</p>' +
      '<p><strong>' + t('mockTest.explanation', 'Explanation:') + '</strong> ' + (question.explanation || '') + '</p>' +
      '</div>' +
      '</div>';
  });

  form.innerHTML = html;
  updateCustomProgress();

  customTestState.activeQuestions.forEach((_, idx) => {
    document.querySelectorAll('input[name="custom-answer-' + idx + '"]').forEach(input => {
      input.addEventListener('change', (e) => {
        customTestState.selectedAnswers[idx] = e.target.value;
        updateCustomProgress();
      });
    });
  });
}

function updateCustomProgress() {
  const answered = customTestState.selectedAnswers.filter(a => a !== null).length;
  const filled = customTestState.numQuestions > 0 ? (answered / customTestState.numQuestions) * 100 : 0;
  const fillEl = document.getElementById('custom-progress-fill');
  const infoEl = document.getElementById('custom-progress-info');
  if (fillEl) fillEl.style.width = filled + '%';
  if (infoEl) infoEl.textContent = t('mockTest.answered', 'Answered {answered} of {total}')
    .replace('{answered}', answered)
    .replace('{total}', customTestState.numQuestions);
}

function startCustomTimer() {
  if (window.customTestTimerInterval) clearInterval(window.customTestTimerInterval);

  const updateTimerDisplay = () => {
    const elapsed = Math.floor((Date.now() - customTestState.startTime) / 1000);
    const remaining = customTestState.duration - elapsed;
    const timerEl = document.getElementById('custom-timer');

    if (remaining <= 0) {
      if (timerEl) timerEl.textContent = '00:00';
      clearInterval(window.customTestTimerInterval);
      submitCustomTest();
      return;
    }

    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    if (timerEl) timerEl.textContent = String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
  };

  updateTimerDisplay();
  window.customTestTimerInterval = setInterval(updateTimerDisplay, 1000);
}

function submitCustomTest() {
  customTestInProgress = false;
  disableTestSecurity();
  if (window.customTestTimerInterval) clearInterval(window.customTestTimerInterval);

  let correctCount = 0;

  customTestState.selectedAnswers.forEach((answer, idx) => {
    const question = customTestState.activeQuestions[idx];
    const isCorrect = answer === question.answer;
    if (isCorrect) correctCount++;

    const card = document.getElementById('custom-qcard-' + idx);
    if (card) {
      card.classList.add(isCorrect ? 'correct' : 'incorrect');
      const expl = document.getElementById('custom-expl-' + idx);
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

  const rawScore = customTestState.numQuestions > 0 ? (correctCount / customTestState.numQuestions) * 100 : 0;
  const score = rawScore.toFixed(2);
  const timeTaken = Math.floor((Date.now() - customTestState.startTime) / 1000);

  const testResultHTML = '<div class="result-score">' + score + '%</div>' +
    '<div class="result-details">' +
    '<div class="result-item">' +
    '<div class="result-item-label">' + t('mockTest.correct', 'Correct') + '</div>' +
    '<div class="result-item-value">' + correctCount + '/' + customTestState.numQuestions + '</div>' +
    '</div>' +
    '<div class="result-item">' +
    '<div class="result-item-label">' + t('mockTest.timeTaken', 'Time Taken') + '</div>' +
    '<div class="result-item-value">' + formatTime(timeTaken) + '</div>' +
    '</div>' +
    '</div>' +
    '<button class="action-button" onclick="resetCustomSession()" data-i18n="mockTest.retakeTest">Retake Test</button>';

  const resultEl = document.getElementById('custom-test-result');
  if (resultEl) {
    resultEl.innerHTML = testResultHTML;
    resultEl.classList.remove('hidden');
  }
  document.getElementById('custom-submit-test').classList.add('hidden');

  saveTestResult({
    testId: 'custom-' + Date.now().toString(),
    userId: currentUser.id || currentUser.email,
    userName: currentUser.name || currentUser.email,
    userRole: currentUser.role,
    subject: 'custom-mock-test',
    score: parseFloat(score),
    numQuestions: customTestState.numQuestions,
    correctCount: correctCount,
    wrongCount: customTestState.numQuestions - correctCount,
    timeTaken: timeTaken,
    date: new Date().toISOString(),
    startTime: new Date(customTestState.startTime).toISOString(),
    endTime: new Date().toISOString(),
    duration: customTestState.duration,
    questionDetails: customTestState.activeQuestions.map((question, idx) => ({
      questionNumber: idx + 1,
      question: question.question,
      userAnswer: customTestState.selectedAnswers[idx] || 'Not Answered',
      correctAnswer: question.answer,
      isCorrect: customTestState.selectedAnswers[idx] === question.answer,
      options: question.options,
      difficulty: question.difficulty,
      explanation: question.explanation,
    })),
    browserInfo: {
      userAgent: navigator.userAgent,
      timestamp: new Date().toLocaleString(),
    },
  });
}

function resetCustomSession() {
  customTestInProgress = false;
  tabSwitches = 0;
  customTestState = {
    generatedQuestions: [],
    activeQuestions: [],
    selectedAnswers: [],
    numQuestions: 0,
    startTime: null,
    duration: 0,
  };

  document.getElementById('custom-test-container').classList.add('hidden');
  document.getElementById('custom-test-form').innerHTML = '';
  document.getElementById('custom-test-result').classList.add('hidden');
  document.getElementById('custom-submit-test').classList.add('hidden');
  document.getElementById('custom-questions-preview').classList.add('hidden');
  document.getElementById('custom-text-input').value = '';
}

// ==================== TEST SECURITY ====================
function enableTestSecurity() {
  try {
    // Try fullscreen but don't block if it fails (not supported, denied, or in iframe)
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(err => {
        console.log('Fullscreen request failed (non-critical):', err);
      });
    }
  } catch (err) {
    console.warn('enableTestSecurity error (non-critical):', err);
  }
}

function disableTestSecurity() {
  document.body.style.overflow = 'auto';
  if (document.fullscreenElement) {
    document.exitFullscreen().catch(err => console.log('Exit fullscreen failed:', err));
  }
}

function handleTabSwitch() {
  if (testInProgress) {
    tabSwitches++;
    if (tabSwitches >= maxTabSwitches) {
      alert(t('security.tabSwitchWarning', 'Too many tab switches. Test submitted.'));
      submitTest();
    }
  }
}

function preventDevTools(e) {
  if (testInProgress) {
    if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I') || (e.ctrlKey && e.key === 'u')) {
      e.preventDefault();
    }
  }
}

// ==================== STATS & RESULTS ====================
function loadStats() {
  const stats = localStorage.getItem('testStats') || '[]';
  const testResults = JSON.parse(stats);
  displayStats(testResults);
}

function saveTestResult(result) {
  try {
    const stats = localStorage.getItem('testStats') || '[]';
    const testResults = JSON.parse(stats);
    testResults.push(result);
    localStorage.setItem('testStats', JSON.stringify(testResults));
    
    // Also save individual test for detailed review
    localStorage.setItem('test_' + result.testId, JSON.stringify(result));
    
    console.log('✅ Test saved successfully:', result.testId);
    console.log('📊 Test Details:', {
      subject: result.subject,
      score: result.score + '%',
      correct: result.correctCount + '/' + result.numQuestions,
      time: result.timeTaken + ' seconds',
      questions: result.questionDetails.length,
    });
  } catch (error) {
    console.error('❌ Error saving test result:', error);
    alert('Error saving test result. Please check console.');
  }
}

function displayStats(testResults) {
  // Update top stat cards
  const totalTests = testResults ? testResults.length : 0;
  const avgScore = totalTests > 0 ? (testResults.reduce((sum, t) => sum + (t.score || 0), 0) / totalTests).toFixed(1) : 0;
  const bestScore = totalTests > 0 ? Math.max(...testResults.map(t => t.score || 0)).toFixed(1) : 0;
  const totalTime = totalTests > 0 ? testResults.reduce((sum, t) => sum + (t.timeTaken || 0), 0) : 0;

  const testsTakenEl = document.getElementById('stat-tests-taken');
  const avgScoreEl = document.getElementById('stat-avg-score');
  const bestScoreEl = document.getElementById('stat-best-score');
  const totalTimeEl = document.getElementById('stat-total-time');

  if (testsTakenEl) testsTakenEl.textContent = totalTests;
  if (avgScoreEl) avgScoreEl.textContent = avgScore + '%';
  if (bestScoreEl) bestScoreEl.textContent = bestScore + '%';
  if (totalTimeEl) totalTimeEl.textContent = formatTimeShort(totalTime);

  // Update user name in welcome
  const dashboardUserName = document.getElementById('dashboard-user-name');
  if (dashboardUserName && currentUser) {
    dashboardUserName.textContent = currentUser.name || currentUser.email || 'User';
  }

  // Update date
  const dashboardDate = document.getElementById('dashboard-date');
  if (dashboardDate) {
    const now = new Date();
    dashboardDate.textContent = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }

  // Render recent tests
  renderRecentTests(testResults);

  // Render subject breakdown
  renderSubjectBreakdown(testResults);

  // Render upcoming tests
  renderDashboardUpcomingTests();

  // Legacy stats container (hidden but kept for compatibility)
  const statsContainer = document.getElementById('stats-container');
  if (statsContainer) {
    statsContainer.classList.add('hidden');
  }
}

function renderRecentTests(testResults) {
  const container = document.getElementById('recent-tests-container');
  if (!container) return;

  if (!testResults || testResults.length === 0) {
    container.innerHTML = '<p class="empty-state">No tests taken yet. Start your first mock test!</p>';
    return;
  }

  // Show last 5 tests, most recent first
  const recent = [...testResults].reverse().slice(0, 5);

  let html = '<div class="recent-tests-list">';
  recent.forEach(test => {
    const percentage = test.score ? test.score.toFixed(1) : 0;
    const color = percentage >= 70 ? '#22c55e' : percentage >= 50 ? '#f59e0b' : '#ef4444';
    const dateStr = test.date ? new Date(test.date).toLocaleDateString() : 'N/A';
    const subjectDisplay = test.subject ? test.subject.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Unknown';

    html += '<div class="recent-test-item">' +
      '<div class="recent-test-info">' +
      '<div class="recent-test-subject">' + subjectDisplay + '</div>' +
      '<div class="recent-test-date">' + dateStr + ' &bull; ' + (test.correctCount || 0) + '/' + (test.numQuestions || 0) + ' correct</div>' +
      '</div>' +
      '<div class="recent-test-score" style="color:' + color + '">' + percentage + '%</div>' +
      '</div>';
  });
  html += '</div>';

  container.innerHTML = html;
}

function renderSubjectBreakdown(testResults) {
  const container = document.getElementById('subject-breakdown-container');
  if (!container) return;

  if (!testResults || testResults.length === 0) {
    container.innerHTML = '<p class="empty-state">Take tests to see your subject-wise performance.</p>';
    return;
  }

  // Group by subject
  const subjectMap = {};
  testResults.forEach(test => {
    const subject = test.subject || 'unknown';
    if (!subjectMap[subject]) {
      subjectMap[subject] = { scores: [], totalCorrect: 0, totalQuestions: 0 };
    }
    subjectMap[subject].scores.push(test.score || 0);
    subjectMap[subject].totalCorrect += test.correctCount || 0;
    subjectMap[subject].totalQuestions += test.numQuestions || 0;
  });

  let html = '<div class="subject-breakdown-list">';
  Object.entries(subjectMap).forEach(([subject, data]) => {
    const avgScore = (data.scores.reduce((a, b) => a + b, 0) / data.scores.length).toFixed(1);
    const subjectDisplay = subject.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const color = avgScore >= 70 ? '#22c55e' : avgScore >= 50 ? '#f59e0b' : '#ef4444';
    const barWidth = Math.min(avgScore, 100);

    html += '<div class="subject-breakdown-item">' +
      '<div class="subject-breakdown-header">' +
      '<span class="subject-name">' + subjectDisplay + '</span>' +
      '<span class="subject-score" style="color:' + color + '">' + avgScore + '%</span>' +
      '</div>' +
      '<div class="subject-breakdown-bar-bg">' +
      '<div class="subject-breakdown-bar-fill" style="width:' + barWidth + '%;background:' + color + '"></div>' +
      '</div>' +
      '<div class="subject-breakdown-meta">' + data.scores.length + ' test(s) &bull; ' + data.totalCorrect + '/' + data.totalQuestions + ' correct</div>' +
      '</div>';
  });
  html += '</div>';

  container.innerHTML = html;
}

function renderDashboardUpcomingTests() {
  const container = document.getElementById('dashboard-upcoming-tests');
  if (!container) return;

  const assignedTests = sessionManager.getScheduledTests();
  const upcoming = assignedTests.filter(test => {
    const testDate = new Date(test.date + ' ' + test.time);
    return testDate >= new Date();
  }).slice(0, 3);

  if (upcoming.length === 0) {
    container.innerHTML = '<p class="empty-state">No upcoming tests assigned.</p>';
    return;
  }

  let html = '<div class="upcoming-tests-list">';
  upcoming.forEach(test => {
    const subjectDisplay = test.subject ? test.subject.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Unknown';
    html += '<div class="upcoming-test-item">' +
      '<div class="upcoming-test-dot"></div>' +
      '<div class="upcoming-test-info">' +
      '<div class="upcoming-test-subject">' + subjectDisplay + '</div>' +
      '<div class="upcoming-test-date">' + test.date + ' at ' + test.time + ' &bull; ' + test.duration + ' mins</div>' +
      '</div>' +
      '</div>';
  });
  html += '</div>';

  container.innerHTML = html;
}

function formatTimeShort(seconds) {
  const mins = Math.floor(seconds / 60);
  const hrs = Math.floor(mins / 60);
  if (hrs > 0) return hrs + 'h ' + (mins % 60) + 'm';
  return mins + 'm';
}

function navigateToView(viewId) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const target = document.getElementById(viewId);
  if (target) target.classList.add('active');

  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-view') === viewId) btn.classList.add('active');
  });
}

function clearAllProgress() {
  if (!confirm('Are you sure you want to clear all your test progress? This action cannot be undone.')) {
    return;
  }

  try {
    // Remove test stats
    localStorage.removeItem('testStats');

    // Remove all individual test entries (test_* keys)
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('test_')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));

    // Refresh dashboard display
    loadStats();

    alert('All progress cleared successfully.');
  } catch (err) {
    console.error('Error clearing progress:', err);
    alert('Failed to clear progress. Please try again.');
  }
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return mins + 'm ' + secs + 's';
}

// ==================== TEST HISTORY & REVIEW ====================
function viewTestDetails(testId) {
  const testData = localStorage.getItem('test_' + testId);
  if (!testData) {
    alert('Test details not found');
    return;
  }

  const test = JSON.parse(testData);
  let html = '<div style="max-height: 600px; overflow-y: auto; padding: 20px; background: #f9fafb; border-radius: 8px;">';
  
  html += '<h3 style="margin-top: 0;">Test Review: ' + test.subject + '</h3>';
  
  // Summary
  html += '<div style="background: white; padding: 15px; border-radius: 6px; margin-bottom: 15px; border-left: 4px solid #3b82f6;">' +
    '<p><strong>Score:</strong> ' + test.score.toFixed(1) + '%</p>' +
    '<p><strong>Correct:</strong> ' + test.correctCount + ' / ' + test.numQuestions + '</p>' +
    '<p><strong>Time Taken:</strong> ' + formatTime(test.timeTaken) + '</p>' +
    '<p><strong>Date:</strong> ' + new Date(test.date).toLocaleString() + '</p>' +
    '<p><strong>Duration Available:</strong> ' + (test.duration / 60) + ' minutes</p>' +
    '</div>';
  
  // Question details
  html += '<h4>Question Breakdown:</h4>';
  test.questionDetails.forEach((q, idx) => {
    const isCorrect = q.isCorrect;
    const borderColor = isCorrect ? '#22c55e' : '#ef4444';
    const bgColor = isCorrect ? '#f0fdf4' : '#fef2f2';
    
    html += '<div style="background: ' + bgColor + '; border-left: 4px solid ' + borderColor + '; padding: 15px; margin-bottom: 12px; border-radius: 6px;">' +
      '<p><strong>Q' + q.questionNumber + ' (' + q.difficulty + '):</strong> ' + q.question + '</p>' +
      '<p><strong style="color: ' + (isCorrect ? '#22c55e' : '#ef4444') + ';">Your Answer:</strong> ' + (q.userAnswer || '<em>Not answered</em>') + '</p>' +
      '<p><strong style="color: #22c55e;">Correct Answer:</strong> ' + q.correctAnswer + '</p>' +
      '<p><strong>Explanation:</strong> ' + q.explanation + '</p>' +
      '<p style="margin: 0; color: ' + (isCorrect ? '#22c55e' : '#ef4444') + ';">' + 
        (isCorrect ? '✓ Correct' : '✗ Incorrect') + 
      '</p>' +
      '</div>';
  });
  
  html += '</div>';
  
  alert(html);
}

function showTestHistory() {
  const stats = localStorage.getItem('testStats') || '[]';
  const testResults = JSON.parse(stats);
  
  if (testResults.length === 0) {
    alert('No test history found');
    return;
  }

  let html = '<div style="max-height: 500px; overflow-y: auto;">' +
    '<h3>Test History (' + testResults.length + ' tests)</h3>' +
    '<table style="width: 100%; border-collapse: collapse;">' +
      '<tr style="background: #e5e7eb;"><th style="padding: 10px; border: 1px solid #d1d5db;">Subject</th><th style="padding: 10px; border: 1px solid #d1d5db;">Score</th><th style="padding: 10px; border: 1px solid #d1d5db;">Correct</th><th style="padding: 10px; border: 1px solid #d1d5db;">Date</th><th style="padding: 10px; border: 1px solid #d1d5db;">Action</th></tr>';
  
  testResults.forEach(test => {
    html += '<tr style="border: 1px solid #d1d5db;">' +
      '<td style="padding: 10px;">' + test.subject + '</td>' +
      '<td style="padding: 10px;"><strong>' + test.score.toFixed(1) + '%</strong></td>' +
      '<td style="padding: 10px;">' + test.correctCount + '/' + test.numQuestions + '</td>' +
      '<td style="padding: 10px;">' + new Date(test.date).toLocaleDateString() + '</td>' +
      '<td style="padding: 10px;"><button onclick="viewTestDetails(\'' + test.testId + '\')">View</button></td>' +
      '</tr>';
  });
  
  html += '</table></div>';
  alert(html);
}

// ==================== ASSIGNMENT & ADMIN FUNCTIONS ====================
function displayAssignmentStatus() {
  const assignedTests = sessionManager.getScheduledTests();
  const container = document.getElementById('schedule-test-container');
  if (!container) return;

  if (assignedTests.length === 0) {
    container.innerHTML = '<p>' + t('schedule.noTests', 'No tests assigned yet.') + '</p>';
    return;
  }

  let html = '';
  assignedTests.forEach(test => {
    const status = getTestStatus(test);
    html += '<div class="test-card ' + status.class + '">' +
      '<div class="test-header">' +
      '<h3>' + test.subject + '</h3>' +
      '<span class="test-status">' + status.text + '</span>' +
      '</div>' +
      '<div class="test-info">' +
      '<p><strong>' + t('schedule.date', 'Date:') + '</strong> ' + test.date + '</p>' +
      '<p><strong>' + t('schedule.time', 'Time:') + '</strong> ' + test.time + '</p>' +
      '<p><strong>' + t('schedule.duration', 'Duration:') + '</strong> ' + test.duration + ' mins</p>' +
      '</div>' +
      '</div>';
  });

  container.innerHTML = html;
}

function displayAdminTests() {
  const allTests = sessionManager.getScheduledTests();
  const container = document.getElementById('admin-tests-list');
  if (!container) return;

  if (allTests.length === 0) {
    container.innerHTML = '<p>' + t('admin.noTests', 'No tests scheduled yet.') + '</p>';
    return;
  }

  let html = '<div class="admin-tests">';
  allTests.forEach(test => {
    html += '<div class="admin-test-item">' +
      '<div><strong>' + test.subject + '</strong> - ' + test.date + ' ' + test.time + '</div>' +
      '<button onclick="deleteTest(\'' + test.id + '\')" class="delete-btn">' + t('common.delete', 'Delete') + '</button>' +
      '</div>';
  });
  html += '</div>';

  container.innerHTML = html;
}

function deleteTest(testId) {
  if (confirm(t('admin.confirmDelete', 'Are you sure?'))) {
    sessionManager.deleteScheduledTest(testId);
    displayAdminTests();
  }
}

function handleAdminScheduleSubmit(e) {
  e.preventDefault();

  const subject = document.getElementById('admin-subject').value;
  const date = document.getElementById('admin-date').value;
  const time = document.getElementById('admin-time').value;
  const duration = document.getElementById('admin-duration').value;

  sessionManager.scheduleTest({
    subject: subject,
    date: date,
    time: time,
    duration: duration,
    questions: parseInt(duration) / 2,
  });

  e.target.reset();
  displayAdminTests();
  alert(t('admin.testScheduled', 'Test scheduled successfully!'));
}

function getTestStatus(test) {
  const testDate = new Date(test.date + ' ' + test.time);
  const now = new Date();
  const endTime = new Date(testDate.getTime() + test.duration * 60000);

  if (now < testDate) {
    return { text: t('status.upcoming', 'Upcoming'), class: 'upcoming' };
  } else if (now >= testDate && now < endTime) {
    return { text: t('status.active', 'Active'), class: 'active' };
  } else {
    return { text: t('status.completed', 'Completed'), class: 'completed' };
  }
}

// ==================== AI CHATBOT ====================
class ChatBot {
  constructor() {
    this.messagesContainer = document.getElementById('chat-messages');
    this.input = document.getElementById('chat-input');
    this.suggestionsContainer = document.getElementById('chat-suggestions');
    this.storageKey = 'chatbot_history';
    this.messages = this.loadHistory();
    this.isTyping = false;
    this.setupEventListeners();
  }

  setupEventListeners() {
    if (!this.input) return;
    this.input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });
  }

  loadHistory() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  saveHistory() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.messages));
  }

  clearChat() {
    this.messages = [];
    this.saveHistory();
    if (this.messagesContainer) {
      this.messagesContainer.innerHTML = '';
      this.addWelcomeMessage();
    }
  }

  addWelcomeMessage() {
    const welcomeHTML =
      '<div class="chat-message bot">' +
      '<div class="chat-avatar">🤖</div>' +
      '<div class="chat-bubble">' +
      '<p>' + t('chatbot.welcome', "Hello! I'm your AI Career Guide. I can help you with:") + '</p>' +
      '<ul>' +
      '<li>' + t('chatbot.help1', '📋 Exam eligibility and syllabus') + '</li>' +
      '<li>' + t('chatbot.help2', '📚 Subject-wise preparation tips') + '</li>' +
      '<li>' + t('chatbot.help3', '💰 Salary and career growth info') + '</li>' +
      '<li>' + t('chatbot.help4', '📅 Application process and dates') + '</li>' +
      '<li>' + t('chatbot.help5', '🎯 Personalized study plans') + '</li>' +
      '</ul>' +
      '<p>' + t('chatbot.helpPrompt', 'What would you like to know today?') + '</p>' +
      '</div>' +
      '</div>';
    this.messagesContainer.insertAdjacentHTML('beforeend', welcomeHTML);
  }

  renderMessage(text, sender) {
    const isUser = sender === 'user';
    const avatar = isUser ? '👤' : '🤖';
    const cssClass = isUser ? 'user' : 'bot';
    const html =
      '<div class="chat-message ' + cssClass + '">' +
      '<div class="chat-avatar">' + avatar + '</div>' +
      '<div class="chat-bubble">' + this.escapeHtml(text).replace(/\n/g, '<br>') + '</div>' +
      '</div>';
    this.messagesContainer.insertAdjacentHTML('beforeend', html);
    this.scrollToBottom();
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  showTyping() {
    if (this.isTyping) return;
    this.isTyping = true;
    const html =
      '<div class="chat-message bot typing-indicator" id="typing-indicator">' +
      '<div class="chat-avatar">🤖</div>' +
      '<div class="chat-bubble">' +
      '<div class="typing-dots"><span></span><span></span><span></span></div>' +
      '</div>' +
      '</div>';
    this.messagesContainer.insertAdjacentHTML('beforeend', html);
    this.scrollToBottom();
  }

  hideTyping() {
    const el = document.getElementById('typing-indicator');
    if (el) el.remove();
    this.isTyping = false;
  }

  scrollToBottom() {
    if (this.messagesContainer) {
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
  }

  sendQuickMessage(btn) {
    const text = btn.textContent.trim();
    this.input.value = text;
    this.sendMessage();
  }

  async sendMessage() {
    const text = this.input.value.trim();
    if (!text || this.isTyping) return;

    this.renderMessage(text, 'user');
    this.input.value = '';
    this.messages.push({ sender: 'user', text, time: Date.now() });
    this.saveHistory();

    this.showTyping();

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, userId: currentUser ? currentUser.id : 'guest' }),
      });

      this.hideTyping();

      if (!response.ok) {
        this.renderMessage(t('chatbot.error', 'Sorry, I encountered an error. Please try again.'), 'bot');
        return;
      }

      const data = await response.json();
      const reply = data.reply || t('chatbot.noReply', "I'm not sure about that. Try asking about exam eligibility, syllabus, or preparation tips.");
      this.renderMessage(reply, 'bot');
      this.messages.push({ sender: 'bot', text: reply, time: Date.now() });
      this.saveHistory();
    } catch (err) {
      this.hideTyping();
      console.error('Chatbot error:', err);
      this.renderMessage(t('chatbot.networkError', 'Network error. Please check your connection and try again.'), 'bot');
    }
  }
}

// Initialize chatbot globally
let chatbot;
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    chatbot = new ChatBot();
  }, 100);
});



