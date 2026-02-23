/**
 * Sıkça Sorulan Sorular - KairaMarkt
 */
import { useState, useEffect } from 'react';
import { getFaq } from '../services/faqService';

export default function FaqPage() {
  const [faq, setFaq] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFaq()
      .then((res) => setFaq(res.data?.faq || []))
      .catch(() => setFaq([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Sıkça Sorulan Sorular</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Merak ettiklerinizin yanıtları aşağıda. Bulamadığınız bir konu için iletişime geçebilirsiniz.
      </p>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-10 h-10 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {faq.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">Henüz SSS içeriği eklenmemiş.</p>
          ) : (
            faq.map((item, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {item.question || item.keywords?.join(', ') || `Soru ${i + 1}`}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{item.response}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
