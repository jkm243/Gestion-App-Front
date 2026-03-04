import { useEffect, useState } from 'react';
import { customerService } from '../../services/api/customers';
import { Customer, CreateCustomerRequest } from '../../types';
import { DataTable } from '../../components/tables/DataTable';
import { Plus } from 'lucide-react';

export function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | undefined>();
  const [formData, setFormData] = useState<CreateCustomerRequest>({});

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const res = await customerService.getAllCustomers();
      setCustomers(res);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Impossible de charger la liste des clients.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setFormData(customer);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr ?')) {
      try {
        await customerService.deleteCustomer(id);
        setCustomers(customers.filter((c) => c.id !== id));
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Erreur lors de la suppression');
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedCustomer) {
        await customerService.updateCustomer(selectedCustomer.id, formData);
      } else {
        await customerService.createCustomer(formData);
      }
      await loadCustomers();
      setShowForm(false);
      setSelectedCustomer(undefined);
      setFormData({});
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Erreur lors de la sauvegarde');
    }
  };

  if (showForm) {
    return (
      <div className="p-6">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">
            {selectedCustomer ? 'Éditer le client' : 'Nouveau client'}
          </h3>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone
              </label>
              <input
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adresse
              </label>
              <textarea
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_active !== false}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="h-4 w-4 text-blue-600"
              />
              <label className="ml-2 text-sm font-medium text-gray-700">Actif</label>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Enregistrer
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setSelectedCustomer(undefined);
                  setFormData({});
                }}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Clients</h2>
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
      <DataTable<Customer & { id: string }>
        data={customers}
        columns={[
          { key: 'name', label: 'Nom', sortable: true },
          { key: 'email', label: 'Email', sortable: true },
          { key: 'phone', label: 'Téléphone' },
          { key: 'is_active', label: 'Actif', render: (c) => (c.is_active ? '✓' : '✗') },
        ]}
        searchFields={['name', 'email']}
        onEdit={handleEdit}
        onDelete={(customer) => handleDelete(customer.id as string)}
      />
    </div>
  );
}
