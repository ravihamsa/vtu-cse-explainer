/*
 * Generates the PNG diagrams used by index.html.
 * Run: node generate_diagrams.js
 * Requires Google Chrome on macOS (used as an SVG -> PNG rasteriser).
 */
const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const OUT = path.join(__dirname, '..', 'reference-diagrams');
const TMP = path.join(OUT, '_src');
fs.mkdirSync(TMP, { recursive: true });

const C = {
  bg: '#111a2b', panel: '#172136', border: '#34435f', text: '#e8eefb', muted: '#94a3bb',
  teal: '#5eead4', violet: '#a78bfa', amber: '#fbbf24', rose: '#fb7185', green: '#4ade80'
};
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const txt = (x,y,s,o={}) => `<text x="${x}" y="${y}" fill="${o.color||C.text}" font-size="${o.size||20}" font-family="${o.mono?'Menlo, Consolas, monospace':'system-ui, -apple-system, sans-serif'}" font-weight="${o.weight||'400'}" text-anchor="${o.anchor||'start'}">${esc(s)}</text>`;
const rect = (x,y,w,h,fill,stroke=C.border,r=12,extra='') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="2" ${extra}/>`;
const line = (x1,y1,x2,y2,color=C.border,w=2,extra='') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${w}" ${extra}/>`;
const arrow = (x1,y1,x2,y2,color=C.teal,w=3) => `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${color}" stroke-width="${w}" fill="none" marker-end="url(#arw-${color.slice(1)})"/>`;
const defs = Object.values(C).filter(v=>v.startsWith('#')).map(v=>`<marker id="arw-${v.slice(1)}" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0 0 L9 4.5 L0 9 z" fill="${v}"/></marker>`).join('');
const hatch = `<pattern id="hatch" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="12" height="12" fill="#1b2537"/><line x1="0" y1="0" x2="0" y2="12" stroke="${C.amber}" stroke-width="5" opacity=".65"/></pattern>`;
const box = (x,y,w,h,title,sub,color,r=14) =>
  rect(x,y,w,h,'#162034',color,r) +
  txt(x+w/2,y+38,title,{size:22,anchor:'middle',weight:'600',color}) +
  (sub ? txt(x+w/2,y+66,sub,{size:15,anchor:'middle',color:C.muted,mono:true}) : '');

function svg(w,h,body){
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs>${defs}${hatch}</defs><rect width="${w}" height="${h}" fill="${C.bg}"/>${body}</svg>`;
}
function render(name,w,h,body){
  // Chrome chooses a parser from the file extension: .svg forces XML parsing,
  // which rejects the HTML wrapper. Use .html so the inline SVG renders properly.
  const srcPath = path.join(TMP, name + '.html');
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;padding:0;overflow:hidden;background:${C.bg}}</style></head><body>${svg(w,h,body)}</body></html>`;
  fs.writeFileSync(srcPath, html);
  cp.execFileSync(CHROME, ['--headless','--disable-gpu','--no-sandbox','--hide-scrollbars',
    '--force-device-scale-factor=2', `--window-size=${w},${h}`, `--screenshot=${path.join(OUT,name+'.png')}`,
    `file://${srcPath}`], { stdio:'ignore' });
  console.log('✓', name + '.png');
}

/* 1 — memory hierarchy */
render('hierarchy',1200,360,`
  ${txt(40,42,'A read cascades down the hierarchy',{size:27,weight:'600'})}
  ${box(40,90,250,150,'REGISTERS','~0.3 ns',C.teal)}
  ${box(335,90,250,150,'L1 / L2 CACHE','~1–10 ns',C.teal)}
  ${box(630,90,250,150,'MAIN MEMORY','~100 ns',C.violet)}
  ${box(925,90,235,150,'SSD / DISK','~100 µs',C.rose)}
  ${arrow(295,165,330,165,C.muted)} ${arrow(590,165,625,165,C.muted)} ${arrow(885,165,920,165,C.rose)}
  ${txt(312,148,'miss',{size:13,color:C.muted,anchor:'middle'})}
  ${txt(607,148,'miss',{size:13,color:C.muted,anchor:'middle'})}
  ${txt(902,148,'fault',{size:13,color:C.rose,anchor:'middle'})}
  ${txt(40,300,'Each level is slower but larger. A page fault costs ~300,000× a register access.',{size:17,color:C.muted})}
`);

