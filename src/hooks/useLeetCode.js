import { useEffect, useState } from 'react';

export function useLeetCode() {
  const [state, setState] = useState({ status: 'loading', data: null });

  useEffect(() => {
    const controller = new AbortController();
    const dataUrl = `${import.meta.env.BASE_URL}leetcode.json`;

    fetch(dataUrl, { signal: controller.signal, cache: 'no-store' })
      .then(response => response.ok ? response.json() : Promise.reject(new Error(`LeetCode snapshot returned HTTP ${response.status}`)))
      .then(data => {
        if (!controller.signal.aborted && data?.available) setState({ status: 'success', data });
        else if (!controller.signal.aborted) setState({ status: 'unavailable', data: null });
      })
      .catch(error => {
        if (error.name === 'AbortError') return;
        console.error('Unable to load LeetCode activity:', error);
        setState({ status: 'unavailable', data: null });
      });

    return () => controller.abort();
  }, []);

  return state;
}
