/**
 * Admin Dashboard - özet istatistikler, satış grafiği, son siparişler
 * KairaMarkt - Kayra tarafından yapılmıştır
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboard, getSalesChart } from '../../services/adminService';
import { useSettings } from '../../context/SettingsContext';
import { FiUsers, FiPackage, FiShoppingBag, FiTrendingUp } from 'react-icons/fi';

const MARQUEE_FALLBACK = 'KairaMarkt Admin Paneli · Hoş geldiniz · Sipariş ve ürün yönetimini buradan takip edebilirsiniz · Kayra tarafından yapılmıştır';

export default function AdminDashboard() {
  const { primaryColor, marqueeText } = useSettings();
  const accent = primaryColor || '#b91c1c';
  const [stats, setStats] = useState(null);
  const [lastOrders, setLastOrders] = useState([]);
  const [chart, setChart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getDashboard(), getSalesChart(30)])
      .then(([d, c]) => {
        setStats(d.data.stats);
        setLastOrders(d.data.lastOrders || []);
        setChart(c.data.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-12 h-12 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: accent, borderTopColor: 'transparent' }} />
      </div>
    );
  }

  const marquee = marqueeText?.trim() || MARQUEE_FALLBACK;

  const statCards = [
    { label: 'Toplam Kullanıcı', value: stats?.userCount ?? 0, icon: FiUsers },
    { label: 'Ürün Sayısı', value: stats?.productCount ?? 0, icon: FiPackage },
    { label: 'Sipariş Sayısı', value: stats?.orderCount ?? 0, icon: FiShoppingBag },
    { label: 'Toplam Ciro', value: (stats?.totalRevenue ?? 0).toLocaleString('tr-TR') + ' ₺', icon: FiTrendingUp },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Marquee - ayarlardan veya varsayılan */}
      <div
        className="overflow-hidden rounded-xl sm:rounded-2xl py-2.5 sm:py-3 text-white shadow-lg"
        style={{ background: `linear-gradient(135deg, ${accent} 0%, ${accent}dd 100%)` }}
      >
        <div className="animate-marquee whitespace-nowrap inline-block">
          <span className="inline-block pr-12 font-medium tracking-wide">{marquee}</span>
          <span className="inline-block pr-12 font-medium tracking-wide">{marquee}</span>
        </div>
      </div>

      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Özet istatistikler ve son hareketler</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {statCards.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200/80 dark:border-gray-700 shadow-soft hover:shadow-card-hover transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{label}</p>
                <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
              </div>
              <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700" style={{ color: accent }}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl border border-gray-200/80 dark:border-gray-700 shadow-soft overflow-hidden">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-semibold text-gray-900 dark:text-white text-base sm:text-lg">Son 30 gün satış (günlük)</h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">Son 14 gün listeleniyor</p>
        </div>
        <div className="overflow-x-auto -mx-px">
          <table className="w-full text-sm min-w-[260px]">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/80">
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">Tarih</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600 dark:text-gray-300">Toplam</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600 dark:text-gray-300">Adet</th>
              </tr>
            </thead>
            <tbody>
              {chart.slice(-14).map((row) => (
                <tr key={row._id} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="py-2.5 sm:py-3 px-3 sm:px-4 text-gray-700 dark:text-gray-300">{row._id}</td>
                  <td className="text-right py-2.5 sm:py-3 px-3 sm:px-4 font-medium text-gray-900 dark:text-white">{row.total?.toLocaleString('tr-TR')} ₺</td>
                  <td className="text-right py-2.5 sm:py-3 px-3 sm:px-4 text-gray-600 dark:text-gray-400">{row.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl border border-gray-200/80 dark:border-gray-700 shadow-soft overflow-hidden">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-white text-base sm:text-lg">Son siparişler</h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">En son 10 sipariş</p>
          </div>
          <Link
            to="/admin/siparisler"
            className="text-sm font-medium hover:underline"
            style={{ color: accent }}
          >
            Tüm siparişler →
          </Link>
        </div>
        <div className="p-4 sm:p-6">
          {lastOrders.length ? (
            <ul className="space-y-2 sm:space-y-3">
              {lastOrders.map((o) => (
                <li
                  key={o._id}
                  className="flex flex-wrap justify-between items-center gap-2 py-2 px-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-sm"
                >
                  <span className="text-gray-700 dark:text-gray-300 truncate min-w-0">#{o._id?.slice(-8)} · {o.user?.name}</span>
                  <span className="font-medium text-gray-900 dark:text-white shrink-0">{o.total?.toLocaleString('tr-TR')} ₺</span>
                  <span className="text-xs px-2 py-1 rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 shrink-0 w-full sm:w-auto">{o.status}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 py-4">Henüz sipariş yok.</p>
          )}
        </div>
      </div>
    </div>
  );
}
