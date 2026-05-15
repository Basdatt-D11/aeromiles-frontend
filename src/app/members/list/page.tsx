"use client";

import { useEffect, useState } from "react";

export default function ListMember() {
  const [members, setMembers] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/member")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setMembers(data.data);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Daftar Member</h2>
          <p className="text-muted">Kelola seluruh data anggota AeroMiles</p>
        </div>
        <a href="/members/add" className="btn btn-primary px-4 py-2">
          <i className="bi bi-plus-lg me-2"></i>Tambah Member
        </a>
      </div>

      <div className="table-container">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="px-4 py-3">No. Member</th>
                <th className="py-3">Nama Lengkap</th>
                <th className="py-3">Email</th>
                <th className="py-3">Tier</th>
                <th className="py-3">Total Miles</th>
                <th className="py-3">Award Miles</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {members.length > 0 ? (
                members.map((m, index) => (
                  <tr key={index}>
                    <td className="px-4 fw-semibold text-primary">{m.nomor_member}</td>
                    <td>{m.first_mid_name} {m.last_name}</td>
                    <td>{m.email}</td>
                    <td>
                      <span className={`badge ${m.id_tier === 'Gold' ? 'bg-warning' : m.id_tier === 'Platinum' ? 'bg-primary' : 'bg-secondary'}`}>
                        {m.id_tier}
                      </span>
                    </td>
                    <td>{m.total_miles}</td>
                    <td>{m.award_miles}</td>
                    <td className="px-4 text-center">
                      <button className="btn btn-sm btn-outline-primary btn-action me-2">
                        <i className="bi bi-eye-fill"></i>
                      </button>
                      <button className="btn btn-sm btn-outline-danger btn-action">
                        <i className="bi bi-trash-fill"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-muted">
                    Memuat data member...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}