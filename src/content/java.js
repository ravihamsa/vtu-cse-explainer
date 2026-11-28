/**
 * Java explainer content derived only from Java module4.pdf (Module 4 · String Handling).
 * All concepts render inline on the module page; concept hashes deep-link to a section.
 */

const P = (text) => ({ t: 'p', text });
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

const stem = (id) => `java-m4-${id}`;
const ROOT_ICON = 'M-4,-4 h8 v8 h-8 Z M-6,-2 h2 M-6,0 h2 M-6,2 h2 M4,-2 h2 M4,0 h2 M4,2 h2 M-2,-6 v2 M0,-6 v2 M2,-6 v2 M-2,4 v2 M0,4 v2 M2,4 v2';

const mindmap = {
  name: 'String Handling',
  concept: stem('overview'),
  tip: 'Java strings are objects: create them, measure them, convert them and extract from them.',
  children: [
    {
      name: 'Core idea', concept: stem('immutability'),
      tip: 'A String holds characters, but its contents cannot change after creation.',
      children: [
        { name: 'String class', concept: stem('immutability'), tip: 'java.lang.String represents a sequence of characters.' },
        { name: 'Immutability', concept: stem('immutability'), tip: 'Operations create a new object; the old String remains unchanged.' },
        { name: 'Reference', concept: stem('immutability'), tip: 'The variable can point to another String even though the object cannot change.' },
      ],
    },
    {
      name: 'Creating', concept: stem('constructors'),
      tip: 'Use a literal or one of the constructors for empty, char[], byte[] and copy strings.',
      children: [
        { name: 'Literal', concept: stem('literals'), tip: 'Characters inside double quotes, such as "idli".' },
        { name: 'Constructors', concept: stem('constructors'), tip: 'new String(), new String(char[]), new String(byte[]) and more.' },
        { name: 'Copy', concept: stem('constructors'), tip: 'new String(s1) builds another String from an existing one.' },
      ],
    },
    {
      name: 'Measure & join', concept: stem('length'),
      tip: 'length() counts characters; + and concat() join strings.',
      children: [
        { name: 'length()', concept: stem('length'), tip: 'Returns an int; spaces, digits and symbols all count.' },
        { name: '+ operator', concept: stem('literals'), tip: 'Joins strings and converts other values into text.' },
        { name: 'concat()', concept: stem('literals'), tip: 'Appends one string to another without a separator.' },
      ],
    },
    {
      name: 'Convert', concept: stem('valueof'),
      tip: 'Turn values into strings or strings into arrays.',
      children: [
        { name: 'String.valueOf()', concept: stem('valueof'), tip: 'Converts int, double, boolean and char to String.' },
        { name: 'getBytes()', concept: stem('getbytes'), tip: 'Produces a byte array of numeric values.' },
        { name: 'toCharArray()', concept: stem('tochararray'), tip: 'Produces a char array, one character per element.' },
      ],
    },
    {
      name: 'Extract', concept: stem('charat'),
      tip: 'Pick one character or copy a range into an array.',
      children: [
        { name: 'charAt()', concept: stem('charat'), tip: 'Returns the character at a 0-based index.' },
        { name: 'getChars()', concept: stem('getchars'), tip: 'Copies a source range into a destination char array.' },
        { name: 'Scenario lab', concept: stem('scenarios'), tip: 'Choose the right method for a familiar canteen task.' },
      ],
    },
    {
      name: 'Mutable note', concept: stem('mutable'),
      tip: 'The notes only introduce StringBuffer and StringBuilder as mutable options.',
      children: [
        { name: 'StringBuffer', concept: stem('mutable'), tip: 'Mutable, java.lang, for frequent modifications.' },
        { name: 'StringBuilder', concept: stem('mutable'), tip: 'Mutable, java.lang; no methods are detailed in these notes.' },
        { name: 'Knowledge check', concept: stem('quiz'), tip: 'A shuffled quiz covering every topic in the notes.' },
      ],
    },
  ],
};

const branchColours = {
  'Core idea': '#0f766e',
  Creating: '#7c3aed',
  'Measure & join': '#b45309',
  Convert: '#0e7490',
  Extract: '#be123c',
  'Mutable note': '#15803d',
};

