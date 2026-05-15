"use client";

import { useEffect, useState } from "react";

export default function KelolaMitra() {
  const [mitra, setMitra] = useState<any[]>([]);

  const fetchMitra = async () => {
    try {
      const res = await fetch("/api/mitra");
      const data = await res.json();
      if (data.success) setMitra(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMitra();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/mitra", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        fetchMitra();
        (e.target as HTMLFormElement).reset();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (email: string) => {
    try {
      const res = await fetch(`/api/mitra?email=${email}`, { method: "DELETE" });
      if (res.ok) fetchMitra();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Kelola Mitra</h2>
      </div>

      <div className="card shadow-sm mb-5">
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label text-muted fw-medium">Email Mitra</label>
                <input type="email" name="email_mitra" className="form-control" required />
              </div>
              <div className="col-md-6">
                <label className="form-label text-muted fw-medium">Nama Mitra</label>
                <input type="text" name="nama_mitra" className="form-control" required />
              </div>
              <div className="col-md-6">
                <label className="form-label text-muted fw-medium">ID Penyedia</label>
                <input type="number" name="id_penyedia" className="form-control" required />
              </div>
              <div className="col-md-6">
                <label className="form-label text-muted fw-medium">Tanggal Kerja Sama</label>
                <input type="date" name="tanggal_kerja_sama" className="form-control" required />
              </div>
              <div className="col-12 text-end">
                <button type="submit" className="btn btn-primary px-4">Simpan Mitra</button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="table-container">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="px-4 py-3">Nama Mitra</th>
                <th className="py-3">Email</th>
                <th className="py-3">ID Penyedia</th>
                <th className="py-3">Tanggal Kerja Sama</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {mitra.map((m, idx) => (
                <tr key={idx}>
                  <td className="px-4 fw-bold">{m.nama_mitra}</td>
                  <td>{m.email_mitra}</td>
                  <td>{m.id_penyedia}</td>
                  <td>{new Date(m.tanggal_kerja_sama).toLocaleDateString('id-ID')}</td>
                  <td className="px-4 text-center">
                    <button onClick={() => handleDelete(m.email_mitra)} className="btn btn-sm btn-outline-danger">
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