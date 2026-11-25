import { useEffect, useRef } from 'react';

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
