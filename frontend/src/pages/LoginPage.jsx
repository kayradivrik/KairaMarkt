import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { login } from '../services/authService';
import { useAuth } from '../context/AuthContext';

const schema = Yup.object({
  email: Yup.string().email('Geçerli e-posta girin').required('E-posta gerekli'),
  password: Yup.string().required('Şifre gerekli'),
});

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();
  const from = location.state?.from?.pathname || '/';

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Giriş Yap</h1>
        <Formik
          initialValues={{ email: '', password: '', remember: false }}
          validationSchema={schema}
          onSubmit={async (values) => {
            setLoading(true);
            try {
              const { data } = await login(values);
              setUser(data.user);
              toast.success('Giriş başarılı');
              navigate(from, { replace: true });
            } catch (err) {
              toast.error(err.message || 'Giriş yapılamadı');
            } finally {
              setLoading(false);
            }
          }}
        >
          {({ errors, touched }) => (
            <Form className="space-y-4">
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
              <label className="flex items-center gap-2">
                <Field name="remember" type="checkbox" className="rounded" />
                <span className="text-sm">Beni hatırla</span>
              </label>
              <button type="submit" disabled={loading} className="w-full py-3 btn-theme font-bold rounded-2xl disabled:opacity-50">
                {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
              </button>
            </Form>
          )}
        </Formik>
        <p className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
          Hesabınız yok mu? <Link to="/kayit" className="text-theme font-semibold">Kayıt olun</Link>
        </p>
      </div>
    </div>
  );
}
