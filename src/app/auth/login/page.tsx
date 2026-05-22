"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.success) {
        login(data.user);
        router.push("/");
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Terjadi kesalahan sistem.");
    }
  };

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-5">
        <div className="card shadow-sm border-0">
          <div className="card-body p-5">
            <div className="text-center mb-4 w-100">
              <i className="bi bi-airplane-fill text-primary" style={{ fontSize: "2.5rem" }}></i>
              <h3 className="fw-bold mt-2 text-center w-100">Masuk ke AeroMiles</h3>
              <p className="text-muted">Masukkan email dan password Anda</p>
            </div>

            {error && <div className="alert alert-danger p-2 small">{error}</div>}

            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label text-muted fw-medium">Email</label>
                <input type="email" name="email" className="form-control" required />
              </div>
              <div className="mb-4">
                <label className="form-label text-muted fw-medium">Password</label>
                <input type="password" name="password" className="form-control" required />
              </div>
              <button type="submit" className="btn btn-primary w-100 py-2 fw-bold">Login</button>
            </form>

            <div className="text-center mt-4">
              <small className="text-muted">Belum punya akun? <a href="/auth/register" className="text-decoration-none fw-bold">Daftar di sini</a></small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}