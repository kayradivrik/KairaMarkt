import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Hakkımızda
      </h1>
      <div className="h-1 w-16 rounded-full bg-theme mb-6" aria-hidden />

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
        Merhaba! 12. Sınıf bir Meslek Lisesi bilişim bölümünde öğrenciyim Web
        Tasarımda bu kadar gelişip bunları yapabilmemi sağladığı için Uğur
        hocama Teşekkür ederim
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
        Burada gördüğünüz her şey — ürün listesi, sepet, sipariş akışı, admin
        paneli, kampanyalar, slider — baştan sona düşünülüp kodlandı. Bazen gece
        geç saatlere kadar "Bunu nasıl daha iyi yaparım?" diye uğraştığım anlar
        oldu. Sonuçta ortaya sadece bir ödev değil, gerçekten gezinebileceğiniz,
        sipariş verebileceğiniz (simülasyon da olsa) bir site çıktı.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
        Yapay Zekadan kütüphaneler için bolca destek aldım fakat fikirler,
        sayfalar ve kod yapısı tamamıyla bana aittir.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
        Sorularınız veya önerileriniz için{" "}
        <Link
          to="/iletisim"
          className="text-theme hover:underline"
        >
          İletişim
        </Link>{" "}
        sayfasından bize ulaşabilirsiniz. KairaMarkt ile alışverişin keyifli
        olması dileğiyle!
      </p>

      <p className="text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-6">
        Okul için yapılmış bir proje. KairaMarkt · Kayra tarafından yapılmıştır.
      </p>

      <div className="mt-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
          Kullandığım Teknolojiler
        </h2>

        <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1 [--tw-list-disc:var(--site-primary)]" style={{ listStyleColor: 'var(--site-primary)' }}>
          <li>React</li>
          <li>Vite</li>
          <li>React Router</li>
          <li>Tailwind CSS</li>
          <li>Node.js</li>
          <li>Express.js</li>
          <li>MongoDB</li>
          <li>Mongoose</li>
          <li>JWT (JSON Web Token)</li>
          <li>Axios</li>
          <li>RESTful API</li>
        </ul>
      </div>
    </div>
  );
}