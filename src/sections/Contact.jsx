import SectionHeading from '../components/SectionHeading';
import { personalInfo } from '../data/content';
import { ArrowIcon, ExternalLink } from '../components/ExternalLink';

export default function Contact() {
  return <section className="section contact-section" id="contact" aria-labelledby="contact-title"><div className="page-shell"><SectionHeading eyebrow="Have something in mind?" title="Let’s connect" id="contact-title" />
    <div className="contact-row"><p>I’m always glad to connect with people who enjoy building for the web.</p><div className="contact-links">{personalInfo.email ? <a href={`mailto:${personalInfo.email}`}>Email <ArrowIcon /></a> : <span className="email-placeholder">Email · add your address</span>}<ExternalLink href={personalInfo.github}>GitHub <ArrowIcon /></ExternalLink></div></div>
  </div></section>;
}
