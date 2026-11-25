import { quizQuestions } from '../content/quiz.js';

/**
 * Interactive controller ported from the original index.html.
 * Mount it once, after the section markup is in the DOM.
 */
export function mountExplainer() {
  const asset = (p) => `${import.meta.env.BASE_URL}${p}`;
  const disposers = [];
  const listen = (el, type, fn, opts) => {
    el.addEventListener(type, fn, opts);
    disposers.push(() => el.removeEventListener(type, fn, opts));
  };
  const timer = (fn, ms) => { const id = setTimeout(fn, ms); disposers.push(() => clearTimeout(id)); return id; };
  const interval = (fn, ms) => { const id = setInterval(fn, ms); disposers.push(() => clearInterval(id)); return id; };


/* ---------- helpers ---------- */
const $ = id => document.getElementById(id);
const sleep = ms => new Promise(r => timer(r, ms));
const clamp = (n,a,b) => Math.max(a, Math.min(b,n));
const hex = n => '0x' + n.toString(16).toUpperCase().padStart(4,'0');

/* ---------- shared animation helpers ---------- */
const motionOff = () => document.body.classList.contains('no-motion') || matchMedia('(prefers-reduced-motion: reduce)').matches;

// Move a labelled token between two elements, using their on-screen positions.
function moveToken(token, fromEl, toEl, text, slow=false){
  token.textContent = text;
  const a = fromEl.getBoundingClientRect(), b = toEl.getBoundingClientRect();
  const parent = token.parentElement.getBoundingClientRect();
  token.style.opacity = '1';
  token.classList.toggle('slow', slow);
  token.style.transform = `translate(${a.left + a.width/2 - parent.left}px, ${a.top + a.height/2 - parent.top}px)`;
  requestAnimationFrame(() => requestAnimationFrame(() => {
    token.style.transform = `translate(${b.left + b.width/2 - parent.left}px, ${b.top + b.height/2 - parent.top}px)`;
  }));
}

// Fly a small chip from one element to another (used for bit splits and evictions).
function flyChip(text, from, to, cls='', delay=0, dur=620){
  if (motionOff()) return;
  const chip = document.createElement('div');
  chip.className = 'fly-chip ' + cls;
  chip.textContent = text;
  document.body.appendChild(chip);
  const a = from.getBoundingClientRect(), b = to.getBoundingClientRect();
  chip.style.left = (a.left + a.width/2) + 'px';
  chip.style.top  = (a.top + a.height/2) + 'px';
  const dx = b.left + b.width/2 - a.left - a.width/2;
  const dy = b.top + b.height/2 - a.top - a.height/2;
  const anim = chip.animate([
    { transform:'translate(0,0) scale(1)', opacity:1 },
    { transform:`translate(${dx}px,${dy}px) scale(.65)`, opacity:.1 }
  ], { duration:dur, delay, easing:'cubic-bezier(.4,0,.2,1)', fill:'forwards' });
  anim.onfinish = () => chip.remove();
}
function pulse(el, cls='bump', ms=450){
  if (motionOff() || !el) return;
  el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls);
  timer(() => el.classList.remove(cls), ms);
}
listen($('motion-toggle'), 'click', e => {
  const on = document.body.classList.toggle('no-motion');
  e.target.textContent = 'Motion: ' + (on ? 'off' : 'on');
  e.target.setAttribute('aria-pressed', String(on));
});

/* ================= 1b. MEMORY HIERARCHY ANIMATION ================= */
const HI = { running:false, pos:0 };
const HI_SEQ = [
  { node:1, label:'addr', note:'The CPU needs a byte. The <b>L1/L2 cache</b> is checked first — it is only nanoseconds away. <b>Miss</b>: not cached.' },
  { node:2, label:'MISS', note:'Check <b>main memory</b>. The page-table entry is invalid, so the data is not in RAM either. This raises a page fault.' },
  { node:3, label:'disk', note:'Fetch from <b>SSD / disk</b> — roughly 1,000× slower than RAM and 300,000× slower than a register. This is where the time goes.' },
  { node:2, label:'page', note:'The page lands in a RAM frame. The OS updates the page table (and TLB) and marks the entry valid.' },
  { node:1, label:'frame', note:'The cache is warmed with the fresh data, so the next nearby access will be fast.' },
  { node:0, label:'done', note:'The faulting instruction <b>re-executes from the start</b> and the CPU finally gets its byte. The whole detour was invisible to the program.' }
];
async function hiRun(){
  if (HI.running || motionOff()) { if (motionOff()) $('hi-note').textContent = 'Motion is off — turn it on in the sidebar to play the animation.'; return; }
  HI.running = true; $('hi-run').disabled = true;
  for (const s of HI_SEQ) {
    const nodes = $('hierarchy').querySelectorAll('.spot');
    const target = nodes[s.node];
    moveToken($('hi-token'), nodes[HI.pos], target, s.label, s.node === 3);
    nodes.forEach(n => n.classList.remove('active'));
    target.classList.add('active');
    $('hi-note').className = 'result' + (s.node === 3 ? ' bad' : s.node === 0 ? ' ok' : '');
    $('hi-note').innerHTML = s.note;
    HI.pos = s.node;
    await sleep(s.node === 3 ? 1400 : 950);
  }
  HI.running = false; $('hi-run').disabled = false;
}
listen($('hi-run'), 'click', hiRun);

/* ================= 2. ADDRESS TRANSLATION ================= */
const AT = { pageSize:4096, pt:[], tlb:[], tlbOn:true, runId:0 };
const PAGES = () => 65536 / AT.pageSize;

