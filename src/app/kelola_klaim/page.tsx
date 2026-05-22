"use client";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function KelolaKlaimStaff() {
  const [dataKlaim, setDataKlaim] = useState<any[]>([]);

  // ✅ 1. Fetch TANPA ngirim email, biar narik SEMUA data klaim
  const fetchSemuaKlaim = async () => {
    try {
      const res = await fetch(`/api/klaim`, { cache: "no-store" });
      const json = await res.json();
      if (json.success) setDataKlaim(json.data);
    } catch (error) {
      console.error("Error fetch klaim:", error);
    }
  };

  useEffect(() => {
    fetchSemuaKlaim();
  }, []);

  // UI Badge Status
  const getStatusBadge = (status: string) => {
    const s = status || "Menunggu";
    if (s === "Disetujui") return <span className="badge bg-success rounded-pill px-3 py-2 small">Disetujui</span>;
    if (s === "Ditolak") return <span className="badge bg-danger rounded-pill px-3 py-2 small">Ditolak</span>;
    return <span className="badge bg-warning text-dark rounded-pill px-3 py-2 small">Menunggu</span>;
  };

  // Logic Dummy Tombol Approve/Reject (Bisa lu sambungin ke backend nanti)
  // Ganti fungsi handleAction yang lama dengan yang ini
  const handleAction = async (item: any, action: 'Approve' | 'Reject') => {
    const newStatus = action === 'Approve' ? 'Disetujui' : 'Ditolak';

    Swal.fire({
      title: `Konfirmasi ${action}`,
      text: `Apakah Anda yakin ingin ${action.toLowerCase()} klaim ini?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: action === 'Approve' ? '#10B981' : '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: `Ya, ${action}`
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Nembak API buat update database
          const res = await fetch('/api/klaim', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: item.id, status: newStatus }) // Kirim ID dan status baru
          });

          const data = await res.json();
          if (data.success) {
            Swal.fire('Berhasil!', `Status klaim diubah menjadi ${newStatus}.`, 'success');
            fetchSemuaKlaim(); // Panggil ulang datanya biar tabel langsung ke-refresh otomatis
          } else {
            Swal.fire('Gagal!', data.message || 'Gagal mengubah status.', 'error');
          }
        } catch (error) {
          Swal.fire('Error!', 'Sistem error.', 'error');
        }
      }
    });
  };

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>
      
      {/* Header */}
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Kelola Klaim Missing Miles</h2>
      </div>

      {/* Filter Dropdowns (Sesuai Desain Baru) */}
      <div className="d-flex gap-3 mb-4">
        <select className="form-select bg-white shadow-sm border-0" style={{ width: "auto", borderRadius: "8px" }}>
          <option value="Semua Status">Semua Status</option>
          <option value="Menunggu">Menunggu</option>
          <option value="Disetujui">Disetujui</option>
          <option value="Ditolak">Ditolak</option>
        </select>
        
        <select className="form-select bg-white shadow-sm border-0" style={{ width: "auto", borderRadius: "8px" }}>
          <option value="Semua Maskapai">Semua Maskapai</option>
          <option value="GA">Garuda Indonesia (GA)</option>
          <option value="SQ">Singapore Airlines (SQ)</option>
        </select>

        <select className="form-select bg-white shadow-sm border-0" style={{ width: "auto", borderRadius: "8px" }}>
          <option value="Tanggal Pengajuan">Tanggal Pengajuan</option>
          <option value="Terbaru">Terbaru</option>
          <option value="Terlama">Terlama</option>
        </select>
      </div>

      {/* Tabel Kelola Klaim Staff */}
      <div className="card shadow-sm border-0 mb-5" style={{ borderRadius: "16px", overflow: "hidden" }}>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light text-muted small">
                <tr>
                  <th className="py-3 px-4 border-0">No. Klaim</th>
                  <th className="py-3 px-4 border-0">Member</th>
                  <th className="py-3 px-4 border-0">Maskapai</th>
                  <th className="py-3 px-4 border-0">Rute</th>
                  <th className="py-3 px-4 border-0">Tanggal</th>
                  <th className="py-3 px-4 border-0">Flight</th>
                  <th className="py-3 px-4 border-0">Kelas</th>
                  <th className="py-3 px-4 border-0">Tanggal Pengajuan</th>
                  <th className="py-3 px-4 border-0">Status</th>
                  <th className="py-3 px-4 border-0 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {dataKlaim.length > 0 ? dataKlaim.map((item, idx) => (
                  <tr key={idx} className="border-bottom">
                    <td className="py-3 px-4 fw-bold text-dark">
                      {item.id || `CLM-00${idx+1}`}
                    </td>
                    <td className="py-3 px-4">
                      <div className="fw-semibold text-dark">{item.nama_member || "Member Aeromiles"}</div>
                      <div className="small text-muted">{item.email_member}</div>
                    </td>
                    <td className="py-3 px-4 fw-medium">{item.maskapai}</td>
                    <td className="py-3 px-4 text-muted">{item.bandara_asal} ➔ {item.bandara_tujuan}</td>
                    <td className="py-3 px-4 text-muted">{new Date(item.tanggal_penerbangan).toLocaleDateString('id-ID')}</td>
                    <td className="py-3 px-4 fw-medium text-dark">{item.flight_number}</td>
                    <td className="py-3 px-4 text-muted">{item.kelas_kabin}</td>
                    <td className="py-3 px-4 text-muted">{new Date(item.timestamp).toLocaleString('id-ID')}</td>
                    <td className="py-3 px-4">{getStatusBadge(item.status_penerimaan)}</td>
                    <td className="py-3 px-4 text-center">
                      {item.status_penerimaan === 'Menunggu' ? (
                        <div className="d-flex justify-content-center gap-2">
                          <button onClick={() => handleAction(item, 'Approve')} className="btn btn-sm btn-outline-success" style={{ borderRadius: "50%", width: "32px", height: "32px", padding: 0 }}>
                            <i className="bi bi-check-lg"></i>
                          </button>
                          <button onClick={() => handleAction(item, 'Reject')} className="btn btn-sm btn-outline-danger" style={{ borderRadius: "50%", width: "32px", height: "32px", padding: 0 }}>
                            <i className="bi bi-x-lg"></i>
                          </button>
                        </div>
                      ) : (
                        <span className="text-muted small">-</span>
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={10} className="text-center py-5 text-muted">Belum ada data klaim yang diajukan.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}