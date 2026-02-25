import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getActiveCampaigns } from '../services/campaignService';
import { FiTag, FiChevronRight, FiCopy } from 'react-icons/fi';
import Breadcrumb from '../components/Breadcrumb';
import LoadingSpinner from '../components/LoadingSpinner';
import { useSettings } from '../context/SettingsContext';

export default function CampaignsPage() {
  const { primaryColor } = useSettings();
  const accent = primaryColor || '#b91c1c';
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActiveCampaigns()
      .then((res) => setCampaigns(res.data?.campaigns || []))
      .catch(() => setCampaigns([]))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) : '-');

  const discountText = (c) =>
    c.discountType === 'percent'
      ? `%${c.discountValue} indirim`
      : `${c.discountValue?.toLocaleString('tr-TR')} ₺ indirim`;

  const copyCode = (code) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code).then(() => toast.success('Kupon kodu kopyalandı'));
    } else {
      toast.success('Kupon: ' + code);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Breadcrumb items={[{ label: 'Ana Sayfa', href: '/' }, { label: 'Kampanyalar' }]} />

      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 rounded-2xl text-white" style={{ backgroundColor: accent }}>
          <FiTag className="w-8 h-8" aria-hidden />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Kampanyalar</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-0.5">Kuponları ödeme sayfasında kullanın</p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-6 mb-8" style={{ borderLeftWidth: '4px', borderLeftColor: accent }}>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Güncel kuponları aşağıdan kopyalayıp sepetinize ürün ekledikten sonra ödeme sayfasında kupon alanına yapıştırabilirsiniz. Minimum alışveriş tutarı her kampanya kartında belirtilir.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <LoadingSpinner ariaLabel="Kampanyalar yükleniyor" />
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Kampanyalar getiriliyor...</p>
        </div>
      ) : campaigns.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 mb-4">
            <FiTag className="w-10 h-10" aria-hidden />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Şu an aktif kampanya yok</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Yeni kampanyaları kaçırmayın, ara sıra uğrayın.</p>
          <Link
            to="/urunler"
            className="inline-flex items-center gap-2 px-6 py-3 btn-theme font-semibold rounded-2xl"
          >
            Ürünlere göz at
            <FiChevronRight className="w-5 h-5" aria-hidden />
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((c) => (
            <div
              key={c._id}
              className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden hover:shadow-lg transition-all duration-200 hover:border-theme/50"
            >
              <div className="p-5 pb-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg">{c.name}</h3>
                  <span
                    className="px-3 py-1 rounded-xl text-sm font-bold whitespace-nowrap text-white"
                    style={{ backgroundColor: accent }}
                  >
                    {discountText(c)}
                  </span>
                </div>
                {c.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">{c.description}</p>
                )}
              </div>
              <div className="p-5 pt-4 space-y-3">
                <div className="flex items-center gap-2">
                  <code className="flex-1 font-mono text-sm font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-xl truncate">
                    {c.code}
                  </code>
                  <button
                    type="button"
                    onClick={() => copyCode(c.code)}
                    className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title="Kopyala"
                    aria-label="Kupon kodunu kopyala"
                  >
                    <FiCopy className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
                {c.minPurchase > 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Min. alışveriş: <strong className="text-gray-700 dark:text-gray-300">{c.minPurchase.toLocaleString('tr-TR')} ₺</strong>
                  </p>
                )}
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Geçerlilik: {formatDate(c.endDate)}
                </p>
              </div>
              <div className="px-5 pb-5">
                <Link
                  to="/sepet"
                  className="inline-flex items-center gap-2 text-sm font-semibold hover:underline"
                  style={{ color: accent }}
                >
                  Sepete git ve kullan
                  <FiChevronRight className="w-4 h-4" aria-hidden />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && campaigns.length > 0 && (
        <div className="mt-10 text-center">
          <Link
            to="/odeme"
            className="inline-flex items-center gap-2 px-6 py-3 btn-theme font-semibold rounded-2xl"
          >
            Ödeme sayfasında kupon gir
            <FiChevronRight className="w-5 h-5" aria-hidden />
          </Link>
        </div>
      )}
    </div>
  );
}