function remapMemory(){
  AT.runId++;
  const n = PAGES();
  const frames = [...Array(16).keys()].sort(() => Math.random()-.5);
  AT.pt = Array.from({length:n}, (_,i) => Math.random() < .82 ? frames[i % 16] : -1);
  AT.tlb = [];
  renderAT();
}
function renderAT(){
  const n = PAGES(), pageBits = Math.log2(n), offBits = Math.log2(AT.pageSize);
  $('at-page-label').textContent = `page · ${pageBits} bits`;
  $('at-offset-label').textContent = `offset · ${offBits} bits`;
  $('at-bits').innerHTML = Array.from({length:16}, (_,i) => `<div class="bit ${i < 16-offBits ? '' : 'off'}">${i < 16-offBits ? 'P' : 'O'}</div>`).join('');
  $('at-pt').innerHTML = AT.pt.map((f,i) => `<div class="pt-cell ${f<0?'invalid':'valid'}" data-page="${i}" title="page ${i} → ${f<0?'not resident':'frame '+f}">${i.toString(16).toUpperCase().padStart(2,'0')}<small>${f<0?'—':f}</small></div>`).join('');
  $('at-tlb-slots').innerHTML = Array.from({length:4}, (_,i) => {
    const e = AT.tlb[i];
    return `<div class="tlb-slot ${e ? 'filled' : ''}" id="tlb-slot-${i}">${e ? `${e.page.toString(16).toUpperCase()} → ${e.frame}` : 'empty'}</div>`;
  }).join('');
  $('at-frames').innerHTML = Array.from({length:16}, (_,i) => `<div class="frame-cell" id="frame-${i}">${i}</div>`).join('');
  for (const p of ['as1','as2','as3','as4','as5']) {
    $(p).className = 'pipe-step';
    $(p).querySelector('.v').textContent = '—';
  }
  $('at-runner').style.opacity = '0';
}
listen($('at-pt'), 'click', e => {
  const cell = e.target.closest('.pt-cell'); if (!cell) return;
  const i = +cell.dataset.page;
  AT.pt[i] = AT.pt[i] === -1 ? Math.floor(Math.random()*16) : -1;
  AT.tlb = AT.tlb.filter(x => x.page !== i);
  renderAT();
});
listen($('at-page-size'), 'change', e => { AT.pageSize = +e.target.value; remapMemory(); });
listen($('at-tlb'), 'change', e => { AT.tlbOn = e.target.value === 'on'; remapMemory(); });
listen($('at-reset'), 'click', remapMemory);
listen($('at-rand'), 'click', () => { $('at-addr').value = hex(Math.floor(Math.random()*65536)); $('at-run').click(); });

function parseAddr(str){
  const s = str.trim().toLowerCase();
  const v = s.startsWith('0x') ? parseInt(s.slice(2),16) : parseInt(s,10);
  return isNaN(v) ? null : clamp(v,0,65535);
}
async function translate(){
  const id = ++AT.runId;
  const addr = parseAddr($('at-addr').value);
  const out = $('at-result');
  if (addr === null) { out.className = 'result bad'; out.textContent = 'Enter a decimal number or a 0x-prefixed hex address.'; return; }
  const pageBits = Math.log2(PAGES()), offBits = Math.log2(AT.pageSize);
  const page = addr >> offBits, offset = addr & (AT.pageSize-1);
  const bin = addr.toString(2).padStart(16,'0');

  // sweep a highlight across the address bits, then isolate page vs offset
  [...$('at-bits').children].forEach((b,i) => timer(() => {
    b.classList.add('flash'); timer(() => b.classList.remove('flash'), 400);
  }, i*35));
  document.querySelectorAll('.pt-cell.lookup').forEach(c => c.classList.remove('lookup'));

  const step = (n, text, fault=false) => {
    const el = $('as'+n);
    el.className = 'pipe-step active' + (fault ? ' fault' : '');
    el.querySelector('.v').textContent = text;
    const box = el.getBoundingClientRect(), parent = $('at-pipe').getBoundingClientRect();
    const runner = $('at-runner');
    runner.style.opacity = '1';
    runner.classList.toggle('fault', fault);
    runner.style.transform = `translate(${box.left-parent.left+box.width/2-5.5}px, ${box.top-parent.top+box.height/2-5.5}px)`;
  };

  step(1, `VA ${hex(addr)}\nP=${page}  O=${offset}`); out.className='result'; out.textContent='Splitting the address into page number + offset…'; await sleep(500); if(id!==AT.runId) return;

  let frame = -1, tlbHit = false;
  if (AT.tlbOn) {
    const hit = AT.tlb.find(e => e.page === page);
    tlbHit = !!hit;
    if (hit) frame = hit.frame;
  }
  step(2, AT.tlbOn ? (tlbHit ? `HIT → frame ${frame}` : 'MISS — not cached') : 'bypassed');
  $$tlbHighlight(tlbHit ? page : -1);
  out.textContent = AT.tlbOn ? (tlbHit ? `TLB hit for page ${page}: frame ${frame} found instantly.` : `TLB miss for page ${page}. Walking the page table…`) : 'TLB bypassed. Walking the page table…';
  await sleep(550); if(id!==AT.runId) return;

  if (!tlbHit) {
    frame = AT.pt[page];
    const cell = document.querySelector(`.pt-cell[data-page="${page}"]`); if (cell) cell.classList.add('lookup');
    if (frame < 0) {
      step(3, `PTE = invalid`, true);
      out.className='result bad'; out.innerHTML = `<b>PAGE FAULT.</b> Page ${hex(page*AT.pageSize)} is not resident. The OS must: (1) find a free frame, (2) read the page from disk, (3) update the page table, then (4) re-execute the instruction.`;
      const dest = Math.floor(Math.random()*16), fc = $('frame-'+dest);
      flyChip('disk', cell || $('at-pt'), fc, 'page', 0, 950);
      timer(() => { if (fc && AT.runId === id) { fc.classList.add('target'); timer(() => fc.classList.remove('target'), 700); } }, 900);
      await sleep(1200); return;
    }
    step(3, `PTE → frame ${frame}`);
    if (AT.tlbOn) { AT.tlb.push({page,frame}); if (AT.tlb.length>4) AT.tlb.shift(); renderTLBOnly(); $$tlbHighlight(page); }
    out.textContent = `Page-table entry for page ${page} points to physical frame ${frame}.`;
    await sleep(500); if(id!==AT.runId) return;
  }

  const pa = frame * AT.pageSize + offset;
  step(4, `${frame}×${AT.pageSize} + ${offset}`);
  out.textContent = `Physical address = (${frame} × ${AT.pageSize}) + ${offset} = ${pa}.`;
  await sleep(500); if(id!==AT.runId) return;

  step(5, `RAM[${hex(pa)}]`);
  document.querySelectorAll('.frame-cell').forEach(c => c.classList.remove('target'));
  const fc = $('frame-'+frame); if (fc) fc.classList.add('target');
  out.className='result ok';
  out.innerHTML = `<b>${hex(addr)} → ${hex(pa)}</b> &nbsp;·&nbsp; page ${page}, offset ${offset}, frame ${frame} &nbsp;·&nbsp; ${tlbHit?'TLB hit':'TLB miss'}`;
}
function renderTLBOnly(){
  $('at-tlb-slots').innerHTML = Array.from({length:4}, (_,i) => {
    const e = AT.tlb[i];
    return `<div class="tlb-slot ${e?'filled':''}" id="tlb-slot-${i}">${e?`${e.page.toString(16).toUpperCase()} → ${e.frame}`:'empty'}</div>`;
  }).join('');
}
function $$tlbHighlight(page){
  AT.tlb.forEach((e,i) => { const s = $('tlb-slot-'+i); if (s && e.page===page) s.classList.add('hit'); });
}
listen($('at-run'), 'click', translate);
listen($('at-addr'), 'keydown', e => { if (e.key==='Enter') translate(); });
remapMemory();

