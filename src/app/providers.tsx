"use client";

import { Provider } from "react-redux";
import { store } from "@/store/store";
import { useEffect } from "react";
import { hydrateCart } from "@/store/cartSlice";
import CartLoader from "@/store/CartLoader";
import CartSync from "@/store/CartSync";

const CART_KEY = "menmai_cart";

function CartHydrator({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    async function loadCart() {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const res = await fetch("/api/cart", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (res.ok) {
            const data = await res.json();

            store.dispatch(hydrateCart(data.items));

            localStorage.setItem(CART_KEY, JSON.stringify(data.items));

            return;
          }
        } catch (error) {
          console.error("Failed to load DB cart", error);
        }
      }

      const data = localStorage.getItem(CART_KEY);

      if (data) {
        store.dispatch(hydrateCart(JSON.parse(data)));
      }
    }

    loadCart();
  }, []);
  return <>{children}</>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <CartHydrator>
        <CartLoader />
        <CartSync />
        {children}
      </CartHydrator>
    </Provider>
  );
}
