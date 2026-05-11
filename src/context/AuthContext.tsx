"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface User {
  email: string;
  role: "Member" | "Staff";
  nama: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, role: "Member" | "Staff", nama: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Mock logged in user for development
  const [user, setUser] = useState<User | null>({
    email: "john@example.com",
    role: "Member",
    nama: "Mr. John William Doe"
  });

  const login = (email: string, role: "Member" | "Staff", nama: string) => {
    setUser({ email, role, nama });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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
