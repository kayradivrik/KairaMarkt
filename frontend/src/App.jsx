/**
 * KairaMarkt - Ana uygulama giriş noktası
 * Kayra tarafından yapılmıştır
 */
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// v7 uyumluluk için future flags
const routerFuture = { v7_startTransition: true, v7_relativeSplatPath: true };
import { Toaster } from 'react-hot-toast';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ProfilePage from './pages/ProfilePage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import OrderDetailPage from './pages/OrderDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import TeslimatPage from './pages/TeslimatPage';
import FaqPage from './pages/FaqPage';
import CampaignsPage from './pages/CampaignsPage';
import ReturnPage from './pages/ReturnPage';
import ForumPage from './pages/ForumPage';
import NotFoundPage from './pages/NotFoundPage';
import Error500Page from './pages/Error500Page';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminProductForm from './pages/admin/AdminProductForm';
import AdminUsers from './pages/admin/AdminUsers';
import AdminOrders from './pages/admin/AdminOrders';
import AdminReviews from './pages/admin/AdminReviews';
import AdminCampaigns from './pages/admin/AdminCampaigns';
import AdminLogs from './pages/admin/AdminLogs';
import AdminSliders from './pages/admin/AdminSliders';
import AdminSettings from './pages/admin/AdminSettings';

export default function App() {
  return (
    <BrowserRouter future={routerFuture}>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
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
          <Route path="siparislerim" element={<OrderHistoryPage />} />
          <Route path="siparislerim/:id" element={<OrderDetailPage />} />
          <Route path="hakkimizda" element={<AboutPage />} />
          <Route path="iletisim" element={<ContactPage />} />
          <Route path="teslimat" element={<TeslimatPage />} />
          <Route path="sss" element={<FaqPage />} />
          <Route path="kampanyalar" element={<CampaignsPage />} />
          <Route path="iade" element={<ReturnPage />} />
          <Route path="forum" element={<ForumPage />} />
          <Route path="forum/konu/:slug" element={<ForumPage />} />
          <Route path="500" element={<Error500Page />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="slider" element={<AdminSliders />} />
          <Route path="urunler" element={<AdminProducts />} />
          <Route path="urunler/yeni" element={<AdminProductForm />} />
          <Route path="urunler/:id" element={<AdminProductForm />} />
          <Route path="kullanicilar" element={<AdminUsers />} />
          <Route path="siparisler" element={<AdminOrders />} />
          <Route path="yorumlar" element={<AdminReviews />} />
          <Route path="kampanyalar" element={<AdminCampaigns />} />
          <Route path="loglar" element={<AdminLogs />} />
          <Route path="ayarlar" element={<AdminSettings />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