/* 2 — base and limit registers */
render('base-limit',1200,320,`
  ${txt(40,42,'Hardware address protection',{size:27,weight:'600'})}
  ${rect(40,80,1120,95,'#162034',C.border,10)}
  ${rect(40,80,280,95,'#202a3d',C.border,10)}
  ${rect(320,80,560,95,'rgba(94,234,212,.16)',C.teal,0)}
  ${rect(880,80,280,95,'rgba(251,113,133,.08)',C.rose,0)}
  ${txt(180,137,'OPERATING SYSTEM',{size:19,anchor:'middle',color:C.muted})}
  ${txt(600,130,'LEGAL PROCESS RANGE',{size:21,anchor:'middle',weight:'600',color:C.teal})}
  ${txt(600,158,'base ≤ address < base + limit',{size:15,anchor:'middle',color:C.muted,mono:true})}
  ${txt(1020,137,'ILLEGAL / OTHER USERS',{size:16,anchor:'middle',color:C.rose})}
  ${line(320,180,320,222,C.teal,2)} ${line(880,180,880,222,C.teal,2)}
  ${arrow(320,214,880,214,C.teal,2)} ${arrow(880,214,320,214,C.teal,2)}
  ${txt(320,250,'base register',{size:16,anchor:'middle',color:C.teal,mono:true})}
  ${txt(880,250,'base + limit',{size:16,anchor:'middle',color:C.teal,mono:true})}
  ${txt(40,295,'legal if  base ≤ address < base + limit   ·   only kernel mode can load these registers',{size:15,color:C.muted,mono:true})}
`);

/* 3 — address binding pipeline */
render('binding',1200,330,`
  ${txt(40,42,'Address binding: symbolic → physical',{size:27,weight:'600'})}
  ${box(30,100,250,140,'SOURCE','symbolic name',C.violet)}
  ${box(320,100,250,140,'COMPILER','relocatable address',C.amber)}
  ${box(610,100,250,140,'LOADER','absolute address',C.teal)}
  ${box(900,100,270,140,'MMU / RUNTIME','physical address',C.green)}
  ${arrow(285,170,315,170,C.muted)} ${arrow(575,170,605,170,C.muted)} ${arrow(865,170,895,170,C.muted)}
  ${txt(40,290,'compile time → load time → execution time   ·   processes waiting on disk form the input queue',{size:16,color:C.muted,mono:true})}
`);

/* 4 — swapping */
render('swap',1200,420,`
  ${txt(40,42,'Swapping: memory ↔ backing store',{size:27,weight:'600'})}
  ${rect(40,90,420,250,'#162034',C.border,14)}
  ${txt(250,125,'MAIN MEMORY',{size:19,anchor:'middle',color:C.teal,weight:'600'})}
  ${rect(70,150,150,60,'rgba(94,234,212,.16)',C.teal,10)}
  ${rect(240,150,190,60,'#202a3d',C.border,10)}
  ${txt(250,270,'resident processes',{size:15,anchor:'middle',color:C.muted})}
  ${rect(740,90,420,250,'#162034',C.border,14)}
  ${txt(950,125,'BACKING STORE (DISK)',{size:19,anchor:'middle',color:C.rose,weight:'600'})}
  ${rect(770,150,150,60,'#202a3d',C.border,10)}
  ${rect(940,150,190,60,'rgba(251,113,133,.12)',C.rose,10)}
  ${txt(950,270,'swapped-out images',{size:15,anchor:'middle',color:C.muted})}
  ${arrow(480,190,715,190,C.amber,4)} ${arrow(715,250,480,250,C.teal,4)}
  ${txt(600,172,'swap out',{size:15,anchor:'middle',color:C.amber})}
  ${txt(600,282,'swap in',{size:15,anchor:'middle',color:C.teal})}
  ${txt(40,380,'Roll out / roll in for priority scheduling · never swap a process with pending I/O',{size:16,color:C.muted})}
`);

