"use client";

import { useAuth } from "@/context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  // Mock static stats for UI testing
  const mockUserStats = {
    telepon: "+62 812-XXXX-XXXX",
    no_member: "M-XXXX",
    tier: "Blue",
    total_miles: "15000",
    klaim_menunggu: "2",
    kode_maskapai: "GA",
    klaim_disetujui: "10",
    klaim_ditolak: "1",
  };

  if (!user) {
    return (
      <div className="alert alert-info">
        Silakan <a href="/auth/login" className="alert-link">login</a> terlebih dahulu.
      </div>
    );
  }

  return (
    <>
      <div className="mb-4">
        <h2 className="fw-bold">Dashboard</h2>
        <p className="text-muted">
          Selamat datang, <span className="text-primary fw-semibold">{user.nama}</span>
        </p>
      </div>

      <div className="card card-stat shadow-sm mb-4">
        <div className="card-body p-4">
          <h5 className="fw-bold mb-3">Informasi Pribadi</h5>
          <div className="row g-4">
            <div className="col-md-3">
              <small className="text-muted d-block">Nama Lengkap:</small>
              <span className="fw-semibold">{user.nama}</span>
            </div>
            <div className="col-md-3">
              <small className="text-muted d-block">Email:</small>
              <span className="fw-semibold">{user.email}</span>
            </div>
            <div className="col-md-3">
              <small className="text-muted d-block">Role:</small>
              <span className="fw-semibold">{user.role}</span>
            </div>
            <div className="col-md-3">
              <small className="text-muted d-block">Telepon:</small>
              <span className="fw-semibold">{mockUserStats.telepon}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3 mb-4">
        {user.role === "MEMBER" ? (
          <>
            <div className="col-md-3">
              <div className="card card-stat shadow-sm p-3 border-start border-4 border-primary">
                <small className="text-muted">Nomor Member</small>
                <h4 className="fw-bold m-0">{mockUserStats.no_member}</h4>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card card-stat shadow-sm p-3 border-start border-4 border-warning">
                <small className="text-muted">Tier</small>
                <h4 className="fw-bold m-0 text-warning">{mockUserStats.tier}</h4>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card card-stat shadow-sm p-3 border-start border-4 border-info">
                <small className="text-muted">Total Miles</small>
                <h4 className="fw-bold m-0">{mockUserStats.total_miles}</h4>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card card-stat shadow-sm p-3 border-start border-4 border-success">
                <small className="text-muted">Klaim Menunggu</small>
                <h4 className="fw-bold m-0">{mockUserStats.klaim_menunggu}</h4>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="col-md-2" style={{ width: "20%" }}>
              <div className="card card-stat shadow-sm p-3 border-start border-4 border-dark bg-white h-100">
                <i className="bi bi-person-badge text-muted mb-2" style={{ fontSize: "1.5rem" }}></i>
                <small className="text-muted fw-medium">Email Staf</small>
                <h6 className="fw-bold m-0" style={{ fontSize: "0.8rem" }}>{user.email}</h6>
              </div>
            </div>
            <div className="col-md-2" style={{ width: "20%" }}>
              <div className="card card-stat shadow-sm p-3 border-start border-4 border-primary bg-white h-100">
                <i className="bi bi-airplane text-primary mb-2" style={{ fontSize: "1.5rem" }}></i>
                <small className="text-muted fw-medium">Maskapai</small>
                <h5 className="fw-bold m-0">{mockUserStats.kode_maskapai}</h5>
              </div>
            </div>
            <div className="col-md-2" style={{ width: "20%" }}>
              <div className="card card-stat shadow-sm p-3 border-start border-4 border-warning bg-white h-100">
                <i className="bi bi-clock-history text-warning mb-2" style={{ fontSize: "1.5rem" }}></i>
                <small className="text-muted fw-medium">Klaim Menunggu</small>
                <h4 className="fw-bold m-0 text-warning">{mockUserStats.klaim_menunggu}</h4>
              </div>
            </div>
            <div className="col-md-2" style={{ width: "20%" }}>
              <div className="card card-stat shadow-sm p-3 border-start border-4 border-success bg-white h-100">
                <i className="bi bi-check-circle-fill text-success mb-2" style={{ fontSize: "1.5rem" }}></i>
                <small className="text-muted fw-medium">Klaim Disetujui</small>
                <h4 className="fw-bold m-0 text-success">{mockUserStats.klaim_disetujui}</h4>
              </div>
            </div>
            <div className="col-md-2" style={{ width: "20%" }}>
              <div className="card card-stat shadow-sm p-3 border-start border-4 border-danger bg-white h-100">
                <i className="bi bi-x-circle-fill text-danger mb-2" style={{ fontSize: "1.5rem" }}></i>
                <small className="text-muted fw-medium">Klaim Ditolak</small>
                <h4 className="fw-bold m-0 text-danger">{mockUserStats.klaim_ditolak}</h4>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
