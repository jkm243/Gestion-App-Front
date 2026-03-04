import { useAppDispatch, useAppSelector } from '../../services/hooks';
import { removeFromCart, updateQuantity, clearCart } from '../../services/store/slices/cartSlice';
import { Trash2, Plus, Minus } from 'lucide-react';

export function CartPage() {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart);

  const handleIncrement = (productId: string, currentQty: number) => {
    dispatch(updateQuantity({ productId, quantity: currentQty + 1 }));
  };

  const handleDecrement = (productId: string, currentQty: number) => {
    if (currentQty > 1) {
      dispatch(updateQuantity({ productId, quantity: currentQty - 1 }));
    }
  };

  const handleRemove = (productId: string) => {
    dispatch(removeFromCart(productId));
  };

  const handleClear = () => {
    if (window.confirm('Vider le panier ?')) {
      dispatch(clearCart());
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Panier</h2>
        {cart.items.length > 0 && (
          <button
            onClick={handleClear}
            className="text-red-600 hover:text-red-800"
          >
            Vider le panier
          </button>
        )}
      </div>

      {cart.items.length === 0 ? (
        <p className="text-gray-500">Panier vide.</p>
      ) : (
        <>
          <div className="overflow-x-auto mb-6">
            <table className="w-full bg-white border">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-2 px-4 border text-left">Produit</th>
                  <th className="py-2 px-4 border text-right">Prix unit.</th>
                  <th className="py-2 px-4 border text-center">Quantité</th>
                  <th className="py-2 px-4 border text-right">Total</th>
                  <th className="py-2 px-4 border text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {cart.items.map((item) => (
                  <tr key={item.product.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-gray-500">{item.product.category}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">{item.product.price.toFixed(2)} €</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleDecrement(item.product.id, item.quantity)}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          readOnly
                          className="w-12 text-center border rounded"
                        />
                        <button
                          onClick={() => handleIncrement(item.product.id, item.quantity)}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-medium">
                      {(item.product.price * item.quantity).toFixed(2)} €
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleRemove(item.product.id)}
                        className="p-1 hover:bg-red-100 rounded transition"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end">
            <div className="w-full max-w-sm bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Résumé</h3>
              <div className="space-y-2 mb-4 pb-4 border-b">
                <div className="flex justify-between text-sm">
                  <span>Articles:</span>
                  <span>{cart.items.reduce((sum, item) => sum + item.quantity, 0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Sous-total:</span>
                  <span>{cart.total.toFixed(2)} €</span>
                </div>
              </div>
              <div className="flex justify-between mb-4">
                <span className="font-semibold">Total:</span>
                <span className="text-2xl font-bold text-blue-600">{cart.total.toFixed(2)} €</span>
              </div>
              <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition font-semibold">
                Procéder au paiement
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