/* 5 — fragmentation */
render('fragmentation',1200,470,`
  ${txt(40,40,'Internal vs external fragmentation',{size:27,weight:'600'})}
  ${txt(40,85,'FIXED BLOCKS — internal waste',{size:17,color:C.amber,weight:'600'})}
  ${rect(40,100,1100,80,'#162034',C.border,10)}
  ${rect(40,100,250,80,'rgba(94,234,212,.2)',C.teal,0)}
  ${rect(290,100,250,80,'rgba(94,234,212,.2)',C.teal,0)}
  ${rect(540,100,250,80,'rgba(94,234,212,.2)',C.teal,0)}
  ${rect(790,100,350,80,'rgba(94,234,212,.2)',C.teal,0)}
  ${rect(925,100,215,80,'url(#hatch)',C.amber,0)}
  ${txt(165,148,'P1',{size:19,anchor:'middle',color:C.teal})}
  ${txt(415,148,'P2',{size:19,anchor:'middle',color:C.teal})}
  ${txt(665,148,'P3',{size:19,anchor:'middle',color:C.teal})}
  ${txt(1035,148,'wasted inside block',{size:14,anchor:'middle',color:C.amber})}
  ${txt(40,235,'VARIABLE HOLES — external fragmentation',{size:17,color:C.rose,weight:'600'})}
  ${rect(40,250,1100,80,'#162034',C.border,10)}
  ${rect(40,250,230,80,'rgba(94,234,212,.2)',C.teal,0)}
  ${rect(270,250,140,80,'#1b2537',C.muted,0)}
  ${rect(410,250,300,80,'rgba(94,234,212,.2)',C.teal,0)}
  ${rect(710,250,90,80,'#1b2537',C.muted,0)}
  ${rect(800,250,340,80,'rgba(94,234,212,.2)',C.teal,0)}
  ${txt(155,298,'P1',{size:19,anchor:'middle',color:C.teal})}
  ${txt(340,298,'hole',{size:14,anchor:'middle',color:C.muted})}
  ${txt(560,298,'P2',{size:19,anchor:'middle',color:C.teal})}
  ${txt(755,298,'hole',{size:14,anchor:'middle',color:C.muted})}
  ${txt(970,298,'P3',{size:19,anchor:'middle',color:C.teal})}
  ${arrow(890,350,890,390,C.violet,3)}
  ${txt(950,380,'compact → one large hole',{size:16,anchor:'start',color:C.violet})}
  ${rect(40,405,1100,45,'rgba(167,139,250,.08)',C.violet,8)}
  ${txt(590,435,'First-fit 50% rule: N allocated blocks leave about 0.5N blocks lost to fragmentation',{size:16,anchor:'middle',color:C.violet})}
`);

/* 6 — paging hardware */
render('paging-hardware',1200,420,`
  ${txt(40,42,'Paging hardware: logical → physical',{size:27,weight:'600'})}
  ${txt(40,100,'LOGICAL ADDRESS',{size:16,color:C.violet,weight:'600'})}
  ${rect(40,115,530,70,'rgba(167,139,250,.14)',C.violet,10)}
  ${rect(40,115,300,70,'rgba(167,139,250,.28)',C.violet,0)}
  ${rect(340,115,230,70,'rgba(94,234,212,.18)',C.teal,0)}
  ${txt(190,160,'page number p',{size:19,anchor:'middle',color:C.violet,mono:true})}
  ${txt(455,160,'offset d',{size:19,anchor:'middle',color:C.teal,mono:true})}
  ${txt(40,240,'PAGE TABLE',{size:16,color:C.amber,weight:'600'})}
  ${rect(40,255,220,120,'#162034',C.border,10)}
  ${txt(150,290,'p=0 → f=5',{size:17,anchor:'middle',mono:true,color:C.text})}
  ${txt(150,320,'p=1 → f=6',{size:17,anchor:'middle',mono:true,color:C.text})}
  ${txt(150,350,'p=3 → f=2',{size:17,anchor:'middle',mono:true,color:C.text})}
  ${arrow(190,190,190,250,C.violet)}
  ${arrow(265,315,620,315,C.amber)}
  ${txt(40,420-8,'PHYSICAL ADDRESS = frame × page size + offset',{size:16,color:C.muted,mono:true})}
  ${rect(640,255,520,120,'#162034',C.border,10)}
  ${rect(640,255,300,120,'rgba(94,234,212,.14)',C.teal,0)}
  ${rect(940,255,220,120,'rgba(167,139,250,.12)',C.violet,0)}
  ${txt(790,315,'frame f',{size:19,anchor:'middle',color:C.teal,mono:true})}
  ${txt(1050,315,'offset d',{size:19,anchor:'middle',color:C.violet,mono:true})}
`);

