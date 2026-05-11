"use client";

import { useState } from "react";

export default function BuyPackage() {
  const [packages] = useState([
    { id: "PKG-10K", miles: 10000, price: 1500000 },
    { id: "PKG-25K", miles: 25000, price: 3500000 },
    { id: "PKG-50K", miles: 50000, price: 6500000 },
    { id: "PKG-100K", miles: 100000, price: 12000000 },
  ]);

  const [history] = useState([
    { id: 1, package_id: "PKG-10K", miles: 10000, price: 1500000, date: "2024-02-10" }
  ]);

  const [selectedPackage, setSelectedPackage] = useState<{id: string, miles: number, price: number} | null>(null);

  const handleConfirmPurchase = () => {
    if (selectedPackage) {
      alert(`Pembelian berhasil untuk paket: ${selectedPackage.id}\n(Ini demo; hubungkan ke backend untuk eksekusi nyata)`);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="m-0">Beli Award Miles Package</h4>
          <small className="text-muted">Pilih paket miles yang tersedia</small>
        </div>
        <div>
          <span className="badge bg-light text-dark">Saldo Miles: <strong>12.500</strong></span>
        </div>
      </div>

      <div className="row g-3 mb-4">
        {packages.map((p) => (
          <div key={p.id} className="col-md-3">
            <div className="card p-3 text-center">
              <div className="mb-2 text-muted small">{p.id}</div>
              <h5 className="mt-1">{p.miles.toLocaleString("id-ID")} Miles</h5>
              <div className="my-2">Rp {p.price.toLocaleString("id-ID")}</div>
              <button 
                className="btn btn-primary btn-action" 
                data-bs-toggle="modal" 
                data-bs-target="#purchaseModal"
                onClick={() => setSelectedPackage(p)}
              >
                Beli
              </button>
            </div>
          </div>
        ))}
      </div>

      <h5 className="mb-2">Riwayat Pembelian Paket</h5>
      <div className="table-container p-3">
        <table className="table mb-0 align-middle">
          <thead>
            <tr>
              <th>#</th>
              <th>ID Paket</th>
              <th>Miles</th>
              <th>Harga</th>
              <th>Tanggal</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h) => (
              <tr key={h.id}>
                <td>{h.id}</td>
                <td>{h.package_id}</td>
                <td>{h.miles.toLocaleString("id-ID")}</td>
                <td>Rp {h.price.toLocaleString("id-ID")}</td>
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

      {/* Purchase Modal */}
      <div className="modal fade" id="purchaseModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Konfirmasi Pembelian</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <p>Anda akan membeli paket berikut:</p>
              <p className="fw-semibold">{selectedPackage?.id}</p>
              <p className="text-muted">{selectedPackage?.miles.toLocaleString("id-ID")} miles</p>
              <p className="text-muted">Rp {selectedPackage?.price.toLocaleString("id-ID")}</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-light" data-bs-dismiss="modal">Batal</button>
              <button type="button" className="btn btn-primary" onClick={handleConfirmPurchase} data-bs-dismiss="modal">Konfirmasi Pembelian</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