/* ================= 3. FRAGMENTATION ================= */
const FR = { total:64, blocks:[{size:64, used:false, label:null, req:0, key:0}], next:1, key:1 };
function frRender(msg, animate=false){
  const bar = $('fr-bar');
  const before = animate && !motionOff()
    ? [...bar.children].map(c => ({ key:c.dataset.key, left:c.offsetLeft, width:c.offsetWidth })) : [];
  bar.innerHTML = FR.blocks.map((b,i) => {
    const pct = b.size / FR.total * 100;
    const waste = b.used && b.size > b.req ? `<div class="waste" style="width:${(b.size-b.req)/b.size*100}%" title="internal waste"></div>` : '';
    const label = b.used ? `${b.label}<br><span style="font-size:9px;opacity:.7">${b.req}K</span>` : (b.size>=6 ? `${b.size}K free` : '');
    return `<div class="mem-block ${b.used?'used':'hole'}" style="width:${pct}%" data-i="${i}" data-key="${b.key}" title="${b.used?b.label+' — '+b.req+'K requested (click to free)':b.size+'K hole'}">${waste}<span class="lbl">${label}</span></div>`;
  }).join('');
  // FLIP: slide and resize blocks from their previous positions.
  [...bar.children].forEach(c => {
    const old = before.find(o => o.key === c.dataset.key);
    if (old) {
      const dx = old.left - c.offsetLeft, sx = old.width / (c.offsetWidth || 1);
      if (Math.abs(dx) > 1 || Math.abs(sx-1) > .01)
        c.animate([{ transform:`translateX(${dx}px) scaleX(${sx})` }, { transform:'none' }],
          { duration:650, easing:'cubic-bezier(.2,.8,.2,1)' });
    } else if (animate && !motionOff()) {
      c.animate([{ opacity:0, transform:'scaleY(.35)' }, { opacity:1, transform:'none' }], { duration:420, easing:'ease-out' });
    }
  });
  const used = FR.blocks.filter(b=>b.used).reduce((s,b)=>s+b.req,0);
  const free = FR.total - FR.blocks.filter(b=>b.used).reduce((s,b)=>s+b.size,0);
  const largest = Math.max(0, ...FR.blocks.filter(b=>!b.used).map(b=>b.size));
  const internal = FR.blocks.filter(b=>b.used).reduce((s,b)=>s+(b.size-b.req),0);
  const external = free > 0 ? (free-largest)/free*100 : 0;
  $('fr-used').textContent = used+'K'; $('fr-free').textContent = free+'K';
  $('fr-largest').textContent = largest+'K'; $('fr-internal').textContent = internal+'K';
  $('fr-external').textContent = external.toFixed(0)+'%';
  if (msg) $('fr-msg').innerHTML = msg;
}
listen($('fr-bar'), 'click', e => {
  const b = e.target.closest('.mem-block'); if (!b) return;
  const i = +b.dataset.i;
  if (!FR.blocks[i].used) { frRender('That is a free hole — nothing to free there.'); return; }
  const name = FR.blocks[i].label;
  FR.blocks[i].used = false; FR.blocks[i].label = null;
  coalesce();
  frRender(`Freed <b>${name}</b>. Adjacent holes merge automatically; scattered ones do not.`, true);
});
function coalesce(){
  const out = [];
  for (const b of FR.blocks) {
    const last = out[out.length-1];
    if (!b.used && last && !last.used) last.size += b.size;
    else out.push({...b});
  }
  FR.blocks = out;
}
listen($('fr-alloc'), 'click', () => {
  const req = clamp(parseInt($('fr-size').value,10)||1, 1, 32);
  const strategy = $('fr-strategy').value;
  const candidates = FR.blocks.map((b,i)=>({b,i})).filter(x => !x.b.used && x.b.size >= req);
  if (!candidates.length) {
    const holes = FR.blocks.filter(b=>!b.used);
    const free = holes.reduce((s,b)=>s+b.size,0);
    const largest = Math.max(0,...holes.map(b=>b.size));
    frRender(`<span style="color:var(--rose)">Allocation failed.</span> ${free}K free across ${holes.length} hole(s), but the largest single hole is only ${largest}K — this is external fragmentation. Try <b>Compact</b>.`);
    return;
  }
  let pick;
  if (strategy==='first') pick = candidates[0];
  if (strategy==='best') pick = candidates.reduce((a,b)=> b.b.size < a.b.size ? b : a);
  if (strategy==='worst') pick = candidates.reduce((a,b)=> b.b.size > a.b.size ? b : a);
  const name = 'P'+FR.next++;
  const oldSize = pick.b.size;
  FR.blocks[pick.i] = {size:req, used:true, label:name, req, key:FR.key++};
  if (oldSize > req) FR.blocks.splice(pick.i+1, 0, {size:oldSize-req, used:false, label:null, req:0, key:FR.key++});
  frRender(`Allocated <b>${name}</b> (${req}K) into a ${oldSize}K hole using ${strategy} fit.${oldSize>req ? ` ${oldSize-req}K remains as a hole.` : ''}`, true);
});
listen($('fr-compact'), 'click', () => {
  const live = FR.blocks.filter(b=>b.used);
  const totalUsed = live.reduce((s,b)=>s+b.size,0);
  FR.blocks = [...live, ...(totalUsed<FR.total ? [{size:FR.total-totalUsed, used:false, label:null, req:0, key:FR.key++}] : [])];
  frRender('Compaction slid all processes to one end, merging every hole into one big block. External fragmentation is now <b>0%</b> — but copying memory is expensive.', true);
});
listen($('fr-reset'), 'click', () => { FR.blocks=[{size:64,used:false,label:null,req:0,key:FR.key++}]; FR.next=1; frRender('Memory reset to one 64 KB hole.'); });
frRender();

/* ================= 4b. ADDRESS SPLIT ANIMATION ================= */
$('split-bits').innerHTML = ['1','0','1','1','0','0','1','1']
  .map((b,i) => `<i class="${i<3?'':'off'}">${b}</i>`).join('');
listen($('sp-run'), 'click', () => {
  const bits = [...$('split-bits').children];
  bits.forEach((b,i) => flyChip(b.textContent, b, i<3 ? $('sp-page') : $('sp-off'), i<3 ? 'page' : 'off', i*70, 700));
  timer(() => {
    $('sp-page').textContent = '101₂ → page / segment 5';
    $('sp-off').textContent = '10011₂ → offset 19';
    pulse($('sp-page'), 'flash', 600); pulse($('sp-off'), 'flash', 600);
  }, 760);
  timer(() => { $('sp-page').textContent = 'page / segment number'; $('sp-off').textContent = 'offset'; }, 4000);
});

