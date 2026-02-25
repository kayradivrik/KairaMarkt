import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiPhone, FiLock, FiMapPin, FiShoppingBag, FiCamera } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { updateProfile, changePassword } from '../services/userService';
import ProtectedRoute from '../components/ProtectedRoute';

const profileSchema = Yup.object({
  name: Yup.string().min(2, 'En az 2 karakter').required('Ad soyad gerekli'),
  phone: Yup.string(),
  address: Yup.object({
    city: Yup.string(),
    district: Yup.string(),
    fullAddress: Yup.string(),
    zipCode: Yup.string(),
  }),
});

const passwordSchema = Yup.object({
  currentPassword: Yup.string().required('Mevcut şifre gerekli'),
  newPassword: Yup.string().min(6, 'En az 6 karakter').required('Yeni şifre gerekli'),
  newPasswordConfirm: Yup.string().oneOf([Yup.ref('newPassword')], 'Şifreler eşleşmiyor').required(),
});

const AVATAR_SIZE = 256;
const MAX_AVATAR_BYTES = 150000;

function resizeImageToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      const scale = Math.min(AVATAR_SIZE / img.width, AVATAR_SIZE / img.height, 1);
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      let dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      if (dataUrl.length > MAX_AVATAR_BYTES) dataUrl = canvas.toDataURL('image/jpeg', 0.6);
      resolve(dataUrl);
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Resim yüklenemedi')); };
    img.src = url;
  });
}

