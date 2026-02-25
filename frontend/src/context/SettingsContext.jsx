import { createContext, useContext, useState, useEffect } from 'react';
import { getPublicSettings } from '../services/settingsService';

const defaults = {
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

const SettingsContext = createContext(defaults);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(defaults);

  useEffect(() => {
    getPublicSettings()
      .then((r) => setSettings({ ...defaults, ...r.data?.settings }))
      .catch(() => {});
  }, []);

  const value = { ...settings, setSettings };
  const primary = settings.primaryColor || '#b91c1c';
  const primaryHover = darkenHex(primary, 0.15);

  return (
    <SettingsContext.Provider value={value}>
      <div
        className="min-h-full"
        style={{
          ['--site-primary']: primary,
          ['--site-primary-hover']: primaryHover,
        }}
      >
        {children}
      </div>
    </SettingsContext.Provider>
  );
}

function darkenHex(hex, amount = 0.15) {
  if (!hex || typeof hex !== 'string') return '#b91c1c';
  hex = hex.replace(/^#/, '');
  if (hex.length !== 6 && hex.length !== 3) return hex;
  if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  const r = Math.max(0, Math.min(255, parseInt(hex.slice(0, 2), 16) * (1 - amount)));
  const g = Math.max(0, Math.min(255, parseInt(hex.slice(2, 4), 16) * (1 - amount)));
  const b = Math.max(0, Math.min(255, parseInt(hex.slice(4, 6), 16) * (1 - amount)));
  return '#' + [r, g, b].map((x) => Math.round(x).toString(16).padStart(2, '0')).join('');
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  return ctx || defaults;
}
