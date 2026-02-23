/**
 * Teslimat & Sipariş Durumları sayfası
 * KairaMarkt - Kayra tarafından yapılmıştır
 */
export default function TeslimatPage() {
  const statuses = [
    { code: 'pending', label: 'Beklemede', desc: 'Siparişiniz alındı ve ödeme onayı bekleniyor.' },
    { code: 'confirmed', label: 'Onaylandı', desc: 'Ödemeniz alındı, sipariş hazırlanıyor.' },
    { code: 'preparing', label: 'Hazırlanıyor', desc: 'Ürünleriniz paketleniyor, kargoya verilmek üzere.' },
    { code: 'shipped', label: 'Kargoda', desc: 'Siparişiniz yola çıktı. Takip numarası ile takip edebilirsiniz.' },
    { code: 'delivered', label: 'Teslim edildi', desc: 'Siparişiniz teslim alındı. Keyifli kullanımlar!' },
    { code: 'cancelled', label: 'İptal', desc: 'Sipariş iptal edildi.' },
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Teslimat & Sipariş Durumları</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Siparişinizin hangi aşamada olduğunu buradan takip edebilirsiniz. Sorularınız için iletişime geçebilirsiniz.
      </p>

      <div className="space-y-4">
        {statuses.map((s) => (
          <div
            key={s.code}
            className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
          >
            <h3 className="font-semibold text-gray-900 dark:text-white">{s.label}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{s.desc}</p>
          </div>
        ))}
      </div>

      <section className="mt-10 p-4 rounded-xl bg-gray-100 dark:bg-gray-800">
        <h2 className="font-bold text-gray-900 dark:text-white mb-2">Teslimat süreleri</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Standart teslimat 2–5 iş günü içinde yapılır. Kampanyalı dönemlerde süreler uzayabilir. Siparişiniz &quot;Kargoda&quot; olduğunda kargo firmasından gelen takip numarası ile takip edebilirsiniz.
        </p>
      </section>
    </div>
  );
}
