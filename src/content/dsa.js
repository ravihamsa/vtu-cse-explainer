/**
 * Data Structures explainer content derived from DSA_NOTES.pdf.
 * Every concept id is namespaced so it can live beside the OS explainer.
 */

const P = (text) => ({ t: 'p', text });
const L = (title, items) => ({ t: 'list', title, items });
const CARDS = (items) => ({ t: 'cards', items });
const TABLE = (head, rows, caption) => ({ t: 'table', head, rows, caption });
const DIAGRAM = (kind, name, caption, items) => ({ t: 'diagram', kind, name, caption, items });
const STEPS = (title, steps) => ({ t: 'steps', title, steps });
const CODE = (title, code) => ({ t: 'code', title, code });
const CALLOUT = (title, text) => ({ t: 'callout', title, text });
const EXAMPLE = (title, text, items) => ({ t: 'example', title, text, items });
const FORMULA = (text, note) => ({ t: 'formula', text, note });

const concept = (id, label, number, kicker, title, blocks) => ({
  id, label, number, kicker, title, blocks,
});

const stem = (moduleId, id) => `dsa-${moduleId}-${id}`;

/* ------------------------------------------------------------------ */
/* Module 1 — arrays, pointers, DMA, strings and sorting                */
/* ------------------------------------------------------------------ */

const m1Mindmap = {
  name: 'Data Structures I',
  concept: stem('m1', 'overview'),
  tip: 'Start with how data is stored, then learn how to organise and sort it.',
  children: [
    {
      name: 'Foundations', concept: stem('m1', 'overview'),
      tip: 'A data structure is a logical arrangement plus the operations that use it.',
      children: [
        { name: 'Definition', concept: stem('m1', 'overview'), tip: 'Organising data so that operations are efficient.' },
        { name: 'Classification', concept: stem('m1', 'overview'), tip: 'Linear or non-linear, primitive or derived.' },
        { name: 'Operations', concept: stem('m1', 'overview'), tip: 'Traverse, insert, delete, search, sort and merge.' },
      ],
    },
    {
      name: 'Memory', concept: stem('m1', 'pointers'),
      tip: 'Pointers and dynamic allocation give structures their flexibility.',
      children: [
        { name: 'Pointers', concept: stem('m1', 'pointers'), tip: 'A variable that stores an address, not a value copy.' },
        { name: 'Pointer to pointer', concept: stem('m1', 'pointers'), tip: 'A chain of addresses: pp → p → x.' },
        { name: 'DMA', concept: stem('m1', 'dma'), tip: 'malloc, calloc, realloc and free work on the heap.' },
      ],
    },
    {
      name: 'Arrays', concept: stem('m1', 'arrays'),
      tip: 'Same-type elements in consecutive memory, addressed by index.',
      children: [
        { name: 'Static array', concept: stem('m1', 'arrays'), tip: 'Size fixed at compile time.' },
        { name: 'Dynamic array', concept: stem('m1', 'arrays'), tip: 'Size decided at run time using malloc.' },
        { name: 'Matrices', concept: stem('m1', 'matrices'), tip: 'Row-major and column-major linearisation formulas.' },
      ],
    },
    {
      name: 'Records', concept: stem('m1', 'records'),
      tip: 'Structures and unions group different types under one name.',
      children: [
        { name: 'Structure', concept: stem('m1', 'records'), tip: 'Every member gets its own memory.' },
        { name: 'Union', concept: stem('m1', 'records'), tip: 'Members share the same memory; only one is active.' },
        { name: 'Polynomial', concept: stem('m1', 'polynomials'), tip: 'Store coefficient and exponent pairs.' },
      ],
    },
    {
      name: 'Compact data', concept: stem('m1', 'sparse'),
      tip: 'Skip the boring zeros and store only what matters.',
      children: [
        { name: 'Sparse matrix', concept: stem('m1', 'sparse'), tip: 'Triplets: row, column, value.' },
        { name: 'Transpose', concept: stem('m1', 'sparse'), tip: 'Swap row and column in every triplet.' },
        { name: 'Strings', concept: stem('m1', 'strings'), tip: 'Character arrays ending in a null character.' },
      ],
    },
    {
      name: 'Sorting', concept: stem('m1', 'insertion'),
      tip: 'Put values in order using simple, traceable passes.',
      children: [
        { name: 'Insertion sort', concept: stem('m1', 'insertion'), tip: 'Grow a sorted prefix one item at a time.' },
        { name: 'Radix sort', concept: stem('m1', 'radix'), tip: 'Sort by digits from ones to hundreds.' },
        { name: 'Scenarios', concept: stem('m1', 'scenarios'), tip: 'Pick the right structure for a real problem.' },
      ],
    },
  ],
};

