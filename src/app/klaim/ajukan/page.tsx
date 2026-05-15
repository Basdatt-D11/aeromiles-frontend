"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function AjukanKlaim() {
  const { user } = useAuth();
  const [riwayatKlaim, setRiwayatKlaim] = useState<any[]>([]);
  const [message, setMessage] = useState<{ text: string; type: "success" | "danger" } | null>(null);

  const fetchRiwayat = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/klaim?email=${user.email}`);
      const data = await res.json();
      if (data.success) setRiwayatKlaim(data.data);
    } catch (error) { console.error(error); }
  };

  useEffect(() => { fetchRiwayat(); }, [user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    const formData = new FormData(e.currentTarget);
    const payload = { ...Object.fromEntries(formData.entries()), email_member: user.email };

    try {
      const res = await fetch("/api/klaim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        setMessage({ text: "Klaim berhasil diajukan!", type: "success" });
        fetchRiwayat();
        (e.target as HTMLFormElement).reset();
      } else {
        setMessage({ text: data.message, type: "danger" });
      }
    } catch (error) { setMessage({ text: "Terjadi kesalahan sistem.", type: "danger" }); }
  };

  return (
    <>
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Klaim Missing Miles</h2>
        <p className="text-muted">Ajukan klaim untuk penerbangan yang belum tercatat miles-nya</p>
      </div>

      {message && (
        <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
          {message.text}
          <button type="button" className="btn-close" onClick={() => setMessage(null)}></button>
        </div>
      )}

      <div className="card shadow-sm mb-5">
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label text-muted small fw-medium">Maskapai</label>
                <input type="text" name="maskapai" className="form-control" required />
              </div>
              <div className="col-md-3">
                <label className="form-label text-muted small fw-medium">Bandara Asal (IATA)</label>
                <input type="text" name="bandara_asal" className="form-control" required maxLength={3} />
              </div>
              <div className="col-md-3">
                <label className="form-label text-muted small fw-medium">Bandara Tujuan (IATA)</label>
                <input type="text" name="bandara_tujuan" className="form-control" required maxLength={3} />
              </div>
              <div className="col-md-4">
                <label className="form-label text-muted small fw-medium">Tanggal Penerbangan</label>
                <input type="date" name="tanggal_penerbangan" className="form-control" required />
              </div>
              <div className="col-md-4">
                <label className="form-label text-muted small fw-medium">Flight Number</label>
                <input type="text" name="flight_number" className="form-control" required />
              </div>
              <div className="col-md-4">
                <label className="form-label text-muted small fw-medium">Nomor Tiket</label>
                <input type="text" name="nomor_tiket" className="form-control" required />
              </div>
              <div className="col-md-6">
                <label className="form-label text-muted small fw-medium">Kelas Kabin</label>
                <select name="kelas_kabin" className="form-select" required>
                  <option value="Economy">Economy</option>
                  <option value="Business">Business</option>
                  <option value="First">First</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label text-muted small fw-medium">PNR (Booking Code)</label>
                <input type="text" name="pnr" className="form-control" required />
              </div>
              <div className="col-12 text-end mt-4">
                <button type="submit" className="btn btn-primary px-4 py-2">Ajukan Klaim</button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <h5 className="fw-bold mb-3">Riwayat Klaim Saya</h5>
      <div className="table-container">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="px-4 py-3">Penerbangan</th>
                <th className="py-3">Rute</th>
                <th className="py-3">Tanggal</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {riwayatKlaim.map((k, i) => (
                <tr key={i}>
                  <td className="px-4 fw-semibold">{k.flight_number}</td>
                  <td>{k.bandara_asal} &rarr; {k.bandara_tujuan}</td>
                  <td>{new Date(k.tanggal_penerbangan).toLocaleDateString('id-ID')}</td>
                  <td className="px-4">
                    <span className={`badge ${k.status_penerimaan === 'Disetujui' ? 'bg-success' : k.status_penerimaan === 'Ditolak' ? 'bg-danger' : 'bg-warning'}`}>
                      {k.status_penerimaan}
                    </span>
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