/* 7 — TLB paths */
render('tlb',1200,360,`
  ${txt(40,42,'TLB: address-translation cache',{size:27,weight:'600'})}
  ${box(30,100,230,120,'CPU','page number',C.violet)}
  ${box(350,100,230,120,'TLB','tag → frame',C.teal)}
  ${box(680,50,240,100,'PAGE TABLE','walk on miss',C.amber)}
  ${box(680,190,240,100,'FRAME','physical address',C.green)}
  ${arrow(265,160,345,160,C.violet)}
  ${arrow(585,125,675,100,C.green,3)}
  ${arrow(800,155,800,185,C.teal,3)}
  ${arrow(585,195,675,230,C.amber,3)}
  ${txt(420,88,'HIT  ~120 ns',{size:16,anchor:'middle',color:C.green,mono:true})}
  ${txt(430,320,'MISS  ~220 ns (TLB + page table + memory)',{size:16,color:C.rose,mono:true})}
  ${txt(40,340,'Entries are tag/value pairs searched associatively · 64–1024 entries · ASID protects address spaces',{size:14,color:C.muted})}
`);

/* 8 — shared pages */
render('shared-pages',1200,360,`
  ${txt(40,42,'Shared pages: one copy of pure code',{size:27,weight:'600'})}
  ${txt(40,100,'PROCESS 1 page table',{size:16,color:C.teal,weight:'600'})}
  ${txt(680,100,'PROCESS 2 page table',{size:16,color:C.teal,weight:'600'})}
  ${rect(40,115,330,140,'#162034',C.border,10)}
  ${rect(680,115,330,140,'#162034',C.border,10)}
  ${txt(205,155,'code → frame 5',{size:18,anchor:'middle',mono:true,color:C.teal})}
  ${txt(205,195,'data → frame 9',{size:18,anchor:'middle',mono:true,color:C.violet})}
  ${txt(845,155,'code → frame 5',{size:18,anchor:'middle',mono:true,color:C.teal})}
  ${txt(845,195,'data → frame 12',{size:18,anchor:'middle',mono:true,color:C.violet})}
  ${box(430,135,220,100,'FRAME 5','shared editor code',C.teal)}
  ${arrow(375,155,425,175,C.teal)} ${arrow(675,155,680,175,C.teal)}
  ${txt(600,310,'Re-entrant (non-self-modifying) code can be shared; each process keeps private registers and data.',{size:16,anchor:'middle',color:C.muted})}
`);

