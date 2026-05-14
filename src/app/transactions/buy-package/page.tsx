"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

export default function BuyPackage() {
  const { user } = useAuth();
  const [packages, setPackages] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [userStats, setUserStats] = useState<any>(null);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [message, setMessage] = useState({ text: "", type: "" });

  // 1. Ambil data dari Database
  const fetchData = async () => {
    if (!user?.email) return;
    try {
      // Ambil List Paket
      const resPkg = await fetch("/api/packages");
      const dataPkg = await resPkg.json();
      setPackages(dataPkg);

      // Ambil Saldo Real-time
      const resStats = await fetch(`/api/member/stats?email=${user.email}`);
      const dataStats = await resStats.json();
      setUserStats(dataStats);

      // Ambil Riwayat Pembelian (Optional, sesuaikan endpoint lu)
      const resHistory = await fetch(`/api/package/history?email=${user.email}`);
      const dataHistory = await resHistory.json();
      setHistory(dataHistory);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  // 2. Eksekusi Pembelian (Triggering Postgres Trigger)
  const handleConfirmPurchase = async () => {
    if (!selectedPackage || !user) return;
    setMessage({ text: "", type: "" });

    try {
      const res = await fetch("/api/package", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          id_package: selectedPackage.id, // Sesuaikan PK di tabel lu (biasanya 'id')
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      // Tampilkan Pesan SUKSES sesuai spek ijo lu
      setMessage({ 
        text: data.message || `SUKSES: Pembelian package berhasil. Award miles dan total miles Anda bertambah.`, 
        type: "success" 
      });
      
      fetchData(); // Refresh saldo otomatis setelah beli
    } catch (err: any) {
      setMessage({ text: err.message, type: "danger" });
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="m-0 fw-bold">Beli Award Miles Package</h4>
          <small className="text-muted">Pilih paket miles yang tersedia untuk menambah saldo Anda</small>
        </div>
        <div>
          <span className="badge bg-primary p-2">
            Saldo Miles: <strong>{userStats?.award_miles?.toLocaleString("id-ID") || "0"}</strong>
          </span>
        </div>
      </div>

      {/* Alert Notifikasi */}
      {message.text && (
        <div className={`alert alert-${message.type} shadow-sm mb-4`} role="alert">
          <i className={`bi bi-${message.type === 'success' ? 'check-circle' : 'exclamation-triangle'}-fill me-2`}></i>
          {message.text}
        </div>
      )}

      <div className="row g-3 mb-4">
        {packages.map((p) => (
          <div key={p.id} className="col-md-3">
            <div className="card p-3 text-center border-0 shadow-sm h-100">
              <div className="mb-2 text-muted small fw-bold text-uppercase">{p.id}</div>
              <h4 className="mt-1 fw-bold text-primary">{p.jumlah_award_miles?.toLocaleString("id-ID")} Miles</h4>
              <div className="my-2 text-success fw-semibold">Rp {Number(p.harga || 0).toLocaleString("id-ID")}</div>
              <button 
                className="btn btn-primary btn-sm mt-auto" 
                data-bs-toggle="modal" 
                data-bs-target="#purchaseModal"
                onClick={() => setSelectedPackage(p)}
              >
                Beli Paket
              </button>
            </div>
          </div>
        ))}
      </div>

      <h5 className="mb-3 fw-bold">Riwayat Pembelian Paket</h5>
      <div className="card border-0 shadow-sm overflow-hidden">
        <table className="table mb-0 align-middle table-hover">
          <thead className="table-light">
            <tr>
              <th>ID Paket</th>
              <th>Miles Didapat</th>
              <th>Tanggal Transaksi</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h, idx) => (
              <tr key={idx}>
                <td>{h.id_award_miles_package}</td>
                <td className="text-success">+{h.jumlah_miles?.toLocaleString("id-ID")}</td>
                <td>{new Date(h.timestamp).toLocaleDateString("id-ID")}</td>
              </tr>
            ))}
            {history.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center text-muted py-4">Belum ada riwayat pembelian.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Konfirmasi */}
      <div className="modal fade" id="purchaseModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow">
            <div className="modal-header border-0">
              <h5 className="modal-title fw-bold">Konfirmasi Pembelian</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body text-center py-4">
               <i className="bi bi-cart-check text-primary" style={{fontSize: "3rem"}}></i>
              <p className="mt-3">Anda akan membeli paket <strong>{selectedPackage?.id}</strong> seharga:</p>
              <h4 className="fw-bold text-success">Rp {Number(selectedPackage?.price || 0).toLocaleString("id-ID")}</h4>
            </div>
            <div className="modal-footer border-0">
              <button type="button" className="btn btn-light" data-bs-dismiss="modal">Batal</button>
              <button type="button" className="btn btn-primary px-4" onClick={handleConfirmPurchase} data-bs-dismiss="modal">Konfirmasi</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}