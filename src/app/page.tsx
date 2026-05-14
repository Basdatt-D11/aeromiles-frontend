"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemberStats = async () => {
      if (user?.email && user.role === "MEMBER") {
        try {
          const res = await fetch(`/api/member/stats?email=${user.email}`);
          const data = await res.json();
          setStats(data);
        } catch (error) {
          console.error("Gagal ambil stats:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchMemberStats();
  }, [user]);

  if (!user) {
    return (
      <div className="alert alert-info">
        Silakan <a href="/auth/login" className="alert-link">login</a> terlebih dahulu.
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <div>
          <h2 className="fw-bold">Dashboard</h2>
          <p className="text-muted">
            Selamat datang, <span className="text-primary fw-semibold">{user.nama}</span>
          </p>
        </div>
        <button onClick={logout} className="btn btn-outline-danger btn-sm">
          <i className="bi bi-box-arrow-right me-1"></i> Logout
        </button>
      </div>

      <div className="card shadow-sm mb-4 border-0">
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
              <span className="fw-semibold">+62 812-XXXX-XXXX</span>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3 mb-4">
        {user.role === "MEMBER" ? (
          <>
            <div className="col-md-3">
              <div className="card shadow-sm p-3 border-start border-4 border-primary border-0 h-100">
                <small className="text-muted">Nomor Member</small>
                <h4 className="fw-bold m-0">{loading ? "..." : (stats?.no_member || "N/A")}</h4>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card shadow-sm p-3 border-start border-4 border-warning border-0 h-100">
                <small className="text-muted">Tier</small>
                <h4 className="fw-bold m-0 text-warning">{loading ? "..." : (stats?.tier || "Blue")}</h4>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card shadow-sm p-3 border-start border-4 border-info border-0 h-100">
                <small className="text-muted">Award Miles</small>
                <h4 className="fw-bold m-0">{loading ? "..." : (stats?.award_miles || "0")}</h4>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card shadow-sm p-3 border-start border-4 border-success border-0 h-100">
                <small className="text-muted">Total Miles</small>
                <h4 className="fw-bold m-0">{loading ? "..." : (stats?.total_miles || "0")}</h4>
              </div>
            </div>
          </>
        ) : (
          <div className="col-12 text-muted">Halaman khusus Staf</div>
        )}
      </div>
    </>
  );
}