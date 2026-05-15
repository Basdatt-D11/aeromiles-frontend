"use client";

import { useEffect, useState } from "react";

export default function InfoTier() {
  const [stats, setStats] = useState<any>(null);
  const emailMember = "john@example.com";

  useEffect(() => {
    fetch(`/api/member/stats?email=${emailMember}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setStats(data.data);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Informasi Tier</h2>
        <p className="text-muted">Pantau status keanggotaan dan progres tier Anda</p>
      </div>

      {stats ? (
        <div className="row g-4">
          <div className="col-md-6">
            <div className="card shadow-sm h-100 border-0">
              <div className="card-body p-4 text-center">
                <h5 className="text-muted mb-3">Tier Saat Ini</h5>
                <h1 className="fw-bold text-primary mb-3 display-4">{stats.nama_tier}</h1>
                <p className="text-muted">Pertahankan tingkat terbang Anda untuk menikmati keuntungan eksklusif.</p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card shadow-sm h-100 border-0">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4">Statistik Miles</h5>
                <div className="d-flex justify-content-between mb-3 border-bottom pb-2">
                  <span className="text-muted">Total Miles Sejak Bergabung</span>
                  <span className="fw-bold">{stats.total_miles}</span>
                </div>
                <div className="d-flex justify-content-between mb-3 border-bottom pb-2">
                  <span className="text-muted">Award Miles (Dapat Ditukar)</span>
                  <span className="fw-bold text-success">{stats.award_miles}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-5 text-muted">Memuat informasi tier...</div>
      )}
    </>
  );
}