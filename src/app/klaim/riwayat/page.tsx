"use client";

import { useState } from "react";
import Link from "next/link";

export default function RiwayatKlaim() {
  const [klaims] = useState([
    { id: 1, maskapai: "Garuda Indonesia", bandara_asal: "CGK", bandara_tujuan: "DPS", tanggal_penerbangan: "2024-05-01", flight_number: "GA402", kelas_kabin: "Economy", nomor_tiket: "1261234567890", pnr: "ABCDEF", status: "Menunggu", timestamp_pengajuan: "2024-05-10 10:00:00" },
    { id: 2, maskapai: "Singapore Airlines", bandara_asal: "SIN", bandara_tujuan: "CGK", tanggal_penerbangan: "2024-04-15", flight_number: "SQ950", kelas_kabin: "Business", nomor_tiket: "6181234567890", pnr: "XYZ123", status: "Disetujui", timestamp_pengajuan: "2024-04-20 09:30:00" },
  ]);

  const [selectedKlaim, setSelectedKlaim] = useState<any>(null);

  const handleBatalKlaim = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Klaim dibatalkan (demo)");
    const modalEl = document.getElementById("batalkanModal");
    if (modalEl) {
      // @ts-ignore
      const modal = window.bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();
    }
  };

  const handleEditKlaim = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Klaim berhasil diedit (demo)");
    const modalEl = document.getElementById("editKlaimModal");
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
          <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
            <div>
              <h4 className="mb-1">Klaim Missing Miles</h4>
              <p className="text-muted mb-0">Lihat seluruh riwayat klaim Anda dan ajukan klaim baru jika miles belum tercatat.</p>
            </div>
            <Link href="/klaim/ajukan" className="btn btn-primary" style={{ backgroundColor: "#1E3A8A" }}>
              <i className="bi bi-plus-lg me-1"></i> Ajukan Klaim
            </Link>
          </div>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col">
          <div className="bg-white rounded-4 shadow-sm p-3">
            <ul className="nav nav-pills gap-2 flex-wrap">
              <li className="nav-item">
                <a className="nav-link rounded-pill active" href="#">Semua</a>
              </li>
              <li className="nav-item">
                <a className="nav-link rounded-pill text-dark" href="#">Menunggu</a>
              </li>
              <li className="nav-item">
                <a className="nav-link rounded-pill text-dark" href="#">Disetujui</a>
              </li>
              <li className="nav-item">
                <a className="nav-link rounded-pill text-dark" href="#">Ditolak</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <div className="table-container p-3">
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead>
                  <tr>
                    <th>No. Klaim</th>
                    <th>Maskapai</th>
                    <th>Rute</th>
                    <th>Tanggal</th>
                    <th>Flight</th>
                    <th>Kelas</th>
                    <th>Status</th>
                    <th>Timestamp</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {klaims.map((klaim) => (
                    <tr key={klaim.id}>
                      <td>CLM-{klaim.id.toString().padStart(3, '0')}</td>
                      <td>{klaim.maskapai}</td>
                      <td>{klaim.bandara_asal} → {klaim.bandara_tujuan}</td>
                      <td>{klaim.tanggal_penerbangan}</td>
                      <td>{klaim.flight_number}</td>
                      <td>{klaim.kelas_kabin}</td>
                      <td>
                        <span className={`badge rounded-pill ${klaim.status === 'Menunggu' ? 'bg-warning text-dark' : klaim.status === 'Disetujui' ? 'bg-success' : 'bg-danger'}`}>
                          {klaim.status}
                        </span>
                      </td>
                      <td>{klaim.timestamp_pengajuan.substring(0, 16)}</td>
                      <td className="text-nowrap">
                        {klaim.status === 'Menunggu' ? (
                          <>
                            <button 
                              type="button" 
                              className="btn btn-sm btn-outline-primary me-1" 
                              data-bs-toggle="modal" 
                              data-bs-target="#editKlaimModal"
                              onClick={() => setSelectedKlaim(klaim)}
                            >
                              <i className="bi bi-pencil-fill"></i>
                            </button>
                            <button 
                              type="button" 
                              className="btn btn-sm btn-outline-danger" 
                              data-bs-toggle="modal" 
                              data-bs-target="#batalkanModal"
                              onClick={() => setSelectedKlaim(klaim)}
                            >
                              <i className="bi bi-trash-fill"></i>
                            </button>
                          </>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {klaims.length === 0 && (
                    <tr>
                      <td colSpan={9} className="text-center text-muted py-4">Belum ada klaim yang diajukan.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Batalkan Modal */}
      <div className="modal fade" id="batalkanModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Batalkan Klaim?</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <p className="mb-3">Anda akan menghapus klaim berikut secara permanen:</p>
              <p className="mb-2"><strong>No. Klaim:</strong> CLM-{selectedKlaim?.id?.toString().padStart(3, '0')}</p>
              <p className="mb-2"><strong>Maskapai:</strong> {selectedKlaim?.maskapai}</p>
              <p className="mb-0"><strong>Rute:</strong> {selectedKlaim?.bandara_asal} → {selectedKlaim?.bandara_tujuan}</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-light" data-bs-dismiss="modal">Batal</button>
              <button type="button" className="btn btn-danger" onClick={handleBatalKlaim} data-bs-dismiss="modal">Hapus</button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Klaim Modal */}
      <div className="modal fade" id="editKlaimModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content" style={{ borderRadius: "12px" }}>
            <div className="modal-header border-bottom-0">
              <h5 className="modal-title fw-bold">Edit Klaim</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body p-4">
              {selectedKlaim && (
                <form onSubmit={handleEditKlaim}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold small">Maskapai</label>
                      <select className="form-select" defaultValue={selectedKlaim.maskapai}>
                        <option value="Garuda Indonesia">Garuda Indonesia</option>
                        <option value="Singapore Airlines">Singapore Airlines</option>
                        <option value="Emirates">Emirates</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold small">Kelas Kabin</label>
                      <select className="form-select" defaultValue={selectedKlaim.kelas_kabin}>
                        <option value="Economy">Economy</option>
                        <option value="Business">Business</option>
                        <option value="First">First</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold small">Bandara Asal</label>
                      <select className="form-select" defaultValue={selectedKlaim.bandara_asal}>
                        <option value="CGK">CGK - Jakarta</option>
                        <option value="DPS">DPS - Bali</option>
                        <option value="SIN">SIN - Singapore</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold small">Bandara Tujuan</label>
                      <select className="form-select" defaultValue={selectedKlaim.bandara_tujuan}>
                        <option value="CGK">CGK - Jakarta</option>
                        <option value="DPS">DPS - Bali</option>
                        <option value="SIN">SIN - Singapore</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold small">Tanggal Penerbangan</label>
                      <input type="date" className="form-control" defaultValue={selectedKlaim.tanggal_penerbangan} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold small">Flight Number</label>
                      <input type="text" className="form-control" defaultValue={selectedKlaim.flight_number} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold small">Nomor Tiket</label>
                      <input type="text" className="form-control" defaultValue={selectedKlaim.nomor_tiket} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold small">PNR</label>
                      <input type="text" className="form-control" defaultValue={selectedKlaim.pnr} />
                    </div>
                  </div>
                  <div className="d-flex justify-content-end mt-4">
                    <button type="submit" className="btn btn-primary px-4" style={{ backgroundColor: "#1E3A8A", borderRadius: "6px" }}>Simpan</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
