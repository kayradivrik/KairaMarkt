import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FiHelpCircle, FiChevronDown, FiSearch } from 'react-icons/fi';
import { getFaq } from '../services/faqService';
import Breadcrumb from '../components/Breadcrumb';
import LoadingSpinner from '../components/LoadingSpinner';

export default function FaqPage() {
  const [faq, setFaq] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getFaq()
      .then((res) => setFaq(res.data?.faq || []))
      .catch(() => setFaq([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return faq;
    const q = search.toLowerCase();
    return faq.filter(
      (item) =>
        (item.question && item.question.toLowerCase().includes(q)) ||
        (item.response && item.response.toLowerCase().includes(q)) ||
        (item.keywords && item.keywords.some((k) => k && k.toLowerCase().includes(q)))
    );
  }, [faq, search]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Breadcrumb items={[{ label: 'Ana Sayfa', href: '/' }, { label: 'Sıkça Sorulan Sorular' }]} />
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 rounded-2xl bg-theme/10 text-theme">
          <FiHelpCircle className="w-8 h-8" aria-hidden />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Sıkça Sorulan Sorular</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-0.5">Merak ettiklerinizin yanıtları</p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <LoadingSpinner ariaLabel="SSS yükleniyor" />
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Yükleniyor...</p>
        </div>
      ) : faq.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-12 text-center">
          <FiHelpCircle className="w-14 h-14 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Henüz SSS içeriği eklenmemiş.</p>
          <Link to="/iletisim" className="mt-4 inline-block text-theme font-medium hover:underline">
            İletişime geçin
          </Link>
        </div>
      ) : (
        <>
          <div className="relative mb-6">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Soruda veya yanıtta ara..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-theme focus:border-transparent"
              aria-label="SSS ara"
            />
          </div>

          <div className="space-y-3">
            {filtered.length === 0 ? (
              <p className="text-center py-8 text-gray-500 dark:text-gray-400">Aramanızla eşleşen soru bulunamadı.</p>
            ) : (
              filtered.map((item, i) => {
                const isOpen = openIndex === i;
                const title = item.question || item.keywords?.join(', ') || `Soru ${i + 1}`;
                return (
                  <div
                    key={i}
                    className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden shadow-soft"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                      className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      aria-expanded={isOpen}
                    >
                      <span className="font-semibold text-gray-900 dark:text-white pr-2">{title}</span>
                      <FiChevronDown
                        className={`w-5 h-5 shrink-0 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        aria-hidden
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-0">
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{item.response}</p>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            Aradığınızı bulamadınız mı?{' '}
            <Link to="/iletisim" className="text-theme font-medium hover:underline">
              İletişime geçin
            </Link>
          </p>
        </>
      )}
    </div>
  );
}
