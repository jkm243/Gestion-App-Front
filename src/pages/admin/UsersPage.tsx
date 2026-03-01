import { useEffect, useState } from 'react';
import { userService } from '../../services/api/users';
import { User } from '../../types';
import { UserForm } from '../../components/forms/UserForm';
import { Edit2, Trash2, Plus } from 'lucide-react';

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>();

  const loadUsers = () => {
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
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr ?')) {
      try {
        await userService.deleteUser(id);
        setUsers(users.filter((u) => u.id !== id));
      } catch (err) {
        console.error(err);
        setError('Erreur lors de la suppression');
      }
    }
  };

  const handleSave = (user: User) => {
    loadUsers();
    setShowForm(false);
    setSelectedUser(undefined);
  };

  if (showForm) {
    return (
      <div className="p-6">
        <UserForm
          user={selectedUser}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setSelectedUser(undefined);
          }}
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Utilisateurs</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Ajouter
        </button>
      </div>
      {loading && <p>Chargement…</p>}
      {error && <p className="text-red-600">{error}</p>}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-2 px-4 border text-left">Nom</th>
              <th className="py-2 px-4 border text-left">Email</th>
              <th className="py-2 px-4 border text-left">Rôle</th>
              <th className="py-2 px-4 border text-center">Actif</th>
              <th className="py-2 px-4 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50 border-b">
                <td className="py-2 px-4">{u.username}</td>
                <td className="py-2 px-4">{u.email}</td>
                <td className="py-2 px-4">{u.role.name}</td>
                <td className="py-2 px-4 text-center">
                  <span className={u.is_active ? 'text-green-600' : 'text-red-600'}>
                    {u.is_active ? '✓' : '✗'}
                  </span>
                </td>
                <td className="py-2 px-4 text-center">
                  <button
                    onClick={() => handleEdit(u)}
                    className="p-1 hover:bg-blue-100 rounded transition"
                    title="Modifier"
                  >
                    <Edit2 className="w-4 h-4 text-blue-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(u.id)}
                    className="p-1 hover:bg-red-100 rounded transition"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
