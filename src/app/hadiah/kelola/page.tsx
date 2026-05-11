"use client";

import { useState } from "react";

export default function KelolaHadiah() {
  const [hadiahList] = useState([
    { kode: "RWD-001", nama: "Voucher Traveloka Rp 50.000", deskripsi: "Voucher diskon tiket pesawat atau hotel di Traveloka", penyedia: "TravelokaPartner", tipe_penyedia: "partner", miles: 5000, valid_start: "2024-01-01", program_end: "2024-12-31" },
    { kode: "RWD-002", nama: "Tiket Garuda PP Jakarta - Bali", deskripsi: "Kelas Ekonomi PP", penyedia: "Garuda Indonesia", tipe_penyedia: "airline", miles: 25000, valid_start: "2024-02-01", program_end: "2024-11-30" },
  ]);

  const [selectedHadiah, setSelectedHadiah] = useState<any>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Data hadiah disimpan (demo)");
    const modalEl = document.getElementById("addModal");
    if (modalEl) {
      // @ts-ignore
      const modal = window.bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();
    }
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Data hadiah diperbarui (demo)");
    const modalEl = document.getElementById("editModal");
    if (modalEl) {
      // @ts-ignore
      const modal = window.bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();
    }
  };

  const handleDelete = () => {
    alert("Data hadiah dihapus (demo)");
    const modalEl = document.getElementById("deleteModal");
    if (modalEl) {
      // @ts-ignore
      const modal = window.bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4 mt-3">
        <h3 className="fw-bold m-0">Kelola Hadiah & Penyedia</h3>
        <button className="btn btn-primary" style={{ backgroundColor: "#1E3A8A", borderColor: "#1E3A8A", borderRadius: "8px" }} data-bs-toggle="modal" data-bs-target="#addModal">
          <i className="bi bi-plus"></i> Tambah Hadiah
        </button>
      </div>

      {/* Main Card for Table */}
      <div className="card shadow-sm border-0 mb-5" style={{ borderRadius: "12px" }}>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light text-muted small text-uppercase">
                <tr>
                  <th className="ps-4 py-3 fw-semibold border-bottom-0">Kode</th>
                  <th className="py-3 fw-semibold border-bottom-0">Nama</th>
                  <th className="py-3 fw-semibold border-bottom-0">Deskripsi</th>
                  <th className="py-3 fw-semibold border-bottom-0">Penyedia</th>
                  <th className="py-3 fw-semibold border-bottom-0">Miles</th>
                  <th className="py-3 fw-semibold border-bottom-0">Periode</th>
                  <th className="pe-4 py-3 fw-semibold border-bottom-0 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="border-top-0">
                {hadiahList.map((h) => (
                  <tr key={h.kode}>
                    <td className="ps-4 fw-bold text-dark">{h.kode}</td>
                    <td className="fw-semibold text-dark">{h.nama}</td>
                    <td className="text-muted small text-truncate" style={{ maxWidth: "200px" }}>{h.deskripsi}</td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <span className="fw-semibold text-dark">{h.penyedia}</span>
                        <span className="badge rounded-pill border text-dark fw-normal bg-light">{h.tipe_penyedia}</span>
                      </div>
                    </td>
                    <td className="fw-bold text-dark">{h.miles}</td>
                    <td className="text-muted small">
                      <span>{h.valid_start}</span> &mdash; <span>{h.program_end}</span>
                    </td>
                    <td className="pe-4 text-center">
                      <button 
                        className="btn btn-sm btn-link text-secondary p-1" 
                        title="Edit"
                        data-bs-toggle="modal" 
                        data-bs-target="#editModal"
                        onClick={() => setSelectedHadiah(h)}
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button 
                        className="btn btn-sm btn-link text-danger p-1" 
                        title="Hapus"
                        data-bs-toggle="modal" 
                        data-bs-target="#deleteModal"
                        onClick={() => setSelectedHadiah(h)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
                {hadiahList.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-5 text-muted">Belum ada data hadiah.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Tambah Hadiah */}
      <div className="modal fade" id="addModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content border-0 shadow" style={{ borderRadius: "12px" }}>
            <div className="modal-header border-bottom-0 pb-0">
              <h5 className="modal-title fw-bold">Tambah Hadiah Baru</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSave}>
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label fw-semibold small">Nama Hadiah</label>
                    <input type="text" className="form-control" required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">Penyedia</label>
                    <select className="form-select" required>
                      <option value="">Pilih penyedia</option>
                      <option value="Garuda Indonesia|airline">Garuda Indonesia (airline)</option>
                      <option value="TravelokaPartner|partner">TravelokaPartner (partner)</option>
                      <option value="Plaza Premium|partner">Plaza Premium (partner)</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">Miles Dibutuhkan</label>
                    <input type="number" className="form-control" required min="1" />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold small">Deskripsi</label>
                    <textarea className="form-control" rows={3} required></textarea>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">Valid Start</label>
                    <input type="date" className="form-control" required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">Program End</label>
                    <input type="date" className="form-control" required />
                  </div>
                </div>
                <div className="d-flex justify-content-end mt-4">
                  <button type="submit" className="btn btn-primary" style={{ backgroundColor: "#1E3A8A", borderColor: "#1E3A8A", borderRadius: "8px" }}>Simpan</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Edit Hadiah */}
      <div className="modal fade" id="editModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content border-0 shadow" style={{ borderRadius: "12px" }}>
            <div className="modal-header border-bottom-0 pb-0">
              <h5 className="modal-title fw-bold">Edit Hadiah</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {selectedHadiah && (
                <form onSubmit={handleEdit}>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label fw-semibold small">Kode Hadiah</label>
                      <input type="text" className="form-control bg-light" defaultValue={selectedHadiah.kode} disabled />
                    </div>
                    <div className="col-md-8">
                      <label className="form-label fw-semibold small">Nama Hadiah</label>
                      <input type="text" className="form-control" defaultValue={selectedHadiah.nama} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Penyedia</label>
                      <select className="form-select" defaultValue={`${selectedHadiah.penyedia}|${selectedHadiah.tipe_penyedia}`} required>
                        <option value="Garuda Indonesia|airline">Garuda Indonesia (airline)</option>
                        <option value="TravelokaPartner|partner">TravelokaPartner (partner)</option>
                        <option value="Plaza Premium|partner">Plaza Premium (partner)</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Miles Dibutuhkan</label>
                      <input type="number" className="form-control" defaultValue={selectedHadiah.miles} required min="1" />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold small">Deskripsi</label>
                      <textarea className="form-control" rows={3} defaultValue={selectedHadiah.deskripsi} required></textarea>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Valid Start</label>
                      <input type="date" className="form-control" defaultValue={selectedHadiah.valid_start} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Program End</label>
                      <input type="date" className="form-control" defaultValue={selectedHadiah.program_end} required />
                    </div>
                  </div>
                  <div className="d-flex justify-content-end mt-4">
                    <button type="submit" className="btn btn-primary" style={{ backgroundColor: "#1E3A8A", borderColor: "#1E3A8A", borderRadius: "8px" }}>Simpan</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Hapus Hadiah */}
      <div className="modal fade" id="deleteModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow" style={{ borderRadius: "12px" }}>
            <div className="modal-body p-4 text-center">
              <h5 className="fw-bold mb-3 text-start">Hapus Hadiah?</h5>
              <p className="text-muted small text-start mb-4">Jika hadiah sudah pernah di-redeem oleh Member, riwayat redeem akan terpengaruh.</p>
              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-light border fw-semibold" data-bs-dismiss="modal">Batal</button>
                <button type="button" onClick={handleDelete} className="btn btn-primary" style={{ backgroundColor: "#1E3A8A", borderColor: "#1E3A8A" }}>Hapus</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
