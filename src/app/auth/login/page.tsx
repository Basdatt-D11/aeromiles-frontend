"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import Link from "next/link";

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    // Dummy login logic: if it contains 'admin' or 'staff', treat as Staff
    const role = email.includes("admin") || email.includes("staff") ? "Staff" : "Member";
    const name = role === "Staff" ? "Staff User" : "Member User";
    login(email, role, name);
    router.push("/");
  };

  return (
    <div className="bg-slate-50 text-slate-800 font-sans antialiased min-h-screen">
      <nav className="bg-brand-dark py-3">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-white font-bold text-lg">
            <i className="bi bi-airplane text-brand-accent"></i> AeroMiles
          </Link>
          <div className="flex gap-2">
            <Link href="/auth/login" className="flex items-center gap-2 px-4 py-2 text-white bg-white/10 rounded-md font-medium text-sm">
              <i className="bi bi-person"></i> Login
            </Link>
            <Link href="/auth/register" className="flex items-center gap-2 px-4 py-2 text-slate-400 font-medium text-sm hover:text-white transition-colors">
              <i className="bi bi-person-plus"></i> Registrasi
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto mt-12 text-center px-4">
        <div className="w-16 h-16 bg-brand-iconBg text-white rounded-2xl inline-flex items-center justify-center text-3xl mb-4 shadow-sm">
          <i className="bi bi-airplane"></i>
        </div>
        <h2 className="text-3xl font-bold mb-2 text-slate-900">Selamat Datang</h2>
        <p className="text-slate-500 text-sm">Masuk ke akun AeroMiles Anda</p>
      </div>

      <div className="max-w-md mx-auto mb-16 mt-8 px-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8">
          <form onSubmit={handleLogin}>
            <h5 className="text-lg font-bold mb-1 text-slate-900">Login</h5>
            <p className="text-slate-500 text-sm mb-6">Masukkan email dan password Anda</p>

            <div className="mb-4">
              <label className="block font-semibold text-sm text-slate-800 mb-1.5">Email</label>
              <input 
                type="email" 
                className="w-full rounded-lg border-slate-300 border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                placeholder="email@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>

            <div className="mb-6">
              <label className="block font-semibold text-sm text-slate-800 mb-1.5">Password</label>
              <input 
                type="password" 
                className="w-full rounded-lg border-slate-300 border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>

            <button type="submit" className="w-full bg-brand-primary hover:bg-brand-primaryHover text-white font-medium py-3 px-4 rounded-lg transition-colors mb-6">
              Log In
            </button>

            <div className="text-center text-sm">
              <span className="text-slate-500">Belum punya akun?</span> 
              <Link href="/auth/register" className="text-blue-600 font-semibold hover:underline ms-1">Daftar di sini</Link>
            </div>
          </form>
        </div>
        
        <div className="mt-6 text-center text-xs text-slate-400">
          <p>Akses dengan data (Dummy Login)</p>
        </div>
      </div>
    </div>
  );
}
