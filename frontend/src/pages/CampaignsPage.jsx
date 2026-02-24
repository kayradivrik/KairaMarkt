/**
 * Kampanyalar - Aktif kuponlar listesi
 * KairaMarkt - Kayra tarafından yapılmıştır
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getActiveCampaigns } from '../services/campaignService';
import { FiTag } from 'react-icons/fi';

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActiveCampaigns()
      .then((res) => setCampaigns(res.data?.campaigns || []))
      .catch(() => setCampaigns([]))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString('tr-TR') : '-');
  const discountText = (c) =>
    c.discountType === 'percent'
      ? `%${c.discountValue} indirim`
      : `${c.discountValue?.toLocaleString('tr-TR')} ₺ indirim`;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Kampanyalar</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Güncel kuponları ödeme sayfasında kullanabilirsiniz. Minimum alışveriş tutarı kampanya kartında belirtilir.
      </p>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-10 h-10 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : campaigns.length === 0 ? (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 text-center">
          <FiTag className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">Şu an aktif kampanya bulunmuyor.</p>
          <Link to="/urunler" className="inline-block mt-4 text-theme font-medium hover:underline">
            Ürünlere göz at →
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((c) => (
            <div
              key={c._id}
              className="rounded-xl border-2 border-red-200 dark:border-red-900/50 bg-white dark:bg-gray-800 p-5 hover:shadow-lg transition-ux"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{c.name}</h3>
                  {c.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{c.description}</p>
                  )}
                </div>
                <span className="px-2 py-1 rounded bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 text-sm font-semibold whitespace-nowrap">
                  {discountText(c)}
                </span>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <p className="text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Kupon kodu: </span>
                  <code className="font-mono font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                    {c.code}
                  </code>
                </p>
                {c.minPurchase > 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Min. alışveriş: {c.minPurchase.toLocaleString('tr-TR')} ₺
                  </p>
                )}
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Geçerlilik: {formatDate(c.endDate)}
                </p>
              </div>
              <Link
                to="/sepet"
                className="mt-4 inline-block text-sm font-medium text-theme hover:underline"
              >
                Sepete git ve kullan →
              </Link>
            </div>
          ))}
        </div>
      )}

      <div className="mt-10 text-center">
        <Link
          to="/odeme"
          className="inline-flex items-center gap-2 px-5 py-2.5 btn-theme font-semibold rounded-xl transition-ux"
        >
          Ödeme sayfasında kupon gir
        </Link>
      </div>
    </div>
  );
}
