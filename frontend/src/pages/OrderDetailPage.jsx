import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById } from '../services/orderService';
import ProtectedRoute from '../components/ProtectedRoute';

const STATUS_LABEL = { pending: 'Beklemede', processing: 'Hazırlanıyor', shipped: 'Kargoda', delivered: 'Teslim edildi', cancelled: 'İptal' };

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

  if (loading) return <div className="container mx-auto px-4 py-12 flex justify-center"><div className="w-10 h-10 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!order) return <div className="container mx-auto px-4 py-12 text-center"><p>Sipariş bulunamadı.</p><Link to="/siparislerim" className="text-brand-600">Siparişlerime dön</Link></div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Link to="/siparislerim" className="text-brand-600 hover:underline mb-4 inline-block">← Siparişlerim</Link>
      <h1 className="text-2xl font-bold mb-6">Sipariş #{order._id.slice(-8)}</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">Durum: <strong>{STATUS_LABEL[order.status] || order.status}</strong></p>
      <ul className="space-y-4 mb-6">
        {order.items?.map((item, i) => (
          <li key={i} className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            {item.image && <img src={item.image} alt={item.name} className="w-16 h-16 object-contain rounded" />}
            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-500">{item.quantity} x {item.price?.toLocaleString('tr-TR')} ₺</p>
            </div>
            <p className="font-medium">{(item.quantity * item.price)?.toLocaleString('tr-TR')} ₺</p>
          </li>
        ))}
      </ul>
      <div className="border-t pt-4 space-y-1">
        <div className="flex justify-between"><span>Ara toplam</span><span>{order.subtotal?.toLocaleString('tr-TR')} ₺</span></div>
        <div className="flex justify-between"><span>KDV</span><span>{order.tax?.toLocaleString('tr-TR')} ₺</span></div>
        {order.discount > 0 && <div className="flex justify-between text-green-600"><span>İndirim</span><span>-{order.discount?.toLocaleString('tr-TR')} ₺</span></div>}
        <div className="flex justify-between font-bold text-lg"><span>Toplam</span><span>{order.total?.toLocaleString('tr-TR')} ₺</span></div>
      </div>
      {order.shippingAddress?.fullAddress && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 className="font-medium mb-2">Teslimat adresi</h3>
          <p>{order.shippingAddress.fullName}</p>
          <p>{order.shippingAddress.fullAddress}, {order.shippingAddress.district} / {order.shippingAddress.city}</p>
          {order.shippingAddress.phone && <p>{order.shippingAddress.phone}</p>}
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
