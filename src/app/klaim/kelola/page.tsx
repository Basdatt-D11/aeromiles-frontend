"use client";

import { useState } from "react";

export default function KelolaKlaim() {
  const [klaims] = useState([
    { id: 1, member_nama: "John Doe", member_email: "john@example.com", maskapai: "Garuda Indonesia", bandara_asal: "CGK", bandara_tujuan: "DPS", tanggal_penerbangan: "2024-05-01", flight_number: "GA402", kelas_kabin: "Economy", status: "Menunggu", timestamp_pengajuan: "2024-05-10 10:00:00" },
    { id: 2, member_nama: "Alice Smith", member_email: "alice@example.com", maskapai: "Singapore Airlines", bandara_asal: "SIN", bandara_tujuan: "CGK", tanggal_penerbangan: "2024-04-15", flight_number: "SQ950", kelas_kabin: "Business", status: "Menunggu", timestamp_pengajuan: "2024-04-20 09:30:00" },
  ]);

  const [selectedKlaim, setSelectedKlaim] = useState<any>(null);

  const handleApprove = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Klaim disetujui (demo)");
    const modalEl = document.getElementById("approveModal");
    if (modalEl) {
      // @ts-ignore
      const modal = window.bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();
    }
  };

  const handleReject = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Klaim ditolak (demo)");
    const modalEl = document.getElementById("rejectModal");
    if (modalEl) {
      // @ts-ignore
      const modal = window.bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();
    }
  };

  return (
    <>
      <div className="row mb-4">
        <div className="col">
          <h4 className="fw-bold mb-3">Kelola Klaim Missing Miles</h4>
          <div className="d-flex flex-wrap gap-2 mb-3">
            <select className="form-select form-select-sm w-auto">
              <option>Semua Status</option>
              <option>Menunggu</option>
              <option>Disetujui</option>
              <option>Ditolak</option>
            </select>
            <select className="form-select form-select-sm w-auto">
              <option>Semua Maskapai</option>
              <option>Garuda Indonesia</option>
              <option>Singapore Airlines</option>
            </select>
            <input type="date" className="form-control form-control-sm w-auto" placeholder="Tanggal Pengajuan" />
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0" style={{ borderRadius: "12px" }}>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="text-muted small">
                <tr>
                  <th className="ps-4">No. Klaim</th>
                  <th>Member</th>
                  <th>Maskapai</th>
                  <th>Rute</th>
                  <th>Tanggal</th>
                  <th>Flight</th>
                  <th>Kelas</th>
                  <th>Tanggal Pengajuan</th>
                  <th>Status</th>
                  <th className="pe-4">Aksi</th>
                </tr>
              </thead>
              <tbody className="small">
                {klaims.map((klaim) => (
                  <tr key={klaim.id}>
                    <td className="ps-4 fw-bold">CLM-{klaim.id.toString().padStart(3, '0')}</td>
                    <td>
                      <div className="fw-bold text-dark">{klaim.member_nama}</div>
                      <div className="text-muted" style={{ fontSize: "0.75rem" }}>{klaim.member_email}</div>
                    </td>
                    <td>{klaim.maskapai}</td>
                    <td>{klaim.bandara_asal} → {klaim.bandara_tujuan}</td>
                    <td>{klaim.tanggal_penerbangan}</td>
                    <td>{klaim.flight_number}</td>
                    <td>{klaim.kelas_kabin}</td>
                    <td className="text-muted">{klaim.timestamp_pengajuan.substring(0, 19)}</td>
                    <td>
                      <span className={`badge rounded-pill ${klaim.status === 'Menunggu' ? 'bg-warning text-dark' : klaim.status === 'Disetujui' ? 'bg-success' : 'bg-danger'}`} style={{ fontSize: "0.7rem", padding: "4px 12px" }}>
                        {klaim.status}
                      </span>
                    </td>
                    <td className="pe-4">
                      {klaim.status === 'Menunggu' && (
                        <div className="d-flex gap-2">
                          <button 
                            className="btn btn-sm btn-outline-success border-0" 
                            data-bs-toggle="modal" 
                            data-bs-target="#approveModal"
                            onClick={() => setSelectedKlaim(klaim)}
                          >
                            <i className="bi bi-check-circle"></i>
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger border-0" 
                            data-bs-toggle="modal" 
                            data-bs-target="#rejectModal"
                            onClick={() => setSelectedKlaim(klaim)}
                          >
                            <i className="bi bi-x-circle"></i>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {klaims.length === 0 && (
                  <tr>
                    <td colSpan={10} className="text-center py-5 text-muted">Belum ada klaim yang masuk.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Approve Modal */}
      <div className="modal fade" id="approveModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow" style={{ borderRadius: "12px" }}>
            <div className="modal-header border-bottom-0">
              <h5 className="modal-title fw-bold">Setujui Klaim</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body pb-0">
              <p className="text-muted small">Miles akan ditambahkan ke akun member sesuai rute dan kelas kabin.</p>
              <div className="bg-light p-3 rounded-3 mb-3 small">
                <div className="mb-1"><strong>Klaim:</strong> CLM-{selectedKlaim?.id?.toString().padStart(3, '0')}</div>
                <div className="mb-1"><strong>Member:</strong> {selectedKlaim?.member_nama}</div>
                <div className="mb-1"><strong>Rute:</strong> {selectedKlaim?.bandara_asal} → {selectedKlaim?.bandara_tujuan}</div>
                <div><strong>Kelas:</strong> {selectedKlaim?.kelas_kabin}</div>
              </div>
            </div>
            <div className="modal-footer border-top-0 pt-0">
              <button type="button" className="btn btn-light px-4" data-bs-dismiss="modal">Batal</button>
              <button type="button" className="btn btn-primary px-4" onClick={handleApprove} style={{ backgroundColor: "#1E3A8A" }}>Setujui</button>
            </div>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      <div className="modal fade" id="rejectModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow" style={{ borderRadius: "12px" }}>
            <div className="modal-header border-bottom-0">
              <h5 className="modal-title fw-bold">Tolak Klaim</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body pb-0">
              <p className="text-muted small">Klaim akan ditolak dan member akan diinformasikan.</p>
              <div className="bg-light p-3 rounded-3 mb-3 small">
                <div className="mb-1"><strong>Klaim:</strong> CLM-{selectedKlaim?.id?.toString().padStart(3, '0')}</div>
                <div className="mb-1"><strong>Member:</strong> {selectedKlaim?.member_nama}</div>
                <div className="mb-1"><strong>Rute:</strong> {selectedKlaim?.bandara_asal} → {selectedKlaim?.bandara_tujuan}</div>
              </div>
            </div>
            <div className="modal-footer border-top-0 pt-0">
              <button type="button" className="btn btn-light px-4" data-bs-dismiss="modal">Batal</button>
              <button type="button" className="btn btn-danger px-4" onClick={handleReject}>Tolak</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
