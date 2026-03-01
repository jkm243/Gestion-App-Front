import { useEffect, useState } from 'react';
import { productService } from '../../services/api/products';
import { Product } from '../../types';
import { ProductForm } from '../../components/forms/ProductForm';
import { Edit2, Trash2, Plus } from 'lucide-react';

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();

  const loadProducts = () => {
    setLoading(true);
    productService
      .getAllProducts()
      .then((res) => {
        setProducts(res.results || []);
      })
      .catch((err) => {
        console.error(err);
        setError('Impossible de charger les produits.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr ?')) {
      try {
        await productService.deleteProduct(id);
        setProducts(products.filter((p) => p.id !== id));
      } catch (err) {
        console.error(err);
        setError('Erreur lors de la suppression');
      }
    }
  };

  const handleSave = (product: Product) => {
    loadProducts();
    setShowForm(false);
    setSelectedProduct(undefined);
  };

  if (showForm) {
    return (
      <div className="p-6">
        <ProductForm
          product={selectedProduct}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setSelectedProduct(undefined);
          }}
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Produits</h2>
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
              <th className="py-2 px-4 border text-left">Catégorie</th>
              <th className="py-2 px-4 border text-right">Prix</th>
              <th className="py-2 px-4 border text-right">Stock</th>
              <th className="py-2 px-4 border text-center">Actif</th>
              <th className="py-2 px-4 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 border-b">
                <td className="py-2 px-4">{p.name}</td>
                <td className="py-2 px-4">{p.category}</td>
                <td className="py-2 px-4 text-right">{p.price.toFixed(2)} €</td>
                <td className="py-2 px-4 text-right">{p.quantity_in_stock}</td>
                <td className="py-2 px-4 text-center">
                  <span className={p.is_active ? 'text-green-600' : 'text-red-600'}>
                    {p.is_active ? '✓' : '✗'}
                  </span>
                </td>
                <td className="py-2 px-4 text-center">
                  <button
                    onClick={() => handleEdit(p)}
                    className="p-1 hover:bg-blue-100 rounded transition"
                    title="Modifier"
                  >
                    <Edit2 className="w-4 h-4 text-blue-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
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
