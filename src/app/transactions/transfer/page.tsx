"use client";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

export default function TransferMiles() {
  const { user } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const [availableMiles, setAvailableMiles] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    to_email: "",
    amount: 0,
    catatan: ""
  });

  const fetchData = async () => {
    if (!user?.email) return;
    try {
      // Ambil saldo terbaru
      const resMember = await fetch(`/api/dashboard?email=${user.email}`);
      const jsonMember = await resMember.json();
      if (jsonMember.success) setAvailableMiles(jsonMember.user.award_miles);

      // Ambil history transfer
      const resHistory = await fetch(`/api/transactions/transfer?email=${user.email}`);
      const jsonHistory = await resHistory.json();
      if (jsonHistory.success) setHistory(jsonHistory.data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchData(); }, [user?.email]);

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/transactions/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, from_email: user?.email }),
      });
      const json = await res.json();
      if (json.success) {
        setShowModal(false);
        fetchData();
        alert("Transfer Berhasil!");
      } else {
        alert(json.message);
      }
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>
      
      {/* Header (Gambar 1 - image_f9f5c3) */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Transfer Miles</h2>
          <p className="text-muted mb-0">Award Miles tersedia: <span className="fw-bold text-primary">{availableMiles.toLocaleString('id-ID')}</span></p>
        </div>
        <button className="btn btn-primary fw-semibold shadow-sm" style={{ backgroundColor: "#0A2463", borderRadius: "8px" }} onClick={() => setShowModal(true)}>
          + Transfer Baru
        </button>
      </div>

      {/* Tabel Riwayat (Gambar 1 - image_f9f5c3) */}
      <div className="card shadow-sm border-0" style={{ borderRadius: "12px", height: "fit-content" }}>
        <div className="card-body p-4">
          <h5 className="fw-bold mb-4">Riwayat Transfer</h5>
          <table className="table table-hover mb-0">
            <thead className="bg-light text-muted small">
              <tr>
                <th className="py-3 border-0">Waktu</th>
                <th className="py-3 border-0">Member</th>
                <th className="py-3 border-0 text-center">Jumlah Miles</th>
                <th className="py-3 border-0">Catatan</th>
                <th className="py-3 border-0 text-center">Tipe</th>
                <th className="py-3 border-0 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {history.map((t, i) => (
                <tr key={i} className="align-middle border-bottom">
                  <td className="py-3 text-muted">
                    {new Date(t.waktu).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                  </td>
                  <td className="py-3">
                    <div className="fw-bold">{t.first_mid_name} {t.last_name}</div>
                    <div className="small text-muted">{t.other_email}</div>
                  </td>
                  <td className={`py-3 text-center fw-bold ${t.tipe === 'Kirim' ? 'text-danger' : 'text-success'}`}>
                    {t.tipe === 'Kirim' ? '-' : '+'}{t.jumlah.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3 text-muted">{t.catatan || "-"}</td>
                  <td className="py-3 text-center">
                    {/* Badge Tipe Transaksi */}
                    <span className={`badge rounded-pill px-3 py-2 ${t.tipe === 'Kirim' ? 'bg-light text-dark border' : 'bg-primary'}`}>
                      {t.tipe}
                    </span>
                  </td>
                  <td className="py-3 text-center text-muted">
                    {/* Lu bisa ganti ikon ini jadi tombol Detail kalau mau */}
                    <i className="bi bi-info-circle"></i>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL TRANSFER (Gambar 2 - image_f9f31c) */}
      {showModal && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg p-3" style={{ borderRadius: "16px" }}>
              <div className="modal-header border-0 pb-0">
                <h5 className="fw-bold">Transfer Miles</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleTransfer} className="modal-body p-4">
                <div className="mb-3">
                  <label className="form-label fw-semibold small">Email Penerima</label>
                  <input type="email" className="form-control" placeholder="contoh@mail.com" onChange={(e) => setFormData({...formData, to_email: e.target.value})} required />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold small">Jumlah Miles</label>
                  <input type="number" className="form-control" placeholder="0" min="1" max={availableMiles} onChange={(e) => setFormData({...formData, amount: parseInt(e.target.value)})} required />
                  <small className="text-muted">Maksimal: {availableMiles.toLocaleString()} miles</small>
                </div>
                <div className="mb-4">
                  <label className="form-label fw-semibold small">Catatan (opsional)</label>
                  <textarea className="form-control" rows={3} placeholder="Contoh: Hadiah ulang tahun" onChange={(e) => setFormData({...formData, catatan: e.target.value})}></textarea>
                </div>
                <div className="d-flex justify-content-end">
                  <button type="submit" disabled={loading} className="btn btn-primary px-4 fw-semibold" style={{ backgroundColor: "#0A2463", borderRadius: "8px" }}>
                    {loading ? "Memproses..." : "Transfer Sekarang"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}