import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { FiGrid, FiImage, FiPackage, FiUsers, FiShoppingBag, FiMessageSquare, FiTag, FiFileText } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';

const links = [
  { to: '/admin', icon: FiGrid, label: 'Dashboard' },
  { to: '/admin/slider', icon: FiImage, label: 'Slider' },
  { to: '/admin/urunler', icon: FiPackage, label: 'Ürünler' },
  { to: '/admin/kullanicilar', icon: FiUsers, label: 'Kullanıcılar' },
  { to: '/admin/siparisler', icon: FiShoppingBag, label: 'Siparişler' },
  { to: '/admin/yorumlar', icon: FiMessageSquare, label: 'Yorumlar' },
  { to: '/admin/kampanyalar', icon: FiTag, label: 'Kampanyalar' },
  { to: '/admin/loglar', icon: FiFileText, label: 'Loglar' },
];

function AdminSidebar() {
  const location = useLocation();
  return (
    <aside className="w-56 bg-gray-800 text-gray-300 min-h-screen py-4">
      <Link to="/" className="px-4 py-2 block text-brand-400 font-extrabold">KairaMarkt Admin</Link>
      <nav className="mt-6 space-y-1">
        {links.map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            to={to}
            className={`flex items-center gap-2 px-4 py-2 mx-2 rounded ${location.pathname === to ? 'bg-gray-700 text-white' : 'hover:bg-gray-700'}`}
          >
            <Icon className="w-5 h-5" /> {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export default function AdminLayout() {
  return (
    <ProtectedRoute adminOnly>
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 bg-gray-100 dark:bg-gray-900 min-h-screen p-6">
          <Outlet />
        </div>
      </div>
    </ProtectedRoute>
  );
}
