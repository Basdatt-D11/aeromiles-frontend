"use client";

import { useEffect, useState } from "react";

export default function KelolaHadiah() {
  const [hadiah, setHadiah] = useState<any[]>([]);

  const fetchHadiah = async () => {
    try {
      const res = await fetch("/api/hadiah");
      const data = await res.json();
      if (data.success) setHadiah(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchHadiah();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/hadiah", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        fetchHadiah();
        (e.target as HTMLFormElement).reset();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (kode: string) => {
    try {
      const res = await fetch(`/api/hadiah?kode=${kode}`, { method: "DELETE" });
      if (res.ok) fetchHadiah();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Kelola Hadiah</h2>
      </div>

      <div className="card shadow-sm mb-5">
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label text-muted fw-medium">Kode Hadiah</label>
                <input type="text" name="kode_hadiah" className="form-control" required />
              </div>
              <div className="col-md-8">
                <label className="form-label text-muted fw-medium">Nama Hadiah</label>
                <input type="text" name="nama" className="form-control" required />
              </div>
              <div className="col-md-4">
                <label className="form-label text-muted fw-medium">Harga (Miles)</label>
                <input type="number" name="miles" className="form-control" required />
              </div>
              <div className="col-md-4">
                <label className="form-label text-muted fw-medium">Tanggal Mulai</label>
                <input type="date" name="valid_start_date" className="form-control" required />
              </div>
              <div className="col-md-4">
                <label className="form-label text-muted fw-medium">Tanggal Berakhir</label>
                <input type="date" name="program_end" className="form-control" required />
              </div>
              <div className="col-md-4">
                <label className="form-label text-muted fw-medium">ID Penyedia</label>
                <input type="number" name="id_penyedia" className="form-control" required />
              </div>
              <div className="col-md-8">
                <label className="form-label text-muted fw-medium">Deskripsi</label>
                <textarea name="deskripsi" className="form-control" rows={1} required></textarea>
              </div>
              <div className="col-12 text-end">
                <button type="submit" className="btn btn-primary px-4">Tambah Hadiah</button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="row g-4">
        {hadiah.map((h, idx) => (
          <div className="col-md-4" key={idx}>
            <div className="card shadow-sm h-100">
              <div className="card-body p-4 d-flex flex-column">
                <div className="d-flex justify-content-between mb-2">
                  <span className="badge bg-primary">{h.kode_hadiah}</span>
                  <button onClick={() => handleDelete(h.kode_hadiah)} className="btn btn-sm btn-link text-danger p-0">Hapus</button>
                </div>
                <h5 className="fw-bold mb-1">{h.nama}</h5>
                <p className="text-success fw-bold mb-2">{h.miles} Miles</p>
                <p className="text-muted small flex-grow-1">{h.deskripsi}</p>
                <small className="text-muted">Penyedia: {h.id_penyedia}</small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}