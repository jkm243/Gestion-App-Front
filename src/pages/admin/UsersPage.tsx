import { useEffect, useState } from 'react';
import { userService } from '../../services/api/users';
import { User } from '../../types';

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    userService
      .getAllUsers()
      .then((res) => {
        setUsers(res.results || []);
      })
      .catch((err) => {
        console.error(err);
        setError('Impossible de charger la liste.');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Utilisateurs</h2>
      {loading && <p>Chargement…</p>}
      {error && <p className="text-red-600">{error}</p>}
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border">ID</th>
            <th className="py-2 px-4 border">Nom</th>
            <th className="py-2 px-4 border">Email</th>
            <th className="py-2 px-4 border">Rôle</th>
            <th className="py-2 px-4 border">Actif</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="text-center">
              <td className="py-2 px-4 border">{u.id}</td>
              <td className="py-2 px-4 border">{u.username}</td>
              <td className="py-2 px-4 border">{u.email}</td>
              <td className="py-2 px-4 border">{u.role.name}</td>
              <td className="py-2 px-4 border">{u.is_active ? 'Oui' : 'Non'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
