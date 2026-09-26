export default function SectionHeading({ eyebrow, title, id }) {
  return <div className="section-heading"><h2 id={id}>{title.toLowerCase()}.</h2></div>;
}
