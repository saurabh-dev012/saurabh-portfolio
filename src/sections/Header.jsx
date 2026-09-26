import { useState } from 'react';

const links = [['Skills', 'skills'], ['Projects', 'projects'], ['Blog', 'blog'], ['Contact', 'contact']];

export default function Header() {
  const [open, setOpen] = useState(false);
  return <header className="site-header">
    <div className="nav-top page-shell">
      <a className="wordmark" href="#home" aria-label="Saurabh Pandey home">saurabh<span className="wordmark-period">.</span></a>
    </div>
    <nav className="nav page-shell" aria-label="Main navigation">
      <button className="nav-toggle" type="button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="primary-links" onClick={() => setOpen(!open)}><span /><span /></button>
      <div id="primary-links" className={`nav-links ${open ? 'is-open' : ''}`}>
        {links.map(([label, id]) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>{label}</a>)}
      </div>
    </nav>
  </header>;
}
