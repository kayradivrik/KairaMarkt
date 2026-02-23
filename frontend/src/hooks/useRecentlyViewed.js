import { useCallback, useState } from 'react';

const KEY = 'kairamarkt_recent';
const MAX = 12;

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save(list) {
  localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX)));
}

export function useRecentlyViewed() {
  const [list, setList] = useState(load);

  const add = useCallback((product) => {
    if (!product?._id) return;
    setList((prev) => {
      const next = [product, ...prev.filter((p) => p._id !== product._id)].slice(0, MAX);
      save(next);
      return next;
    });
  }, []);

  return { list, add };
}
