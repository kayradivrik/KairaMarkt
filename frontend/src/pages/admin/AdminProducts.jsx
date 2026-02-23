import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getAdminProducts, deleteProduct, updateStock } from '../../services/adminService';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [editingStock, setEditingStock] = useState(null);

  const load = () => {
    setLoading(true);
    getAdminProducts(page, 10)
      .then((r) => {
        setProducts(r.data.products || []);
        setTotal(r.data.total || 0);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, [page]);

  const handleDelete = (id, name) => {
    if (!window.confirm(`"${name}" ürününü silmek istediğinize emin misiniz?`)) return;
    deleteProduct(id)
      .then(() => { toast.success('Silindi'); load(); })
      .catch((e) => toast.error(e.message));
  };

  const handleStockSave = (id, value) => {
    updateStock(id, parseInt(value, 10))
      .then(() => { toast.success('Stok güncellendi'); setEditingStock(null); load(); })
      .catch((e) => toast.error(e.message));
  };

  const totalPages = Math.ceil(total / 10) || 1;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Ürünler</h1>
        <Link to="/admin/urunler/yeni" className="px-4 py-2 bg-brand-500 text-white rounded-2xl hover:bg-brand-600 text-sm font-semibold">Yeni Ürün</Link>
      </div>
      {loading ? (
        <div className="flex justify-center py-12"><div className="w-10 h-10 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <>
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="text-left p-3">Görsel</th>
                  <th className="text-left p-3">Ürün</th>
                  <th className="text-left p-3">Fiyat</th>
                  <th className="text-left p-3">Stok</th>
                  <th className="text-left p-3">Durum</th>
                  <th className="text-right p-3">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id} className="border-t border-gray-200 dark:border-gray-700">
                    <td className="p-3"><div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden">{p.images?.[0] ? <img src={p.images[0]} alt="" className="w-full h-full object-cover" /> : null}</div></td>
                    <td className="p-3 font-medium">{p.name}</td>
                    <td className="p-3">{p.discountPrice ?? p.price} ₺</td>
                    <td className="p-3">
                      {editingStock === p._id ? (
                        <input type="number" defaultValue={p.stock} min="0" className="w-20 rounded border px-2 py-1" onBlur={(e) => handleStockSave(p._id, e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleStockSave(p._id, e.target.value)} autoFocus />
                      ) : (
                        <button type="button" onClick={() => setEditingStock(p._id)} className="underline">{p.stock}</button>
                      )}
                    </td>
                    <td className="p-3">{p.isActive ? 'Aktif' : 'Pasif'}</td>
                    <td className="p-3 text-right">
                      <Link to={`/admin/urunler/${p._id}`} className="text-brand-600 mr-2">Düzenle</Link>
                      <button type="button" onClick={() => handleDelete(p._id, p.name)} className="text-brand-600">Sil</button>
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
