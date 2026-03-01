import { ShoppingCart, Barcode, Plus } from 'lucide-react';
import { useState } from 'react';

export function CashierDashboard() {
  const [cart, setCart] = useState<any[]>([]);
  const [barcode, setBarcode] = useState('');

  const handleAddToCart = (product: any) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

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
                  <Barcode className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    placeholder="Entrez le code-barres ou le nom du produit..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition">
                  Ajouter
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Produits disponibles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { id: 1, name: 'Produit 1', price: 25.99, stock: 10 },
                { id: 2, name: 'Produit 2', price: 15.50, stock: 25 },
                { id: 3, name: 'Produit 3', price: 35.00, stock: 5 },
                { id: 4, name: 'Produit 4', price: 12.99, stock: 100 },
              ].map((product) => (
                <div
                  key={product.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition"
                >
                  <div className="h-32 bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                    <ShoppingCart className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-600">Stock: {product.stock}</p>
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-lg font-bold text-gray-900">${product.price}</p>
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
              <p className="text-sm text-gray-600 mt-1">{cart.length} article(s)</p>
            </div>

            {/* Cart Items */}
            <div className="p-6 space-y-3 max-h-96 overflow-y-auto">
              {cart.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Panier vide</p>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-600">
                        {item.quantity} x ${item.price}
                      </p>
                    </div>
                    <p className="font-semibold text-gray-900">
                      ${(item.quantity * item.price).toFixed(2)}
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
                  <span className="font-medium">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">TVA (20%)</span>
                  <span className="font-medium">${(total * 0.2).toFixed(2)}</span>
                </div>
              </div>
              <div className="border-t pt-4 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-blue-600">${(total * 1.2).toFixed(2)}</span>
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
