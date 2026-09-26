import { SOCIAL_LINKS } from '../data/content';

const icons = {
  github: <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.56.1.76-.24.76-.54v-2.1c-3.1.68-3.76-1.32-3.76-1.32-.5-1.3-1.24-1.65-1.24-1.65-1.02-.7.08-.69.08-.69 1.13.08 1.73 1.16 1.73 1.16 1 1.72 2.62 1.22 3.26.93.1-.72.4-1.22.71-1.5-2.48-.28-5.08-1.24-5.08-5.52 0-1.22.44-2.22 1.16-3-.12-.28-.5-1.43.11-2.98 0 0 .95-.3 3.05 1.15a10.6 10.6 0 0 1 5.55 0c2.1-1.45 3.04-1.15 3.04-1.15.61 1.55.23 2.7.12 2.98.72.78 1.15 1.78 1.15 3 0 4.3-2.6 5.23-5.09 5.5.4.35.76 1.02.76 2.06v3.06c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z" />,
  linkedin: <path d="M5.3 8.3H1.8V22h3.5V8.3ZM3.55 2A2.05 2.05 0 1 0 3.6 6.1 2.05 2.05 0 0 0 3.55 2ZM22 13.9c0-4.13-2.2-6.05-5.14-6.05a4.45 4.45 0 0 0-4 2.2V8.3H9.4V22h3.46v-6.78c0-1.79.34-3.52 2.56-3.52 2.19 0 2.22 2.04 2.22 3.64V22H22v-8.1Z" />,
  instagram: <><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="17.6" cy="6.6" r="1.2" /></>,
  x: <path d="M18.9 2H22l-6.77 7.74L23.2 22h-6.24l-4.88-7.41L5.6 22H2.47l7.24-8.28L1.9 2h6.4l4.4 6.76L18.9 2Zm-1.1 17.9h1.73L7.38 4H5.52l12.28 15.9Z" />,
  leetcode: <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />,
  hashnode: <path fillRule="evenodd" d="M22.351 8.019l-6.37-6.37a5.63 5.63 0 0 0-7.962 0l-6.37 6.37a5.63 5.63 0 0 0 0 7.962l6.37 6.37a5.63 5.63 0 0 0 7.962 0l6.37-6.37a5.63 5.63 0 0 0 0-7.962zM12 15.953a3.953 3.953 0 1 1 0-7.906 3.953 3.953 0 0 1 0 7.906z" />,
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
