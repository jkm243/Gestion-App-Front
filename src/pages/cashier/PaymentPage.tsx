import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import { clearCart } from '../../services/store/slices/cartSlice';
import { saleService } from '../../services/api/sales';
import { CartItem, CreateSaleRequest } from '../../types';
import { AlertCircle, CheckCircle, CreditCard, Banknote } from 'lucide-react';

export function PaymentPage() {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart);
  const auth = useAppSelector((state) => state.auth);
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CARD' | 'TRANSFER'>('CASH');
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handlePayment = async () => {
    if (!auth.user || cart.items.length === 0) {
      setStatus('error');
      setMessage('Panier vide ou utilisateur non authentifié');
      return;
    }

    setIsProcessing(true);
    try {
      // Create sale data matching API
      const saleData: CreateSaleRequest = {
        customer: auth.user?.id || '', // Use authenticated user ID or empty string
        items_data: cart.items.map((item: CartItem) => ({
          product: item.product.id,
          quantity: item.quantity,
          unit_price: item.product.unit_price || '0',
        })),
      };

      const sale = await saleService.createSale(saleData);
      console.log('Sale created:', sale);

      // Complete the sale with payment method
      await saleService.completeSale(sale.id);
      console.log('Sale completed');

      setStatus('success');
      setMessage('Paiement effectué avec succès !');
      dispatch(clearCart());
      
      setTimeout(() => {
        setStatus('idle');
      }, 3000);
    } catch (err: unknown) {
      console.error('Payment error:', err);
      setStatus('error');
      setMessage((err as { message?: string })?.message || 'Erreur lors du paiement');
    } finally {
      setIsProcessing(false);
    }
  };

  if (status === 'success') {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="bg-white rounded-lg shadow p-8 text-center max-w-sm">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Paiement réussi !</h2>
          <p className="text-gray-600 mb-6">{message}</p>
          <button
            onClick={() => setStatus('idle')}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Nouvelle vente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Paiement</h2>

      {status === 'error' && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-700">{message}</p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        {/* Résumé du panier */}
        <div className="col-span-2">
          <div className="bg-white rounded-lg border p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Récapitulatif de la commande</h3>
            {cart.items.length === 0 ? (
              <p className="text-gray-500">Panier vide</p>
            ) : (
              <>
                <div className="space-y-3 mb-4">
                  {cart.items.map((item: CartItem) => (
                    <div key={item.product.id} className="flex justify-between text-sm">
                      <span>{item.product.name} x{item.quantity}</span>
                      <span className="font-medium">
                        {(parseFloat(item.product.unit_price || '0') * item.quantity).toFixed(2)} €
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total:</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {cart.total.toFixed(2)} €
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Formulaire de paiement */}
        <div>
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Mode de paiement</h3>

            <div className="space-y-3 mb-6">
              <label className="flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  value="CASH"
                  checked={paymentMethod === 'CASH'}
                  onChange={(e) => setPaymentMethod(e.target.value as 'CASH')}
                  className="w-4 h-4"
                />
                <div className="flex items-center gap-2">
                  <Banknote className="w-5 h-5 text-gray-600" />
                  <span>Espèces</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  value="CARD"
                  checked={paymentMethod === 'CARD'}
                  onChange={(e) => setPaymentMethod(e.target.value as 'CARD')}
                  className="w-4 h-4"
                />
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-gray-600" />
                  <span>Carte bancaire</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  value="TRANSFER"
                  checked={paymentMethod === 'TRANSFER'}
                  onChange={(e) => setPaymentMethod(e.target.value as 'TRANSFER')}
                  className="w-4 h-4"
                />
                <div className="flex items-center gap-2">
                  <span>Virement</span>
                </div>
              </label>
            </div>

            <button
              onClick={handlePayment}
              disabled={isProcessing || cart.items.length === 0}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition font-semibold flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Traitement...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Payer {cart.total.toFixed(2)} €
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
