import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiTruck } from 'react-icons/fi';
import { getShippingSettings, updateShippingSettings } from '../../services/adminService';

export default function AdminShipping() {
  const [settings, setSettings] = useState({
    freeShippingThreshold: 0,
    defaultShippingFee: 0,
    carrierName: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getShippingSettings()
      .then((r) => setSettings((s) => ({ ...s, ...(r.data.settings || {}) })))
      .catch(() => toast.error('Kargo ayarları yüklenemedi'))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    updateShippingSettings(settings)
      .then((r) => setSettings(r.data.settings || settings))
      .then(() => toast.success('Kargo ayarları kaydedildi'))
      .catch(() => toast.error('Kayıt başarısız'))
      .finally(() => setSaving(false));
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <FiTruck className="w-6 h-6 text-theme" />
          Kargo ayarları
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Kargo firmaları, ücretler ve ücretsiz kargo limitlerini buradan yapılandırabilirsiniz.
        </p>
      </header>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-2 border-theme border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 space-y-4 max-w-xl">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kargo firması adı</label>
            <input
              type="text"
              value={settings.carrierName}
              onChange={(e) => setSettings((s) => ({ ...s, carrierName: e.target.value }))}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white"
              placeholder="Örn: MNG Kargo"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Varsayılan kargo ücreti (₺)</label>
              <input
                type="number"
                value={settings.defaultShippingFee}
                onChange={(e) => setSettings((s) => ({ ...s, defaultShippingFee: Number(e.target.value) || 0 }))}
                className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ücretsiz kargo limiti (₺)</label>
              <input
                type="number"
                value={settings.freeShippingThreshold}
                onChange={(e) => setSettings((s) => ({ ...s, freeShippingThreshold: Number(e.target.value) || 0 }))}
                className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center px-4 py-2 rounded-2xl bg-theme text-white text-sm font-semibold disabled:opacity-60"
          >
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </form>
      )}
    </div>
  );
}

