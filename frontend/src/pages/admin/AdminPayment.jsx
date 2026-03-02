import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiCreditCard } from 'react-icons/fi';
import { getPaymentSettings, updatePaymentSettings } from '../../services/adminService';

export default function AdminPayment() {
  const [settings, setSettings] = useState({
    providerName: '',
    installmentsEnabled: false,
    cashOnDeliveryEnabled: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getPaymentSettings()
      .then((r) => setSettings((s) => ({ ...s, ...(r.data.settings || {}) })))
      .catch(() => toast.error('Ödeme ayarları yüklenemedi'))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    updatePaymentSettings(settings)
      .then((r) => setSettings(r.data.settings || settings))
      .then(() => toast.success('Ödeme ayarları kaydedildi'))
      .catch(() => toast.error('Kayıt başarısız'))
      .finally(() => setSaving(false));
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <FiCreditCard className="w-6 h-6 text-theme" />
          Ödeme ayarları
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Sanal POS, kapıda ödeme ve diğer ödeme yöntemleri için ayarları burada yönetebilirsiniz.
        </p>
      </header>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-2 border-theme border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 space-y-4 max-w-xl">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ödeme sağlayıcısı adı</label>
            <input
              type="text"
              value={settings.providerName}
              onChange={(e) => setSettings((s) => ({ ...s, providerName: e.target.value }))}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white"
              placeholder="Örn: İyzico, PayTR"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ödeme seçenekleri</label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={settings.installmentsEnabled}
                onChange={(e) => setSettings((s) => ({ ...s, installmentsEnabled: e.target.checked }))}
              />
              <span>Taksitli ödeme aktif</span>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={settings.cashOnDeliveryEnabled}
                onChange={(e) => setSettings((s) => ({ ...s, cashOnDeliveryEnabled: e.target.checked }))}
              />
              <span>Kapıda ödeme aktif</span>
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

