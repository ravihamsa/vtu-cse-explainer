import { ReactStage } from './ReactStages.jsx';
import MermaidDiagram from './MermaidDiagram.jsx';
import GraphvizDiagram from './GraphvizDiagram.jsx';
import { LocalityChart, ThrashingChart } from './D3Charts.jsx';
import './diagram.css';

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
]);
const graphvizStages = new Set([
  'ptab-hier',
  'ptab-hash',
  'ptab-inv',
  'segmentation',
  'shared-pages',
  'tlb',
]);

export function Diagram({ name }) {
  if (reactStages.has(name)) return <ReactStage name={name} />;
  if (mermaidStages.has(name)) return <MermaidDiagram name={name} />;
  if (graphvizStages.has(name)) return <GraphvizDiagram name={name} />;
  if (name === 'locality') return <LocalityChart />;
  if (name === 'thrashing-chart') return <ThrashingChart />;
  return <div className="diagram-error">Diagram not found: {name}</div>;
}
