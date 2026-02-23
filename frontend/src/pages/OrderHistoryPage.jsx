import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../services/orderService';
import ProtectedRoute from '../components/ProtectedRoute';

const STATUS_LABEL = { pending: 'Beklemede', processing: 'Hazırlanıyor', shipped: 'Kargoda', delivered: 'Teslim edildi', cancelled: 'İptal' };

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders()
      .then((r) => setOrders(r.data.orders || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="container mx-auto px-4 py-12 flex justify-center"><div className="w-10 h-10 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!orders.length) return <div className="container mx-auto px-4 py-12 text-center"><p className="text-gray-500">Henüz sipariş yok.</p><Link to="/urunler" className="text-brand-600 mt-2 inline-block">Alışverişe başla</Link></div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Siparişlerim</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <Link key={order._id} to={`/siparislerim/${order._id}`} className="block p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">#{order._id.slice(-8)}</p>
                <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString('tr-TR')}</p>
                <p className="text-sm mt-1">{order.items?.length} ürün</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-brand-600">{order.total?.toLocaleString('tr-TR')} ₺</p>
                <span className="text-sm text-gray-500">{STATUS_LABEL[order.status] || order.status}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
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
