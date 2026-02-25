import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getFaqList, createFaq, updateFaq, deleteFaq } from '../../services/adminService';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

export default function AdminFaq() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ keywords: '', response: '', order: 0 });

  const load = () => {
    setLoading(true);
    getFaqList()
      .then((r) => setList(r.data.list || []))
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openNew = () => {
    setEditing(null);
    setForm({ keywords: '', response: '', order: list.length });
  };

  const openEdit = (item) => {
    setEditing(item._id);
    setForm({
      keywords: Array.isArray(item.keywords) ? item.keywords.join(', ') : (item.keywords || ''),
      response: item.response || '',
      order: item.order ?? 0,
    });
  };

  const save = (e) => {
    e.preventDefault();
    const keywords = form.keywords.split(/[,;]+/).map((k) => k.trim()).filter(Boolean);
    const payload = { keywords, response: form.response.trim(), order: Number(form.order) || 0 };
    const api = editing ? updateFaq(editing, payload) : createFaq(payload);
    api
      .then(() => { toast.success(editing ? 'Güncellendi' : 'Eklendi'); setEditing(null); load(); })
      .catch((e) => toast.error(e.message));
  };

  const remove = (id) => {
    if (!window.confirm('Bu SSS kaydını silmek istediğinize emin misiniz?')) return;
    deleteFaq(id).then(() => { toast.success('Silindi'); load(); }).catch((e) => toast.error(e.message));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-10 h-10 border-2 border-theme border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">SSS Yönetimi</h1>
        <button type="button" onClick={openNew} className="inline-flex items-center gap-2 px-4 py-2 btn-theme rounded-2xl text-sm font-semibold">
          <FiPlus className="w-4 h-4" /> Yeni SSS
        </button>
      </div>

      {(editing || (!editing && (form.response || form.keywords))) && (
        <form onSubmit={save} className="mb-6 p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
          <h2 className="font-semibold text-gray-900 dark:text-white">{editing ? 'SSS düzenle' : 'Yeni SSS'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Anahtar kelimeler (virgülle ayırın)</label>
            <input type="text" value={form.keywords} onChange={(e) => setForm((f) => ({ ...f, keywords: e.target.value }))} className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2" placeholder="kargo, teslimat, iade" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cevap</label>
            <textarea value={form.response} onChange={(e) => setForm((f) => ({ ...f, response: e.target.value }))} rows={3} className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2" placeholder="Cevap metni" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sıra</label>
            <input type="number" value={form.order} onChange={(e) => setForm((f) => ({ ...f, order: e.target.value }))} className="w-24 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2" min="0" />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 btn-theme rounded-xl text-sm font-medium">Kaydet</button>
            <button type="button" onClick={() => { setEditing(null); setForm({ keywords: '', response: '', order: 0 }); }} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl text-sm">İptal</button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {list.map((item) => (
          <div key={item._id} className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex justify-between items-start gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{(item.keywords || []).join(', ') || '—'}</p>
              <p className="text-gray-900 dark:text-white mt-1">{item.response}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button type="button" onClick={() => openEdit(item)} className="p-2 text-theme hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><FiEdit2 className="w-4 h-4" /></button>
              <button type="button" onClick={() => remove(item._id)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><FiTrash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
      {list.length === 0 && !editing && (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">Henüz SSS kaydı yok. &quot;Yeni SSS&quot; ile ekleyin.</p>
      )}
    </div>
  );
}
