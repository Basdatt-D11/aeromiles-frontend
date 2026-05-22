"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Swal from 'sweetalert2';

export default function BuyPackage() {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const dummyPackages = [
    { id: "AMP-001", harga: 500000, jumlah: 1000 },
    { id: "AMP-002", harga: 1200000, jumlah: 2500 },
    { id: "AMP-003", harga: 2300000, jumlah: 5000 },
  ];

  const openConfirm = (pkg: any) => {
    setSelectedPkg(pkg);
    setShowModal(true);
  };

  const handleBuy = async () => {
    if (!user || !selectedPkg) return;
    setLoading(true);
    try {
      const res = await fetch("/api/package", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, id_package: selectedPkg.id }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setShowModal(false);
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: data.message || 'Pembelian Berhasil!',
          confirmButtonColor: '#0A2463'
        });
      } else {
        Swal.fire({ icon: 'error', title: 'Gagal', text: data.message });
      }
    } catch (e) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Terjadi kesalahan sistem.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid p-4">
      <h2 className="fw-bold mb-4">Beli Award Miles Package</h2>
      <div className="row g-4">
        {dummyPackages.map((pkg, idx) => (
          <div className="col-md-4" key={idx}>
            <div className="card shadow-sm h-100 text-center py-4">
              <div className="card-body">
                <h5 className="text-muted mb-3">{pkg.id}</h5>
                <h2 className="fw-bold text-primary mb-1">{pkg.jumlah.toLocaleString('id-ID')}</h2>
                <p className="text-muted mb-4">Award Miles</p>
                <h4 className="fw-bold mb-4">Rp {pkg.harga.toLocaleString('id-ID')}</h4>
                <button onClick={() => openConfirm(pkg)} className="btn btn-primary px-4 py-2 w-75 fw-medium">
                  Beli Paket
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* STANDARD MODAL (Style Hapus Klaim) */}
      {showModal && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header text-start">
                <h5 className="modal-title fw-bold">Konfirmasi Pembelian</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body text-start">
                <p>Lanjutkan pembelian paket <strong>{selectedPkg?.jumlah.toLocaleString()} Miles</strong> seharga <strong>Rp {selectedPkg?.harga.toLocaleString('id-ID')}</strong>?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Batal</button>
                <button type="button" className="btn btn-primary" disabled={loading} onClick={handleBuy}>
                  {loading ? "Memproses..." : "Bayar Sekarang"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}