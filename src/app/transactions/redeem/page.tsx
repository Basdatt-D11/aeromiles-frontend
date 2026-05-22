"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function RedeemHadiah() {
  const { user } = useAuth();
  const [hadiahList, setHadiahList] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/hadiah").then(res => res.json()).then(data => {
      if (data.success) setHadiahList(data.data);
    });
  }, []);

  const openConfirm = (item: any) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleRedeem = async () => {
    if (!user || !selectedItem) return;
    setLoading(true);
    try {
      const res = await fetch("/api/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email_member: user.email, kode_hadiah: selectedItem.kode_hadiah }),
      });
      const data = await res.json();
      alert(data.message || data.error);
      if (res.ok) setShowModal(false);
    } catch (e) {
      alert("Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid p-4">
      <h2 className="fw-bold mb-4">Redeem Hadiah</h2>
      
      <div className="row g-4">
        {hadiahList.map((h, i) => (
          <div className="col-md-4" key={i}>
            <div className="card shadow-sm h-100">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between mb-2">
                  <span className="badge bg-primary">{h.kode_hadiah}</span>
                  <span className="fw-bold text-success">{h.miles.toLocaleString()} Miles</span>
                </div>
                <h5 className="fw-bold mb-3">{h.nama}</h5>
                <button onClick={() => openConfirm(h)} className="btn btn-outline-primary w-100">Redeem</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* STANDARD MODAL (Style Hapus Klaim) */}
      {showModal && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Konfirmasi Redeem</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Apakah Anda yakin ingin menukar <strong>{selectedItem?.miles.toLocaleString()} miles</strong> untuk <strong>{selectedItem?.nama}</strong>?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Batal</button>
                <button type="button" className="btn btn-primary" disabled={loading} onClick={handleRedeem}>
                  {loading ? "Memproses..." : "Ya, Redeem"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}