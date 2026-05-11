"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export default function TransferMiles() {
  const { user } = useAuth();
  
  const [history] = useState([
    { timestamp: "2024-05-11 10:30", member_name: "Alice Smith", member_email: "alice@example.com", miles: 500, note: "Hadiah ulang tahun", type: "Kirim" },
    { timestamp: "2024-05-10 14:00", member_name: "Bob Johnson", member_email: "bob@example.com", miles: 1000, note: "-", type: "Terima" }
  ]);

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Transfer berhasil (demo)");
    const modalEl = document.getElementById("transferModal");
    if (modalEl) {
      // @ts-ignore
      const modal = window.bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold m-0">Transfer Miles</h4>
          <p className="text-muted small m-0">Award Miles tersedia: <span className="fw-bold">32.000</span></p>
        </div>
        <div>
          <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#transferModal" style={{ backgroundColor: "#1E3A8A", borderRadius: "8px" }}>
            <i className="bi bi-plus-lg me-2"></i>Transfer Baru
          </button>
        </div>
      </div>

      <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: "12px" }}>
        <div className="card-body p-4">
          <h5 className="fw-bold mb-4">Riwayat Transfer</h5>
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="text-muted small">
                <tr>
                  <th className="fw-normal">Waktu</th>
                  <th className="fw-normal">Member</th>
                  <th className="fw-normal">Jumlah Miles</th>
                  <th className="fw-normal">Catatan</th>
                  <th className="fw-normal">Tipe</th>
                  <th className="fw-normal">Aksi</th>
                </tr>
              </thead>
              <tbody className="small">
                {history.map((h, index) => (
                  <tr key={index}>
                    <td className="text-muted">{h.timestamp}</td>
                    <td>
                      <div className="fw-bold text-dark">{h.member_name}</div>
                      <div className="text-muted small">{h.member_email}</div>
                    </td>
                    <td className={`fw-bold ${h.type === 'Kirim' ? 'text-danger' : 'text-success'}`}>
                      {h.type === 'Kirim' ? '-' : '+'}{h.miles.toLocaleString("id-ID")}
                    </td>
                    <td className="text-muted">{h.note}</td>
                    <td>
                      <span className={`badge rounded-pill ${h.type === 'Kirim' ? 'bg-light text-dark border' : 'bg-primary'}`} style={{ fontSize: "0.7rem", padding: "4px 12px" }}>
                        {h.type}
                      </span>
                    </td>
                    <td>
                      <i className="bi bi-lock-fill text-muted" style={{ cursor: "not-allowed" }} title="Tidak dapat diubah"></i>
                    </td>
                  </tr>
                ))}
                {history.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-muted">Belum ada riwayat transfer.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Transfer */}
      <div className="modal fade" id="transferModal" tabIndex={-1} aria-labelledby="transferModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow" style={{ borderRadius: "12px" }}>
            <div className="modal-header border-bottom-0 pb-0">
              <h5 className="modal-title fw-bold" id="transferModalLabel">Transfer Miles</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleTransfer}>
                <div className="mb-3">
                  <label className="form-label fw-semibold small">Email Penerima</label>
                  <input type="email" name="recipient_email" className="form-control" placeholder="member@example.com" required />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold small">Jumlah Miles</label>
                  <input type="number" name="amount" className="form-control" placeholder="0" min="100" required />
                  <div className="form-text small">Maksimal transfer: 32.000 miles.</div>
                </div>
                <div className="mb-4">
                  <label className="form-label fw-semibold small">Catatan (opsional)</label>
                  <textarea name="note" className="form-control" rows={3} placeholder="Hadiah"></textarea>
                </div>
                <div className="d-flex justify-content-end">
                  <button type="submit" className="btn btn-primary px-4" style={{ backgroundColor: "#1E3A8A", borderRadius: "6px" }}>Transfer</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
