import { useState } from 'react';
import { personalInfo } from '../data/content';
import { ArrowIcon, ExternalLink } from '../components/ExternalLink';

const links = [['About', 'about'], ['Projects', 'projects'], ['Skills', 'skills'], ['WakaTime', 'activity'], ['GitHub', 'github'], ['Contact', 'contact']];

export default function Header() {
  const [open, setOpen] = useState(false);
  return <header className="site-header"><nav className="nav page-shell" aria-label="Main navigation">
    <a className="wordmark" href="#home" onClick={() => setOpen(false)}><span className="wordmark-avatar" aria-hidden="true">SP</span>Saurabh Pandey</a>
    <button className="nav-toggle" type="button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="primary-links" onClick={() => setOpen(!open)}><span /><span /></button>
    <div id="primary-links" className={`nav-links ${open ? 'is-open' : ''}`}>
      {links.map(([label, id]) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>{label}</a>)}
      <ExternalLink className="nav-profile" href={personalInfo.github}>GitHub <ArrowIcon /></ExternalLink>
    </div>
  </nav></header>;
}
