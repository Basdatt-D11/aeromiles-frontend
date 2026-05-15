"use client";

import { useState } from "react";

export default function BuyPackage() {
  const [message, setMessage] = useState<{ text: string; type: "success" | "danger" } | null>(null);
  const emailMember = "john@example.com"; 
  
  const dummyPackages = [
    { id: "AMP-001", harga: 500000, jumlah: 1000 },
    { id: "AMP-002", harga: 1200000, jumlah: 2500 },
    { id: "AMP-003", harga: 2300000, jumlah: 5000 },
  ];

  const handleBuy = async (id_package: string) => {
    if (!confirm("Lanjutkan pembelian paket ini?")) return;

    try {
      const res = await fetch("/api/package", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailMember, id_package }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage({ text: data.message || "Pembelian Berhasil!", type: "success" });
      } else {
        setMessage({ text: data.error || "Pembelian Gagal", type: "danger" });
      }
    } catch (error: any) {
      setMessage({ text: "Terjadi kesalahan sistem.", type: "danger" });
    }
  };

  return (
    <>
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Beli Award Miles Package</h2>
        <p className="text-muted">Tingkatkan miles Anda dengan membeli paket eksklusif</p>
      </div>

      {message && (
        <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
          {message.text}
          <button type="button" className="btn-close" onClick={() => setMessage(null)}></button>
        </div>
      )}

      <div className="row g-4">
        {dummyPackages.map((pkg, idx) => (
          <div className="col-md-4" key={idx}>
            <div className="card shadow-sm h-100 border-0 text-center py-4">
              <div className="card-body">
                <h5 className="text-muted mb-3">{pkg.id}</h5>
                <h2 className="fw-bold text-primary mb-1">{pkg.jumlah.toLocaleString('id-ID')}</h2>
                <p className="text-muted mb-4">Award Miles</p>
                <h4 className="fw-bold mb-4">Rp {pkg.harga.toLocaleString('id-ID')}</h4>
                <button 
                  onClick={() => handleBuy(pkg.id)}
                  className="btn btn-primary px-4 py-2 w-75 fw-medium"
                >
                  Beli Paket
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}