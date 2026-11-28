import { catalog, routeToHash } from '../content/catalog.js';
import '../landing.css';

const SUBJECT_ICONS = { os: '◎', ds: '▦', java: '☕' };

function LandingCard({ to, number, title, detail, badge }) {
  return (
    <a className="landing-card" href={to}>
      <div className="landing-card-top">
        <span className="landing-num">{number}</span>
        {badge && <span className="landing-badge">{badge}</span>}
      </div>
      <b>{title}</b>
      <span>{detail}</span>
      <em>Open →</em>
    </a>
  );
}

export default function LandingPage({ route }) {
  const semester = catalog.semesters.find((item) => item.id === route.semester) || catalog.semesters[0];
  const subject = route.subject ? semester.subjects.find((item) => item.id === route.subject) : null;
  const module = route.module && subject ? subject.modules.find((item) => item.id === route.module) : null;

  if (!subject) {
    return (
      <section className="landing-page">
        <div className="eyebrow">Course structure · level 1</div>
        <h2>{semester.label}: choose a subject</h2>
        <p>Each subject has its own module landing page, then topic pages inside every module.</p>
        <div className="landing-grid">
          {semester.subjects.map((item) => (
            <LandingCard
              key={item.id}
              to={routeToHash({ semester: semester.id, subject: item.id })}
              number={SUBJECT_ICONS[item.id] || '•'}
              title={item.label}
              detail={`${item.modules.length} module${item.modules.length === 1 ? '' : 's'} available`}
              badge="Subject"
            />
          ))}
        </div>
      </section>
    );
  }

  if (!module) {
    return (
      <section className="landing-page">
        <div className="eyebrow">Course structure · level 2</div>
        <h2>{subject.label}: choose a module</h2>
        <p>Open a module to see its topic list, mind map, glossary, questions and quiz.</p>
        <div className="landing-grid">
          {subject.modules.map((item) => (
            <LandingCard
              key={item.id}
              to={routeToHash({ semester: semester.id, subject: subject.id, module: item.id })}
              number={item.id.toUpperCase()}
              title={item.label}
              detail={`${item.concepts.length} topic pages`}
              badge="Module"
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="landing-page">
      <div className="eyebrow">Course structure · level 3</div>
      <h2>{module.label}: choose a topic</h2>
      <p>Every card opens one focused page. Use the mind map if you want the whole module first.</p>
      <div className="landing-grid landing-grid-topics">
        {module.concepts.map((item) => (
          <LandingCard
            key={item.id}
            to={routeToHash({ semester: semester.id, subject: subject.id, module: module.id, concept: item.id })}
            number={item.number}
            title={item.label}
            detail={`${subject.label} · ${module.label}`}
            badge={item.id === 'quiz' ? 'Quiz' : undefined}
          />
        ))}
      </div>
    </section>
  );
}
