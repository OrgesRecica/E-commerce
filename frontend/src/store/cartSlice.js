import { createSlice } from '@reduxjs/toolkit';

const saved = localStorage.getItem('cart');

const slice = createSlice({
  name: 'cart',
  initialState: { items: saved ? JSON.parse(saved) : [] },
  reducers: {
    addItem(state, { payload }) {
      const existing = state.items.find((i) => i.productId === payload.productId);
      if (existing) existing.quantity += payload.quantity || 1;
      else state.items.push({ ...payload, quantity: payload.quantity || 1 });
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    removeItem(state, { payload }) {
      state.items = state.items.filter((i) => i.productId !== payload);
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    updateQty(state, { payload }) {
      const item = state.items.find((i) => i.productId === payload.productId);
      if (item) item.quantity = Math.max(1, payload.quantity);
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    clear(state) {
      state.items = [];
      localStorage.removeItem('cart');
    },
  },
});

export const { addItem, removeItem, updateQty, clear } = slice.actions;
export default slice.reducer;
