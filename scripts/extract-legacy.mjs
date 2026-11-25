/**
 * One-off migration helper: turns the proven single-file explainer into
 * React content modules and a mountable controller.
 *
 * Run from this project: node scripts/extract-legacy.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const LEGACY = '/Users/ravi/projects/explainer/index.html';
const ROOT = path.resolve(import.meta.dirname, '..');
const html = fs.readFileSync(LEGACY, 'utf8');

// Content is now maintained in React (see src/content and src/legacy). Re-running
// this one-off migration would overwrite the PDF enrichment and quiz bank.
const generated = [
  'src/styles.css',
  'src/content/sections.js',
  'src/legacy/explainer.js',
  'src/sections/index.js',
];
if (!process.argv.includes('--force') && generated.some((file) => fs.existsSync(path.join(ROOT, file)))) {
  console.error('Migration output already exists. Pass --force only if you intend to overwrite React edits.');
  process.exit(1);
}

/* ---------- 1. styles ---------- */
const css = html.match(/<style>\n([\s\S]*?)\n<\/style>/)[1];
fs.mkdirSync(path.join(ROOT, 'src'), { recursive: true });
fs.writeFileSync(
  path.join(ROOT, 'src/styles.css'),
  '/* Ported from the original explainer; see /Users/ravi/projects/explainer/index.html */\n' +
    css +
    '\n' +
    '\n/* React shell additions */\n' +
    '.breadcrumb { display:flex; flex-wrap:wrap; gap:6px; align-items:center; font-size:11px; color:#73839c; margin-bottom:10px; }\n' +
    '.breadcrumb b { color:var(--accent); font-weight:600; }\n' +
    '.side-group { margin-bottom:14px; }\n' +
    '.side-group-title { padding:4px 11px; font-size:10px; text-transform:uppercase; letter-spacing:1.4px; color:#63738e; }\n' +
    '.nav-sub { padding:1px 0 0 18px; }\n' +
    '.side-foot { display:flex; flex-direction:column; gap:8px; }\n' +
    '.side-foot button { width:100%; }\n' +
    '.section-body > :first-child { margin-top:0; }\n' +
    '.diagram-slot { display:block; min-height:10px; }\n'
);

/* ---------- 2. section markup with diagram slots ---------- */
const sectionRe = /<section id="([^"]+)"([^>]*)>([\s\S]*?)<\/section>/g;
const sections = {};
let m;
while ((m = sectionRe.exec(html))) {
  let body = m[3]
    .replace(/<img id="cow-img"[^>]*\/>/, '<div id="cow-img"><!--DIAGRAM:cow-shared--></div>')
    .replace(/<svg id="th-chart"[^>]*><\/svg>/, '<!--DIAGRAM:thrashing-chart-->')
    .replace(/<div id="ptab-diagram"><\/div>/, '<div id="ptab-diagram"><!--DIAGRAM:ptab-hier--></div>')
    .replace(/<img[^>]+src="diagrams\/([^"]+)\.png"[^>]*\/>/g, '<!--DIAGRAM:$1-->');
  sections[m[1]] = { attrs: m[2].trim(), body };
}
const ids = Object.keys(sections);
fs.mkdirSync(path.join(ROOT, 'src/content'), { recursive: true });
fs.writeFileSync(
  path.join(ROOT, 'src/content/sections.js'),
  '/* Static markup from the original explainer. Diagrams are React components. */\n' +
    'export const sections = ' +
    JSON.stringify(sections, null, 2) +
    ';\n' +
    'export const sectionIds = ' +
    JSON.stringify(ids) +
    ';\n'
);

/* ---------- 3. React section components ---------- */
const componentDir = path.join(ROOT, 'src/sections');
fs.mkdirSync(componentDir, { recursive: true });
const names = [];
for (const id of ids) {
  const name = id
    .split('-')
    .map((s) => s[0].toUpperCase() + s.slice(1))
    .join('') + 'Section';
  names.push(name);
  fs.writeFileSync(
    path.join(componentDir, name + '.jsx'),
    `import RenderSection from './RenderSection.jsx';\n\n` +
      `/** ${id} — content is data-driven so new concepts can be added without touching navigation. */\n` +
      `export default function ${name}() {\n` +
      `  return <RenderSection id="${id}" />;\n` +
      `}\n`
  );
}
fs.writeFileSync(
  path.join(componentDir, 'index.js'),
  names.map((n) => `import ${n} from './${n}.jsx';`).join('\n') +
    '\n\n' +
    'export const sectionComponents = [\n' +
    names.map((n, i) => `  { id: '${ids[i]}', Component: ${n} },`).join('\n') +
    '\n' +
    '];\n'
);

