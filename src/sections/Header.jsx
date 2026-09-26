import { useState } from 'react';
import { personalInfo } from '../data/content';
import { ArrowIcon, ExternalLink } from '../components/ExternalLink';

const links = [['Skills', 'skills'], ['Projects', 'projects'], ['Blog', 'blog'], ['Contact', 'contact']];

function GitHubMark() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false"><path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.56.1.76-.24.76-.54v-2.1c-3.1.68-3.76-1.32-3.76-1.32-.5-1.3-1.24-1.65-1.24-1.65-1.02-.7.08-.69.08-.69 1.13.08 1.73 1.16 1.73 1.16 1 1.72 2.62 1.22 3.26.93.1-.72.4-1.22.71-1.5-2.48-.28-5.08-1.24-5.08-5.52 0-1.22.44-2.22 1.16-3-.12-.28-.5-1.43.11-2.98 0 0 .95-.3 3.05 1.15a10.6 10.6 0 0 1 5.55 0c2.1-1.45 3.04-1.15 3.04-1.15.61 1.55.23 2.7.12 2.98.72.78 1.15 1.78 1.15 3 0 4.3-2.6 5.23-5.09 5.5.4.35.76 1.02.76 2.06v3.06c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z" /></svg>;
}

export default function Header() {
  const [open, setOpen] = useState(false);
  return <header className="site-header">
    <div className="nav-top page-shell">
      <a className="wordmark" href="#home" aria-label="Saurabh Pandey home">saurabh<span className="wordmark-period">.</span></a>
      <div className="nav-socials" aria-label="Social profiles">
        <ExternalLink href={personalInfo.github}><GitHubMark /> <span>GitHub</span><ArrowIcon /></ExternalLink>
        <ExternalLink href={personalInfo.wakatime}><span className="social-dot" aria-hidden="true">◷</span><span>WakaTime</span><ArrowIcon /></ExternalLink>
      </div>
    </div>
    <nav className="nav page-shell" aria-label="Main navigation">
      <button className="nav-toggle" type="button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="primary-links" onClick={() => setOpen(!open)}><span /><span /></button>
      <div id="primary-links" className={`nav-links ${open ? 'is-open' : ''}`}>
        {links.map(([label, id]) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>{label}</a>)}
      </div>
    </nav>
  </header>;
}
