import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

export default function Footer() {
  const { siteName, footerText, primaryColor } = useSettings();
  const accent = primaryColor || '#b91c1c';
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300 mt-auto border-t-4 dark:border-opacity-80" style={{ borderTopColor: accent }}>
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-extrabold text-lg mb-3" style={{ color: accent }}>{siteName || 'KairaMarkt'}</h3>
            <p className="text-sm leading-relaxed">
              {footerText || 'Teknoloji ve elektronik ürünlerde uygun fiyat, hızlı teslimat. Bizimle alışveriş keyifli olsun :)'}
            </p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4">Kurumsal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/hakkimizda" className="hover:text-theme transition-colors">Hakkımızda</Link></li>
              <li><Link to="/iletisim" className="hover:text-theme transition-colors">İletişim</Link></li>
              <li><a href="#" className="hover:text-theme transition-colors">Kariyer</a></li>
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
            <h4 className="text-white font-medium mb-4">İletişim</h4>
            <p className="text-sm">destek@kairamarkt.com</p>
            <p className="text-sm mt-1">0850 XXX XX XX</p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} <span className="font-semibold" style={{ color: accent }}>{siteName || 'KairaMarkt'}</span> · Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  );
}
