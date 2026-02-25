import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services/orderService';
import { validateCoupon } from '../services/campaignService';
import { FiAlertTriangle, FiArrowLeft } from 'react-icons/fi';
import ProtectedRoute from '../components/ProtectedRoute';
import OrderSuccessCelebration from '../components/OrderSuccessCelebration';
import Breadcrumb from '../components/Breadcrumb';

const shippingSchema = Yup.object({
  fullName: Yup.string().required('Ad soyad gerekli'),
  phone: Yup.string().required('Telefon gerekli'),
  city: Yup.string().required('Şehir gerekli'),
  district: Yup.string().required('İlçe gerekli'),
  fullAddress: Yup.string().required('Adres gerekli'),
  zipCode: Yup.string(),
});

const fullSchema = Yup.object({
  fullName: Yup.string().required('Ad soyad gerekli'),
  phone: Yup.string().required('Telefon gerekli'),
  city: Yup.string().required('Şehir gerekli'),
  district: Yup.string().required('İlçe gerekli'),
  fullAddress: Yup.string().required('Adres gerekli'),
  zipCode: Yup.string(),
  cardNumber: Yup.string(),
  cardHolder: Yup.string(),
  expiryMonth: Yup.string(),
  expiryYear: Yup.string(),
  cvv: Yup.string(),
});

function formatCardNumber(value) {
  const v = (value || '').replace(/\D/g, '').slice(0, 16);
  return v.replace(/(.{4})/g, '$1 ').trim();
}

function CardPreview({ cardNumber, cardHolder, expiryMonth, expiryYear, cvv }) {
  const displayNumber = formatCardNumber(cardNumber) || '•••• •••• •••• ••••';
  const displayHolder = (cardHolder || '').toUpperCase() || 'KART SAHİBİNİN ADI';
  const mm = (expiryMonth || '').padStart(2, '0').slice(0, 2) || 'MM';
  const yy = (expiryYear || '').slice(-2) || 'YY';
  const displayCvv = (cvv || '').replace(/\D/g, '').slice(0, 4) || '•••';
  return (
    <div className="aspect-[1.586/1] max-w-[320px] w-full rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-black text-white shadow-xl border border-gray-700/50 p-5 flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <div className="w-10 h-8 rounded bg-amber-400/90" aria-hidden />
        <span className="text-[10px] tracking-widest text-gray-400 uppercase">Kredi Kartı</span>
      </div>
      <p className="font-mono text-lg tracking-[0.2em] break-all">{displayNumber}</p>
      <div className="flex justify-between items-end">
        <div>
          <p className="text-[10px] text-gray-400 uppercase mb-0.5">Kart sahibi</p>
          <p className="font-medium text-sm tracking-wide truncate max-w-[160px]">{displayHolder}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-gray-400 uppercase mb-0.5">Son kullanma</p>
          <p className="font-mono text-sm">{mm}/{yy}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-gray-400 uppercase mb-0.5">CVV</p>
          <p className="font-mono text-sm">{displayCvv}</p>
        </div>
      </div>
    </div>
  );
}

