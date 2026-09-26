import { useEffect, useState } from 'react';
import { personalInfo } from '../data/content';
import { ArrowIcon, ExternalLink } from '../components/ExternalLink';

export default function Hero() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const indiaTime = new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Asia/Kolkata',
  }).format(now);

  return <section className="hero page-shell" id="home" aria-labelledby="hero-title">
    <div className="hero-profile">
      <div className="hero-identity">
        <img className="hero-avatar" src={`https://github.com/${personalInfo.githubUsername}.png`} alt="Saurabh Pandey’s GitHub profile avatar" onError={event => { event.currentTarget.hidden = true; }} />
        <div className="hero-name-block"><div className="hero-name-row"><h1 id="hero-title">{personalInfo.name}</h1><span className="verification-badge" role="img" aria-label="Verified profile"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1.5 14.7 3l3.1-.1.9 3 2.6 1.6-.9 3.1.9 3.1-2.6 1.6-.9 3-3.1-.1-2.7 1.5L9.3 18l-3.1.1-.9-3-2.6-1.6.9-3.1-.9-3.1 2.6-1.6.9-3L9.3 3 12 1.5Z" /><path className="badge-check" d="m8.2 11.8 2.4 2.4 5.3-5.4" /></svg></span></div><p className="hero-role">{personalInfo.role}</p></div>
      </div>
      <div className="hero-location">
        <span className="hero-location-label"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="6.5" /><circle cx="10" cy="10" r="2" /><path d="M10 1v2M10 17v2M1 10h2M17 10h2" /></svg>Gurgaon, India</span>
        <time dateTime={now.toISOString()} aria-label="Current time in India Standard Time">{indiaTime} IST</time>
      </div>
    </div>
    <p className="hero-copy">I’m a BTech CSE (Data Science) student interested in building thoughtful interfaces and learning through hands-on work.</p>
    <div className="hero-actions"><a className="text-link" href="#projects">Projects <span aria-hidden="true">↓</span></a><ExternalLink className="text-link" href={personalInfo.github}>GitHub <ArrowIcon /></ExternalLink><ExternalLink className="text-link" href={personalInfo.wakatime}>WakaTime <ArrowIcon /></ExternalLink></div>
  </section>;
}
