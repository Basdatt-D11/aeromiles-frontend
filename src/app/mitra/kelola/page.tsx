"use client";

import { useState } from "react";

export default function KelolaMitra() {
  const [mitraList] = useState([
    { id_penyedia: "PYD-001", email: "contact@traveloka.com", nama_mitra: "TravelokaPartner", tanggal_kerja_sama: "2023-01-15" },
    { id_penyedia: "PYD-002", email: "info@plaza-network.com", nama_mitra: "Plaza Premium", tanggal_kerja_sama: "2023-05-20" },
  ]);

  const [selectedMitra, setSelectedMitra] = useState<any>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Mitra berhasil didaftarkan (demo)");
    const modalEl = document.getElementById("addModal");
    if (modalEl) {
      // @ts-ignore
      const modal = window.bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();
    }
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Informasi Mitra berhasil diperbarui (demo)");
    const modalEl = document.getElementById("editModal");
    if (modalEl) {
      // @ts-ignore
      const modal = window.bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();
    }
  };

  const handleDelete = () => {
    alert("Data Mitra berhasil dihapus (demo)");
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
        <h3 className="fw-bold m-0">Kelola Mitra</h3>
        <button className="btn btn-primary" style={{ backgroundColor: "#1E3A8A", borderColor: "#1E3A8A", borderRadius: "8px" }} data-bs-toggle="modal" data-bs-target="#addModal">
          <i className="bi bi-plus"></i> Tambah Mitra
        </button>
      </div>

      <div className="card shadow-sm border-0 mb-5" style={{ borderRadius: "12px" }}>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light text-muted small text-uppercase">
                <tr>
                  <th className="ps-4 py-3 fw-semibold border-bottom-0">Email</th>
                  <th className="py-3 fw-semibold border-bottom-0">ID Penyedia</th>
                  <th className="py-3 fw-semibold border-bottom-0">Nama Mitra</th>
                  <th className="py-3 fw-semibold border-bottom-0">Tanggal Kerja Sama</th>
                  <th className="pe-4 py-3 fw-semibold border-bottom-0 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="border-top-0">
                {mitraList.map((m) => (
                  <tr key={m.id_penyedia}>
                    <td className="ps-4 fw-semibold text-dark">{m.email}</td>
                    <td className="fw-bold text-dark">{m.id_penyedia}</td>
                    <td className="fw-semibold text-dark">{m.nama_mitra}</td>
                    <td className="text-muted small">{m.tanggal_kerja_sama}</td>
                    <td className="pe-4 text-center">
                      <button 
                        className="btn btn-sm btn-link text-secondary p-1" 
                        title="Edit"
                        data-bs-toggle="modal" 
                        data-bs-target="#editModal"
                        onClick={() => setSelectedMitra(m)}
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button 
                        className="btn btn-sm btn-link text-danger p-1" 
                        title="Hapus"
                        data-bs-toggle="modal" 
                        data-bs-target="#deleteModal"
                        onClick={() => setSelectedMitra(m)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
                {mitraList.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-5 text-muted">Belum ada data mitra.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Tambah Mitra */}
      <div className="modal fade" id="addModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow" style={{ borderRadius: "12px" }}>
            <div className="modal-header border-bottom-0 pb-0">
              <h5 className="modal-title fw-bold">Tambah Mitra Baru</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSave}>
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label fw-semibold small">Email Mitra</label>
                    <input type="email" className="form-control" required />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold small">Nama Mitra</label>
                    <input type="text" className="form-control" required />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold small">Tanggal Kerja Sama</label>
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

      {/* Modal Edit Mitra */}
      <div className="modal fade" id="editModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow" style={{ borderRadius: "12px" }}>
            <div className="modal-header border-bottom-0 pb-0">
              <h5 className="modal-title fw-bold">Edit Mitra</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {selectedMitra && (
                <form onSubmit={handleEdit}>
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label fw-semibold small">Email Mitra</label>
                      <input type="email" className="form-control bg-light" defaultValue={selectedMitra.email} disabled />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold small">Nama Mitra</label>
                      <input type="text" className="form-control" defaultValue={selectedMitra.nama_mitra} required />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold small">Tanggal Kerja Sama</label>
                      <input type="date" className="form-control" defaultValue={selectedMitra.tanggal_kerja_sama} required />
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

      {/* Modal Hapus Mitra */}
      <div className="modal fade" id="deleteModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow" style={{ borderRadius: "12px" }}>
            <div className="modal-body p-4 text-center">
              <h5 className="fw-bold mb-3 text-start">Hapus Mitra?</h5>
              <p className="text-muted small text-start mb-4">Penghapusan mitra akan berpengaruh pada hadiah yang disediakan oleh mitra ini.</p>
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
