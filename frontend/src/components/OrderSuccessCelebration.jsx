import { useEffect, useState } from 'react';

const COLORS = ['#ef4444', '#22c55e', '#eab308', '#3b82f6', '#a855f7', '#ec4899', '#f97316'];

function Confetti() {
  const [pieces] = useState(() =>
    Array.from({ length: 70 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.8,
      duration: 2 + Math.random() * 1.5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 6 + Math.random() * 8,
      rotate: Math.random() * 360,
    }))
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {pieces.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-sm animate-confetti-fall"
          style={{
            left: `${p.left}%`,
            top: '-20px',
            width: p.size,
            height: p.size * 1.2,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
}

export default function OrderSuccessCelebration({ visible, onComplete }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (visible) setMounted(true);
  }, [visible]);

  useEffect(() => {
    if (!visible || !mounted) return;
    const t = setTimeout(onComplete, 2800);
    return () => clearTimeout(t);
  }, [visible, mounted, onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <Confetti />
      <div className="relative z-10 text-center px-6">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-500 text-white animate-scale-in shadow-2xl">
          <svg className="w-14 h-14 animate-check-draw" viewBox="0 0 52 52" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 27l8 8 16-18" />
          </svg>
        </div>
        <h2 className="mt-6 text-2xl md:text-3xl font-extrabold text-white drop-shadow-lg">Siparişiniz alındı!</h2>
        <p className="mt-2 text-white/90 text-lg">Yönlendiriliyorsunuz...</p>
      </div>
    </div>
  );
}
