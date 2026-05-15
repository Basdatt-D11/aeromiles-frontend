"use client";

import { useEffect, useState } from "react";

export default function LaporanTransaksi() {
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    fetch("/api/report")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setReport(data.data);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Laporan Transaksi</h2>
        <p className="text-muted">Ringkasan aktivitas dan transaksi sistem AeroMiles</p>
      </div>

      {report ? (
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card shadow-sm h-100 border-0 border-start border-4 border-primary">
              <div className="card-body p-4">
                <h6 className="text-muted mb-3">Status Klaim Miles</h6>
                {report.claim_stats.map((c: any, idx: number) => (
                  <div key={idx} className="d-flex justify-content-between mb-2">
                    <span className="fw-medium">{c.status_penerimaan}</span>
                    <span className="fw-bold text-primary">{c.total}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm h-100 border-0 border-start border-4 border-success">
              <div className="card-body p-4">
                <h6 className="text-muted mb-3">Total Transfer Miles</h6>
                <h2 className="fw-bold text-success mb-0">
                  {report.transfer_stats.total_miles_transferred || 0}
                </h2>
                <small className="text-muted">Miles telah ditransfer antar member</small>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm h-100 border-0 border-start border-4 border-warning">
              <div className="card-body p-4">
                <h6 className="text-muted mb-3">Statistik Redeem Hadiah</h6>
                {report.redeem_stats.length > 0 ? (
                  report.redeem_stats.map((r: any, idx: number) => (
                    <div key={idx} className="d-flex justify-content-between mb-2">
                      <span className="badge bg-warning text-dark">{r.kode_hadiah}</span>
                      <span className="fw-bold">{r.total_redeem} kali</span>
                    </div>
                  ))
                ) : (
                  <p className="text-muted small">Belum ada data redeem.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-5 text-muted">Memuat data laporan...</div>
      )}
    </>
  );
}