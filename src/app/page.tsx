"use client";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
  if (user?.email) {
    fetch(`/api/dashboard?email=${user.email}`)
      .then(res => res.json())
      .then(res => {
        console.log("DATA DASHBOARD:", res); // <-- tambah ini
        if (res.success) setData(res);
      });
  }
}, [user?.email]);

  // ✅ Cek role
  const isStaff = user?.role === "STAFF";

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>
      <h2 className="fw-bold mb-1">Dashboard</h2>
      <p className="text-muted mb-4">
        Selamat datang, <span className="fw-semibold text-primary">{user?.first_mid_name} {user?.last_name}</span>
      </p>

      {/* INFORMASI PRIBADI (sama untuk semua role) */}
      <div className="card shadow-sm border-0 p-4 mb-4" style={{ borderRadius: '12px', backgroundColor: '#F3F4F6' }}>
        <h5 className="fw-bold mb-3">Informasi Pribadi</h5>
        <div className="row g-3">
          <div className="col-md-4">
            <small className="text-muted d-block">Nama Lengkap:</small>
            <span className="fw-semibold">{data?.user?.first_mid_name} {data?.user?.last_name}</span>
          </div>
          <div className="col-md-4">
            <small className="text-muted d-block">Email:</small>
            <span className="fw-semibold">{user?.email}</span>
          </div>
          <div className="col-md-4">
            <small className="text-muted d-block">Telepon:</small>
            <span className="fw-semibold">{data?.user?.country_code} {data?.user?.mobile_number}</span>
          </div>
          <div className="col-md-4 mt-3">
            <small className="text-muted d-block">Kewarganegaraan:</small>
            <span className="fw-semibold">{data?.user?.kewarganegaraan || 'Indonesia'}</span>
          </div>
          <div className="col-md-4 mt-3">
            <small className="text-muted d-block">Tanggal Lahir:</small>
            <span className="fw-semibold">
              {data?.user?.tanggal_lahir ? new Date(data.user.tanggal_lahir).toLocaleDateString('id-ID') : '-'}
            </span>
          </div>
          {/* Tanggal Bergabung hanya untuk member */}
          {!isStaff && (
            <div className="col-md-4 mt-3">
              <small className="text-muted d-block">Tanggal Bergabung:</small>
              <span className="fw-semibold">
                {data?.user?.tanggal_bergabung ? new Date(data.user.tanggal_bergabung).toLocaleDateString('id-ID') : '-'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ===== STAT CARDS: STAFF ===== */}
      {isStaff ? (
        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <div className="card shadow-sm border-0 p-3 h-100" style={{ borderRadius: '12px' }}>
              <div className="d-flex align-items-center gap-2 mb-2">
                <div className="rounded-circle bg-primary bg-opacity-10 p-2">
                  <i className="bi bi-person-badge text-primary"></i>
                </div>
                <small className="text-muted">ID Staf</small>
              </div>
              <h5 className="fw-bold mb-0">{data?.user?.id_staf || '-'}</h5>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card shadow-sm border-0 p-3 h-100" style={{ borderRadius: '12px' }}>
              <div className="d-flex align-items-center gap-2 mb-2">
                <div className="rounded-circle bg-info bg-opacity-10 p-2">
                  <i className="bi bi-airplane text-info"></i>
                </div>
                <small className="text-muted">Maskapai</small>
              </div>
              <h5 className="fw-bold mb-0">{data?.user?.kode_maskapai || '-'}</h5>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card shadow-sm border-0 p-3 h-100" style={{ borderRadius: '12px' }}>
              <div className="d-flex align-items-center gap-2 mb-2">
                <div className="rounded-circle bg-warning bg-opacity-10 p-2">
                  <i className="bi bi-clock text-warning"></i>
                </div>
                <small className="text-muted">Klaim Menunggu</small>
              </div>
              <h5 className="fw-bold mb-0">{data?.stats?.menunggu ?? 0}</h5>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card shadow-sm border-0 p-3 h-100" style={{ borderRadius: '12px' }}>
              <div className="d-flex align-items-center gap-2 mb-2">
                <div className="rounded-circle bg-success bg-opacity-10 p-2">
                  <i className="bi bi-check-circle text-success"></i>
                </div>
                <small className="text-muted">Klaim Disetujui</small>
              </div>
              <h5 className="fw-bold mb-0">{data?.stats?.disetujui ?? 0}</h5>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card shadow-sm border-0 p-3 h-100" style={{ borderRadius: '12px' }}>
              <div className="d-flex align-items-center gap-2 mb-2">
                <div className="rounded-circle bg-danger bg-opacity-10 p-2">
                  <i className="bi bi-x-circle text-danger"></i>
                </div>
                <small className="text-muted">Klaim Ditolak</small>
              </div>
              <h5 className="fw-bold mb-0">{data?.stats?.ditolak ?? 0}</h5>
            </div>
          </div>
        </div>

      ) : (
        /* ===== STAT CARDS: MEMBER ===== */
        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <div className="card shadow-sm border-0 p-3 h-100" style={{ borderRadius: '12px' }}>
              <small className="text-muted">Nomor Member</small>
              <h4 className="fw-bold mb-0 mt-1">{data?.user?.nomor_member || '-'}</h4>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card shadow-sm border-0 p-3 h-100" style={{ borderRadius: '12px', backgroundColor: '#FEF9C3' }}>
              <small className="text-muted">Tier Status</small>
              <h4 className="fw-bold text-warning mb-0 mt-1">{data?.user?.nama_tier || 'Blue'}</h4>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card shadow-sm border-0 p-3 h-100" style={{ borderRadius: '12px' }}>
              <small className="text-muted">Total Miles</small>
              <h4 className="fw-bold text-primary mb-0 mt-1">{data?.user?.total_miles?.toLocaleString('id-ID') || 0}</h4>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card shadow-sm border-0 p-3 h-100" style={{ borderRadius: '12px', backgroundColor: '#DCFCE7' }}>
              <small className="text-muted">Award Miles</small>
              <h4 className="fw-bold text-success mb-0 mt-1">{data?.user?.award_miles?.toLocaleString('id-ID') || 0}</h4>
            </div>
          </div>
        </div>
      )}

      {/* 5 Transaksi Terbaru — hanya untuk member */}
      {!isStaff && (
        <div className="card shadow-sm border-0 p-4" style={{ borderRadius: '12px' }}>
          <h5 className="fw-bold mb-4">5 Transaksi Terbaru</h5>
          {data?.transactions && data.transactions.length > 0 ? (
            <table className="table table-borderless">
              <tbody>
                {data.transactions.map((t: any, i: number) => (
                  <tr key={i} className="border-bottom">
                    <td className="py-3"><span className="badge bg-light text-dark border">{t.tipe}</span></td>
                    <td className="py-3 text-muted">{new Date(t.waktu).toLocaleString('id-ID')}</td>
                    <td className="py-3 fw-semibold">{t.catatan}</td>
                    <td className={`py-3 text-end fw-bold ${t.miles < 0 ? 'text-danger' : 'text-success'}`}>
                      {t.miles > 0 ? '+' : ''}{t.miles.toLocaleString('id-ID')} miles
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-muted text-center py-3">Belum ada transaksi.</p>
          )}
        </div>
      )}
    </div>
  );
}