const sectionNumbers = { about: '01', projects: '02', skills: '03', leetcode: '04', blog: '07' };

export default function SectionHeading({ eyebrow, title, id }) {
  return <div className="section-heading">
    <div className="section-kicker" aria-hidden="true">
      <span>{sectionNumbers[id?.replace('-title', '')] || '—'}</span>
      <span>{eyebrow || title}</span>
      <i />
    </div>
    <h2 id={id}>{title}</h2>
  </div>;
}
