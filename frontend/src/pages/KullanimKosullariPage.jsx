import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

export default function KullanimKosullariPage() {
  const { siteName } = useSettings();
  const brand = siteName || 'KairaMarkt';

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Kullanım Koşulları</h1>
      <div className="h-1 w-16 rounded-full bg-theme mb-8" aria-hidden />
      <div className="prose prose-gray dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-4">
        <p><strong>Bu koşullar {brand} web sitesi ve hizmetlerinin kullanımına ilişkindir.</strong></p>
        <h2 className="text-xl font-semibold mt-6">Hizmet kapsamı</h2>
        <p>Site üzerinden ürün inceleme, sipariş verme, kampanya ve forum gibi hizmetlere erişirsiniz. Hizmetler, mevcut oldukları şekilde sunulmaktadır.</p>
        <h2 className="text-xl font-semibold mt-6">Hesap ve sipariş</h2>
        <p>Hesap bilgilerinizi güncel ve doğru tutmak sizin sorumluluğunuzdadır. Siparişler, ödeme ve stok durumuna göre onaylanır; iptal ve iade koşulları <Link to="/iade" className="text-theme hover:underline">İade</Link> sayfamızda belirtilmiştir.</p>
        <h2 className="text-xl font-semibold mt-6">Fikri mülkiyet</h2>
        <p>Sitedeki metin, görsel ve logo gibi unsurlar {brand} veya lisans verenlere aittir. İzinsiz kopyalama ve kullanım yasaktır.</p>
        <h2 className="text-xl font-semibold mt-6">İletişim</h2>
        <p>Koşullarla ilgili sorularınız için <Link to="/iletisim" className="text-theme hover:underline">İletişim</Link> sayfamızdan bize ulaşabilirsiniz.</p>
      </div>
    </div>
  );
}
