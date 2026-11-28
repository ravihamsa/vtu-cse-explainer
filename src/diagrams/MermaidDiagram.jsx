import { useEffect, useId, useRef, useState } from 'react';

/* Flow diagrams: Mermaid's layout engine sizes every label before placing it,
   so long text wraps instead of overlapping. */
const DEFINITIONS = {
  replacement: `flowchart TB
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

  /* Data Structures flow diagrams */
  'dsa-lifo-fifo': `flowchart TB
    A["New item arrives"] --> B{"Service rule?"}
    B -- "Most recent first" --> C["Stack: push / pop at TOP"]
    B -- "Oldest first" --> D["Queue: enqueue at rear, dequeue at front"]
    C --> E["Undo, call stack, expression"]
    D --> F["Tickets, scheduling, buffering"]`,

  'dsa-dma-flow': `flowchart TB
    A["Need size at run time"] --> B["malloc / calloc"]
    B --> C{"Allocation succeeded?"}
    C -- No --> D["Handle NULL"]
    C -- Yes --> E["Use the heap block"]
    E --> F{"Size must change?"}
    F -- Yes --> G["realloc"]
    F -- No --> H["free and set pointer to NULL"]`,

  'dsa-insertion-flow': `flowchart TB
    A["Start with sorted prefix"] --> B["Take next key"]
    B --> C["Compare with left neighbour"]
    C --> D{"Neighbour larger?"}
    D -- Yes --> E["Shift neighbour right"]
    E --> C
    D -- No --> F["Place key in the gap"]
    F --> G{"More keys?"}
    G -- Yes --> B
    G -- No --> H["Array is sorted"]`,

  'dsa-radix-flow': `flowchart TB
    A["Unsorted fixed-width numbers"] --> B["Pass 1: ones digit"]
    B --> C["Collect in buckets 0-9"]
    C --> D["Empty buckets in order"]
    D --> E["Pass 2: tens digit"]
    E --> D
    D --> F["Pass 3: hundreds digit"]
    F --> G["Sorted list"]`,

  'dsa-infix-flow': `flowchart TB
    A["Scan next token"] --> B{"Operand?"}
    B -- Yes --> C["Write to output"]
    B -- No --> D{"Left parenthesis?"}
    D -- Yes --> E["Push onto stack"]
    D -- No --> F{"Right parenthesis?"}
    F -- Yes --> G["Pop until left parenthesis"]
    F -- No --> H["Pop while ISP >= ICP"]
    H --> I["Push operator"]
    C --> J{"More tokens?"}
    E --> J
    G --> J
    I --> J
    J -- Yes --> A
    J -- No --> K["Pop remaining operators"]`,

  'dsa-postfix-flow': `flowchart TB
    A["Scan next token"] --> B{"Number?"}
    B -- Yes --> C["Push number"]
    B -- No --> D["Pop right operand"]
    D --> E["Pop left operand"]
    E --> F["Apply operator"]
    F --> G["Push result"]
    C --> H{"More tokens?"}
    G --> H
    H -- Yes --> A
    H -- No --> I["Final stack value"]`,

  'dsa-traversal-flow': `flowchart TB
    A["Pick a traversal"] --> B{"Where does the root go?"}
    B -- First --> C["Preorder: N-L-R"]
    B -- Middle --> D["Inorder: L-N-R"]
    B -- Last --> E["Postorder: L-R-N"]
    B -- By depth --> F["Level order with a queue"]`,

  'dsa-bst-search': `flowchart TB
    A["Compare key with node"] --> B{"Equal?"}
    B -- Yes --> C["Found"]
    B -- No --> D{"Smaller?"}
    D -- Yes --> E["Go left"]
    D -- No --> F["Go right"]
    E --> G{"Null child?"}
    F --> G
    G -- Yes --> H["Not found / insert here"]
    G -- No --> A`,

  /* Java Module 4 flows */
  'java-concat-flow': `flowchart LR
    A["Hello"] --> B["+ operator"]
    B --> C["New String<br/>Hello World"]
    A --> D["concat()"]
    D --> E["New String<br/>HelloWorld"]`,

  'java-valueof-flow': `flowchart LR
    A["int 100"] --> V["String.valueOf()"]
    B["double 12.5"] --> V
    C["boolean true"] --> V
    D["char A"] --> V
    V --> S["String object"]`,

  'java-extract-flow': `flowchart TB
    A["String"] --> B{"What do you need?"}
    B -- "One character" --> C["charAt(index) → char"]
    B -- "A range" --> D["getChars(...) → char[]"]
    B -- "Every byte" --> E["getBytes() → byte[]"]
    B -- "Every char" --> F["toCharArray() → char[]"]`,
};

let mermaidPromise;
function loadMermaid() {
  if (!mermaidPromise) {
    mermaidPromise = import('mermaid').then(({ default: mermaid }) => {
      mermaid.initialize({
        startOnLoad: false,
        theme: 'base',
        securityLevel: 'loose',
        flowchart: { htmlLabels: true, curve: 'basis', nodeSpacing: 40, rankSpacing: 55, useMaxWidth: false },
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

  return (
    <div className={`native-diagram mermaid ${name}`} aria-label={`${name} flow diagram`}>
      <div className="mermaid-canvas" ref={ref} />
    </div>
  );
}
