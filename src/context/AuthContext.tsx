"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface User {
  email: string;
  role: "MEMBER" | "STAFF";
  nama: string;
  salutation?: string;
  first_mid_name?: string;
  last_name?: string;
  country_code?: string;
  mobile_number?: string;
  tanggal_lahir?: string;
  kewarganegaraan?: string;
  nomor_member?: string;
  tanggal_bergabung?: string;
  id_staf?: string;
  kode_maskapai?: string;
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
  const [isLoading, setIsLoading] = useState(false); // ✅ Set ke false langsung, gak perlu cek storage

  // ✅ useEffect untuk load dari storage DIHAPUS, biar dia selalu "lupa" pas refresh
  useEffect(() => {
    setIsLoading(false);
  }, []);

  const login = (userData: User) => {
    // ✅ setItem DIHAPUS, biar dia gak nyimpen ke harddisk browser
    setUser(userData);
  };

  const logout = () => {
    // ✅ removeItem DIHAPUS
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