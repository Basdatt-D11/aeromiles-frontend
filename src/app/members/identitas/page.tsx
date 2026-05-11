"use client";

import { useState } from "react";

export default function Identitas() {
  const [identitasList] = useState([
    { nomor: "A12345678", jenis: "Paspor", negara: "Indonesia", terbit: "2020-01-15", habis: "2030-01-15", status: "Aktif" },
    { nomor: "3275012345678901", jenis: "KTP", negara: "Indonesia", terbit: "2019-06-01", habis: "2024-06-01", status: "Tidak Aktif" }
  ]);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">Identitas Saya</h3>
        <button className="btn btn-primary fw-bold" data-bs-toggle="modal" data-bs-target="#addIdentitasModal">
          + Tambah Identitas
        </button>
      </div>

      <div className="table-container">
        <table className="table table-hover m-0">
          <thead>
            <tr>
              <th className="ps-4">No. Dokumen</th>
              <th>Jenis</th>
              <th>Negara</th>
              <th>Terbit</th>
              <th>Habis</th>
              <th>Status</th>
              <th className="text-center pe-4">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {identitasList.map((iden, index) => (
              <tr key={index}>
                <td className="ps-4"><strong>{iden.nomor}</strong></td>
                <td>{iden.jenis}</td>
                <td>{iden.negara}</td>
                <td>{iden.terbit}</td>
                <td>{iden.habis}</td>
                <td>
                  <span className={`badge ${iden.status === 'Aktif' ? 'bg-success' : 'bg-danger'}`}>
                    {iden.status}
                  </span>
                </td>
                <td className="text-center pe-4">
                  <button className="btn btn-sm btn-light btn-action me-1" data-bs-toggle="modal" data-bs-target="#editModal1"><i className="bi bi-pencil"></i></button>
                  <button className="btn btn-sm btn-light btn-action text-danger" data-bs-toggle="modal" data-bs-target="#deleteIdentitasModal"><i className="bi bi-trash"></i></button>
                </td>
              </tr>
            ))}
            {identitasList.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center text-muted py-4">Belum ada data identitas.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      <div className="modal fade" id="addIdentitasModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content" style={{ borderRadius: "20px", border: "none" }}>
            <div className="modal-header border-0 pt-4 px-4 pb-0">
              <h5 className="modal-title fw-bold">Tambah Identitas Baru</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body p-4">
              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">Nomor Dokumen</label>
                <input type="text" className="form-control bg-light border-0" placeholder="A12345678" />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">Jenis Dokumen</label>
                <select className="form-select bg-light border-0">
                  <option>Paspor</option>
                  <option>KTP</option>
                  <option>SIM</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">Negara Penerbit</label>
                <select className="form-select bg-light border-0">
                  <option>Indonesia</option>
                </select>
              </div>
              <div className="row g-2">
                <div className="col-6">
                  <label className="form-label small fw-bold text-muted">Tanggal Terbit</label>
                  <input type="date" className="form-control bg-light border-0" defaultValue="2020-01-15" />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-bold text-muted">Tanggal Habis</label>
                  <input type="date" className="form-control bg-light border-0" defaultValue="2030-01-15" />
                </div>
              </div>
              <div className="text-end mt-4">
                <button type="button" className="btn btn-primary px-4 fw-bold" data-bs-dismiss="modal">Simpan</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <div className="modal fade" id="deleteIdentitasModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content" style={{ borderRadius: "15px", border: "none" }}>
            <div className="modal-body p-4 text-start">
              <h5 className="fw-bold mb-2">Hapus Identitas?</h5>
              <p className="text-muted small mb-4">Tindakan ini tidak dapat dibatalkan.</p>
              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-light px-4" data-bs-dismiss="modal">Batal</button>
                <button type="button" className="btn btn-primary px-4" data-bs-dismiss="modal">Hapus</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <div className="modal fade" id="editModal1" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content" style={{ borderRadius: "20px", border: "none" }}>
            <div className="modal-header border-0 pt-4 px-4 pb-0">
              <h5 className="modal-title fw-bold">Edit Identitas</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body p-4">
              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">Nomor Dokumen</label>
                <input type="text" className="form-control bg-light border-0" defaultValue="A12345678" readOnly />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">Jenis Dokumen</label>
                <select className="form-select bg-light border-0" defaultValue="Paspor">
                  <option>Paspor</option>
                  <option>KTP</option>
                  <option>SIM</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">Negara Penerbit</label>
                <select className="form-select bg-light border-0" defaultValue="Indonesia">
                  <option>Indonesia</option>
                </select>
              </div>
              <div className="row g-2">
                <div className="col-6">
                  <label className="form-label small fw-bold text-muted">Tanggal Terbit</label>
                  <input type="date" className="form-control bg-light border-0" defaultValue="2020-01-15" />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-bold text-muted">Tanggal Habis</label>
                  <input type="date" className="form-control bg-light border-0" defaultValue="2030-01-15" />
                </div>
              </div>
              <div className="text-end mt-4">
                <button type="button" className="btn btn-primary px-4 fw-bold" data-bs-dismiss="modal">Simpan</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
