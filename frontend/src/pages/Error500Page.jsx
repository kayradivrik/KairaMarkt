import { Link } from 'react-router-dom';

export default function Error500Page() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      <h1 className="text-6xl font-bold text-gray-300 dark:text-gray-600">500</h1>
      <p className="text-xl text-gray-600 dark:text-gray-400 mt-2">Sunucu hatası</p>
      <Link to="/" className="mt-6 px-6 py-3 btn-theme font-semibold rounded-2xl">Ana sayfaya dön</Link>
    </div>
  );
}
