import { HASHNODE_USERNAME } from '../data/content';

const HASHNODE_API = 'https://gql.hashnode.com';

const POSTS_QUERY = `
  query RecentPosts($username: String!) {
    user(username: $username) {
      posts(first: 50) {
        edges {
          node {
            title
            url
            publishedAt
            readTimeInMinutes
            tags { name }
          }
        }
      }
    }
  }
`;

export async function fetchRecentHashnodePosts(signal) {
  const response = await fetch(HASHNODE_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: POSTS_QUERY, variables: { username: HASHNODE_USERNAME } }),
    signal,
  });

  if (!response.ok) throw new Error(`Hashnode returned ${response.status}`);

  const payload = await response.json();
  if (payload.errors?.length) throw new Error(payload.errors.map(error => error.message).join('; '));

  const edges = payload.data?.user?.posts?.edges;
  if (!Array.isArray(edges)) throw new Error('Hashnode returned an unexpected posts response');

  return edges
    .map(edge => edge.node)
    .filter(post => post?.title && post.url && Number.isFinite(Date.parse(post.publishedAt)))
    .sort((first, second) => Date.parse(second.publishedAt) - Date.parse(first.publishedAt))
    .slice(0, 3);
}
