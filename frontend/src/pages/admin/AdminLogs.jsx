import { useState, useEffect } from 'react';
import { getAdminLogs } from '../../services/adminService';

export default function AdminLogs() {
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getAdminLogs(page, 20)
      .then((r) => {
        setLogs(r.data.logs || []);
        setTotal(r.data.total || 0);
      })
      .catch(() => setLogs([]))
      .finally(() => setLoading(false));
  }, [page]);

  const totalPages = Math.ceil(total / 20) || 1;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Logları</h1>
      {loading ? (
        <div className="flex justify-center py-12"><div className="w-10 h-10 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <>
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="text-left p-3">Tarih</th>
                  <th className="text-left p-3">Admin</th>
                  <th className="text-left p-3">İşlem</th>
                  <th className="text-left p-3">Hedef</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((l) => (
                  <tr key={l._id} className="border-t border-gray-200 dark:border-gray-700">
                    <td className="p-3">{new Date(l.createdAt).toLocaleString('tr-TR')}</td>
                    <td className="p-3">{l.admin?.name} ({l.admin?.email})</td>
                    <td className="p-3">{l.action}</td>
                    <td className="p-3">{l.target}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-4 py-2 border rounded disabled:opacity-50">Önceki</button>
              <span className="px-4 py-2">{page} / {totalPages}</span>
              <button type="button" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="px-4 py-2 border rounded disabled:opacity-50">Sonraki</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
