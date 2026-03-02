import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiTrendingUp } from 'react-icons/fi';
import { getStockReport } from '../../services/adminService';

export default function AdminStockReport() {
  const [summary, setSummary] = useState(null);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStockReport()
      .then((r) => {
        setSummary(r.data.summary || null);
        setLowStock(r.data.lowStock || []);
      })
      .catch(() => toast.error('Stok raporu yüklenemedi'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <FiTrendingUp className="w-6 h-6 text-theme" />
          Stok raporu
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Düşük stoklu ürünler, kritik stok seviyeleri ve toplam stok değeri.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Toplam ürün</p>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{summary?.count ?? 0}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Toplam stok adedi</p>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{summary?.totalStock ?? 0}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Tahmini stok değeri</p>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
            {(summary?.totalValue ?? 0).toLocaleString('tr-TR')} ₺
          </p>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-3">Düşük stoklu ürünler</h2>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-2 border-theme border-t-transparent rounded-full animate-spin" />
          </div>
        ) : lowStock.length ? (
          <div className="overflow-x-auto -mx-2">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/80">
                  <th className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-300">Ürün</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-300">Kategori</th>
                  <th className="px-3 py-2 text-right font-medium text-gray-600 dark:text-gray-300">Stok</th>
                  <th className="px-3 py-2 text-right font-medium text-gray-600 dark:text-gray-300">Fiyat</th>
                </tr>
              </thead>
              <tbody>
                {lowStock.map((p) => (
                  <tr key={p._id} className="border-t border-gray-200 dark:border-gray-700">
                    <td className="px-3 py-2 text-gray-900 dark:text-white">{p.name}</td>
                    <td className="px-3 py-2 text-gray-700 dark:text-gray-300">{p.category}</td>
                    <td className="px-3 py-2 text-right text-orange-600 dark:text-orange-400">{p.stock}</td>
                    <td className="px-3 py-2 text-right text-gray-700 dark:text-gray-300">
                      {(p.price ?? 0).toLocaleString('tr-TR')} ₺
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">Şu anda düşük stoklu ürün bulunmuyor.</p>
        )}
      </div>
    </div>
  );
}

