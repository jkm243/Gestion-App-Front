import { useEffect, useState } from 'react';
import { stockService } from '../../services/api/stocks';
import { locationService } from '../../services/api/locations';
import { productService } from '../../services/api/products';
import { Stock, CreateStockRequest, Location, Product } from '../../types';
import { DataTable } from '../../components/tables/DataTable';
import { Plus } from 'lucide-react';

export function StocksPage() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedStock, setSelectedStock] = useState<Stock | undefined>();
  const [formData, setFormData] = useState<CreateStockRequest>({
    product: '',
    location: '',
    quantity_on_hand: 0,
    quantity_reserved: 0,
    min_threshold: 0,
    critical_threshold: 0,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [stocksRes, locationsRes, productsRes] = await Promise.all([
        stockService.getAllStocks(),
        locationService.getAllLocations(),
        productService.getAllProducts(),
      ]);
      setStocks(stocksRes);
      setLocations(locationsRes);
      setProducts(productsRes);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Impossible de charger les données.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEdit = (stock: Stock) => {
    setSelectedStock(stock);
    setFormData({
      product: stock.product,
      location: stock.location,
      quantity_on_hand: stock.quantity_on_hand,
      quantity_reserved: stock.quantity_reserved,
      min_threshold: stock.min_threshold,
      critical_threshold: stock.critical_threshold,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr ?')) {
      try {
        await stockService.deleteStock(id);
        setStocks(stocks.filter((s) => s.id !== id));
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
      if (selectedStock) {
        await stockService.updateStock(selectedStock.id, formData);
      } else {
        await stockService.createStock(formData);
      }
      await loadData();
      setShowForm(false);
      setSelectedStock(undefined);
      setFormData({
        product: '',
        location: '',
        quantity_on_hand: 0,
        quantity_reserved: 0,
        min_threshold: 0,
        critical_threshold: 0,
      });
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
            {selectedStock ? 'Éditer le stock' : 'Nouveau stock'}
          </h3>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Produit *
              </label>
              <select
                value={formData.product || ''}
                onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Sélectionner --</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Emplacement *
              </label>
              <select
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Sélectionner --</option>
                {locations.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantité en stock *
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.quantity_on_hand}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity_on_hand: parseInt(e.target.value) || 0 })
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantité réservée
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.quantity_reserved}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity_reserved: parseInt(e.target.value) || 0 })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Seuil minimum *
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.min_threshold}
                  onChange={(e) =>
                    setFormData({ ...formData, min_threshold: parseInt(e.target.value) || 0 })
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Seuil critique *
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.critical_threshold}
                  onChange={(e) =>
                    setFormData({ ...formData, critical_threshold: parseInt(e.target.value) || 0 })
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
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
                  setSelectedStock(undefined);
                  setFormData({
                    product: '',
                    location: '',
                    quantity_on_hand: 0,
                    quantity_reserved: 0,
                    min_threshold: 0,
                    critical_threshold: 0,
                  });
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

  const getProductName = (productId: string) => {
    return products.find((p) => p.id === productId)?.name || 'N/A';
  };

  const getLocationName = (locationId: string) => {
    return locations.find((l) => l.id === locationId)?.name || 'N/A';
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Stocks</h2>
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
      <DataTable<Stock & { id: string }>
        data={stocks}
        columns={[
          {
            key: 'product',
            label: 'Produit',
            sortable: true,
            render: (_v, s) => getProductName(s.product),
          },
          {
            key: 'location',
            label: 'Emplacement',
            sortable: true,
            render: (_v, s) => getLocationName(s.location),
          },
          { key: 'quantity_on_hand', label: 'En stock', sortable: true },
          { key: 'quantity_reserved', label: 'Réservé' },
          { key: 'min_threshold', label: 'Seuil min' },
        ]}
        searchFields={[]}
        onEdit={handleEdit}
        onDelete={(stock) => handleDelete(stock.id as string)}
      />
    </div>
  );
}
