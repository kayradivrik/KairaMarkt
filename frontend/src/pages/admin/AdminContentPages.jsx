import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiFile, FiTrash2 } from 'react-icons/fi';
import { getContentPages, upsertContentPage, deleteContentPage } from '../../services/adminService';

export default function AdminContentPages() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ slug: '', title: '', body: '', isPublished: true });

  useEffect(() => {
    getContentPages()
      .then((r) => setPages(r.data.pages || []))
      .catch(() => toast.error('İçerik sayfaları yüklenemedi'))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    upsertContentPage(form)
      .then((r) => {
        const page = r.data.page;
        if (page) {
          setPages((prev) => {
            const others = prev.filter((p) => p._id !== page._id);
            return [page, ...others];
          });
        }
        toast.success('Sayfa kaydedildi');
      })
      .catch(() => toast.error('Kayıt başarısız'))
      .finally(() => setSaving(false));
  };

  const handleSelect = (p) => {
    setForm({
      slug: p.slug || '',
      title: p.title || '',
      body: p.body || '',
      isPublished: p.isPublished !== false,
    });
  };

  const handleDelete = (id) => {
    if (!window.confirm('Bu sayfayı silmek istediğinize emin misiniz?')) return;
    deleteContentPage(id)
      .then(() => {
        setPages((prev) => prev.filter((p) => p._id !== id));
        toast.success('Sayfa silindi');
      })
      .catch(() => toast.error('Sayfa silinemedi'));
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <FiFile className="w-6 h-6 text-theme" />
          İçerik sayfaları
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Hakkımızda, KVKK, gizlilik politikası gibi statik içerik sayfalarını buradan düzenleyebilirsiniz.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">Sayfa listesi</h2>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-2 border-theme border-t-transparent rounded-full animate-spin" />
            </div>
          ) : pages.length ? (
            <ul className="space-y-2 text-sm">
              {pages.map((p) => (
                <li
                  key={p._id}
                  className="px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 flex items-center justify-between gap-2"
                >
                  <button
                    type="button"
                    onClick={() => handleSelect(p)}
                    className="flex-1 text-left"
                  >
                    <p className="font-semibold text-gray-900 dark:text-white">{p.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">/sayfa/{p.slug}</p>
                    <p className="text-[11px] mt-0.5">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          p.isPublished !== false
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                            : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
                        }`}
                      >
                        {p.isPublished !== false ? 'Yayında' : 'Taslak'}
                      </span>
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(p._id)}
                    className="p-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    aria-label="Sil"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">Henüz içerik sayfası yok.</p>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 space-y-4"
        >
          <h2 className="font-semibold text-gray-900 dark:text-white mb-1 text-sm">Sayfa düzenleyici</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Slug</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white"
              placeholder="hakkimizda"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Başlık</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white"
              placeholder="Hakkımızda"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">İçerik</label>
            <textarea
              rows={6}
              value={form.body}
              onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white"
              placeholder="Sayfa içeriğini buraya yazın..."
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              id="isPublished"
              type="checkbox"
              checked={form.isPublished}
              onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))}
            />
            <label htmlFor="isPublished" className="text-sm text-gray-700 dark:text-gray-300">
              Yayında olsun
            </label>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center px-4 py-2 rounded-2xl bg-theme text-white text-sm font-semibold disabled:opacity-60"
          >
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </form>
      </div>
    </div>
  );
}