const m1 = {
  id: 'm1',
  label: 'Module 1 · Arrays, Pointers & Sorting',
  summary: 'From the definition of a data structure to pointers, arrays, matrices, strings and two sorting methods.',
  mindmap: m1Mindmap,
  branchColours: {
    Foundations: '#0f766e', Memory: '#7c3aed', Arrays: '#0e7490',
    Records: '#b45309', 'Compact data': '#be123c', Sorting: '#15803d',
  },
  icons: {
    Foundations: 'M-5,-4 h10 v8 h-10 Z M-5,0 h10 M0,-4 v8',
    Memory: 'M-4,-3 h8 v6 h-8 Z M-4,-1 h8 M-1,-3 v6 M1,0 l3,0 M3,-2 l1,2 l-1,2',
    Arrays: 'M-5,-3 h3 v6 h-3 Z M-1,-3 h3 v6 h-3 Z M3,-3 h3 v6 h-3 Z',
    Records: 'M-4,-4 h8 v8 h-8 Z M-4,-1 h8 M-4,2 h8 M0,-4 v3',
    'Compact data': 'M-5,-4 h10 v8 h-10 Z M-5,-1 h10 M-2,2 h4',
    Sorting: 'M-5,-3 h8 v2 h-8 Z M-5,0 h8 v2 h-8 Z M-5,3 h5 v2 h-5 Z M3,-2 l2,2 l-2,2',
  },
  glossary: [
    ['Data structure', 'A way of organising data so that operations such as search or insert are efficient.'],
    ['Traversing', 'Visiting every element exactly once.'],
    ['Abstract data type (ADT)', 'What a structure does, described without saying how it is implemented.'],
    ['Pointer', 'A variable that holds the address of another variable.'],
    ['Dereference', 'Using * to read or write the value at an address.'],
    ['Heap', 'The region of memory used by malloc, calloc and realloc.'],
    ['malloc', 'Allocates raw bytes at run time and returns a void pointer; memory is not initialised.'],
    ['calloc', 'Allocates and zero-initialises an array of elements.'],
    ['realloc', 'Changes the size of an earlier allocation.'],
    ['free', 'Returns heap memory to the system.'],
    ['Dangling pointer', 'A pointer that still holds an address after that memory has been freed.'],
    ['Array', 'A fixed-size collection of same-type elements in consecutive memory.'],
    ['Index', 'The position number used to reach an array element.'],
    ['Row major order', '2D array stored row by row; address = base + (i × columns + j) × size.'],
    ['Column major order', '2D array stored column by column; address = base + (i + j × rows) × size.'],
    ['Structure', 'A collection of members of possibly different types, each with its own storage.'],
    ['Union', 'A collection of members that share the same storage; only one value is valid at a time.'],
    ['Sparse matrix', 'A matrix with mostly zero entries, stored as (row, column, value) triplets.'],
    ['String', 'A sequence of characters terminated by the null character \\0 in C.'],
    ['Stable sort', 'A sort that keeps the relative order of equal keys.'],
  ],
  questions: [
    'Why do we say an array is a random-access structure?',
    'What is the difference between a pointer and the value it points to?',
    'Why malloc memory must be released with free()?',
    'When does row-major order make traversal faster than column-major order?',
    'Why does a union use less memory than a structure?',
    'How does a triplet representation save space for a sparse matrix?',
    'Why is the null character essential in a C string?',
    'In insertion sort, why is the prefix always sorted after one pass?',
    'Why is radix sort not a comparison-based sort?',
    'Which structure would you choose for a rainfall log that grows every minute, and why?',
  ],
  concepts: [
    {
      ...concept(stem('m1', 'overview'), 'Big picture', '05', 'Introduction', 'Data structures: organise first, code second'),
      blocks: [
        P([
          'A data structure is a group of data elements arranged so that we can use them efficiently. Think of a busy Bengaluru bus stand: tickets, queues, routes and counters all need an order. If the order is good, everyone moves quickly; if not, everything jams.',
          'Formally, a data structure combines a logical arrangement with the operations performed on it: traversing, searching, inserting, deleting, sorting and merging.',
        ]),
        DIAGRAM('react', 'dsa-classify', 'The same data can be arranged in different shapes.', [
          { title: 'Linear', detail: 'array, stack, queue, list' },
          { title: 'Hierarchical', detail: 'tree, heap' },
          { title: 'Grouped', detail: 'graph, set' },
          { title: 'Derived', detail: 'structure, union' },
        ]),
        TABLE(['Category', 'Examples', 'South Indian analogy'], [
          ['Primitive', 'int, char, float, pointer', 'One idli, one spoon, one ticket'],
          ['Non-primitive linear', 'array, stack, queue, linked list', 'A row of idlis on a plate'],
          ['Non-primitive non-linear', 'tree, graph', 'Family tree or metro route map'],
        ], 'Classification follows the shape of relationships, not the type of value.'),
        CARDS([
          { title: 'ADT', text: 'Defines what operations are allowed, not how they are coded.', badge: 'idea' },
          { title: 'Implementation', text: 'Chooses arrays or pointers to realise the ADT.', badge: 'code' },
          { title: 'Complexity', text: 'Tells us how the cost grows as the input grows.', badge: 'cost' },
        ]),
        CALLOUT('A useful question', 'Before choosing a structure, ask: “Which operation will happen most often?” Frequent inserts favour linked lists; frequent random access favours arrays.'),
      ],
    },
    {
      ...concept(stem('m1', 'mindmap'), 'Module mind map', '01', 'Roadmap', 'See the whole module at once'),
      blocks: [
        P(['Drag to pan, scroll to zoom, hover for a short note, and click any node to jump to the matching detailed section below.']),
        { t: 'mindmap' },
      ],
    },
    {
      ...concept(stem('m1', 'glossary'), 'Glossary', '02', 'Terms', 'Words used in this module'),
      blocks: [{ t: 'glossary' }],
    },
    {
      ...concept(stem('m1', 'questions'), 'Conceptual questions', '03', 'Think first', 'Questions to answer before the quiz'),
      blocks: [{ t: 'questions' }],
    },
    {
      ...concept(stem('m1', 'pointers'), 'Pointers', '06', 'Memory', 'A pointer stores where, not what'),
      blocks: [
        P([
          'A normal variable holds a value. A pointer holds the address of another variable. If p stores the address of x, then *p reads or changes x. This indirect access is what makes linked structures possible.',
        ]),
        DIAGRAM('graphviz', 'dsa-pointer-chain', 'pp stores the address of p; p stores the address of x.'),
        TABLE(['Expression', 'Meaning', 'Idli-stall analogy'], [
          ['int x = 50', 'A value is stored in x.', 'A plate has 50 idlis.'],
          ['int *p = &x', 'p stores the address of x.', 'A token says which plate.'],
          ['*p = 60', 'Change the value at that address.', 'Use the token to refill the plate.'],
          ['int **pp = &p', 'pp stores the address of the token.', 'A board lists token numbers.'],
        ]),
        CODE('Pointer to pointer', 'int x = 50;\nint *p = &x;\nint **pp = &p;\nprintf("%d %d %d", x, *p, **pp); // 50 50 50'),
        CALLOUT('Why it matters', 'Passing a pointer lets a function modify the caller’s variable. Passing only the value creates a copy, so the original stays unchanged.'),
      ],
    },
    {
      ...concept(stem('m1', 'dma'), 'Dynamic memory', '07', 'Memory', ' malloc, calloc, realloc, free'),
      blocks: [
        P([
          'Dynamic memory allocation (DMA) reserves memory while the program is running. This is essential when we do not know the size in advance — for example, a sensor log that records rainfall until the rain stops.',
        ]),
        TABLE(['Function', 'Job', 'Initial value'], [
          ['malloc(n)', 'Allocates n bytes', 'Garbage / uninitialised'],
          ['calloc(n, size)', 'Allocates n items of size bytes', 'All bytes zero'],
          ['realloc(p, n)', 'Resizes an earlier block', 'Old contents kept where possible'],
          ['free(p)', 'Returns the block', '—'],
        ]),
        DIAGRAM('mermaid', 'dsa-dma-flow', 'Allocate → use → resize → release.'),
        CODE('Safe pattern', 'int *p = malloc(5 * sizeof(int));\nif (p == NULL) return 1;   // always check\n/* use p */\nfree(p);\np = NULL;                // avoid a dangling pointer'),
        CARDS([
          { title: 'Memory leak', text: 'Forgetting to free memory that is no longer used.', badge: 'bug' },
          { title: 'Dangling pointer', text: 'Using a pointer after its memory has been freed.', badge: 'bug' },
          { title: 'Heap fragmentation', text: 'Free blocks become small and scattered.', badge: 'cost' },
        ]),
      ],
    },
    {
      ...concept(stem('m1', 'arrays'), 'Arrays', '08', 'Linear storage', 'Consecutive boxes, instant indexing'),
      blocks: [
        P([
          'An array stores same-type elements in consecutive memory. If the base address is known, element i is found directly: address = base + i × element_size. That is why arr[i] is O(1), just like knowing the exact rack for a dosa plate in a canteen.',
        ]),
        DIAGRAM('react', 'dsa-array-cells', 'A 6-element array of "tiffin token numbers".', [
          { title: '12', detail: 'index 0' }, { title: '25', detail: 'index 1' },
          { title: '31', detail: 'index 2' }, { title: '40', detail: 'index 3' },
          { title: '52', detail: 'index 4' }, { title: '63', detail: 'index 5' },
        ]),
        TABLE(['Operation', 'Cost', 'Reason'], [
          ['Access arr[i]', 'O(1)', 'Direct address calculation'],
          ['Search unsorted', 'O(n)', 'May scan every element'],
          ['Insert at end', 'O(1) if capacity remains', 'Just write at the next index'],
          ['Insert in middle', 'O(n)', 'Shift elements right'],
        ]),
        EXAMPLE('Static vs dynamic', 'Static: int arr[6]; — size fixed at compile time. Dynamic: int *arr = malloc(n * sizeof(int)); — size decided at run time.', ['Static lives on the stack', 'Dynamic lives on the heap', 'Both use the same indexing formula']),
      ],
    },
    {
      ...concept(stem('m1', 'matrices'), 'Matrices', '09', 'Linear storage', 'Flattening a 2D grid into 1D memory'),
      blocks: [
        P([
          'Computer memory is a straight line, so a 2D matrix must be linearised. Row major order stores one full row at a time (used by C). Column major order stores one full column at a time (used by Fortran).',
        ]),
        FORMULA('Row major:  address(i, j) = base + (i × COLS + j) × size', 'Column major: address(i, j) = base + (i + j × ROWS) × size'),
        DIAGRAM('graphviz', 'dsa-array-map', 'A 3 × 2 matrix mapped to consecutive addresses.'),
        EXAMPLE('Idli tray', 'A tray with 3 rows and 2 idlis per row: [r0c0, r0c1, r1c0, r1c1, r2c0, r2c1] in row major. The address of row 2, column 1 is base + (2 × 2 + 1) = base + 5.', ['Rows are filled left to right', 'The last row ends at base + 5', 'n-dimensional arrays extend the same idea']),
        TABLE(['Order', 'Fast traversal', 'Typical language'], [
          ['Row major', 'Loop j inside i', 'C / C++'],
          ['Column major', 'Loop i inside j', 'Fortran / MATLAB'],
        ], 'Matching the traversal to the storage order reduces cache misses.'),
      ],
    },
    {
      ...concept(stem('m1', 'records'), 'Structures & unions', '10', 'Grouped data', 'Different types under one roof'),
      blocks: [
        P([
          'A structure gives every member its own memory. A union lets members share the same memory, so only one member can hold a valid value at a time. A canteen order needs both an idli count and a customer name at once — that is a structure, not a union.',
        ]),
        TABLE(['Feature', 'Structure', 'Union'], [
          ['Memory', 'Sum of all members', 'Size of largest member'],
          ['Active members', 'All', 'Only one'],
          ['Use case', 'A student record', 'A value that may be int, float or char'],
        ]),
        CODE('Structure and union', 'struct Student { int roll; char name[30]; float fees; };\nunion Data { int i; float f; char s[20]; };\nstruct Student s1 = {12, "Ananya", 5000};\nunion Data d1; d1.i = 10;   // d1.f is no longer meaningful'),
        CALLOUT('Exam hint', 'If the question says “only one field is used at a time”, think union. If it says “all fields together describe one entity”, think structure.'),
      ],
    },
    {
      ...concept(stem('m1', 'polynomials'), 'Polynomials', '11', 'Grouped data', 'Store only coefficient and exponent'),
      blocks: [
        P([
          'A polynomial such as 3x⁴ + 2x² + 7 can be stored as pairs: (3,4), (2,2), (7,0). Each term needs a coefficient and an exponent. Arrays are simple; linked lists make insertion and addition easier.',
        ]),
        DIAGRAM('react', 'dsa-poly-terms', 'Terms of A(x) = 3x⁴ + 2x² + 7.', [
          { title: '3, 4', detail: '3x⁴' }, { title: '2, 2', detail: '2x²' }, { title: '7, 0', detail: 'constant' },
        ]),
        STEPS('Add two polynomials by exponent', [
          { title: 'Compare exponents', text: 'Look at the current term of A and B. Smaller exponent comes first.' },
          { title: 'Equal exponents', text: 'Add coefficients and store one term if the sum is not zero.' },
          { title: 'Unequal exponents', text: 'Copy the term with the smaller exponent to the result.' },
          { title: 'Finish leftovers', text: 'Append all remaining terms from the non-empty list.' },
        ]),
        CODE('Term record', 'typedef struct {\n  float coef;\n  int expon;\n} TERM;'),
        CALLOUT('Why sorted order helps', 'If both polynomials are kept in descending exponent order, addition becomes one linear merge: O(n + m).'),
      ],
    },
    {
      ...concept(stem('m1', 'sparse'), 'Sparse matrices', '12', 'Compact data', 'Store the non-zero corners only'),
      blocks: [
        P([
          'A sparse matrix has mostly zeros. Storing every zero wastes space, so we keep triplets (row, column, value). For a 4 × 4 matrix with only four non-zero values, a triplet table uses 4 rows instead of 16 cells.',
        ]),
        EXAMPLE('Monsoon grid', 'Rainfall sensors in a 4 × 4 field report only where it rained: (0,2,11), (1,0,12), (2,1,-4), (3,3,-15). All other cells are treated as zero.', ['Row and column are 0-based', 'The value may be negative', 'Transpose swaps row and column in each triplet']),
        TABLE(['Triplet index', 'Row', 'Column', 'Value'], [
          ['0', '0', '2', '11'], ['1', '1', '0', '12'], ['2', '2', '1', '-4'], ['3', '3', '3', '-15'],
        ]),
        CALLOUT('Transpose in one pass', 'To build the transpose efficiently, count values per column, compute starting positions, then place each triplet at its new position.'),
      ],
    },
    {
      ...concept(stem('m1', 'strings'), 'Strings', '13', 'Compact data', 'Characters with a definite end'),
      blocks: [
        P([
          'In C, a string is an array of characters ending with the null character \\0. Without that terminator, functions such as strlen would keep reading memory until they accidentally find a zero.',
        ]),
        TABLE(['Function', 'Purpose'], [
          ['strlen(s)', 'Number of characters before \\0'],
          ['strcpy(d, s)', 'Copy s into d'],
          ['strcat(d, s)', 'Append s to d'],
          ['strcmp(a, b)', 'Compare lexicographically'],
          ['strstr(s, p)', 'Find first occurrence of pattern p'],
        ]),
        EXAMPLE('Filter coffee search', 'To find “coffee” inside “filter coffee at noon”, compare the pattern at each starting position. The first match begins at index 7.', ['String length excludes \\0', 'Array must have room for \\0', 'Pattern search is the basis of grep']),
        CODE('Null terminator', 'char s[20] = "coffee";\n// stored as: c o f f e e \\0\nprintf("%zu", strlen(s)); // 6'),
      ],
    },
    {
      ...concept(stem('m1', 'insertion'), 'Insertion sort', '14', 'Sorting', 'Grow a sorted prefix, one plate at a time'),
      blocks: [
        P([
          'Insertion sort keeps the left part sorted. Take the next item, compare it with neighbours on the left, shift larger items right, then drop the item into its correct place. It is the way you might arrange idli plates by size on a tray.',
        ]),
        DIAGRAM('mermaid', 'dsa-insertion-flow', 'The repeatable loop behind insertion sort.'),
        STEPS('Trace [5, 2, 4, 6, 1, 3]', [
          { title: 'Start', text: '[5] | 2 4 6 1 3 — the first item is already sorted.' },
          { title: 'Insert 2', text: '5 shifts right → [2, 5] | 4 6 1 3.' },
          { title: 'Insert 4', text: '5 shifts right → [2, 4, 5] | 6 1 3.' },
          { title: 'Insert 6', text: 'Already in place → [2, 4, 5, 6] | 1 3.' },
          { title: 'Insert 1', text: 'Everything shifts → [1, 2, 4, 5, 6] | 3.' },
          { title: 'Insert 3', text: 'Final sorted array → [1, 2, 3, 4, 5, 6].' },
        ]),
        TABLE(['Case', 'Time', 'Note'], [
          ['Best (already sorted)', 'O(n)', 'One comparison per item'],
          ['Average / worst', 'O(n²)', 'Many shifts'],
          ['Extra space', 'O(1)', 'In-place and stable'],
        ]),
      ],
    },
    {
      ...concept(stem('m1', 'radix'), 'Radix sort', '15', 'Sorting', 'Sort by digits, not by comparisons'),
      blocks: [
        P([
          'Radix sort processes digits from least significant to most significant. After each pass, buckets 0–9 are emptied in order, so the relative order from earlier passes is preserved. This stability is what makes the method work.',
        ]),
        DIAGRAM('mermaid', 'dsa-radix-flow', 'One pass per digit position.'),
        STEPS('Trace [123, 924, 345, 654]', [
          { title: 'Ones digit', text: 'Buckets: 3 → 123, 4 → 924, 5 → 345, 4 → 654. Output: 123, 924, 654, 345.' },
          { title: 'Tens digit', text: 'Buckets: 2 → 123, 2 → 924, 4 → 345, 5 → 654. Output: 123, 924, 345, 654.' },
          { title: 'Hundreds digit', text: 'Buckets: 1 → 123, 3 → 345, 6 → 654, 9 → 924. Output: 123, 345, 654, 924.' },
        ]),
        TABLE(['Feature', 'Radix sort', 'Insertion sort'], [
          ['Method', 'Digit buckets', 'Compare and shift'],
          ['Time', 'O(d × (n + k))', 'O(n²)'],
          ['Stable', 'Yes, if buckets preserve order', 'Yes'],
          ['Best for', 'Fixed-width integers', 'Small or nearly sorted arrays'],
        ]),
        CALLOUT('Why stability matters', 'If two numbers share the same tens digit, their order from the ones pass must survive. A stable bucket collection guarantees that.'),
      ],
    },
    {
      ...concept(stem('m1', 'scenarios'), 'Scenario lab', '16', 'Apply it', 'Choose a structure for a real task'),
      blocks: [
        P(['The notes close Module 1 with situational problems. Here they are with familiar settings — decide the structure before reading the answer.']),
        CARDS([
          { title: 'Sensor log recorder', text: 'Rainfall values arrive all day. Use a dynamically allocated array that grows with realloc.', badge: 'DMA' },
          { title: 'Packet parser', text: 'A packet carries mixed fields. Use a union for the payload that is active one at a time.', badge: 'union' },
          { title: '3D grid calculator', text: 'Convert (x, y, z) to an index with the n-dimensional row-major formula.', badge: 'array' },
          { title: 'Game grid compactor', text: 'Store only non-zero cells as triplets, just like a sparse matrix.', badge: 'sparse' },
          { title: 'Query-string parser', text: 'Walk a URL with char pointers; no copying needed.', badge: 'pointer' },
          { title: 'Leaderboard sorter', text: 'Small, nearly sorted scores: insertion sort. Fixed-width roll numbers: radix sort.', badge: 'sorting' },
        ]),
        CALLOUT('Rule of thumb', 'Changing size often → dynamic memory or linked structure. Random access often → array. Mostly zeros → sparse triplet. Fixed-width keys → radix sort.'),
      ],
    },
    {
      ...concept(stem('m1', 'quiz'), 'Knowledge check', '17', 'Quiz', 'Mix and match Module 1'),
      blocks: [{ t: 'quiz' }],
    },
  ],
  quiz: [
    { q: 'Which expression reads the value stored at address p?', options: ['p', '&p', '*p', 'p + 1'], answer: 2, why: 'The dereference operator * reads the value at the stored address.' },
    { q: 'Which function zero-initialises its allocation?', options: ['malloc', 'calloc', 'realloc', 'free'], answer: 1, why: 'calloc clears every byte to zero.' },
    { q: 'Address of A[i][j] in row-major order is:', options: ['base + (i + j×rows)×size', 'base + (i×cols + j)×size', 'base + i+j', 'base + j×size'], answer: 1, why: 'Rows are stored consecutively, so skip i full rows then j columns.' },
    { q: 'A union differs from a structure because:', options: ['It cannot store numbers', 'Members share storage', 'It is always larger', 'It needs pointers'], answer: 1, why: 'All union members overlay the same memory.' },
    { q: 'Best structure for a mostly-zero 4×4 rainfall matrix:', options: ['2D array', 'Triplet list', 'Stack', 'Queue'], answer: 1, why: 'Triplets store only non-zero entries.' },
    { q: 'A C string must end with:', options: ['\\n', '\\0', ';', '#'], answer: 1, why: 'The null character marks the end of the string.' },
    { q: 'Insertion sort on already sorted input costs:', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], answer: 2, why: 'Each item needs only one comparison.' },
    { q: 'Radix sort depends on this property:', options: ['Comparison', 'Stability', 'Recursion', 'Hashing'], answer: 1, why: 'Stable buckets preserve order across digit passes.' },
    { q: 'Forgetting free() after malloc() creates:', options: ['Dangling pointer', 'Memory leak', 'Stack overflow', 'Deadlock'], answer: 1, why: 'The allocated block can never be reused.' },
    { q: 'Which structure gives O(1) access to arr[50]?', options: ['Linked list', 'Stack', 'Array', 'Queue'], answer: 2, why: 'Arrays compute the address directly from the index.' },
  ],
};

