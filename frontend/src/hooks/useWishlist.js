import { useCallback, useState } from 'react';

const KEY = 'kairamarkt_wishlist';

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save(ids) {
  localStorage.setItem(KEY, JSON.stringify(ids));
}

export function useWishlist() {
  const [ids, setIds] = useState(load);

  const toggle = useCallback((productId) => {
    setIds((prev) => {
      const next = prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId];
      save(next);
      return next;
    });
  }, []);

  const has = useCallback((productId) => ids.includes(productId), [ids]);

  return { ids, toggle, has };
}
