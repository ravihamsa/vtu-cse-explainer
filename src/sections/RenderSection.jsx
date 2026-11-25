import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { sections } from '../content/sections.js';
import { Diagram } from '../diagrams/index.jsx';

/**
 * Renders the static lesson markup, then mounts each diagram into its slot.
 * Keeping the markup from the original explainer preserves every working demo.
 */
export default function RenderSection({ id }) {
  const rootRef = useRef(null);
  const [portals, setPortals] = useState([]);

  const prepared = useMemo(() => {
    const slots = [];
    const html = sections[id].body.replace(/<!--DIAGRAM:([^>]+)-->/g, (_, name) => {
      const slotId = `${id}-diagram-${slots.length}`;
      slots.push({ slotId, name });
      return `<span class="diagram-slot" id="${slotId}"></span>`;
    });
    return { html, slots };
  }, [id]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.innerHTML = prepared.html;
    setPortals(
      prepared.slots
        .map(({ slotId, name }) => {
          const target = root.querySelector(`#${slotId}`);
          return target ? createPortal(<Diagram name={name} />, target, slotId) : null;
        })
        .filter(Boolean)
    );
  }, [prepared, id]);

  return (
    <section
      id={id}
      className={sections[id].attrs.includes('hero') ? 'hero' : undefined}
      ref={rootRef}
    >
      {portals}
    </section>
  );
}
