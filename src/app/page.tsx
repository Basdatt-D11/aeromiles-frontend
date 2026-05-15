"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, isLoading, router]);
  
  if (isLoading || !user) return <div className="text-center mt-5">Memuat data...</div>;

  const role = user.role === "STAFF" ? "Staff" : "Member";

  return (
    <>
      <div className="mb-4">
        <h2 className="fw-bold">Dashboard</h2>
        <p className="text-muted">Selamat datang, <span className="text-primary fw-semibold">{user.nama}</span></p>
      </div>

      <div className="card card-stat shadow-sm mb-4">
        <div className="card-body p-4">
          <h5 className="fw-bold mb-3">Informasi Pribadi</h5>
          <div className="row g-4">
            <div className="col-md-4">
              <small className="text-muted d-block">Nama Lengkap:</small>
              <span className="fw-semibold">{user.nama}</span>
            </div>
            <div className="col-md-4">
              <small className="text-muted d-block">Email:</small>
              <span className="fw-semibold">{user.email}</span>
            </div>
            <div className="col-md-4">
              <small className="text-muted d-block">Peran:</small>
              <span className="fw-semibold">{role}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3 mb-4">
        {role === "Member" && (
          <>
            <div className="col-md-3">
              <div className="card card-stat shadow-sm p-3 border-start border-4 border-info">
                <small className="text-muted">Award Miles</small>
                <h4 className="fw-bold m-0">{user.award_miles || 0}</h4>
              </div>
            </div>
          </>
        )}

        {role === "Staff" && (
          <>
            <div className="col-md-4">
              <div className="card card-stat shadow-sm p-3 border-start border-4 border-dark bg-white h-100">
                <i className="bi bi-person-badge text-muted mb-2" style={{ fontSize: '1.5rem' }}></i>
                <small className="text-muted fw-medium">Menu Staf</small>
                <h5 className="fw-bold m-0">Akses Penuh</h5>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}