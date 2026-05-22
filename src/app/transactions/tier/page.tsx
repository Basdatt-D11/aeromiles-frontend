"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

// Data dummy untuk list tier sesuai desain
const TIER_LIST = [
  {
    nama: "Blue",
    minPenerbangan: 0,
    minMiles: 0,
    keuntungan: [
      "Akumulasi miles dasar",
      "Akses penawaran khusus member"
    ]
  },
  {
    nama: "Silver",
    minPenerbangan: 10,
    minMiles: 15000,
    keuntungan: [
      "Bonus miles 25%",
      "Priority check-in",
      "Akses lounge partner"
    ]
  },
  {
    nama: "Gold",
    minPenerbangan: 25,
    minMiles: 40000,
    keuntungan: [
      "Bonus miles 50%",
      "Priority boarding",
      "Akses lounge premium",
      "Extra bagasi 10kg"
    ]
  },
  {
    nama: "Platinum",
    minPenerbangan: 50,
    minMiles: 80000,
    keuntungan: [
      "Bonus miles 100%",
      "Upgrade gratis (subject to availability)",
      "Akses lounge first class",
      "Extra bagasi 20kg",
      "Dedicated hotline"
    ]
  }
];

export default function InfoTier() {
  const { user } = useAuth(); // ✅ Tarik email dari context biar dinamis
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (!user?.email) return;
    fetch(`/api/member/stats?email=${user.email}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setStats(data.data);
      })
      .catch((err) => console.error(err));
  }, [user?.email]);

  // Logic Progress Bar
  let nextTier: any = null;
  let progressPersen = 100;
  let currentMiles = stats?.total_miles || 0;

  if (stats) {
    const currentTierIndex = TIER_LIST.findIndex(t => t.nama.toLowerCase() === stats.nama_tier?.toLowerCase());
    if (currentTierIndex !== -1 && currentTierIndex < TIER_LIST.length - 1) {
      nextTier = TIER_LIST[currentTierIndex + 1]; // Ambil tier di atasnya
      progressPersen = (currentMiles / nextTier.minMiles) * 100; // Hitung persen
    }
  }

  return (
  <div className="container-fluid p-4" style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>
    <div className="mx-auto" style={{ maxWidth: "900px" }}>
      
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Info Tier</h2>
      </div>

      {stats ? (
        <div className="d-flex flex-column gap-3">
          
          {/* SECTION PROGRESS BAR */}
          {nextTier ? (
            <div className="card shadow-sm border-0" style={{ borderRadius: "12px", border: "1px solid #E2E8F0" }}>
              <div className="card-body p-4">
                <h6 className="fw-bold mb-3">Progress ke Tier Berikutnya: {nextTier.nama}</h6>
                <div className="d-flex justify-content-between mb-2 small text-muted">
                  <span>Total Miles</span>
                  <span className="fw-bold text-dark">
                    {currentMiles.toLocaleString('id-ID')} / {nextTier.minMiles.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="progress" style={{ height: "8px", borderRadius: "4px" }}>
                  <div 
                    className="progress-bar" 
                    role="progressbar" 
                    style={{ width: `${progressPersen}%`, backgroundColor: "#0A2463" }} 
                  ></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="card shadow-sm border-0" style={{ borderRadius: "12px" }}>
              <div className="card-body p-4">
                <h6 className="fw-bold mb-2">Progress Tier</h6>
                <p className="text-muted mb-0 small">Luar biasa! Anda sudah mencapai tier tertinggi (Platinum).</p>
              </div>
            </div>
          )}

          {/* SECTION LIST TIER */}
          <div className="d-flex flex-column gap-3 mt-2">
            {TIER_LIST.map((tier, idx) => {
              const isCurrentTier = stats.nama_tier?.toLowerCase() === tier.nama.toLowerCase();
              
              return (
                <div 
                  key={idx} 
                  className={`card shadow-sm ${isCurrentTier ? 'border-warning' : 'border-0'}`} 
                  style={{ 
                    borderRadius: "12px", 
                    borderWidth: isCurrentTier ? "2px" : "1px", 
                    borderColor: isCurrentTier ? "#F59E0B" : "#E2E8F0",
                    backgroundColor: isCurrentTier ? "#FFFBEB" : "#FFFFFF"
                  }}
                >
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center mb-3">
                      <div 
                        className="d-flex align-items-center justify-content-center me-3" 
                        style={{ 
                          width: "48px", 
                          height: "48px", 
                          borderRadius: "12px", 
                          backgroundColor: isCurrentTier ? "#FDE68A" : "#F1F5F9",
                          color: isCurrentTier ? "#D97706" : "#64748B"
                        }}
                      >
                        <i className="bi bi-award-fill fs-4"></i>
                      </div>
                      <div>
                        <h5 className="fw-bold mb-0 d-flex align-items-center">
                          {tier.nama}
                          {isCurrentTier && (
                            <span className="badge ms-2 small text-white" style={{ backgroundColor: "#3B82F6", fontSize: "0.7rem", borderRadius: "6px" }}>Tier Anda</span>
                          )}
                        </h5>
                        <span className="text-muted small">
                          Min. {tier.minPenerbangan} penerbangan • Min. {tier.minMiles.toLocaleString('id-ID')} miles
                        </span>
                      </div>
                    </div>

                    <h6 className="fw-bold small mb-2">Keuntungan:</h6>
                    <ul className="list-unstyled mb-0 small text-muted">
                      {tier.keuntungan.map((untung, i) => (
                        <li key={i} className="mb-1 d-flex align-items-center">
                          <i className="bi bi-check-circle-fill text-success me-2"></i>
                          {untung}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      ) : (
        <div className="text-center py-5 text-muted">
          <div className="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
          Memuat informasi tier...
        </div>
      )}

    </div>
  </div>
);
}