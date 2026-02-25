import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getAdminOrders, updateOrderStatus, bulkUpdateOrderStatus, exportOrdersCsv } from '../../services/adminService';

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const STATUS_LABEL = { pending: 'Beklemede', processing: 'Hazırlanıyor', shipped: 'Kargoda', delivered: 'Teslim edildi', cancelled: 'İptal' };

export default function AdminOrders() {
  const [searchParams] = useSearchParams();
  const statusFilter = searchParams.get('status') || '';
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [bulkStatus, setBulkStatus] = useState('');
  const [exporting, setExporting] = useState(false);

  const load = () => {
    setLoading(true);
    getAdminOrders(page, 10, statusFilter)
      .then((r) => {
        setOrders(r.data.orders || []);
        setTotal(r.data.total || 0);
      })
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, [page, statusFilter]);

  const handleStatusChange = (orderId, status) => {
    updateOrderStatus(orderId, status)
      .then(() => { toast.success('Durum güncellendi'); load(); })
      .catch((e) => toast.error(e.message));
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === orders.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(orders.map((o) => o._id)));
  };

  const handleBulkStatus = () => {
    if (!bulkStatus || selectedIds.size === 0) return;
    bulkUpdateOrderStatus([...selectedIds], bulkStatus)
      .then((r) => { toast.success(`${r.data?.modifiedCount ?? 0} sipariş güncellendi`); setSelectedIds(new Set()); setBulkStatus(''); load(); })
      .catch((e) => toast.error(e.message));
  };

  const handleExportCsv = () => {
    setExporting(true);
    exportOrdersCsv()
      .then((res) => {
        const blob = new Blob([res.data], { type: 'text/csv;charset=utf-8;' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `siparisler-${Date.now()}.csv`;
        a.click();
        URL.revokeObjectURL(a.href);
        toast.success('CSV indirildi');
      })
      .catch((e) => toast.error(e.message))
      .finally(() => setExporting(false));
  };

  const totalPages = Math.ceil(total / 10) || 1;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Siparişler</h1>
        <div className="flex flex-wrap items-center gap-2">
          {statusFilter && (
            <span className="text-sm text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/30 px-3 py-1 rounded-lg">
              Filtre: {STATUS_LABEL[statusFilter] || statusFilter}
            </span>
          )}
          <button type="button" onClick={handleExportCsv} disabled={exporting} className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-sm font-medium disabled:opacity-50">
            {exporting ? 'İndiriliyor...' : 'CSV İndir'}
          </button>
        </div>
      </div>
      {selectedIds.size > 0 && (
        <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-xl flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium">{selectedIds.size} sipariş seçildi</span>
          <select value={bulkStatus} onChange={(e) => setBulkStatus(e.target.value)} className="rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-2 py-1 text-sm">
            <option value="">Durum seçin</option>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
          </select>
          <button type="button" onClick={handleBulkStatus} disabled={!bulkStatus} className="px-3 py-1.5 btn-theme rounded-lg text-sm font-medium disabled:opacity-50">Toplu güncelle</button>
          <button type="button" onClick={() => setSelectedIds(new Set())} className="px-3 py-1.5 border rounded-lg text-sm">İptal</button>
        </div>
      )}
      {loading ? (
        <div className="flex justify-center py-12"><div className="w-10 h-10 border-2 border-theme border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <>
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="text-left p-3 w-10">
                    <input type="checkbox" checked={orders.length > 0 && selectedIds.size === orders.length} onChange={toggleSelectAll} aria-label="Tümünü seç" />
                  </th>
                  <th className="text-left p-3">Sipariş</th>
                  <th className="text-left p-3">Müşteri</th>
                  <th className="text-left p-3">Toplam</th>
                  <th className="text-left p-3">Durum</th>
                  <th className="text-right p-3">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id} className="border-t border-gray-200 dark:border-gray-700">
                    <td className="p-3">
                      <input type="checkbox" checked={selectedIds.has(o._id)} onChange={() => toggleSelect(o._id)} aria-label={`Sipariş ${o._id} seç`} />
                    </td>
                    <td className="p-3">#{o._id?.slice(-8)}</td>
                    <td className="p-3">{o.user?.name} ({o.user?.email})</td>
                    <td className="p-3">{o.total?.toLocaleString('tr-TR')} ₺</td>
                    <td className="p-3">{STATUS_LABEL[o.status] || o.status}</td>
                    <td className="p-3 text-right">
                      <select value={o.status} onChange={(e) => handleStatusChange(o._id, e.target.value)} className="rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-2 py-1 text-sm">
                        {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
                      </select>
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
