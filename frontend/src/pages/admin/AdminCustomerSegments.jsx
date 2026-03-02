import { FiUsers } from 'react-icons/fi';

export default function AdminCustomerSegments() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <FiUsers className="w-6 h-6 text-theme" />
          Müşteri segmentleri
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Sık alışveriş yapanlar, yüksek sepet ortalaması olanlar gibi segmentleri burada yönetebilirsiniz.
        </p>
      </header>

      <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <div className="h-40 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center text-xs text-gray-400 dark:text-gray-500">
          Segment listesi (placeholder)
        </div>
      </div>
    </div>
  );
}

