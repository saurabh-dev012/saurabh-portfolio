import SectionHeading from '../components/SectionHeading';
import { skillGroups } from '../data/content';

const iconNames = {
  HTML: 'html5',
  CSS: 'css3',
  JavaScript: 'javascript',
  React: 'react',
  'Redux Toolkit': 'redux',
  Vite: 'vitejs',
  'Node.js': 'nodejs',
  'Express.js': 'express',
  Python: 'python',
  C: 'c',
  Java: 'java',
  'Tailwind CSS': 'tailwindcss',
  Markdown: 'markdown',
  Git: 'git',
  GitHub: 'github',
  'VS Code': 'vscode',
};

export default function Skills() {
  const skills = skillGroups.flatMap(group => group.skills);

  return <section className="section skills-section" id="skills" aria-labelledby="skills-title">
    <SectionHeading title="Technical skills" id="skills-title" />
    <div className="skill-grid">
      {skills.map(skill => <div className="skill-item" key={skill} title={skill} aria-label={skill}>
        <span className="skill-icon" aria-hidden="true">
          <img src={`https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${iconNames[skill]}/${iconNames[skill]}-original.svg`} alt="" loading="lazy" onError={event => { event.currentTarget.hidden = true; event.currentTarget.parentElement.classList.add('is-fallback'); }} />
          <span className="skill-fallback">{skill === 'JavaScript' ? 'JS' : skill === 'Redux Toolkit' ? 'R' : skill === 'Tailwind CSS' ? 'TW' : skill === 'Express.js' ? 'EX' : skill === 'Node.js' ? 'N' : skill.slice(0, 2).toUpperCase()}</span>
        </span>
        <span className="sr-only">{skill}</span>
      </div>)}
    </div>
  </section>;
}
