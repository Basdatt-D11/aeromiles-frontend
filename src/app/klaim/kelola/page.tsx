"use client";

import { useEffect, useState } from "react";

export default function KelolaKlaim() {
  const [semuaKlaim, setSemuaKlaim] = useState<any[]>([]);
  const emailStaf = "admin@aeromiles.com"; // Hardcoded sementara

  const fetchKlaim = async () => {
    try {
      const res = await fetch("/api/klaim");
      const data = await res.json();
      if (data.success) setSemuaKlaim(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchKlaim();
  }, []);

  const handleAction = async (id: number, status: string) => {
    if (!confirm(`Apakah Anda yakin ingin ${status} klaim ini?`)) return;

    try {
      const res = await fetch("/api/klaim/kelola", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status_penerimaan: status, email_staf: emailStaf }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`Klaim berhasil di-${status.toLowerCase()}`);
        fetchKlaim();
      } else {
        alert("Gagal memperbarui klaim: " + data.message);
      }
    } catch (error) {
      alert("Terjadi kesalahan sistem.");
    }
  };

  return (
    <>
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Kelola Pengajuan Klaim</h2>
        <p className="text-muted">Tinjau dan proses klaim missing miles dari seluruh member</p>
      </div>

      <div className="table-container">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="px-4 py-3">Member</th>
                <th className="py-3">Penerbangan</th>
                <th className="py-3">Rute & Tanggal</th>
                <th className="py-3">Bukti (PNR/Tiket)</th>
                <th className="py-3">Status</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {semuaKlaim.length > 0 ? (
                semuaKlaim.map((klaim, idx) => (
                  <tr key={idx}>
                    <td className="px-4 fw-semibold text-primary">{klaim.email_member}</td>
                    <td>{klaim.maskapai} <br/><small className="text-muted">{klaim.flight_number} - {klaim.kelas_kabin}</small></td>
                    <td>{klaim.bandara_asal} &rarr; {klaim.bandara_tujuan} <br/><small className="text-muted">{new Date(klaim.tanggal_penerbangan).toLocaleDateString('id-ID')}</small></td>
                    <td>{klaim.nomor_tiket} <br/><small className="text-muted">{klaim.pnr}</small></td>
                    <td>
                      <span className={`badge ${klaim.status_penerimaan === 'Disetujui' ? 'bg-success' : klaim.status_penerimaan === 'Ditolak' ? 'bg-danger' : 'bg-warning'}`}>
                        {klaim.status_penerimaan}
                      </span>
                    </td>
                    <td className="px-4 text-center">
                      {klaim.status_penerimaan === 'Menunggu' ? (
                        <>
                          <button onClick={() => handleAction(klaim.id, 'Disetujui')} className="btn btn-sm btn-success btn-action me-2" title="Setujui">
                            <i className="bi bi-check-lg"></i>
                          </button>
                          <button onClick={() => handleAction(klaim.id, 'Ditolak')} className="btn btn-sm btn-danger btn-action" title="Tolak">
                            <i className="bi bi-x-lg"></i>
                          </button>
                        </>
                      ) : (
                        <small className="text-muted fst-italic">Diproses oleh<br/>{klaim.email_staf}</small>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-muted">Memuat data klaim...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}