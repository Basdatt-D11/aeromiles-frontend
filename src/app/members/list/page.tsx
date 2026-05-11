"use client";

import { useState } from "react";

export default function ListMember() {
  const [memberList] = useState([
    { no_member: "M0001", nama: "Mr. John William Doe", email: "john@example.com", tier: "Gold", total_miles: 45000, award_miles: 32000, bergabung: "2024-01-15" },
    { no_member: "M0002", nama: "Alice Smith", email: "alice@example.com", tier: "Silver", total_miles: 15000, award_miles: 12000, bergabung: "2024-02-20" },
    { no_member: "M0003", nama: "Bob Johnson", email: "bob@example.com", tier: "Blue", total_miles: 5000, award_miles: 4500, bergabung: "2024-03-10" },
    { no_member: "M0004", nama: "Charlie Brown", email: "charlie@example.com", tier: "Platinum", total_miles: 65000, award_miles: 60000, bergabung: "2023-12-05" }
  ]);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Kelola Member</h3>
        <button className="btn btn-primary fw-bold" data-bs-toggle="modal" data-bs-target="#addMemberModal">
          + Tambah Member
        </button>
      </div>

      <div className="row g-2 mb-3">
        <div className="col-md-9">
          <input type="text" className="form-control" placeholder="Cari nama, email, atau nomor member..." />
        </div>
        <div className="col-md-3">
          <select className="form-select">
            <option>Semua Tier</option>
            <option>Gold</option>
            <option>Silver</option>
            <option>Blue</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        <table className="table table-hover m-0">
          <thead>
            <tr>
              <th className="ps-4">No. Member</th>
              <th>Nama</th>
              <th>Email</th>
              <th>Tier</th>
              <th>Total Miles</th>
              <th>Award Miles</th>
              <th>Bergabung</th>
              <th className="text-center pe-4">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {memberList.map((m, index) => (
              <tr key={index}>
                <td className="ps-4"><strong>{m.no_member}</strong></td>
                <td>{m.nama}</td>
                <td>{m.email}</td>
                <td>
                  <span className={`badge ${
                    m.tier === 'Gold' ? 'bg-warning text-dark' : 
                    m.tier === 'Silver' ? 'bg-light text-dark border' : 
                    m.tier === 'Platinum' ? 'bg-primary' : 'bg-secondary'
                  }`}>
                    {m.tier}
                  </span>
                </td>
                <td>{m.total_miles}</td>
                <td>{m.award_miles}</td>
                <td>{m.bergabung}</td>
                <td className="text-center pe-4">
                  <button className="btn btn-sm btn-light btn-action me-1" data-bs-toggle="modal" data-bs-target="#editMemberModal">
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button className="btn btn-sm btn-light btn-action text-danger" data-bs-toggle="modal" data-bs-target="#deleteMemberModal">
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
            {memberList.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center text-muted py-4">Belum ada data member.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Member Modal */}
      <div className="modal fade" id="addMemberModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content" style={{ borderRadius: "20px", border: "none" }}>
            <div className="modal-header border-0 pt-4 px-4 pb-0">
              <h5 className="modal-title fw-bold">Tambah Member Baru</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body p-4">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted">Email</label>
                  <input type="email" className="form-control bg-light border-0" />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted">Password</label>
                  <input type="password" className="form-control bg-light border-0" />
                </div>
                <div className="col-md-12">
                  <label className="form-label small fw-bold text-muted">Salutation</label>
                  <select className="form-select bg-light border-0">
                    <option>Mr.</option>
                    <option>Ms.</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted">Nama Depan</label>
                  <input type="text" className="form-control bg-light border-0" />
                </div>
                <div className="col-md-6"></div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted">Nama Belakang</label>
                  <input type="text" className="form-control bg-light border-0" />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted">Kewarganegaraan</label>
                  <select className="form-select bg-light border-0">
                    <option>Indonesia</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted">Country Code</label>
                  <select className="form-select bg-light border-0">
                    <option>+62</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted">Nomor HP</label>
                  <input type="text" className="form-control bg-light border-0" />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted">Tanggal Lahir</label>
                  <input type="date" className="form-control bg-light border-0" defaultValue="1976-01-12" />
                </div>
              </div>
              <div className="text-end mt-4">
                <button type="button" className="btn btn-primary px-4 fw-bold" style={{ backgroundColor: "#041e42" }} data-bs-dismiss="modal">Simpan</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Member Modal */}
      <div className="modal fade" id="editMemberModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content" style={{ borderRadius: "20px", border: "none" }}>
            <div className="modal-header border-0 pt-4 px-4 pb-0">
              <h5 className="modal-title fw-bold" style={{ fontFamily: "var(--font-poppins)" }}>Edit Member</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body p-4">
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label small fw-bold text-muted">Salutation</label>
                  <select className="form-select bg-light border-0" defaultValue="Mr.">
                    <option>Mr.</option>
                    <option>Ms.</option>
                    <option>Mrs.</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted">Nama Depan</label>
                  <input type="text" className="form-control bg-light border-0" defaultValue="John" />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted">Nama Tengah</label>
                  <input type="text" className="form-control bg-light border-0" defaultValue="William" />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted">Nama Belakang</label>
                  <input type="text" className="form-control bg-light border-0" defaultValue="Doe" />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted">Kewarganegaraan</label>
                  <select className="form-select bg-light border-0" defaultValue="Indonesia">
                    <option>Indonesia</option>
                    <option>Luar Negeri</option>
                  </select>
                </div>

                <div className="col-md-4">
                  <label className="form-label small fw-bold text-muted">Country Code</label>
                  <select className="form-select bg-light border-0" defaultValue="+62">
                    <option>+62</option>
                    <option>+1</option>
                  </select>
                </div>
                <div className="col-md-8">
                  <label className="form-label small fw-bold text-muted">Nomor HP</label>
                  <input type="text" className="form-control bg-light border-0" defaultValue="81234567890" />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted">Tanggal Lahir</label>
                  <input type="date" className="form-control bg-light border-0" defaultValue="1990-05-15" />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted">Tier</label>
                  <select className="form-select bg-light border-0" defaultValue="Gold">
                    <option>Gold</option>
                    <option>Silver</option>
                    <option>Blue</option>
                  </select>
                </div>
              </div>

              <div className="text-end mt-4">
                <button type="button" className="btn btn-primary px-5 fw-bold" style={{ backgroundColor: "#041e42", borderRadius: "8px" }} data-bs-dismiss="modal">Simpan</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Member Modal */}
      <div className="modal fade" id="deleteMemberModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content" style={{ borderRadius: "15px", border: "none" }}>
            <div className="modal-body p-4">
              <h5 className="fw-bold mb-3">Hapus Member?</h5>
              <p className="text-muted" style={{ fontSize: "0.9rem" }}>
                Semua data terkait (Identitas, Klaim, Transfer, Redeem) akan ikut terhapus. Tindakan ini tidak dapat
                dibatalkan.
              </p>
              <div className="d-flex justify-content-end gap-2 mt-4">
                <button type="button" className="btn btn-light px-4" data-bs-dismiss="modal">Batal</button>
                <button type="button" className="btn btn-primary px-4" style={{ backgroundColor: "#041e42" }} data-bs-dismiss="modal">Hapus</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
