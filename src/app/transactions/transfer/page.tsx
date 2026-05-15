"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function TransferMiles() {
  const { user } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const [message, setMessage] = useState<{ text: string; type: "success" | "danger" } | null>(null);

  const fetchHistory = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/transfer?email=${user.email}`);
      const data = await res.json();
      if (data.success) setHistory(data.history);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    const formData = new FormData(e.currentTarget);
    const payload = {
      email_member_1: user.email,
      email_member_2: formData.get("email_penerima"),
      jumlah: formData.get("jumlah"),
      catatan: formData.get("catatan")
    };

    try {
      const res = await fetch("/api/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        setMessage({ text: data.message, type: "success" });
        fetchHistory();
        (e.target as HTMLFormElement).reset();
      } else {
        setMessage({ text: data.message, type: "danger" });
      }
    } catch (error: any) {
      setMessage({ text: "Terjadi kesalahan sistem.", type: "danger" });
    }
  };

  return (
    <>
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Transfer Miles</h2>
        <p className="text-muted">Kirimkan miles ke sesama member AeroMiles</p>
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
                <label className="form-label text-muted fw-medium">Email Penerima</label>
                <input type="email" name="email_penerima" className="form-control" required />
              </div>
              <div className="col-md-6">
                <label className="form-label text-muted fw-medium">Jumlah Miles</label>
                <input type="number" name="jumlah" className="form-control" required min="1" />
              </div>
              <div className="col-12">
                <label className="form-label text-muted fw-medium">Catatan</label>
                <textarea name="catatan" className="form-control" rows={3}></textarea>
              </div>
              <div className="col-12 text-end mt-4">
                <button type="submit" className="btn btn-primary px-4 py-2">Transfer Sekarang</button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <h5 className="fw-bold mb-3">Riwayat Transfer</h5>
      <div className="table-container">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="px-4 py-3">Waktu</th>
                <th className="py-3">Tipe</th>
                <th className="py-3">Member</th>
                <th className="py-3">Jumlah</th>
                <th className="px-4 py-3">Catatan</th>
              </tr>
            </thead>
            <tbody>
              {history.length > 0 ? (
                history.map((item, idx) => (
                  <tr key={idx}>
                    <td className="px-4">{new Date(item.timestamp).toLocaleString('id-ID')}</td>
                    <td>
                      <span className={`badge ${item.transfer_type === 'Kirim' ? 'bg-danger' : 'bg-success'}`}>
                        {item.transfer_type}
                      </span>
                    </td>
                    <td className="fw-semibold">
                      {item.transfer_type === 'Kirim' ? item.email_member_2 : item.email_member_1}
                    </td>
                    <td className="fw-bold">{item.jumlah}</td>
                    <td className="px-4 text-muted">{item.catatan}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-muted">Belum ada riwayat transfer.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}