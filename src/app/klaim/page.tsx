"use client";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import Swal from 'sweetalert2'; // ✅ Import SweetAlert2

export default function RiwayatKlaim() {
  const { user } = useAuth();
  const [dataKlaim, setDataKlaim] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState("Semua");

  // Modal States
  const [showFormModal, setShowFormModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);

  const [formData, setFormData] = useState({
    id_klaim: "",
    maskapai: "",
    bandara_asal: "",
    bandara_tujuan: "",
    tanggal_penerbangan: "",
    nomor_penerbangan: "",
    nomor_tiket: "",
    kelas_kabin: "Economy",
    pnr: ""
  });

  const fetchKlaim = async () => {
    if (!user?.email) return;
    try {
      const res = await fetch(`/api/klaim?email=${user.email}`, { cache: "no-store" });
      const json = await res.json();
      if (json.success) setDataKlaim(json.data);
    } catch (error) {
      console.error("Error fetch klaim:", error);
    }
  };

  useEffect(() => {
    fetchKlaim();
  }, [user?.email]);

  // --- ACTIONS ---
  const handleOpenAdd = () => {
    setFormData({ id_klaim: "", maskapai: "", bandara_asal: "", bandara_tujuan: "", tanggal_penerbangan: "", nomor_penerbangan: "", nomor_tiket: "", kelas_kabin: "Economy", pnr: "" });
    setIsEditing(false);
    setShowFormModal(true);
  };

  const handleOpenEdit = (item: any) => {
    setFormData({
      id_klaim: item.id || item.nomor_klaim,
      maskapai: item.maskapai,
      bandara_asal: item.bandara_asal,
      bandara_tujuan: item.bandara_tujuan,
      tanggal_penerbangan: new Date(item.tanggal_penerbangan).toISOString().split('T')[0],
      nomor_penerbangan: item.nomor_penerbangan,
      nomor_tiket: item.nomor_tiket,
      kelas_kabin: item.kelas_kabin,
      pnr: item.pnr
    });
    setIsEditing(true);
    setShowFormModal(true);
  };

  const prepareDelete = (item: any) => {
    setItemToDelete(item); 
    setShowDeleteModal(true); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = isEditing ? "PUT" : "POST";
    
    const payload = {
      id_klaim: formData.id_klaim,
      email_member: user?.email,
      maskapai: formData.maskapai,
      bandara_asal: formData.bandara_asal,
      bandara_tujuan: formData.bandara_tujuan,
      tanggal_penerbangan: formData.tanggal_penerbangan,
      flight_number: formData.nomor_penerbangan,
      nomor_tiket: formData.nomor_tiket,
      kelas_kabin: formData.kelas_kabin,
      pnr: formData.pnr,
    };

    try {
      const res = await fetch("/api/klaim", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      
      // ✅ Pasang SweetAlert di sini
      if (json.success) {
        setShowFormModal(false);
        fetchKlaim();
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Data klaim berhasil disimpan.',
          confirmButtonColor: '#0A2463'
        });
      } else {
        Swal.fire({ icon: 'error', title: 'Gagal', text: json.message || "Gagal menyimpan", confirmButtonColor: '#d33' });
      }
    } catch (error) { 
      console.error(error); 
      Swal.fire({ icon: 'error', title: 'Error', text: 'Terjadi kesalahan sistem.' });
    }
  };

  const confirmDelete = async () => {
    try {
      // ✅ 1. AMBIL ID YANG BENAR (Sesuai kolom di DB lu yaitu 'id')
      const id = itemToDelete.id; 
      
      const res = await fetch(`/api/klaim?id=${id}`, { method: "DELETE" });
      const json = await res.json();
      
      // ✅ 2. TUTUP MODAL DULUAN! Biar pop-up SweetAlert gak ketimpa di belakang
      setShowDeleteModal(false); 

      if (json.success) {
        fetchKlaim(); 
        Swal.fire({
          icon: 'success',
          title: 'Dihapus!',
          text: 'Klaim berhasil dihapus.',
          confirmButtonColor: '#0A2463'
        });
      } else {
        Swal.fire({ 
          icon: 'error', 
          title: 'Gagal', 
          text: json.message || "Gagal menghapus", 
          confirmButtonColor: '#d33' 
        });
      }
    } catch (error) {
      console.error("Gagal hapus:", error);
      // Tutup modal juga kalau masuk catch (error sistem)
      setShowDeleteModal(false); 
      Swal.fire({ icon: 'error', title: 'Error', text: 'Terjadi kesalahan sistem.' });
    }
  };

  // --- FILTERS & BADGES ---
  const filteredData = dataKlaim.filter((item) => {
    if (activeFilter === "Semua") return true;
    const statusDB = item.status_penerimaan || "Menunggu";
    return statusDB === activeFilter;
  });

  const getStatusBadge = (status: string) => {
    const s = status || "Menunggu";
    if (s === "Disetujui") return <span className="badge bg-success rounded-pill px-3 py-2 small">Disetujui</span>;
    if (s === "Ditolak") return <span className="badge bg-danger rounded-pill px-3 py-2 small">Ditolak</span>;
    return <span className="badge bg-warning text-dark rounded-pill px-3 py-2 small">Menunggu</span>;
  };

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Klaim Missing Miles</h2>
          <p className="text-muted mb-0">Ajukan klaim untuk penerbangan yang belum tercatat miles-nya</p>
        </div>
        <button className="btn btn-primary fw-semibold shadow-sm" style={{ backgroundColor: "#0A2463", borderColor: "#0A2463", borderRadius: "8px" }} onClick={handleOpenAdd}>
          + Ajukan Klaim
        </button>
      </div>

      <div className="d-flex gap-2 mb-4">
        {["Semua", "Menunggu", "Disetujui", "Ditolak"].map((tab) => (
          <button key={tab} onClick={() => setActiveFilter(tab)}
            className={`btn btn-sm px-4 fw-semibold ${activeFilter === tab ? 'text-white' : 'text-muted bg-white border'}`}
            style={activeFilter === tab ? { backgroundColor: '#0A2463', borderRadius: '8px' } : { borderRadius: '8px' }}>
            {tab}
          </button>
        ))}
      </div>

      <div className="card shadow-sm border-0 mb-5" style={{ borderRadius: "12px", height: "fit-content" }}>
        <div className="card-body p-0">
          <table className="table table-hover mb-0">
            <thead className="bg-light text-muted small">
              <tr>
                <th className="py-3 px-4 border-0">No. Klaim</th>
                <th className="py-3 px-4 border-0">Maskapai</th>
                <th className="py-3 px-4 border-0">Rute</th>
                <th className="py-3 px-4 border-0">Tanggal</th>
                <th className="py-3 px-4 border-0">Flight</th>
                <th className="py-3 px-4 border-0">Kelas</th>
                <th className="py-3 px-4 border-0">Status</th>
                <th className="py-3 px-4 border-0 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, idx) => (
                <tr key={idx} className="align-middle border-bottom">
                  <td className="py-3 px-4 fw-semibold text-dark">
                    {item.id || item.id_klaim || `CLM-${idx+100}`}
                  </td>
                  <td className="py-3 px-4">{item.maskapai}</td>
                  <td className="py-3 px-4 text-muted">{item.bandara_asal} ➔ {item.bandara_tujuan}</td>
                  <td className="py-3 px-4">{new Date(item.tanggal_penerbangan).toLocaleDateString('id-ID')}</td>
                  <td className="py-3 px-4">{item.flight_number || item.nomor_penerbangan}</td>
                  <td className="py-3 px-4">{item.kelas_kabin}</td>
                  <td className="py-3 px-4">{getStatusBadge(item.status_penerimaan)}</td>
                  <td className="py-3 px-4 text-center">
                    {item.status_penerimaan === 'Menunggu' ? (
                      <>
                        <button onClick={() => handleOpenEdit(item)} className="btn btn-sm btn-outline-secondary me-2" style={{ border: "none", backgroundColor: "transparent" }}>
                          <i className="bi bi-pencil" style={{ color: "#6B7280" }}></i>
                        </button>
                        <button onClick={() => prepareDelete(item)} className="btn btn-sm btn-outline-danger">
                          <i className="bi bi-trash"></i>
                        </button>
                      </>
                    ) : (
                      <span className="text-muted small">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL AJUKAN (modal-lg) */}
      {showFormModal && (
        // ✅ Perbaikan Style Modal (position: fixed ditambahkan)
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1040, position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg p-3" style={{ borderRadius: "16px" }}>
              <div className="modal-header border-0 pb-0">
                <h5 className="fw-bold">{isEditing ? "Edit Klaim" : "Ajukan Klaim Missing Miles"}</h5>
                <button type="button" className="btn-close" onClick={() => setShowFormModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit} className="modal-body p-4">
                <div className="mb-3">
                  <label className="form-label fw-semibold small">Maskapai</label>
                  <select className="form-select" value={formData.maskapai} 
                    onChange={(e) => setFormData({...formData, maskapai: e.target.value})} required>
                    <option value="">-- Pilih Maskapai --</option>
                    <option value="AA">American Airlines</option>
                    <option value="EK">Emirates</option>
                    <option value="GA">Garuda Indonesia</option>
                    <option value="SQ">Singapore Airlines</option>
                  </select>
                </div>
                <div className="row g-3 mb-3">
                  <div className="col-6">
                    <label className="small fw-semibold">Asal (IATA)</label>
                    <select className="form-select" value={formData.bandara_asal}
                      onChange={(e) => setFormData({...formData, bandara_asal: e.target.value})} required>
                      <option value="">-- Pilih Asal --</option>
                      <option value="CGK">CGK - Soekarno-Hatta, Jakarta</option>
                      <option value="DPS">DPS - Ngurah Rai, Bali</option>
                      <option value="SIN">SIN - Changi, Singapore</option>
                    </select>
                  </div>
                  <div className="col-6">
                    <label className="small fw-semibold">Tujuan (IATA)</label>
                    <select className="form-select" value={formData.bandara_tujuan}
                      onChange={(e) => setFormData({...formData, bandara_tujuan: e.target.value})} required>
                      <option value="">-- Pilih Tujuan --</option>
                      <option value="CGK">CGK - Soekarno-Hatta, Jakarta</option>
                      <option value="DPS">DPS - Ngurah Rai, Bali</option>
                      <option value="SIN">SIN - Changi, Singapore</option>
                    </select>
                  </div>
                </div>
                <div className="row g-3 mb-4">
                  <div className="col-4"><label className="small fw-semibold">Tanggal</label><input type="date" className="form-control" value={formData.tanggal_penerbangan} onChange={(e) => setFormData({...formData, tanggal_penerbangan: e.target.value})} required /></div>
                  <div className="col-4"><label className="small fw-semibold">Flight No.</label><input className="form-control" value={formData.nomor_penerbangan} onChange={(e) => setFormData({...formData, nomor_penerbangan: e.target.value})} required /></div>
                  <div className="col-4"><label className="small fw-semibold">Tiket No.</label><input className="form-control" value={formData.nomor_tiket} onChange={(e) => setFormData({...formData, nomor_tiket: e.target.value})} required /></div>
                </div>
                <div className="d-flex justify-content-end"><button type="submit" className="btn btn-primary px-4 fw-semibold" style={{ backgroundColor: "#0A2463", borderRadius: "8px" }}>Simpan</button></div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL HAPUS */}
      {showDeleteModal && (
        // ✅ Perbaikan Style Modal (position: fixed ditambahkan)
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1040, position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}>
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "420px" }}>
            <div className="modal-content border-0 shadow-lg p-4" style={{ borderRadius: "16px" }}>
              <div className="modal-body p-0 text-start">
                <h5 className="fw-bold mb-3">Hapus Klaim?</h5>
                <p className="text-muted mb-4 small">Tindakan ini tidak dapat dibatalkan. Data klaim akan dihapus permanen.</p>
                <div className="d-flex justify-content-end gap-2">
                  <button className="btn btn-light px-4 small" onClick={() => setShowDeleteModal(false)} style={{ border: "1px solid #D1D5DB", borderRadius: "8px" }}>Batal</button>
                  <button className="btn btn-primary px-4 small" onClick={confirmDelete} style={{ backgroundColor: "#0A2463", borderRadius: "8px" }}>Hapus</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}