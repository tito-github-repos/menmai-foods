import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type CartItem = {
  id: string;
  name: string;
  packLabel: string;
  pieces: number;
  mrp: number;
  price: number;
  quantity: number;
  img: string;
};

type CartState = {
  items: CartItem[];
};

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find((item) => item.id === action.payload.id);

      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },

    setQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      if (action.payload.quantity <= 0) {
        state.items = state.items.filter((item) => item.id !== action.payload.id);
        return;
      }

      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) item.quantity = action.payload.quantity;
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },

    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, setQuantity, removeFromCart, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;