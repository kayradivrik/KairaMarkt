import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getSettings, updateSettings, uploadLogo } from '../../services/adminService';
import { useSettings } from '../../context/SettingsContext';
import { FiSave, FiImage, FiDroplet, FiMail, FiShare2, FiLink } from 'react-icons/fi';

const defaultSettings = {
  siteName: 'KairaMarkt',
  logoUrl: '',
  showLogo: false,
  primaryColor: '#b91c1c',
  marqueeText: '',
  footerText: '',
  footerBgColor: '',
  footerTextColor: '',
  contactEmail: '',
  contactPhone: '',
  address: '',
  workingHours: '',
  metaDescription: '',
  facebookUrl: '',
  twitterUrl: '',
  instagramUrl: '',
  showSocialLinks: true,
  footerSectionKurumsal: '',
  footerSectionYardim: '',
  footerSectionYasal: '',
  footerLabelAbout: '',
  footerLabelContact: '',
  footerLabelCampaigns: '',
  footerLabelSss: '',
  footerLabelIade: '',
  footerLabelTeslimat: '',
  footerLabelGizlilik: '',
  footerLabelKvkk: '',
  footerLabelKosullar: '',
  footerBadge1: '',
  footerBadge2: '',
  footerBadge3: '',
  footerBadge4: '',
  footerBottomText: '',
  announcementBarText: '',
  announcementBarEnabled: false,
  maintenanceMode: false,
};

function Field({ label, children }) {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>}
      {children}
    </div>
  );
}