/* ------------------------------------------------------------------ */
/* Module 2 — stacks, queues and expression processing                  */
/* ------------------------------------------------------------------ */

const m2Mindmap = {
  name: 'Stacks & Queues',
  concept: stem('m2', 'overview'),
  tip: 'Two simple rules — LIFO and FIFO — power a surprising number of programs.',
  children: [
    {
      name: 'Stack', concept: stem('m2', 'stacks'),
      tip: 'Last in, first out: push and pop at the TOP.',
      children: [
        { name: 'Push / pop', concept: stem('m2', 'stacks'), tip: 'TOP moves up on push and down on pop.' },
        { name: 'Overflow', concept: stem('m2', 'stacks'), tip: 'Push into a full stack; underflow is pop from empty.' },
        { name: 'Applications', concept: stem('m2', 'stacks'), tip: 'Undo, call stack, parentheses check.' },
      ],
    },
    {
      name: 'Expressions', concept: stem('m2', 'infix'),
      tip: 'A stack turns human infix into machine-friendly postfix.',
      children: [
        { name: 'Infix', concept: stem('m2', 'infix'), tip: 'Operator between operands: a + b.' },
        { name: 'Postfix', concept: stem('m2', 'infix'), tip: 'Operator after operands: a b +.' },
        { name: 'Evaluate', concept: stem('m2', 'postfix'), tip: 'Pop two operands, apply operator, push result.' },
      ],
    },
    {
      name: 'Queue', concept: stem('m2', 'queues'),
      tip: 'First in, first out: enqueue at rear, dequeue at front.',
      children: [
        { name: 'Linear', concept: stem('m2', 'queues'), tip: 'Simple array; freed front slots cannot be reused.' },
        { name: 'Circular', concept: stem('m2', 'circular'), tip: 'Wrap with modulo so every slot is reusable.' },
        { name: 'Priority', concept: stem('m2', 'priority'), tip: 'Order by priority, not arrival time.' },
      ],
    },
    {
      name: 'Variations', concept: stem('m2', 'deque'),
      tip: 'Change where insertion and deletion are allowed.',
      children: [
        { name: 'Deque', concept: stem('m2', 'deque'), tip: 'Both ends available for insertion and deletion.' },
        { name: 'Two stacks', concept: stem('m2', 'multiple'), tip: 'Grow from opposite ends of one array.' },
        { name: 'Two queues', concept: stem('m2', 'multiple'), tip: 'One grows right, the other grows left.' },
      ],
    },
    {
      name: 'Scenarios', concept: stem('m2', 'scenarios'),
      tip: 'Match the rule to the story: undo, tickets, browser history.',
      children: [
        { name: 'Undo / redo', concept: stem('m2', 'scenarios'), tip: 'Two stacks: undo and redo.' },
        { name: 'Ticket counter', concept: stem('m2', 'queues'), tip: 'FIFO queue at the railway counter.' },
        { name: 'Call stack', concept: stem('m2', 'stacks'), tip: 'Function calls unwind in reverse order.' },
      ],
    },
  ],
};

