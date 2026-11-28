# VTU Explainer — Semester 3

A static React app that turns the original single-file memory-management explainer into an extensible course site. It now covers **Operating Systems · Module 4** and all four modules of **Data Structures** from `DSA_NOTES.pdf`, with easy South Indian examples throughout. Navigation is organised as **Semester → Subject → Module → Concept**, so more VTU subjects and concepts can be added without rewriting the shell.

## Diagram stack

All four tools are used, each for what it does best:

| Tool | Used for | Source |
|---|---|---|
| React + CSS | Animated OS stages plus data-driven DSA stages (classification, array cells, stacks, queues, shared array, polynomial terms, tree levels) | `src/diagrams/ReactStages.jsx`, `src/components/DsaLesson.jsx` |
| Mermaid | OS flows and DSA flows (DMA, insertion/radix sort, infix→postfix, postfix evaluation, traversal, BST search) | `src/diagrams/MermaidDiagram.jsx` |
| Graphviz (`@viz-js/viz` WASM) | Structured OS diagrams plus DSA pointer chains, row-major mapping, circular queues/lists, SLL/DLL, trees and threads | `src/diagrams/GraphvizDiagram.jsx` |
| D3 | Per-subject zoom/pan mind maps with branch icons, colours, hover tooltips and click-through section links, plus OS data charts | `src/diagrams/D3Charts.jsx` |

No PNGs are shipped. Mermaid and Graphviz compute label-aware layouts, so text no longer overlaps the way it did in the screenshot-based diagrams. Graphviz SVGs render at their natural size (instead of being stretched to the column width) with extra node margin, so labels stay at a readable 11px with padding inside each shape. Mermaid flowcharts also keep their natural size; wide horizontal flows scroll inside their card instead of shrinking labels to unreadable sizes. Narrow screens collapse fixed-width grids and stage layouts so sections no longer spill out. The old PNG generator is kept at `scripts/generate-diagrams.js` as a reference/fallback (`npm run diagrams` writes to `reference-diagrams/`, ignored by git).

The app uses a light theme (`src/theme-light.css`) with high-contrast dark body text; it also restyles Mermaid, Graphviz and D3 outputs.

## PDF coverage audit

Every bullet in `OS_Module4.pdf` is mapped to a concept. Gaps found in the first migration were filled directly in the React content:

| PDF topic now explicit | Where |
|---|---|
| Logical vs physical address space, MMU, relocation-register example (14000 + 346) | §04 Big picture — *Logical vs physical address space* card |
| Contiguous allocation mapping/protection, dispatcher loading base/limit, transient OS code | §08 Contiguous allocation — *Contiguous allocation in practice* card |
| Swapping ready queue and transfer-time constraint | §06 Loading, linking & swapping — *Swapping details* card |
| TLB benefits/costs, wired entries, ASID | §10 TLB — *Why TLBs matter* card |
| Virtual memory benefits, virtual address space, pager vs swapper, pure demand paging | §12 Virtual memory — *Virtual memory at a glance* card |
| Six page-fault handling steps | §12 — ordered walkthrough |
| Page replacement sequence and count-based LFU/MFU rationale | §13 — *The replacement sequence* and *Count-based policies* cards |
| Working set example `{1,2,5,6,7}` → `{3,4}` and balance set | §15 Thrashing — *Working set and balance set* card |
| Extra worked problems 7–14 | §16 Practice (relocation, allocation strategies, segmentation, working set, frame allocation, page tables, TLB, dirty bit) |

The module now opens with an **illustrated D3 mind map** (§01) that uses custom SVG icons and branch colours, and supports drag-to-pan, wheel/pinch zoom, zoom buttons and brief hover/focus tooltips, followed by a **glossary** (§02) of 24 key terms such as *contiguous* and **conceptual questions** (§03) with 15 explanation-style prompts to keep beside you while you read. The randomised knowledge check stays last.

`src/content/quiz.js` expands the original 10-question check to **107 questions**, each with an explanatory answer, covering all of the above. The question order is shuffled with Fisher–Yates on every page load, while correct options stay balanced across A–D.

## Data Structures coverage

`DSA_NOTES.pdf` is organised into four modules, and each module gets the same learning spine: mind map → glossary → conceptual questions → detailed concepts → scenario lab → quiz.