const icons = {
  root: ROOT_ICON,
  'Core idea': 'M-4,-4 h8 v8 h-8 Z M-4,-1 h8 M-4,2 h5',
  Creating: 'M-5,-3 h6 v6 h-6 Z M-1,-3 h6 v6 h-6 Z M-2,0 h2',
  'Measure & join': 'M-5,1 v-4 M-2,1 v-6 M1,1 v-3 M4,1 v-7 M-5,3 h10',
  Convert: 'M-4,-2 a4,3 0 1 1 0.2,0 M4,-2 v4 M-4,-2 v4 a4,3 0 0 0 8,0 M-2,-2 h4',
  Extract: 'M-5,-4 v3 M5,-4 v3 M-5,4 v-3 M5,4 v-3 M-2,-1 h4 v2 h-4 Z',
  'Mutable note': 'M-4,-3 h8 v6 h-8 Z M-4,0 h8 M-2,-3 v6 M2,-3 v6',
};

const glossary = [
  ['String', 'A sequence of characters represented in Java as an object of the String class.'],
  ['java.lang.String', 'The fully qualified home of the String class; java.lang is loaded automatically.'],
  ['Immutable', 'Unable to change after creation. A String object’s characters stay fixed.'],
  ['Mutable', 'Able to change after creation. StringBuffer and StringBuilder are introduced as mutable alternatives.'],
  ['String reference', 'A variable that points to a String object; it may be redirected to another object.'],
  ['String literal', 'Characters enclosed in double quotes, such as "Hello".'],
  ['Concatenation', 'Joining strings with the + operator or the concat() method.'],
  ['Constructor', 'A special routine used with new to build an object, such as new String(char[]).'],
  ['Default constructor', 'new String(); it creates an empty string.'],
  ['Character array', 'char[], used by new String(char[]) and by toCharArray().'],
  ['Byte array', 'byte[], used by new String(byte[]) and returned by getBytes().'],
  ['length()', 'String method that returns the number of characters as an int.'],
  ['Index', 'The 0-based position of a character; "Java" has indices 0, 1, 2 and 3.'],
  ['charAt()', 'Method that returns the single character at a given index.'],
  ['getChars()', 'Method that copies a range of characters into a destination char array.'],
  ['srcBegin', 'The first source index copied by getChars(); it is included in the copy.'],
  ['srcEnd', 'The source index one past the last character copied by getChars(); it is not included.'],
  ['destBegin', 'The index in the destination array where getChars() starts writing.'],
  ['getBytes()', 'Method that converts a String into a byte array of numeric values.'],
  ['toCharArray()', 'Method that converts a String into a char array, one character per element.'],
  ['String.valueOf()', 'Method that converts values such as int, double, boolean and char into a String.'],
  ['StringBuffer', 'A mutable string class in java.lang, mentioned in the notes for frequent modification.'],
  ['StringBuilder', 'A mutable string class in java.lang, mentioned alongside StringBuffer in the notes.'],
];

const questions = [
  'Why does s = s + " Programming" leave the original "Java" object unchanged?',
  'What is the difference between changing a String reference and changing a String object?',
  'Why do String, StringBuffer and StringBuilder need no import?',
  'What does new String(letters, 1, 3) produce from {H, e, l, l, o}, and why?',
  'What does length() count in "Java Programming"?',
  'Why does "four: " + 2 + 2 print "four: 22"?',
  'When would you use String.valueOf(true) instead of writing "true" yourself?',
  'What does "Java".charAt(3) return, and what does the index mean?',
  'Why does getChars() need both a destination array and a starting position in it?',
  'What is the difference between getBytes() and toCharArray()?',
  'In "This is a demo...", why do start = 10 and end = 14 copy "demo"?',
  'Which method would you choose to walk every letter of "vada" one by one?',
];

