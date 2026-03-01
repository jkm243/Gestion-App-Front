import { useEffect, useState } from 'react';
import { productService } from '../../services/api/products';
import { Product } from '../../types';

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Produits</h2>
      {loading && <p>Chargement…</p>}
      {error && <p className="text-red-600">{error}</p>}
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border">ID</th>
            <th className="py-2 px-4 border">Nom</th>
            <th className="py-2 px-4 border">Prix</th>
            <th className="py-2 px-4 border">Stock</th>
            <th className="py-2 px-4 border">Actif</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="text-center">
              <td className="py-2 px-4 border">{p.id}</td>
              <td className="py-2 px-4 border">{p.name}</td>
              <td className="py-2 px-4 border">{p.price} €</td>
              <td className="py-2 px-4 border">{p.quantity_in_stock}</td>
              <td className="py-2 px-4 border">{p.is_active ? 'Oui' : 'Non'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
