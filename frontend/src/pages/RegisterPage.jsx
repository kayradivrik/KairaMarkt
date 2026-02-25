import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { register } from '../services/authService';
import { useAuth } from '../context/AuthContext';

const schema = Yup.object({
  name: Yup.string().min(2, 'En az 2 karakter').required('Ad gerekli'),
  email: Yup.string().email('Geçerli e-posta girin').required('E-posta gerekli'),
  password: Yup.string().min(6, 'En az 6 karakter').required('Şifre gerekli'),
  passwordConfirm: Yup.string().oneOf([Yup.ref('password')], 'Şifreler eşleşmiyor').required('Tekrar girin'),
});

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Kayıt Ol</h1>
        <Formik
          initialValues={{ name: '', email: '', password: '', passwordConfirm: '' }}
          validationSchema={schema}
          onSubmit={async (values) => {
            setLoading(true);
            try {
              const { data } = await register({ name: values.name, email: values.email, password: values.password });
              setUser(data.user);
              toast.success('Hesap oluşturuldu');
              navigate('/');
            } catch (err) {
              toast.error(err.message || 'Kayıt yapılamadı');
            } finally {
              setLoading(false);
            }
          }}
        >
          {({ errors, touched }) => (
            <Form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Ad Soyad</label>
                <Field name="name" type="text" className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 focus:ring-2 focus:ring-2 focus:ring-theme focus:border-transparent" placeholder="Adınız" />
                {errors.name && touched.name && <p className="text-theme text-sm mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">E-posta</label>
                <Field name="email" type="email" className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 focus:ring-2 focus:ring-2 focus:ring-theme focus:border-transparent" placeholder="ornek@email.com" />
                {errors.email && touched.email && <p className="text-theme text-sm mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Şifre</label>
                <Field name="password" type="password" className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 focus:ring-2 focus:ring-2 focus:ring-theme focus:border-transparent" />
                {errors.password && touched.password && <p className="text-theme text-sm mt-1">{errors.password}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Şifre Tekrar</label>
                <Field name="passwordConfirm" type="password" className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 focus:ring-2 focus:ring-2 focus:ring-theme focus:border-transparent" />
                {errors.passwordConfirm && touched.passwordConfirm && <p className="text-theme text-sm mt-1">{errors.passwordConfirm}</p>}
              </div>
              <button type="submit" disabled={loading} className="w-full py-3 btn-theme font-bold rounded-2xl disabled:opacity-50">
                {loading ? 'Kaydediliyor...' : 'Kayıt Ol'}
              </button>
            </Form>
          )}
        </Formik>
        <p className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
          Zaten hesabınız var mı? <Link to="/giris" className="text-theme font-semibold">Giriş yapın</Link>
        </p>
      </div>
    </div>
  );
}