/* ================= 5. DEMAND PAGING TIMELINE ================= */
const PF = [
  ['CPU requests page 42','The CPU generates a virtual address for a page marked <b>invalid</b> (not in RAM). The MMU raises a page fault — a trap to the OS.', 'violet'],
  ['MMU traps to the OS','Hardware saves the faulting instruction and the virtual address in a status register. The process is suspended.', 'violet'],
  ['OS checks validity','If the reference is illegal (bad address or protection violation), the process is killed. Otherwise it is a legitimate fault.', 'amber'],
  ['Find a free frame','If RAM has a free frame, use it. Otherwise run a <b>page replacement algorithm</b> to evict a victim page.', 'amber'],
  ['Read page from disk','Start a disk I/O to fetch the page. This is a <b>major fault</b> and costs milliseconds — thousands of times slower than a memory access.', 'rose'],
  ['Update tables & retry','Once the page arrives, write the frame number into the page table (and TLB), mark it valid, then restart the faulting instruction from the beginning.', 'accent']
];
let pfIdx = -1, pfPos = 0;
const PF_NODES = [1,1,1,2,3,0];
const PF_LABELS = ['addr','trap','check','frame?','disk','retry'];
function pfAdvance(i){
  const nodes = [...$('pf-stage').querySelectorAll('.spot')];
  nodes.forEach(n => n.classList.remove('active'));
  if (i === 4) {
    // the request reaches disk, then the fetched page travels back to RAM
    moveToken($('pf-token'), nodes[pfPos], nodes[3], PF_LABELS[i], true);
    nodes[3].classList.add('active');
    timer(() => {
      if (pfIdx !== 4) return;
      nodes.forEach(n => n.classList.remove('active'));
      nodes[2].classList.add('active');
      moveToken($('pf-token'), nodes[3], nodes[2], 'page');
      pfPos = 2;
    }, 720);
  } else {
    moveToken($('pf-token'), nodes[pfPos], nodes[PF_NODES[i]], PF_LABELS[i]);
    pfPos = PF_NODES[i];
    nodes[PF_NODES[i]].classList.add('active');
  }
}
function pfResetDiagram(){
  pfPos = 0; $('pf-token').style.opacity = '0';
  $('pf-stage').querySelectorAll('.spot').forEach(n => n.classList.remove('active'));
}
function pfRender(){
  if (pfIdx >= 0) pfAdvance(pfIdx); else pfResetDiagram();
  const colors = {violet:'var(--violet)',amber:'var(--amber)',rose:'var(--rose)',accent:'var(--accent)'};
  $('pf-timeline').innerHTML = PF.map((s,i) => {
    const state = i < pfIdx ? 'done' : i === pfIdx ? 'current' : '';
    const op = i < pfIdx ? '1' : i === pfIdx ? '1' : '.35';
    return `<div class="mini" style="display:flex;gap:13px;align-items:flex-start;opacity:${op};margin-bottom:9px;border-color:${i===pfIdx?colors[s[2]]:'var(--border-soft)'}">
      <div style="font-family:var(--mono);font-size:11px;color:${colors[s[2]]};min-width:22px">${String(i).padStart(2,'0')}</div>
      <div><b>${s[0]}</b><p style="font-size:12px;margin:3px 0 0">${s[1]}</p></div>
      <div style="margin-left:auto;font-size:11px;color:${state==='done'?'var(--green)':'#5b6b84'}">${state==='done'?'✓':state==='current'?'●':''}</div>
    </div>`;
  }).join('');
  $('pf-explain').className = 'result' + (pfIdx===PF.length-1 ? ' ok' : '');
  $('pf-explain').innerHTML = pfIdx < 0 ? 'Step 0 of 6. Press <b>Next step</b>.' : `Step ${pfIdx+1} of 6 — <b>${PF[pfIdx][0]}</b>${pfIdx===PF.length-1 ? '<br>The program never noticed. That is the illusion of virtual memory.' : ''}`;
}
listen($('pf-step'), 'click', () => { pfIdx = pfIdx >= PF.length-1 ? -1 : pfIdx+1; pfRender(); });
listen($('pf-reset'), 'click', () => { pfIdx=-1; pfRender(); });
pfRender();

