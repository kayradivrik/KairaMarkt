import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getAdminReviews, deleteReview } from '../../services/adminService';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getAdminReviews(page, 10)
      .then((r) => {
        setReviews(r.data.reviews || []);
        setTotal(r.data.total || 0);
      })
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, [page]);

  const handleDelete = (id) => {
    if (!window.confirm('Bu yorumu silmek istediğinize emin misiniz?')) return;
    deleteReview(id)
      .then(() => { toast.success('Silindi'); load(); })
      .catch((e) => toast.error(e.message));
  };

  const totalPages = Math.ceil(total / 10) || 1;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Yorumlar</h1>
      {loading ? (
        <div className="flex justify-center py-12"><div className="w-10 h-10 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <>
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="text-left p-3">Ürün</th>
                  <th className="text-left p-3">Kullanıcı</th>
                  <th className="text-left p-3">Puan</th>
                  <th className="text-left p-3">Yorum</th>
                  <th className="text-right p-3">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((r) => (
                  <tr key={r._id} className="border-t border-gray-200 dark:border-gray-700">
                    <td className="p-3">{r.product?.name}</td>
                    <td className="p-3">{r.user?.name} ({r.user?.email})</td>
                    <td className="p-3">★ {r.rating}</td>
                    <td className="p-3 max-w-xs truncate">{r.comment || '-'}</td>
                    <td className="p-3 text-right">
                      <button type="button" onClick={() => handleDelete(r._id)} className="text-brand-600">Sil</button>
                    </td>
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
