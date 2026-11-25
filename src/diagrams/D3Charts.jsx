import { useEffect, useRef, useState } from 'react';

let d3Promise;
function loadD3() {
  if (!d3Promise) d3Promise = import('d3');
  return d3Promise;
}

const LIGHT = {
  accent: '#0f766e',
  rose: '#be123c',
  grid: '#d6dfec',
  marker: '#ffffff',
  amber: '#b45309',
  workingSetFill: 'rgba(15, 118, 110, 0.18)',
  idleFill: 'rgba(15, 23, 42, 0.04)',
  idleBorder: '#d6dfec',
  label: '#55627a',
  text: '#172033',
};

const MINDMAP_DATA = {
  name: 'Memory management',
  tip: 'The OS gives every process a protected private address space, then maps it onto finite RAM.',
  children: [
    {
      name: 'Hardware',
      tip: 'Registers and the MMU define legal addresses and translate them at run time.',
      children: [
        { name: 'Base + limit', tip: 'Legal range is [base, base + limit); loading these registers is privileged.' },
        { name: 'MMU', tip: 'Maps CPU-generated logical addresses to physical memory on every access.' },
        { name: 'Address spaces', tip: 'Logical addresses belong to a process; physical addresses index RAM.' },
      ],
    },
    {
      name: 'Binding',
      tip: 'The moment an address becomes physical decides how freely a process can move.',
      children: [
        { name: 'Compile time', tip: 'Absolute code: fast, but any new load address forces recompilation.' },
        { name: 'Load time', tip: 'Relocatable code: the loader fixes the starting address once.' },
        { name: 'Execution time', tip: 'Dynamic relocation: the mapping can change while the process runs.' },
      ],
    },
    {
      name: 'Loading',
      tip: 'Only the work actually needed is brought into memory — at routine, library or process granularity.',
      children: [
        { name: 'Dynamic loading', tip: 'A routine is loaded the first time it is called.' },
        { name: 'Dynamic linking', tip: 'A stub resolves to a shared library routine already in memory.' },
        { name: 'Swapping', tip: 'The whole process image moves between RAM and backing store.' },
      ],
    },
    {
      name: 'Partitioning',
      tip: 'Contiguous placement is simple, but free space can become scattered.',
      children: [
        { name: 'One block', tip: 'Contiguous allocation: each process gets one unbroken block of memory.' },
        { name: 'Fit rules', tip: 'First fit, best fit and worst fit leave different hole patterns.' },
        { name: 'Free holes', tip: 'Fragmentation: internal waste is inside a block; external waste is between blocks.' },
      ],
    },
    {
      name: 'Paging',
      tip: 'Equal-size pages and frames remove external fragmentation and enable demand loading.',
      children: [
        { name: 'Pages + frames', tip: 'A logical page fits into any free physical frame of the same size.' },
        { name: 'Page tables', tip: 'Map page numbers to frame numbers; protection bits travel with them.' },
        { name: 'TLB', tip: 'A small associative cache of recent translations avoids page-table walks.' },
        { name: 'Shared pages', tip: 'Pure code can be mapped once and reused by many processes.' },
      ],
    },
    {
      name: 'Segmentation',
      tip: 'Memory is divided by meaning — code, data, stack — with a base and limit per segment.',
      children: [
        { name: 'Segment tbl', tip: 'Each entry gives the segment base address and its length.' },
        { name: 'Regions', tip: 'Programmers see named, variable-length segments rather than fixed pages.' },
        { name: 'External frag.', tip: 'Variable-length segments can leave unusable holes between them.' },
      ],
    },
    {
      name: 'Virtual memory',
      tip: 'Processes see a large private memory; only the active parts need to be resident.',
      children: [
        { name: 'Demand paging', tip: 'Pages are fetched on first reference, not at process start.' },
        { name: 'Page faults', tip: 'Validity is checked, the page is read, tables update, then the instruction retries.' },
        { name: 'COW', tip: 'After fork both processes share frames until one writes.' },
        { name: 'Replacement', tip: 'FIFO, LRU, OPT, clock, LFU and MFU choose which page leaves.' },
      ],
    },
    {
      name: 'Performance',
      tip: 'Locality determines how many frames a process truly needs.',
      children: [
        { name: 'Working set', tip: 'The pages actively used together in the current window of references.' },
        { name: 'Active set', tip: 'Balance set: the active processes whose working sets are kept in memory.' },
        { name: 'Fault frequency', tip: 'Too many faults means add frames; too few means reclaim one.' },
        { name: 'Thrashing', tip: 'Fault storms replace pages before they can be used again.' },
      ],
    },
  ],
};

