import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById } from '../services/orderService';
import { FiArrowLeft, FiPackage, FiMapPin, FiCheck, FiPrinter } from 'react-icons/fi';
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

const STATUS_STEPS = [
  { key: 'pending', label: 'Beklemede' },
  { key: 'processing', label: 'Hazırlanıyor' },
  { key: 'shipped', label: 'Kargoda' },
  { key: 'delivered', label: 'Teslim edildi' },
];

function OrderDetailContent() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getOrderById(id)
      .then((r) => setOrder(r.data.order))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[40vh]">
        <LoadingSpinner ariaLabel="Sipariş yükleniyor" />
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Sipariş detayı getiriliyor...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Breadcrumb items={[{ label: 'Ana Sayfa', href: '/' }, { label: 'Siparişlerim', href: '/siparislerim' }, { label: 'Detay' }]} />
        <div className="text-center py-16">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Sipariş bulunamadı.</p>
          <Link to="/siparislerim" className="inline-flex items-center gap-2 text-theme font-medium hover:underline">
            <FiArrowLeft className="w-4 h-4" aria-hidden />
            Siparişlerime dön
          </Link>
        </div>
      </div>
    );
  }

  const statusLabel = STATUS_LABEL[order.status] || order.status;
  const currentStepIndex = STATUS_STEPS.findIndex((s) => s.key === order.status);
  const isCancelled = order.status === 'cancelled';

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Breadcrumb items={[{ label: 'Ana Sayfa', href: '/' }, { label: 'Siparişlerim', href: '/siparislerim' }, { label: `#${order._id.slice(-8).toUpperCase()}` }]} />

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <Link to="/siparislerim" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-theme font-medium transition-colors">
          <FiArrowLeft className="w-4 h-4" aria-hidden />
          Siparişlerime dön
        </Link>
        <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium print:hidden">
          <FiPrinter className="w-4 h-4" aria-hidden />
          Yazdır
        </button>
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 mb-6 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-theme/10 text-theme">
              <FiPackage className="w-6 h-6" aria-hidden />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white font-mono">#{order._id.slice(-8).toUpperCase()}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {new Date(order.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
          <div className="text-right">
            <span
              className={`inline-flex items-center px-3 py-1.5 rounded-xl text-sm font-semibold border ${
                isCancelled
                  ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800'
                  : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800'
              }`}
            >
              {statusLabel}
            </span>
            <p className="text-2xl font-bold text-theme mt-2">{order.total?.toLocaleString('tr-TR')} ₺</p>
          </div>
        </div>

        {!isCancelled && (
          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Sipariş durumu</p>
            <div className="relative flex items-start justify-between">
              {STATUS_STEPS.map((step, i) => {
                const isActive = i <= currentStepIndex;
                return (
                  <div key={step.key} className="flex flex-col items-center flex-1 relative z-10">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${
                        isActive ? 'bg-theme border-theme text-white' : 'border-gray-200 dark:border-gray-600 text-gray-400 dark:text-gray-500'
                      }`}
                    >
                      {isActive ? <FiCheck className="w-4 h-4" aria-hidden /> : i + 1}
                    </div>
                    <p className={`mt-1.5 text-xs font-medium text-center max-w-[4rem] ${isActive ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'}`}>
                      {step.label}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="relative h-1 bg-gray-200 dark:bg-gray-600 rounded-full mt-2 mx-4 -mb-1">
              <div
                className="absolute top-0 left-0 h-full bg-theme rounded-full transition-all duration-500"
                style={{ width: `${currentStepIndex >= 0 ? ((currentStepIndex + 1) / STATUS_STEPS.length) * 100 : 0}%` }}
                aria-hidden
              />
            </div>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden shadow-soft mb-6">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="font-bold text-gray-900 dark:text-white">Sipariş içeriği</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{order.items?.length || 0} ürün</p>
        </div>
        <ul className="divide-y divide-gray-100 dark:divide-gray-700">
          {order.items?.map((item, i) => (
            <li key={i} className="flex gap-4 p-5 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
              <div className="w-20 h-20 flex-shrink-0 rounded-xl bg-gray-100 dark:bg-gray-700 overflow-hidden">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <FiPackage className="w-8 h-8" aria-hidden />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-white line-clamp-2">{item.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  {item.quantity} adet × {item.price?.toLocaleString('tr-TR')} ₺
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-semibold text-gray-900 dark:text-white">{(item.quantity * item.price)?.toLocaleString('tr-TR')} ₺</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-soft mb-6">
        <h2 className="font-bold text-gray-900 dark:text-white mb-4">Özet</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-gray-600 dark:text-gray-400">
            <span>Ara toplam</span>
            <span>{order.subtotal?.toLocaleString('tr-TR')} ₺</span>
          </div>
          <div className="flex justify-between text-gray-600 dark:text-gray-400">
            <span>KDV</span>
            <span>{order.tax?.toLocaleString('tr-TR')} ₺</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-green-600 dark:text-green-400">
              <span>İndirim</span>
              <span>-{order.discount?.toLocaleString('tr-TR')} ₺</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg pt-3 border-t border-gray-200 dark:border-gray-700 mt-3">
            <span>Toplam</span>
            <span className="text-theme">{order.total?.toLocaleString('tr-TR')} ₺</span>
          </div>
        </div>
      </div>

      {order.shippingAddress?.fullAddress && (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-soft">
          <h2 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <FiMapPin className="w-5 h-5 text-theme" aria-hidden />
            Teslimat adresi
          </h2>
          <div className="text-gray-600 dark:text-gray-400 text-sm space-y-1">
            <p className="font-medium text-gray-900 dark:text-white">{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.fullAddress}</p>
            <p>
              {order.shippingAddress.district}, {order.shippingAddress.city}
            </p>
            {order.shippingAddress.phone && <p>{order.shippingAddress.phone}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrderDetailPage() {
  return (
    <ProtectedRoute>
      <OrderDetailContent />
    </ProtectedRoute>
  );
}