"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { hydrateCart } from "@/store/cartSlice";

export default function CartLoader() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const loadCart = async () => {
      const token = localStorage.getItem("token");

      if (!token) return;

      try {
        const res = await fetch("/api/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.status === 401) {
            localStorage.removeItem("token");
            return;
        }

        if (res.ok && data.items) {
          dispatch(hydrateCart(data.items));
        }
      } catch (error) {
        console.error("Failed to load cart", error);
      }
    };

    loadCart();
  }, [dispatch]);

  return null;
}