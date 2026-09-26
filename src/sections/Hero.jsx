import { personalInfo } from '../data/content';
import { ArrowIcon, ExternalLink } from '../components/ExternalLink';

export default function Hero() {
  return <section className="hero page-shell" id="home" aria-labelledby="hero-title">
    <div className="hero-profile"><img className="hero-avatar" src={`https://github.com/${personalInfo.githubUsername}.png`} alt="Saurabh Pandey’s GitHub profile avatar" onError={event => { event.currentTarget.hidden = true; }} /><div><h1 id="hero-title">{personalInfo.name}</h1><p className="hero-role">{personalInfo.role}</p></div></div>
    <p className="hero-copy">I’m a BTech CSE (Data Science) student interested in building thoughtful interfaces and learning through hands-on work.</p>
    <div className="hero-actions"><a className="text-link" href="#projects">Projects <span aria-hidden="true">↓</span></a><ExternalLink className="text-link" href={personalInfo.github}>GitHub <ArrowIcon /></ExternalLink><ExternalLink className="text-link" href={personalInfo.wakatime}>WakaTime <ArrowIcon /></ExternalLink></div>
    <div className="hero-meta"><span>Frontend Developer</span><span className="meta-index">India</span></div>
  </section>;
}
