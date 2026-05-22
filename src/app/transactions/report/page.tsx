"use client";

import { useEffect, useState } from "react";

export default function LaporanTransaksi() {
  const [activeTab, setActiveTab] = useState<'riwayat' | 'top'>('riwayat');
  const [report, setReport] = useState<any>({ transactions: [], claim_stats: [], transfer_stats: { total_miles_transferred: 0 }, redeem_stats: [] });
  const [topMembers, setTopMembers] = useState<any[]>([]);

  const [top5Message, setTop5Message] = useState<string | null>(null);

  useEffect(() => {
    // 1. Fetch data statistik (klaim/transfer)
    fetch("/api/report").then(res => res.json()).then(data => {
      if (data.success) setReport(data.data);
    });
    
    // 2. Fetch data tabel Top Member (yang baru kita buat)
    fetch("/api/report/top_members").then(res => res.json()).then(data => {
      if (data.success) setTopMembers(data.data);
    });
    
    // 3. Fetch pesan dari Dosen
    fetch("/api/report/top5").then(res => res.json()).then(data => {
      if (data.success) setTop5Message(data.message);
    });
  }, []);

  return (
    <div className="container-fluid p-4">
      <h2 className="fw-bold mb-4">Laporan Transaksi</h2>

      {/* HEADER STATISTIK (Ditaruh di luar Tab agar selalu muncul) */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card p-4 shadow-sm border-0 border-start border-4 border-primary">
            <h6 className="text-muted">Total Transfer Miles</h6>
            <h3 className="fw-bold text-primary">{report.transfer_stats?.total_miles_transferred || 0}</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-4 shadow-sm border-0 border-start border-4 border-success">
            <h6 className="text-muted">Total Klaim</h6>
            <h3 className="fw-bold text-success">{report.claim_stats?.length || 0} Status</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-4 shadow-sm border-0 border-start border-4 border-warning">
            <h6 className="text-muted">Total Data Redeem</h6>
            <h3 className="fw-bold text-warning">{report.redeem_stats?.length || 0} Data</h3>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="d-flex gap-2 mb-4">
        <button 
          className={`btn ${activeTab === 'riwayat' ? 'btn-primary' : 'btn-outline-secondary'}`}
          onClick={() => setActiveTab('riwayat')}>Riwayat Transaksi</button>
        <button 
          className={`btn ${activeTab === 'top' ? 'btn-primary' : 'btn-outline-secondary'}`}
          onClick={() => setActiveTab('top')}>Top Member</button>
      </div>

      {activeTab === 'riwayat' ? (
        <div className="card shadow-sm border-0">
          <table className="table align-middle mb-0">
            <thead className="table-light text-muted small">
              <tr>
                <th className="px-4 py-3">Tipe</th><th>Email Member</th><th>Miles</th><th>Waktu</th>
              </tr>
            </thead>
            <tbody>
              {report.transactions?.map((t: any, i: number) => (
                <tr key={i}>
                  <td className="px-4"><span className={`badge ${t.tipe === 'Klaim' ? 'bg-info' : 'bg-secondary'}`}>{t.tipe}</span></td>
                  <td>{t.email}</td>
                  <td className={`fw-bold ${t.miles > 0 ? 'text-success' : 'text-danger'}`}>{t.miles > 0 ? `+${t.miles}` : t.miles}</td>
                  <td className="text-muted small">{new Date(t.waktu).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card shadow-sm border-0">
          <table className="table align-middle mb-0">
            <thead className="table-light text-muted small">
              <tr>
                <th className="px-4 py-3">Peringkat</th><th>Email Member</th><th>Total Miles</th>
              </tr>
            </thead>
            <tbody>
              {topMembers.map((m, i) => (
                <tr key={i}>
                  <td className="px-4 fw-bold text-primary">{i + 1}</td>
                  <td>{m.email}</td> {/* Pakai m.email karena kolomnya 'email' */}
                  <td>{m.total_miles?.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}