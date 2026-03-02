import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, Product } from '../../types';
import { encryptionService } from '../../utils/encryptionService';

export interface CartState {
  items: CartItem[];
  total: number;
}

const initialState: CartState = {
  items: [],
  total: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: () => {
    // Load from encrypted localStorage if available
    const saved = encryptionService.getEncrypted('cart');
    return saved || initialState;
  },
  reducers: {
    addToCart(state, action: PayloadAction<{ product: Product; quantity: number }>) {
      const { product, quantity } = action.payload;
      const existing = state.items.find((i) => i.product.id === product.id);
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({ product, quantity });
      }
      state.total = state.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      encryptionService.setEncrypted('cart', state);
    },
    removeFromCart(state, action: PayloadAction<number>) {
      state.items = state.items.filter((i) => i.product.id !== action.payload);
      state.total = state.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      encryptionService.setEncrypted('cart', state);
    },
    updateQuantity(state, action: PayloadAction<{ productId: number; quantity: number }>) {
      const item = state.items.find((i) => i.product.id === action.payload.productId);
      if (item) {
        item.quantity = Math.max(1, action.payload.quantity);
      }
      state.total = state.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      encryptionService.setEncrypted('cart', state);
    },
    clearCart(state) {
      state.items = [];
      state.total = 0;
      encryptionService.removeEncrypted('cart');
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
