import { useEffect, useState } from 'react';

const links = [['Skills', 'skills'], ['Projects', 'projects'], ['Blog', 'blog'], ['Contact', 'contact']];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    try {
      return window.localStorage.getItem('portfolio-theme') === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      window.localStorage.setItem('portfolio-theme', theme);
    } catch {
      // The selected theme still applies for this visit when storage is unavailable.
    }
  }, [theme]);

  return <header className="site-header">
    <div className="nav-top page-shell">
      <a className="wordmark" href="#home" aria-label="Saurabh Pandey home">saurabh<span className="wordmark-period">.</span></a>
      <button className="theme-toggle" type="button" onClick={() => setTheme(current => current === 'dark' ? 'light' : 'dark')} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} aria-pressed={theme === 'light'} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>
        <span className={`theme-toggle-icon ${theme === 'light' ? 'is-active' : ''}`} aria-hidden="true"><svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="3.4" /><path d="M10 1.8v1.7M10 16.5v1.7M1.8 10h1.7M16.5 10h1.7m-14.2-5 1.2 1.2m9 9 1.2 1.2m0-11.4-1.2 1.2m-9 9-1.2 1.2" /></svg></span>
        <span className={`theme-toggle-icon ${theme === 'dark' ? 'is-active' : ''}`} aria-hidden="true"><svg viewBox="0 0 20 20" fill="none"><path d="M16.6 12.3A7 7 0 0 1 7.7 3.4a7.1 7.1 0 1 0 8.9 8.9Z" /></svg></span>
        <span className="theme-toggle-thumb" aria-hidden="true" />
      </button>
    </div>
    <nav className="nav page-shell" aria-label="Main navigation">
      <button className="nav-toggle" type="button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="primary-links" onClick={() => setOpen(!open)}><span /><span /></button>
      <div id="primary-links" className={`nav-links ${open ? 'is-open' : ''}`}>
        {links.map(([label, id]) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>{label}</a>)}
      </div>
    </nav>
  </header>;
}
