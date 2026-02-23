import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);

const KEY = 'kairamarkt_theme';

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved !== null) return saved === 'true';
    } catch {}
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  });

  useEffect(() => {
    localStorage.setItem(KEY, dark);
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  return <ThemeContext.Provider value={{ dark, setDark, toggle: () => setDark((d) => !d) }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
