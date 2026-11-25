import OverviewSection from './OverviewSection.jsx';
import MindMapSection from './MindMapSection.jsx';
import BasicsSection from './BasicsSection.jsx';
import BindingSection from './BindingSection.jsx';
import LoadingSection from './LoadingSection.jsx';
import AddressingSection from './AddressingSection.jsx';
import FragmentationSection from './FragmentationSection.jsx';
import PagingSection from './PagingSection.jsx';
import TlbSection from './TlbSection.jsx';
import SegmentationSection from './SegmentationSection.jsx';
import FaultsSection from './FaultsSection.jsx';
import ReplacementSection from './ReplacementSection.jsx';
import AllocationSection from './AllocationSection.jsx';
import ThrashingSection from './ThrashingSection.jsx';
import PracticeSection from './PracticeSection.jsx';
import QuestionsSection from './QuestionsSection.jsx';
import QuizSection from './QuizSection.jsx';

export const sectionComponents = [
  { id: 'overview', Component: OverviewSection },
  { id: 'mindmap', Component: MindMapSection },
  { id: 'basics', Component: BasicsSection },
  { id: 'binding', Component: BindingSection },
  { id: 'loading', Component: LoadingSection },
  { id: 'addressing', Component: AddressingSection },
  { id: 'fragmentation', Component: FragmentationSection },
  { id: 'paging', Component: PagingSection },
  { id: 'tlb', Component: TlbSection },
  { id: 'segmentation', Component: SegmentationSection },
  { id: 'faults', Component: FaultsSection },
  { id: 'replacement', Component: ReplacementSection },
  { id: 'allocation', Component: AllocationSection },
  { id: 'thrashing', Component: ThrashingSection },
  { id: 'practice', Component: PracticeSection },
  { id: 'questions', Component: QuestionsSection },
  { id: 'quiz', Component: QuizSection },
];
