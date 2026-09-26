import SectionHeading from '../components/SectionHeading';
import { personalInfo } from '../data/content';

export default function About() {
  return <section className="section page-shell" id="about" aria-labelledby="about-title"><SectionHeading eyebrow="About" title="About" id="about-title" />
    <div className="about-layout"><p className="body-copy">{personalInfo.name} is a {personalInfo.education} and frontend developer. I enjoy building clear, useful web interfaces and improving my skills through practice.</p></div>
  </section>;
}