const m2 = {
  id: 'm2',
  label: 'Module 2 · Stacks, Queues & Expressions',
  summary: 'LIFO stacks, FIFO queues, circular and priority variants, and stack-driven expression conversion.',
  mindmap: m2Mindmap,
  branchColours: {
    Stack: '#0f766e', Expressions: '#7c3aed', Queue: '#0e7490',
    Variations: '#b45309', Scenarios: '#15803d',
  },
  icons: {
    Stack: 'M-4,3 h8 v2 h-8 Z M-4,0 h8 v2 h-8 Z M-4,-3 h8 v2 h-8 Z',
    Expressions: 'M-5,-2 h4 v4 h-4 Z M1,-2 h4 v4 h-4 Z M-1,0 h2 M-3,-4 v2 M3,-4 v2',
    Queue: 'M-5,-3 h3 v6 h-3 Z M-1,-3 h3 v6 h-3 Z M3,-3 h3 v6 h-3 Z M-5,4 h10',
    Variations: 'M-4,-4 v8 M4,-4 v8 M-4,0 h8 M0,-4 l4,4 l-4,4',
    Scenarios: 'M-4,3 a4,4 0 1 1 8,0 M0,3 l2,-3 M0,3 h1',
  },
  glossary: [
    ['Stack', 'Linear structure where insertion and deletion happen at one end called TOP.'],
    ['LIFO', 'Last In, First Out — the newest item leaves first.'],
    ['TOP', 'Index or pointer to the most recently pushed item.'],
    ['Push', 'Insert an item onto the stack.'],
    ['Pop', 'Remove the top item from the stack.'],
    ['Overflow', 'Trying to push when the stack is full.'],
    ['Underflow', 'Trying to pop when the stack is empty.'],
    ['Infix', 'Operator written between operands, such as a + b.'],
    ['Prefix', 'Operator written before operands, such as + a b.'],
    ['Postfix', 'Operator written after operands, such as a b +.'],
    ['ISP', 'In-stack precedence: priority of an operator already on the stack.'],
    ['ICP', 'Incoming precedence: priority of the operator just scanned.'],
    ['Queue', 'Linear structure where insertion is at rear and deletion at front.'],
    ['FIFO', 'First In, First Out — the oldest item leaves first.'],
    ['Circular queue', 'Queue whose rear wraps to index 0, reusing freed slots.'],
    ['Priority queue', 'Queue where dequeue chooses the highest (or lowest) priority item.'],
    ['Deque', 'Double-ended queue allowing insertion and deletion at both ends.'],
    ['Front', 'End of a queue from which items are removed.'],
    ['Rear', 'End of a queue where new items are inserted.'],
    ['Call stack', 'Runtime stack that stores active function frames.'],
  ],
  questions: [
    'Why is a stack a good model for undo/redo?',
    'What is the difference between overflow and underflow?',
    'Why does the left parenthesis get maximum incoming precedence?',
    'How does postfix evaluation remove the need for precedence rules?',
    'Why can a linear queue waste space even when it is not full?',
    'How does a circular queue decide whether it is empty or full?',
    'When would you prefer an ascending priority queue?',
    'What is the difference between input-restricted and output-restricted deques?',
    'Why do two stacks in one array grow toward each other?',
    'Where would you use a queue in a railway ticket counter simulation?',
  ],
  concepts: [
    {
      ...concept(stem('m2', 'overview'), 'Big picture', '05', 'Introduction', 'One rule, many programs'),
      blocks: [
        P([
          'A stack is a pile of dosa plates: the last plate placed on top is the first one taken. A queue is the ticket line at CSMT station: the first person to arrive is served first. These two rules — LIFO and FIFO — appear everywhere in computing.',
        ]),
        CARDS([
          { title: 'Stack', text: 'Push and pop at TOP. Used for undo, expression handling and function calls.', badge: 'LIFO' },
          { title: 'Queue', text: 'Enqueue at rear, dequeue at front. Used for scheduling and buffering.', badge: 'FIFO' },
          { title: 'Variants', text: 'Circular, priority and double-ended queues adjust the rule.', badge: ' hybrids' },
        ]),
        DIAGRAM('mermaid', 'dsa-lifo-fifo', 'Two rules, two different orders.'),
        CALLOUT('Key question', 'Does the newest item deserve service first (stack), or the oldest item (queue)? That single decision drives the design.'),
      ],
    },
    {
      ...concept(stem('m2', 'mindmap'), 'Module mind map', '01', 'Roadmap', 'See stacks and queues together'),
      blocks: [P(['Click any node to jump to the matching detailed section below.']), { t: 'mindmap' }],
    },
    {
      ...concept(stem('m2', 'glossary'), 'Glossary', '02', 'Terms', 'Words used in this module'),
      blocks: [{ t: 'glossary' }],
    },
    {
      ...concept(stem('m2', 'questions'), 'Conceptual questions', '03', 'Think first', 'Questions to answer before the quiz'),
      blocks: [{ t: 'questions' }],
    },
    {
      ...concept(stem('m2', 'stacks'), 'Stacks', '06', 'LIFO', 'Push and pop at one end'),
      blocks: [
        P([
          'A stack allows insertion and deletion only at TOP. Push increases TOP; pop decreases it. If TOP reaches the last index, a further push is overflow. If TOP is -1, a pop is underflow.',
        ]),
        DIAGRAM('react', 'dsa-stack', 'A static stack of four "dosa plates".', [
          { title: 'TOP → 30', detail: 'pushed last' }, { title: '20', detail: '' }, { title: '10', detail: '' }, { title: 'empty', detail: 'index 0' },
        ]),
        STEPS('Push 30, then pop', [
          { title: 'Start', text: 'Stack = [10, 20], TOP = 1.' },
          { title: 'Push(30)', text: 'TOP becomes 2. Stack = [10, 20, 30].' },
          { title: 'Pop()', text: 'Returns 30, TOP becomes 1. Stack = [10, 20].' },
          { title: 'Peek()', text: 'Reads 20 without changing TOP.' },
        ]),
        TABLE(['Operation', 'Static array', 'Linked stack'], [
          ['Push', 'O(1), fails on overflow', 'O(1), grows on heap'],
          ['Pop', 'O(1), fails on underflow', 'O(1), frees node'],
          ['Extra memory', 'Fixed MAX', 'One pointer per node'],
        ]),
        CALLOUT('Applications', 'Undo stack, browser back button, parentheses validator, call stack and postfix calculator all reuse this one rule.'),
      ],
    },
    {
      ...concept(stem('m2', 'infix'), 'Infix → postfix', '07', 'Expressions', 'Let a stack handle precedence'),
      blocks: [
        P([
          'Humans write a + b × c. Computers prefer a b c × + because postfix needs no parentheses. While scanning left to right, operands go straight to output; operators wait on a stack until their turn.',
        ]),
        TABLE(['Symbol', 'ISP (in stack)', 'ICP (incoming)'], [
          ['^', '4', '5'],
          ['* /', '2', '2'],
          ['+ -', '1', '1'],
          ['(', '0', '5'],
        ], 'Higher precedence waits less. ^ is right-associative, so its incoming value is larger.'),
        DIAGRAM('mermaid', 'dsa-infix-flow', 'The scan loop for infix to postfix conversion.'),
        STEPS('Trace a + b × c', [
          { title: 'a', text: 'Operand → output: a.' },
          { title: '+', text: 'Stack empty → push +.' },
          { title: 'b', text: 'Operand → output: a b.' },
          { title: '×', text: 'ISP(+) = 1 < ICP(×) = 2 → push ×.' },
          { title: 'c', text: 'Operand → output: a b c.' },
          { title: 'end', text: 'Pop × then + → a b c × +.' },
        ]),
        CALLOUT('Parenthesis rule', '“(” always goes onto the stack, but nothing above it is popped until “)” arrives. Then pop until “(” is removed.'),
      ],
    },
    {
      ...concept(stem('m2', 'postfix'), 'Postfix evaluation', '08', 'Expressions', 'Scan once, push results'),
      blocks: [
        P([
          'To evaluate postfix, scan left to right. Numbers are pushed. An operator pops the top two operands, applies the operator, and pushes the answer. The final stack value is the result.',
        ]),
        DIAGRAM('mermaid', 'dsa-postfix-flow', 'Postfix evaluation needs no precedence table.'),
        STEPS('Evaluate 8 6 + 7 6 × −', [
          { title: '8, 6', text: 'Stack: [8, 6].' },
          { title: '+', text: 'Pop 6 and 8 → 14. Stack: [14].' },
          { title: '7, 6', text: 'Stack: [14, 7, 6].' },
          { title: '×', text: 'Pop 6 and 7 → 42. Stack: [14, 42].' },
          { title: '−', text: 'Pop 42 and 14 → −28. Answer: −28.' },
        ]),
        CALLOUT('Operand order', 'The second pop is the left operand and the first pop is the right operand. This matters for − and /.'),
      ],
    },
    {
      ...concept(stem('m2', 'queues'), 'Queues', '09', 'FIFO', 'First come, first served'),
      blocks: [
        P([
          'A queue inserts at REAR and deletes at FRONT, like a booking counter queue atKSR Bengaluru. In an array, front starts at 0 and rear at -1. Each enqueue increments rear; each dequeue increments front.',
        ]),
        DIAGRAM('react', 'dsa-queue', 'A ticket queue with four waiting customers.', [
          { title: 'A', detail: 'front' }, { title: 'B', detail: '' }, { title: 'C', detail: '' }, { title: 'D', detail: 'rear' },
        ]),
        TABLE(['Operation', 'Cost', 'Note'], [
          ['Enqueue', 'O(1)', 'rear++ then write'],
          ['Dequeue', 'O(1)', 'Read front then front++'],
          ['Peek', 'O(1)', 'Read queue[front]'],
        ]),
        CALLOUT('Limitation', 'In a linear array queue, dequeued slots at the front stay empty. Even if the array has free positions, rear may hit the end — that is why the circular queue exists.'),
      ],
    },
    {
      ...concept(stem('m2', 'circular'), 'Circular queues', '10', 'FIFO', 'Wrap around and reuse every slot'),
      blocks: [
        P([
          'A circular queue treats the array as a ring. After the last index, rear wraps to 0 using modulo arithmetic. A count variable makes the tests simple: empty when count = 0, full when count = capacity.',
        ]),
        FORMULA('rear = (rear + 1) % CAPACITY', 'front = (front + 1) % CAPACITY'),
        DIAGRAM('graphviz', 'dsa-circular-queue', 'A 5-slot circular queue with front at 3 and rear at 1.'),
        STEPS('Enqueue into the ring', [
          { title: 'Check full', text: 'If count == CAPACITY, report overflow.' },
          { title: 'Move rear', text: 'rear = (rear + 1) % CAPACITY.' },
          { title: 'Write item', text: 'queue[rear] = value; count++.' },
        ]),
        CALLOUT('Real analogy', 'A rotating ring of seating at a merry-go-round: when the last seat passes, the next passenger starts from seat 0 again.'),
      ],
    },
    {
      ...concept(stem('m2', 'priority'), 'Priority queues', '11', 'FIFO+', 'Importance beats arrival order'),
      blocks: [
        P([
          'In a priority queue, each item carries a priority. Dequeue returns the item with the smallest key (ascending) or the largest key (descending). At a hospital counter, an emergency patient is served before a routine check-up even if they arrived later.',
        ]),
        TABLE(['Type', 'Dequeue returns', 'Example'], [
          ['Ascending', 'Minimum priority value', 'Lowest token number first'],
          ['Descending', 'Maximum priority value', 'Highest emergency score first'],
        ]),
        CALLOUT('Implementation choice', 'A simple array gives O(n) dequeue. A heap gives O(log n), but heaps belong to later tree modules.'),
      ],
    },
    {
      ...concept(stem('m2', 'deque'), 'Deque', '12', 'Both ends', 'Insert and delete anywhere at the edges'),
      blocks: [
        P([
          'A double-ended queue allows insertion and deletion at both front and rear. Restricting one side creates input-restricted or output-restricted deques.',
        ]),
        TABLE(['Type', 'Insert', 'Delete'], [
          ['Deque', 'Both ends', 'Both ends'],
          ['Input-restricted', 'One end only', 'Both ends'],
          ['Output-restricted', 'Both ends', 'One end only'],
        ]),
        EXAMPLE('Bus conductor', 'A conductor can let passengers board from the front or rear door, and can drop them at either stop — a full deque. If boarding is only at the rear but leaving is possible at both stops, it is input-restricted.'),
      ],
    },
    {
      ...concept(stem('m2', 'multiple'), 'Multiple stacks & queues', '13', 'Shared array', 'Two structures, one memory block'),
      blocks: [
        P([
          'When two stacks share one array, Stack A grows from the left and Stack B grows from the right. Overflow happens when topA + 1 == topB. Two queues can share space the same way: Queue A grows left to right, Queue B grows right to left.',
        ]),
        DIAGRAM('react', 'dsa-shared-array', 'Two stacks growing toward each other in one array.', [
          { title: 'A0', detail: 'bottom A' }, { title: 'A1', detail: '' }, { title: 'free', detail: '' },
          { title: 'free', detail: '' }, { title: 'B1', detail: '' }, { title: 'B0', detail: 'bottom B' },
        ]),
        TABLE(['Structure', 'Starts', 'Collision test'], [
          ['Stack A', 'topA = -1, grows right', 'topA + 1 == topB'],
          ['Stack B', 'topB = MAX, grows left', 'same test'],
          ['Queue A', 'front = rear = -1, grows right', 'rearA + 1 == frontB'],
          ['Queue B', 'front = rear = MAX, grows left', 'rearB - 1 == frontA'],
        ]),
      ],
    },
    {
      ...concept(stem('m2', 'scenarios'), 'Scenario lab', '14', 'Apply it', 'Choose the right linear structure'),
      blocks: [
        CARDS([
          { title: 'Undo / redo', text: 'Two stacks: undo stores actions, redo stores popped actions.', badge: 'stack' },
          { title: 'Parentheses validator', text: 'Push “(”, pop on “)”; empty at the end means valid.', badge: 'stack' },
          { title: 'Browser history', text: 'Back and forward can be modelled as two stacks.', badge: 'stack' },
          { title: 'RPN calculator', text: 'Postfix evaluation with a number stack.', badge: 'stack' },
          { title: 'Call stack trace', text: 'Each function call pushes a frame; returns pop it.', badge: 'stack' },
          { title: 'Ticket counter', text: 'A queue preserves fairness: first arrival, first service.', badge: 'queue' },
        ]),
        CALLOUT('Interview pattern', 'If the story says “most recent”, reach for a stack. If it says “waiting turn”, reach for a queue.'),
      ],
    },
    {
      ...concept(stem('m2', 'quiz'), 'Knowledge check', '15', 'Quiz', 'Mix and match Module 2'),
      blocks: [{ t: 'quiz' }],
    },
  ],
  quiz: [
    { q: 'Stack deletion happens at:', options: ['Front', 'Rear', 'TOP', 'Middle'], answer: 2, why: 'Push and pop both operate at TOP.' },
    { q: 'Pop from an empty stack causes:', options: ['Overflow', 'Underflow', 'Fragmentation', 'Wrap-around'], answer: 1, why: 'Removing from an empty stack is underflow.' },
    { q: 'Postfix of a + b × c is:', options: ['a b + c ×', 'a b c × +', '+ a × b c', 'a × b c +'], answer: 1, why: 'Operands stay in order; the operator follows its operands.' },
    { q: 'During infix conversion, “(” has:', options: ['Lowest ICP', 'Highest ICP', 'Zero ISP only', 'Same as +'], answer: 1, why: 'A high incoming precedence guarantees “(” is pushed.' },
    { q: 'Evaluating 5 9 + 2 * gives:', options: ['14', '28', '23', '19'], answer: 1, why: '5 + 9 = 14, then 14 × 2 = 28.' },
    { q: 'A linear queue wastes space because:', options: ['Rear cannot wrap', 'Front is always zero', 'It is LIFO', 'It needs pointers'], answer: 0, why: 'Freed front slots cannot be reused after rear reaches the end.' },
    { q: 'Circular queue full test with a count variable is:', options: ['count == 0', 'count == capacity', 'front == rear', 'rear == -1'], answer: 1, why: 'The count removes the empty/full ambiguity.' },
    { q: 'A priority queue chooses by:', options: ['Arrival time', 'Priority key', 'Stack top', 'Random order'], answer: 1, why: 'Priority, not arrival order, decides the next item.' },
    { q: 'A deque allows insertion at:', options: ['Front only', 'Rear only', 'Both ends', 'Middle'], answer: 2, why: 'Deque means double-ended queue.' },
    { q: 'Two stacks in one array collide when:', options: ['topA < 0', 'topB == MAX', 'topA + 1 == topB', 'topA == topB + 1'], answer: 2, why: 'They grow toward each other and meet at that condition.' },
  ],
};

