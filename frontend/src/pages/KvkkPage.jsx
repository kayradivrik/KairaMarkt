import { useSettings } from '../context/SettingsContext';

export default function KvkkPage() {
  const { siteName } = useSettings();
  const brand = siteName || 'KairaMarkt';

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">KVKK Aydınlatma Metni</h1>
      <div className="h-1 w-16 rounded-full bg-theme mb-8" aria-hidden />
      <div className="prose prose-gray dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-4">
        <p><strong>6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında aydınlatma metnidir.</strong></p>
        <p>
          {brand} olarak kişisel verileriniz; hukuka ve dürüstlük kurallarına uygun, doğru ve güncel şekilde, belirli açık ve meşru amaçlarla, işlendikleri amaçla bağlantılı ve sınırlı olarak işlenmektedir.
        </p>
        <h2 className="text-xl font-semibold mt-6">Veri sorumlusu</h2>
        <p>Kişisel verileriniz veri sorumlusu sıfatıyla {brand} tarafından işlenmektedir.</p>
        <h2 className="text-xl font-semibold mt-6">İşlenen veriler ve amaçları</h2>
        <p>Kimlik ve iletişim bilgileriniz (ad, e-posta, telefon, adres) sipariş ve sözleşme süreçlerinin yürütülmesi, müşteri hizmetleri ve yasal yükümlülükler kapsamında işlenir.</p>
        <h2 className="text-xl font-semibold mt-6">Haklarınız</h2>
        <p>KVKK md. 11 uyarınca kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme, işlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme, yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme, eksik veya yanlış işlenmişse düzeltilmesini isteme, silinmesini veya yok edilmesini isteme haklarına sahipsiniz. Başvurularınızı iletişim kanallarımız üzerinden iletebilirsiniz.</p>
      </div>
    </div>
  );
}
