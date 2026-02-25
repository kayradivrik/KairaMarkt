import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { FiHome, FiMessageCircle, FiRefreshCw } from 'react-icons/fi';

export default function Error500Page() {
  const { siteName } = useSettings();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-theme/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 rounded-full bg-theme/5 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 text-center max-w-md">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 border-4 border-gray-200 dark:border-gray-700 mb-6">
          <span className="text-5xl" role="img" aria-hidden>🤖</span>
        </div>
        <p className="text-sm font-semibold text-theme uppercase tracking-wider">{siteName || 'KairaMarkt'}</p>
        <h1 className="text-8xl sm:text-9xl font-black text-gray-200 dark:text-gray-700 mt-1 select-none">500</h1>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-200 mt-2">Bir şeyler ters gitti!</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Robotumuz şu an biraz karıştı. Endişelenmeyin, ekibimiz konuya el attı. Biraz sonra tekrar deneyin.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <FiRefreshCw className="w-5 h-5" aria-hidden />
            Tekrar dene
          </button>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 btn-theme font-semibold rounded-2xl transition-ux"
          >
            <FiHome className="w-5 h-5" aria-hidden />
            Ana sayfaya dön
          </Link>
          <Link
            to="/iletisim"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <FiMessageCircle className="w-5 h-5" aria-hidden />
            İletişim
          </Link>
        </div>

        <p className="mt-8 text-xs text-gray-400 dark:text-gray-500">
          Hata kodu: 500 · Sunucu geçici olarak yanıt veremiyor
        </p>
      </div>
    </div>
  );
}
