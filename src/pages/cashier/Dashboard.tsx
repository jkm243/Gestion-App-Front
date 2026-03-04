import { ShoppingCart, Plus, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import { productService } from '../../services/api/products';
import { addToCart } from '../../services/store/slices/cartSlice';
import { Product } from '../../types';

export function CashierDashboard() {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart);
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const data = await productService.getAllProducts(searchTerm);
        setProducts(data);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [searchTerm]);

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart({ product, quantity: 1 }));
  };

  return (
    <div className="p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Search Bar */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Vente Rapide</h1>
            <div className="bg-white rounded-lg shadow p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rechercher ou scanner un produit
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Rechercher un produit..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Produits disponibles</h2>
            {loading ? (
              <p>Chargement...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition"
                  >
                    <div className="h-32 bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                      <ShoppingCart className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="font-semibold text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-600">Prix: {product.unit_price} €</p>
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-lg font-bold text-gray-900">{product.unit_price} €</p>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Shopping Cart Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow sticky top-8">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Panier
              </h2>
              <p className="text-sm text-gray-600 mt-1">{cart.items.length} article(s)</p>
            </div>

            {/* Cart Items */}
            <div className="p-6 space-y-3 max-h-96 overflow-y-auto">
              {cart.items.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Panier vide</p>
              ) : (
                cart.items.map((item: { product: Product; quantity: number }) => (
                  <div
                    key={item.product.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.product.name}</p>
                      <p className="text-xs text-gray-600">
                        {item.quantity} x {item.product.unit_price} €
                      </p>
                    </div>
                    <p className="font-semibold text-gray-900">
                      {(parseFloat(item.product.unit_price || '0') * item.quantity).toFixed(2)} €
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Total */}
            <div className="p-6 border-t border-gray-200 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sous-total</span>
                  <span className="font-medium">{cart.total.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">TVA (20%)</span>
                  <span className="font-medium">{(cart.total * 0.2).toFixed(2)} €</span>
                </div>
              </div>
              <div className="border-t pt-4 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-blue-600">{(cart.total * 1.2).toFixed(2)} €</span>
              </div>
              <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition">
                Passer au paiement
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
