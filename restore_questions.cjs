const fs = require('fs');

const oldScript = fs.readFileSync('script_old.js', 'utf8');
const newScript = fs.readFileSync('script.js', 'utf8');

const qbStart = oldScript.indexOf('const questionBank = {');
const qbEnd = oldScript.indexOf('};', qbStart) + 2;
const oldQuestionBank = oldScript.substring(qbStart, qbEnd);

const subjectDataRaw = `const subjectData = {
  'data-structures': 'Data Structures',
  'algorithms': 'Algorithms',
  'system-design': 'System Design',
  'machine-learning': 'Machine Learning',
  'databases': 'Databases'
};`;

const targetQbStart = newScript.indexOf('const questionBank = {');
const targetQbEnd = newScript.indexOf('};', targetQbStart) + 2;

let modifiedScript = newScript.substring(0, targetQbStart) + oldQuestionBank + newScript.substring(targetQbEnd);

const targetSubDataStart = modifiedScript.indexOf('const subjectData = {');
const targetSubDataEnd = modifiedScript.indexOf('};', targetSubDataStart) + 2;

modifiedScript = modifiedScript.substring(0, targetSubDataStart) + subjectDataRaw + modifiedScript.substring(targetSubDataEnd);

fs.writeFileSync('script.js', modifiedScript);
console.log('Successfully updated questionBank and subjectData in script.js');
