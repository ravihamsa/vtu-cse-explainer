import { useEffect, useMemo, useState } from 'react';
import {
  catalog,
  defaultRoute,
  describeRoute,
  parseHash,
  routeToHash,
} from './content/catalog.js';
import { sectionIds } from './content/sections.js';
import { sectionComponents } from './sections/index.js';
import DsaLesson from './components/DsaLesson.jsx';
import JavaLesson from './components/JavaLesson.jsx';
import LandingPage from './components/LandingPage.jsx';
import { mountExplainer } from './legacy/explainer.js';

function Sidebar({ activeRoute }) {
  return (
    <aside>
      <div className="brand">
        <div className="brand-mark">▦</div>
        <div>
          <h1>VTU Explainer</h1>
          <small>Semester 3 · OS + DS + Java</small>
        </div>
      </div>
      <div className="side-label">Browse by course structure</div>
      <nav id="nav">
        {catalog.semesters.map((semester) => (
          <div className="side-group" key={semester.id}>
            <a
              href={routeToHash({ semester: semester.id })}
              className={`side-group-title side-nav-link ${!activeRoute.subject ? 'active' : ''}`}
            >
              {semester.label}
            </a>
            {semester.subjects.map((subject) => (
              <div key={subject.id}>
                <a
                  href={routeToHash({ semester: semester.id, subject: subject.id })}
                  className={`side-group-title side-nav-link side-subject ${activeRoute.subject === subject.id && !activeRoute.module ? 'active' : ''}`}
                >
                  {subject.label}
                </a>
                {subject.modules.map((module) => (
                  <div className="nav-sub" key={module.id}>
                    <a
                      href={routeToHash({ semester: semester.id, subject: subject.id, module: module.id })}
                      className={`side-group-title side-nav-link ${activeRoute.subject === subject.id && activeRoute.module === module.id && !activeRoute.concept ? 'active' : ''}`}
                    >
                      {module.label}
                    </a>
                    <nav>
                      {module.concepts.map((concept) => {
                        const hash = routeToHash({
                          semester: semester.id,
                          subject: subject.id,
                          module: module.id,
                          concept: concept.id,
                        });
                        const active = concept.id === activeRoute.concept
                          && module.id === activeRoute.module
                          && subject.id === activeRoute.subject;
                        return (
                          <a key={concept.id} href={hash} className={active ? 'active' : undefined}>
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
  const details = useMemo(() => describeRoute(route), [route]);
  const hasModule = Boolean(route.module);
  const isOs = hasModule && route.subject === 'os';
  const isJava = hasModule && route.subject === 'java';
  const activeIds = useMemo(() => {
    if (!hasModule) return [];
    if (isOs) return sectionIds;
    return details.module?.concepts.map((concept) => concept.id) || [];
  }, [hasModule, isOs, details.module]);

  useEffect(() => {
    if (!window.location.hash) {
      window.history.replaceState(null, '', routeToHash(defaultRoute));
    }
    const onHashChange = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // The legacy OS controller owns all OS demos; it must not touch DSA or Java markup.
  useEffect(() => {
    if (!isOs) return undefined;
    const dispose = mountExplainer();
    return dispose;
  }, [isOs]);

  useEffect(() => {
    if (!route.concept) {
      setActiveConcept(null);
      return;
    }
    const target = document.getElementById(route.concept);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveConcept(route.concept);
  }, [route.concept]);

  useEffect(() => {
    const update = () => {
      const root = document.documentElement;
      const max = root.scrollHeight - root.clientHeight;
      setProgress(max > 0 ? (root.scrollTop / max) * 100 : 0);
      if (!activeIds.length) return;
      let current = activeIds[0];
      for (const id of activeIds) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 140) current = id;
      }
      setActiveConcept(current);
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  }, [activeIds]);

  const breadcrumb = [
    details.semester.label,
    details.subject?.label,
    details.module?.label,
    details.concept?.label,
  ].filter(Boolean).join(' › ');

  return (
    <>
      <div id="progress" style={{ width: `${progress}%` }} />
      <div className="layout">
        <Sidebar activeRoute={route} />
        <main>
          <div className="breadcrumb"><b>Current concept</b> {breadcrumb}</div>
          {!hasModule ? (
            <LandingPage route={route} />
          ) : isOs ? (
            sectionComponents.map(({ id, Component }) => <Component key={id} />)
          ) : isJava ? (
            details.module.concepts.map((concept) => (
              <JavaLesson key={concept.id} route={{ ...route, concept: concept.id }} />
            ))
          ) : (
            details.module.concepts.map((concept) => (
              <DsaLesson
                key={concept.id}
                route={{ ...route, concept: concept.id }}
              />
            ))
          )}
          <footer>
            Built for VTU CSE semester 3 · {details.subject?.label || 'choose a subject'} · {details.module?.label || 'choose a module'}. Extend from <code>src/content/catalog.js</code>.
          </footer>
        </main>
      </div>
    </>
  );
}
