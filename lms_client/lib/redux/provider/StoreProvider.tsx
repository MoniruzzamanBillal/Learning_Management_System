"use client";

import { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "../store";

export default function StoreProvider({ children }: { children: ReactNode }) {
  // Render the Provider with the store
  return <Provider store={store}>{children}</Provider>;
}
