import { useSettings } from '../context/SettingsContext';

export default function AnnouncementBar() {
  const { announcementBarEnabled, announcementBarText, primaryColor } = useSettings();

  if (!announcementBarEnabled || !announcementBarText?.trim()) return null;

  return (
    <div
      className="text-center py-2 px-4 text-sm font-medium text-white"
      style={{ backgroundColor: primaryColor || '#b91c1c' }}
    >
      {announcementBarText}
    </div>
  );
}