/* ================= 6. REPLACEMENT SIMULATOR ================= */
const RP = { result:[], idx:-1, timer:null };
function simulate(refs, n, algo){
  let frames = Array(n).fill(null);
  const out = [];
  let queue = [], last = {}, counts = {}, bits = Array(n).fill(0), hand = 0;
  refs.forEach((ref,i) => {
    const hit = frames.includes(ref);
    let evicted = null;
    if (hit) {
      if (algo==='lru') last[ref] = i;
      if (algo==='clock') bits[frames.indexOf(ref)] = 1;
      if (algo==='lfu' || algo==='mfu') counts[ref] = (counts[ref]||0)+1;
    } else {
      let slot;
      if (frames.includes(null)) slot = frames.indexOf(null);
      else if (algo==='fifo') { evicted = queue.shift(); slot = frames.indexOf(evicted); }
      else if (algo==='lru') {
        let min = Infinity;
        frames.forEach((p,j) => { if ((last[p] ?? -1) < min) { min = last[p] ?? -1; slot = j; } });
        evicted = frames[slot];
      } else if (algo==='opt') {
        let far = -1, best = -1;
        frames.forEach((p,j) => {
          let next = refs.indexOf(p, i+1);
          if (next === -1) { slot = j; far = Infinity; }
          else if (next > far) { far = next; slot = j; }
        });
        evicted = frames[slot];
      } else if (algo==='clock') {
        for (let guard=0; guard<n*3; guard++) {
          if (frames[hand] === null) { slot = hand; break; }
          if (bits[hand]) { bits[hand] = 0; hand = (hand+1)%n; continue; }
          evicted = frames[hand]; slot = hand; break;
        }
        if (slot === undefined) slot = hand;
      } else if (algo==='lfu' || algo==='mfu') {
        const vals = frames.map(p => counts[p] || 0);
        const target = algo==='lfu' ? Math.min(...vals) : Math.max(...vals);
        slot = vals.indexOf(target);
        evicted = frames[slot];
      }
      frames[slot] = ref;
      if (algo==='fifo') { queue = queue.filter(p => p !== evicted); queue.push(ref); }
      if (algo==='lru') last[ref] = i;
      if (algo==='lfu' || algo==='mfu') counts[ref] = 1;
      if (algo==='clock') { bits[slot] = 1; hand = (hand+1)%n; }
    }
    out.push({ref, frames:[...frames], hit, evicted});
  });
  return out;
}
function rpParse(){
  const refs = $('rp-refs').value.split(/[,;\s]+/).map(s=>parseInt(s,10)).filter(n=>!isNaN(n));
  return refs.slice(0,30);
}
function rpSetup(){
  clearInterval(RP.timer); RP.timer = null;
  $('rp-step').disabled = false;
  const refs = rpParse(), n = clamp(+$('rp-frames').value||3,1,7), algo = $('rp-algo').value;
  if (!refs.length) return;
  RP.result = simulate(refs,n,algo); RP.idx = -1;
  $('rp-evicted').innerHTML = '';
  $('rp-head').innerHTML = `<tr><th>Ref</th>${Array.from({length:n},(_,i)=>`<th>Frame ${i}</th>`).join('')}<th>Result</th><th>Evicted</th></tr>`;
  rpRender();
  const faults = RP.result.filter(r=>!r.hit).length;
  $('rp-faults').textContent = faults;
  $('rp-hits').textContent = refs.length - faults;
  $('rp-rate').textContent = Math.round(faults/refs.length*100)+'%';
  $('rp-note').innerHTML = algo==='opt'
    ? 'Optimal is a lower bound — it knows the entire future. Use it to see how far LRU/Clock fall short.'
    : 'Tip: with 4 frames, FIFO can produce <b>more</b> faults than with 3 frames — Belady\'s anomaly. LRU and Optimal never do.';
}
function rpRender(){
  const rows = RP.result.map((r,i) => {
    const cls = i===RP.idx ? 'current' : i<RP.idx ? 'done miss' : '';
    const cells = r.frames.map((p,j) => {
      let c = p===null ? '·' : p;
      if (i===RP.idx && !r.hit && r.frames[j]===r.ref) c = `<span class="cell-new">${c}</span>`;
      return `<td>${c}</td>`;
    }).join('');
    const visible = i <= RP.idx;
    return `<tr class="${cls}" style="${visible?'':'opacity:.3'}"><td><b>${r.ref}</b></td>${cells}<td>${visible?`<span class="pill ${r.hit?'hit':'miss'}">${r.hit?'HIT':'FAULT'}</span>`:''}</td><td style="color:var(--rose)">${visible && r.evicted!==null ? r.evicted : ''}</td></tr>`;
  }).join('');
  $('rp-body').innerHTML = rows;
  $('rp-progress').textContent = `${RP.idx+1}/${RP.result.length}`;
  const tr = $('rp-body').querySelector('tr.current');
  if (tr) tr.scrollIntoView({block:'nearest', behavior:'smooth'});
}
function rpFlyVictim(){
  const r = RP.result[RP.idx];
  if (!r || r.evicted === null) return;
  const prev = RP.result[RP.idx-1];
  const j = prev ? prev.frames.indexOf(r.evicted) : -1;
  const tr = $('rp-body').querySelector('tr.current');
  if (!tr) return;
  flyChip(String(r.evicted), j >= 0 ? tr.children[j+1] : tr.children[1], $('rp-evicted'), 'evict', 0, 750);
  const lane = $('rp-evicted'), chip = document.createElement('span');
  chip.className = 'evict-chip'; chip.textContent = r.evicted;
  lane.prepend(chip);
  while (lane.children.length > 14) lane.lastChild.remove();
  pulse($('rp-faults').parentElement);
}
function rpTick(){
  if (RP.idx >= RP.result.length-1) { clearInterval(RP.timer); RP.timer=null; $('rp-step').disabled=false; return; }
  RP.idx++; rpRender(); rpFlyVictim();
}
listen($('rp-run'), 'click', () => {
  rpSetup(); if (!RP.result.length) return;
  $('rp-step').disabled=true;
  RP.timer = interval(rpTick, +$('rp-speed').value);
  rpTick();
});
listen($('rp-step'), 'click', () => { if (RP.idx < 0 || RP.idx >= RP.result.length-1) { rpSetup(); } rpTick(); });
listen($('rp-reset'), 'click', rpSetup);
listen($('rp-speed'), 'input', () => { if (RP.timer) { clearInterval(RP.timer); RP.timer = interval(rpTick, +$('rp-speed').value); } });
['rp-refs','rp-frames','rp-algo'].forEach(id => listen($(id), 'change', rpSetup));
rpSetup();

/* ================= 7. THRASHING ================= */
function thUtil(m, f, w){
  if (f >= w) return Math.min(97, 96*(1-Math.exp(-0.36*m)));
  const ratio = f/w;
  return Math.max(3, 92*Math.pow(ratio,2.1)*Math.exp(-0.13*Math.max(0,m-2)));
}
const TH = { prev:null };
function thRender(){
  const f = +$('th-frames').value, w = +$('th-ws').value, m = +$('th-m').value;
  $('th-f-val').textContent=f; $('th-w-val').textContent=w; $('th-m-val').textContent=m;
  const u = thUtil(m,f,w);
  window.dispatchEvent(new CustomEvent('th:data', { detail: { f, w, m, u } }));
  const bad = f < w;
  $('th-util').textContent = Math.round(u)+'%';
  $('th-util').className = 'big' + (bad ? ' bad' : '');
  $('th-state').classList.toggle('thrashing', bad);
  $('th-desc').innerHTML = bad
    ? `<b style="color:var(--rose)">Thrashing.</b> Each process needs about ${w} frames but has only ${f}. Pages are constantly swapped in and out; the disk is saturated and the CPU is mostly idle. Suspend a process or allocate more frames.`
    : `Healthy. Each process has ${f} frames for a working set of ${w}. Adding processes improves CPU utilization until the CPU is saturated — then the curve plateaus.`;
}
['th-frames','th-ws','th-m'].forEach(id => listen($(id), 'input', thRender));
thRender();

/* ================= 12b. MODULE 4 EXTENSIONS ================= */

