import { dsaModuleIds, dsaModules } from './dsa.js';
import { javaModuleIds, javaModules } from './java.js';

/**
 * Content catalog. New semesters, subjects, modules and concepts are added here;
 * navigation and routing are generated from this tree.
 */
export const catalog = {
  semesters: [
    {
      id: 's3',
      label: 'Semester 3',
      subjects: [
        {
          id: 'os',
          label: 'Operating Systems',
          modules: [
            {
              id: 'm4',
              label: 'Module 4 · Memory Management',
              concepts: [
                { id: 'overview', label: 'Big picture', number: '00' },
                { id: 'mindmap', label: 'Module mind map', number: '01' },
                { id: 'glossary', label: 'Glossary', number: '02' },
                { id: 'questions', label: 'Conceptual questions', number: '03' },
                { id: 'basics', label: 'Hardware & protection', number: '04' },
                { id: 'binding', label: 'Address binding', number: '05' },
                { id: 'loading', label: 'Loading, linking, swapping', number: '06' },
                { id: 'addressing', label: 'Paging & translation', number: '07' },
                { id: 'fragmentation', label: 'Contiguous & fragmentation', number: '08' },
                { id: 'paging', label: 'Paging hardware & bits', number: '09' },
                { id: 'tlb', label: 'TLB, protection, page tables', number: '10' },
                { id: 'segmentation', label: 'Segmentation', number: '11' },
                { id: 'faults', label: 'Virtual memory & faults', number: '12' },
                { id: 'replacement', label: 'Page replacement', number: '13' },
                { id: 'allocation', label: 'Frame allocation & NUMA', number: '14' },
                { id: 'thrashing', label: 'Thrashing & locality', number: '15' },
                { id: 'practice', label: 'Worked problems', number: '16' },
                { id: 'quiz', label: 'Knowledge check', number: '17' },
              ],
            },
          ],
        },
        {
          id: 'ds',
          label: 'Data Structures',
          modules: dsaModuleIds.map((id) => ({
            id,
            label: dsaModules[id].label,
            concepts: dsaModules[id].concepts.map((concept) => ({
              id: concept.id,
              label: concept.label,
              number: concept.number,
            })),
          })),
        },
        {
          id: 'java',
          label: 'Java',
          modules: javaModuleIds.map((id) => ({
            id,
            label: javaModules[id].label,
            concepts: javaModules[id].concepts.map((concept) => ({
              id: concept.id,
              label: concept.label,
              number: concept.number,
            })),
          })),
        },
      ],
    },
  ],
};

export const defaultRoute = { semester: 's3', subject: 'os', module: 'm4', concept: 'overview' };

/** Routes may stop at any level to show a semester, subject or module landing page. */
export function parseHash(hash) {
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  if (!parts.length) return defaultRoute;
  const [semester, subject, module, concept] = parts;
  for (const s of catalog.semesters) {
    if (s.id !== semester) continue;
    if (parts.length === 1) return { semester, subject: null, module: null, concept: null };
    for (const sub of s.subjects) {
      if (sub.id !== subject) continue;
      if (parts.length === 2) return { semester, subject, module: null, concept: null };
      for (const mod of sub.modules) {
        if (mod.id !== module) continue;
        if (parts.length === 3) return { semester, subject, module, concept: null };
        if (mod.concepts.some((c) => c.id === concept)) {
          return { semester, subject, module, concept };
        }
      }
    }
  }
  return defaultRoute;
}

export function routeToHash(route) {
  let hash = `#/${route.semester}`;
  if (route.subject) hash += `/${route.subject}`;
  if (route.module) hash += `/${route.module}`;
  if (route.concept) hash += `/${route.concept}`;
  return hash;
}

/** Resolve whichever levels are present in the route; missing levels stay null. */
export function describeRoute(route) {
  const semester = catalog.semesters.find((s) => s.id === route.semester) || catalog.semesters[0];
  const subject = route.subject ? semester.subjects.find((s) => s.id === route.subject) : null;
  const module = route.module && subject ? subject.modules.find((m) => m.id === route.module) : null;
  const concept = route.concept && module ? module.concepts.find((c) => c.id === route.concept) : null;
  return { semester, subject, module, concept };
}