| Module | Concepts | What is covered |
|---|---:|---|
| M1 · Arrays, Pointers & Sorting | 16 | Definitions and operations, pointers and pointer-to-pointer, DMA (`malloc`/`calloc`/`realloc`/`free`), static/dynamic arrays, row- and column-major matrices, structures/unions, polynomials, sparse triplets, strings, insertion sort, radix sort and a scenario lab |
| M2 · Stacks, Queues & Expressions | 14 | LIFO stacks, overflow/underflow, ISP/ICP infix→postfix conversion, postfix evaluation, FIFO queues, circular queues, priority queues, deques, two stacks/two queues in one array and a scenario lab |
| M3 · Linked Lists | 14 | SLL operations, header nodes, ordered lists, circular lists with `last`, polynomial addition, DLLs, sparse-matrix row chains and classic placement-style scenario prompts |
| M4 · Trees | 12 | Tree terminology and LCRS, full/complete/perfect/skewed binary trees, array and linked representations, four traversals, threaded trees, BST search/insert/delete, selection trees, forests and worked reconstruction hints |

Each module has a 20-term glossary, 10 conceptual questions and a 10-question randomised quiz with explanations. Examples use familiar settings such as idli plates, filter-coffee strings, railway ticket queues, monsoon sensor grids and bus-stand rings so the structure is understood before the C syntax.

## Run locally

```bash
npm install
npm run dev
```

Production build and preview:

```bash
npm run build
npm run preview
```

## Project structure

- `src/content/catalog.js` — semester/subject/module/concept tree and hash-route helpers.
- `src/content/sections.js` — OS lesson markup extracted from the proven original page, then enriched from `OS_Module4.pdf`.
- `src/content/quiz.js` — 107-question OS bank with feedback for every PDF topic.
- `src/content/dsa.js` — all four Data Structures modules: concepts, diagrams, glossary, prompts and quiz banks.
- `src/sections/` — one React component per OS concept, rendered by `RenderSection.jsx`.
- `src/components/DsaLesson.jsx` — data-driven renderer for DSA concepts, steppers and quizzes.
- `src/legacy/explainer.js` — the original OS simulations and animations, mounted only on OS routes with listener/timer cleanup.
- `src/diagrams/` — all diagram components and their styles.
- `src/App.jsx` — sidebar, breadcrumb, progress bar, subject-aware routing, and controller lifecycle.
- `.github/workflows/deploy.yml` — GitHub Pages build/deploy workflow.

Diagram state changes from the simulations are announced as DOM events (`th:data`, `loc:data`, `ptab:kind`, `cow:state`) so the D3/Graphviz/Mermaid components stay in sync without coupling them to the controller.

## Adding a concept

For OS:

1. Add a `{ id, label, number }` entry to the right module's `concepts` array in `src/content/catalog.js`.
2. Add the matching section markup to `src/content/sections.js`. (`npm run extract:legacy` is a one-off migration helper; it refuses to overwrite React edits unless you pass `--force`.)
3. Add a wrapper component in `src/sections/` and export it from `src/sections/index.js`.
4. If the concept needs simulation logic, add it to `src/legacy/explainer.js` and return a cleanup for any listeners/timers.
5. If it needs a figure, add it to `src/diagrams/index.jsx` and implement it in the relevant diagram component.

For Data Structures, add the concept and its blocks to the relevant module in `src/content/dsa.js`; the catalog, sidebar, renderer and mind map links are generated automatically. Available block types are `p`, `list`, `cards`, `table`, `diagram`, `steps`, `code`, `callout`, `example`, `formula`, `mindmap`, `glossary`, `questions` and `quiz`.

Routing is hash-based (`#/s3/os/m4/<concept>` or `#/s3/ds/m2/dsa-m2-stacks`), so GitHub Pages needs no server rewrites.

## Verification

The repo includes two Chrome DevTools Protocol helpers:

```bash
npm run build
npm run preview
# in another terminal, with Chrome running on --remote-debugging-port=9222:
node scripts/check-layout.mjs   # reports diagram text outside its box or overlapping
node scripts/smoke-test.mjs     # clicks through key simulations; expects 26/26
```

Current results: **19 OS diagrams + 7–9 DSA diagrams per module, 0 layout issues from 320px to 1440px, 26/26 interaction checks, 0 runtime exceptions**. Verified values include both D3 mind maps (zoom, tooltips and section links), glossary and conceptual-prompt counts, FIFO/LRU/OPT behaviour, TLB EAT `140.0 ns`, fragmentation allocation, base/limit and segment traps, copy-on-write state switching, replacement stepping, OS and DSA quiz feedback, and subject/module routing. The OS knowledge check serves **107 questions**; every DSA module has its own 10-question randomised check.

## Deploying to GitHub Pages

The app is published at **https://ravihamsa.github.io/vtu-cse-explainer/** from `https://github.com/ravihamsa/vtu-cse-explainer`.

1. The repo is connected to `main`; every push deploys automatically.
2. Pages uses **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. The workflow builds with `VITE_BASE_PATH=/<repo-name>/`, so assets work under the Pages sub-path. For a custom domain, set `VITE_BASE_PATH=/` in the workflow and add your `CNAME` record.
