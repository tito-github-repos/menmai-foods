"use client";

import { useEffect, useRef } from "react";
import { useAppSelector } from "@/store/hooks";

export default function CartSync() {
  const cartItems = useAppSelector((state) => state.cart.items);

  const firstRender = useRef(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    // Skip first render
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    const timer = setTimeout(async () => {
      try {
        if (cartItems.length === 0) {
          return;
        }

        const res = await fetch("/api/cart/sync", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            items: cartItems,
          }),
        });

        if (res.status === 401) {
          localStorage.removeItem("token");
        }
      } catch (error) {
        console.error("Cart sync failed", error);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [cartItems]);

  return null;
}
