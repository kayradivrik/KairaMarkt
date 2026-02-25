import { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import toast from 'react-hot-toast';
import { getCampaigns, createCampaign, updateCampaign, deleteCampaign } from '../../services/adminService';

export default function AdminCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = () => {
    setLoading(true);
    getCampaigns()
      .then((r) => setCampaigns(r.data.campaigns || []))
      .catch(() => setCampaigns([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = (id, code) => {
    if (!window.confirm(`"${code}" kampanyasını silmek istediğinize emin misiniz?`)) return;
    deleteCampaign(id)
      .then(() => { toast.success('Silindi'); load(); })
      .catch((e) => toast.error(e.message));
  };

  const initial = editing || {
    name: '', description: '', discountType: 'percent', discountValue: '', minPurchase: '', code: '', startDate: '', endDate: '', usageLimit: '', isActive: true,
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Kampanyalar</h1>
        <button type="button" onClick={() => { setEditing(null); setShowForm(!showForm); }} className="px-4 py-2 btn-theme rounded-2xl text-sm">
          {showForm ? 'İptal' : 'Yeni Kampanya'}
        </button>
      </div>

      {showForm && (
        <Formik
          initialValues={initial}
          enableReinitialize
          onSubmit={async (values) => {
            try {
              const payload = {
                ...values,
                discountValue: Number(values.discountValue),
                minPurchase: Number(values.minPurchase) || 0,
                usageLimit: values.usageLimit ? Number(values.usageLimit) : null,
                startDate: new Date(values.startDate),
                endDate: new Date(values.endDate),
              };
              if (editing) {
                await updateCampaign(editing._id, payload);
                toast.success('Kampanya güncellendi');
              } else {
                await createCampaign(payload);
                toast.success('Kampanya eklendi');
              }
              setShowForm(false);
              setEditing(null);
              load();
            } catch (e) {
              toast.error(e.message || 'İşlem başarısız');
            }
          }}
        >
          <Form className="max-w-xl space-y-4 mb-8 p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <div>
              <label className="block text-sm font-medium mb-1">Kampanya adı</label>
              <Field name="name" className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Kupon kodu</label>
              <Field name="code" className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 uppercase" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">İndirim tipi</label>
              <Field as="select" name="discountType" className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2">
                <option value="percent">Yüzde</option>
                <option value="fixed">Sabit tutar</option>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">İndirim değeri</label>
                <Field name="discountValue" type="number" min="0" className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Min. alışveriş (₺)</label>
                <Field name="minPurchase" type="number" min="0" className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Başlangıç</label>
                <Field name="startDate" type="datetime-local" className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Bitiş</label>
                <Field name="endDate" type="datetime-local" className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Kullanım limiti (boş = sınırsız)</label>
              <Field name="usageLimit" type="number" min="0" className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2" />
            </div>
            <label className="flex items-center gap-2"><Field name="isActive" type="checkbox" /> Aktif</label>
            <div className="flex gap-2">
              <button type="submit" className="px-6 py-2 btn-theme rounded-2xl">Kaydet</button>
              <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="px-6 py-2 border rounded-lg">İptal</button>
            </div>
          </Form>
        </Formik>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-10 h-10 border-2 border-theme border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="text-left p-3">Kod</th>
                <th className="text-left p-3">Ad</th>
                <th className="text-left p-3">İndirim</th>
                <th className="text-left p-3">Tarih</th>
                <th className="text-right p-3">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c._id} className="border-t border-gray-200 dark:border-gray-700">
                  <td className="p-3 font-mono">{c.code}</td>
                  <td className="p-3">{c.name}</td>
                  <td className="p-3">{c.discountType === 'percent' ? `%${c.discountValue}` : `${c.discountValue} ₺`}</td>
                  <td className="p-3">{new Date(c.startDate).toLocaleDateString('tr-TR')} - {new Date(c.endDate).toLocaleDateString('tr-TR')}</td>
                  <td className="p-3 text-right">
                    <button type="button" onClick={() => { setEditing(c); setShowForm(true); }} className="text-theme mr-2">Düzenle</button>
                    <button type="button" onClick={() => handleDelete(c._id, c.code)} className="text-theme">Sil</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
