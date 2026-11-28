import { useMemo, useState } from 'react';
import { dsaModules } from '../content/dsa.js';
import { Diagram, D3MindMap } from '../diagrams/index.jsx';
import '../dsa.css';

function Inline({ text }) {
  return String(text)
    .split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
    .filter(Boolean)
    .map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>;
      if (part.startsWith('`') && part.endsWith('`')) return <code key={i}>{part.slice(1, -1)}</code>;
      return <span key={i}>{part}</span>;
    });
}

function DsaReactStage({ items, caption }) {
  return (
    <figure className="dsa-figure">
      <div className="react-stage dsa-stage cells">
        {items.map((item, i) => (
          <div className="stage-node" key={`${item.title}-${i}`}>
            <span className="stage-index">{String(i + 1).padStart(2, '0')}</span>
            <b>{item.title}</b>
            {item.detail && <span>{item.detail}</span>}
          </div>
        ))}
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

function Stepper({ title, steps }) {
  const [index, setIndex] = useState(0);
  const step = steps[index];
  return (
    <div className="dsa-stepper">
      <div className="dsa-stepper-head">
        <b>{title}</b>
        <span>{index + 1} / {steps.length}</span>
      </div>
      <div className="dsa-stepper-body" aria-live="polite">
        <strong>{step.title}</strong>
        <p>{step.text}</p>
      </div>
      <div className="controls">
        <button type="button" disabled={index === 0} onClick={() => setIndex((i) => i - 1)}>← Previous</button>
        <button type="button" disabled={index === steps.length - 1} onClick={() => setIndex((i) => i + 1)}>Next step →</button>
      </div>
    </div>
  );
}

function shuffle(list) {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function DsaQuiz({ questions }) {
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState(null);
  const [score, setScore] = useState(0);
  const [seed, setSeed] = useState(0);
  const prepared = useMemo(
    () => shuffle(questions).map((q) => {
      const correct = q.options[q.answer];
      return { q: q.q, why: q.why, correct, options: shuffle(q.options) };
    }),
    [questions, seed]
  );
  const question = prepared[index];
  const done = !question;

  const choose = (option) => {
    if (choice !== null) return;
    setChoice(option);
    if (option === question.correct) setScore((s) => s + 1);
  };

  if (done) {
    return (
      <div className="dsa-quiz done">
        <div className="quiz-score">{score} / {prepared.length}</div>
        <h3>Nice work!</h3>
        <p>Review any concept from the sidebar, then try another shuffled round.</p>
        <button type="button" onClick={() => { setIndex(0); setChoice(null); setScore(0); setSeed((s) => s + 1); }}>Try again with a new order</button>
      </div>
    );
  }

  return (
    <div className="dsa-quiz">
      <div className="quiz-head">
        <span>Question {index + 1} of {prepared.length}</span>
        <span>Score {score}</span>
      </div>
      <div className="quiz-progress"><i style={{ width: `${((index + 1) / prepared.length) * 100}%` }} /></div>
      <h3>{question.q}</h3>
      <div className="dsa-options">
        {question.options.map((option) => {
          const state = choice === null ? '' : option === question.correct ? 'right' : option === choice ? 'wrong' : 'muted';
          return (
            <button
              type="button"
              key={option}
              className={`dsa-q-option ${state}`}
              onClick={() => choose(option)}
              disabled={choice !== null}
            >
              {option}
            </button>
          );
        })}
      </div>
      {choice !== null && (
        <div className={`dsa-q-feedback ${choice === question.correct ? 'ok' : 'bad'}`}>
          <b>{choice === question.correct ? 'Correct.' : `Answer: ${question.correct}.`}</b> {question.why}
        </div>
      )}
      <div className="controls">
        <button type="button" disabled={choice === null} onClick={() => { setIndex((i) => i + 1); setChoice(null); }}>
          Next question →
        </button>
      </div>
    </div>
  );
}

function Block({ block, moduleData, route }) {
  switch (block.t) {
    case 'p':
      return (Array.isArray(block.text) ? block.text : [block.text]).map((text, i) => (
        <p key={i}><Inline text={text} /></p>
      ));
    case 'list':
      return (
        <div className="dsa-list-block">
          {block.title && <h3>{block.title}</h3>}
          <ul>{block.items.map((item, i) => <li key={i}><Inline text={item} /></li>)}</ul>
        </div>
      );
    case 'cards':
      return (
        <div className="card-grid">
          {block.items.map((item, i) => (
            <div className="card dsa-card" key={i}>
              {item.badge && <span className="badge">{item.badge}</span>}
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      );
    case 'table':
      return (
        <figure className="dsa-figure">
          <div className="table-wrap">
            <table>
              <thead><tr>{block.head.map((cell, i) => <th key={i}>{cell}</th>)}</tr></thead>
              <tbody>
                {block.rows.map((row, i) => (
                  <tr key={i}>{row.map((cell, j) => <td key={j}><Inline text={cell} /></td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
          {block.caption && <figcaption>{block.caption}</figcaption>}
        </figure>
      );
    case 'diagram':
      if (block.kind === 'react') return <DsaReactStage items={block.items} caption={block.caption} />;
      return (
        <figure className="dsa-figure">
          <Diagram name={block.name} />
          {block.caption && <figcaption>{block.caption}</figcaption>}
        </figure>
      );
    case 'steps':
      return <Stepper title={block.title} steps={block.steps} />;
    case 'code':
      return (
        <figure className="dsa-figure">
          <pre className="dsa-code"><code>{block.code}</code></pre>
          <figcaption>{block.title}</figcaption>
        </figure>
      );
    case 'callout':
      return (
        <aside className="dsa-callout">
          <b>{block.title}</b>
          <p><Inline text={block.text} /></p>
        </aside>
      );
    case 'example':
      return (
        <aside className="dsa-example">
          <span className="example-mark">●</span>
          <div>
            <b>{block.title}</b>
            <p><Inline text={block.text} /></p>
            {block.items && <ul>{block.items.map((item, i) => <li key={i}>{item}</li>)}</ul>}
          </div>
        </aside>
      );
    case 'formula':
      return (
        <div className="dsa-formula">
          <code>{block.text}</code>
          {block.note && <span>{block.note}</span>}
        </div>
      );
    case 'mindmap':
      return (
        <D3MindMap
          data={moduleData.mindmap}
          branchColours={moduleData.branchColours}
          icons={moduleData.icons}
          route={route}
          label={`Interactive ${moduleData.label} mind map`}
        />
      );
    case 'glossary':
      return (
        <dl className="glossary dsa-glossary">
          {moduleData.glossary.map(([term, meaning]) => (
            <div key={term}><dt>{term}</dt><dd>{meaning}</dd></div>
          ))}
        </dl>
      );
    case 'questions':
      return (
        <ol className="concept-questions dsa-questions">
          {moduleData.questions.map((question, i) => <li key={i}>{question}</li>)}
        </ol>
      );
    case 'quiz':
      return <DsaQuiz questions={moduleData.quiz} />;
    default:
      return null;
  }
}

export default function DsaLesson({ route }) {
  const moduleData = dsaModules[route.module];
  const concept = moduleData?.concepts.find((item) => item.id === route.concept) || moduleData?.concepts[0];
  if (!moduleData || !concept) return null;

  return (
    <section id={concept.id} className="lesson-section dsa-lesson">
      <div className="eyebrow">{concept.number} · {concept.kicker}</div>
      <h2>{concept.title}</h2>
      {concept.blocks.map((block, i) => (
        <Block key={i} block={block} moduleData={moduleData} route={route} />
      ))}
    </section>
  );
}
