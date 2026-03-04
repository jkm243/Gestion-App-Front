import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import { addToCart } from '../../services/store/slices/cartSlice';
import { productService } from '../../services/api';
import { Product, CartItem } from '../../types';
import { Search, ShoppingCart } from 'lucide-react';

export function QuickSalePage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart);

  const doSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const list = await productService.getAllProducts(query);
      setResults((list as Product[]) || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart({ product, quantity: 1 }));
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-3 gap-6">
        {/* Recherche */}
        <div className="col-span-2">
          <h2 className="text-2xl font-semibold mb-4">Vente rapide</h2>
          <div className="flex gap-2 mb-4">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && doSearch()}
              placeholder="Rechercher par nom, catégorie ou code-barres"
              className="border px-3 py-2 flex-1 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button
              onClick={doSearch}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              {loading ? 'Recherche...' : 'Chercher'}
            </button>
          </div>

          {/* Résultats */}
          <div className="grid grid-cols-2 gap-3">
            {results.map((p) => (
              <div key={p.id} className="border rounded p-3 hover:shadow-md transition">
                <h3 className="font-medium truncate">{p.name}</h3>
                <p className="text-sm text-gray-500">{p.category}</p>
                <p className="text-lg font-semibold text-blue-600 my-1">{parseFloat(p.unit_price || '0').toFixed(2)} €</p>
                <p className="text-xs text-gray-500 mb-2">Stock: --</p>
                <button
                  onClick={() => handleAddToCart(p)}
                  className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Ajouter
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Résumé du panier */}
        <div className="col-span-1">
          <div className="bg-white border rounded-lg p-4 sticky top-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Panier ({cart.items.length})
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto mb-4">
              {cart.items.length === 0 ? (
                <p className="text-gray-500 text-sm">Panier vide</p>
              ) : (
                cart.items.map((item: CartItem) => (
                  <div key={item.product.id} className="text-sm border-b pb-2">
                    <p className="font-medium truncate">{item.product.name}</p>
                    <p className="text-gray-600">
                      {item.quantity} x {parseFloat(item.product.unit_price || '0').toFixed(2)} €
                    </p>
                  </div>
                ))
              )}
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total:</span>
                <span className="text-xl font-bold text-blue-600">{cart.total.toFixed(2)} €</span>
              </div>
              <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                Continuer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