const BRANCH_COLOURS = {
  Hardware: '#0f766e',
  Binding: '#7c3aed',
  Loading: '#0e7490',
  Partitioning: '#b45309',
  Paging: '#4f46e5',
  Segmentation: '#be123c',
  'Virtual memory': '#15803d',
  Performance: '#a16207',
};

const ICON_PATHS = {
  root: 'M-4,-4 h8 v8 h-8 Z M-6,-2 h2 M-6,0 h2 M-6,2 h2 M4,-2 h2 M4,0 h2 M4,2 h2 M-2,-6 v2 M0,-6 v2 M2,-6 v2 M-2,4 v2 M0,4 v2 M2,4 v2',
  Hardware: 'M-3,-3 h6 v6 h-6 Z M-5,-1 h2 M-5,1 h2 M3,-1 h2 M3,1 h2 M-1,-5 v2 M1,-5 v2 M-1,3 v2 M1,3 v2',
  Binding: 'M-3,1 a2,2 0 0 0 3,0 l2,-2 a2,2 0 0 0 -3,-3 l-1,1 M3,-1 a2,2 0 0 0 -3,0 l-2,2 a2,2 0 0 0 3,3 l1,-1',
  Loading: 'M-4,-3 h8 v6 h-8 Z M-4,-1 h8 M-1,-3 v6 M1,0 l2,0 M2,-1 l1,1 l-1,1',
  Partitioning: 'M-4,-4 h8 v8 h-8 Z M0,-4 v8 M-4,0 h8',
  Paging: 'M-4,-4 h6 v6 h-6 Z M-2,-2 h6 v6 h-6 Z M-3,0 h3 M3,-3 h3',
  Segmentation: 'M-5,-3 h10 M-4,0 h8 M-5,3 h10 M-4,-3 v6 M4,-3 v6',
  'Virtual memory': 'M-4,1 a4,3 0 0 1 8,0 M-4,1 v2 a4,3 0 0 0 8,0 V1 M-4,1 h8',
  Performance: 'M-4,3 a4,4 0 1 1 8,0 M0,3 l2,-3 M0,3 h1',
};

function utilisation(m, frames, workingSet) {
  if (frames >= workingSet) return Math.min(97, 96 * (1 - Math.exp(-0.36 * m)));
  const ratio = frames / workingSet;
  return Math.max(3, 92 * Math.pow(ratio, 2.1) * Math.exp(-0.13 * Math.max(0, m - 2)));
}

