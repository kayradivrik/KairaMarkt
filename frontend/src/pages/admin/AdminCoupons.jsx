import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiPercent, FiPlusCircle } from 'react-icons/fi';
import { getCampaigns } from '../../services/adminService';

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCampaigns()
      .then((r) => setCoupons(r.data.campaigns || []))
      .catch(() => toast.error('Kupon kampanyaları yüklenemedi'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FiPercent className="w-6 h-6 text-theme" />
            Kuponlar
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            İndirim kodlarını yönetin, kampanyalar için özel kuponlar oluşturun.
          </p>
        </div>
        <Link
          to="/admin/kampanyalar"
          className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 bg-theme text-white text-sm font-medium hover:brightness-110"
        >
          <FiPlusCircle className="w-4 h-4" />
          Yeni kupon oluştur
        </Link>
      </header>

      <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-2 border-theme border-t-transparent rounded-full animate-spin" />
          </div>
        ) : coupons.length ? (
          <div className="overflow-x-auto -mx-2">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/80">
                  <th className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-300">Kod</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-300">Açıklama</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-300">İndirim</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-300">Durum</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((c) => (
                  <tr key={c._id} className="border-t border-gray-200 dark:border-gray-700">
                    <td className="px-3 py-2 font-semibold text-gray-900 dark:text-white">{c.code}</td>
                    <td className="px-3 py-2 text-gray-700 dark:text-gray-300">{c.description}</td>
                    <td className="px-3 py-2 text-gray-700 dark:text-gray-300">
                      {c.discountType === 'percent' ? `%${c.discountValue}` : `${c.discountValue} ₺`}
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                          c.isActive
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {c.isActive ? 'Aktif' : 'Pasif'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">Henüz kupon oluşturulmamış.</p>
        )}
      </div>
    </div>
  );
}

