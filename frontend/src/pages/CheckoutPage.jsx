import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services/orderService';
import { validateCoupon } from '../services/campaignService';
import ProtectedRoute from '../components/ProtectedRoute';

const schema = Yup.object({
  fullName: Yup.string().required('Ad soyad gerekli'),
  phone: Yup.string().required('Telefon gerekli'),
  city: Yup.string().required('Şehir gerekli'),
  district: Yup.string().required('İlçe gerekli'),
  fullAddress: Yup.string().required('Adres gerekli'),
  zipCode: Yup.string(),
});

function CheckoutForm() {
  const navigate = useNavigate();
  const { items, subtotal, tax, clearCart, setCart } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  const totalWithoutCoupon = subtotal + tax;
  const total = Math.max(0, totalWithoutCoupon - couponDiscount);

  const handleValidateCoupon = () => {
    if (!couponCode.trim()) return;
    setValidatingCoupon(true);
    validateCoupon(couponCode.trim(), subtotal)
      .then((r) => {
        if (r.data.success && r.data.calculatedDiscount) {
          setCouponDiscount(r.data.calculatedDiscount);
          toast.success('Kupon uygulandı');
        } else {
          setCouponDiscount(0);
          toast.error(r.data.message || 'Kupon geçersiz');
        }
      })
      .catch(() => {
        setCouponDiscount(0);
        toast.error('Kupon geçersiz');
      })
      .finally(() => setValidatingCoupon(false));
  };

  useEffect(() => {
    if (items.length === 0) navigate('/sepet');
  }, [items.length, navigate]);

  if (items.length === 0) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Ödeme (Simülasyon)</h1>
      <Formik
        initialValues={{
          fullName: '',
          phone: '',
          city: '',
          district: '',
          fullAddress: '',
          zipCode: '',
        }}
        validationSchema={schema}
        onSubmit={async (values) => {
          try {
            const order = await createOrder({
              items: items.map((i) => ({ product: i.product._id, quantity: i.quantity })),
              shippingAddress: values,
              couponCode: couponDiscount > 0 ? couponCode : undefined,
            });
            clearCart();
            toast.success('Siparişiniz alındı');
            navigate(`/siparislerim/${order.data.order._id}`);
          } catch (err) {
            toast.error(err.message || 'Sipariş oluşturulamadı');
          }
        }}
      >
        {({ errors, touched }) => (
          <Form className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="font-bold">Teslimat Bilgileri</h2>
              <div>
                <label className="block text-sm font-medium mb-1">Ad Soyad</label>
                <Field name="fullName" className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2" />
                {errors.fullName && touched.fullName && <p className="text-brand-600 text-sm">{errors.fullName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Telefon</label>
                <Field name="phone" type="tel" className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2" />
                {errors.phone && touched.phone && <p className="text-brand-600 text-sm">{errors.phone}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Şehir</label>
                <Field name="city" className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2" />
                {errors.city && touched.city && <p className="text-brand-600 text-sm">{errors.city}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">İlçe</label>
                <Field name="district" className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2" />
                {errors.district && touched.district && <p className="text-brand-600 text-sm">{errors.district}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Adres</label>
                <Field as="textarea" name="fullAddress" rows={3} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2" />
                {errors.fullAddress && touched.fullAddress && <p className="text-brand-600 text-sm">{errors.fullAddress}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Posta kodu</label>
                <Field name="zipCode" className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2" />
              </div>
            </div>
            <div>
              <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <h2 className="font-bold mb-4">Sipariş özeti</h2>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  {items.map((i) => (
                    <li key={i.product?._id}>{i.product?.name} x {i.quantity}</li>
                  ))}
                </ul>
                <div className="mt-4 flex gap-2">
                  <input type="text" name="coupon" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="Kupon kodu" className="flex-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2" />
                  <button type="button" onClick={handleValidateCoupon} disabled={validatingCoupon} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded">Uygula</button>
                </div>
                <div className="mt-4 space-y-1">
                  <div className="flex justify-between"><span>Ara toplam</span><span>{subtotal?.toLocaleString('tr-TR')} ₺</span></div>
                  <div className="flex justify-between"><span>KDV</span><span>{tax?.toLocaleString('tr-TR')} ₺</span></div>
                  {couponDiscount > 0 && <div className="flex justify-between text-green-600"><span>İndirim</span><span>-{couponDiscount?.toLocaleString('tr-TR')} ₺</span></div>}
                  <div className="flex justify-between font-bold text-lg pt-2 border-t"><span>Toplam</span><span>{total?.toLocaleString('tr-TR')} ₺</span></div>
                </div>
                <button type="submit" className="mt-6 w-full py-3 bg-brand-500 text-white font-bold rounded-2xl hover:bg-brand-600">Siparişi Tamamla</button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <ProtectedRoute>
      <CheckoutForm />
    </ProtectedRoute>
  );
}
