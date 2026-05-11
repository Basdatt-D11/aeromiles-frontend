"use client";

import { useState } from "react";

export default function TransactionReport() {
  const [transactions] = useState([
    { id: 1, member: "john@example.com", type: "Redeem", miles: -15000, amount: null, status: "Sukses", timestamp: "2024-05-10" },
    { id: 2, member: "alice@example.com", type: "Transfer", miles: -500, amount: null, status: "Sukses", timestamp: "2024-05-11" },
    { id: 3, member: "bob@example.com", type: "Purchase", miles: 10000, amount: 1500000, status: "Sukses", timestamp: "2024-05-12" }
  ]);

  const [topMembers] = useState([
    { member: "john@example.com", total_miles: 45000 },
    { member: "alice@example.com", total_miles: 15000 },
    { member: "bob@example.com", total_miles: 5000 }
  ]);

  const [selectedTxn, setSelectedTxn] = useState<number | null>(null);

  const handleDelete = () => {
    if (selectedTxn) {
      alert(`Transaksi ${selectedTxn} dihapus (demo)`);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="m-0">Laporan & Riwayat Transaksi</h4>
          <small className="text-muted">Filter dan pantau aktivitas transaksi member</small>
        </div>
        <div>
          <button className="btn btn-light">Export CSV</button>
        </div>
      </div>

      <div className="row">
        <div className="col-md-8">
          <div className="card p-3 mb-3">
            <form className="row g-2 align-items-center" onSubmit={(e) => e.preventDefault()}>
              <div className="col-auto">
                <input type="text" className="form-control" placeholder="Cari Member atau ID" />
              </div>
              <div className="col-auto">
                <select className="form-select">
                  <option value="">Semua Tipe</option>
                  <option>Redeem</option>
                  <option>Transfer</option>
                  <option>Purchase</option>
                </select>
              </div>
              <div className="col-auto">
                <input type="date" className="form-control" />
              </div>
              <div className="col-auto">
                <button className="btn btn-primary">Filter</button>
              </div>
            </form>
          </div>

          <div className="table-container p-3">
            <table className="table mb-0 align-middle">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Member</th>
                  <th>Tipe</th>
                  <th>Miles</th>
                  <th>Harga</th>
                  <th>Status</th>
                  <th>Waktu</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id}>
                    <td>{t.id}</td>
                    <td>{t.member}</td>
                    <td>{t.type}</td>
                    <td>{t.miles}</td>
                    <td>{t.amount ? `Rp ${t.amount.toLocaleString("id-ID")}` : "-"}</td>
                    <td>{t.status}</td>
                    <td>{t.timestamp}</td>
                    <td>
                      <button className="btn btn-sm btn-light me-1">Detail</button>
                      <button 
                        className="btn btn-sm btn-danger btn-delete" 
                        data-bs-toggle="modal" 
                        data-bs-target="#transactionDeleteModal"
                        onClick={() => setSelectedTxn(t.id)}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-3 mb-3">
            <h6 className="mb-3">Top Members (by miles)</h6>
            <ul className="list-unstyled mb-0">
              {topMembers.map((m, index) => (
                <li key={index} className="d-flex justify-content-between py-2 border-bottom">
                  <div>{m.member}</div>
                  <div className="text-muted">{m.total_miles.toLocaleString("id-ID")}</div>
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-3">
            <h6>Petunjuk</h6>
            <p className="small text-muted mb-0">Gunakan filter untuk menampilkan transaksi tertentu. Tombol Hapus hanya demo.</p>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <div className="modal fade" id="transactionDeleteModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title text-danger">Konfirmasi Hapus Transaksi</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <p>Apakah Anda yakin ingin menghapus catatan transaksi ini?</p>
              <p className="fw-semibold">ID Transaksi: {selectedTxn}</p>
              <p className="text-muted small">Tindakan ini tidak dapat dibatalkan dan dapat mempengaruhi perhitungan total miles.</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-light" data-bs-dismiss="modal">Batal</button>
              <button type="button" className="btn btn-danger" onClick={handleDelete} data-bs-dismiss="modal">Hapus Transaksi</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
