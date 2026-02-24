import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getSettings, updateSettings, uploadLogo } from '../../services/adminService';

const defaultSettings = {
  siteName: 'KairaMarkt',
  logoUrl: '',
  showLogo: false,
  primaryColor: '#b91c1c',
  marqueeText: '',
  footerText: '',
};

export default function AdminSettings() {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState(null);

  const load = () => {
    setLoading(true);
    getSettings()
      .then((r) => setSettings({ ...defaultSettings, ...r.data?.settings }))
      .catch(() => toast.error('Ayarlar yüklenemedi'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    updateSettings({
      siteName: settings.siteName,
      logoUrl: settings.logoUrl,
      showLogo: settings.showLogo,
      primaryColor: settings.primaryColor,
      marqueeText: settings.marqueeText,
      footerText: settings.footerText,
    })
      .then((r) => {
        setSettings({ ...defaultSettings, ...r.data?.settings });
        toast.success('Ayarlar kaydedildi');
      })
      .catch((e) => toast.error(e.response?.data?.message || e.message || 'Kayıt başarısız'))
      .finally(() => setSaving(false));
  };

  const handleLogoUpload = (e) => {
    e.preventDefault();
    if (!logoFile) {
      toast.error('Lütfen bir logo dosyası seçin');
      return;
    }
    const formData = new FormData();
    formData.append('logo', logoFile);
    setSaving(true);
    uploadLogo(formData)
      .then((r) => {
        setSettings((prev) => ({ ...prev, logoUrl: r.data.logoUrl, showLogo: true }));
        setLogoFile(null);
        toast.success('Logo yüklendi');
      })
      .catch((e) => toast.error(e.response?.data?.message || e.message || 'Yükleme başarısız'))
      .finally(() => setSaving(false));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Site ayarları</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Site adı</label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => setSettings((s) => ({ ...s, siteName: e.target.value }))}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2"
              placeholder="KairaMarkt"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Logo</label>
            <div className="flex flex-wrap items-end gap-4">
              {settings.logoUrl && (
                <div className="flex items-center gap-2">
                  <img src={settings.logoUrl} alt="Logo" className="h-12 object-contain rounded border border-gray-200 dark:border-gray-600" />
                  <span className="text-sm text-gray-500">Mevcut logo</span>
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                  className="text-sm text-gray-600 dark:text-gray-400 file:mr-2 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-gray-200 dark:file:bg-gray-600 file:text-gray-800 dark:file:text-gray-200"
                />
                <button
                  type="button"
                  onClick={handleLogoUpload}
                  disabled={saving || !logoFile}
                  className="px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 disabled:opacity-50 text-sm font-medium"
                >
                  Logo yükle
                </button>
              </div>
            </div>
            <input
              type="url"
              value={settings.logoUrl}
              onChange={(e) => setSettings((s) => ({ ...s, logoUrl: e.target.value }))}
              className="mt-2 w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
              placeholder="Logo URL (isteğe bağlı)"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="showLogo"
              checked={settings.showLogo}
              onChange={(e) => setSettings((s) => ({ ...s, showLogo: e.target.checked }))}
              className="rounded border-gray-300 dark:border-gray-600"
            />
            <label htmlFor="showLogo" className="text-sm font-medium">Navbarda logo göster</label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Ana renk (tema)</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={settings.primaryColor}
                onChange={(e) => setSettings((s) => ({ ...s, primaryColor: e.target.value }))}
                className="h-10 w-14 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
              />
              <input
                type="text"
                value={settings.primaryColor}
                onChange={(e) => setSettings((s) => ({ ...s, primaryColor: e.target.value }))}
                className="flex-1 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 font-mono text-sm"
                placeholder="#b91c1c"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Navbar, footer ve vurgu rengi olarak kullanılır.</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Marquee metni (dashboard / ana sayfa)</label>
            <textarea
              value={settings.marqueeText}
              onChange={(e) => setSettings((s) => ({ ...s, marqueeText: e.target.value }))}
              rows={2}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2"
              placeholder="KairaMarkt Admin Paneli · Hoş geldiniz..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Footer metni</label>
            <textarea
              value={settings.footerText}
              onChange={(e) => setSettings((s) => ({ ...s, footerText: e.target.value }))}
              rows={3}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2"
              placeholder="Teknoloji ve elektronik ürünlerde uygun fiyat..."
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 bg-brand-500 text-white rounded-2xl hover:bg-brand-600 font-semibold disabled:opacity-50"
        >
          {saving ? 'Kaydediliyor...' : 'Ayarları kaydet'}
        </button>
      </form>
    </div>
  );
}
