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

  /* Data Structures structures */
  'dsa-pointer-chain': `digraph G {
    rankdir=LR;
    node [shape=box style="rounded,filled" fillcolor="#172136" color="#3b4a68" fontcolor="#e8eefb" fontsize=11 fontname="Inter, sans-serif" margin="0.30,0.20"];
    edge [color="#5eead4" fontcolor="#94a3bb" fontsize=10 fontname="Inter, sans-serif"];
    pp [label="pp\\npointer to pointer"];
    p [label="p\\npointer to x"];
    x [label="x = 50\\ninteger" fillcolor="#123b37" color="#5eead4"];
    pp -> p [label="holds &p"];
    p -> x [label="holds &x"];
  }`,
  'dsa-array-map': `digraph G {
    rankdir=LR;
    node [shape=box style="rounded,filled" fillcolor="#172136" color="#3b4a68" fontcolor="#e8eefb" fontsize=11 fontname="Inter, sans-serif" margin="0.30,0.20"];
    edge [color="#5eead4" fontcolor="#94a3bb" fontsize=10 fontname="Inter, sans-serif"];
    grid [label="A[3][2]\\nrow 0: 11 12\\nrow 1: 21 22\\nrow 2: 31 32"];
    formula [label="Row major\\nbase + (i×2 + j)×size" shape=ellipse fillcolor="#3b2d6b" color="#a78bfa"];
    memory [label="Linear memory\\n11 | 12 | 21 | 22 | 31 | 32" fillcolor="#123b37" color="#5eead4"];
    grid -> formula -> memory;
  }`,
  'dsa-circular-queue': `digraph G {
    rankdir=LR;
    node [shape=box style="rounded,filled" fillcolor="#172136" color="#3b4a68" fontcolor="#e8eefb" fontsize=11 fontname="Inter, sans-serif" margin="0.30,0.20"];
    edge [color="#5eead4" fontcolor="#94a3bb" fontsize=10 fontname="Inter, sans-serif"];
    s0 [label="[0]\\nfree"];
    s1 [label="[1]\\nrear → D" fillcolor="#123b37" color="#5eead4"];
    s2 [label="[2]\\nfree"];
    s3 [label="[3]\\nfront → A"];
    s4 [label="[4]\\nB"];
    s0 -> s1 -> s2 -> s3 -> s4 -> s0;
  }`,
  'dsa-sll': `digraph G {
    rankdir=LR;
    node [shape=box style="rounded,filled" fillcolor="#172136" color="#3b4a68" fontcolor="#e8eefb" fontsize=11 fontname="Inter, sans-serif" margin="0.30,0.20"];
    edge [color="#5eead4" fontcolor="#94a3bb" fontsize=10 fontname="Inter, sans-serif"];
    head [label="HEAD" shape=ellipse fillcolor="#3b2d6b" color="#a78bfa"];
    n1 [label="10 | next"];
    n2 [label="20 | next"];
    n3 [label="30 | next"];
    nil [label="NULL" shape=ellipse fillcolor="#3f1d2b" color="#fb7185"];
    head -> n1 -> n2 -> n3 -> nil;
  }`,
  'dsa-header-list': `digraph G {
    rankdir=LR;
    node [shape=box style="rounded,filled" fillcolor="#172136" color="#3b4a68" fontcolor="#e8eefb" fontsize=11 fontname="Inter, sans-serif" margin="0.30,0.20"];
    edge [color="#5eead4" fontcolor="#94a3bb" fontsize=10 fontname="Inter, sans-serif"];
    head [label="HEAD" shape=ellipse fillcolor="#3b2d6b" color="#a78bfa"];
    sentinel [label="header\\nsentinel" fillcolor="#3b2d6b" color="#a78bfa"];
    n1 [label="10 | next"];
    n2 [label="20 | next"];
    nil [label="NULL" shape=ellipse fillcolor="#3f1d2b" color="#fb7185"];
    head -> sentinel -> n1 -> n2 -> nil;
  }`,
  'dsa-circular-list': `digraph G {
    rankdir=LR;
    node [shape=box style="rounded,filled" fillcolor="#172136" color="#3b4a68" fontcolor="#e8eefb" fontsize=11 fontname="Inter, sans-serif" margin="0.30,0.20"];
    edge [color="#5eead4" fontcolor="#94a3bb" fontsize=10 fontname="Inter, sans-serif"];
    last [label="last" shape=ellipse fillcolor="#3b2d6b" color="#a78bfa"];
    n1 [label="10"];
    n2 [label="20"];
    n3 [label="30"];
    last -> n3 [label="points to last" style=dashed];
    n1 -> n2 -> n3 -> n1;
  }`,
  'dsa-dll': `digraph G {
    rankdir=LR;
    node [shape=box style="rounded,filled" fillcolor="#172136" color="#3b4a68" fontcolor="#e8eefb" fontsize=11 fontname="Inter, sans-serif" margin="0.30,0.20"];
    edge [color="#5eead4" fontcolor="#94a3bb" fontsize=10 fontname="Inter, sans-serif"];
    head [label="HEAD" shape=ellipse fillcolor="#3b2d6b" color="#a78bfa"];
    h [label="header\\ncount = 3" fillcolor="#3b2d6b" color="#a78bfa"];
    n1 [label="10"];
    n2 [label="20"];
    n3 [label="30"];
    nil [label="NULL" shape=ellipse fillcolor="#3f1d2b" color="#fb7185"];
    head -> h -> n1 -> n2 -> n3 -> nil;
    n1 -> h [dir=back];
    n2 -> n1 [dir=back];
    n3 -> n2 [dir=back];
  }`,
  'dsa-general-tree': `digraph G {
    rankdir=TB;
    node [shape=box style="rounded,filled" fillcolor="#172136" color="#3b4a68" fontcolor="#e8eefb" fontsize=11 fontname="Inter, sans-serif" margin="0.30,0.20"];
    edge [color="#5eead4" fontcolor="#94a3bb" fontsize=10 fontname="Inter, sans-serif"];
    a [label="A\\nroot" fillcolor="#123b37" color="#5eead4"];
    b [label="B"]; c [label="C"]; d [label="D"];
    e [label="E"]; f [label="F"]; g [label="G"]; h [label="H"]; i [label="I"];
    a -> b; a -> c; a -> d;
    b -> e; b -> f;
    c -> g; c -> h;
    d -> i;
  }`,
  'dsa-binary-tree': `digraph G {
    rankdir=TB;
    node [shape=box style="rounded,filled" fillcolor="#172136" color="#3b4a68" fontcolor="#e8eefb" fontsize=11 fontname="Inter, sans-serif" margin="0.30,0.20"];
    edge [color="#5eead4" fontcolor="#94a3bb" fontsize=10 fontname="Inter, sans-serif"];
    n10 [label="10\\nroot" fillcolor="#123b37" color="#5eead4"];
    n5 [label="5"]; n15 [label="15"];
    n2 [label="2"]; n7 [label="7"]; n12 [label="12"]; n18 [label="18"];
    n10 -> n5; n10 -> n15;
    n5 -> n2; n5 -> n7;
    n15 -> n12; n15 -> n18;
  }`,
  'dsa-threaded-tree': `digraph G {
    rankdir=TB;
    node [shape=box style="rounded,filled" fillcolor="#172136" color="#3b4a68" fontcolor="#e8eefb" fontsize=11 fontname="Inter, sans-serif" margin="0.30,0.20"];
    edge [color="#5eead4" fontcolor="#94a3bb" fontsize=10 fontname="Inter, sans-serif"];
    head [label="head node" shape=ellipse fillcolor="#3b2d6b" color="#a78bfa"];
    b [label="B"]; d [label="D"]; e [label="E"]; a [label="A"]; c [label="C"];
    head -> b [style=dashed label="thread start"];
    b -> d; b -> e; a -> b [style=dashed]; a -> c [style=dashed];
    d -> e [style=dashed label="thread" color="#fbbf24" fontcolor="#b45309"];
    e -> a [style=dashed label="thread" color="#fbbf24" fontcolor="#b45309"];
    c -> head [style=dashed label="thread" color="#fbbf24" fontcolor="#b45309"];
  }`,

  /* Java Module 4 structures */
  'java-constructor-map': `digraph G {
    rankdir=LR;
    node [shape=box style="rounded,filled" fillcolor="#172136" color="#3b4a68" fontcolor="#e8eefb" fontsize=11 fontname="Inter, sans-serif" margin="0.30,0.20"];
    edge [color="#5eead4" fontcolor="#94a3bb" fontsize=10 fontname="Inter, sans-serif"];
    empty [label="new String()\\nempty" shape=ellipse fillcolor="#3b2d6b" color="#a78bfa"];
    chars [label="char[]\\nletters"];
    slice [label="char[] + start\\n+ length"];
    copy [label="String s1"];
    bytes [label="byte[]\\nASCII values"];
    result [label="String object\\njava.lang.String" fillcolor="#123b37" color="#5eead4"];
    empty -> result;
    chars -> result;
    slice -> result;
    copy -> result;
    bytes -> result;
  }`,
  'java-string-class': `digraph G {
    rankdir=TB;
    node [shape=box style="rounded,filled" fillcolor="#172136" color="#3b4a68" fontcolor="#e8eefb" fontsize=11 fontname="Inter, sans-serif" margin="0.30,0.20"];
    edge [color="#5eead4" fontcolor="#94a3bb" fontsize=10 fontname="Inter, sans-serif"];
    lang [label="java.lang\\nloaded automatically" shape=ellipse fillcolor="#3b2d6b" color="#a78bfa"];
    str [label="String\\nimmutable" fillcolor="#123b37" color="#5eead4"];
    buffer [label="StringBuffer\\nmutable"];
    builder [label="StringBuilder\\nmutable"];
    lang -> str;
    lang -> buffer;
    lang -> builder;
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
