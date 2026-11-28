import { ReactStage } from './ReactStages.jsx';
import MermaidDiagram from './MermaidDiagram.jsx';
import GraphvizDiagram from './GraphvizDiagram.jsx';
import { D3MindMap, LocalityChart, ThrashingChart } from './D3Charts.jsx';
import './diagram.css';

export { D3MindMap };

const reactStages = new Set([
  'hierarchy',
  'base-limit',
  'binding',
  'swap',
  'page-fault',
  'fragmentation',
  'paging-hardware',
]);
const mermaidStages = new Set([
  'replacement',
  'thrashing-cycle',
  'cow-shared',
  'allocation',
  'numa',
  'dsa-lifo-fifo',
  'dsa-dma-flow',
  'dsa-insertion-flow',
  'dsa-radix-flow',
  'dsa-infix-flow',
  'dsa-postfix-flow',
  'dsa-traversal-flow',
  'dsa-bst-search',
  'java-concat-flow',
  'java-valueof-flow',
  'java-extract-flow',
]);
const graphvizStages = new Set([
  'ptab-hier',
  'ptab-hash',
  'ptab-inv',
  'segmentation',
  'shared-pages',
  'tlb',
  'dsa-pointer-chain',
  'dsa-array-map',
  'dsa-circular-queue',
  'dsa-sll',
  'dsa-header-list',
  'dsa-circular-list',
  'dsa-dll',
  'dsa-general-tree',
  'dsa-binary-tree',
  'dsa-threaded-tree',
  'java-constructor-map',
  'java-string-class',
]);

export function Diagram({ name, ...props }) {
  if (reactStages.has(name)) return <ReactStage name={name} />;
  if (mermaidStages.has(name)) return <MermaidDiagram name={name} />;
  if (graphvizStages.has(name)) return <GraphvizDiagram name={name} />;
  if (name === 'mindmap' || name === 'dsa-mindmap') return <D3MindMap {...props} />;
  if (name === 'locality') return <LocalityChart />;
  if (name === 'thrashing-chart') return <ThrashingChart />;
  return <div className="diagram-error">Diagram not found: {name}</div>;
}