const concepts = [
  {
    ...concept(stem('overview'), 'Big picture', '00', 'Introduction', 'Java strings: text as objects'),
    blocks: [
      P([
        'A Java String is a sequence of characters. Unlike a simple character array, it is an object of the `String` class in `java.lang.String`. Because `java.lang` loads automatically, you can write `String s = "Java";` without an import.',
        'These notes cover the `String` class, immutability, constructors, `length()`, literals and concatenation, `String.valueOf()`, `charAt()`, `getChars()`, `getBytes()` and `toCharArray()`. Each topic gets its own page so you can open only what you need.',
      ]),
      DIAGRAM('react', 'java-string-pipeline', 'From characters to a String object and its methods.', [
        { title: '"idli"', detail: 'literal' },
        { title: 'new String(...)', detail: 'constructor' },
        { title: 'String object', detail: 'java.lang.String' },
        { title: 'methods', detail: 'length · charAt · getBytes' },
      ]),
      TABLE(['Question', 'Answer from the notes', 'Canteen image'], [
        ['What is stored?', 'A sequence of characters', 'The letters on an idli token'],
        ['Where is the class?', 'java.lang.String, loaded automatically', 'A counter that is already on the stall'],
        ['Can the text change?', 'No; String is immutable', 'A printed token cannot be rewritten'],
        ['How is text built?', 'Literal, constructor or concatenation', 'Write a token, copy a token, join two tokens'],
      ], 'The whole module is built around these four answers.'),
      CARDS([
        { title: 'Create', text: 'Literals and constructors make String objects.', badge: 'start' },
        { title: 'Inspect', text: 'length(), charAt() and getChars() read the text.', badge: 'read' },
        { title: 'Convert', text: 'String.valueOf(), getBytes() and toCharArray() change representation.', badge: 'convert' },
      ]),
      CALLOUT('Scope of this explainer', 'The notes introduce `StringBuffer` and `StringBuilder` as mutable alternatives in the introduction, but they do not list their methods. This site keeps that same boundary.'),
    ],
  },
  {
    ...concept(stem('mindmap'), 'Module mind map', '01', 'Roadmap', 'See String Handling at once'),
    blocks: [
      P(['Drag to pan, scroll to zoom, hover for a short note, and click any node to open that topic page. Mind-map links stay inside Java Module 4.']),
      { t: 'mindmap' },
    ],
  },
  {
    ...concept(stem('glossary'), 'Glossary', '02', 'Terms', 'Words used in String Handling'),
    blocks: [
      P(['New terms from the notes, with srcEnd and srcBegin spelled out because getChars() is easy to misread.']),
      { t: 'glossary' },
    ],
  },
  {
    ...concept(stem('questions'), 'Conceptual questions', '03', 'Think first', 'Questions to answer before the quiz'),
    blocks: [{ t: 'questions' }],
  },
  {
    ...concept(stem('immutability'), 'Strings & immutability', '04', 'Core idea', 'The object stays; the reference moves'),
    blocks: [
      P([
        'A String is a sequence of characters, and Java represents it as an object rather than as a simple character array. Once the object is created, its contents cannot change. Operations such as concatenation or changing case produce a **new** String object; the original is left alone.',
      ]),
      DIAGRAM('react', 'java-immutable', 's = s + " Programming" creates a new object.', [
        { title: 's → "Java"', detail: 'old object' },
        { title: '+ " Programming"', detail: 'operation' },
        { title: '"Java Programming"', detail: 'new object' },
        { title: 's → new object', detail: 'reference moved' },
      ]),
      CODE('Immutability in the notes', 'String s = "Java";\ns = s + " Programming";\n// New string: "Java Programming"\n// The old "Java" object is not modified.'),
      TABLE(['Part', 'Can it change?', 'Meaning'], [
        ['String object', 'No', 'Its characters are fixed after creation.'],
        ['String reference s', 'Yes', 'It can point to a different String object.'],
        ['Concatenation result', 'New object', 'The original object is not edited.'],
      ]),
      CALLOUT('One sentence to remember', 'Immutability means the object’s contents cannot change; only the reference can be redirected to another object.'),
      EXAMPLE('Token at the idli counter', 'A printed token reading “Java” is never rewritten. If the stall needs “Java Programming”, it prints a second token and the hand points to the new one.', ['Old token still exists', 'The hand is the reference', 'Printing again is like concatenation']),
    ],
  },
  {
    ...concept(stem('constructors'), 'String constructors', '05', 'Creating', 'Five ways to build a String'),
    blocks: [
      P([
        'Most programs use string literals, but Java also provides constructors. The notes show an empty String, a String from a character array, a slice of a character array, a copy of another String and a String from byte values.',
      ]),
      DIAGRAM('graphviz', 'java-constructor-map', 'Different inputs, one String object.'),
      TABLE(['Form', 'Example', 'Result'], [
        ['Default', 'new String()', 'Empty string'],
        ['Character array', 'new String(letters)', '"Hello"'],
        ['Array slice', 'new String(letters, 1, 3)', '"ell"'],
        ['Copy', 'new String(s1)', 'A String with the same text as s1'],
        ['Byte array', 'new String(bytes)', '"Hello" from ASCII values'],
      ], 'For the slice, 1 is the start index and 3 is the length counted from there.'),
      CODE('Character array and copy', 'char[] letters = {\'H\', \'e\', \'l\', \'l\', \'o\'};\nString s1 = new String(letters);          // "Hello"\nString s2 = new String(letters, 1, 3);    // "ell"\nString s3 = new String(s1);               // "Hello"'),
      CODE('Byte array from the notes', 'byte[] bytes = {72, 101, 108, 108, 111}; // ASCII for "Hello"\nString s = new String(bytes);\nSystem.out.println(s);                    // Hello'),
      EXAMPLE('Idli stall name board', 'A board can be left blank (`new String()`), filled from loose letter tiles (`char[]`), copied from another board (`new String(s1)`), or rebuilt from tile numbers (`byte[]`). Same result, different starting material.', ['Slice uses start index + length', 'Byte values here are ASCII numbers', 'The copy constructor is shown in the notes’ MakeString class']),
    ],
  },
  {
    ...concept(stem('length'), 'String length', '06', 'Measure', 'length() counts every character'),
    blocks: [
      P([
        'Every String has a `length()` method. It returns an `int` equal to the number of characters in the string. Spaces, numbers and symbols are all counted.',
      ]),
      FORMULA('stringName.length()  →  int', 'Call it on a String object; it does not need an argument.'),
      CODE('From the notes', 'String s = "Java Programming";\nSystem.out.println("Length: " + s.length());\n// Length: 16'),
      TABLE(['String', 'length()', 'Why'], [
        ['"Java"', '4', 'Four letters'],
        ['"Java Programming"', '16', '4 letters + 1 space + 11 letters'],
        ['"Age: 25"', '7', 'Letters, colon, space and digits all count'],
      ]),
      CALLOUT('Exam habit', 'Count the space as a character. "Java Programming" is 16, not 15.'),
    ],
  },
  {
    ...concept(stem('literals'), 'Literals & concatenation', '07', 'Join', '+ and concat() build new text'),
    blocks: [
      P([
        'A string literal is a sequence of characters inside double quotes. Java can join strings with the `+` operator or with the `concat()` method. Both produce a new String because String is immutable.',
      ]),
      DIAGRAM('mermaid', 'java-concat-flow', '+ can insert a space; concat() joins directly.'),
      CODE('Two ways to join', 'String s1 = "Hello";\nString s2 = "World";\nString withSpace = s1 + " " + s2;  // "Hello World"\nString direct = s1.concat(s2);     // "HelloWorld"'),
      TABLE(['Expression', 'Result', 'Reason'], [
        ['"Age: " + 25', '"Age: 25"', 'The number is converted into text after the string.'],
        ['"four: " + 2 + 2', '"four: 22"', 'Evaluation is left to right; the first 2 becomes text, then the second is appended.'],
        ['s1.concat(s2)', '"HelloWorld"', 'concat() appends exactly what you pass; no automatic space.'],
      ]),
      EXAMPLE('Filter-coffee order', 'An order label "Age: 25" grows left to right: first the words, then the number. If you write `"four: " + 2 + 2`, the stall prints “four: 22”, not “four: 4”.', ['Use + when mixing text and values', 'Add " " yourself when you need a space', 'concat() has no separator']),
    ],
  },
  {
    ...concept(stem('valueof'), 'String.valueOf()', '08', 'Convert', 'Turn a value into a String'),
    blocks: [
      P([
        'String conversion means changing a data type or object into a String. `String.valueOf()` handles an `int`, `double`, `boolean` or `char` and returns a String object.',
      ]),
      DIAGRAM('mermaid', 'java-valueof-flow', 'Different input types, one String output.'),
      CODE('From the notes', 'String s1 = String.valueOf(100);   // int → String\nString s2 = String.valueOf(12.5);  // double → String\nString s3 = String.valueOf(true);  // boolean → String\nString s4 = String.valueOf(\'A\');   // char → String'),
      TABLE(['Call', 'String value', 'getClass() type'], [
        ['String.valueOf(100)', '"100"', 'String'],
        ['String.valueOf(12.5)', '"12.5"', 'String'],
        ['String.valueOf(true)', '"true"', 'String'],
        ["String.valueOf('A')", '"A"', 'String'],
      ], 'The Demo class in the notes prints each value together with its class.'),
      CODE('Demo pattern', 'System.out.println("Value: " + s1 + ", Type: " + s1.getClass());'),
      CALLOUT('Why it helps', 'Use `String.valueOf()` when you specifically need a String object from a value, such as storing a roll number beside a student name.'),
    ],
  },
  {
    ...concept(stem('charat'), 'charAt()', '09', 'Extract', 'Pick one character by index'),
    blocks: [
      P([
        'Character extraction means retrieving individual characters from a string. `charAt(index)` returns the character at a 0-based position.',
      ]),
      FORMULA('char c = stringName.charAt(index);', 'The first character is at index 0.'),
      CODE('From the notes', 'String s = "Java";\nSystem.out.println(s.charAt(0)); // J\nSystem.out.println(s.charAt(3)); // a'),
      TABLE(['Index', '0', '1', '2', '3'], [
        ['"Java"', 'J', 'a', 'v', 'a'],
      ], 'Four letters means valid indices 0 through 3.'),
      EXAMPLE('Vada counter token', 'For the token “vada”, `charAt(0)` gives `v` and `charAt(3)` gives `a`. It is like reading one letter at a time from a printed slip.', ['Indexing starts at zero', 'The result is a char', 'Use length() to know the last index']),
    ],
  },
  {
    ...concept(stem('getchars'), 'getChars()', '10', 'Extract', 'Copy a range into a char array'),
    blocks: [
      P([
        '`getChars()` copies a portion of a String into a character array. The notes give four arguments: source start, source end, destination array and destination start.',
      ]),
      FORMULA('getChars(srcBegin, srcEnd, destinationArray, destBegin)', 'srcBegin is included; srcEnd is one past the last character copied.'),
      DIAGRAM('react', 'java-getchars', 'Range 0 → 5 of "Programming" copies P r o g r.', [
        { title: 'P', detail: 'src 0' },
        { title: 'r', detail: 'src 1' },
        { title: 'o', detail: 'src 2' },
        { title: 'g', detail: 'src 3' },
        { title: 'r', detail: 'src 4' },
        { title: 'end 5', detail: 'not copied' },
      ]),
      TABLE(['Argument', 'Meaning', 'Example'], [
        ['srcBegin', 'First source index', '0'],
        ['srcEnd', 'Index after the last source character', '5'],
        ['destinationArray', 'char[] that receives the copy', 'arr'],
        ['destBegin', 'Where copying starts in that array', '0'],
      ]),
      CODE('First example from the notes', 'String s = "Programming";\nchar[] arr = new char[5];\ns.getChars(0, 5, arr, 0);\nfor (int i = 0; i < arr.length; i++) {\n  System.out.print(arr[i]);   // Progr\n}'),
      CODE('Second example from the notes', 'String s = "This is a demo of the getChars method.";\nint start = 10;\nint end = 14;\nchar[] buf = new char[end - start]; // room for 4 characters\ns.getChars(start, end, buf, 0);\nSystem.out.println(buf);           // demo'),
      CALLOUT('Why end − start?', 'The copied range contains indices 10, 11, 12 and 13. Index 14 is the boundary, so the array needs `14 - 10 = 4` slots.'),
    ],
  },
  {
    ...concept(stem('getbytes'), 'getBytes()', '11', 'Convert', 'String → byte array'),
    blocks: [
      P([
        'The `getBytes()` method converts a String into a byte array. A byte stores a numerical value, so each character becomes its numeric ASCII/Unicode byte value.',
      ]),
      FORMULA('byte[] arr = s.getBytes();', 'The array holds numbers, not printable characters.'),
      CODE('From the notes', 'String s = "ABC";\nbyte[] arr = s.getBytes();\nfor (int i = 0; i < arr.length; i++) {\n  System.out.println(arr[i]);\n}\n// Output: 65, 66, 67'),
      TABLE(['Character', 'Byte value', 'Meaning'], [
        ['A', '65', 'ASCII code for A'],
        ['B', '66', 'ASCII code for B'],
        ['C', '67', 'ASCII code for C'],
      ]),
      EXAMPLE('Token numbers, not token names', 'The counter can write names (“ABC”) or the numbers behind them (65, 66, 67). `getBytes()` chooses the numeric form.', ['Each character becomes a byte value', 'The result is byte[]', 'Printing the array elements shows numbers']),
    ],
  },
  {
    ...concept(stem('tochararray'), 'toCharArray()', '12', 'Convert', 'String → char array'),
    blocks: [
      P([
        '`toCharArray()` converts a String into an array of characters. Unlike `getBytes()`, the array still holds readable characters rather than numeric byte values.',
      ]),
      FORMULA('char[] array = string.toCharArray();', 'One array element per character.'),
      CODE('From the notes', 'String s = "Hello";\nchar[] arr = s.toCharArray();\nfor (int i = 0; i < arr.length; i++) {\n  System.out.println(arr[i]);\n}\n// Output: H e l l o'),
      DIAGRAM('mermaid', 'java-extract-flow', 'Choose the extraction or conversion method by the answer you need.'),
      TABLE(['Method', 'Returns', 'Use when'], [
        ['charAt(index)', 'char', 'You need one position'],
        ['getChars(...)', 'void; fills char[]', 'You need a chosen range'],
        ['getBytes()', 'byte[]', 'You need numeric byte values'],
        ['toCharArray()', 'char[]', 'You need every character'],
      ]),
      EXAMPLE('Dosa order slip', 'To read “dosa” one letter at a time, convert it with `toCharArray()` and walk the array. To check only the third letter, use `charAt(2)`.', ['Array length equals String length', 'Characters stay printable', 'A loop prints each element']),
    ],
  },
  {
    ...concept(stem('mutable'), 'Mutable alternatives', '13', 'Introduction only', 'StringBuffer & StringBuilder'),
    blocks: [
      P([
        'The introduction to the notes says that when a String must be modified frequently, Java provides `StringBuffer` and `StringBuilder`. Their contents can be changed after creation, unlike a `String`.',
      ]),
      DIAGRAM('graphviz', 'java-string-class', 'All three classes belong to java.lang.'),
      TABLE(['Class', 'Contents after creation', 'What the notes say'], [
        ['String', 'Immutable', 'Operations create a new object'],
        ['StringBuffer', 'Mutable', 'Provided for frequent modification'],
        ['StringBuilder', 'Mutable', 'Provided for frequent modification'],
      ], 'No method lists or examples for the mutable classes appear in the supplied notes.'),
      CALLOUT('Boundary', 'This page is only an introduction. The methods of `StringBuffer` and `StringBuilder` are outside the supplied Module 4 notes, so they are not invented here.'),
    ],
  },
  {
    ...concept(stem('scenarios'), 'Scenario lab', '14', 'Apply it', 'Choose the right String tool'),
    blocks: [
      P(['Each canteen task maps to one small part of the notes. Pick the method before reading the badge.']),
      CARDS([
        { title: 'Idli count label', text: 'Need "Idlis: 25" from a number: "Idlis: " + 25 or String.valueOf(25).', badge: 'join / convert' },
        { title: 'Name from tiles', text: 'Have char[] letters: new String(letters) makes the String.', badge: 'constructor' },
        { title: 'Coffee order length', text: 'Count every letter, space and digit in "filter coffee": length().', badge: 'length()' },
        { title: 'Take "Progr"', text: 'Copy the first five letters of "Programming": getChars(0, 5, arr, 0).', badge: 'getChars()' },
        { title: 'Print token codes', text: 'Turn "ABC" into 65, 66, 67: getBytes().', badge: 'getBytes()' },
        { title: 'Walk "vada"', text: 'Read each letter into an array: toCharArray(), or check one letter with charAt().', badge: 'extract' },
      ]),
      STEPS('A simple decision path', [
        { title: 'Do you need text from a value?', text: 'Use String.valueOf() or + with an existing string.' },
        { title: 'Do you need the size?', text: 'Call length(); spaces and digits count too.' },
        { title: 'Do you need part of the text?', text: 'One character → charAt(); a range → getChars().' },
        { title: 'Do you need an array?', text: 'Numbers → getBytes(); characters → toCharArray().' },
      ]),
      CALLOUT('Remember', 'Every operation that appears to “modify” a String actually produces a new String object; the reference then points to that new object.'),
    ],
  },
  {
    ...concept(stem('quiz'), 'Knowledge check', '15', 'Quiz', 'Mix and match String Handling'),
    blocks: [{ t: 'quiz' }],
  },
];

