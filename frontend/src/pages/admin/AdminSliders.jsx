import { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import toast from 'react-hot-toast';
import { getSliders, createSlider, updateSlider, deleteSlider } from '../../services/adminService';

export default function AdminSliders() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  const load = () => {
    setLoading(true);
    getSliders()
      .then((r) => setSlides(r.data.slides || []))
      .catch(() => setSlides([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = (id) => {
    if (!window.confirm('Bu slaytı silmek istediğinize emin misiniz?')) return;
    deleteSlider(id)
      .then(() => { toast.success('Silindi'); load(); })
      .catch((e) => toast.error(e.message));
  };

  const initial = editing || { image: '', title: '', subtitle: '', link: '', order: slides.length, isActive: true };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Ana sayfa slider</h1>
        <button
          type="button"
          onClick={() => setEditing(null)}
          className="px-4 py-2 bg-brand-500 text-white rounded-2xl hover:bg-brand-600 text-sm font-semibold"
        >
          {editing ? 'Yeni ekle' : 'Slayt ekle'}
        </button>
      </div>

      <Formik
        key={editing?._id || 'new'}
        initialValues={initial}
        enableReinitialize
        onSubmit={async (values) => {
          try {
            if (editing) {
              await updateSlider(editing._id, values);
              toast.success('Güncellendi');
            } else {
              await createSlider(values);
              toast.success('Eklendi');
            }
            setEditing(null);
            load();
          } catch (e) {
            toast.error(e.message || 'İşlem başarısız');
          }
        }}
      >
        <Form className="max-w-xl space-y-4 mb-8 p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          <div>
            <label className="block text-sm font-medium mb-1">Görsel URL *</label>
            <Field name="image" type="url" placeholder="https://..." className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2" required />
            <p className="text-xs text-gray-500 mt-1">Cloudinary veya herhangi bir görsel linki yapıştırın.</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Başlık</label>
            <Field name="title" className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Alt başlık</label>
            <Field name="subtitle" className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tıklanınca gidilecek link (boş bırakılabilir)</label>
            <Field name="link" type="text" placeholder="/urunler veya https://..." className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Sıra (küçük numara önce gelir)</label>
            <Field name="order" type="number" min="0" className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2" />
          </div>
          <label className="flex items-center gap-2">
            <Field name="isActive" type="checkbox" />
            Aktif (anasayfada görünsün)
          </label>
          <div className="flex gap-2">
            <button type="submit" className="px-6 py-2 bg-brand-500 text-white rounded-2xl hover:bg-brand-600 font-semibold">
              {editing ? 'Güncelle' : 'Ekle'}
            </button>
            {editing && (
              <button type="button" onClick={() => setEditing(null)} className="px-6 py-2 border rounded-2xl">
                İptal
              </button>
            )}
          </div>
        </Form>
      </Formik>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-10 h-10 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {slides.map((s) => (
            <div
              key={s._id}
              className="flex flex-col md:flex-row gap-4 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700"
            >
              <div className="w-full md:w-48 h-28 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700">
                <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 dark:text-gray-200">{s.title || '(başlık yok)'}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{s.subtitle || s.link || '-'}</p>
                <p className="text-xs text-gray-400 mt-1">Sıra: {s.order} · {s.isActive ? 'Aktif' : 'Pasif'}</p>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setEditing(s)} className="px-4 py-2 text-brand-600 font-medium rounded-xl border border-brand-500">
                  Düzenle
                </button>
                <button type="button" onClick={() => handleDelete(s._id)} className="px-4 py-2 text-red-600 font-medium rounded-xl border border-red-500">
                  Sil
                </button>
              </div>
            </div>
          ))}
          {!slides.length && <p className="text-gray-500 text-center py-8">Henüz slayt yok. Yukarıdan ekleyin.</p>}
        </div>
      )}
    </div>
  );
}
