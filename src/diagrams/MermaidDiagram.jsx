import { useEffect, useId, useRef, useState } from 'react';

/* Flow diagrams: Mermaid's layout engine sizes every label before placing it,
   so long text wraps instead of overlapping. */
const DEFINITIONS = {
  replacement: `flowchart LR
    A["Page fault"] --> B{"Free frame?"}
    B -- Yes --> C["Load page into frame"]
    B -- No --> D["Pick victim"]
    D --> E["FIFO · LRU · OPT<br/>Clock · LFU · MFU"]
    E --> F{"Victim dirty?"}
    F -- Yes --> G["Write back to disk"]
    F -- No --> C
    G --> C
    C --> H["Update page table + TLB"]
    H --> I["Retry faulting instruction"]`,

  'thrashing-cycle': `flowchart LR
    A["Low CPU utilisation"] --> B["Admit more processes"]
    B --> C["Fewer frames per process"]
    C --> D["Working sets not resident"]
    D --> E["Page-fault storm + swapping"]
    E --> A`,

  'cow-shared': `flowchart TB
    P["Parent maps page P"] --> S[("Shared physical frame<br/>COW bit = 1")]
    C["Child maps page P"] --> S
    S --> N["No copy until a write"]`,

  'cow-copied': `flowchart TB
    P["Parent maps page P"] --> F1[("Original frame")]
    C["Child writes to page P"] --> F2[("New private frame")]
    F2 --> N["Copy-on-write fault handled"]`,

  allocation: `flowchart LR
    M["m free frames"] --> E["Equal allocation<br/>m / n each"]
    M --> P["Proportional allocation<br/>m × Sᵢ / ΣS"]
    E --> R["Free-frame buffer pool"]
    P --> R`,

  numa: `flowchart LR
    subgraph Node0["NUMA node 0"]
      C0["CPU 0"] --> R0[("Local RAM")]
    end
    subgraph Node1["NUMA node 1"]
      C1["CPU 1"] --> R1[("Local RAM")]
    end
    C0 -. "slower over interconnect" .-> R1
    C1 -. "slower over interconnect" .-> R0`,
};

let mermaidPromise;
function loadMermaid() {
  if (!mermaidPromise) {
    mermaidPromise = import('mermaid').then(({ default: mermaid }) => {
      mermaid.initialize({
        startOnLoad: false,
        theme: 'base',
        securityLevel: 'loose',
        flowchart: { htmlLabels: true, curve: 'basis', nodeSpacing: 40, rankSpacing: 55 },
        themeVariables: {
          background: 'transparent',
          primaryColor: '#eef3fb',
          primaryBorderColor: '#c7d2e5',
          primaryTextColor: '#172033',
          lineColor: '#0f766e',
          secondaryColor: '#ede9fe',
          tertiaryColor: '#ffffff',
          mainBkg: '#ffffff',
          secondBkg: '#eef3fb',
          textColor: '#172033',
          edgeLabelBackground: '#ffffff',
          clusterBkg: '#f5f8ff',
          clusterBorder: '#c7d2e5',
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: '13px',
        },
      });
      return mermaid;
    });
  }
  return mermaidPromise;
}

export default function MermaidDiagram({ name }) {
  const rawId = useId();
  const baseId = `mmd-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const ref = useRef(null);
  const seq = useRef(0);
  const [definition, setDefinition] = useState(() => DEFINITIONS[name] || DEFINITIONS.replacement);

  useEffect(() => {
    if (name !== 'cow-shared') return undefined;
    const handler = (event) =>
      setDefinition(event.detail.copied ? DEFINITIONS['cow-copied'] : DEFINITIONS['cow-shared']);
    window.addEventListener('cow:state', handler);
    return () => window.removeEventListener('cow:state', handler);
  }, [name]);

  useEffect(() => {
    let cancelled = false;
    const renderId = `${baseId}-${++seq.current}`;
    loadMermaid()
      .then((mermaid) => mermaid.render(renderId, definition))
      .then(({ svg }) => {
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
  }, [baseId, definition]);

  return <div className={`native-diagram mermaid ${name}`} ref={ref} aria-label={`${name} flow diagram`} />;
}
