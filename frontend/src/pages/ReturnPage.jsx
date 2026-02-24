/**
 * İade ve Değişim - KairaMarkt
 */
import { Link } from 'react-router-dom';

export default function ReturnPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">İade ve Değişim</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Ürünlerinizi güvenle iade edebilir veya değiştirebilirsiniz. Aşağıdaki koşullar geçerlidir.
      </p>

      <div className="space-y-6">
        <section className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <h2 className="font-bold text-gray-900 dark:text-white mb-2">İade süresi</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Ürünü teslim aldığınız tarihten itibaren 14 gün içinde cayma hakkınızı kullanarak iade edebilirsiniz.
            Ürün orijinal ambalajında ve kullanılmamış olmalıdır.
          </p>
        </section>

        <section className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <h2 className="font-bold text-gray-900 dark:text-white mb-2">Nasıl iade ederim?</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            1. Müşteri hizmetlerimizle iletişime geçin veya siparişiniz üzerinden iade talebi oluşturun.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            2. Size iletilen kargo bilgisi ile ürünü ücretsiz olarak gönderin.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            3. Ürün depomuzda kontrol edildikten sonra ödemeniz 3–5 iş günü içinde iade edilir.
          </p>
        </section>

        <section className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <h2 className="font-bold text-gray-900 dark:text-white mb-2">Değişim</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Aynı ürünün farklı beden/renk seçeneği için önce iade, ardından yeni sipariş oluşturmanız gerekir.
            Farklı bir ürün isterseniz iade sonrası ödemeniz hesabınıza yansır, yeni alışverişinizi yapabilirsiniz.
          </p>
        </section>

        <section className="p-4 rounded-xl bg-gray-100 dark:bg-gray-800">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Sorularınız için{' '}
            <Link to="/iletisim" className="text-theme font-medium hover:underline">
              İletişim
            </Link>{' '}
            sayfamızdan bize ulaşabilirsiniz.
          </p>
        </section>
      </div>
    </div>
  );
}
