import { useState, useRef } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { updateProfile, changePassword } from '../services/userService';
import ProtectedRoute from '../components/ProtectedRoute';

const profileSchema = Yup.object({
  name: Yup.string().min(2).required(),
  phone: Yup.string(),
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Profil</h1>

      <div className="mb-8 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
        <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">Profil fotoğrafı</h2>
        <div className="flex items-center gap-4">
          <div className="relative flex-shrink-0">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              {user.avatar ? (
                <img src={user.avatar} alt="Profil" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl text-gray-400">?</span>
              )}
            </div>
            {avatarLoading && (
              <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                <span className="text-white text-xs">Yükleniyor...</span>
              </div>
            )}
          </div>
          <div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            <button type="button" onClick={() => fileInputRef.current?.click()} disabled={avatarLoading} className="px-4 py-2 btn-theme rounded-xl text-sm font-semibold disabled:opacity-50">
              Fotoğraf seç / değiştir
            </button>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">JPG, PNG. Navbarda yuvarlak içinde görünür.</p>
          </div>
        </div>
      </div>

      <Formik
        initialValues={{ name: user.name || '', phone: user.phone || '', address: user.address || {} }}
        validationSchema={profileSchema}
        onSubmit={async (values) => {
          try {
            const { data } = await updateProfile(values);
            setUser(data.user);
            toast.success('Profil güncellendi');
          } catch (err) {
            toast.error(err.message || 'Güncellenemedi');
          }
        }}
      >
        {({ errors, touched }) => (
          <Form className="space-y-4 mb-12">
            <div>
              <label className="block text-sm font-medium mb-1">E-posta</label>
              <input type="email" value={user.email} disabled className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Ad Soyad</label>
              <Field name="name" className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2" />
              {errors.name && touched.name && <p className="text-brand-600 text-sm">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Telefon</label>
              <Field name="phone" className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2" />
            </div>
            <button type="submit" className="px-6 py-2 bg-brand-500 text-white rounded-2xl hover:bg-brand-600 font-semibold">Kaydet</button>
          </Form>
        )}
      </Formik>

      <h2 className="text-xl font-bold mb-4">Şifre Değiştir</h2>
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
              <label className="block text-sm font-medium mb-1">Mevcut şifre</label>
              <Field name="currentPassword" type="password" className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2" />
              {errors.currentPassword && touched.currentPassword && <p className="text-brand-600 text-sm">{errors.currentPassword}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Yeni şifre</label>
              <Field name="newPassword" type="password" className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2" />
              {errors.newPassword && touched.newPassword && <p className="text-brand-600 text-sm">{errors.newPassword}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Yeni şifre tekrar</label>
              <Field name="newPasswordConfirm" type="password" className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2" />
              {errors.newPasswordConfirm && touched.newPasswordConfirm && <p className="text-brand-600 text-sm">{errors.newPasswordConfirm}</p>}
            </div>
            <button type="submit" className="px-6 py-2 bg-brand-500 text-white rounded-2xl hover:bg-brand-600 font-semibold">Şifreyi Güncelle</button>
          </Form>
        )}
      </Formik>
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
