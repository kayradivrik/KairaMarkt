import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300 mt-auto border-t-4 border-red-600 dark:border-red-500">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-red-400 dark:text-red-400 font-extrabold text-lg mb-3">KairaMarkt</h3>
            <p className="text-sm leading-relaxed">
              Teknoloji ve elektronik ürünlerde uygun fiyat, hızlı teslimat. Bizimle alışveriş keyifli olsun :)
            </p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4">Kurumsal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/hakkimizda" className="hover:text-red-300 transition-colors">Hakkımızda</Link></li>
              <li><Link to="/iletisim" className="hover:text-red-300 transition-colors">İletişim</Link></li>
              <li><a href="#" className="hover:text-red-300 transition-colors">Kariyer</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4">Yardım</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-red-300 transition-colors">SSS</a></li>
              <li><a href="#" className="hover:text-red-300 transition-colors">İade</a></li>
              <li><a href="#" className="hover:text-red-300 transition-colors">Teslimat</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4">İletişim</h4>
            <p className="text-sm">destek@kairamarkt.com</p>
            <p className="text-sm mt-1">0850 XXX XX XX</p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} <span className="text-red-400 font-semibold">KairaMarkt</span> · Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  );
}
