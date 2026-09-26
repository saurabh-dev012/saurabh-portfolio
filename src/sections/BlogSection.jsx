import SectionHeading from '../components/SectionHeading';
import ServiceProfileLink from '../components/ServiceProfileLink';
import { HASHNODE_PROFILE_URL, HASHNODE_USERNAME } from '../data/content';
import { useHashnodePosts } from '../hooks/useHashnodePosts';

const dateFormatter = new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric', timeZone: 'UTC' });

function ArticleRow({ post }) {
  const tags = (post.tags || []).slice(0, 2).map(tag => tag.name).filter(Boolean);
  const metadata = [
    ...tags,
    Number.isFinite(post.readTimeInMinutes) && post.readTimeInMinutes > 0 ? `${post.readTimeInMinutes} min read` : null,
    dateFormatter.format(new Date(post.publishedAt)),
  ].filter(Boolean);

  return <article className="writing-row">
    <a className="writing-row-link" href={post.url} target="_blank" rel="noopener noreferrer">
      <span className="writing-row-title">{post.title}</span>
      <span className="writing-row-arrow" aria-hidden="true">&#8599;</span>
    </a>
    <p className="writing-row-meta">{metadata.map((item, index) => <span key={`${item}-${index}`}>{index > 0 && <i aria-hidden="true">&#183;</i>}{item}</span>)}</p>
  </article>;
}

function LoadingRows() {
  return <div className="writing-loading" role="status" aria-label="Loading recent writing">
    {[0, 1, 2].map(row => <div className="writing-loading-row" key={row}><span /><span /></div>)}
  </div>;
}

export default function BlogSection() {
  const { status, posts } = useHashnodePosts();

  return <section className="section page-shell writing-section" id="blog" aria-labelledby="blog-title">
    <SectionHeading eyebrow="Writing" title={`Thoughts, experiments & things I\u2019ve learned.`} id="blog-title" />
    {status === 'loading' && <LoadingRows />}
    {status === 'success' && <div className="writing-list">{posts.map(post => <ArticleRow key={post.url} post={post} />)}</div>}
    {status === 'empty' && <div className="writing-empty"><h3>Writing soon.</h3><p>Notes from things I&rsquo;m building and learning.</p></div>}
    {status === 'error' && <p className="writing-unavailable">Writing unavailable right now.</p>}
    <ServiceProfileLink service="hashnode" href={HASHNODE_PROFILE_URL} username={HASHNODE_USERNAME} />
  </section>;
}