/* 9–11 — page table structures */
render('ptab-hier',1200,330,`
  ${txt(40,42,'Two-level (hierarchical) page table',{size:27,weight:'600'})}
  ${rect(40,90,760,70,'rgba(167,139,250,.14)',C.violet,10)}
  ${rect(40,90,250,70,'rgba(167,139,250,.3)',C.violet,0)}
  ${rect(290,90,250,70,'rgba(94,234,212,.2)',C.teal,0)}
  ${rect(540,90,260,70,'rgba(251,191,36,.2)',C.amber,0)}
  ${txt(165,135,'p1 · 10 bits',{size:18,anchor:'middle',mono:true,color:C.violet})}
  ${txt(415,135,'p2 · 10 bits',{size:18,anchor:'middle',mono:true,color:C.teal})}
  ${txt(670,135,'offset · 12 bits',{size:18,anchor:'middle',mono:true,color:C.amber})}
  ${box(60,220,300,80,'OUTER TABLE','indexed by p1',C.violet)}
  ${box(450,220,300,80,'INNER TABLE','indexed by p2',C.teal)}
  ${arrow(370,260,445,260,C.muted)}
  ${txt(830,235,'Forward-mapped: walk',{size:17,color:C.muted})}
  ${txt(830,265,'outer → inner',{size:17,color:C.muted})}
  ${txt(40,315,'Paging the page table keeps each piece small for 32-bit / 4 KB address spaces.',{size:16,color:C.muted})}
`);
render('ptab-hash',1200,330,`
  ${txt(40,42,'Hashed page table',{size:27,weight:'600'})}
  ${box(40,110,260,100,'VIRTUAL PAGE #','hash input',C.violet)}
  ${arrow(305,160,375,160,C.muted)}
  ${box(380,110,230,100,'HASH FUNCTION','bucket index',C.amber)}
  ${arrow(615,160,685,160,C.muted)}
  ${rect(690,90,470,180,'#162034',C.border,10)}
  ${txt(720,125,'bucket',{size:16,color:C.teal,mono:true})}
  ${rect(720,140,410,45,'rgba(94,234,212,.12)',C.teal,8)}
  ${txt(740,170,'[vpn, frame, next]',{size:16,mono:true,color:C.text})}
  ${rect(720,195,410,45,'rgba(94,234,212,.12)',C.teal,8)}
  ${txt(740,225,'[vpn, frame, next] → …',{size:16,mono:true,color:C.text})}
  ${txt(40,305,'Chaining resolves collisions; compare the virtual page number at each node until it matches.',{size:16,color:C.muted})}
`);
render('ptab-inv',1200,330,`
  ${txt(40,42,'Inverted page table',{size:27,weight:'600'})}
  ${box(40,110,300,100,'⟨pid, page #⟩','from virtual address',C.violet)}
  ${arrow(345,160,415,160,C.muted)}
  ${rect(420,90,380,180,'#162034',C.border,10)}
  ${txt(450,125,'one entry per physical frame',{size:15,color:C.muted})}
  ${txt(450,160,'slot 0: ⟨pid, page⟩',{size:17,mono:true,color:C.text})}
  ${txt(450,195,'slot 1: ⟨pid, page⟩',{size:17,mono:true,color:C.text})}
  ${txt(450,230,'…',{size:17,mono:true,color:C.text})}
  ${arrow(805,160,875,160,C.teal)}
  ${box(880,110,280,100,'PHYSICAL ADDRESS','⟨slot i, offset⟩',C.teal)}
  ${txt(40,305,'Less page-table memory, slower search, and difficult shared memory.',{size:16,color:C.muted})}
`);

/* 12 — segmentation */
render('segmentation',1200,420,`
  ${txt(40,42,'Segmentation hardware',{size:27,weight:'600'})}
  ${rect(40,90,480,220,'#162034',C.border,10)}
  ${txt(60,125,'SEGMENT TABLE',{size:16,color:C.violet,weight:'600'})}
  ${txt(60,160,'seg 0   base 5000   limit 1000',{size:16,mono:true,color:C.text})}
  ${txt(60,195,'seg 2   base 4300   limit 400',{size:16,mono:true,color:C.teal})}
  ${txt(60,230,'seg 3   base 3200   limit 700',{size:16,mono:true,color:C.text})}
  ${txt(60,265,'seg 4   base 0     limit 500',{size:16,mono:true,color:C.text})}
  ${rect(570,90,330,70,'rgba(167,139,250,.16)',C.violet,10)}
  ${txt(735,135,'segment #  |  offset d',{size:18,anchor:'middle',mono:true,color:C.violet})}
  ${box(950,90,210,70,'BASE + d','physical address',C.green)}
  ${arrow(905,125,945,125,C.violet)}
  ${rect(570,230,590,80,'rgba(251,113,133,.09)',C.rose,10)}
  ${txt(865,278,'if d ≥ limit → TRAP TO OS',{size:19,anchor:'middle',mono:true,color:C.rose})}
  ${txt(40,370,'Example: segment 2 offset 53 → 4300 + 53 = 4353 · segment 0 offset 1222 → trap',{size:17,color:C.muted})}
`);

