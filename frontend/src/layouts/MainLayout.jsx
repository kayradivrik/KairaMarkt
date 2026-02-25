import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import RouteChangeProgressBar from '../components/RouteChangeProgressBar';
import CookieConsent from '../components/CookieConsent';
import AnnouncementBar from '../components/AnnouncementBar';
import MaintenancePage from '../pages/MaintenancePage';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';

const TITLES = {
  '/': 'Ana Sayfa',
  '/urunler': 'Ürünler',
  '/sepet': 'Sepet',
  '/odeme': 'Ödeme',
  '/profil': 'Profilim',
  '/siparislerim': 'Siparişlerim',
  '/giris': 'Giriş Yap',
  '/kayit': 'Kayıt Ol',
  '/hakkimizda': 'Hakkımızda',
  '/iletisim': 'İletişim',
  '/teslimat': 'Teslimat',
  '/sss': 'Sıkça Sorulan Sorular',
  '/kampanyalar': 'Kampanyalar',
  '/iade': 'İade ve İade Koşulları',
  '/forum': 'Forum',
  '/gizlilik': 'Gizlilik Politikası',
  '/kvkk': 'KVKK Aydınlatma Metni',
  '/kullanim-kosullari': 'Kullanım Koşulları',
};

export default function MainLayout() {
  const location = useLocation();
  const { siteName, maintenanceMode } = useSettings();
  const { isAdmin } = useAuth() || {};

  const showMaintenance = maintenanceMode && !isAdmin;

  useEffect(() => {
    const base = siteName || 'KairaMarkt';
    const path = location.pathname;
    let title = TITLES[path];
    if (!title && path.startsWith('/urun/')) title = 'Ürün';
    if (!title && path.startsWith('/siparislerim/')) title = 'Sipariş Detayı';
    if (!title && path.startsWith('/forum/konu/')) title = 'Forum';
    document.title = title ? `${title} · ${base}` : base;
  }, [location.pathname, siteName]);

  if (showMaintenance) {
    return (
      <>
        <RouteChangeProgressBar />
        <MaintenancePage />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <RouteChangeProgressBar />
      <a href="#main-content" className="skip-link">
        İçeriğe atla
      </a>
      <AnnouncementBar />
      <Navbar />
      <main id="main-content" className="flex-1" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      <ScrollToTop />
      <CookieConsent />
    </div>
  );
}