/* ------------------------------------------------------------------ */
/* Module 3 — linked lists                                             */
/* ------------------------------------------------------------------ */

const m3Mindmap = {
  name: 'Linked Lists',
  concept: stem('m3', 'overview'),
  tip: 'Nodes plus pointers trade random access for cheap inserts and deletes.',
  children: [
    {
      name: 'Basics', concept: stem('m3', 'linked-basics'),
      tip: 'A node carries data and one or more links to other nodes.',
      children: [
        { name: 'Node', concept: stem('m3', 'linked-basics'), tip: 'Data field + link field.' },
        { name: 'SLL', concept: stem('m3', 'sll'), tip: 'One link per node, pointing to the next.' },
        { name: 'Header node', concept: stem('m3', 'header'), tip: 'A dummy first node that removes edge cases.' },
      ],
    },
    {
      name: 'Variants', concept: stem('m3', 'circular'),
      tip: 'Change the link pattern to change what is cheap.',
      children: [
        { name: 'Ordered', concept: stem('m3', 'ordered'), tip: 'Keep values sorted while inserting.' },
        { name: 'Circular', concept: stem('m3', 'circular'), tip: 'Last node links back to the first.' },
        { name: 'Doubly', concept: stem('m3', 'dll'), tip: 'Each node has llink and rlink.' },
      ],
    },
    {
      name: 'Applications', concept: stem('m3', 'polynomial-cll'),
      tip: 'Polynomials and sparse matrices become easy to merge.',
      children: [
        { name: 'Polynomial', concept: stem('m3', 'polynomial-cll'), tip: 'Terms linked in exponent order.' },
        { name: 'Sparse matrix', concept: stem('m3', 'sparse-linked'), tip: 'Row headers plus element nodes.' },
        { name: 'Round robin', concept: stem('m3', 'circular'), tip: 'A circular list models a rotating queue.' },
      ],
    },
    {
      name: 'Techniques', concept: stem('m3', 'scenarios'),
      tip: 'Classic pointer tricks solve placement questions.',
      children: [
        { name: 'Fast / slow', concept: stem('m3', 'scenarios'), tip: 'Find the middle in one pass.' },
        { name: 'Loop detection', concept: stem('m3', 'scenarios'), tip: 'Fast and slow pointers eventually meet in a cycle.' },
        { name: 'In-place merge', concept: stem('m3', 'scenarios'), tip: 'Reuse existing nodes, allocate none.' },
      ],
    },
  ],
};

