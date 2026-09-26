import { SOCIAL_LINKS } from '../data/content';

const icons = {
  github: <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.56.1.76-.24.76-.54v-2.1c-3.1.68-3.76-1.32-3.76-1.32-.5-1.3-1.24-1.65-1.24-1.65-1.02-.7.08-.69.08-.69 1.13.08 1.73 1.16 1.73 1.16 1 1.72 2.62 1.22 3.26.93.1-.72.4-1.22.71-1.5-2.48-.28-5.08-1.24-5.08-5.52 0-1.22.44-2.22 1.16-3-.12-.28-.5-1.43.11-2.98 0 0 .95-.3 3.05 1.15a10.6 10.6 0 0 1 5.55 0c2.1-1.45 3.04-1.15 3.04-1.15.61 1.55.23 2.7.12 2.98.72.78 1.15 1.78 1.15 3 0 4.3-2.6 5.23-5.09 5.5.4.35.76 1.02.76 2.06v3.06c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z" />,
  linkedin: <path d="M5.3 8.3H1.8V22h3.5V8.3ZM3.55 2A2.05 2.05 0 1 0 3.6 6.1 2.05 2.05 0 0 0 3.55 2ZM22 13.9c0-4.13-2.2-6.05-5.14-6.05a4.45 4.45 0 0 0-4 2.2V8.3H9.4V22h3.46v-6.78c0-1.79.34-3.52 2.56-3.52 2.19 0 2.22 2.04 2.22 3.64V22H22v-8.1Z" />,
  instagram: <><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="17.6" cy="6.6" r="1.2" /></>,
  x: <path d="M18.9 2H22l-6.77 7.74L23.2 22h-6.24l-4.88-7.41L5.6 22H2.47l7.24-8.28L1.9 2h6.4l4.4 6.76L18.9 2Zm-1.1 17.9h1.73L7.38 4H5.52l12.28 15.9Z" />,
};

export default function SocialLinks({ iconOnly = false, order }) {
  const profiles = order ? order.map(name => SOCIAL_LINKS.find(link => link.name === name)).filter(Boolean) : SOCIAL_LINKS;
  return <nav className="hero-socials" aria-label="Social profiles">
    {profiles.map(({ name, url, icon }) => {
      const content = <><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">{icons[icon]}</svg>{!iconOnly && <span>{name}</span>}</>;
      return url
        ? <a className={`hero-social-link ${iconOnly ? 'is-icon-only' : ''}`} href={url} target="_blank" rel="noopener noreferrer" aria-label={`${name} profile (opens in a new tab)`} key={name}>{content}</a>
        : <span className={`hero-social-link is-unconfigured ${iconOnly ? 'is-icon-only' : ''}`} aria-disabled="true" aria-label={`${name} profile URL not configured`} key={name}>{content}</span>;
    })}
  </nav>;
}
