import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type CartItem = {
  productId: number;
  slug: string;
  name: string;
  packLabel: string;
  pieces: number;
  mrp: number;
  price: number;
  quantity: number;
  img: string;
};

const CART_KEY = "menmai_cart";

type CartState = {
  items: CartItem[];
};

const initialState: CartState = {
  items: [],
};

const saveToStorage = (items: CartItem[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find(
        (item) => item.productId === action.payload.productId,
      );

      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }

      saveToStorage(state.items);
    },

    setQuantity: (
      state,
      action: PayloadAction<{ productId: number; quantity: number }>,
    ) => {
      if (action.payload.quantity <= 0) {
        state.items = state.items.filter(
          (item) => item.productId !== action.payload.productId,
        );
        return;
      }

      const item = state.items.find(
        (item) => item.productId === action.payload.productId,
      );

      if (item) item.quantity = action.payload.quantity;

      saveToStorage(state.items);
    },

    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(
        (item) => item.productId !== action.payload,
      );
      saveToStorage(state.items);
    },

    clearCart: (state) => {
      state.items = [];
      saveToStorage(state.items);
    },

    hydrateCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
  },
});

export const { addToCart, setQuantity, removeFromCart, clearCart, hydrateCart } =
  cartSlice.actions;

export default cartSlice.reducer;

