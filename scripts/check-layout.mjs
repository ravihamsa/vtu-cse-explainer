/**
 * Dev helper: opens the built app in headless Chrome and reports any diagram
 * text that escapes its container or visibly overlaps another text node.
 *
 * Run while `npm run preview` is serving the app:
 *   node scripts/check-layout.mjs
 */
const targets = await (await fetch('http://127.0.0.1:9222/json')).json();
const page = targets.find((t) => t.type === 'page' && t.url.includes('127.0.0.1:4173'));
if (!page) throw new Error('No preview page target found on Chrome port 9222');

const socket = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener('open', resolve, { once: true });
  socket.addEventListener('error', reject, { once: true });
});

const expression = `(() => {
  const roots = [...document.querySelectorAll('.native-diagram, .react-stage')];
  const issues = [];
  for (const root of roots) {
    /* Mermaid canvases are deliberately wider than the visible card; compare
       text against the canvas so horizontal scrolling is not a false issue. */
    const boundsEl = root.querySelector('.mermaid-canvas') || root;
    const rb = boundsEl.getBoundingClientRect();
    const texts = [...root.querySelectorAll('text, .stage-node b, .stage-node span, .stage-node em, .hw-box b, .hw-bits span, .limit-zone b, .limit-zone span, .frag-side b, .frag-side span, .swap-panel b, .swap-panel span')]
      .filter((e) => e.textContent.trim() && !e.querySelector('text, b, span, em'));
    for (const el of texts) {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      if (r.left < rb.left - 2 || r.right > rb.right + 2 || r.top < rb.top - 2 || r.bottom > rb.bottom + 2)
        issues.push({ diagram: root.className, kind: 'outside', text: el.textContent.trim().slice(0, 40) });
      for (const other of texts) {
        if (other === el || el.compareDocumentPosition(other) & Node.DOCUMENT_POSITION_CONTAINS) continue;
        const o = other.getBoundingClientRect();
        const ox = Math.min(r.right, o.right) - Math.max(r.left, o.left);
        const oy = Math.min(r.bottom, o.bottom) - Math.max(r.top, o.top);
        if (ox > 4 && oy > 4)
          issues.push({ diagram: root.className, kind: 'overlap', text: el.textContent.trim().slice(0, 25), with: other.textContent.trim().slice(0, 25) });
      }
    }
  }
  return { diagrams: roots.length, total: issues.length, issues: issues.slice(0, 30) };
})()`;

socket.send(JSON.stringify({ id: 1, method: 'Runtime.evaluate', params: { expression, returnByValue: true } }));
const result = await new Promise((resolve) => {
  socket.addEventListener('message', (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id === 1) resolve(msg.result?.result?.value);
  });
});
socket.close();
console.log(JSON.stringify(result, null, 2));
