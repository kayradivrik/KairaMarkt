import { useSettings } from '../context/SettingsContext';

export default function GizlilikPage() {
  const { siteName } = useSettings();
  const brand = siteName || 'KairaMarkt';

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Gizlilik Politikası</h1>
      <div className="h-1 w-16 rounded-full bg-theme mb-8" aria-hidden />
      <div className="prose prose-gray dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-4">
        <p><strong>Son güncelleme:</strong> {new Date().toLocaleDateString('tr-TR')}</p>
        <p>
          {brand} olarak kişisel verilerinizin güvenliği bizim için önemlidir. Bu politika, web sitemizi kullanırken toplanan bilgilerin nasıl işlendiğini açıklar.
        </p>
        <h2 className="text-xl font-semibold mt-6">Toplanan bilgiler</h2>
        <p>Hesap oluşturma, sipariş ve iletişim formları aracılığıyla ad, e-posta, telefon ve adres bilgilerinizi toplayabiliriz. Ödeme bilgileri ödeme sağlayıcı üzerinden işlenir.</p>
        <h2 className="text-xl font-semibold mt-6">Kullanım amaçları</h2>
        <p>Bilgileriniz siparişlerinizin yerine getirilmesi, müşteri hizmetleri, kampanya ve bilgilendirme iletileri (izin verdiğinizde) ve yasal yükümlülüklerimizin karşılanması için kullanılır.</p>
        <h2 className="text-xl font-semibold mt-6">Çerezler</h2>
        <p>Site deneyimini iyileştirmek için çerezler kullanıyoruz. Tarayıcı ayarlarınızdan çerez tercihlerinizi yönetebilirsiniz.</p>
        <h2 className="text-xl font-semibold mt-6">İletişim</h2>
        <p>Gizlilik ile ilgili sorularınız için iletişim sayfamızdan bize ulaşabilirsiniz.</p>
      </div>
    </div>
  );
}
