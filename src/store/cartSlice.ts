import { getProductLimit } from "@/constants/productLimits";
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

const CART_KEY = "menmai_cart_state";

type CartState = {
  items: CartItem[];
};

const initialState: CartState = {
  items: [],
};

// ---------- utils ----------
const saveToStorage = (items: CartItem[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }
};

const clamp = (qty: number, max: number) => {
  if (qty < 1) return 1;
  if (qty > max) return max;
  return qty;
};

// ---------- slice ----------
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // ADD TO CART
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const incoming = action.payload;

      const existing = state.items.find(
        (item) => item.productId === incoming.productId,
      );

      const maxQty = getProductLimit(incoming.slug);

      if (existing) {
        const newQty = existing.quantity + incoming.quantity;
        existing.quantity = clamp(newQty, maxQty);
      } else {
        const quantity = clamp(incoming.quantity, maxQty);

        state.items.push({
          ...incoming,
          quantity,
        });
      }

      saveToStorage(state.items);
    },

    // SET QUANTITY
    setQuantity: (
      state,
      action: PayloadAction<{ productId: number; quantity: number }>,
    ) => {
      const item = state.items.find(
        (i) => i.productId === action.payload.productId,
      );

      if (!item) return;

      const maxQty = getProductLimit(item.slug);
      const qty = action.payload.quantity;

      if (qty <= 0) {
        state.items = state.items.filter(
          (i) => i.productId !== action.payload.productId,
        );
      } else {
        item.quantity = clamp(qty, maxQty);
      }

      saveToStorage(state.items);
    },

    // REMOVE ITEM
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(
        (item) => item.productId !== action.payload,
      );

      saveToStorage(state.items);
    },

    // CLEAR CART
    clearCart: (state) => {
      state.items = [];
      saveToStorage(state.items);
    },

    // HYDRATE CART
    hydrateCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload || [];
      saveToStorage(state.items);
    },
  },
});

export const {
  addToCart,
  setQuantity,
  removeFromCart,
  clearCart,
  hydrateCart,
} = cartSlice.actions;

export default cartSlice.reducer;