export default function AdminSettings() {
  const { setSettings: setContextSettings } = useSettings();
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

  const payload = () => ({
    siteName: settings.siteName,
    logoUrl: settings.logoUrl,
    showLogo: settings.showLogo,
    primaryColor: settings.primaryColor,
    marqueeText: settings.marqueeText,
    footerText: settings.footerText,
    footerBgColor: settings.footerBgColor,
    footerTextColor: settings.footerTextColor,
    contactEmail: settings.contactEmail,
    contactPhone: settings.contactPhone,
    address: settings.address,
    workingHours: settings.workingHours,
    metaDescription: settings.metaDescription,
    facebookUrl: settings.facebookUrl,
    twitterUrl: settings.twitterUrl,
    instagramUrl: settings.instagramUrl,
    showSocialLinks: settings.showSocialLinks,
    footerSectionKurumsal: settings.footerSectionKurumsal,
    footerSectionYardim: settings.footerSectionYardim,
    footerSectionYasal: settings.footerSectionYasal,
    footerLabelAbout: settings.footerLabelAbout,
    footerLabelContact: settings.footerLabelContact,
    footerLabelCampaigns: settings.footerLabelCampaigns,
    footerLabelSss: settings.footerLabelSss,
    footerLabelIade: settings.footerLabelIade,
    footerLabelTeslimat: settings.footerLabelTeslimat,
    footerLabelGizlilik: settings.footerLabelGizlilik,
    footerLabelKvkk: settings.footerLabelKvkk,
    footerLabelKosullar: settings.footerLabelKosullar,
    footerBadge1: settings.footerBadge1,
    footerBadge2: settings.footerBadge2,
    footerBadge3: settings.footerBadge3,
    footerBadge4: settings.footerBadge4,
    footerBottomText: settings.footerBottomText,
    announcementBarText: settings.announcementBarText,
    announcementBarEnabled: settings.announcementBarEnabled,
    maintenanceMode: settings.maintenanceMode,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    updateSettings(payload())
      .then((r) => {
        setSettings({ ...defaultSettings, ...r.data?.settings });
        setContextSettings && setContextSettings({ ...defaultSettings, ...r.data?.settings });
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
      <div className="flex justify-center py-12">
        <div className="w-10 h-10 border-2 border-theme border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const inputClass = "w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white";
  const sectionClass = "p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-4";

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Site ayarları</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className={sectionClass}>
          <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-2">
            <FiImage className="w-5 h-5" /> Genel
          </h2>
          <Field label="Site adı">
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => setSettings((s) => ({ ...s, siteName: e.target.value }))}
              className={inputClass}
              placeholder="KairaMarkt"
            />
          </Field>
          <Field label="Logo">
            <div className="flex flex-wrap items-end gap-4">
              {settings.logoUrl && (
                <div className="flex items-center gap-2">
                  <img src={settings.logoUrl} alt="Logo" className="h-12 object-contain rounded border border-gray-200 dark:border-gray-600" />
                  <span className="text-sm text-gray-500">Mevcut</span>
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
              className={`mt-2 ${inputClass} text-sm`}
              placeholder="Logo URL (isteğe bağlı)"
            />
          </Field>
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
          <Field label="Marquee metni (dashboard)">
            <textarea
              value={settings.marqueeText}
              onChange={(e) => setSettings((s) => ({ ...s, marqueeText: e.target.value }))}
              rows={2}
              className={inputClass}
              placeholder="Admin paneli hoş geldin metni"
            />
          </Field>
          <Field label="Footer metni">
            <textarea
              value={settings.footerText}
              onChange={(e) => setSettings((s) => ({ ...s, footerText: e.target.value }))}
              rows={2}
              className={inputClass}
              placeholder="Site tanımı"
            />
          </Field>
        </div>

        <div className={sectionClass}>
          <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-2">
            <FiDroplet className="w-5 h-5" /> Renkler
          </h2>
          <Field label="Ana renk (tema)">
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
                className={`flex-1 ${inputClass} font-mono text-sm`}
                placeholder="#b91c1c"
              />
            </div>
          </Field>
          <Field label="Footer arka plan rengi">
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={settings.footerBgColor || '#111827'}
                onChange={(e) => setSettings((s) => ({ ...s, footerBgColor: e.target.value }))}
                className="h-10 w-14 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
              />
              <input
                type="text"
                value={settings.footerBgColor}
                onChange={(e) => setSettings((s) => ({ ...s, footerBgColor: e.target.value }))}
                className={`flex-1 ${inputClass} font-mono text-sm`}
                placeholder="#111827 (boş = varsayılan)"
              />
            </div>
          </Field>
          <Field label="Footer yazı rengi">
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={settings.footerTextColor || '#d1d5db'}
                onChange={(e) => setSettings((s) => ({ ...s, footerTextColor: e.target.value }))}
                className="h-10 w-14 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
              />
              <input
                type="text"
                value={settings.footerTextColor}
                onChange={(e) => setSettings((s) => ({ ...s, footerTextColor: e.target.value }))}
                className={`flex-1 ${inputClass} font-mono text-sm`}
                placeholder="#d1d5db (boş = varsayılan)"
              />
            </div>
          </Field>
        </div>

        <div className={sectionClass}>
          <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-2">
            <FiLink className="w-5 h-5" /> Footer link ve metinleri
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Boş bırakırsanız varsayılan metinler kullanılır.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Bölüm: Kurumsal">
              <input type="text" value={settings.footerSectionKurumsal} onChange={(e) => setSettings((s) => ({ ...s, footerSectionKurumsal: e.target.value }))} className={inputClass} placeholder="Kurumsal" />
            </Field>
            <Field label="Bölüm: Yardım">
              <input type="text" value={settings.footerSectionYardim} onChange={(e) => setSettings((s) => ({ ...s, footerSectionYardim: e.target.value }))} className={inputClass} placeholder="Yardım" />
            </Field>
            <Field label="Bölüm: Yasal">
              <input type="text" value={settings.footerSectionYasal} onChange={(e) => setSettings((s) => ({ ...s, footerSectionYasal: e.target.value }))} className={inputClass} placeholder="Yasal" />
            </Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <Field label="Hakkımızda (link metni)">
              <input type="text" value={settings.footerLabelAbout} onChange={(e) => setSettings((s) => ({ ...s, footerLabelAbout: e.target.value }))} className={inputClass} placeholder="Hakkımızda" />
            </Field>
            <Field label="İletişim (link metni)">
              <input type="text" value={settings.footerLabelContact} onChange={(e) => setSettings((s) => ({ ...s, footerLabelContact: e.target.value }))} className={inputClass} placeholder="İletişim" />
            </Field>
            <Field label="Kampanyalar (link metni)">
              <input type="text" value={settings.footerLabelCampaigns} onChange={(e) => setSettings((s) => ({ ...s, footerLabelCampaigns: e.target.value }))} className={inputClass} placeholder="Kampanyalar" />
            </Field>
            <Field label="SSS (link metni)">
              <input type="text" value={settings.footerLabelSss} onChange={(e) => setSettings((s) => ({ ...s, footerLabelSss: e.target.value }))} className={inputClass} placeholder="SSS" />
            </Field>
            <Field label="İade (link metni)">
              <input type="text" value={settings.footerLabelIade} onChange={(e) => setSettings((s) => ({ ...s, footerLabelIade: e.target.value }))} className={inputClass} placeholder="İade" />
            </Field>
            <Field label="Teslimat (link metni)">
              <input type="text" value={settings.footerLabelTeslimat} onChange={(e) => setSettings((s) => ({ ...s, footerLabelTeslimat: e.target.value }))} className={inputClass} placeholder="Teslimat" />
            </Field>
            <Field label="Gizlilik Politikası (link metni)">
              <input type="text" value={settings.footerLabelGizlilik} onChange={(e) => setSettings((s) => ({ ...s, footerLabelGizlilik: e.target.value }))} className={inputClass} placeholder="Gizlilik Politikası" />
            </Field>
            <Field label="KVKK (link metni)">
              <input type="text" value={settings.footerLabelKvkk} onChange={(e) => setSettings((s) => ({ ...s, footerLabelKvkk: e.target.value }))} className={inputClass} placeholder="KVKK" />
            </Field>
            <Field label="Kullanım Koşulları (link metni)">
              <input type="text" value={settings.footerLabelKosullar} onChange={(e) => setSettings((s) => ({ ...s, footerLabelKosullar: e.target.value }))} className={inputClass} placeholder="Kullanım Koşulları" />
            </Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Field label="Üst rozet 1 (örn. Güvenli ödeme)">
              <input type="text" value={settings.footerBadge1} onChange={(e) => setSettings((s) => ({ ...s, footerBadge1: e.target.value }))} className={inputClass} placeholder="Güvenli ödeme (SSL)" />
            </Field>
            <Field label="Üst rozet 2">
              <input type="text" value={settings.footerBadge2} onChange={(e) => setSettings((s) => ({ ...s, footerBadge2: e.target.value }))} className={inputClass} placeholder="Hızlı kargo" />
            </Field>
            <Field label="Üst rozet 3">
              <input type="text" value={settings.footerBadge3} onChange={(e) => setSettings((s) => ({ ...s, footerBadge3: e.target.value }))} className={inputClass} placeholder="Kolay iade" />
            </Field>
            <Field label="Üst rozet 4">
              <input type="text" value={settings.footerBadge4} onChange={(e) => setSettings((s) => ({ ...s, footerBadge4: e.target.value }))} className={inputClass} placeholder="Taksit imkânı" />
            </Field>
            <Field label="Alt metin (sosyal yoksa)">
              <input type="text" value={settings.footerBottomText} onChange={(e) => setSettings((s) => ({ ...s, footerBottomText: e.target.value }))} className={inputClass} placeholder="Güvenli alışveriş" />
            </Field>
          </div>
        </div>

        <div className={sectionClass}>
          <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-2">
            <FiMail className="w-5 h-5" /> İletişim
          </h2>
          <Field label="E-posta">
            <input
              type="email"
              value={settings.contactEmail}
              onChange={(e) => setSettings((s) => ({ ...s, contactEmail: e.target.value }))}
              className={inputClass}
              placeholder="destek@site.com"
            />
          </Field>
          <Field label="Telefon">
            <input
              type="text"
              value={settings.contactPhone}
              onChange={(e) => setSettings((s) => ({ ...s, contactPhone: e.target.value }))}
              className={inputClass}
              placeholder="+90 212 000 00 00"
            />
          </Field>
          <Field label="Adres">
            <textarea
              value={settings.address}
              onChange={(e) => setSettings((s) => ({ ...s, address: e.target.value }))}
              rows={2}
              className={inputClass}
              placeholder="Şirket adresi"
            />
          </Field>
          <Field label="Çalışma saatleri">
            <input
              type="text"
              value={settings.workingHours}
              onChange={(e) => setSettings((s) => ({ ...s, workingHours: e.target.value }))}
              className={inputClass}
              placeholder="Pzt-Cum 09:00-18:00"
            />
          </Field>
        </div>

        <div className={sectionClass}>
          <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-2">
            <FiShare2 className="w-5 h-5" /> Sosyal medya
          </h2>
          <div className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              id="showSocialLinks"
              checked={settings.showSocialLinks}
              onChange={(e) => setSettings((s) => ({ ...s, showSocialLinks: e.target.checked }))}
              className="rounded border-gray-300 dark:border-gray-600"
            />
            <label htmlFor="showSocialLinks" className="text-sm font-medium">Footer'da sosyal linkleri göster</label>
          </div>
          <Field label="Facebook URL">
            <input
              type="url"
              value={settings.facebookUrl}
              onChange={(e) => setSettings((s) => ({ ...s, facebookUrl: e.target.value }))}
              className={inputClass}
              placeholder="https://facebook.com/..."
            />
          </Field>
          <Field label="Twitter URL">
            <input
              type="url"
              value={settings.twitterUrl}
              onChange={(e) => setSettings((s) => ({ ...s, twitterUrl: e.target.value }))}
              className={inputClass}
              placeholder="https://twitter.com/..."
            />
          </Field>
          <Field label="Instagram URL">
            <input
              type="url"
              value={settings.instagramUrl}
              onChange={(e) => setSettings((s) => ({ ...s, instagramUrl: e.target.value }))}
              className={inputClass}
              placeholder="https://instagram.com/..."
            />
          </Field>
        </div>

        <div className={sectionClass}>
          <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-2">
            <FiShare2 className="w-5 h-5" /> Duyuru & Bakım
          </h2>
          <Field label="Üst duyuru metni (isteğe bağlı)">
            <input
              type="text"
              value={settings.announcementBarText || ''}
              onChange={(e) => setSettings((s) => ({ ...s, announcementBarText: e.target.value }))}
              className={inputClass}
              placeholder="Örn: Ücretsiz kargo 500 TL üzeri siparişlerde!"
            />
          </Field>
          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              id="announcementBarEnabled"
              checked={!!settings.announcementBarEnabled}
              onChange={(e) => setSettings((s) => ({ ...s, announcementBarEnabled: e.target.checked }))}
              className="rounded border-gray-300 dark:border-gray-600"
            />
            <label htmlFor="announcementBarEnabled" className="text-sm font-medium">Duyuru çubuğunu göster</label>
          </div>
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <input
              type="checkbox"
              id="maintenanceMode"
              checked={!!settings.maintenanceMode}
              onChange={(e) => setSettings((s) => ({ ...s, maintenanceMode: e.target.checked }))}
              className="rounded border-gray-300 dark:border-gray-600"
            />
            <label htmlFor="maintenanceMode" className="text-sm font-medium text-amber-600 dark:text-amber-400">Bakım modu (ziyaretçilere bakım sayfası göster, admin girişi normal)</label>
          </div>
        </div>

        <div className={sectionClass}>
          <h2 className="font-semibold text-gray-900 dark:text-white mb-2">SEO</h2>
          <Field label="Meta açıklama (arama sonuçları)">
            <textarea
              value={settings.metaDescription}
              onChange={(e) => setSettings((s) => ({ ...s, metaDescription: e.target.value }))}
              rows={2}
              className={inputClass}
              placeholder="Site kısa açıklaması"
            />
          </Field>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 btn-theme rounded-2xl font-semibold disabled:opacity-50"
        >
          <FiSave className="w-5 h-5" />
          {saving ? 'Kaydediliyor...' : 'Ayarları kaydet'}
        </button>
      </form>
    </div>
  );
}
