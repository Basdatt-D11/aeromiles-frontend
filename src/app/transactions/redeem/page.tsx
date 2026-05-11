"use client";

import { useState } from "react";

export default function RedeemList() {
  const [rewards] = useState([
    { id: "R01", name: "Tiket Garuda PP Jakarta - Bali", description: "Kelas Ekonomi", miles: 15000, image: "https://via.placeholder.com/120x80?text=GA" },
    { id: "R02", name: "Voucher Hotel Bintang 5 Bali", description: "1 Malam", miles: 10000, image: "https://via.placeholder.com/120x80?text=Hotel" },
  ]);

  const [history] = useState([
    { id: 1, reward: "Voucher Lounge", miles: 2000, status: "Sukses", date: "2024-05-01" },
    { id: 2, reward: "Upgrade Business Class", miles: 25000, status: "Sukses", date: "2024-03-15" },
  ]);

  const [selectedReward, setSelectedReward] = useState<{id: string, name: string, miles: number} | null>(null);

  const handleConfirmRedeem = () => {
    if (selectedReward) {
      alert(`Redeem dikonfirmasi untuk reward id: ${selectedReward.id}\n(Ini demo; hubungkan ke backend untuk eksekusi nyata)`);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="m-0">Redeem Hadiah</h4>
          <small className="text-muted">Pilih hadiah yang ingin Anda tukarkan dengan miles</small>
        </div>
        <div>
          <span className="badge bg-light text-dark">Saldo Miles: <strong>75.000</strong></span>
        </div>
      </div>

      <div className="row g-3 mb-4">
        {rewards.map((r) => (
          <div key={r.id} className="col-md-6">
            <div className="card p-3 d-flex flex-row align-items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={r.image} alt={r.name} style={{ width: "120px", height: "80px", objectFit: "cover", borderRadius: "8px" }} />
              <div className="ms-3 flex-grow-1">
                <h6 className="mb-1">{r.name}</h6>
                <p className="mb-1 text-muted small">{r.description}</p>
                <div className="d-flex gap-2 align-items-center">
                  <span className="badge bg-info text-white">{r.miles} miles</span>
                </div>
              </div>
              <div className="ms-3">
                <button 
                  className="btn btn-primary btn-action" 
                  data-bs-toggle="modal" 
                  data-bs-target="#redeemModal"
                  onClick={() => setSelectedReward({ id: r.id, name: r.name, miles: r.miles })}
                >
                  Redeem
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h5 className="mb-2">Riwayat Redeem</h5>
      <div className="table-container p-3">
        <table className="table mb-0 align-middle">
          <thead>
            <tr>
              <th>#</th>
              <th>Hadiah</th>
              <th>Miles</th>
              <th>Status</th>
              <th>Tanggal</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h) => (
              <tr key={h.id}>
                <td>{h.id}</td>
                <td>{h.reward}</td>
                <td>{h.miles}</td>
                <td>{h.status}</td>
                <td>{h.date}</td>
              </tr>
            ))}
            {history.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-muted py-4">Belum ada data.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Redeem Modal */}
      <div className="modal fade" id="redeemModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Konfirmasi Redeem</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <p>Apakah Anda yakin ingin menukarkan:</p>
              <p className="fw-semibold">{selectedReward?.name}</p>
              <p className="text-muted">{selectedReward?.miles} miles</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-light" data-bs-dismiss="modal">Batal</button>
              <button type="button" className="btn btn-primary" onClick={handleConfirmRedeem} data-bs-dismiss="modal">Konfirmasi</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
