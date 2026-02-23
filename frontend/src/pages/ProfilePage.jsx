import { useState } from 'react';
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

function ProfileContent() {
  const { user, setUser } = useAuth();
  const [pwSuccess, setPwSuccess] = useState(false);

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Profil</h1>
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
