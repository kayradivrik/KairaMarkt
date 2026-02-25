import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getUsers, updateUserRole } from '../../services/adminService';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getUsers(page, 10)
      .then((r) => {
        setUsers(r.data.users || []);
        setTotal(r.data.total || 0);
      })
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, [page]);

  const handleRoleChange = (userId, newRole) => {
    updateUserRole(userId, newRole)
      .then(() => { toast.success('Rol güncellendi'); load(); })
      .catch((e) => toast.error(e.message));
  };

  const totalPages = Math.ceil(total / 10) || 1;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Kullanıcılar</h1>
      {loading ? (
        <div className="flex justify-center py-12"><div className="w-10 h-10 border-2 border-theme border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <>
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="text-left p-3">Ad</th>
                  <th className="text-left p-3">E-posta</th>
                  <th className="text-left p-3">Rol</th>
                  <th className="text-right p-3">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-t border-gray-200 dark:border-gray-700">
                    <td className="p-3">{u.name}</td>
                    <td className="p-3">{u.email}</td>
                    <td className="p-3">{u.role}</td>
                    <td className="p-3 text-right">
                      <select value={u.role} onChange={(e) => handleRoleChange(u._id, e.target.value)} className="rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-2 py-1 text-sm">
                        <option value="user">user</option>
                        <option value="admin">admin</option>
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
