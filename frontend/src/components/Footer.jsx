import { Link } from 'react-router-dom';
import { FiShield, FiTruck, FiCreditCard, FiRefreshCw } from 'react-icons/fi';
import { useSettings } from '../context/SettingsContext';
import { useTheme } from '../context/ThemeContext';

export default function Footer() {
  const {
    siteName,
    footerText,
    primaryColor,
    footerBgColor,
    footerTextColor,
    contactEmail,
    facebookUrl,
    twitterUrl,
    instagramUrl,
    showSocialLinks,
    footerSectionKurumsal,
    footerSectionYardim,
    footerSectionYasal,
    footerLabelAbout,
    footerLabelContact,
    footerLabelCampaigns,
    footerLabelSss,
    footerLabelIade,
    footerLabelTeslimat,
    footerLabelGizlilik,
    footerLabelKvkk,
    footerLabelKosullar,
    footerBadge1,
    footerBadge2,
    footerBadge3,
    footerBadge4,
    footerBottomText,
  } = useSettings();
  const { dark } = useTheme();
  const accent = primaryColor || '#b91c1c';
  const bg = footerBgColor || (dark ? '#030712' : '#111827');
  const textColor = footerTextColor || '#d1d5db';

  return (
    <footer
      className="mt-auto border-t-4 dark:border-opacity-80"
      style={{
        backgroundColor: bg,
        color: textColor,
        borderTopColor: accent,
      }}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap items-center justify-center gap-6 py-4 border-b text-sm" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <span className="flex items-center gap-2" style={{ color: textColor }}>
            <FiShield className="w-5 h-5 text-green-400" aria-hidden />
            {footerBadge1 || 'Güvenli ödeme (SSL)'}
          </span>
          <span className="flex items-center gap-2" style={{ color: textColor }}>
            <FiTruck className="w-5 h-5" style={{ color: accent }} aria-hidden />
            {footerBadge2 || 'Hızlı kargo'}
          </span>
          <span className="flex items-center gap-2" style={{ color: textColor }}>
            <FiRefreshCw className="w-5 h-5" aria-hidden />
            {footerBadge3 || 'Kolay iade'}
          </span>
          <span className="flex items-center gap-2" style={{ color: textColor }}>
            <FiCreditCard className="w-5 h-5" aria-hidden />
            {footerBadge4 || 'Taksit imkânı'}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-10">
          <div>
            <h3 className="font-extrabold text-lg mb-3" style={{ color: accent }}>{siteName || 'KairaMarkt'}</h3>
            <p className="text-sm leading-relaxed" style={{ color: textColor }}>
              {footerText || 'Teknoloji ve elektronik ürünlerde uygun fiyat, hızlı teslimat.'}
            </p>
            {contactEmail && (
              <p className="text-sm mt-3" style={{ color: textColor, opacity: 0.9 }}>{contactEmail}</p>
            )}
          </div>
          <div>
            <h4 className="font-medium mb-4" style={{ color: textColor }}>{footerSectionKurumsal || 'Kurumsal'}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/hakkimizda" className="hover:opacity-90 transition-opacity" style={{ color: accent }}>{footerLabelAbout || 'Hakkımızda'}</Link></li>
              <li><Link to="/iletisim" className="hover:opacity-90 transition-opacity" style={{ color: accent }}>{footerLabelContact || 'İletişim'}</Link></li>
              <li><Link to="/kampanyalar" className="hover:opacity-90 transition-opacity" style={{ color: accent }}>{footerLabelCampaigns || 'Kampanyalar'}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4" style={{ color: textColor }}>{footerSectionYardim || 'Yardım'}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/sss" className="hover:opacity-90 transition-opacity" style={{ color: accent }}>{footerLabelSss || 'SSS'}</Link></li>
              <li><Link to="/iade" className="hover:opacity-90 transition-opacity" style={{ color: accent }}>{footerLabelIade || 'İade'}</Link></li>
              <li><Link to="/teslimat" className="hover:opacity-90 transition-opacity" style={{ color: accent }}>{footerLabelTeslimat || 'Teslimat'}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4" style={{ color: textColor }}>{footerSectionYasal || 'Yasal'}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/gizlilik" className="hover:opacity-90 transition-opacity" style={{ color: accent }}>{footerLabelGizlilik || 'Gizlilik Politikası'}</Link></li>
              <li><Link to="/kvkk" className="hover:opacity-90 transition-opacity" style={{ color: accent }}>{footerLabelKvkk || 'KVKK'}</Link></li>
              <li><Link to="/kullanim-kosullari" className="hover:opacity-90 transition-opacity" style={{ color: accent }}>{footerLabelKosullar || 'Kullanım Koşulları'}</Link></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm pt-6" style={{ borderColor: 'rgba(255,255,255,0.1)', borderTopWidth: '1px', color: textColor, opacity: 0.8 }}>
          <p>© {new Date().getFullYear()} <span className="font-semibold" style={{ color: accent }}>{siteName || 'KairaMarkt'}</span> · Tüm hakları saklıdır.</p>
          {showSocialLinks && (facebookUrl || twitterUrl || instagramUrl) && (
            <div className="flex gap-4">
              {facebookUrl && <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="hover:opacity-90" style={{ color: accent }} aria-label="Facebook">Facebook</a>}
              {twitterUrl && <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="hover:opacity-90" style={{ color: accent }} aria-label="Twitter">Twitter</a>}
              {instagramUrl && <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:opacity-90" style={{ color: accent }} aria-label="Instagram">Instagram</a>}
            </div>
          )}
          {(!showSocialLinks || (!facebookUrl && !twitterUrl && !instagramUrl)) && <p>{footerBottomText || 'Güvenli alışveriş'}</p>}
        </div>
      </div>
    </footer>
  );
}
