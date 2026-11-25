import { useEffect, useRef, useState } from 'react';

/* Structured node diagrams: Graphviz computes label sizes and edge routes,
   which keeps dense page-table and segment structures readable. */
const DEFINITIONS = {
  'ptab-hier': `digraph G {
    rankdir=LR;
    node [shape=box style="rounded,filled" fillcolor="#172136" color="#3b4a68" fontcolor="#e8eefb" fontsize=11 fontname="Inter, sans-serif" margin="0.30,0.20"];
    edge [color="#5eead4" fontcolor="#94a3bb" fontsize=10 fontname="Inter, sans-serif"];
    va [label="32-bit address\\np1 | p2 | offset"];
    outer [label="Outer page table\\nindexed by p1"];
    inner [label="Inner page tables\\nindexed by p2"];
    pte [label="PTE\\nframe + valid bits"];
    pa [label="Physical address\\nframe | offset"];
    va -> outer -> inner -> pte -> pa;
  }`,
  'ptab-hash': `digraph G {
    rankdir=LR;
    node [shape=box style="rounded,filled" fillcolor="#172136" color="#3b4a68" fontcolor="#e8eefb" fontsize=11 fontname="Inter, sans-serif" margin="0.30,0.20"];
    edge [color="#5eead4" fontcolor="#94a3bb" fontsize=10 fontname="Inter, sans-serif"];
    vpn [label="Virtual page number"];
    hash [label="Hash function" shape=ellipse fillcolor="#3b2d6b" color="#a78bfa"];
    bucket [label="Bucket / chain\\nVPN · frame · next"];
    match [label="Match VPN?\\nelse follow pointer"];
    frame [label="Physical frame"];
    vpn -> hash -> bucket -> match;
    match -> frame [label="yes"];
    match -> bucket [label="no" style=dashed];
  }`,
  'ptab-inv': `digraph G {
    rankdir=LR;
    node [shape=box style="rounded,filled" fillcolor="#172136" color="#3b4a68" fontcolor="#e8eefb" fontsize=11 fontname="Inter, sans-serif" margin="0.30,0.20"];
    edge [color="#5eead4" fontcolor="#94a3bb" fontsize=10 fontname="Inter, sans-serif"];
    req [label="(pid, virtual page)"];
    search [label="Search inverted table\\none entry per frame"];
    entry [label="Entry\\npid | vpn | frame"];
    ok [label="Frame + offset\\nphysical address"];
    bad [label="No match → trap\\nillegal access" fillcolor="#3f1d2b" color="#fb7185"];
    req -> search -> entry;
    entry -> ok [label="match"];
    entry -> bad [label="no match"];
  }`,
  segmentation: `digraph G {
    rankdir=LR;
    node [shape=box style="rounded,filled" fillcolor="#172136" color="#3b4a68" fontcolor="#e8eefb" fontsize=11 fontname="Inter, sans-serif" margin="0.30,0.20"];
    edge [color="#5eead4" fontcolor="#94a3bb" fontsize=10 fontname="Inter, sans-serif"];
    addr [label="Logical address\\nsegment s | offset d"];
    table [label="Segment table\\nbase | limit"];
    check [label="d < limit?" shape=diamond fillcolor="#3b2d6b" color="#a78bfa"];
    pa [label="base + d\\nphysical address"];
    trap [label="Trap to OS\\nlimit violation" fillcolor="#3f1d2b" color="#fb7185"];
    addr -> table -> check;
    check -> pa [label="yes"];
    check -> trap [label="no"];
  }`,
  'shared-pages': `digraph G {
    rankdir=TB;
    node [shape=box style="rounded,filled" fillcolor="#172136" color="#3b4a68" fontcolor="#e8eefb" fontsize=11 fontname="Inter, sans-serif" margin="0.30,0.20"];
    edge [color="#5eead4" fontcolor="#94a3bb" fontsize=10 fontname="Inter, sans-serif"];
    p1 [label="Process 1 page tables"];
    p2 [label="Process 2 page tables"];
    code [label="Shared frame\\nre-entrant code" fillcolor="#123b37" color="#5eead4"];
    d1 [label="Private data frame 1"];
    d2 [label="Private data frame 2"];
    p1 -> code; p2 -> code;
    p1 -> d1; p2 -> d2;
  }`,
  tlb: `digraph G {
    rankdir=LR;
    node [shape=box style="rounded,filled" fillcolor="#172136" color="#3b4a68" fontcolor="#e8eefb" fontsize=11 fontname="Inter, sans-serif" margin="0.30,0.20"];
    edge [color="#5eead4" fontcolor="#94a3bb" fontsize=10 fontname="Inter, sans-serif"];
    cpu [label="CPU\\nvirtual address"];
    mmu [label="MMU"];
    tlb [label="TLB\\nrecent PTEs" fillcolor="#123b37" color="#5eead4"];
    hit [label="Hit → frame" color="#4ade80"];
    miss [label="Miss → page-table walk" color="#fbbf24"];
    pt [label="Page table in RAM"];
    ram [label="Physical frame"];
    cpu -> mmu -> tlb;
    tlb -> hit;
    tlb -> miss -> pt -> ram;
    hit -> ram;
  }`,
};

/* DOT definitions are kept in the original dark palette; remap them for the light theme. */
const LIGHT_PALETTE = {
  '#172136': '#ffffff',
  '#3b4a68': '#c7d2e5',
  '#e8eefb': '#172033',
  '#5eead4': '#0f766e',
  '#94a3bb': '#3b4960',
  '#3b2d6b': '#ede9fe',
  '#a78bfa': '#7c3aed',
  '#123b37': '#ccfbf1',
  '#3f1d2b': '#ffe4e6',
  '#fb7185': '#be123c',
  '#4ade80': '#15803d',
  '#fbbf24': '#b45309',
};
const lightenDot = (dot) =>
  Object.entries(LIGHT_PALETTE).reduce((text, [dark, light]) => text.split(dark).join(light), dot);

let vizPromise;
function loadViz() {
  if (!vizPromise) {
    vizPromise = import('@viz-js/viz')
      .then(({ instance }) => instance())
      .catch((error) => {
        vizPromise = undefined;
        throw error;
      });
  }
  return vizPromise;
}

export default function GraphvizDiagram({ name }) {
  const ref = useRef(null);
  const isPageTable = name.startsWith('ptab-');
  const [kind, setKind] = useState(() => {
    if (!isPageTable) return name;
    return document.getElementById('ptab-kind')?.value || name.slice(5);
  });
  const diagramName = isPageTable ? `ptab-${kind}` : name;

  useEffect(() => {
    if (!isPageTable) return undefined;
    const handler = (event) => setKind(event.detail);
    window.addEventListener('ptab:kind', handler);
    return () => window.removeEventListener('ptab:kind', handler);
  }, [isPageTable]);

  useEffect(() => {
    let cancelled = false;
    loadViz()
      .then((viz) => viz.renderString(lightenDot(DEFINITIONS[diagramName]), { format: 'svg', engine: 'dot' }))
      .then((svg) => {
        if (!cancelled && ref.current) ref.current.innerHTML = svg;
      })
      .catch((error) => {
        if (!cancelled && ref.current) {
          ref.current.innerHTML = `<div class="diagram-error">Could not render diagram: ${error.message}</div>`;
        }
      });
    return () => {
      cancelled = true;
    };
  }, [diagramName]);

  return <div className={`native-diagram graphviz ${name}`} ref={ref} aria-label={`${name} structure diagram`} />;
}
