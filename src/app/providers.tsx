// "use client";

// import { Provider } from "react-redux";
// import { store } from "@/store/store";
// import { CartHydrationWrapper } from "@/store/CartHydrationWrapper";

// export default function Providers({ children }: { children: React.ReactNode }) {
//   return (
//     <Provider store={store}>
//       <CartHydrationWrapper>{children}</CartHydrationWrapper>
//     </Provider>
//   );
// }

"use client";

import { Provider } from "react-redux";
import { store } from "@/store/store";
import { useEffect } from "react";
import { hydrateCart } from "@/store/cartSlice";

const CART_KEY = "menmai_cart";

function CartHydrator({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const data = localStorage.getItem(CART_KEY);

    if (data) {
      store.dispatch(hydrateCart(JSON.parse(data)));
    }
  }, []);

  return <>{children}</>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <CartHydrator>{children}</CartHydrator>
    </Provider>
  );
}
