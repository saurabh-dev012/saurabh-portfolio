import SectionHeading from '../components/SectionHeading';
import { projects } from '../data/content';

function ProjectCard({ project }) {
  return <article className="project-card"><span className="project-type">{project.type || 'Project'}</span><h3>{project.name}</h3><p>{project.description}</p></article>;
}

export default function Projects() {
  return <section className="section page-shell" id="projects" aria-labelledby="projects-title"><SectionHeading eyebrow="Selected work" title="Featured projects" id="projects-title" />
    {projects.length ? <div className="project-grid">{projects.map(project => <ProjectCard key={project.name} project={project} />)}</div> : <div className="projects-empty"><span className="empty-mark" aria-hidden="true">✳</span><div><h3>Projects coming soon</h3><p>I’m working on projects to share here. Check back soon.</p></div><span className="empty-note">IN PROGRESS</span></div>}
  </section>;
}
