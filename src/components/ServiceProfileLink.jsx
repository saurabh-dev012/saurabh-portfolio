import { ExternalLink } from './ExternalLink';

function ServiceIcon({ service }) {
  if (service === 'github') {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.56.1.76-.24.76-.54v-2.1c-3.1.68-3.76-1.32-3.76-1.32-.5-1.3-1.24-1.65-1.24-1.65-1.02-.7.08-.69.08-.69 1.13.08 1.73 1.16 1.73 1.16 1 1.72 2.62 1.22 3.26.93.1-.72.4-1.22.71-1.5-2.48-.28-5.08-1.24-5.08-5.52 0-1.22.44-2.22 1.16-3-.12-.28-.5-1.43.11-2.98 0 0 .95-.3 3.05 1.15a10.6 10.6 0 0 1 5.55 0c2.1-1.45 3.04-1.15 3.04-1.15.61 1.55.23 2.7.12 2.98.72.78 1.15 1.78 1.15 3 0 4.3-2.6 5.23-5.09 5.5.4.35.76 1.02.76 2.06v3.06c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z" /></svg>;
  }
  if (service === 'hashnode') {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1.75 21.1 7v10L12 22.25 2.9 17V7L12 1.75Z" /><circle cx="12" cy="12" r="2.35" fill="var(--paper)" /></svg>;
  }
  if (service === 'leetcode') {
    return <svg viewBox="0 0 24 24" aria-hidden="true" fill="none"><path d="m15.7 3.2-6.1 6a4 4 0 0 0 0 5.7l6.1 5.9M8.8 12h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  }
  return <svg viewBox="0 0 24 24" aria-hidden="true" fill="none"><circle cx="12" cy="12" r="9.25" stroke="currentColor" strokeWidth="2" /><path d="M9 10.5 12 14l3-3.5M12 8v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export default function ServiceProfileLink({ service, href, username }) {
  return <ExternalLink className={`service-profile-link ${service}`} href={href}>
    <ServiceIcon service={service} />
    <span>{username}</span>
    <svg className="service-profile-arrow" viewBox="0 0 16 16" aria-hidden="true" fill="none"><path d="M4 12 12 4M5 4h7v7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
  </ExternalLink>;
}
