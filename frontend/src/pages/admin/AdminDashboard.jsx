import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboard, getSalesChart } from '../../services/adminService';
import { useSettings } from '../../context/SettingsContext';
import {
  FiUsers,
  FiPackage,
  FiShoppingBag,
  FiTrendingUp,
  FiChevronRight,
  FiAlertTriangle,
  FiPlusCircle,
  FiMessageSquare,
  FiSettings,
  FiBox,
} from 'react-icons/fi';

const MARQUEE_FALLBACK = 'KairaMarkt Admin Paneli · Hoş geldiniz · Sipariş ve ürün yönetimini buradan takip edebilirsiniz';

export default function AdminDashboard() {
  const { primaryColor, marqueeText } = useSettings();
  const accent = primaryColor || '#b91c1c';
  const [stats, setStats] = useState(null);
  const [lastOrders, setLastOrders] = useState([]);
  const [lastReviews, setLastReviews] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [chart, setChart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getDashboard(), getSalesChart(30)])
      .then(([d, c]) => {
        setStats(d.data.stats);
        setLastOrders(d.data.lastOrders || []);
        setLastReviews(d.data.lastReviews || []);
        setLowStockProducts(d.data.lowStockProducts || []);
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
  const lowStockCount = stats?.lowStockCount ?? 0;
  const pendingOrdersCount = stats?.pendingOrdersCount ?? 0;

  const statCards = [
    { label: 'Toplam Kullanıcı', value: stats?.userCount ?? 0, icon: FiUsers },
    { label: 'Ürün Sayısı', value: stats?.productCount ?? 0, icon: FiPackage },
    { label: 'Sipariş Sayısı', value: stats?.orderCount ?? 0, icon: FiShoppingBag },
    { label: 'Toplam Ciro', value: (stats?.totalRevenue ?? 0).toLocaleString('tr-TR') + ' ₺', icon: FiTrendingUp },
  ];

  const quickActions = [
    { to: '/admin/urunler/yeni', label: 'Ürün ekle', icon: FiPlusCircle },
    { to: '/admin/siparisler', label: 'Siparişler', icon: FiShoppingBag },
    { to: '/admin/yorumlar', label: 'Yorumlar', icon: FiMessageSquare },
    { to: '/admin/ayarlar', label: 'Site ayarları', icon: FiSettings },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
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

      {(lowStockCount > 0 || pendingOrdersCount > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pendingOrdersCount > 0 && (
            <Link
              to="/admin/siparisler?status=pending"
              className="flex items-center gap-4 p-4 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
            >
              <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400">
                <FiAlertTriangle className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-amber-800 dark:text-amber-200">Bekleyen siparişler</p>
                <p className="text-sm text-amber-700 dark:text-amber-300">{pendingOrdersCount} sipariş onay bekliyor</p>
              </div>
              <FiChevronRight className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            </Link>
          )}
          {lowStockCount > 0 && (
            <Link
              to="/admin/urunler"
              className="flex items-center gap-4 p-4 rounded-xl border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
            >
              <div className="p-2.5 rounded-xl bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400">
                <FiBox className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-orange-800 dark:text-orange-200">Düşük stok uyarısı</p>
                <p className="text-sm text-orange-700 dark:text-orange-300">{lowStockCount} ürün stokta az (≤5 adet)</p>
              </div>
              <FiChevronRight className="w-5 h-5 text-orange-600 dark:text-orange-400 shrink-0" />
            </Link>
          )}
        </div>
      )}

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

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {quickActions.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
            style={{ borderLeftWidth: '3px', borderLeftColor: accent }}
          >
            <Icon className="w-5 h-5 shrink-0" style={{ color: accent }} />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{label}</span>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
            <Link to="/admin/siparisler" className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline" style={{ color: accent }}>
              Tüm siparişler
              <FiChevronRight className="w-4 h-4" aria-hidden />
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {lowStockProducts.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl border border-gray-200/80 dark:border-gray-700 shadow-soft overflow-hidden">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="font-semibold text-gray-900 dark:text-white text-base sm:text-lg">Düşük stoklu ürünler</h2>
              <Link to="/admin/urunler" className="text-sm font-medium hover:underline" style={{ color: accent }}>
                Tümü
              </Link>
            </div>
            <ul className="p-4 sm:p-6 space-y-2">
              {lowStockProducts.map((p) => (
                <li key={p._id} className="flex justify-between items-center py-2 px-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-sm">
                  <span className="text-gray-700 dark:text-gray-300 truncate">{p.name}</span>
                  <span className="font-medium text-orange-600 dark:text-orange-400 shrink-0">{p.stock} adet</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl border border-gray-200/80 dark:border-gray-700 shadow-soft overflow-hidden">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="font-semibold text-gray-900 dark:text-white text-base sm:text-lg">Son incelemeler</h2>
            <Link to="/admin/yorumlar" className="text-sm font-medium hover:underline" style={{ color: accent }}>
              Tümü
            </Link>
          </div>
          <div className="p-4 sm:p-6">
            {lastReviews.length ? (
              <ul className="space-y-3">
                {lastReviews.map((r) => (
                  <li key={r._id} className="py-2 px-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-sm">
                    <p className="text-gray-700 dark:text-gray-300 line-clamp-2">{r.comment || '(Yorum yok)'}</p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {r.user?.name} · {r.product?.name} · {r.rating}/5
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 py-4">Henüz inceleme yok.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