const quiz = [
  { q: 'In Java, a String is represented as an object of which class?', options: ['char[]', 'String', 'StringBuffer only', 'java.lang.Object[]'], answer: 1, why: 'The notes say strings are objects of the String class in java.lang.String.' },
  { q: 'What happens when you run String s = "Java"; s = s + " Programming";?', options: ['"Java" is edited in place', 'A new String is created and s points to it', 'The program fails', 'A char array is returned'], answer: 1, why: 'String is immutable, so concatenation creates a new object and the reference moves.' },
  { q: 'Which two mutable classes are introduced in the notes?', options: ['String and char[]', 'StringBuffer and StringBuilder', 'String and byte[]', 'getBytes and getChars'], answer: 1, why: 'The introduction names StringBuffer and StringBuilder as mutable alternatives.' },
  { q: 'Why do String, StringBuffer and StringBuilder need no import?', options: ['They are keywords', 'They belong to java.lang', 'They are arrays', 'They are inside main()'], answer: 1, why: 'All three classes are in java.lang, which is loaded automatically.' },
  { q: 'What does new String(letters, 1, 3) produce from {H, e, l, l, o}?', options: ['"Hello"', '"ell"', '"Hell"', '"llo"'], answer: 1, why: 'Start at index 1 and take 3 characters: e, l, l.' },
  { q: 'What is "Java Programming".length()?', options: ['15', '16', '17', '11'], answer: 1, why: '4 letters + 1 space + 11 letters = 16 characters.' },
  { q: 'What is the output of "four: " + 2 + 2?', options: ['four: 4', 'four: 22', 'four: 2 2', 'An error'], answer: 1, why: 'Evaluation is left to right; after "four: 2", the next 2 is appended as text.' },
  { q: 'What does String.valueOf(true) return?', options: ['A boolean', 'The String "true"', 'The number 1', 'A char array'], answer: 1, why: 'String.valueOf() converts a boolean value into its String form.' },
  { q: 'What does "Java".charAt(3) return?', options: ['J', 'a at index 3', 'v', 'The length 3'], answer: 1, why: 'Indices start at 0, so index 3 is the fourth character, a.' },
  { q: 'What does s.getChars(0, 5, arr, 0) copy from "Programming"?', options: ['"Progra"', '"Progr"', '"rogram"', '"Programming"'], answer: 1, why: 'srcBegin is included and srcEnd is excluded, so indices 0 to 4 are copied.' },
  { q: 'What does "ABC".getBytes() produce?', options: ['[A, B, C]', '[65, 66, 67]', '["A", "B", "C"]', 'An empty array'], answer: 1, why: 'getBytes() converts characters into numeric byte values: 65, 66 and 67.' },
  { q: 'What does "Hello".toCharArray() return?', options: ['byte[] with 5 values', 'char[] with H, e, l, l, o', 'A single String', 'An int length'], answer: 1, why: 'toCharArray() converts the String into an array of its characters.' },
  { q: 'Which method reads only one character at a known position?', options: ['length()', 'charAt()', 'getBytes()', 'concat()'], answer: 1, why: 'charAt(index) returns the character at that 0-based index.' },
  { q: 'Which method converts an int, double, boolean or char into a String?', options: ['toCharArray()', 'String.valueOf()', 'getChars()', 'length()'], answer: 1, why: 'The notes show String.valueOf() for all four of those input types.' },
];

export const javaModuleIds = ['m4'];

export const javaModules = {
  m4: {
    id: 'm4',
    label: 'Module 4 · String Handling',
    summary: 'String immutability, constructors, length, literals, concatenation, conversion and character extraction from the supplied Java notes.',
    mindmap,
    branchColours,
    icons,
    glossary,
    questions,
    concepts,
    quiz,
  },
};
