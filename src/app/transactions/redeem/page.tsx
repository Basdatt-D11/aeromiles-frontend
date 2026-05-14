"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

export default function RedeemList() {
  const { user } = useAuth();
  const [rewards, setRewards] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [userStats, setUserStats] = useState<any>(null);
  const [selectedReward, setSelectedReward] = useState<{kode: string, nama: string, miles: number} | null>(null);
  const [message, setMessage] = useState({ text: "", type: "" });

  // 1. Fetch Data Awal (Rewards, History, & Saldo)
  const fetchData = async () => {
    if (!user?.email) return;
    try {
      // Ambil Daftar Hadiah
      const resRewards = await fetch("/api/hadiah");
      const dataRewards = await resRewards.json();
      setRewards(dataRewards);

      // Ambil Saldo Miles (Pake API stats yang kita buat tadi)
      const resStats = await fetch(`/api/member/stats?email=${user.email}`);
      const dataStats = await resStats.json();
      setUserStats(dataStats);

      // Ambil Riwayat (Nanti lu buat API GET /api/redeem/history)
      // Sementara kita fokus ke fitur intinya dulu
    } catch (err) {
      console.error("Gagal fetch data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  // 2. Fungsi Eksekusi Redeem (Ke Backend -> Trigger Postgres)
  const handleConfirmRedeem = async () => {
    if (!selectedReward || !user) return;
    
    setMessage({ text: "", type: "" });

    try {
      const res = await fetch("/api/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email_member: user.email,
          kode_hadiah: selectedReward.kode,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Nangkep ERROR: Saldo tidak mencukupi / Hadiah tidak aktif
        throw new Error(data.error);
      }

      // Jika Berhasil (Pesan SUKSES dari Trigger)
      setMessage({ text: data.message || `Berhasil redeem ${selectedReward.nama}!`, type: "success" });
      fetchData(); // Refresh saldo dan list
    } catch (err: any) {
      setMessage({ text: err.message, type: "danger" });
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="m-0 fw-bold">Redeem Hadiah</h4>
          <small className="text-muted">Tukarkan miles Anda dengan reward menarik</small>
        </div>
        <div>
          <span className="badge bg-primary p-2">
            Saldo Miles: <strong>{userStats?.award_miles?.toLocaleString() || "0"}</strong>
          </span>
        </div>
      </div>

      {/* Alert Message untuk User */}
      {message.text && (
        <div className={`alert alert-${message.type} shadow-sm mb-4`} role="alert">
          <i className={`bi bi-${message.type === 'success' ? 'check-circle' : 'exclamation-triangle'}-fill me-2`}></i>
          {message.text}
        </div>
      )}

      <div className="row g-3 mb-4">
        {rewards.map((r) => (
          <div key={r.kode} className="col-md-6">
            <div className="card p-3 d-flex flex-row align-items-center border-0 shadow-sm">
              <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{ width: "100px", height: "70px" }}>
                <i className="bi bi-gift text-primary" style={{ fontSize: "2rem" }}></i>
              </div>
              <div className="ms-3 flex-grow-1">
                <h6 className="mb-1 fw-bold">{r.nama}</h6>
                <div className="d-flex gap-2 align-items-center">
                  <span className="badge bg-info-subtle text-info border border-info-subtle">{r.miles} miles</span>
                </div>
              </div>
              <div className="ms-3">
                <button 
                  className="btn btn-primary btn-sm px-3" 
                  data-bs-toggle="modal" 
                  data-bs-target="#redeemModal"
                  onClick={() => setSelectedReward({ kode: r.kode, nama: r.nama, miles: r.miles })}
                >
                  Redeem
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabel Riwayat (Bisa lu kembangin nanti buat fetch data dari tabel REDEEM) */}
      <h5 className="fw-bold mb-3">Riwayat Terbaru</h5>
      <div className="card border-0 shadow-sm p-3">
        <table className="table table-hover mb-0">
          <thead className="table-light">
            <tr>
              <th>Hadiah</th>
              <th>Miles</th>
              <th>Tanggal</th>
            </tr>
          </thead>
          <tbody>
            <tr className="small">
              <td colSpan={3} className="text-center text-muted py-3">Klik tombol redeem untuk memulai transaksi</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Modal Konfirmasi (Tetep pake Bootstrap murni sesuai layout.tsx lu) */}
      <div className="modal fade" id="redeemModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered border-0">
          <div className="modal-content border-0 shadow">
            <div className="modal-header border-0">
              <h5 className="modal-title fw-bold">Konfirmasi Tukar Miles</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body text-center py-4">
              <i className="bi bi-question-circle text-warning" style={{ fontSize: "3rem" }}></i>
              <p className="mt-3">Apakah Anda yakin ingin menukarkan <strong>{selectedReward?.miles} miles</strong> untuk:</p>
              <h5 className="fw-bold text-primary">{selectedReward?.nama}</h5>
            </div>
            <div className="modal-footer border-0">
              <button type="button" className="btn btn-light" data-bs-dismiss="modal">Batal</button>
              <button type="button" className="btn btn-primary px-4" onClick={handleConfirmRedeem} data-bs-dismiss="modal">Ya, Tukarkan!</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}