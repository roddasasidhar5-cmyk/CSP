const fs = require('fs');

const out = 'script.js';
fs.writeFileSync(out, '');

function append(s) {
  fs.appendFileSync(out, s + '\n');
}

// --- PART 1: HEADER, SESSION, QUESTION BANK, SESSION MANAGER, STATE ---
append(`// ==================== SESSION MANAGEMENT ====================
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
  if (!user || !token) { window.location.href = 'login.html'; return; }
  currentUser = JSON.parse(user);
  document.getElementById('user-name').textContent = currentUser.name || currentUser.email;
  document.getElementById('user-role').textContent = currentUser.role;
  if (currentUser.role === 'admin') document.getElementById('admin-nav-btn').classList.remove('hidden');
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
});`);

// --- COMPACT QUESTION BANK ---
const qb = {
  'data-structures': [
    {q:'Which data structure uses LIFO ordering?',o:['Queue','Stack','Heap','Graph'],a:'Stack',d:'Easy',x:'A stack follows Last-In, First-Out behavior.'},
    {q:'What is the time complexity of accessing an element by index in an array?',o:['O(1)','O(log n)','O(n)','O(n log n)'],a:'O(1)',d:'Easy',x:'Arrays provide constant-time indexed access.'},
    {q:'Which data structure is best suited for breadth-first search?',o:['Stack','Queue','Hash Table','Binary Search Tree'],a:'Queue',d:'Medium',x:'BFS explores nodes level by level, and a queue preserves the order.'},
    {q:'What is the worst-case time complexity of inserting an element in a binary search tree?',o:['O(1)','O(log n)','O(n)','O(n^2)'],a:'O(n)',d:'Medium',x:'If the BST becomes unbalanced, insertion can take O(n) time.'},
    {q:'Which of the following is NOT a linear data structure?',o:['Array','Linked List','Tree','Queue'],a:'Tree',d:'Easy',x:'Trees are hierarchical/non-linear data structures.'},
    {q:'What is the space complexity of a recursive function that calculates factorial?',o:['O(1)','O(n)','O(log n)','O(n^2)'],a:'O(n)',d:'Medium',x:'Each recursive call is added to the call stack.'},
    {q:'In a max heap, what is the relationship between parent and child nodes?',o:['Parent >= Children','Parent <= Children','Parent = Children','No specific order'],a:'Parent >= Children',d:'Medium',x:'In a max heap, each parent node is greater than or equal to its children.'},
    {q:'What is the minimum number of comparisons needed to find both minimum and maximum in an array of n elements?',o:['2n - 2','1.5n - 2','3n/2 - 2','n - 1'],a:'3n/2 - 2',d:'Hard',x:'The optimal algorithm compares elements in pairs and tracks min/max.'},
    {q:'Which data structure would you use to implement a LRU cache?',o:['Array','Hash Map + Doubly Linked List','Binary Search Tree','Queue'],a:'Hash Map + Doubly Linked List',d:'Hard',x:'Hash map provides O(1) access, while doubly linked list maintains order.'},
    {q:'What is the time complexity of searching in a balanced binary search tree?',o:['O(1)','O(log n)','O(n)','O(n log n)'],a:'O(log n)',d:'Medium',x:'A balanced BST eliminates half of the remaining elements with each comparison.'},
    {q:'In a hash table with chaining, what is the average time complexity of insertion?',o:['O(1)','O(log n)','O(n)','O(n^2)'],a:'O(1)',d:'Medium',x:'With a good hash function, insertion in a hash table is O(1) on average.'},
    {q:'What is the main disadvantage of using an array over a linked list?',o:['Slower access time','Larger memory overhead','Costly insertion/deletion','Fixed size limitation'],a:'Costly insertion/deletion',d:'Medium',x:'Arrays require shifting elements during insertion/deletion.'},
    {q:'Which traversal of a binary search tree yields elements in sorted order?',o:['Pre-order','In-order','Post-order','Level-order'],a:'In-order',d:'Medium',x:'In-order traversal of a BST produces elements in ascending sorted order.'},
    {q:'What is the time complexity of merge sort in all cases?',o:['O(n)','O(n log n)','O(n^2)','O(log n)'],a:'O(n log n)',d:'Medium',x:'Merge sort always divides the array in half and merges.'},
    {q:'In a graph with V vertices and E edges, what is the space complexity of adjacency list representation?',o:['O(V)','O(E)','O(V + E)','O(V * E)'],a:'O(V + E)',d:'Hard',x:'Adjacency list stores V lists with a total of 2E entries for undirected graphs.'},
  ],
  algorithms: [
    {q:'What is the average time complexity of quicksort?',o:['O(n)','O(n log n)','O(n^2)','O(log n)'],a:'O(n log n)',d:'Medium',x:'Quicksort typically achieves O(n log n) average time.'},
    {q:'Which algorithm is best suited for finding the shortest path in a weighted graph?',o:['BFS','DFS',"Dijkstra's algorithm",'Bubble sort'],a:"Dijkstra's algorithm",d:'Medium',x:"Dijkstra's algorithm efficiently finds the shortest path."},
    {q:'What is the time complexity of binary search?',o:['O(n)','O(log n)','O(n log n)','O(1)'],a:'O(log n)',d:'Easy',x:'Binary search eliminates half of the remaining elements each time.'},
    {q:'Which sorting algorithm is most efficient for nearly sorted arrays?',o:['Bubble sort','Insertion sort','Merge sort','Quicksort'],a:'Insertion sort',d:'Medium',x:'Insertion sort performs best on nearly sorted arrays.'},
    {q:'What is the space complexity of the recursive implementation of binary search?',o:['O(1)','O(log n)','O(n)','O(n^2)'],a:'O(log n)',d:'Medium',x:'Recursion adds O(log n) space due to the call stack depth.'},
