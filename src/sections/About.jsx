import SectionHeading from '../components/SectionHeading';
import { personalInfo } from '../data/content';

export default function About() {
  return <section className="section page-shell" id="about" aria-labelledby="about-title"><SectionHeading eyebrow="About" title="About" id="about-title" />
    <div className="about-layout"><p className="body-copy">{personalInfo.name} is a {personalInfo.education} focused on building thoughtful web interfaces.</p></div>
  </section>;
}
