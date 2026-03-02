import { useEffect, useState } from 'react';
import { userService } from '../../services/api/users';
import { User } from '../../types';
import { UserForm } from '../../components/forms/UserForm';
import { DataTable } from '../../components/tables/DataTable';
import { Plus } from 'lucide-react';

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
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
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
      <DataTable<User>
        data={users}
        columns={[
          { key: 'username', label: 'Nom', sortable: true },
          { key: 'email', label: 'Email', sortable: true },
          { key: 'role', label: 'Rôle', render: (u) => u.role.name },
          { key: 'is_active', label: 'Actif', render: (u) => (u.is_active ? '✓' : '✗') },
        ]}
        searchFields={['username', 'email']}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