/* --- base & limit protection (token rides over the PNG diagram) --- */
listen($('hw-check'), 'click', () => {
  const base = Math.max(0, +$('hw-base').value || 0), limit = Math.max(1, +$('hw-limit').value || 1);
  const addr = +$('hw-addr').value || 0;
  const legal = addr >= base && addr < base + limit;
  // Map the requested address into the three zones drawn in base-limit.png.
  const pct = addr < base
    ? 3.3 + clamp(addr / Math.max(base, 1), 0, 1) * 21.7
    : legal
      ? 25 + ((addr - base) / limit) * 50
      : 75 + clamp((addr - base - limit) / Math.max(limit * .45, 1), 0, 1) * 22;
  const token = $('hw-token');
  token.style.transform = 'none';
  token.style.left = pct + '%'; token.style.top = '50%'; token.style.opacity = '1';
  token.classList.toggle('slow', !legal);
  $('hw-result').className = 'result ' + (legal ? 'ok' : 'bad');
  $('hw-result').innerHTML = legal
    ? `<b>ALLOWED.</b> ${addr} lies in [${base}, ${base+limit}). The MMU/relocation register would map logical offset ${addr-base} to physical address ${addr}.`
    : `<b>TRAP TO OS.</b> ${addr} is outside [${base}, ${base+limit}). Hardware compares every user-mode address with the base and limit registers; only kernel-mode privileged instructions can change them.`;
});

/* --- address binding animation --- */
const BIND_NOTES = [
  'Source program uses a <b>symbolic name</b> for the address.',
  'The <b>compiler</b> binds it to a relocatable address.',
  'The <b>loader</b> binds it to an absolute address at load time.',
  'At <b>execution time</b> the MMU produces the final physical address — the process may move while running.'
];
const BIND_STOP = {compile:1, load:2, runtime:3};
let bindPos = 0, bindRunning = false;
async function bindRun(){
  if (bindRunning) return; bindRunning = true;
  const stop = BIND_STOP[$('bind-stage').value];
  const nodes = [...$('bind-diagram').querySelectorAll('.spot')];
  for (let i=0; i<=stop; i++) {
    nodes.forEach(n => n.classList.remove('active'));
    nodes[i].classList.add('active');
    moveToken($('bind-token'), nodes[bindPos], nodes[i], ['name','reloc','abs','phys'][i]);
    bindPos = i;
    $('bind-note').innerHTML = BIND_NOTES[i];
    await sleep(780);
  }
  bindRunning = false;
}
listen($('bind-run'), 'click', bindRun);
listen($('bind-stage'), 'change', () => {
  const s = $('bind-stage').value;
  $('bind-note').innerHTML = s==='compile'
    ? 'Absolute code is produced by the compiler — but changing the load address forces recompilation.'
    : s==='load'
      ? 'Relocatable code is produced; a different start address needs reloading, not recompiling.'
      : 'Execution-time binding allows relocation, swapping and paging. The process may move while it runs.';
});

/* --- dynamic loading steps --- */
const DL = [
  ['All routines on disk','Every routine is stored in relocatable-load format on the backing store.', '💾'],
  ['Load main program','Only the main program is loaded into memory and starts executing.', '📦'],
  ['Call a routine','The main program checks whether the requested routine is already loaded.', '📞'],
  ['Call the loader','If not loaded, the loader brings that routine into memory.', '⚙️'],
  ['Transfer control','Execution jumps into the newly loaded routine.', '➡️']
];
let dlIdx = -1;
function dlRender(){
  $('dl-steps').innerHTML = DL.map((s,i) => `<div class="mini" style="display:flex;gap:10px;opacity:${i<=dlIdx?1:.4};margin-bottom:7px;border-color:${i===dlIdx?'var(--violet)':'var(--border-soft)'}">
    <span>${s[2]}</span><div><b style="font-size:12px">${s[0]}</b><p style="font-size:11px;margin:2px 0 0">${s[1]}</p></div></div>`).join('');
}
listen($('dl-step'), 'click', () => { dlIdx = dlIdx >= DL.length-1 ? -1 : dlIdx+1; dlRender(); });
dlRender();
listen($('dl-link'), 'click', () => {
  flyChip('stub', $('link-note'), $('link-target'), 'page', 0, 800);
  $('link-note').innerHTML = '<b>Stub resolved.</b> The shared library routine is located in memory; no second copy is linked into the executable.';
  pulse($('link-target'), 'flash', 600);
});

/* --- swapping (P1 chip rides between zones of the PNG diagram) --- */
let swLoc = 'mem';
moveToken($('sw-chip'), $('sw-mem'), $('sw-mem'), 'P1');
listen($('sw-out'), 'click', () => {
  if (swLoc === 'disk') return;
  flyChip('P1', $('sw-mem'), $('sw-disk'), 'evict');
  moveToken($('sw-chip'), $('sw-mem'), $('sw-disk'), 'P1');
  swLoc = 'disk';
  $('sw-result').innerHTML = '<b>Swapped out.</b> P1 now resides on the backing store. This is only safe when it has no pending I/O.';
});
listen($('sw-in'), 'click', () => {
  if (swLoc === 'mem') return;
  flyChip('P1', $('sw-disk'), $('sw-mem'), 'page');
  moveToken($('sw-chip'), $('sw-disk'), $('sw-mem'), 'P1');
  swLoc = 'mem';
  $('sw-result').innerHTML = '<b>Swapped in.</b> Execution-time binding lets P1 land in a different memory region. Priority swapping is called roll out / roll in.';
});
listen($('sw-calc'), 'click', () => {
  const size = +$('sw-size').value||0, rate = +$('sw-rate').value||1, lat = +$('sw-lat').value||0;
  const one = size/rate*1000 + lat;
  $('sw-result').innerHTML = `Transfer ${size}÷${rate} = ${(size/rate*1000).toFixed(0)} ms + ${lat} ms latency = <b>${one.toFixed(0)} ms</b> per direction, <b>${(2*one).toFixed(0)} ms</b> round trip. Transfer time dominates.`;
  pulse($('sw-result'), 'flash', 500);
});

/* --- page-table math --- */
listen($('pm-calc'), 'click', () => {
  const size = +$('pm-size').value, pages = +$('pm-pages').value, frames = +$('pm-frames').value;
  const lb = Math.log2(size*pages), pb = Math.log2(frames*size), pageBits = Math.log2(pages), offBits = Math.log2(size);
  $('pm-logical').textContent = lb.toFixed(lb%1?1:0);
  $('pm-physical').textContent = pb.toFixed(pb%1?1:0);
  $('pm-pagebits').textContent = pageBits.toFixed(pageBits%1?1:0);
  $('pm-offsetbits').textContent = offBits.toFixed(offBits%1?1:0);
  $('pm-result').innerHTML = `${pages} pages × ${size} B = 2<sup>${lb}</sup> logical addresses; ${frames} frames × ${size} B = 2<sup>${pb}</sup> physical addresses. High ${pageBits} bits = page, low ${offBits} = offset.`;
  ['pm-logical','pm-physical','pm-pagebits','pm-offsetbits'].forEach(id => pulse($(id).parentElement));
});

