import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const DURATION_MS = 300;
const COMPLETE_MS = 150;

export default function RouteChangeProgressBar() {
  const location = useLocation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      if (elapsed > DURATION_MS) {
        setVisible(false);
        return;
      }
      requestAnimationFrame(tick);
    };
    const t = setTimeout(() => setVisible(false), DURATION_MS + COMPLETE_MS);
    requestAnimationFrame(tick);
    return () => clearTimeout(t);
  }, [location.pathname]);

  if (!visible) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 h-1 bg-theme z-[9999] animate-[progressBar_0.3s_ease-out]"
      role="progressbar"
      aria-hidden="true"
    />
  );
}
