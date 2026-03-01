import { useState } from 'react';
import { CartItem } from '../../types';

// temporary in-memory cart
const initialCart: CartItem[] = [];

export function CartPage() {
  const [cart, setCart] = useState<CartItem[]>(initialCart);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Panier</h2>
      {cart.length === 0 ? (
        <p>Panier vide.</p>
      ) : (
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border">Produit</th>
              <th className="py-2 px-4 border">Quantité</th>
              <th className="py-2 px-4 border">Prix</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item, idx) => (
              <tr key={idx} className="text-center">
                <td className="py-2 px-4 border">{item.product.name}</td>
                <td className="py-2 px-4 border">{item.quantity}</td>
                <td className="py-2 px-4 border">{item.product.price * item.quantity} €</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