const m3 = {
  id: 'm3',
  label: 'Module 3 · Linked Lists',
  summary: 'Singly, doubly and circular lists, header nodes, polynomial and sparse-matrix representation, and pointer tricks.',
  mindmap: m3Mindmap,
  branchColours: {
    Basics: '#0f766e', Variants: '#7c3aed', Applications: '#b45309', Techniques: '#15803d',
  },
  icons: {
    Basics: 'M-5,-3 h3 v6 h-3 Z M1,-3 h3 v6 h-3 Z M-2,0 h3 M-5,4 h10',
    Variants: 'M-4,-3 a4,3 0 1 1 0.1,0 M-4,-3 v6 M4,-3 v6 M0,1 v3',
    Applications: 'M-5,-4 h10 v8 h-10 Z M-5,-1 h10 M-2,-4 v3 M2,-1 v3',
    Techniques: 'M-5,0 h10 M0,-4 v8 M-3,-3 l3,3 l3,-3 M-3,3 l3,-3 l3,3',
  },
  glossary: [
    ['Linked list', 'Dynamic linear structure whose nodes are connected by pointers.'],
    ['Node', 'A unit containing data and one or more link fields.'],
    ['SLL', 'Singly linked list: each node points only to the next node.'],
    ['HEAD', 'Pointer to the first real node of a list.'],
    ['Header node', 'A dummy first node used to simplify empty-list and edge-case logic.'],
    ['NULL', 'The null pointer that marks the end of a chain.'],
    ['Circular list', 'A list whose last node points back to the first.'],
    ['last pointer', 'A pointer to the final node; makes both-end operations O(1).'],
    ['DLL', 'Doubly linked list: each node has previous and next links.'],
    ['llink / rlink', 'Left and right links of a doubly linked list node.'],
    ['Ordered list', 'A list kept sorted by key after every insertion.'],
    ['getnode()', 'Helper that allocates a node on the heap and checks for failure.'],
    ['Traversal', 'Following links from the first node to the end.'],
    ['Fast / slow pointer', 'Two pointers moving at different speeds to find a middle or cycle.'],
    ['Sparse matrix node', 'A node holding row, column, value and a link to the next element.'],
    ['Row header node', 'A sentinel that starts the chain for one matrix row.'],
    ['Polynomial term', 'Node with coefficient, exponent and a link to the next term.'],
    ['In-place merge', 'Combining two sorted lists by relinking existing nodes.'],
    ['Dangling link', 'A pointer left pointing to freed memory.'],
    ['Auxiliary pointer', 'A temporary pointer used while rewiring a list.'],
  ],
  questions: [
    'Why is insertion at the front of an SLL O(1) but insertion at the rear O(n) without a last pointer?',
    'How does a header node simplify deletion of the first real node?',
    'Why must an ordered list search before inserting?',
    'How does a circular list with a last pointer make both-end insertion O(1)?',
    'What is stored in a doubly linked list node that is absent in an SLL node?',
    'Why do sparse matrix lists use row header nodes?',
    'How do fast and slow pointers find the middle in one pass?',
    'When is copying a node’s data from its next node a valid O(1) delete trick?',
    'Why is in-place merging of two sorted lists memory-efficient?',
    'Which list would you use for browser back/forward navigation, and why?',
  ],
  concepts: [
    {
      ...concept(stem('m3', 'overview'), 'Big picture', '05', 'Introduction', 'When arrays are not enough'),
      blocks: [
        P([
          'Arrays give instant access but fixed size and costly middle insertions. Linked lists allocate nodes as needed and connect them with pointers. A canteen queue that can add a new counter any time is easier to model as a chain than as a fixed array.',
        ]),
        TABLE(['Operation', 'Array', 'Singly linked list'], [
          ['Access by index', 'O(1)', 'O(n)'],
          ['Insert at front', 'O(n) shift', 'O(1)'],
          ['Insert at rear', 'O(1) with capacity', 'O(n) unless last pointer exists'],
          ['Memory', 'One block, fixed size', 'One node per item, heap'],
        ]),
        DIAGRAM('react', 'dsa-node-chain', 'Each node points to the next; NULL ends the chain.', [
          { title: 'Head', detail: 'start' }, { title: 'data → next', detail: 'node 1' },
          { title: 'data → next', detail: 'node 2' }, { title: 'NULL', detail: 'end' },
        ]),
        CALLOUT('Trade-off', 'Linked lists win when inserts and deletes dominate. Arrays win when random access dominates.'),
      ],
    },
    {
      ...concept(stem('m3', 'mindmap'), 'Module mind map', '01', 'Roadmap', 'See linked lists as a family'),
      blocks: [P(['Click a node to jump to its detailed section.']), { t: 'mindmap' }],
    },
    {
      ...concept(stem('m3', 'glossary'), 'Glossary', '02', 'Terms', 'Words used in this module'),
      blocks: [{ t: 'glossary' }],
    },
    {
      ...concept(stem('m3', 'questions'), 'Conceptual questions', '03', 'Think first', 'Questions to answer before the quiz'),
      blocks: [{ t: 'questions' }],
    },
    {
      ...concept(stem('m3', 'linked-basics'), 'Linked list basics', '06', 'Basics', 'Nodes, links and operations'),
      blocks: [
        P([
          'Each node has a data field and a link field. The list is reached through HEAD. Standard operations are insertion at front/rear, deletion at front/rear, deletion of a specific value, display and search.',
        ]),
        TABLE(['Classification', 'Link structure', 'Strength'], [
          ['SLL', 'One next pointer', 'Least memory'],
          ['Circular SLL', 'Last points to first', 'Easy rotation'],
          ['DLL', 'Previous and next', 'Delete a known node in O(1)'],
          ['Circular DLL', 'Both directions and a ring', 'Browser history style navigation'],
        ]),
        CODE('Node declaration', 'typedef struct node {\n  int data;\n  struct node *link;\n} NODE;\n\nNODE* getnode(void) {\n  NODE *t = malloc(sizeof(NODE));\n  if (t == NULL) { printf("No heap memory\\n"); exit(1); }\n  return t;\n}'),
      ],
    },
    {
      ...concept(stem('m3', 'sll'), 'Singly linked list', '07', 'Basics', 'One direction, simple code'),
      blocks: [
        P([
          'In an SLL without a header node, inserting at the front rewires HEAD. Inserting at the rear walks to the last node. Deleting the front advances HEAD; deleting the rear needs a previous pointer.',
        ]),
        DIAGRAM('graphviz', 'dsa-sll', 'HEAD → 10 → 20 → 30 → NULL.'),
        STEPS('Insert 5 at the front', [
          { title: 'Allocate', text: 'new = getnode(); new->data = 5.' },
          { title: 'Link forward', text: 'new->link = first;' },
          { title: 'Move HEAD', text: 'first = new. The list is now 5 → 10 → 20 → 30.' },
        ]),
        CALLOUT('Why previous matters', 'To delete a middle or rear node in a singly list, you must stop at its predecessor — hence the previous/present pointer pair in the notes.'),
      ],
    },
    {
      ...concept(stem('m3', 'header'), 'Header nodes', '08', 'Basics', 'One dummy node removes many special cases'),
      blocks: [
        P([
          'A header node is a sentinel that never stores real data. HEAD always points to it, and the first real node is HEAD->link. Empty list? HEAD->link == NULL. Delete the first real node? Rewire HEAD->link — no special “if first node” branch.',
        ]),
        DIAGRAM('graphviz', 'dsa-header-list', 'HEAD → header(sentinel) → 10 → 20 → NULL.'),
        TABLE(['Task', 'Without header', 'With header'], [
          ['Empty test', 'first == NULL', 'head->link == NULL'],
          ['Delete first', 'Change first', 'Change head->link'],
          ['Insert first', 'Change first', 'Change head->link'],
        ]),
        CALLOUT('Cost', 'One extra node of memory buys simpler, safer code — a bargain when many operations touch the ends.'),
      ],
    },
    {
      ...concept(stem('m3', 'ordered'), 'Ordered lists', '09', 'Variants', 'Keep the chain sorted'),
      blocks: [
        P([
          'An ordered singly linked list inserts every new value in ascending position. Search stops as soon as the next node is larger; then the new node is spliced between previous and present.',
        ]),
        EXAMPLE('Roll-number line', 'Inserting roll numbers 12, 7, 20, 15 into an ordered list gives 7 → 12 → 15 → 20. Each insertion finds the first larger roll number and slots in before it.', ['Traversal doubles as the search', 'Duplicates can be allowed or ignored by policy', 'Deletion keeps the order untouched']),
        STEPS('Insert 15 into 7 → 12 → 20', [
          { title: 'Walk', text: 'previous = 12, present = 20 because 15 < 20.' },
          { title: 'Allocate', text: 'new->data = 15.' },
          { title: 'Rewire', text: 'new->link = present; previous->link = new.' },
        ]),
      ],
    },
    {
      ...concept(stem('m3', 'circular'), 'Circular lists', '10', 'Variants', 'No end — just a ring'),
      blocks: [
        P([
          'In a circular linked list, the last node points back to the first. Keeping a pointer called last is useful: last->link is the first node, so insertion at front and rear are both O(1).',
        ]),
        DIAGRAM('graphviz', 'dsa-circular-list', 'last points to the final node; its link wraps to the first.'),
        TABLE(['Task', 'With last pointer', 'Cost'], [
          ['Insert at rear', 'new->link = last->link; last->link = new; last = new', 'O(1)'],
          ['Insert at front', 'Insert after last', 'O(1)'],
          ['Delete front', 'last->link = last->link->link', 'O(1)'],
        ]),
        EXAMPLE('Round-robin token', 'Four students in a circular list pass a speaking token. After the fourth student, the pointer returns to the first — exactly how round-robin CPU scheduling cycles through processes.'),
      ],
    },
    {
      ...concept(stem('m3', 'polynomial-cll'), 'Polynomial addition with CLL', '11', 'Applications', 'Merge terms while walking two rings'),
      blocks: [
        P([
          'Each term node stores coefficient, exponent and next. With a circular sentinel list, addition compares exponents from two polynomials and appends the smaller exponent to the result; equal exponents add their coefficients.',
        ]),
        DIAGRAM('react', 'dsa-poly-terms', 'A(x) = 5x²⁰⁰⁰ + 3x¹⁰ + 1 stored as linked terms.', [
          { title: '5, 2000', detail: 'term 1' }, { title: '3, 10', detail: 'term 2' }, { title: '1, 0', detail: 'term 3' },
        ]),
        CODE('Polynomial node', 'typedef struct poly {\n  float coef;\n  int expon;\n  struct poly *link;\n} POLY;'),
        CALLOUT('Why circular?', 'A sentinel ring means no NULL checks while appending. The tail pointer is always last->link.'),
      ],
    },
    {
      ...concept(stem('m3', 'dll'), 'Doubly linked lists', '12', 'Variants', 'Two links, easier deletion'),
      blocks: [
        P([
          'A doubly linked list node has llink and rlink. With a header node storing a count, insertion and deletion at either end are O(1) once the end is known. The cost is one extra pointer per node.',
        ]),
        DIAGRAM('graphviz', 'dsa-dll', 'HEAD ↔ 10 ↔ 20 ↔ 30 ↔ NULL.'),
        TABLE(['Operation', 'SLL', 'DLL'], [
          ['Delete known node', 'O(n) to find predecessor', 'O(1) with llink'],
          ['Traverse backward', 'Not possible', 'Easy'],
          ['Memory per node', 'data + next', 'data + prev + next'],
        ]),
        CODE('Doubly node', 'typedef struct double_node {\n  int data;\n  struct double_node *llink;\n  struct double_node *rlink;\n} DNODE;'),
      ],
    },
    {
      ...concept(stem('m3', 'sparse-linked'), 'Sparse matrices as lists', '13', 'Applications', 'Rows as chains of non-zero values'),
      blocks: [
        P([
          'A linked sparse matrix uses two node types: row header nodes and element nodes. Each row header starts a chain of (column, value) pairs. Only actual non-zero values consume memory.',
        ]),
        EXAMPLE('Rainfall again', 'A 4 × 4 grid with four readings becomes four row-header chains. Row 0 holds (2, 11); row 1 holds (0, 12); row 2 holds (1, -4); row 3 holds (3, -15). Rows with no rain have an empty chain.', ['Header nodes make row access quick', 'Element nodes keep only column and value', 'Good when the matrix is huge and mostly zero']),
        TABLE(['Node type', 'Fields'], [
          ['Header', 'row index, next row header, first element'],
          ['Element', 'column, value, next element in row'],
        ]),
      ],
    },
    {
      ...concept(stem('m3', 'scenarios'), 'Scenario lab', '14', 'Apply it', 'Classic placement-question tricks'),
      blocks: [
        CARDS([
          { title: 'Undo / redo', text: 'Circular doubly linked list with a current_page pointer.', badge: 'CDLL' },
          { title: 'Middle in one pass', text: 'fast moves two nodes, slow moves one; slow ends at the middle.', badge: 'two pointers' },
          { title: 'O(1) delete', text: 'If the node is not the tail, copy the next node’s data and bypass it.', badge: 'trick' },
          { title: 'Round robin', text: 'A circular list of processes gives a natural rotating queue.', badge: 'circular' },
          { title: 'Browser history', text: 'Back and forward are llink and rlink from current_page.', badge: 'DLL' },
          { title: 'Loop detection', text: 'Fast and slow pointers meet inside a cycle.', badge: 'Floyd' },
          { title: 'In-place merge', text: 'Relink existing sorted nodes; allocate nothing new.', badge: 'merge' },
        ]),
        CALLOUT('Why these questions appear', 'They test whether you can reason with pointers, not just recite definitions. Draw the nodes and arrows first.'),
      ],
    },
    {
      ...concept(stem('m3', 'quiz'), 'Knowledge check', '15', 'Quiz', 'Mix and match Module 3'),
      blocks: [{ t: 'quiz' }],
    },
  ],
  quiz: [
    { q: 'A linked list node typically stores:', options: ['Only data', 'Data and link', 'Only an address', 'An array'], answer: 1, why: 'A node carries data plus one or more links.' },
    { q: 'Inserting at the front of an SLL costs:', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], answer: 0, why: 'Only HEAD and the new node need rewiring.' },
    { q: 'A header node is:', options: ['The first real data node', 'A dummy sentinel', 'The last node', 'A null pointer'], answer: 1, why: 'It never stores user data; it simplifies edge cases.' },
    { q: 'In a circular list with last pointer, last->link is:', options: ['NULL', 'The first node', 'The header', 'The node before last'], answer: 1, why: 'The ring wraps from last back to first.' },
    { q: 'A DLL node has:', options: ['One link', 'Two links', 'No links', 'An array of links'], answer: 1, why: 'It stores llink and rlink.' },
    { q: 'Fast/slow pointers are used to find:', options: ['The maximum', 'The middle or a cycle', 'The sum', 'The first node'], answer: 1, why: 'Different speeds reveal structure in one pass.' },
    { q: 'Sparse matrix lists save space by storing:', options: ['All zeros', 'Only non-zero entries', 'Only row headers', 'Only column headers'], answer: 1, why: 'Zero cells are implied and not stored.' },
    { q: 'Polynomial term nodes usually hold:', options: ['Coefficient and exponent', 'Row and column', 'Front and rear', 'Left and right'], answer: 0, why: 'Each term is (coefficient, exponent).' },
    { q: 'Deleting a known middle node from a DLL is O(1) because:', options: ['It has a previous link', 'It is circular', 'It is sorted', 'It has a header'], answer: 0, why: 'llink gives direct access to the predecessor.' },
    { q: 'Browser back/forward is best modelled with a:', options: ['Static array', 'Circular doubly linked list', 'Priority queue', 'Sparse matrix'], answer: 1, why: 'The current node can move in both directions.' },
  ],
};

