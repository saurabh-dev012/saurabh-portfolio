import SectionHeading from '../components/SectionHeading';
import { skillGroups } from '../data/content';

export default function Skills() {
  const abbreviations = { HTML: 'H5', CSS: 'C3', JavaScript: 'JS', React: 'Re', 'Redux Toolkit': 'RT', Vite: 'Vi', 'Node.js': 'N', 'Express.js': 'Ex', Python: 'Py', C: 'C', Java: 'Ja' };
  return <section className="section page-shell" id="skills" aria-labelledby="skills-title"><SectionHeading eyebrow="Tools I work with" title="Technical skills" id="skills-title" />
    <div className="skill-grid">{skillGroups.flatMap(group => group.skills).map(skill => <div className="skill-item" key={skill}><span aria-hidden="true">{abbreviations[skill]}</span><small>{skill}</small></div>)}</div>
  </section>;
}
