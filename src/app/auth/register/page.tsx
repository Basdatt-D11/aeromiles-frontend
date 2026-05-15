"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        alert("Registrasi Berhasil! Silakan Login.");
        router.push("/auth/login");
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Terjadi kesalahan sistem.");
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="card shadow-sm border-0 mb-5">
          <div className="card-body p-5">
            <h3 className="fw-bold mb-4 text-center">Registrasi Akun Baru</h3>
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleRegister}>
              <div className="row g-3">
                <div className="col-md-2">
                  <label className="form-label text-muted">Title</label>
                  <select name="salutation" className="form-select" required>
                    <option value="Mr.">Mr.</option>
                    <option value="Mrs.">Mrs.</option>
                    <option value="Ms.">Ms.</option>
                  </select>
                </div>
                <div className="col-md-5">
                  <label className="form-label text-muted">First & Mid Name</label>
                  <input type="text" name="first_mid_name" className="form-control" required />
                </div>
                <div className="col-md-5">
                  <label className="form-label text-muted">Last Name</label>
                  <input type="text" name="last_name" className="form-control" required />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted">Email</label>
                  <input type="email" name="email" className="form-control" required />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted">Password</label>
                  <input type="password" name="password" className="form-control" required />
                </div>
                <div className="col-md-3">
                  <label className="form-label text-muted">Kode Negara</label>
                  <input type="text" name="country_code" className="form-control" placeholder="+62" required />
                </div>
                <div className="col-md-9">
                  <label className="form-label text-muted">Nomor Telepon</label>
                  <input type="text" name="mobile_number" className="form-control" required />
                </div>
                <div className="col-md-4">
                  <label className="form-label text-muted">Tanggal Lahir</label>
                  <input type="date" name="tanggal_lahir" className="form-control" required />
                </div>
                <div className="col-md-4">
                  <label className="form-label text-muted">Kewarganegaraan</label>
                  <input type="text" name="kewarganegaraan" className="form-control" required />
                </div>
                <div className="col-md-4">
                  <label className="form-label text-muted">Mendaftar Sebagai</label>
                  <select name="role" className="form-select" required>
                    <option value="Member">Member</option>
                    <option value="Staff">Staff</option>
                  </select>
                </div>
                <div className="col-12 text-end mt-4">
                  <a href="/auth/login" className="btn btn-light me-2">Batal</a>
                  <button type="submit" className="btn btn-primary px-4">Daftar Sekarang</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}