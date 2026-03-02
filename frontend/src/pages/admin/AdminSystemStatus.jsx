import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiActivity } from 'react-icons/fi';
import { getSystemStatus } from '../../services/adminService';

export default function AdminSystemStatus() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSystemStatus()
      .then((r) => setServices(r.data.services || []))
      .catch(() => {
        toast.error('Sistem durumu alınamadı');
        setServices([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <FiActivity className="w-6 h-6 text-theme" />
          Sistem durumu
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          API, veritabanı ve arka plan işlerinizin sağlığını gösteren basit bir durum ekranı.
        </p>
      </header>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-2 border-theme border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(services.length ? services : [
            { key: 'api', label: 'API', status: 'unknown' },
            { key: 'db', label: 'Veritabanı', status: 'unknown' },
            { key: 'jobs', label: 'Arka plan işler', status: 'unknown' },
          ]).map((svc) => (
            <div
              key={svc.key}
              className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{svc.label}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Sağlık bilgisi backend&apos;den gelmektedir.
                </p>
              </div>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                {svc.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

