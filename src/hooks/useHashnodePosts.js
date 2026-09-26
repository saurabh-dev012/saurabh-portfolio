import { useEffect, useState } from 'react';
import { fetchRecentHashnodePosts } from '../services/hashnode';

const REFRESH_INTERVAL = 10 * 60 * 1000;

export function useHashnodePosts() {
  const [state, setState] = useState({ status: 'loading', posts: [] });

  useEffect(() => {
    let activeController;
    let hasLoaded = false;

    const loadPosts = async () => {
      if (document.visibilityState !== 'visible') return;
      activeController?.abort();
      activeController = new AbortController();

      try {
        const posts = await fetchRecentHashnodePosts(activeController.signal);
        if (activeController.signal.aborted) return;
        hasLoaded = true;
        setState({ status: posts.length ? 'success' : 'empty', posts });
      } catch (error) {
        if (error.name === 'AbortError') return;
        console.error('Unable to load Hashnode posts:', error);
        if (!hasLoaded) setState({ status: 'error', posts: [] });
      }
    };

    loadPosts();
    const interval = window.setInterval(loadPosts, REFRESH_INTERVAL);
    document.addEventListener('visibilitychange', loadPosts);

    return () => {
      activeController?.abort();
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', loadPosts);
    };
  }, []);

  return state;
}
