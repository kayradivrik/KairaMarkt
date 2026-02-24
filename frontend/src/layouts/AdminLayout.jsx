import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { FiGrid, FiImage, FiPackage, FiUsers, FiShoppingBag, FiMessageSquare, FiTag, FiFileText, FiSettings, FiExternalLink, FiMenu, FiX } from 'react-icons/fi';
import { useSettings } from '../context/SettingsContext';
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
  { to: '/admin/ayarlar', icon: FiSettings, label: 'Site ayarları' },
];

const getPageTitle = (path) => {
  const found = links.find((l) => l.to === path);
  return found ? found.label : 'Admin';
};

function AdminSidebar({ onClose, isOpen }) {
  const location = useLocation();
  const { primaryColor, siteName } = useSettings();
  const accent = primaryColor || '#b91c1c';
  const linkClass = (isActive) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive ? 'text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
    }`;

  return (
    <aside
      className={`
        flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-soft
        w-60 min-h-screen shrink-0
        fixed md:relative inset-y-0 left-0 z-40
        transition-transform duration-200 ease-out
        -translate-x-full md:translate-x-0
        ${isOpen ? '!translate-x-0' : ''}
      `}
    >
      <div className="flex items-center justify-between p-4 md:p-5 border-b border-gray-200 dark:border-gray-800 shrink-0">
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-lg text-gray-900 dark:text-white hover:opacity-90 transition-opacity"
          style={{ color: accent }}
          onClick={onClose}
        >
          {siteName || 'KairaMarkt'}
          <FiExternalLink className="w-4 h-4 opacity-70" />
        </Link>
        <button
          type="button"
          onClick={onClose}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 shrink-0"
          aria-label="Menüyü kapat"
        >
          <FiX className="w-6 h-6" />
        </button>
      </div>
      <span className="block text-xs text-gray-500 dark:text-gray-400 px-5 pb-2 md:pb-0">Admin Paneli</span>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {links.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={linkClass(isActive)}
              style={isActive ? { backgroundColor: accent } : {}}
              onClick={onClose}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  return (
    <ProtectedRoute adminOnly>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Mobil: overlay */}
        <div
          role="presentation"
          className={`fixed inset-0 bg-black/50 z-30 transition-opacity md:hidden ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
        {/* Sidebar: mobilde drawer, masaüstünde normal */}
        <AdminSidebar onClose={() => setSidebarOpen(false)} isOpen={sidebarOpen} />
        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobil: üst bar menü butonu + başlık */}
          <header className="md:hidden sticky top-0 z-20 flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-soft">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 cursor-pointer touch-manipulation"
              aria-label="Menüyü aç"
            >
              <FiMenu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white truncate">{pageTitle}</h1>
          </header>
          <main className="flex-1 min-h-screen p-4 sm:p-6 md:p-8 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
