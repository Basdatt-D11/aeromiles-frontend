"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function IdentitasMember() {
  const { user } = useAuth();
  const [identitas, setIdentitas] = useState<any[]>([]);

  const fetchIdentitas = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/identitas?email=${user.email}`);
      const data = await res.json();
      if (data.success) setIdentitas(data.data);
    } catch (error) { console.error(error); }
  };

  useEffect(() => { fetchIdentitas(); }, [user]);

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    
    const formData = new FormData(e.currentTarget);
    const payload = { ...Object.fromEntries(formData.entries()), email_member: user.email };

    const res = await fetch("/api/identitas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      fetchIdentitas();
      (e.target as HTMLFormElement).reset();
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Identitas Saya</h2>
          <p className="text-muted">Dokumen resmi terdaftar atas akun <span className="fw-bold">{user?.email}</span></p>
        </div>
      </div>

      <div className="card shadow-sm mb-5 p-4">
        <h5 className="fw-bold mb-3">Tambah Dokumen Baru</h5>
        <form onSubmit={handleAdd}>
          <div className="row g-3">
            <div className="col-md-3">
              <select name="jenis" className="form-select" required>
                <option value="KTP">KTP</option>
                <option value="Paspor">Paspor</option>
              </select>
            </div>
            <div className="col-md-6">
              <input type="text" name="nomor" className="form-control" placeholder="Nomor Dokumen" required />
            </div>
            <div className="col-md-3">
              <input type="text" name="negara_penerbit" className="form-control" placeholder="Negara" required />
            </div>
            <div className="col-md-4">
              <label className="small text-muted">Tanggal Terbit</label>
              <input type="date" name="tanggal_terbit" className="form-control" required />
            </div>
            <div className="col-md-4">
              <label className="small text-muted">Tanggal Habis</label>
              <input type="date" name="tanggal_habis" className="form-control" required />
            </div>
            <div className="col-md-4 d-flex align-items-end">
              <button type="submit" className="btn btn-primary w-100">Simpan</button>
            </div>
          </div>
        </form>
      </div>

      <div className="table-container">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="px-4 py-3">Nomor</th>
                <th className="py-3">Jenis</th>
                <th className="py-3">Negara</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {identitas.map((id, idx) => (
                <tr key={idx}>
                  <td className="px-4 fw-bold">{id.nomor}</td>
                  <td>{id.jenis}</td>
                  <td>{id.negara_penerbit}</td>
                  <td className="px-4 text-center">
                    <button className="btn btn-sm btn-outline-danger btn-action">
                      <i className="bi bi-trash-fill"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}