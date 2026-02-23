/**
 * Admin Dashboard - özet istatistikler, satış grafiği, son siparişler
 * KairaMarkt - Kayra tarafından yapılmıştır
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboard, getSalesChart } from '../../services/adminService';

const MARQUEE_TEXT = 'KairaMarkt Admin Paneli · Hoş geldiniz · Sipariş ve ürün yönetimini buradan takip edebilirsiniz · Kayra tarafından yapılmıştır';

export default function AdminDashboard() {
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

  if (loading) return <div className="flex justify-center py-12"><div className="w-10 h-10 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      {/* Marquee: Kayra tarafından yapılmıştır - dashboard duyuru şeridi */}
      <div className="overflow-hidden rounded-xl bg-red-600 text-white py-2 mb-6 border border-red-700">
        <div className="animate-marquee whitespace-nowrap inline-block">
          <span className="inline-block pr-8">{MARQUEE_TEXT}</span>
          <span className="inline-block pr-8">{MARQUEE_TEXT}</span>
        </div>
      </div>

      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 text-sm">Toplam Kullanıcı</p>
          <p className="text-2xl font-bold">{stats?.userCount ?? 0}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 text-sm">Ürün Sayısı</p>
          <p className="text-2xl font-bold">{stats?.productCount ?? 0}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 text-sm">Sipariş Sayısı</p>
          <p className="text-2xl font-bold">{stats?.orderCount ?? 0}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 text-sm">Toplam Ciro</p>
          <p className="text-2xl font-bold">{(stats?.totalRevenue ?? 0).toLocaleString('tr-TR')} ₺</p>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-8">
        <h2 className="font-bold mb-4">Son 30 gün satış (günlük)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr><th className="text-left py-2">Tarih</th><th className="text-right">Toplam</th><th className="text-right">Adet</th></tr></thead>
            <tbody>
              {chart.slice(-14).map((row) => (
                <tr key={row._id} className="border-t border-gray-200 dark:border-gray-700">
                  <td className="py-2">{row._id}</td>
                  <td className="text-right">{row.total?.toLocaleString('tr-TR')} ₺</td>
                  <td className="text-right">{row.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="font-bold mb-4">Son siparişler</h2>
        {lastOrders.length ? (
          <ul className="space-y-2">
            {lastOrders.map((o) => (
              <li key={o._id} className="flex justify-between text-sm">
                <span>#{o._id?.slice(-8)} - {o.user?.name}</span>
                <span>{o.total?.toLocaleString('tr-TR')} ₺ - {o.status}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Henüz sipariş yok.</p>
        )}
        <Link to="/admin/siparisler" className="text-brand-600 text-sm mt-2 inline-block">Tüm siparişler →</Link>
      </div>
    </div>
  );
}
