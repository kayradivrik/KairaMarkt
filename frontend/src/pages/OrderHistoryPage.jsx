import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiShoppingBag, FiChevronRight, FiCalendar } from 'react-icons/fi';
import { getMyOrders } from '../services/orderService';
import ProtectedRoute from '../components/ProtectedRoute';
import Breadcrumb from '../components/Breadcrumb';
import LoadingSpinner from '../components/LoadingSpinner';

const STATUS_LABEL = {
  pending: 'Beklemede',
  processing: 'Hazırlanıyor',
  shipped: 'Kargoda',
  delivered: 'Teslim edildi',
  cancelled: 'İptal',
};

const STATUS_STYLE = {
  pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  shipped: 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300 border-violet-200 dark:border-violet-800',
  delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800',
};

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders()
      .then((r) => setOrders(r.data.orders || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[40vh]">
        <LoadingSpinner ariaLabel="Siparişler yükleniyor" />
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Siparişleriniz getiriliyor...</p>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={[{ label: 'Ana Sayfa', href: '/' }, { label: 'Siparişlerim' }]} />
        <div className="max-w-md mx-auto text-center py-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 mb-6">
            <FiPackage className="w-10 h-10" aria-hidden />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Henüz sipariş yok</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Verdiğiniz siparişler burada listelenecek.</p>
          <Link to="/urunler" className="inline-flex items-center gap-2 px-6 py-3 btn-theme font-semibold rounded-2xl">
            <FiShoppingBag className="w-5 h-5" aria-hidden />
            Alışverişe başla
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Breadcrumb items={[{ label: 'Ana Sayfa', href: '/' }, { label: 'Siparişlerim' }]} />
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 rounded-xl bg-theme/10 text-theme">
          <FiPackage className="w-6 h-6" aria-hidden />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Siparişlerim</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{orders.length} sipariş</p>
        </div>
      </div>

      <ul className="space-y-4">
        {orders.map((order) => {
          const statusStyle = STATUS_STYLE[order.status] || STATUS_STYLE.pending;
          const statusLabel = STATUS_LABEL[order.status] || order.status;
          return (
            <li key={order._id}>
              <Link
                to={`/siparislerim/${order._id}`}
                className="block rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 hover:shadow-lg hover:border-theme/30 dark:hover:border-theme/30 transition-all duration-200 group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-mono font-semibold text-gray-900 dark:text-white">#{order._id.slice(-8).toUpperCase()}</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium border ${statusStyle}`}>
                        {statusLabel}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="inline-flex items-center gap-1.5">
                        <FiCalendar className="w-4 h-4 flex-shrink-0" aria-hidden />
                        {new Date(order.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                      <span>{order.items?.length || 0} ürün</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <span className="text-xl font-bold text-theme">{order.total?.toLocaleString('tr-TR')} ₺</span>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-theme group-hover:gap-2 transition-all">
                      Detay
                      <FiChevronRight className="w-5 h-5 flex-shrink-0" aria-hidden />
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function OrderHistoryPage() {
  return (
    <ProtectedRoute>
      <OrderList />
    </ProtectedRoute>
  );
}
