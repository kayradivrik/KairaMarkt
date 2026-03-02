import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiBell } from 'react-icons/fi';
import { getNotificationSettings, updateNotificationSettings } from '../../services/adminService';

export default function AdminNotifications() {
  const [settings, setSettings] = useState({
    orderEmailsEnabled: true,
    lowStockEmailsEnabled: true,
    systemEmailsEnabled: true,
    adminEmail: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getNotificationSettings()
      .then((r) => setSettings((s) => ({ ...s, ...(r.data.settings || {}) })))
      .catch(() => toast.error('Bildirim ayarları yüklenemedi'))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    updateNotificationSettings(settings)
      .then((r) => setSettings(r.data.settings || settings))
      .then(() => toast.success('Bildirim ayarları kaydedildi'))
      .catch(() => toast.error('Kayıt başarısız'))
      .finally(() => setSaving(false));
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <FiBell className="w-6 h-6 text-theme" />
          Bildirimler
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Sipariş, stok ve sistem bildirimlerini buradan yönetebilirsiniz. E-posta / bildirim tercihleri burada yapılandırılabilir.
        </p>
      </header>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-2 border-theme border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 space-y-4 max-w-xl">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Yönetici e-posta adresi</label>
            <input
              type="email"
              value={settings.adminEmail}
              onChange={(e) => setSettings((s) => ({ ...s, adminEmail: e.target.value }))}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white"
              placeholder="ornek@site.com"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">E-posta bildirimleri</label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={settings.orderEmailsEnabled}
                onChange={(e) => setSettings((s) => ({ ...s, orderEmailsEnabled: e.target.checked }))}
              />
              <span>Yeni siparişlerde e-posta gönder</span>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={settings.lowStockEmailsEnabled}
                onChange={(e) => setSettings((s) => ({ ...s, lowStockEmailsEnabled: e.target.checked }))}
              />
              <span>Düşük stok uyarılarında e-posta gönder</span>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={settings.systemEmailsEnabled}
                onChange={(e) => setSettings((s) => ({ ...s, systemEmailsEnabled: e.target.checked }))}
              />
              <span>Sistem hatalarında e-posta gönder</span>
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
      )}
    </div>
  );
}