function ProfileContent() {
  const { user, setUser } = useAuth();
  const [pwSuccess, setPwSuccess] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('info');
  const fileInputRef = useRef(null);

  if (!user) return null;

  const handleAvatarChange = async (e) => {
    const file = e.target?.files?.[0];
    if (!file || !file.type.startsWith('image/')) {
      toast.error('Lütfen bir resim dosyası seçin');
      return;
    }
    setAvatarLoading(true);
    try {
      const dataUrl = await resizeImageToDataUrl(file);
      const { data } = await updateProfile({ avatar: dataUrl });
      setUser(data.user);
      toast.success('Profil fotoğrafı güncellendi');
    } catch (err) {
      toast.error(err.message || 'Yüklenemedi');
    } finally {
      setAvatarLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const initialAddress = user.address || {};
  const initialValues = {
    name: user.name || '',
    phone: user.phone || '',
    address: {
      city: initialAddress.city || '',
      district: initialAddress.district || '',
      fullAddress: initialAddress.fullAddress || '',
      zipCode: initialAddress.zipCode || '',
    },
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="rounded-2xl sm:rounded-3xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-800/80 overflow-hidden shadow-soft mb-8">
        <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative group flex-shrink-0">
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={avatarLoading}
              className="relative block rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-600 bg-gray-200 dark:bg-gray-700 w-28 h-28 sm:w-32 sm:h-32 focus:outline-none focus:ring-2 focus:ring-theme focus:ring-offset-2 disabled:opacity-70"
            >
              {user.avatar ? (
                <img src={user.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="w-full h-full flex items-center justify-center text-gray-400">
                  <FiUser className="w-14 h-14 sm:w-16 sm:h-16" aria-hidden />
                </span>
              )}
              {avatarLoading ? (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-white text-xs font-medium">Yükleniyor...</span>
                </div>
              ) : (
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 flex items-center justify-center transition-colors">
                  <span className="opacity-0 group-hover:opacity-100 text-white text-xs font-medium flex items-center gap-1 transition-opacity">
                    <FiCamera className="w-4 h-4" /> Değiştir
                  </span>
                </div>
              )}
            </button>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{user.name || 'Üye'}</h1>
            <p className="mt-1 text-gray-500 dark:text-gray-400 flex items-center justify-center sm:justify-start gap-2">
              <FiMail className="w-4 h-4 flex-shrink-0" aria-hidden />
              {user.email}
            </p>
            {user.role === 'admin' && (
              <span className="inline-block mt-2 px-2.5 py-0.5 rounded-lg bg-theme/15 text-theme text-xs font-semibold">
                Admin
              </span>
            )}
            <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-3">
              <Link
                to="/siparislerim"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <FiShoppingBag className="w-4 h-4" aria-hidden />
                Siparişlerim
              </Link>
              <Link
                to="/urunler"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl btn-theme text-sm font-medium"
              >
                Alışverişe devam
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6 gap-1 overflow-x-auto">
        {[
          { id: 'info', label: 'Kişisel bilgiler', icon: FiUser },
          { id: 'address', label: 'Adres', icon: FiMapPin },
          { id: 'password', label: 'Şifre', icon: FiLock },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveSection(id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-t-xl whitespace-nowrap transition-colors ${
              activeSection === id
                ? 'bg-white dark:bg-gray-800 text-theme border border-b-0 border-gray-200 dark:border-gray-700 -mb-px'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Icon className="w-4 h-4" aria-hidden />
            {label}
          </button>
        ))}
      </div>

      {/* Kişisel bilgiler */}
      {activeSection === 'info' && (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-soft">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FiUser className="w-5 h-5 text-theme" aria-hidden />
            Kişisel bilgiler
          </h2>
          <Formik
            initialValues={initialValues}
            validationSchema={profileSchema}
            onSubmit={async (values) => {
              try {
                const { data } = await updateProfile({
                  name: values.name,
                  phone: values.phone,
                  address: values.address,
                });
                setUser(data.user);
                toast.success('Profil güncellendi');
              } catch (err) {
                toast.error(err.message || 'Güncellenemedi');
              }
            }}
          >
            {({ errors, touched }) => (
              <Form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">E-posta</label>
                  <div className="flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 px-3 py-2.5">
                    <FiMail className="w-4 h-4 text-gray-400 flex-shrink-0" aria-hidden />
                    <input type="email" value={user.email} disabled className="flex-1 bg-transparent text-gray-600 dark:text-gray-400 text-sm" />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">E-posta adresi değiştirilemez.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ad Soyad</label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" aria-hidden />
                    <Field name="name" className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 pl-10 pr-3 py-2.5 focus:ring-2 focus:ring-theme focus:border-transparent" placeholder="Adınız soyadınız" />
                  </div>
                  {errors.name && touched.name && <p className="text-theme text-sm mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Telefon</label>
                  <div className="relative">
                    <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" aria-hidden />
                    <Field name="phone" className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 pl-10 pr-3 py-2.5 focus:ring-2 focus:ring-theme focus:border-transparent" placeholder="05XX XXX XX XX" />
                  </div>
                </div>
                <button type="submit" className="w-full sm:w-auto px-6 py-2.5 btn-theme rounded-xl font-semibold">
                  Değişiklikleri kaydet
                </button>
              </Form>
            )}
          </Formik>
        </div>
      )}

      {activeSection === 'address' && (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-soft">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FiMapPin className="w-5 h-5 text-theme" aria-hidden />
            Teslimat adresi
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Siparişlerinizde kullanılacak varsayılan adres.</p>
          <Formik
            initialValues={initialValues}
            validationSchema={profileSchema}
            onSubmit={async (values) => {
              try {
                const { data } = await updateProfile({ address: values.address });
                setUser(data.user);
                toast.success('Adres kaydedildi');
              } catch (err) {
                toast.error(err.message || 'Kaydedilemedi');
              }
            }}
          >
            {({ errors, touched }) => (
              <Form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Şehir</label>
                    <Field name="address.city" className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2.5 focus:ring-2 focus:ring-theme focus:border-transparent" placeholder="İstanbul" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">İlçe</label>
                    <Field name="address.district" className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2.5 focus:ring-2 focus:ring-theme focus:border-transparent" placeholder="Kadıköy" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Açık adres</label>
                  <Field as="textarea" name="address.fullAddress" rows={3} className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2.5 focus:ring-2 focus:ring-theme focus:border-transparent resize-none" placeholder="Mahalle, sokak, bina no, daire no..." />
                </div>
                <div className="max-w-xs">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Posta kodu</label>
                  <Field name="address.zipCode" className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2.5 focus:ring-2 focus:ring-theme focus:border-transparent" placeholder="34000" />
                </div>
                <button type="submit" className="w-full sm:w-auto px-6 py-2.5 btn-theme rounded-xl font-semibold">
                  Adresi kaydet
                </button>
              </Form>
            )}
          </Formik>
        </div>
      )}

      {activeSection === 'password' && (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-soft">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FiLock className="w-5 h-5 text-theme" aria-hidden />
            Şifre değiştir
          </h2>
          {pwSuccess ? (
            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-300 text-sm">
              Şifreniz güncellendi. Bir sonraki girişte yeni şifrenizi kullanın.
            </div>
          ) : (
            <Formik
              initialValues={{ currentPassword: '', newPassword: '', newPasswordConfirm: '' }}
              validationSchema={passwordSchema}
              onSubmit={async (values) => {
                try {
                  await changePassword({ currentPassword: values.currentPassword, newPassword: values.newPassword });
                  setPwSuccess(true);
                  toast.success('Şifre güncellendi');
                } catch (err) {
                  toast.error(err.message || 'Şifre değiştirilemedi');
                }
              }}
            >
              {({ errors, touched }) => (
                <Form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mevcut şifre</label>
                    <Field name="currentPassword" type="password" className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2.5 focus:ring-2 focus:ring-theme focus:border-transparent" placeholder="••••••••" />
                    {errors.currentPassword && touched.currentPassword && <p className="text-theme text-sm mt-1">{errors.currentPassword}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Yeni şifre</label>
                    <Field name="newPassword" type="password" className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2.5 focus:ring-2 focus:ring-theme focus:border-transparent" placeholder="En az 6 karakter" />
                    {errors.newPassword && touched.newPassword && <p className="text-theme text-sm mt-1">{errors.newPassword}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Yeni şifre tekrar</label>
                    <Field name="newPasswordConfirm" type="password" className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2.5 focus:ring-2 focus:ring-theme focus:border-transparent" placeholder="••••••••" />
                    {errors.newPasswordConfirm && touched.newPasswordConfirm && <p className="text-theme text-sm mt-1">{errors.newPasswordConfirm}</p>}
                  </div>
                  <button type="submit" className="w-full sm:w-auto px-6 py-2.5 btn-theme rounded-xl font-semibold">
                    Şifreyi güncelle
                  </button>
                </Form>
              )}
            </Formik>
          )}
        </div>
      )}
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