/* ------------------------------------------------------------------ */
/* Module 4 — trees                                                    */
/* ------------------------------------------------------------------ */

const m4Mindmap = {
  name: 'Trees',
  concept: stem('m4', 'overview'),
  tip: 'Hierarchies make search, expression handling and sorted storage fast.',
  children: [
    {
      name: 'Tree basics', concept: stem('m4', 'tree-basics'),
      tip: 'Root, parent, child, level and height describe a hierarchy.',
      children: [
        { name: 'Root', concept: stem('m4', 'tree-basics'), tip: 'The unique node with no parent.' },
        { name: 'LCRS', concept: stem('m4', 'tree-basics'), tip: 'Left-child, right-sibling representation.' },
        { name: 'Forest', concept: stem('m4', 'forests'), tip: 'A set of disjoint trees.' },
      ],
    },
    {
      name: 'Binary trees', concept: stem('m4', 'binary'),
      tip: 'At most two children per node, with useful counting properties.',
      children: [
        { name: 'Full', concept: stem('m4', 'binary'), tip: 'Every node has 0 or 2 children.' },
        { name: 'Complete', concept: stem('m4', 'binary'), tip: 'All levels filled except possibly the last, left to right.' },
        { name: 'Skewed', concept: stem('m4', 'binary'), tip: 'Degenerates into a chain.' },
      ],
    },
    {
      name: 'Storage', concept: stem('m4', 'representations'),
      tip: 'Arrays are compact for complete trees; links are flexible for others.',
      children: [
        { name: 'Array formulas', concept: stem('m4', 'representations'), tip: 'left = 2i+1, right = 2i+2, parent = (i-1)/2.' },
        { name: 'Linked nodes', concept: stem('m4', 'representations'), tip: 'left_child, data, right_child.' },
        { name: 'Height', concept: stem('m4', 'binary'), tip: 'Maximum number of edges from root to a leaf.' },
      ],
    },
    {
      name: 'Traversal', concept: stem('m4', 'traversals'),
      tip: 'Visit every node in a defined order.',
      children: [
        { name: 'Inorder', concept: stem('m4', 'traversals'), tip: 'Left, node, right — sorted for a BST.' },
        { name: 'Preorder', concept: stem('m4', 'traversals'), tip: 'Node, left, right — good for copies.' },
        { name: 'Postorder', concept: stem('m4', 'traversals'), tip: 'Left, right, node — good for deletion.' },
      ],
    },
    {
      name: 'Search trees', concept: stem('m4', 'bst'),
      tip: 'Left keys are smaller, right keys are larger.',
      children: [
        { name: 'Search', concept: stem('m4', 'bst'), tip: 'Compare and choose one branch; O(h).' },
        { name: 'Insert', concept: stem('m4', 'bst'), tip: 'Search to a leaf position and attach there.' },
        { name: 'Threaded', concept: stem('m4', 'threaded'), tip: 'Use null links as traversal threads.' },
      ],
    },
  ],
};

