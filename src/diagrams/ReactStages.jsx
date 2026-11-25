/**
 * Textbook-style diagrams built from real DOM elements.
 * These are the stages where the original explainer animated tokens over a
 * diagram, so the animated targets stay real elements rather than hotspots.
 */
const columns = (items, className) => (
  <div className={`react-stage ${className}`}>
    {items.map((item, i) => (
      <div className="stage-node" key={item.title}>
        <span className="stage-index">{String(i + 1).padStart(2, '0')}</span>
        <b>{item.title}</b>
        <span>{item.detail}</span>
        {item.speed && <em>{item.speed}</em>}
      </div>
    ))}
  </div>
);

export function ReactStage({ name }) {
  switch (name) {
    case 'hierarchy':
      return columns(
        [
          { title: 'CPU registers', detail: 'instruction operands', speed: '~1 ns' },
          { title: 'L1 / L2 cache', detail: 'recent lines', speed: '~4 ns' },
          { title: 'Main memory', detail: 'resident pages', speed: '~100 ns' },
          { title: 'SSD / disk', detail: 'backing store', speed: '~8 ms' },
        ],
        'hierarchy'
      );
    case 'binding':
      return columns(
        [
          { title: 'Symbolic name', detail: 'source program' },
          { title: 'Relocatable', detail: 'compiler output' },
          { title: 'Absolute', detail: 'loader output' },
          { title: 'Physical', detail: 'MMU at run time' },
        ],
        'binding'
      );
    case 'page-fault':
      return columns(
        [
          { title: 'CPU', detail: 'virtual address' },
          { title: 'MMU', detail: 'invalid PTE → trap' },
          { title: 'RAM', detail: 'choose a frame' },
          { title: 'Disk', detail: 'fetch the page' },
        ],
        'page-fault'
      );
    case 'base-limit':
      return (
        <div className="react-stage base-limit">
          <div className="limit-zone below">
            <b>Below base</b>
            <span>trap</span>
          </div>
          <div className="limit-zone legal">
            <b>Legal range</b>
            <span>base ≤ addr &lt; base + limit</span>
          </div>
          <div className="limit-zone above">
            <b>Above limit</b>
            <span>trap</span>
          </div>
          <div className="limit-ticks">
            <span>0</span>
            <span>base</span>
            <span>base + limit</span>
            <span>max</span>
          </div>
        </div>
      );
    case 'swap':
      return (
        <div className="react-stage swap">
          <div className="swap-panel mem">
            <b>Main memory</b>
            <span>resident processes</span>
          </div>
          <div className="swap-arrow">
            <span>swap out / in</span>
            <i />
          </div>
          <div className="swap-panel disk">
            <b>Backing store</b>
            <span>idle processes</span>
          </div>
        </div>
      );
    case 'fragmentation':
      return (
        <div className="react-stage fragmentation">
          <div className="frag-side">
            <b>Fixed partitions</b>
            <div className="frag-row">
              <i className="used">P1</i>
              <i className="waste">waste</i>
              <i className="used">P2</i>
              <i className="waste">waste</i>
            </div>
            <span>Internal waste: allocated block larger than the request.</span>
          </div>
          <div className="frag-side">
            <b>Variable partitions</b>
            <div className="frag-row">
              <i className="used">P1</i>
              <i className="hole" />
              <i className="used">P2</i>
              <i className="hole" />
            </div>
            <span>External waste: many small holes no request can use.</span>
          </div>
        </div>
      );
    case 'paging-hardware':
      return (
        <div className="react-stage paging-hardware">
          <div className="hw-box">
            <b>Virtual address</b>
            <div className="hw-bits"><span>page p</span><span className="off">offset o</span></div>
          </div>
          <div className="hw-arrow">→</div>
          <div className="hw-box">
            <b>Page table</b>
            <div className="hw-table"><i>p → f</i><i>valid / protection</i></div>
          </div>
          <div className="hw-arrow">→</div>
          <div className="hw-box">
            <b>Physical address</b>
            <div className="hw-bits"><span>frame f</span><span className="off">offset o</span></div>
          </div>
        </div>
      );
    default:
      return null;
  }
}
