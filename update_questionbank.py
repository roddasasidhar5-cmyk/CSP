import re

new_question_bank = '''// ==================== COMPREHENSIVE QUESTION BANK ====================
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
    { question: 'The ratio of ages of A and B is 3:5. After 6 years it becomes 2:3. What is B\\'s present age?', options: ['20', '25', '30', '35'], answer: '30', difficulty: 'Hard', explanation: 'Let ages be 3x and 5x. (3x+6)/(5x+6) = 2/3 => 9x+18 = 10x+12 => x=6. B = 5x6 = 30.' },
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
    { question: 'Pointing to a photograph, a man said, "She is the daughter of my grandfather\\'s only son." How is the woman related to the man?', options: ['Sister', 'Cousin', 'Mother', 'Aunt'], answer: 'Sister', difficulty: 'Medium', explanation: 'Grandfather\\'s only son = the man\\'s father. Daughter of his father = his sister.' },
    { question: 'A man walks 5 km north, turns right and walks 3 km, then turns right again and walks 5 km. How far is he from the starting point?', options: ['3 km', '5 km', '8 km', '13 km'], answer: '3 km', difficulty: 'Easy', explanation: 'He ends up 3 km to the east of the starting point (forms a rectangle).' },
    { question: 'All roses are flowers. Some flowers are red. Which conclusion follows?', options: ['All roses are red.', 'Some roses are red.', 'Some red things are flowers.', 'None follows'], answer: 'Some red things are flowers.', difficulty: 'Medium', explanation: 'Since some flowers are red, it follows that some red things are flowers.' },
    { question: 'Doctor : Hospital :: Teacher : ?', options: ['School', 'Student', 'Class', 'Book'], answer: 'School', difficulty: 'Easy', explanation: 'A doctor works in a hospital; a teacher works in a school.' },
    { question: 'What was the day of the week on 15th August 1947?', options: ['Monday', 'Tuesday', 'Wednesday', 'Friday'], answer: 'Friday', difficulty: 'Hard', explanation: '15 August 1947 was a Friday.' },
    { question: 'At what time between 3 and 4 o\\'clock do the hands of a clock coincide?', options: ['3:16 4/11', '3:15', '3:18', '3:20'], answer: '3:16 4/11', difficulty: 'Hard', explanation: 'The hands coincide at 3:16 4/11 minutes. Formula: 30H = 5.5M.' },
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
    { question: 'Which gas is most abundant in Earth\\'s atmosphere?', options: ['Oxygen', 'Carbon dioxide', 'Nitrogen', 'Hydrogen'], answer: 'Nitrogen', difficulty: 'Easy', explanation: 'Nitrogen makes up about 78% of Earth\\'s atmosphere.' },
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

// ==================== SESSION MANAGER ===================='''

with open('script.js', 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = '// ==================== COMPREHENSIVE QUESTION BANK ===================='
end_marker = '// ==================== SESSION MANAGER ===================='

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx == -1 or end_idx == -1:
    print('ERROR: Could not find markers in script.js')
    print('start_idx:', start_idx, 'end_idx:', end_idx)
    exit(1)

new_content = content[:start_idx] + new_question_bank + '\n' + content[end_idx + len(end_marker):]

with open('script.js', 'w', encoding='utf-8') as f:
    f.write(new_content)

print('script.js updated successfully with complete questionBank!')

