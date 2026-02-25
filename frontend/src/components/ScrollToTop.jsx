import { useState, useEffect } from 'react';
import { FiChevronUp } from 'react-icons/fi';

const THRESHOLD = 400;

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > THRESHOLD);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={scrollTop}
      className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-theme text-white shadow-lg hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme"
      aria-label="Yukarı çık"
    >
      <FiChevronUp className="w-6 h-6" />
    </button>
  );
}
