import DsaLesson from './DsaLesson.jsx';
import { javaModules } from '../content/java.js';

/** Java Module 4 uses the same data-driven renderer as DSA, one topic per page. */
export default function JavaLesson({ route }) {
  return <DsaLesson route={route} modules={javaModules} extraClass="java-lesson" />;
}