const m4 = {
  id: 'm4',
  label: 'Module 4 · Trees',
  summary: 'Tree terminology, binary trees, traversals, threaded trees, binary search trees, selection trees and forests.',
  mindmap: m4Mindmap,
  branchColours: {
    'Tree basics': '#0f766e', 'Binary trees': '#7c3aed', Storage: '#0e7490',
    Traversal: '#b45309', 'Search trees': '#15803d',
  },
  icons: {
    'Tree basics': 'M0,-5 v3 M0,-2 h-5 v3 M0,-2 h5 v3 M-5,1 v3 M5,1 v3',
    'Binary trees': 'M0,-4 v3 M0,-1 h-5 v3 M0,-1 h5 v3 M-5,2 v2 M5,2 v2',
    Storage: 'M-5,-3 h10 v6 h-10 Z M-5,0 h10 M0,-3 v6',
    Traversal: 'M-4,-3 h8 M-4,0 h8 M-4,3 h8 M-2,-5 v10 M2,-5 v10',
    'Search trees': 'M0,-4 a4,4 0 1 0 0.1,0 M0,-4 v4 l3,2',
  },
  glossary: [
    ['Tree', 'A non-linear hierarchical structure with a root and disjoint subtrees.'],
    ['Root', 'The unique node with no parent.'],
    ['Parent / child', 'A direct predecessor / successor connected by one edge.'],
    ['Degree', 'Number of children of a node.'],
    ['Leaf', 'A node with no children.'],
    ['Level', 'Distance from the root in edges, with root at level 0.'],
    ['Height', 'Maximum number of edges from root to a leaf.'],
    ['Binary tree', 'A tree where each node has at most two children.'],
    ['Full binary tree', 'Every node has either 0 or 2 children.'],
    ['Complete binary tree', 'All levels filled except possibly the last, which is left-justified.'],
    ['LCRS', 'Left-child, right-sibling representation of a general tree.'],
    ['Preorder', 'Visit node, then left subtree, then right subtree.'],
    ['Inorder', 'Visit left subtree, then node, then right subtree.'],
    ['Postorder', 'Visit left subtree, then right subtree, then node.'],
    ['Level order', 'Visit nodes level by level using a queue.'],
    ['Thread', 'A pointer that replaces a null child link with a traversal successor/predecessor.'],
    ['Threaded tree', 'A binary tree with threads for stack-free inorder traversal.'],
    ['BST', 'Binary search tree: left keys < node key ≤ right keys.'],
    ['Selection tree', 'A complete tree used to find the smallest or largest key quickly.'],
    ['Forest', 'An ordered set of disjoint trees.'],
  ],
  questions: [
    'Why is a tree called a hierarchical, non-linear structure?',
    'What is the difference between a full and a complete binary tree?',
    'Why are array formulas efficient for complete binary trees?',
    'Which traversal produces sorted output for a BST, and why?',
    'Why does postorder traversal help when deleting a tree?',
    'How do threads remove the need for a traversal stack?',
    'Why is BST search O(h) rather than O(log n) in every case?',
    'What happens when keys are inserted into a BST in sorted order?',
    'How does a selection tree find the minimum winner?',
    'How can a forest be represented as a binary tree?',
  ],
  concepts: [
    {
      ...concept(stem('m4', 'overview'), 'Big picture', '05', 'Introduction', 'From lines to hierarchies'),
      blocks: [
        P([
          'A tree is a non-linear hierarchy: one root, branches, and leaves. A family tree, a temple’s organisation chart, or the folder structure of your projects folder are all trees. Linked lists model a queue of plates; trees model branches and choices.',
        ]),
        DIAGRAM('react', 'dsa-tree-levels', 'A small family-style tree by level.', [
          { title: 'Amma', detail: 'root · level 0' }, { title: 'Child A', detail: 'level 1' },
          { title: 'Child B', detail: 'level 1' }, { title: 'Grandchild', detail: 'level 2' },
        ]),
        CARDS([
          { title: 'Terminology', text: 'root, parent, child, sibling, leaf, degree, level, height.', badge: 'vocab' },
          { title: 'Binary', text: 'At most two children; enables elegant array indexing.', badge: 'shape' },
          { title: 'Search', text: 'BST ordering makes compare-and-branch search possible.', badge: 'speed' },
        ]),
        CALLOUT('Big idea', 'Trees trade simplicity for speed: a balanced tree searches in about log₂n comparisons instead of scanning all n items.'),
      ],
    },
    {
      ...concept(stem('m4', 'mindmap'), 'Module mind map', '01', 'Roadmap', 'See the tree family at once'),
      blocks: [P(['Click a node to jump to its detailed section.']), { t: 'mindmap' }],
    },
    {
      ...concept(stem('m4', 'glossary'), 'Glossary', '02', 'Terms', 'Words used in this module'),
      blocks: [{ t: 'glossary' }],
    },
    {
      ...concept(stem('m4', 'questions'), 'Conceptual questions', '03', 'Think first', 'Questions to answer before the quiz'),
      blocks: [{ t: 'questions' }],
    },
    {
      ...concept(stem('m4', 'tree-basics'), 'Tree basics', '06', 'Hierarchy', 'Root, edges, levels and LCRS'),
      blocks: [
        P([
          'A tree is a finite set of one or more nodes with a distinguished root. Every other node has exactly one parent. Nodes with no children are leaves. The level counts edges from the root; height is the deepest level.',
        ]),
        DIAGRAM('graphviz', 'dsa-general-tree', 'The A–I general tree from the notes, drawn by level.'),
        TABLE(['Term', 'Meaning', 'Example'], [
          ['Root', 'No parent', 'A'],
          ['Parent', 'Direct predecessor', 'B is parent of E and F'],
          ['Sibling', 'Same parent', 'B, C and D'],
          ['Leaf', 'No children', 'E, F, G, H, I'],
        ]),
        EXAMPLE('LCRS', 'A general tree with many children can be stored with two pointers per node: left_child and right_sibling. The children become a horizontal chain, so memory use is fixed even when a node has many children.', ['left_child points down', 'right_sibling points across', 'Used when child counts vary widely']),
      ],
    },
    {
      ...concept(stem('m4', 'binary'), 'Binary trees', '07', 'Hierarchy', 'At most two children'),
      blocks: [
        P([
          'A binary tree is empty or has a root plus two disjoint binary subtrees. Full trees have 0 or 2 children per node. Complete trees fill every level except possibly the last, from left to right. A skewed tree is essentially a linked list wearing a tree costume.',
        ]),
        DIAGRAM('react', 'dsa-binary-shapes', 'Three common shapes.', [
          { title: 'Full', detail: '0 or 2 children' }, { title: 'Complete', detail: 'last level left-filled' },
          { title: 'Perfect', detail: 'all leaves at bottom' }, { title: 'Skewed', detail: 'chain-like' },
        ]),
        TABLE(['Property', 'Value', 'Why it matters'], [
          ['Max nodes at level i', '2ⁱ', 'Counts growth by level'],
          ['Max nodes height h', '2ʰ⁺¹ − 1', 'Capacity of a perfect tree'],
          ['Leaves in full tree', 'internal nodes + 1', 'Useful exam identity'],
        ]),
        CALLOUT('Height matters', 'Balanced trees have h ≈ log₂n; skewed trees have h ≈ n. That difference is the difference between fast search and slow search.'),
      ],
    },
    {
      ...concept(stem('m4', 'representations'), 'Representations', '08', 'Storage', 'Array formulas or linked nodes'),
      blocks: [
        P([
          'A complete binary tree maps neatly into an array: the left child of index i is 2i+1, the right child is 2i+2, and the parent is floor((i−1)/2). For irregular trees, linked nodes with left_child, data and right_child avoid wasted slots.',
        ]),
        FORMULA('left(i) = 2i + 1', 'right(i) = 2i + 2 · parent(i) = ⌊(i − 1) / 2⌋'),
        DIAGRAM('graphviz', 'dsa-binary-tree', 'A linked binary tree with root 10.'),
        TABLE(['Storage', 'Best for', 'Weakness'], [
          ['Array', 'Complete / heap trees', 'Wastes space for sparse shapes'],
          ['Linked nodes', 'Irregular trees', 'Extra pointer storage'],
        ]),
      ],
    },
    {
      ...concept(stem('m4', 'traversals'), 'Traversals', '09', 'Processing', 'Four orders to visit every node'),
      blocks: [
        P([
          'Traversal visits each node exactly once. Preorder (NLR) is handy for copying a tree. Inorder (LNR) prints sorted keys for a BST. Postorder (LRN) visits children before the parent, ideal for deletion. Level order uses a queue.',
        ]),
        DIAGRAM('mermaid', 'dsa-traversal-flow', 'Choosing a traversal order.'),
        STEPS('Traverse this tree', [
          { title: 'Tree', text: 'Root A, left B with children D and E, right C with children F and G.' },
          { title: 'Preorder', text: 'A B D E C F G — root first.' },
          { title: 'Inorder', text: 'D B E A F C G — root in the middle.' },
          { title: 'Postorder', text: 'D E B F G C A — root last.' },
          { title: 'Level order', text: 'A B C D E F G — top to bottom.' },
        ]),
        CODE('Recursive inorder', 'void inorder(NODE *t) {\n  if (t == NULL) return;\n  inorder(t->left);\n  printf("%d ", t->data);\n  inorder(t->right);\n}'),
        CALLOUT('Reconstruction exam', 'Given inorder + preorder (or inorder + postorder), the root comes from the pre/post order; inorder splits it into left and right subtrees. Repeat recursively.'),
      ],
    },
    {
      ...concept(stem('m4', 'threaded'), 'Threaded trees', '10', 'Processing', 'Use the empty links'),
      blocks: [
        P([
          'A binary tree with n nodes has n+1 null links. A threaded tree replaces some of those null links with shortcuts: an inorder thread to the successor, or a preorder thread. A head node makes the traversal circular so no stack is needed.',
        ]),
        DIAGRAM('graphviz', 'dsa-threaded-tree', 'Dotted arrows are threads to inorder successors.'),
        STEPS('Inorder without recursion', [
          { title: 'Start', text: 'temp = tree (the head node).' },
          { title: 'Find successor', text: 'temp = insucc(temp); follow a real left path first, or a thread if available.' },
          { title: 'Stop', text: 'When temp returns to the head node, the traversal is complete.' },
        ]),
        TABLE(['Field', 'Meaning'], [
          ['left_thread', 'TRUE means left_child is a thread, not a child'],
          ['right_thread', 'TRUE means right_child is a thread'],
        ]),
      ],
    },
    {
      ...concept(stem('m4', 'bst'), 'Binary search trees', '11', 'Search trees', 'Compare once, discard half'),
      blocks: [
        P([
          'In a BST, every key in the left subtree is smaller than the node and every key in the right subtree is larger (duplicates need a stated policy). Search, insert and delete follow one path down the tree, costing O(h).',
        ]),
        DIAGRAM('mermaid', 'dsa-bst-search', 'The compare-and-branch decision.'),
        STEPS('Insert 4 into a BST rooted at 14', [
          { title: '4 < 14', text: 'Move left to 4. Equal keys are ignored in this example.' },
          { title: 'Insert 20', text: '20 > 14 → right to 15 → right to 18 → right of 18.' },
          { title: 'Inorder check', text: 'Printing inorder gives keys in ascending order.' },
        ]),
        TABLE(['Operation', 'Balanced', 'Skewed'], [
          ['Search', 'O(log n)', 'O(n)'],
          ['Insert', 'O(log n)', 'O(n)'],
          ['Delete', 'O(log n)', 'O(n)'],
        ]),
        CALLOUT('Deletion cases', 'Leaf: remove directly. One child: promote the child. Two children: replace with the inorder successor (smallest node in the right subtree) or the inorder predecessor.'),
      ],
    },
    {
      ...concept(stem('m4', 'forests'), 'Selection trees & forests', '12', 'Advanced', 'Winners and disjoint trees'),
      blocks: [
        P([
          'A selection tree is a complete binary tree used to find the smallest (or largest) record. Each internal node stores the winner of its two children, so the overall winner sits at the root. After replacing a winner, only one path needs updating: O(log n).',
        ]),
        P([
          'A forest is an ordered set of disjoint trees. Deleting the root of a general tree produces a forest of its subtrees. Any forest can be transformed into one binary tree using the left-child, right-sibling rule.',
        ]),
        DIAGRAM('react', 'dsa-forest', 'Three disjoint trees become a forest.', [
          { title: 'Tree 1', detail: 'root A' }, { title: 'Tree 2', detail: 'root B' }, { title: 'Tree 3', detail: 'root C' },
        ]),
        CALLOUT('Link to LCRS', 'The right sibling pointer of a binary tree node represents the next tree in the forest. This is why forests and binary trees are interchangeable in the notes.'),
      ],
    },
    {
      ...concept(stem('m4', 'quiz'), 'Knowledge check', '13', 'Quiz', 'Mix and match Module 4'),
      blocks: [{ t: 'quiz' }],
    },
  ],
  quiz: [
    { q: 'The unique node with no parent is the:', options: ['Leaf', 'Root', 'Sibling', 'Forest'], answer: 1, why: 'The root is the starting node of a tree.' },
    { q: 'Maximum nodes in a binary tree of height h is:', options: ['2h', '2ʰ⁺¹ − 1', 'h + 1', '2ʰ'], answer: 1, why: 'A perfect binary tree has 2^(h+1) − 1 nodes.' },
    { q: 'For array storage, left child of index i is:', options: ['2i', '2i + 1', '2i + 2', '(i−1)/2'], answer: 1, why: '0-based array indexing uses 2i+1 for the left child.' },
    { q: 'Inorder traversal visits:', options: ['node, left, right', 'left, node, right', 'left, right, node', 'root level by level'], answer: 1, why: 'Inorder is Left, Node, Right.' },
    { q: 'Postorder is useful for:', options: ['Copying a tree', 'Printing sorted keys', 'Deleting a tree', 'Finding a root'], answer: 2, why: 'Children are removed before their parent.' },
    { q: 'A thread replaces a null link with:', options: ['A random pointer', 'A traversal shortcut', 'A data value', 'A header node'], answer: 1, why: 'Threads point to inorder successors or predecessors.' },
    { q: 'BST search cost depends on:', options: ['Number of leaves', 'Tree height', 'Array size', 'Root value'], answer: 1, why: 'Search follows one path of length h.' },
    { q: 'Inserting sorted keys into a plain BST creates:', options: ['A perfect tree', 'A skewed tree', 'A forest', 'A full tree'], answer: 1, why: 'Each new key goes to the right of the previous one.' },
    { q: 'A selection tree root stores:', options: ['The winner', 'The height', 'The number of leaves', 'The last key'], answer: 0, why: 'Internal nodes promote the winner upward.' },
    { q: 'A forest is:', options: ['One binary tree', 'A set of disjoint trees', 'A threaded list', 'A complete tree'], answer: 1, why: 'Removing a tree root produces a forest of subtrees.' },
  ],
};

export const dsaModules = { m1, m2, m3, m4 };

export const dsaModuleIds = ['m1', 'm2', 'm3', 'm4'];
