# VTU Explainer — Operating Systems (Sem 3)

A static React app that turns the original single-file memory-management explainer into an extensible course site. Navigation is organised as **Semester → Subject → Module → Concept**, so more VTU subjects and concepts can be added without rewriting the shell.

## Diagram stack

All four tools are used, each for what it does best:

| Tool | Used for | Source |
|---|---|---|
| React + CSS | Animated textbook stages (hierarchy, base/limit, binding, swapping, page faults, fragmentation, paging hardware) | `src/diagrams/ReactStages.jsx` |
| Mermaid | Flow diagrams (replacement policy, thrashing cycle, copy-on-write states, allocation, NUMA) | `src/diagrams/MermaidDiagram.jsx` |
| Graphviz (`@viz-js/viz` WASM) | Structured node diagrams (hierarchical/hashed/inverted page tables, segmentation, shared pages, TLB) | `src/diagrams/GraphvizDiagram.jsx` |
| D3 | Data charts (CPU utilisation curve, working-set timeline) | `src/diagrams/D3Charts.jsx` |

No PNGs are shipped. Mermaid and Graphviz compute label-aware layouts, so text no longer overlaps the way it did in the screenshot-based diagrams. Graphviz SVGs render at their natural size (instead of being stretched to the column width) with extra node margin, so labels stay at a readable 11px with padding inside each shape. The old PNG generator is kept at `scripts/generate-diagrams.js` as a reference/fallback (`npm run diagrams` writes to `reference-diagrams/`, ignored by git).

The app uses a light theme (`src/theme-light.css`) with high-contrast dark body text; it also restyles Mermaid, Graphviz and D3 outputs.

## PDF coverage audit

Every bullet in `OS_Module4.pdf` is mapped to a concept. Gaps found in the first migration were filled directly in the React content:

| PDF topic now explicit | Where |
|---|---|
| Logical vs physical address space, MMU, relocation-register example (14000 + 346) | §01 Big picture — *Logical vs physical address space* card |
| Contiguous allocation mapping/protection, dispatcher loading base/limit, transient OS code | §04 Contiguous allocation — *Contiguous allocation in practice* card |
| Swapping ready queue and transfer-time constraint | §03 Loading, linking & swapping — *Swapping details* card |
| TLB benefits/costs, wired entries, ASID | §06 TLB — *Why TLBs matter* card |
| Virtual memory benefits, virtual address space, pager vs swapper, pure demand paging | §08 Virtual memory — *Virtual memory at a glance* card |
| Six page-fault handling steps | §08 — ordered walkthrough |
| Page replacement sequence and count-based LFU/MFU rationale | §09 — *The replacement sequence* and *Count-based policies* cards |
| Working set example `{1,2,5,6,7}` → `{3,4}` and balance set | §11 Thrashing — *Working set and balance set* card |
| Extra worked problems 7–14 | §12 Practice (relocation, allocation strategies, segmentation, working set, frame allocation, page tables, TLB, dirty bit) |

`src/content/quiz.js` expands the original 10-question check to **107 questions**, each with an explanatory answer, covering all of the above. The question order is shuffled with Fisher–Yates on every page load, while correct options stay balanced across A–D.

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
- `src/content/sections.js` — lesson markup extracted from the proven original page, then enriched from `OS_Module4.pdf`.
- `src/content/quiz.js` — 107-question bank with feedback for every PDF topic.
- `src/sections/` — one React component per concept, rendered by `RenderSection.jsx`.
- `src/legacy/explainer.js` — the original simulations and animations, mounted by a React effect with listener/timer cleanup.
- `src/diagrams/` — all diagram components and their styles.
- `src/App.jsx` — sidebar, breadcrumb, progress bar, routing, and controller lifecycle.
- `.github/workflows/deploy.yml` — GitHub Pages build/deploy workflow.

Diagram state changes from the simulations are announced as DOM events (`th:data`, `loc:data`, `ptab:kind`, `cow:state`) so the D3/Graphviz/Mermaid components stay in sync without coupling them to the controller.

## Adding a concept

1. Add a `{ id, label, number }` entry to the right module's `concepts` array in `src/content/catalog.js`.
2. Add the matching section markup to `src/content/sections.js`. (`npm run extract:legacy` is a one-off migration helper; it refuses to overwrite React edits unless you pass `--force`.)
3. Add a wrapper component in `src/sections/` and export it from `src/sections/index.js`.
4. If the concept needs simulation logic, add it to `src/legacy/explainer.js` and return a cleanup for any listeners/timers.
5. If it needs a figure, add it to `src/diagrams/index.jsx` and implement it in the relevant diagram component.

Routing is hash-based (`#/s3/os/m4/<concept>`), so GitHub Pages needs no server rewrites.

## Verification

The repo includes two Chrome DevTools Protocol helpers:

```bash
npm run build
npm run preview
# in another terminal, with Chrome running on --remote-debugging-port=9222:
node scripts/check-layout.mjs   # reports diagram text outside its box or overlapping
node scripts/smoke-test.mjs     # clicks through key simulations; expects 13/13
```

Current results: **18 native diagrams, 0 layout issues, 13/13 interaction checks, 0 runtime exceptions**. Verified values include FIFO/LRU/OPT behaviour, TLB EAT `140.0 ns`, fragmentation allocation, base/limit and segment traps, copy-on-write state switching, replacement stepping, and quiz feedback. The knowledge check now serves **107 questions** spanning every topic in the PDF.

## Deploying to GitHub Pages

1. Create a GitHub repository (for example `vtu-explainer`) and push this folder to its `main` branch.
2. In the repo, go to **Settings → Pages → Build and deployment**, set **Source** to **GitHub Actions**.
3. The workflow builds with `VITE_BASE_PATH=/<repo-name>/`, so assets work under the Pages sub-path.
4. Every push to `main` deploys automatically. For a custom domain, set `VITE_BASE_PATH=/` in the workflow and add your `CNAME` record.

Publishing needs your GitHub account; there is no authenticated GitHub CLI in this environment, so the remote steps must be run from your machine.
