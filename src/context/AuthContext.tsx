"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface User {
  email: string;
  role: "MEMBER" | "STAFF";
  nama: string;
  award_miles?: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = window.localStorage.getItem("aeromiles_user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as User;
        setUser(parsed);
      } catch {
        window.localStorage.removeItem("aeromiles_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData: User) => {
    window.localStorage.setItem("aeromiles_user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    window.localStorage.removeItem("aeromiles_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
