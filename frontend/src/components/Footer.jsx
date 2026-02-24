import { Link } from 'react-router-dom';
import { FiShield, FiTruck, FiCreditCard, FiRefreshCw } from 'react-icons/fi';
import { useSettings } from '../context/SettingsContext';

export default function Footer() {
  const { siteName, footerText, primaryColor } = useSettings();
  const accent = primaryColor || '#b91c1c';
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300 mt-auto border-t-4 dark:border-opacity-80" style={{ borderTopColor: accent }}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap items-center justify-center gap-6 py-4 border-b border-gray-700 text-sm">
          <span className="flex items-center gap-2 text-gray-300">
            <FiShield className="w-5 h-5 text-green-400" aria-hidden />
            Güvenli ödeme (SSL)
          </span>
          <span className="flex items-center gap-2 text-gray-300">
            <FiTruck className="w-5 h-5" style={{ color: accent }} aria-hidden />
            Hızlı kargo
          </span>
          <span className="flex items-center gap-2 text-gray-300">
            <FiRefreshCw className="w-5 h-5" aria-hidden />
            Kolay iade
          </span>
          <span className="flex items-center gap-2 text-gray-300">
            <FiCreditCard className="w-5 h-5" aria-hidden />
            Taksit imkânı
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-10">
          <div>
            <h3 className="font-extrabold text-lg mb-3" style={{ color: accent }}>{siteName || 'KairaMarkt'}</h3>
            <p className="text-sm leading-relaxed">
              {footerText || 'Teknoloji ve elektronik ürünlerde uygun fiyat, hızlı teslimat. Bizimle alışveriş keyifli olsun.'}
            </p>
            <p className="text-sm mt-3 text-gray-400">destek@kairamarkt.com</p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4">Kurumsal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/hakkimizda" className="hover:text-theme transition-colors">Hakkımızda</Link></li>
              <li><Link to="/iletisim" className="hover:text-theme transition-colors">İletişim</Link></li>
              <li><Link to="/kampanyalar" className="hover:text-theme transition-colors">Kampanyalar</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4">Yardım</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/sss" className="hover:text-theme transition-colors">SSS</Link></li>
              <li><Link to="/iade" className="hover:text-theme transition-colors">İade</Link></li>
              <li><Link to="/teslimat" className="hover:text-theme transition-colors">Teslimat</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4">Yasal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/gizlilik" className="hover:text-theme transition-colors">Gizlilik Politikası</Link></li>
              <li><Link to="/kvkk" className="hover:text-theme transition-colors">KVKK</Link></li>
              <li><Link to="/kullanim-kosullari" className="hover:text-theme transition-colors">Kullanım Koşulları</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <p>© {new Date().getFullYear()} <span className="font-semibold" style={{ color: accent }}>{siteName || 'KairaMarkt'}</span> · Tüm hakları saklıdır.</p>
          <p>Güvenli alışveriş</p>
        </div>
      </div>
    </footer>
  );
}