/* ---------- 4. mountable controller ---------- */
let script = html.match(/<script>([\s\S]*?)<\/script>/)[1];

// Navigation and scroll progress are owned by React now.
script = script.replace(
  /\/\* ---------- nav \+ scroll progress ---------- \*\/[\s\S]*?(?=\/\* ================= 1b\.)/,
  ''
);

// Native diagrams replace image swapping; announce state changes instead.
script = script.replace(
  /\$\('cow-img'\)\.src = cowCopied[\s\S]*?pulse\(\$\('cow-img'\), 'flash', 600\);/,
  "window.dispatchEvent(new CustomEvent('cow:state', { detail: { copied: cowCopied } }));\n  pulse($('cow-img'), 'flash', 600);"
);
script = script.replace(
  /\$\('ptab-diagram'\)\.innerHTML = `<div class="diagram"><img src="\$\{src\}" alt="\$\{alt\}" \/><\/div>`;/,
  "window.dispatchEvent(new CustomEvent('ptab:kind', { detail: kind }));"
);
script = script.replace(
  /  const x0=48[\s\S]*?TH\.prev = \[mx,my\];/,
  "  const u = thUtil(m,f,w);\n  window.dispatchEvent(new CustomEvent('th:data', { detail: { f, w, m, u } }));"
);
script = script.replace(
  /(const start = Math\.max\(0, locIdx-w\+1\), ws = \[\.\.\.new Set\(LOC_REFS\.slice\(start, locIdx\+1\)\)\]\.sort\(\(a,b\)=>a-b\);)/,
  "$1\n  window.dispatchEvent(new CustomEvent('loc:data', { detail: { refs: LOC_REFS, index: locIdx, window: w, pages: ws } }));"
);

// Any remaining image references must work under a GitHub Pages sub-path.
script = script.replace(/'diagrams\/([^']+)'/g, (_, file) => `asset('diagrams/${file}')`);

// Track every listener and timer so React can clean up on unmount.
script = script.replace(/\$\('motion-toggle'\)\.addEventListener\(/g, "listen($('motion-toggle'), ");
script = script.replace(/\$\('([^']+)'\)\.addEventListener\(/g, "listen($('$1'), ");
script = script.replace(/\$\(id\)\.addEventListener\(/g, 'listen($(id), ');
script = script.replace(/\bwindow\.addEventListener\(/g, 'listen(window, ');
script = script.replace(/\bb\.addEventListener\(/g, 'listen(b, ');
script = script.replace(/setTimeout\(/g, 'timer(');
script = script.replace(/setInterval\(/g, 'interval(');

const header = `/**
 * Interactive controller ported from the original index.html.
 * Mount it once, after the section markup is in the DOM.
 */
export function mountExplainer() {
  const asset = (p) => \`\${import.meta.env.BASE_URL}\${p}\`;
  const disposers = [];
  const listen = (el, type, fn, opts) => {
    el.addEventListener(type, fn, opts);
    disposers.push(() => el.removeEventListener(type, fn, opts));
  };
  const timer = (fn, ms) => { const id = setTimeout(fn, ms); disposers.push(() => clearTimeout(id)); return id; };
  const interval = (fn, ms) => { const id = setInterval(fn, ms); disposers.push(() => clearInterval(id)); return id; };

`;
const footer = `
  return () => {
    disposers.forEach((off) => off());
    if (RP.timer) clearInterval(RP.timer);
  };
}
`;
fs.mkdirSync(path.join(ROOT, 'src/legacy'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'src/legacy/explainer.js'), header + script + footer);

console.log('Extracted', ids.length, 'sections:', ids.join(', '));
