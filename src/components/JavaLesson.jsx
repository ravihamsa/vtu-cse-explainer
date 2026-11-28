import DsaLesson from './DsaLesson.jsx';
import { javaModules } from '../content/java.js';

/** Java Module 4 sections use the same data-driven renderer as DSA. */
export default function JavaLesson({ route }) {
  return <DsaLesson route={route} modules={javaModules} extraClass="java-lesson" />;
}
