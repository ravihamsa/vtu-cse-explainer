import { dsaModuleIds, dsaModules } from './dsa.js';

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
      ],
    },
  ],
};

export const defaultRoute = { semester: 's3', subject: 'os', module: 'm4', concept: 'overview' };

export function parseHash(hash) {
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  if (parts.length < 4) return defaultRoute;
  const [semester, subject, module, concept] = parts;
  for (const s of catalog.semesters) {
    if (s.id !== semester) continue;
    for (const sub of s.subjects) {
      if (sub.id !== subject) continue;
      for (const mod of sub.modules) {
        if (mod.id === module && mod.concepts.some((c) => c.id === concept)) {
          return { semester, subject, module, concept };
        }
      }
    }
  }
  return defaultRoute;
}

export function routeToHash(route) {
  return `#/${route.semester}/${route.subject}/${route.module}/${route.concept}`;
}

/** Resolve a route to its semester, subject, module and concept objects. */
export function describeRoute(route) {
  const semester = catalog.semesters.find((s) => s.id === route.semester) || catalog.semesters[0];
  const subject = semester.subjects.find((s) => s.id === route.subject) || semester.subjects[0];
  const module = subject.modules.find((m) => m.id === route.module) || subject.modules[0];
  const concept = module.concepts.find((c) => c.id === route.concept) || module.concepts[0];
  return { semester, subject, module, concept };
}
