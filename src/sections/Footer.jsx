import { useEffect, useState } from 'react';
import { personalInfo } from '../data/content';

export default function Footer() {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!revealed) return undefined;
    const timer = window.setTimeout(() => setRevealed(false), 3200);
    return () => window.clearTimeout(timer);
  }, [revealed]);

  const copyright = `${String.fromCharCode(169)} ${new Date().getFullYear()} ${personalInfo.name}`;

  return <footer className="footer page-shell">
    <a className="footer-brand" href="#home">{personalInfo.name}<span>.</span><small>{personalInfo.role}</small></a>
    <button className={`copyright footer-easter-egg ${revealed ? 'is-revealed' : ''}`} type="button" onClick={() => setRevealed(true)} aria-label={revealed ? 'Hidden note: keep making things that make you curious' : 'Reveal a hidden note'}>
      <span key={revealed ? 'note' : 'copyright'}>{revealed ? '// keep making things that make you curious' : copyright}</span>
    </button>
  </footer>;
}
