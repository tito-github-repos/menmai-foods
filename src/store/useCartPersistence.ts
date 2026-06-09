"use client";

/**
 * Cart Persistence Hook
 * Manages localStorage sync for Redux cart state
 * SSR-safe for Next.js App Router
 */

import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "./hooks";
import { clearCart, addToCart } from "./cartSlice";
import type { CartItem } from "./cartSlice";

const CART_STORAGE_KEY = "menmai_cart_state";
const HYDRATION_TIMEOUT = 100; // ms to wait for hydration

export const useCartPersistence = () => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const hydrationDone = useRef(false);

  // ✅ Hydrate cart from localStorage on mount (client-side only)
  useEffect(() => {
    // Prevent running on server
    if (typeof window === "undefined") return;

    // Prevent double hydration
    if (hydrationDone.current) return;
    hydrationDone.current = true;

    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsedCart: CartItem[] = JSON.parse(savedCart);

        // Clear any existing cart and load from storage
        dispatch(clearCart());

        // Add each item back to cart
        parsedCart.forEach((item) => {
          dispatch(addToCart(item));
        });

        console.log("✅ Cart hydrated from localStorage:", parsedCart);
      }
    } catch (error) {
      console.error("❌ Failed to hydrate cart from localStorage:", error);
      // Silently fail - cart will be empty
    }
  }, [dispatch]);

  // ✅ Persist cart to localStorage whenever it changes
  useEffect(() => {
    // Prevent running on server
    if (typeof window === "undefined") return;

    // Skip persistence if hydration hasn't completed
    if (!hydrationDone.current) return;

    try {
      if (cartItems.length > 0) {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
        console.log("💾 Cart persisted to localStorage:", cartItems);
      } else {
        // Remove from storage if cart is empty
        localStorage.removeItem(CART_STORAGE_KEY);
        console.log("🗑️ Cart cleared from localStorage");
      }
    } catch (error) {
      console.error("❌ Failed to persist cart to localStorage:", error);
      // Silently fail - cart still works in memory
    }
  }, [cartItems]);
};

/**
 * Alternative: For components that only need to trigger hydration
 * without subscribing to cartItems changes
 */
export const useCartHydration = () => {
  const dispatch = useAppDispatch();
  const hydrationDone = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (hydrationDone.current) return;
    hydrationDone.current = true;

    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsedCart: CartItem[] = JSON.parse(savedCart);
        dispatch(clearCart());
        parsedCart.forEach((item) => {
          dispatch(addToCart(item));
        });
      }
    } catch (error) {
      console.error("Failed to hydrate cart:", error);
    }
  }, [dispatch]);
};
