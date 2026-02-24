import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

export default function NotFoundPage() {
  const { siteName } = useSettings();
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-12">
      <div className="text-center max-w-md">
        <p className="text-sm font-semibold text-theme uppercase tracking-wider">{siteName || 'KairaMarkt'}</p>
        <h1 className="text-8xl font-bold text-gray-200 dark:text-gray-700 mt-2">404</h1>
        <p className="text-xl text-gray-700 dark:text-gray-300 mt-4">Aradığınız sayfa burada yok.</p>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Link yanlış olabilir veya sayfa taşınmış olabilir.</p>
        <Link to="/" className="mt-8 inline-flex items-center px-6 py-3 btn-theme font-semibold rounded-2xl transition-ux">
          Ana sayfaya dön
        </Link>
        <div className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Sık ziyaret edilenler</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/urunler" className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-theme hover:text-white transition-colors">Ürünler</Link>
            <Link to="/kampanyalar" className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-theme hover:text-white transition-colors">Kampanyalar</Link>
            <Link to="/iletisim" className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-theme hover:text-white transition-colors">İletişim</Link>
            <Link to="/sepet" className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-theme hover:text-white transition-colors">Sepet</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
