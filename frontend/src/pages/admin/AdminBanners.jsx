import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiLayers, FiPlusCircle } from 'react-icons/fi';
import { getAdminBanners } from '../../services/adminService';

export default function AdminBanners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminBanners()
      .then((r) => setBanners(r.data.banners || []))
      .catch(() => toast.error('Bannerlar yüklenemedi'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FiLayers className="w-6 h-6 text-theme" />
            Banner yönetimi
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Ana sayfa ve kategori sayfalarındaki banner alanlarını buradan yönetin.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 bg-theme text-white text-sm font-medium hover:brightness-110"
        >
          <FiPlusCircle className="w-4 h-4" />
          Yeni banner (yakında)
        </button>
      </header>

      <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-2 border-theme border-t-transparent rounded-full animate-spin" />
          </div>
        ) : banners.length ? (
          <ul className="space-y-3 text-sm">
            {banners.map((b) => (
              <li
                key={b._id}
                className="flex items-center justify-between gap-3 px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {b.imageUrl && (
                    <img src={b.imageUrl} alt={b.title || 'Banner'} className="w-14 h-10 rounded-lg object-cover border border-gray-200 dark:border-gray-700" />
                  )}
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white truncate">{b.title || '(Başlık yok)'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      Pozisyon: {b.position || 'home'} · Sıra: {b.order ?? 0}
                    </p>
                  </div>
                </div>
                <span
                  className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                    b.isActive
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  {b.isActive ? 'Aktif' : 'Pasif'}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">Henüz banner eklenmemiş.</p>
        )}
      </div>
    </div>
  );
}

