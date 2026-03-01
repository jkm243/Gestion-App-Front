import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, Product } from '../../types';

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
    // Load from localStorage if available
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : initialState;
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
      localStorage.setItem('cart', JSON.stringify(state));
    },
    removeFromCart(state, action: PayloadAction<number>) {
      state.items = state.items.filter((i) => i.product.id !== action.payload);
      state.total = state.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      localStorage.setItem('cart', JSON.stringify(state));
    },
    updateQuantity(state, action: PayloadAction<{ productId: number; quantity: number }>) {
      const item = state.items.find((i) => i.product.id === action.payload.productId);
      if (item) {
        item.quantity = Math.max(1, action.payload.quantity);
      }
      state.total = state.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      localStorage.setItem('cart', JSON.stringify(state));
    },
    clearCart(state) {
      state.items = [];
      state.total = 0;
      localStorage.removeItem('cart');
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
