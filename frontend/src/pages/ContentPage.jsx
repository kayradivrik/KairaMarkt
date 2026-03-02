import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getContentPage } from '../services/contentPageService';
import Breadcrumb from '../components/Breadcrumb';

export default function ContentPage() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError('');
    getContentPage(slug)
      .then((r) => {
        if (r.data?.success) setPage(r.data.page);
        else setError('Sayfa bulunamadı.');
      })
      .catch(() => {
        setError('Sayfa bulunamadı.');
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const title = page?.title || 'Sayfa';

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Breadcrumb items={[{ label: 'Ana Sayfa', href: '/' }, { label: title }]} />

      {loading ? (
        <div className="py-16 text-center text-gray-500 dark:text-gray-400">
          Yükleniyor...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-10 text-center">
          <p className="text-gray-700 dark:text-gray-200 mb-2">{error}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Aradığınız içeriği bulamadık.{' '}
            <Link to="/" className="text-theme font-medium hover:underline">
              Ana sayfaya dön
            </Link>
          </p>
        </div>
      ) : (
        <article className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {page.title}
          </h1>
          <div className="prose prose-sm sm:prose dark:prose-invert max-w-none whitespace-pre-line">
            {page.body}
          </div>
        </article>
      )}
    </div>
  );
}

