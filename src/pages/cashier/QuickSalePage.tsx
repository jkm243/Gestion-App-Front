import { useState } from 'react';
import { productService } from '../../services/api/products';
import { Product } from '../../types';

export function QuickSalePage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const doSearch = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const list = await productService.searchProducts(query);
      setResults(list as Product[]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Vente rapide</h2>
      <div className="flex gap-2 mb-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un produit"
          className="border px-2 py-1 flex-1"
        />
        <button onClick={doSearch} className="bg-blue-600 text-white px-4 py-1 rounded">
          Rechercher
        </button>
      </div>
      {loading && <p>Recherche...</p>}
      <ul className="space-y-2">
        {results.map((p) => (
          <li key={p.id} className="border p-2 flex justify-between">
            <span>{p.name}</span>
            <span>{p.price} €</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
