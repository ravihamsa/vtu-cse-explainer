/**
 * Headless browser smoke test for the built app.
 * Requires `npm run preview` and Chrome with --remote-debugging-port=9222.
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const targets = await (await fetch('http://127.0.0.1:9222/json')).json();
const page = targets.find((t) => t.type === 'page' && t.url.includes('127.0.0.1:4173'));
if (!page) throw new Error('No preview page target found on Chrome port 9222');

const socket = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener('open', resolve, { once: true });
  socket.addEventListener('error', reject, { once: true });
});

let id = 0;
const pending = new Map();
const exceptions = [];
socket.addEventListener('message', (event) => {
  const msg = JSON.parse(event.data);
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg);
    pending.delete(msg.id);
  }
  if (msg.method === 'Runtime.exceptionThrown') exceptions.push(msg.params.exceptionDetails.text);
});
const send = (method, params = {}) =>
  new Promise((resolve) => {
    const commandId = ++id;
    pending.set(commandId, resolve);
    socket.send(JSON.stringify({ id: commandId, method, params }));
  });
const evaluate = async (expression) => {
  const response = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (response.result?.exceptionDetails) throw new Error(response.result.exceptionDetails.text);
  return response.result?.result?.value;
};

await send('Runtime.enable');
await send('Page.enable');
await send('Page.reload', { ignoreCache: true });
await sleep(3500);

const checks = [];
const check = async (name, expression, expected) => {
  const value = await evaluate(expression);
  const ok = typeof expected === 'function' ? expected(value) : value === expected;
  checks.push({ name, ok, value });
};

await check('diagram svgs rendered', `document.querySelectorAll('.native-diagram svg').length`, (n) => n >= 11);
await check('module mind map', `!!document.querySelector('.native-diagram.d3-mindmap svg')`, true);
const beforeZoom = await evaluate(`document.querySelector('.mm-viewport').getAttribute('transform')`);
await evaluate(`document.querySelector('[aria-label="Zoom in"]').click()`);
await sleep(300);
await check('mind map zoom', `document.querySelector('.mm-viewport').getAttribute('transform')`, (v) => v !== beforeZoom);
await evaluate(`document.querySelector('.mm-node').dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))`);
await check('mind map tooltip', `document.querySelector('.mindmap-tooltip b')?.textContent`, (v) => !!v);
await evaluate(`document.querySelector('.mm-node').dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }))`);
await check('glossary terms', `document.querySelectorAll('.glossary dt').length`, 24);
await check('conceptual questions', `document.querySelectorAll('.concept-questions li').length`, 15);
await check('replacement faults', `document.getElementById('rp-faults').textContent`, '12');
await check('TLB EAT', `document.getElementById('eat-value').textContent`, '140.0 ns');
await check('thrashing utilisation', `document.getElementById('th-util').textContent`, (v) => v.endsWith('%'));

await evaluate(`(() => {
  document.getElementById('fr-size').value = '12';
  document.getElementById('fr-strategy').value = 'first';
  document.getElementById('fr-alloc').click();
})()`);
await sleep(150);
await check('fragmentation allocation', `document.getElementById('fr-used').textContent`, '12K');

await evaluate(`(() => {
  document.getElementById('hw-addr').value = '50000';
  document.getElementById('hw-check').click();
  document.getElementById('seg-num').value = '0';
  document.getElementById('seg-off').value = '1222';
  document.getElementById('seg-check').click();
})()`);
await sleep(150);
await check('base/limit trap', `document.getElementById('hw-result').textContent`, (v) => v.includes('TRAP'));
await check('segment limit trap', `document.getElementById('seg-result').textContent`, (v) => v.includes('TRAP'));

await evaluate(`document.getElementById('cow-write').click()`);
await sleep(500);
await check('copy-on-write state', `document.getElementById('cow-result').textContent`, (v) => v.includes('COW fault handled'));
await check('copy-on-write diagram swap', `document.querySelector('.mermaid.cow-shared').textContent`, (v) => v.includes('New private frame'));

await evaluate(`(() => {
  document.getElementById('rp-step').click();
  document.getElementById('rp-step').click();
})()`);
await sleep(200);
await check('replacement stepping', `document.getElementById('rp-progress').textContent`, (v) => v.startsWith('2/'));

await check('quiz bank size', `document.querySelectorAll('#q-progress i').length`, 107);
await evaluate(`document.querySelector('#quiz .opt').click()`);
await sleep(100);
await check('quiz feedback', `document.getElementById('q-feedback').textContent.length`, (n) => n > 20);
checks.push({ name: 'no runtime exceptions', ok: exceptions.length === 0, value: exceptions.length });

socket.close();
console.log(JSON.stringify({ passed: checks.filter((c) => c.ok).length, total: checks.length, checks, exceptions }, null, 2));
if (checks.some((c) => !c.ok)) process.exitCode = 1;