/** Replaces the hand-built SVG in the thrashing demo with a D3 scale/axis chart. */
export function ThrashingChart() {
  const ref = useRef(null);
  const dataRef = useRef({
    f: Number(document.getElementById('th-frames')?.value) || 4,
    w: Number(document.getElementById('th-ws')?.value) || 3,
    m: Number(document.getElementById('th-m')?.value) || 6,
    u: 0,
  });
  dataRef.current.u = utilisation(dataRef.current.m, dataRef.current.f, dataRef.current.w);
  const drawRef = useRef(() => {});

  useEffect(() => {
    const handler = (event) => {
      dataRef.current = event.detail;
      drawRef.current(event.detail);
    };
    window.addEventListener('th:data', handler);
    return () => window.removeEventListener('th:data', handler);
  }, []);

  useEffect(() => {
    let cancelled = false;
    loadD3().then((d3) => {
      if (cancelled || !ref.current) return;
      const draw = ({ f, w, m, u }) => {
        const svg = d3.select(ref.current).selectAll('svg').data([null]).join('svg')
          .attr('viewBox', '0 0 620 300')
          .attr('role', 'img')
          .attr('aria-label', 'CPU utilisation versus degree of multiprogramming');
        svg.selectAll('*').remove();

        const width = 620, height = 300, left = 48, right = 590, top = 25, bottom = 250;
        const x = d3.scaleLinear().domain([1, 12]).range([left, right]);
        const y = d3.scaleLinear().domain([0, 100]).range([bottom, top]);
        const points = d3.range(1, 13).map((i) => [i, utilisation(i, f, w)]);
        const colour = f >= w ? LIGHT.accent : LIGHT.rose;
        const line = d3.line().x((d) => x(d[0])).y((d) => y(d[1])).curve(d3.curveMonotoneX);
        const area = d3.area().x((d) => x(d[0])).y0(bottom).y1((d) => y(d[1])).curve(d3.curveMonotoneX);

        const defs = svg.append('defs');
        const gradient = defs.append('linearGradient').attr('id', 'th-fill').attr('x1', '0').attr('y1', '0').attr('x2', '0').attr('y2', '1');
        gradient.append('stop').attr('offset', '0%').attr('stop-color', colour).attr('stop-opacity', 0.28);
        gradient.append('stop').attr('offset', '100%').attr('stop-color', colour).attr('stop-opacity', 0);

        for (const tick of [0, 25, 50, 75, 100]) {
          svg.append('line').attr('x1', left).attr('x2', right).attr('y1', y(tick)).attr('y2', y(tick))
            .attr('stroke', LIGHT.grid);
          svg.append('text').attr('class', 'chart-label').attr('x', 8).attr('y', y(tick) + 4).text(`${tick}%`);
        }
        svg.append('path').datum(points).attr('d', area).attr('fill', 'url(#th-fill)');
        svg.append('path').datum(points).attr('d', line).attr('fill', 'none').attr('stroke', colour)
          .attr('stroke-width', 3).attr('stroke-linejoin', 'round');
        svg.append('line').attr('x1', x(m)).attr('x2', x(m)).attr('y1', bottom).attr('y2', y(u))
          .attr('stroke', colour).attr('stroke-dasharray', '4 4').attr('opacity', 0.6);
        svg.append('circle').attr('cx', x(m)).attr('cy', y(u)).attr('r', 9).attr('fill', colour).attr('opacity', 0.2);
        svg.append('circle').attr('cx', x(m)).attr('cy', y(u)).attr('r', 5).attr('fill', colour)
          .attr('stroke', LIGHT.marker).attr('stroke-width', 2);
        for (const tick of [1, 4, 8, 12]) {
          svg.append('text').attr('class', 'chart-label').attr('x', x(tick)).attr('y', 275)
            .attr('text-anchor', 'middle').text(tick);
        }
        svg.append('text').attr('class', 'chart-label').attr('x', left).attr('y', 297)
          .text('Degree of multiprogramming (processes) →');
      };
      drawRef.current = draw;
      draw(dataRef.current);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return <div className="native-diagram d3" ref={ref} aria-label="CPU utilisation chart" />;
}

/** Working-set timeline for the locality demo. */
export function LocalityChart() {
  const ref = useRef(null);
  const dataRef = useRef({
    refs: [1, 2, 5, 6, 7, 1, 2, 3, 4, 5, 4, 3, 2, 1],
    index: 13,
    window: Number(document.getElementById('loc-win')?.value) || 4,
    pages: [1, 2, 4, 5],
  });
  const drawRef = useRef(() => {});

  useEffect(() => {
    const handler = (event) => {
      dataRef.current = event.detail;
      drawRef.current(event.detail);
    };
    window.addEventListener('loc:data', handler);
    return () => window.removeEventListener('loc:data', handler);
  }, []);

  useEffect(() => {
    let cancelled = false;
    loadD3().then((d3) => {
      if (cancelled || !ref.current) return;
      const draw = ({ refs, index, window: size, pages }) => {
        const svg = d3.select(ref.current).selectAll('svg').data([null]).join('svg')
          .attr('viewBox', '0 0 620 120')
          .attr('role', 'img')
          .attr('aria-label', 'Reference string and current working set');
        svg.selectAll('*').remove();
        const x = d3.scaleBand().domain(d3.range(refs.length)).range([10, 610]).padding(0.18);
        const start = Math.max(0, index - size + 1);

        svg.append('text').attr('class', 'chart-label').attr('x', 10).attr('y', 16)
          .text(`Working-set window = ${size} references`);
        svg.append('text').attr('class', 'chart-label').attr('x', 610).attr('y', 16)
          .attr('text-anchor', 'end').text(`pages {${pages.join(', ')}}`);

        const bars = svg.selectAll('g.ref').data(refs).join('g').attr('class', 'ref')
          .attr('transform', (_, i) => `translate(${x(i)},28)`);
        bars.append('rect')
          .attr('width', x.bandwidth()).attr('height', 48).attr('rx', 6)
          .attr('fill', (d, i) => i === index ? LIGHT.amber : i >= start ? LIGHT.workingSetFill : LIGHT.idleFill)
          .attr('stroke', (d, i) => i === index ? LIGHT.amber : i >= start ? LIGHT.accent : LIGHT.idleBorder);
        bars.append('text').attr('class', 'chart-label').attr('x', x.bandwidth() / 2).attr('y', 32)
          .attr('text-anchor', 'middle').attr('fill', LIGHT.text).text((d) => d);
        bars.append('text').attr('class', 'chart-label').attr('x', x.bandwidth() / 2).attr('y', 64)
          .attr('text-anchor', 'middle').attr('fill', LIGHT.label).text((_, i) => i + 1);
      };
      drawRef.current = draw;
      draw(dataRef.current);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return <div className="native-diagram d3" ref={ref} aria-label="Working set timeline" />;
}

/** Interactive radial roadmap: D3 zoom/pan plus hover/focus tooltips. */
export function D3MindMap() {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const controlsRef = useRef({ zoomIn() {}, zoomOut() {}, reset() {} });
  const [tooltip, setTooltip] = useState(null);

  useEffect(() => {
    let cancelled = false;
    loadD3().then((d3) => {
      if (cancelled || !canvasRef.current) return;

      const width = 1000;
      const height = 680;
      const centre = [width / 2, height / 2];
      const radius = 235;
      const branchOf = (d) => d.ancestors().find((node) => node.depth === 1)?.data.name;

      const svg = d3.select(canvasRef.current).selectAll('svg').data([null]).join('svg')
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('role', 'img')
        .attr('aria-label', 'Interactive memory-management mind map');
      svg.selectAll('*').remove();

      const viewport = svg.append('g').attr('class', 'mm-viewport');
      const root = d3.hierarchy(MINDMAP_DATA);
      d3.tree().size([2 * Math.PI, radius])(root);

      viewport.append('g').attr('class', 'mm-links')
        .selectAll('path').data(root.links()).join('path')
        .attr('class', 'mm-link')
        .attr('d', d3.linkRadial().angle((d) => d.x).radius((d) => d.y))
        .attr('stroke', (d) => BRANCH_COLOURS[branchOf(d.target)] || LIGHT.accent)
        .attr('stroke-width', (d) => (d.target.depth === 1 ? 2.2 : 1.3))
        .attr('opacity', (d) => (d.target.depth === 1 ? 0.85 : 0.55));

      const angle = (d) => (d.x * 180) / Math.PI - 90;
      const flip = (d) => (d.x > Math.PI ? ' rotate(180)' : '');
      const node = viewport.append('g').attr('class', 'mm-nodes')
        .selectAll('g').data(root.descendants()).join('g')
        .attr('class', 'mm-node')
        .attr('transform', (d) => {
          if (d.depth === 0) return `translate(0,0)`;
          const [x, y] = d3.pointRadial(d.x, d.y);
          return `translate(${x},${y})`;
        })
        .attr('tabindex', 0)
        .attr('role', 'button')
        .attr('aria-label', (d) => `${d.data.name}: ${d.data.tip}`);

      const iconFor = (d) => (d.depth === 0 ? ICON_PATHS.root : d.depth === 1 ? ICON_PATHS[d.data.name] : null);

      node.filter((d) => d.depth === 0).insert('circle', ':first-child')
        .attr('class', 'mm-halo')
        .attr('r', 21)
        .attr('fill', 'none')
        .attr('stroke', LIGHT.accent)
        .attr('stroke-width', 2)
        .attr('opacity', 0.3);

      node.append('circle')
        .attr('class', 'mm-dot')
        .attr('r', (d) => (d.depth === 0 ? 16 : d.depth === 1 ? 10 : 5.5))
        .attr('fill', (d) => (d.depth === 0 ? LIGHT.text : BRANCH_COLOURS[branchOf(d)] || LIGHT.accent));

      node.filter((d) => d.depth === 2).append('circle')
        .attr('class', 'mm-centre')
        .attr('r', 1.7)
        .attr('fill', '#ffffff')
        .attr('opacity', 0.85);

      node.filter(iconFor).append('path')
        .attr('class', 'mm-icon')
        .attr('d', iconFor)
        .attr('transform', (d) => `scale(${d.depth === 0 ? 1.15 : 0.95})`);

      node.append('text')
        .attr('class', (d) => `mm-label ${d.depth === 0 ? 'mm-root-label' : d.depth === 1 ? 'mm-branch-label' : ''}`)
        .attr('transform', (d) => {
          if (d.depth === 0) return 'translate(0,-27)';
          return `rotate(${angle(d)}) translate(${d.depth === 1 ? 13 : 8},0)${flip(d)}`;
        })
        .attr('text-anchor', (d) => (d.depth === 0 ? 'middle' : d.x > Math.PI ? 'end' : 'start'))
        .attr('dy', (d) => (d.depth === 0 ? 0 : '0.32em'))
        .text((d) => d.data.name);

      const showTooltip = (event, d) => {
        const wrap = wrapRef.current.getBoundingClientRect();
        const target = event.currentTarget.getBoundingClientRect();
        setTooltip({
          name: d.data.name,
          tip: d.data.tip,
          x: Math.max(135, Math.min(target.left - wrap.left + target.width / 2, wrap.width - 135)),
          y: Math.max(8, Math.min(target.top - wrap.top + target.height + 10, wrap.height - 92)),
        });
        d3.select(event.currentTarget).classed('active', true);
      };
      const hideTooltip = (event) => {
        setTooltip(null);
        d3.select(event.currentTarget).classed('active', false);
      };

      node.on('mouseenter', showTooltip)
        .on('mouseleave', hideTooltip)
        .on('focus', showTooltip)
        .on('blur', hideTooltip);

      const initial = d3.zoomIdentity.translate(centre[0], centre[1]);
      const zoom = d3.zoom()
        .scaleExtent([0.6, 3])
        .on('zoom', (event) => viewport.attr('transform', event.transform));
      svg.call(zoom).on('dblclick.zoom', null).call(zoom.transform, initial);

      const scaleBy = (factor) => svg.transition().duration(220).call(zoom.scaleBy, factor);
      controlsRef.current = {
        zoomIn: () => scaleBy(1.3),
        zoomOut: () => scaleBy(1 / 1.3),
        reset: () => svg.transition().duration(300).call(zoom.transform, initial),
      };
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="native-diagram d3 mindmap d3-mindmap" ref={wrapRef} aria-label="Interactive module mind map">
      <div className="mm-canvas" ref={canvasRef} />
      <div className="mindmap-controls" aria-label="Mind map zoom controls">
        <button type="button" onClick={() => controlsRef.current.zoomIn()} aria-label="Zoom in">+</button>
        <button type="button" onClick={() => controlsRef.current.zoomOut()} aria-label="Zoom out">−</button>
        <button type="button" onClick={() => controlsRef.current.reset()} aria-label="Reset mind map view">Fit</button>
        <span className="mindmap-hint">Drag to pan · scroll to zoom · hover for details</span>
      </div>
      {tooltip && (
        <div className="mindmap-tooltip" style={{ left: tooltip.x, top: tooltip.y }} role="status" aria-live="polite">
          <b>{tooltip.name}</b>
          <span>{tooltip.tip}</span>
        </div>
      )}
    </div>
  );
}
