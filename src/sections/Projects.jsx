import { useEffect, useRef, useState } from 'react';
import SectionHeading from '../components/SectionHeading';
import { projects } from '../data/content';

function FullHomePreview({ url }) {
  const screenRef = useRef(null);
  const [scale, setScale] = useState(0.4);

  useEffect(() => {
    const screen = screenRef.current;
    if (!screen) return undefined;

    const resize = () => {
      const bounds = screen.getBoundingClientRect();
      setScale(Math.min(bounds.width / 900, bounds.height / 800));
    };

    resize();
    if ('ResizeObserver' in window) {
      const observer = new ResizeObserver(resize);
      observer.observe(screen);
      return () => observer.disconnect();
    }

    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <div ref={screenRef} className="nexhub-fit-screen">
      <iframe src={url} title="Nexhub full home page preview" loading="lazy" tabIndex="-1" aria-hidden="true" style={{ transform: `scale(${scale})` }} />
    </div>
  );
}

function FeaturedProject({ project }) {
  const featureRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [preview, setPreview] = useState({ active: false, x: 0, y: 0 });

  useEffect(() => {
    const feature = featureRef.current;
    if (!feature || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.16 });

    observer.observe(feature);
    return () => observer.disconnect();
  }, []);

  const movePreview = (event) => {
    if (event.pointerType !== 'mouse') return;
    const width = Math.min(390, window.innerWidth - 32);
    const height = width / 1.125;
    setPreview({
      active: true,
      x: Math.max(16, Math.min(event.clientX + 22, window.innerWidth - width - 16)),
      y: Math.max(16, Math.min(event.clientY - height / 2, window.innerHeight - height - 16)),
    });
  };

  const focusPreview = () => setPreview({
    active: true,
    x: Math.max(16, Math.min(window.innerWidth * 0.55, window.innerWidth - 406)),
    y: Math.max(16, Math.min(window.innerHeight * 0.3, window.innerHeight - 379)),
  });

  return (
    <article
      ref={featureRef}
      className={`featured-project${isVisible ? ' is-visible' : ''}${preview.active ? ' preview-active' : ''}`}
    >
      <div
        className="featured-project-copy"
        onPointerMove={movePreview}
        onPointerLeave={() => setPreview((current) => ({ ...current, active: false }))}
        onFocusCapture={focusPreview}
        onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPreview((current) => ({ ...current, active: false })); }}
      >
        <a className="featured-project-title" href={project.live} target="_blank" rel="noreferrer">
          <h3>{project.name}</h3><span className="featured-project-arrow" aria-hidden="true">↗</span>
        </a>
        <p className="featured-project-description">{project.description}</p>
      </div>

      <div className="featured-project-links">
        <a className="project-icon-link" href={project.live} target="_blank" rel="noreferrer" aria-label="Open Nexhub" title="Open Nexhub">
          <svg className="external-link-mark" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M14 3h7v7" />
            <path d="M10 14 21 3" />
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          </svg>
        </a>
        <a className="project-icon-link" href={project.code} target="_blank" rel="noreferrer" aria-label="View Nexhub on GitHub" title="View on GitHub">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.56.1.76-.24.76-.54v-2.1c-3.1.68-3.76-1.32-3.76-1.32-.5-1.3-1.24-1.65-1.24-1.65-1.02-.7.08-.69.08-.69 1.13.08 1.73 1.16 1.73 1.16 1 1.72 2.62 1.22 3.26.93.1-.72.4-1.22.71-1.5-2.48-.28-5.08-1.24-5.08-5.52 0-1.22.44-2.22 1.16-3-.12-.28-.5-1.43.11-2.98 0 0 .95-.3 3.05 1.15a10.6 10.6 0 0 1 5.55 0c2.1-1.45 3.04-1.15 3.04-1.15.61 1.55.23 2.7.12 2.98.72.78 1.15 1.78 1.15 3 0 4.3-2.6 5.23-5.09 5.5.4.35.76 1.02.76 2.06v3.06c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z" /></svg>
        </a>
      </div>

      <div className="nexhub-hover-preview" style={{ left: `${preview.x}px`, top: `${preview.y}px` }} aria-hidden="true">
        <FullHomePreview url={project.live} />
      </div>
    </article>
  );
}

export default function Projects() {
  return (
    <section className="section page-shell projects-section" id="projects" aria-labelledby="projects-title">
      <SectionHeading eyebrow="Selected work" title="Featured projects." id="projects-title" />
      <div className="project-preview-strip" aria-label="Project previews">
        {projects.map((project) => (
          <a className="featured-project-thumb" key={project.name} href={project.live} target="_blank" rel="noreferrer" aria-label={`Open ${project.name}`}>
            <FullHomePreview url={project.live} />
          </a>
        ))}
      </div>
      <div className="project-list">{projects.map((project) => <FeaturedProject key={project.name} project={project} />)}</div>
    </section>
  );
}
