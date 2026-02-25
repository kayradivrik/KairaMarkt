import { useSettings } from '../context/SettingsContext';
import { FiTool } from 'react-icons/fi';

export default function MaintenancePage() {
  const { siteName, primaryColor } = useSettings();
  const accent = primaryColor || '#b91c1c';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50 dark:bg-gray-900">
      <div className="text-center max-w-md">
        <div className="inline-flex p-4 rounded-full mb-6" style={{ backgroundColor: `${accent}20` }}>
          <FiTool className="w-16 h-16" style={{ color: accent }} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Bakım Çalışması</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {siteName || 'Sitemiz'} şu an güncelleniyor. Kısa süre içinde tekrar hizmetinizdeyiz.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
          Anlayışınız için teşekkür ederiz.
        </p>
      </div>
    </div>
  );
}
