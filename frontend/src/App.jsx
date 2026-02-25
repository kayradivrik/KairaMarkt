import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import TeslimatPage from './pages/TeslimatPage';
import FaqPage from './pages/FaqPage';
import CampaignsPage from './pages/CampaignsPage';
import ReturnPage from './pages/ReturnPage';
import NotFoundPage from './pages/NotFoundPage';

import AdminLayout from './layouts/AdminLayout';
const OrderHistoryPage = lazy(() => import('./pages/OrderHistoryPage'));
const OrderDetailPage = lazy(() => import('./pages/OrderDetailPage'));
const ForumPage = lazy(() => import('./pages/ForumPage'));
const GizlilikPage = lazy(() => import('./pages/GizlilikPage'));
const KvkkPage = lazy(() => import('./pages/KvkkPage'));
const KullanimKosullariPage = lazy(() => import('./pages/KullanimKosullariPage'));
const Error500Page = lazy(() => import('./pages/Error500Page'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminProductForm = lazy(() => import('./pages/admin/AdminProductForm'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminReviews = lazy(() => import('./pages/admin/AdminReviews'));
const AdminCampaigns = lazy(() => import('./pages/admin/AdminCampaigns'));
const AdminLogs = lazy(() => import('./pages/admin/AdminLogs'));
const AdminSliders = lazy(() => import('./pages/admin/AdminSliders'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));

function PageFallback() {
  return (
    <div className="container mx-auto px-4 py-12 flex justify-center" aria-busy="true">
      <div className="w-10 h-10 border-2 border-theme border-t-transparent rounded-full animate-spin" role="status" aria-label="Yükleniyor" />
    </div>
  );
}

export default function App() {
  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="giris" element={<LoginPage />} />
          <Route path="kayit" element={<RegisterPage />} />
          <Route path="urunler" element={<ProductListPage />} />
          <Route path="urun/:slug" element={<ProductDetailPage />} />
          <Route path="sepet" element={<CartPage />} />
          <Route path="odeme" element={<CheckoutPage />} />
          <Route path="profil" element={<ProfilePage />} />
          <Route path="siparislerim" element={<Suspense fallback={<PageFallback />}><OrderHistoryPage /></Suspense>} />
          <Route path="siparislerim/:id" element={<Suspense fallback={<PageFallback />}><OrderDetailPage /></Suspense>} />
          <Route path="hakkimizda" element={<AboutPage />} />
          <Route path="iletisim" element={<ContactPage />} />
          <Route path="teslimat" element={<TeslimatPage />} />
          <Route path="sss" element={<FaqPage />} />
          <Route path="kampanyalar" element={<CampaignsPage />} />
          <Route path="iade" element={<ReturnPage />} />
          <Route path="gizlilik" element={<Suspense fallback={<PageFallback />}><GizlilikPage /></Suspense>} />
          <Route path="kvkk" element={<Suspense fallback={<PageFallback />}><KvkkPage /></Suspense>} />
          <Route path="kullanim-kosullari" element={<Suspense fallback={<PageFallback />}><KullanimKosullariPage /></Suspense>} />
          <Route path="forum" element={<Suspense fallback={<PageFallback />}><ForumPage /></Suspense>} />
          <Route path="forum/konu/:slug" element={<Suspense fallback={<PageFallback />}><ForumPage /></Suspense>} />
          <Route path="500" element={<Suspense fallback={<PageFallback />}><Error500Page /></Suspense>} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Suspense fallback={<PageFallback />}><AdminDashboard /></Suspense>} />
          <Route path="slider" element={<Suspense fallback={<PageFallback />}><AdminSliders /></Suspense>} />
          <Route path="urunler" element={<Suspense fallback={<PageFallback />}><AdminProducts /></Suspense>} />
          <Route path="urunler/yeni" element={<Suspense fallback={<PageFallback />}><AdminProductForm /></Suspense>} />
          <Route path="urunler/:id" element={<Suspense fallback={<PageFallback />}><AdminProductForm /></Suspense>} />
          <Route path="kullanicilar" element={<Suspense fallback={<PageFallback />}><AdminUsers /></Suspense>} />
          <Route path="siparisler" element={<Suspense fallback={<PageFallback />}><AdminOrders /></Suspense>} />
          <Route path="yorumlar" element={<Suspense fallback={<PageFallback />}><AdminReviews /></Suspense>} />
          <Route path="kampanyalar" element={<Suspense fallback={<PageFallback />}><AdminCampaigns /></Suspense>} />
          <Route path="loglar" element={<Suspense fallback={<PageFallback />}><AdminLogs /></Suspense>} />
          <Route path="ayarlar" element={<Suspense fallback={<PageFallback />}><AdminSettings /></Suspense>} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
