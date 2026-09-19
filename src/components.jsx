import { personalInfo } from './data/content';

export function Arrow() { return <span aria-hidden="true">↗</span>; }

export function SectionHeading({ eyebrow, title, copy }) {
  return <header className="section-heading reveal"><p className="eyebrow">{eyebrow}</p><h2>{title}</h2>{copy && <p className="section-copy">{copy}</p>}</header>;
}

export function ExternalLink({ href, children, className = '' }) {
  const isPlaceholder = !href || href === '#';
  if (isPlaceholder) return <span className={`${className} is-disabled`} title="Add this link in src/data/content.js">{children}</span>;
  return <a className={className} href={href} target="_blank" rel="noreferrer">{children}</a>;
}

export function SocialLinks({ compact = false }) {
  return <div className={`social-links ${compact ? 'compact' : ''}`}>
    <ExternalLink href={personalInfo.github}>GitHub <Arrow /></ExternalLink>
    <ExternalLink href={personalInfo.linkedin}>LinkedIn <Arrow /></ExternalLink>
  </div>;
}
