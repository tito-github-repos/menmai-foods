"use client";

import { useEffect } from "react";
import { useAppSelector } from "@/store/hooks";

export default function CartSync() {
  const cartItems = useAppSelector((state) => state.cart.items);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    const syncCart = async () => {
      try {
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
          console.log("Token expired. Removed from localStorage.");
        }
      } catch (error) {
        console.error("Cart sync failed", error);
      }
    };

    syncCart();
  }, [cartItems]);

  return null;
}