/* --- TLB EAT --- */
function eatRender(){
  const h = (+$('eat-h').value)/100, t = +$('eat-t').value||0, ma = +$('eat-ma').value||1;
  const hit = t+ma, miss = t+2*ma, eat = h*hit+(1-h)*miss;
  $('eat-h-val').textContent = $('eat-h').value;
  $('eat-value').textContent = eat.toFixed(1)+' ns';
  $('eat-slow').textContent = ((eat/ma-1)*100).toFixed(0)+'%';
  $('eat-hit').textContent = hit; $('eat-miss').textContent = miss;
  $('eat-note').innerHTML = `<b>EAT = ${(h*100).toFixed(0)}%×${hit} + ${((1-h)*100).toFixed(0)}%×${miss} = ${eat.toFixed(1)} ns.</b> Only ${((1-h)*100).toFixed(0)}% of accesses pay the extra page-table walk.`;
}
['eat-h','eat-t','eat-ma'].forEach(id => listen($(id), 'input', eatRender));
eatRender();

/* --- protection check --- */
listen($('prot-check'), 'click', () => {
  const page = $('prot-page').value, state = $('prot-state').value, op = $('prot-op').value;
  const ok = state !== 'invalid' && !(state === 'v-ro' && op === 'write');
  $('prot-result').className = 'result ' + (ok ? 'ok' : 'bad');
  $('prot-result').innerHTML = ok
    ? `<b>ALLOWED.</b> Page ${page} is ${state==='v-ro'?'read-only':'read-write'} and present. The frame number is combined with the offset; protection bits are checked at the same time.`
    : state === 'invalid'
      ? `<b>TRAP.</b> Page ${page} has an invalid bit — either outside the logical address space or not currently in memory (page fault).`
      : `<b>MEMORY PROTECTION VIOLATION.</b> Page ${page} is read-only; a write attempt traps to the operating system.`;
});

/* --- page-table structures (PNG diagrams) --- */
const PTAB = {
  hier: [asset('diagrams/ptab-hier.png'),'Two-level page table: outer and inner tables indexed by the split page number'],
  hash: [asset('diagrams/ptab-hash.png'),'Hashed page table: a virtual page number maps to a bucket with chained entries'],
  inv:  [asset('diagrams/ptab-inv.png'),'Inverted page table: one entry per physical frame holding pid and virtual page']
};
function ptabRender(){
  const kind = $('ptab-kind').value;
  const [src, alt] = PTAB[kind];
  window.dispatchEvent(new CustomEvent('ptab:kind', { detail: kind }));
  $('ptab-note').innerHTML = kind==='hier'
    ? 'A 32-bit address with 4 KB pages has 2<sup>20</sup> page-table entries; paging the table itself keeps each piece small.'
    : kind==='hash'
      ? 'Used for address spaces larger than 32 bits. Each element stores virtual page number, mapped frame, and a pointer to the next element.'
      : 'Each real page of memory has one entry holding the virtual address and owning process. No match means an illegal access.';
}
listen($('ptab-kind'), 'change', ptabRender);
ptabRender();

/* --- segmentation check --- */
const SEGS = [ {base:5000,limit:1000}, {base:2000,limit:500}, {base:4300,limit:400}, {base:3200,limit:700}, {base:0,limit:500} ];
listen($('seg-check'), 'click', () => {
  const s = +$('seg-num').value, d = +$('seg-off').value;
  if (s<0 || s>=SEGS.length || !SEGS[s]) { $('seg-result').className='result bad'; $('seg-result').textContent='No such segment.'; return; }
  const seg = SEGS[s], legal = d>=0 && d<seg.limit;
  $('seg-result').className = 'result ' + (legal?'ok':'bad');
  $('seg-result').innerHTML = legal
    ? `<b>ALLOWED.</b> Segment ${s}: base ${seg.base} + offset ${d} = <b>${seg.base+d}</b>. Offset ${d} &lt; limit ${seg.limit}.`
    : `<b>TRAP TO OS.</b> Offset ${d} is outside segment ${s}'s limit of ${seg.limit} — an attempted logical address beyond the end of the segment.`;
});

/* --- demand paging EAT --- */
listen($('dp-calc'), 'click', () => {
  const p = (+$('dp-rate').value||0)/1000, ma = +$('dp-ma').value||1, svc = (+$('dp-svc').value||0)*1e6;
  const eat = (1-p)*ma + p*svc;
  $('dp-result').innerHTML = `p = ${p}. EAT = (1−p)×${ma} + p×${svc.toLocaleString()} = <b>${eat.toFixed(0)} ns (${(eat/1000).toFixed(2)} µs)</b> — ${(eat/ma).toFixed(0)}× slower than a memory hit.`;
  pulse($('dp-result'), 'flash', 500);
});

/* --- copy on write (swap the two PNG states) --- */
let cowCopied = false;
listen($('cow-write'), 'click', () => {
  cowCopied = !cowCopied;
  window.dispatchEvent(new CustomEvent('cow:state', { detail: { copied: cowCopied } }));
  pulse($('cow-img'), 'flash', 600);
  $('cow-write').textContent = cowCopied ? 'Share again ↩' : 'Child writes →';
  $('cow-result').className = 'result ' + (cowCopied ? 'ok' : '');
  $('cow-result').innerHTML = cowCopied
    ? '<b>COW fault handled.</b> The OS allocated a new zero-filled page for the child. The parent keeps the original; neither can now affect the other.'
    : 'Both map the same physical page marked copy-on-write. Click to let the child modify it.';
});

/* --- dirty bit --- */
let dbDirty = 0, dbAvoided = 0;
function dbRender(){
  $('db-bit').textContent = dbDirty;
  $('db-writes').textContent = dbAvoided;
}
listen($('db-write'), 'click', () => { dbDirty = 1; dbRender(); $('db-result').innerHTML='Hardware set the <b>modify bit to 1</b>. This page must be written back if evicted.'; });
listen($('db-evict'), 'click', () => {
  if (dbDirty) { $('db-result').innerHTML='<b>Victim is dirty.</b> Write it to disk first, then reuse the frame.'; dbDirty=0; }
  else { dbAvoided++; $('db-result').innerHTML='<b>Victim is clean.</b> No disk write needed — discard it and reuse the frame.'; }
  dbRender();
});
listen($('db-reset'), 'click', () => { dbDirty=0; dbAvoided=0; dbRender(); $('db-result').innerHTML='Page is clean. Evicting it now requires no disk transfer.'; });
dbRender();

