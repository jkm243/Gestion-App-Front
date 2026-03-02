import { useEffect, useState } from 'react';
import { productService } from '../../services/api/products';
import { Product } from '../../types';
import { ProductForm } from '../../components/forms/ProductForm';
import { DataTable } from '../../components/tables/DataTable';
import { Plus } from 'lucide-react';

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
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
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
      <DataTable<Product>
        data={products}
        columns={[
          { key: 'name', label: 'Nom', sortable: true },
          { key: 'category', label: 'Catégorie', sortable: true },
          { key: 'price', label: 'Prix', sortable: true, render: (p) => `${p.price.toFixed(2)} €` },
          { key: 'quantity_in_stock', label: 'Stock', sortable: true },
          { key: 'is_active', label: 'Actif', render: (p) => (p.is_active ? '✓' : '✗') },
        ]}
        searchFields={['name', 'category']}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
