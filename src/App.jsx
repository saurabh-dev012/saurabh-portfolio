import { useEffect, useState } from 'react';
import { personalInfo, projects, skills } from './data/content';
import { Arrow, ExternalLink } from './components';

const navItems = [['Projects', 'projects'], ['Skills', 'skills'], ['Activity', 'activity'], ['GitHub', 'github'], ['LeetCode', 'leetcode'], ['Connect', 'connect']];
const iconNames = { HTML: 'html', CSS: 'css', JavaScript: 'js', React: 'react', 'Redux Toolkit': 'redux', Python: 'python', C: 'c', Java: 'java', Git: 'git', GitHub: 'github' };

function Header() {
  const [open, setOpen] = useState(false);
  return <header className="site-header"><nav className="page-shell nav" aria-label="Main navigation"><a href="#top" className="wordmark" onClick={() => setOpen(false)}>saurabh<span>.</span></a><button className="nav-toggle" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}><i /><i /></button><div className={`nav-links ${open ? 'is-open' : ''}`}>{navItems.map(([label, id]) => <a href={`#${id}`} key={id} onClick={() => setOpen(false)}>{label}</a>)}<ExternalLink href={personalInfo.github} className="nav-github">GitHub <Arrow /></ExternalLink></div></nav></header>;
}

function Intro() {
  return <section id="top" className="intro page-shell"><p className="kicker">Available for internship opportunities <i /></p><h1>{personalInfo.name}</h1><p className="intro-role">{personalInfo.role}</p><div className="intro-grid"><p>{personalInfo.bio}</p><p>Based in {personalInfo.location}, I’m building a strong frontend foundation while learning the systems, patterns, and decision-making needed to ship thoughtful full-stack products.</p></div><div className="intro-focus" aria-label="Primary focus areas">{personalInfo.focusAreas.map(area => <span key={area}>{area}</span>)}</div><div className="intro-links"><ExternalLink href={personalInfo.github}>GitHub <Arrow /></ExternalLink><ExternalLink href={personalInfo.linkedin}>LinkedIn <Arrow /></ExternalLink><ExternalLink href={personalInfo.wakatime}>WakaTime <Arrow /></ExternalLink></div></section>;
}

function SectionTitle({ id, children, action }) { return <div className="section-title" id={id}><h2>{children}</h2>{action}</div>; }

function Projects() {
  return <section className="content-section page-shell" aria-labelledby="projects"><SectionTitle id="projects">featured projects.</SectionTitle>{projects.length === 0 ? <div className="empty-projects"><span>01</span><div><h3>Nothing featured yet.</h3><p>I’m focusing on building work worth showing. Verified projects will appear here once they are ready.</p></div></div> : <div className="project-list">{projects.map(project => <article key={project.name}>{project.name}</article>)}</div>}</section>;
}

function Skills() {
  return <section className="content-section page-shell" aria-labelledby="skills"><SectionTitle id="skills">technical skills.</SectionTitle><div className="skill-grid">{skills.map(skill => <span className="skill-icon" title={skill} key={skill}><img src={`https://skillicons.dev/icons?i=${iconNames[skill]}&theme=dark`} alt={skill} loading="lazy" /></span>)}</div></section>;
}

