import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const STORAGE_KEY = 'cookie_consent_accepted';

export default function CookieConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setOpen(true);
    } catch {
      setOpen(true);
    }
  }, []);

  const accept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch {}
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 bg-gray-900/95 text-white shadow-lg backdrop-blur-sm">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-200">
          Sitemizde deneyiminizi iyileştirmek için çerezler kullanıyoruz. Sitede gezinmeye devam ederek{' '}
          <Link to="/gizlilik" className="underline hover:text-white">çerez politikamızı</Link> kabul etmiş olursunuz.
        </p>
        <button
          type="button"
          onClick={accept}
          className="shrink-0 px-5 py-2.5 rounded-xl bg-theme text-white font-medium hover:opacity-90 transition-opacity"
        >
          Kabul ediyorum
        </button>
      </div>
    </div>
  );
}