/* 13 — page fault flow */
render('page-fault',1200,320,`
  ${txt(40,42,'Six steps of a page fault',{size:27,weight:'600'})}
  ${box(30,90,250,120,'CPU','1 · invalid reference',C.violet)}
  ${box(320,90,250,120,'MMU / OS','2–3 · trap, check',C.amber)}
  ${box(610,90,250,120,'RAM','4 · find free frame',C.teal)}
  ${box(900,90,270,120,'DISK','5 · read page in',C.rose)}
  ${arrow(285,150,315,150,C.muted)} ${arrow(575,150,605,150,C.muted)} ${arrow(865,150,895,150,C.rose)}
  ${txt(600,270,'6 · update page table + TLB, then restart the faulting instruction',{size:18,anchor:'middle',color:C.green})}
  ${txt(600,300,'The entire detour is invisible to the running program.',{size:15,anchor:'middle',color:C.muted})}
`);

/* 14 — replacement flow */
render('replacement',1200,330,`
  ${txt(40,42,'Page replacement decision',{size:27,weight:'600'})}
  ${box(30,100,260,110,'PAGE FAULT','no free frame?',C.rose)}
  ${box(370,45,300,100,'FREE FRAME','use it directly',C.green)}
  ${box(370,200,300,100,'VICTIM PAGE','FIFO / LRU / OPT / Clock',C.amber)}
  ${box(760,125,390,120,'NEW PAGE IN','update tables · restart process',C.teal)}
  ${arrow(295,145,365,95,C.green)} ${arrow(295,175,365,230,C.amber)}
  ${arrow(675,95,755,160,C.green)} ${arrow(675,250,755,200,C.amber)}
  ${txt(40,305,'Dirty victim → write to disk first · clean victim → discard with no write',{size:17,color:C.muted})}
`);

/* 15 — frame allocation */
render('allocation',1200,340,`
  ${txt(40,42,'Frame allocation policies',{size:27,weight:'600'})}
  ${txt(40,95,'EQUAL: m / n',{size:17,color:C.teal,weight:'600'})}
  ${rect(40,110,1100,60,'#162034',C.border,8)}
  ${rect(40,110,550,60,'rgba(94,234,212,.2)',C.teal,0)}
  ${rect(590,110,550,60,'rgba(167,139,250,.2)',C.violet,0)}
  ${txt(315,148,'P1 · 31 frames',{size:17,anchor:'middle',color:C.teal})}
  ${txt(865,148,'P2 · 31 frames',{size:17,anchor:'middle',color:C.violet})}
  ${txt(40,225,'PROPORTIONAL: aᵢ = m × Sᵢ / ΣS',{size:17,color:C.amber,weight:'600'})}
  ${rect(40,240,1100,60,'#162034',C.border,8)}
  ${rect(40,240,178,60,'rgba(94,234,212,.2)',C.teal,0)}
  ${rect(218,240,922,60,'rgba(167,139,250,.2)',C.violet,0)}
  ${txt(129,278,'P1 · 4',{size:16,anchor:'middle',color:C.teal})}
  ${txt(679,278,'P2 · 57',{size:17,anchor:'middle',color:C.violet})}
  ${txt(40,330,'62 frames · sizes 10 KB and 127 KB · leftovers go to the free-frame buffer pool',{size:15,color:C.muted})}
`);

/* 16 — NUMA */
render('numa',1200,350,`
  ${txt(40,42,'Non-uniform memory access',{size:27,weight:'600'})}
  ${box(60,100,260,110,'CPU 0','processor board 0',C.teal)}
  ${box(880,100,260,110,'CPU 1','processor board 1',C.violet)}
  ${box(400,70,400,90,'LOCAL RAM 0','fast path',C.green)}
  ${box(400,210,400,90,'RAM 1','remote path',C.rose)}
  ${arrow(325,145,395,115,C.green,4)}
  ${arrow(875,145,805,115,C.rose,4)}
  ${arrow(325,175,395,255,C.rose,4)}
  ${arrow(875,175,805,255,C.green,4)}
  ${txt(600,335,'Access to memory on the same board is faster than crossing the interconnect.',{size:16,anchor:'middle',color:C.muted})}
`);

