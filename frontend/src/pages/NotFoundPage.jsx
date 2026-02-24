import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-sm font-semibold text-theme uppercase tracking-wider">KairaMarkt</p>
        <h1 className="text-8xl font-bold text-gray-200 dark:text-gray-700 mt-2">404</h1>
        <p className="text-xl text-gray-700 dark:text-gray-300 mt-4">Aradığınız sayfa burada yok.</p>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Link yanlış olabilir veya sayfa taşınmış olabilir.</p>
        <Link to="/" className="mt-8 inline-flex items-center px-6 py-3 btn-theme font-semibold rounded-2xl transition-ux">
          Ana sayfaya dön
        </Link>
      </div>
    </div>
  );
}
