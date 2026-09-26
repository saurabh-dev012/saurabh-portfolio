export function ArrowIcon() {
  return <span aria-hidden="true">↗</span>;
}

export function ExternalLink({ href, children, className = '' }) {
  return <a className={className} href={href} target="_blank" rel="noopener noreferrer">{children}</a>;
}
