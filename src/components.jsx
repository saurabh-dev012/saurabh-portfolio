export function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

export function ExternalLink({ href, children, className = '' }) {
  if (!href) return <span className={`${className} disabled-link`} aria-disabled="true">{children}</span>;
  return <a className={className} href={href} target="_blank" rel="noreferrer">{children}</a>;
}