function WakaTime() {
  const [badgeError, setBadgeError] = useState(false);
  const badgeUrl = `https://wakatime.com/badge/user/${personalInfo.wakatimeUserId}.svg?style=flat-square`;
  return <section className="content-section page-shell" aria-labelledby="activity"><SectionTitle id="activity" action={<ExternalLink href={personalInfo.wakatime} className="section-action">Open WakaTime <Arrow /></ExternalLink>}>coding activity.</SectionTitle><div className="wakatime-panel"><div className="wakatime-top"><strong>wakatime.</strong><ExternalLink href={personalInfo.wakatime}>public profile <Arrow /></ExternalLink></div><div className="wakatime-content"><div><p className="activity-label">Coding time</p>{badgeError ? <p className="wakatime-unavailable">Public coding-time badge unavailable.</p> : <ExternalLink href={personalInfo.wakatime} className="wakatime-badge"><img src={badgeUrl} alt="Live total coding time from WakaTime" onError={() => setBadgeError(true)} /></ExternalLink>}<p className="wakatime-note">Live time is supplied directly by your public WakaTime profile.</p></div><div className="wakatime-side"><p className="activity-label">Activity dashboard</p><h3>Practice, tracked publicly.</h3><p>Open the dashboard to see your current language, editor, and coding-time breakdowns.</p><ExternalLink href={personalInfo.wakatime} className="outline-button">View dashboard <Arrow /></ExternalLink></div></div></div></section>;
}

function GitHub() {
  const [graphError, setGraphError] = useState(false);
  const [activity, setActivity] = useState({ loading: true, total: null });
  useEffect(() => { let active = true; fetch('https://github-contributions-api.jogruber.de/v4/saurabh-dev012?y=last').then(r => r.ok ? r.json() : Promise.reject()).then(data => { const total = Object.values(data.total ?? {}).reduce((sum, value) => sum + Number(value || 0), 0); if (active) setActivity({ loading: false, total: total || null }); }).catch(() => active && setActivity({ loading: false, total: null })); return () => { active = false; }; }, []);
  const label = activity.loading ? 'Loading contribution activity…' : activity.total ? `${activity.total.toLocaleString()} contributions in the last year` : 'Contribution activity in the last year';
  return <section className="content-section page-shell" aria-labelledby="github"><SectionTitle id="github" action={<ExternalLink href={personalInfo.github} className="section-action">saurabh-dev012 <Arrow /></ExternalLink>}>github.</SectionTitle><div className="github-panel"><div className="github-panel-head"><strong>github.</strong><span>Contribution graph</span></div>{graphError ? <div className="graph-state">Contribution graph is temporarily unavailable. <ExternalLink href={personalInfo.github}>View it on GitHub <Arrow /></ExternalLink></div> : <a className="graph" href={personalInfo.github} target="_blank" rel="noreferrer"><img src="https://ghchart.rshah.org/e7e7e7/saurabh-dev012" alt="Saurabh's GitHub contribution graph" loading="lazy" onError={() => setGraphError(true)} /></a>}<div className="github-panel-foot"><span aria-live="polite">{label}</span><div className="scale"><span>Less</span><i /><i /><i /><i /><i /><span>More</span></div></div></div></section>;
}

function LeetCode() { return <section className="content-section page-shell" aria-labelledby="leetcode"><SectionTitle id="leetcode">leetcode.</SectionTitle><div className="coming-soon"><span>Problem solving</span><h3>Coming soon.</h3><p>I’ll add this section when I have a verified LeetCode profile and activity to share.</p></div></section>; }

function Connect() {
  const contacts = [['Email', personalInfo.email ? `mailto:${personalInfo.email}` : ''], ['GitHub', personalInfo.github], ['LinkedIn', personalInfo.linkedin], ['Instagram', personalInfo.instagram]];
  return <section id="connect" className="connect"><div className="page-shell"><p className="kicker">Let’s connect</p><h2>Have a project, internship, or idea in mind?</h2><p>I’m always open to learning from people who care about building useful things.</p><div className="contact-list">{contacts.map(([label, href]) => <ExternalLink href={href} key={label}>{label} <Arrow /></ExternalLink>)}</div><small>Writing soon.</small></div></section>;
}

function Footer() { return <footer className="page-shell footer"><span>© {new Date().getFullYear()} Saurabh</span><span>Built with React</span><a href="#top">Back to top ↑</a></footer>; }

export default function App() { return <><Header /><main><Intro /><Projects /><Skills /><WakaTime /><GitHub /><LeetCode /><Connect /></main><Footer /></>; }
