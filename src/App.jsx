import { useEffect, useMemo, useState } from 'react';
import { catalog, defaultRoute, parseHash, routeToHash } from './content/catalog.js';
import { sectionIds } from './content/sections.js';
import { sectionComponents } from './sections/index.js';
import { mountExplainer } from './legacy/explainer.js';

function Sidebar({ activeConcept }) {
  return (
    <aside>
      <div className="brand">
        <div className="brand-mark">▦</div>
        <div>
          <h1>VTU Explainer</h1>
          <small>Operating Systems · Sem 3</small>
        </div>
      </div>
      <div className="side-label">Browse by course structure</div>
      <nav id="nav">
        {catalog.semesters.map((semester) => (
          <div className="side-group" key={semester.id}>
            <div className="side-group-title">{semester.label}</div>
            {semester.subjects.map((subject) => (
              <div key={subject.id}>
                <div className="side-group-title" style={{ color: '#94a3bb' }}>{subject.label}</div>
                {subject.modules.map((module) => (
                  <div className="nav-sub" key={module.id}>
                    <div className="side-group-title">{module.label}</div>
                    <nav>
                      {module.concepts.map((concept) => {
                        const hash = routeToHash({
                          semester: semester.id,
                          subject: subject.id,
                          module: module.id,
                          concept: concept.id,
                        });
                        return (
                          <a
                            key={concept.id}
                            href={hash}
                            className={concept.id === activeConcept ? 'active' : undefined}
                          >
                            <span className="num">{concept.number}</span>
                            {concept.label}
                          </a>
                        );
                      })}
                    </nav>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </nav>
      <div className="side-foot">
        <span>No installs. No dependencies. Just experiment.</span>
        <button onClick={() => window.print()}>Print / Save PDF</button>
        <button id="motion-toggle" aria-pressed="false">Motion: on</button>
      </div>
    </aside>
  );
}

export default function App() {
  const [route, setRoute] = useState(() => parseHash(window.location.hash));
  const [activeConcept, setActiveConcept] = useState(route.concept);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!window.location.hash) {
      window.history.replaceState(null, '', routeToHash(defaultRoute));
    }
    const onHashChange = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    const dispose = mountExplainer();
    return dispose;
  }, []);

  useEffect(() => {
    const target = document.getElementById(route.concept);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveConcept(route.concept);
  }, [route.concept]);

  useEffect(() => {
    const update = () => {
      const root = document.documentElement;
      const max = root.scrollHeight - root.clientHeight;
      setProgress(max > 0 ? (root.scrollTop / max) * 100 : 0);
      let current = sectionIds[0];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 140) current = id;
      }
      setActiveConcept(current);
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  }, []);

  const breadcrumb = useMemo(() => {
    const module = catalog.semesters[0].subjects[0].modules[0];
    const concept = module.concepts.find((c) => c.id === route.concept) || module.concepts[0];
    return `${catalog.semesters[0].label} › ${catalog.semesters[0].subjects[0].label} › ${module.label} › ${concept.label}`;
  }, [route.concept]);

  return (
    <>
      <div id="progress" style={{ width: `${progress}%` }} />
      <div className="layout">
        <Sidebar activeConcept={activeConcept} />
        <main>
          <div className="breadcrumb"><b>Current concept</b> {breadcrumb}</div>
          {sectionComponents.map(({ id, Component }) => (
            <Component key={id} />
          ))}
          <footer>Built for VTU CSE semester 3 · Operating Systems · Module 4. Extend from <code>src/content/catalog.js</code>.</footer>
        </main>
      </div>
    </>
  );
}
