import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { FiBarChart2, FiTrendingUp } from 'react-icons/fi';
import { getDashboard, getSalesChart } from '../../services/adminService';

export default function AdminReports() {
  const [stats, setStats] = useState(null);
  const [chart, setChart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([getDashboard(), getSalesChart(30)])
      .then(([d, c]) => {
        setStats(d.data.stats || null);
        setChart(c.data.data || []);
      })
      .catch(() => toast.error('Raporlar yüklenemedi'))
      .finally(() => setLoading(false));
  }, []);

  const monthly = useMemo(() => {
    if (!chart.length) return { total: 0, count: 0 };
    const sumTotal = chart.reduce((acc, row) => acc + (row.total || 0), 0);
    const sumCount = chart.reduce((acc, row) => acc + (row.count || 0), 0);
    return { total: sumTotal, count: sumCount };
  }, [chart]);

  const points = chart.slice(-14); // son 14 gün
  const maxValue = points.reduce((m, p) => Math.max(m, p.total || 0), 0) || 1;

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FiBarChart2 className="w-6 h-6 text-theme" />
            Raporlar
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Satış, sipariş ve kullanıcı raporlarını buradan takip edebilirsiniz.
          </p>
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-10 h-10 border-2 border-theme border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Son 30 gün ciro</p>
              <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {monthly.total.toLocaleString('tr-TR')} ₺
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Son 30 gün sipariş</p>
              <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {monthly.count}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Toplam ciro (tümü)</p>
              <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {(stats?.totalRevenue || 0).toLocaleString('tr-TR')} ₺
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <FiTrendingUp className="w-5 h-5 text-theme" />
                Son 14 gün satış grafiği
              </h2>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Günlük toplam ciro (₺)
              </span>
            </div>

            {points.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Henüz satış verisi bulunmuyor.
              </p>
            ) : (
              <div className="mt-2">
                <div className="h-48 flex items-end gap-1 border border-gray-200 dark:border-gray-700 rounded-xl px-2 py-3 bg-gray-50 dark:bg-gray-900/40 overflow-x-auto">
                  {points.map((p) => {
                    const h = (p.total || 0) / maxValue;
                    const height = Math.max(8, Math.round(h * 140));
                    return (
                      <div key={p._id} className="flex flex-col items-center justify-end min-w-[26px]">
                        <div
                          className="w-4 rounded-t-full bg-theme/80 hover:bg-theme transition-colors"
                          style={{ height }}
                          title={`${p._id} - ${(p.total || 0).toLocaleString('tr-TR')} ₺`}
                        />
                        <span className="mt-1 text-[10px] text-gray-500 dark:text-gray-400 rotate-[-45deg] origin-top">
                          {p._id.slice(5)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