/* --- frame allocation --- */
listen($('alloc-run'), 'click', () => {
  const m = Math.max(1, +$('alloc-frames').value||0);
  const sizes = ($('alloc-sizes').value.split(/[,\s]+/).map(Number).filter(n=>n>0));
  if (!sizes.length) return;
  const sum = sizes.reduce((a,b)=>a+b,0), equal = $('alloc-policy').value==='equal';
  const alloc = sizes.map(s => equal ? Math.floor(m/sizes.length) : Math.floor(m*s/sum));
  $('alloc-output').innerHTML = `<div class="mem-bar" style="height:52px">${sizes.map((s,i)=>`<div class="mem-block used" style="width:${alloc[i]/m*100}%" title="${alloc[i]} frames">P${i+1}: ${alloc[i]}</div>`).join('')}<div class="mem-block hole" style="width:${(m-alloc.reduce((a,b)=>a+b,0))/m*100}%">free</div></div>`;
  $('alloc-result').innerHTML = sizes.map((s,i)=>`P${i+1} (${s} KB) → <b>${alloc[i]} frames</b>`).join(' · ') + ` · leftover ${m-alloc.reduce((a,b)=>a+b,0)} frames go to the free-frame buffer pool.`;
  pulse($('alloc-result'), 'flash', 500);
});

/* --- locality / working set --- */
const LOC_REFS = [1,2,5,6,7,1,2,3,4,5,4,3,2,1];
let locIdx = LOC_REFS.length-1;
function locRender(){
  const w = +$('loc-win').value;
  $('loc-win-val').textContent = w;
  const start = Math.max(0, locIdx-w+1), ws = [...new Set(LOC_REFS.slice(start, locIdx+1))].sort((a,b)=>a-b);
  window.dispatchEvent(new CustomEvent('loc:data', { detail: { refs: LOC_REFS, index: locIdx, window: w, pages: ws } }));
  $('loc-seq').innerHTML = LOC_REFS.map((r,i)=>`<span class="${i===locIdx?'active':i>=start?'in-ws':''}" data-i="${i}">${r}</span>`).join('');
  $('loc-result').innerHTML = `At reference ${locIdx+1}, the last ${Math.min(w,locIdx+1)} accesses touch pages <b>{${ws.join(', ')}}</b>. All of them must be resident or the process will thrash. Notice how the set changes as execution moves between localities.`;
}
listen($('loc-win'), 'input', locRender);
listen($('loc-seq'), 'click', e => { const s=e.target.closest('span'); if(s){ locIdx=+s.dataset.i; locRender(); } });
locRender();

/* --- page-fault frequency --- */
function pffRender(){
  const rate = +$('pff-rate').value, upper = +$('pff-upper').value, lower = +$('pff-lower').value;
  $('pff-rate-val').textContent = rate;
  const frames = clamp(Math.round(rate/12)+2, 1, 8);
  $('pff-frames').innerHTML = Array.from({length:8},(_,i)=>`<div class="frame-cell ${i<frames?'target':''}">${i<frames?'▦':''}</div>`).join('');
  $('pff-result').className = 'result ' + (rate>upper?'bad':rate<lower?'':'ok');
  $('pff-result').innerHTML = rate>upper
    ? `<b>Fault rate above ${upper}%.</b> Give this process another frame — or suspend it if memory is tight.`
    : rate<lower
      ? `<b>Fault rate below ${lower}%.</b> The process has more frames than it needs; reclaim one.`
      : `<b>Fault rate within [${lower}%, ${upper}%].</b> Allocation is stable — this is the desired operating region.`;
}
['pff-rate','pff-upper','pff-lower'].forEach(id => listen($(id), 'input', pffRender));
pffRender();

/* --- worked-problem reveals --- */
document.querySelectorAll('.reveal').forEach(b => listen(b, 'click', () => {
  const sol = $(b.dataset.t); sol.hidden = !sol.hidden;
  b.textContent = sol.hidden ? 'Reveal solution' : 'Hide solution';
}));
listen($('load-belady'), 'click', () => {
  $('rp-refs').value = '7,0,1,2,0,3,0,4,2,3,0,3,2,1,2,0,1,7,0,1';
  $('rp-frames').value = 3; $('rp-algo').value = 'fifo'; rpSetup();
  $('replacement').scrollIntoView({behavior:'smooth'});
});

/* ================= 13. QUIZ ================= */
const QS = quizQuestions;
let qi=0, qscore=0, qanswered=false;
function qRender(){
  $('q-progress').innerHTML = QS.map((_,i)=>`<i class="${i<qi?'done':''}"></i>`).join('');
  if (qi >= QS.length) {
    $('q-body').innerHTML = `<div style="text-align:center;padding:26px 0">
      <div class="score-big">${qscore}/${QS.length}</div>
      <h3 style="margin-top:8px">${qscore===QS.length?'Perfect recall.':qscore>=QS.length*0.7?'Solid understanding.':'Worth another pass through the demos.'}</h3>
      <p style="margin:8px 0 20px">${qscore===QS.length?'You can explain the whole memory-management module.':''}</p>
      <button class="primary" id="q-again">Try again</button></div>`;
    listen($('q-again'), 'click',()=>{qi=0;qscore=0;qRender();});
    return;
  }
  const q = QS[qi]; qanswered=false;
  $('q-body').innerHTML = `<div style="font-family:var(--mono);font-size:11px;color:var(--accent);letter-spacing:1px">QUESTION ${qi+1} / ${QS.length}</div>
    <div class="q-text">${q.q}</div>
    <div class="options">${q.o.map((o,i)=>`<button class="opt" data-i="${i}">${String.fromCharCode(65+i)}. ${o}</button>`).join('')}</div>
    <div class="q-feedback" id="q-feedback"></div>
    <button class="primary" id="q-next" style="margin-top:14px;display:none">${qi===QS.length-1?'See results →':'Next question →'}</button>`;
  $('q-body').querySelectorAll('.opt').forEach(b => listen(b, 'click', () => {
    if (qanswered) return; qanswered=true;
    const pick = +b.dataset.i;
    $('q-body').querySelectorAll('.opt').forEach((x,i) => {
      if (i===q.a) x.classList.add('correct');
      else if (i===pick) x.classList.add('wrong');
      else x.classList.add('dim');
    });
    if (pick===q.a) qscore++;
    $('q-feedback').innerHTML = `<b style="color:${pick===q.a?'var(--green)':'var(--rose)'}">${pick===q.a?'Correct.':'Not quite.'}</b> ${q.e}`;
    $('q-next').style.display='inline-block';
  }));
  listen($('q-next'), 'click', () => { qi++; qRender(); });
}
qRender();

  return () => {
    disposers.forEach((off) => off());
    if (RP.timer) clearInterval(RP.timer);
  };
}
