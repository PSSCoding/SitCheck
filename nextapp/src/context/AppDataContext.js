"use client";

import { createContext, useContext } from "react";

export const AppDataContext = createContext(null);

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error("useAppData must be used within an AppDataContext provider");
  }
  return context;
}