function CheckoutForm() {
  const navigate = useNavigate();
  const { items, subtotal, tax, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [orderId, setOrderId] = useState(null);

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
    <>
      <OrderSuccessCelebration
        visible={showCelebration}
        onComplete={() => {
          setShowCelebration(false);
          if (orderId) navigate(`/siparislerim/${orderId}`);
        }}
      />
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={[{ label: 'Ana Sayfa', href: '/' }, { label: 'Sepet', href: '/sepet' }, { label: 'Ödeme' }]} />
        <div className="mb-6 p-4 rounded-xl bg-amber-500/15 border-2 border-amber-500/50 text-amber-800 dark:text-amber-200">
          <p className="font-bold flex items-center gap-2">
            <FiAlertTriangle className="w-5 h-5 flex-shrink-0" aria-hidden />
            Gerçek ödemedir — sistem para çeker.
          </p>
          <p className="text-sm mt-1 opacity-90">Bu sayfa gerçek ödeme altyapısına bağlıdır. Test amaçlı kullanın.</p>
        </div>
        <div className="mb-4 flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 text-green-700 dark:text-green-300 border border-green-500/20">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            Güvenli ödeme · SSL ile korunmaktadır
          </span>
        </div>
        <h1 className="text-2xl font-bold mb-6">Ödeme (Simülasyon)</h1>
      <Formik
        initialValues={{
          fullName: '',
          phone: '',
          city: '',
          district: '',
          fullAddress: '',
          zipCode: '',
          cardNumber: '',
          cardHolder: '',
          expiryMonth: '',
          expiryYear: '',
          cvv: '',
        }}
        validationSchema={step === 1 ? shippingSchema : fullSchema}
        onSubmit={async (values) => {
          if (step === 1) return;
          try {
            const order = await createOrder({
              items: items.map((i) => ({ product: i.product._id, quantity: i.quantity })),
              shippingAddress: values,
              couponCode: couponDiscount > 0 ? couponCode : undefined,
            });
            clearCart();
            setOrderId(order.data.order._id);
            setShowCelebration(true);
          } catch (err) {
            toast.error(err.message || 'Sipariş oluşturulamadı');
          }
        }}
      >
        {({ values, errors, touched, validateForm, setTouched }) => (
          <Form className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {step === 1 ? (
              <>
                <div className="space-y-4">
                  <h2 className="font-bold">Teslimat Bilgileri</h2>
                  <div>
                    <label className="block text-sm font-medium mb-1">Ad Soyad</label>
                    <Field name="fullName" className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2" />
                    {errors.fullName && touched.fullName && <p className="text-theme text-sm">{errors.fullName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Telefon</label>
                    <Field name="phone" type="tel" className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2" />
                    {errors.phone && touched.phone && <p className="text-theme text-sm">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Şehir</label>
                    <Field name="city" className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2" />
                    {errors.city && touched.city && <p className="text-theme text-sm">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">İlçe</label>
                    <Field name="district" className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2" />
                    {errors.district && touched.district && <p className="text-theme text-sm">{errors.district}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Adres</label>
                    <Field as="textarea" name="fullAddress" rows={3} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2" />
                    {errors.fullAddress && touched.fullAddress && <p className="text-theme text-sm">{errors.fullAddress}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Posta kodu</label>
                    <Field name="zipCode" className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2" />
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      setTouched({ fullName: true, phone: true, city: true, district: true, fullAddress: true });
                      const errs = await validateForm();
                      if (Object.keys(errs).length === 0) setStep(2);
                    }}
                    className="mt-4 w-full md:w-auto px-8 py-3 btn-theme font-bold rounded-2xl"
                  >
                    Tamam — Kart bilgilerine geç
                  </button>
                </div>
                <div className="lg:sticky lg:top-24">
                  <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                    <h2 className="font-bold mb-4">Sipariş özeti</h2>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      {items.map((i) => (
                        <li key={i.product?._id}>{i.product?.name} x {i.quantity}</li>
                      ))}
                    </ul>
                    <div className="mt-4 flex gap-2">
                      <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="Kupon kodu" className="flex-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2" />
                      <button type="button" onClick={handleValidateCoupon} disabled={validatingCoupon} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded">Uygula</button>
                    </div>
                    <div className="mt-4 space-y-1">
                      <div className="flex justify-between"><span>Ara toplam</span><span>{subtotal?.toLocaleString('tr-TR')} ₺</span></div>
                      <div className="flex justify-between"><span>KDV</span><span>{tax?.toLocaleString('tr-TR')} ₺</span></div>
                      {couponDiscount > 0 && <div className="flex justify-between text-green-600"><span>İndirim</span><span>-{couponDiscount?.toLocaleString('tr-TR')} ₺</span></div>}
                      <div className="flex justify-between font-bold text-lg pt-2 border-t"><span>Toplam</span><span>{total?.toLocaleString('tr-TR')} ₺</span></div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-800 dark:text-green-200 text-sm">
                    <p className="font-semibold mb-1">Teslimat bilgileri kaydedildi</p>
                    <p>{values.fullName}, {values.phone} — {values.district}, {values.city}</p>
                  </div>
                  <h2 className="font-bold">Kart bilgileri</h2>
                  <div>
                    <label className="block text-sm font-medium mb-1">Kart numarası</label>
                    <Field name="cardNumber">
                      {({ field, form }) => (
                        <input
                          {...field}
                          type="text"
                          inputMode="numeric"
                          maxLength={19}
                          placeholder="0000 0000 0000 0000"
                          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 font-mono"
                          onChange={(e) => {
                            const v = e.target.value.replace(/\D/g, '').slice(0, 16);
                            form.setFieldValue('cardNumber', v.replace(/(.{4})/g, '$1 ').trim());
                          }}
                        />
                      )}
                    </Field>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Kart sahibinin adı</label>
                    <Field name="cardHolder" placeholder="AD SOYAD" className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 uppercase" />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-sm font-medium mb-1">Ay</label>
                      <Field name="expiryMonth" as="select" className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2">
                        <option value="">MM</option>
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i} value={String(i + 1).padStart(2, '0')}>{String(i + 1).padStart(2, '0')}</option>
                        ))}
                      </Field>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Yıl</label>
                      <Field name="expiryYear" as="select" className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2">
                        <option value="">YY</option>
                        {Array.from({ length: 12 }, (_, i) => {
                          const y = new Date().getFullYear() + i;
                          return <option key={y} value={String(y)}>{y}</option>;
                        })}
                      </Field>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">CVV</label>
                      <Field name="cvv">
                        {({ field }) => (
                          <input
                            {...field}
                            type="text"
                            inputMode="numeric"
                            maxLength={4}
                            placeholder="•••"
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 font-mono"
                            onChange={(e) => field.onChange({ target: { name: field.name, value: e.target.value.replace(/\D/g, '').slice(0, 4) } })}
                          />
                        )}
                      </Field>
                    </div>
                  </div>
                  <button type="button" onClick={() => setStep(1)} className="text-sm text-gray-500 dark:text-gray-400 hover:text-theme inline-flex items-center gap-1.5">
                    <FiArrowLeft className="w-4 h-4" aria-hidden />
                    Teslimat bilgilerini düzenle
                  </button>
                </div>
                <div className="space-y-6 lg:sticky lg:top-24">
                  <div className="flex flex-col items-center lg:items-end">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Kart önizlemesi</p>
                    <CardPreview
                      cardNumber={values.cardNumber}
                      cardHolder={values.cardHolder}
                      expiryMonth={values.expiryMonth}
                      expiryYear={values.expiryYear}
                      cvv={values.cvv}
                    />
                  </div>
                  <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                    <h2 className="font-bold mb-4">Sipariş özeti</h2>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      {items.map((i) => (
                        <li key={i.product?._id}>{i.product?.name} x {i.quantity}</li>
                      ))}
                    </ul>
                    <div className="mt-4 flex gap-2">
                      <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="Kupon kodu" className="flex-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2" />
                      <button type="button" onClick={handleValidateCoupon} disabled={validatingCoupon} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded">Uygula</button>
                    </div>
                    <div className="mt-4 space-y-1">
                      <div className="flex justify-between"><span>Ara toplam</span><span>{subtotal?.toLocaleString('tr-TR')} ₺</span></div>
                      <div className="flex justify-between"><span>KDV</span><span>{tax?.toLocaleString('tr-TR')} ₺</span></div>
                      {couponDiscount > 0 && <div className="flex justify-between text-green-600"><span>İndirim</span><span>-{couponDiscount?.toLocaleString('tr-TR')} ₺</span></div>}
                      <div className="flex justify-between font-bold text-lg pt-2 border-t"><span>Toplam</span><span>{total?.toLocaleString('tr-TR')} ₺</span></div>
                    </div>
                    <button type="submit" className="mt-6 w-full py-3 btn-theme font-bold rounded-2xl">Siparişi Tamamla</button>
                  </div>
                </div>
              </>
            )}
          </Form>
        )}
      </Formik>
      </div>
    </>
  );
}

export default function CheckoutPage() {
  return (
    <ProtectedRoute>
      <CheckoutForm />
    </ProtectedRoute>
  );
}