/* 17 — thrashing feedback loop */
render('thrashing-cycle',1200,340,`
  ${txt(40,42,'The thrashing feedback loop',{size:27,weight:'600'})}
  ${box(40,110,240,100,'LOW CPU USE','OS admits more processes',C.amber)}
  ${box(350,110,240,100,'TOO FEW FRAMES','working set does not fit',C.rose)}
  ${box(660,110,240,100,'PAGE FAULT STORM','pages shuttle to disk',C.rose)}
  ${box(970,110,190,100,'LOWER CPU','back to start',C.amber)}
  ${arrow(285,160,345,160,C.rose)} ${arrow(595,160,655,160,C.rose)} ${arrow(905,160,965,160,C.rose)}
  ${pathWrap()}
  ${txt(600,300,'Cure: give processes enough frames, or reduce multiprogramming (working set / PFF control).',{size:17,anchor:'middle',color:C.green})}
`);
function pathWrap(){ return `<path d="M1065 215 Q1065 275 600 275 Q160 275 160 215" stroke="${C.amber}" stroke-width="3" fill="none" marker-end="url(#arw-${C.amber.slice(1)})"/>`; }

/* 18 — locality / working set */
render('locality',1200,320,`
  ${txt(40,42,'Locality of reference → working set',{size:27,weight:'600'})}
  ${txt(40,95,'Reference string',{size:16,color:C.muted})}
  ${[1,2,5,6,7,1,2,3,4,5,4,3,2,1].map((n,i)=>{
    const x=40+i*80, inWs=i>=6&&i<=9;
    return rect(x,115,68,55,inWs?'rgba(94,234,212,.2)':'#162034',inWs?C.teal:C.border,8)+
      txt(x+34,151,String(n),{size:19,anchor:'middle',mono:true,color:inWs?C.teal:C.text});
  }).join('')}
  ${txt(40,225,'window at t₁ → {1,2,5,6,7}',{size:18,color:C.violet,mono:true})}
  ${txt(650,225,'window at t₂ → {3,4,5}',{size:18,color:C.teal,mono:true})}
  ${txt(40,285,'A program moves between localities; pages used together must be resident or it thrashes.',{size:16,color:C.muted})}
`);

/* 19–20 — copy-on-write */
const cowBase = (copied) => `
  ${txt(40,42,copied?'Copy-on-write: after the child writes':'Copy-on-write: shared after fork()',{size:27,weight:'600'})}
  ${box(60,110,300,110,'PARENT','address space',C.violet)}
  ${box(840,110,300,110,'CHILD','address space',C.teal)}
  ${rect(410,100,380,130,'#162034',C.border,10)}
  ${txt(600,140,copied?'TWO PHYSICAL PAGES':'ONE SHARED PHYSICAL PAGE',{size:18,anchor:'middle',color:copied?C.amber:C.teal,weight:'600'})}
  ${rect(440,160,150,50,copied?'rgba(167,139,250,.2)':'rgba(94,234,212,.2)',copied?C.violet:C.teal,8)}
  ${rect(610,160,150,50,copied?'rgba(94,234,212,.2)':'rgba(94,234,212,.2)',C.teal,8)}
  ${txt(515,193,copied?'original':'page A',{size:15,anchor:'middle',mono:true,color:C.text})}
  ${txt(685,193,copied?'new copy':'page A',{size:15,anchor:'middle',mono:true,color:C.text})}
  ${arrow(365,165,435,180,copied?C.violet:C.teal)} ${arrow(835,165,765,180,C.teal)}
  ${txt(600,300,copied?'OS allocated a zero-filled page for the child; both are now private.':'Both page tables map the same re-entrant page marked copy-on-write.',{size:17,anchor:'middle',color:C.muted})}
`;
render('cow-shared',1200,330,cowBase(false));
render('cow-copied',1200,330,cowBase(true));

if (!process.env.KEEP_SRC) fs.rmSync(TMP, { recursive: true, force: true });
console.log('\nGenerated', fs.readdirSync(OUT).filter(f=>f.endsWith('.png')).length, 'PNG diagrams in', OUT);
