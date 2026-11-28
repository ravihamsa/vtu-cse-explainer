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

/** Only the semester and subject levels are landing pages; modules render inline lessons. */
export default function LandingPage({ route }) {
  const semester = catalog.semesters.find((item) => item.id === route.semester) || catalog.semesters[0];
  const subject = route.subject ? semester.subjects.find((item) => item.id === route.subject) : null;

  if (!subject) {
    return (
      <section className="landing-page">
        <div className="eyebrow">Course structure · level 1</div>
        <h2>{semester.label}: choose a subject</h2>
        <p>Each subject lists its modules. Opening a module shows the whole lesson inline.</p>
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

  return (
    <section className="landing-page">
      <div className="eyebrow">Course structure · level 2</div>
      <h2>{subject.label}: choose a module</h2>
      <p>Module pages contain the mind map, glossary, questions, topics and quiz on one inline page.</p>
      <div className="landing-grid">
        {subject.modules.map((item) => (
          <LandingCard
            key={item.id}
            to={routeToHash({ semester: semester.id, subject: subject.id, module: item.id })}
            number={item.id.toUpperCase()}
            title={item.label}
            detail={`Inline lesson · ${item.concepts.length} topics`}
            badge="Module"
          />
        ))}
      </div>
    </section>
  );
}
