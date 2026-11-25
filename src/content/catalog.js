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
                { id: 'basics', label: 'Hardware & protection', number: '01' },
                { id: 'binding', label: 'Address binding', number: '02' },
                { id: 'loading', label: 'Loading, linking, swapping', number: '03' },
                { id: 'addressing', label: 'Paging & translation', number: '04' },
                { id: 'fragmentation', label: 'Contiguous & fragmentation', number: '05' },
                { id: 'paging', label: 'Paging hardware & bits', number: '06' },
                { id: 'tlb', label: 'TLB, protection, page tables', number: '07' },
                { id: 'segmentation', label: 'Segmentation', number: '08' },
                { id: 'faults', label: 'Virtual memory & faults', number: '09' },
                { id: 'replacement', label: 'Page replacement', number: '10' },
                { id: 'allocation', label: 'Frame allocation & NUMA', number: '11' },
                { id: 'thrashing', label: 'Thrashing & locality', number: '12' },
                { id: 'practice', label: 'Worked problems', number: '13' },
                { id: 'quiz', label: 'Knowledge check', number: '14' },
              ],
            },
          ],
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
