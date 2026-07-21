"use client";

/**
 * CartHydrationWrapper
 * Initializes cart persistence when app loads
 * Wraps the entire app to ensure hydration happens first
 */

import { ReactNode, useEffect } from "react";
import { useAppDispatch } from "./hooks";
import { clearCart, addToCart } from "./cartSlice";
import type { CartItem } from "./cartSlice";

const CART_STORAGE_KEY = "menmai_cart_state";

interface CartHydrationWrapperProps {
  children: ReactNode;
}

export function CartHydrationWrapper({
  children,
}: CartHydrationWrapperProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // ✅ Run only on client-side, only once on mount
    hydrateCarthFromStorage();
  }, []);

  const hydrateCarthFromStorage = () => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);

      if (savedCart) {
        const parsedCart: CartItem[] = JSON.parse(savedCart);

        // Validate cart data
        if (!Array.isArray(parsedCart) || parsedCart.length === 0) {
          localStorage.removeItem(CART_STORAGE_KEY);
          return;
        }

        // Clear current cart and hydrate from storage
        dispatch(clearCart());

        // Add each item back to Redux
        parsedCart.forEach((item) => {
          dispatch(
            addToCart({
              productId: item.productId,
              slug: item.slug,
              name: item.name,
              packLabel: item.packLabel,
              pieces: item.pieces,
              mrp: item.mrp,
              price: item.price,
              quantity: item.quantity,
              img: item.img,
            })
          );
        });
      }
    } catch (error) {
      console.error("❌ Failed to hydrate cart:", error);
      // Clear corrupted data and continue
      try {
        localStorage.removeItem(CART_STORAGE_KEY);
      } catch {
        // Silently fail
        console.error("❌ Failed to clear corrupted cart data");
      }
    }
  };

  return <>{children}</>;
}
