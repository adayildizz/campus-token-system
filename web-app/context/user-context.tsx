// src/context/UserContext.tsx
"use client";

import { createContext, useState, ReactNode } from "react";
import { UserEntry } from "@/app/types/user";
// 1. Define the shape of the context value
interface UserContextType {
  user: UserEntry | null;
  setUser: React.Dispatch<React.SetStateAction<UserEntry | null>>;
}

// 2. Create the context with a default value
export const UserContext = createContext<UserContextType | null>(null);

// 3. Create the provider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserEntry | null>(null);

  const value = { user, setUser };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};