"use client";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

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
      const res = await fetch(`/api/klaim?email=${user.email}`);
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
      id_klaim: item.id_klaim || item.nomor_klaim,
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
    const payload = { ...formData, email: user?.email, nomor_member: user?.nomor_member };

    try {
      const res = await fetch("/api/klaim", {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success) {
        setShowFormModal(false);
        fetchKlaim();
      }
    } catch (error) { console.error(error); }
  };

  const confirmDelete = async () => {
    try {
      const id = itemToDelete.id_klaim || itemToDelete.nomor_klaim;
      const res = await fetch(`/api/klaim?id=${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setShowDeleteModal(false); 
        fetchKlaim(); 
      }
    } catch (error) {
      console.error("Gagal hapus:", error);
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
      
      {/* Header (Gambar 2 - image_fadea0) */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Klaim Missing Miles</h2>
          <p className="text-muted mb-0">Ajukan klaim untuk penerbangan yang belum tercatat miles-nya</p>
        </div>
        <button className="btn btn-primary fw-semibold shadow-sm" style={{ backgroundColor: "#0A2463", borderColor: "#0A2463", borderRadius: "8px" }} onClick={handleOpenAdd}>
          + Ajukan Klaim
        </button>
      </div>

      {/* Filter Tabs (Gambar 2 - image_fadea0) */}
      <div className="d-flex gap-2 mb-4">
        {["Semua", "Menunggu", "Disetujui", "Ditolak"].map((tab) => (
          <button key={tab} onClick={() => setActiveFilter(tab)}
            className={`btn btn-sm px-4 fw-semibold ${activeFilter === tab ? 'text-white' : 'text-muted bg-white border'}`}
            style={activeFilter === tab ? { backgroundColor: '#0A2463', borderRadius: '8px' } : { borderRadius: '8px' }}>
            {tab}
          </button>
        ))}
      </div>

      {/* Tabel (Berhenti seadanya data - image_fae35c) */}
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
                    {item.id_klaim || `CLM-${item.id || idx+100}`} 
                  </td>
                  <td className="py-3 px-4">{item.maskapai}</td>
                  <td className="py-3 px-4 text-muted">{item.bandara_asal} ➔ {item.bandara_tujuan}</td>
                  <td className="py-3 px-4">{new Date(item.tanggal_penerbangan).toLocaleDateString('id-ID')}</td>
                  <td className="py-3 px-4">{item.nomor_penerbangan}</td>
                  <td className="py-3 px-4">{item.kelas_kabin}</td>
                  <td className="py-3 px-4">{getStatusBadge(item.status_penerimaan)}</td>
                  <td className="py-3 px-4 text-center">
                    {/* Logika: Hanya munculkan tombol jika statusnya persis 'Menunggu' */}
                    {item.status_penerimaan === 'Menunggu' ? (
                      <>
                        {/* Tombol Edit (Ikon Pensil) */}
                        <button 
                          onClick={() => handleOpenEdit(item)} 
                          className="btn btn-sm btn-outline-secondary me-2" 
                          style={{ border: "none", backgroundColor: "transparent" }}
                        >
                          <i className="bi bi-pencil" style={{ color: "#6B7280" }}></i>
                        </button>

                        {/* Tombol Hapus (Ikon Tong Sampah) */}
                        <button 
                          onClick={() => prepareDelete(item)} 
                          className="btn btn-sm btn-outline-danger"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </>
                    ) : (
                      /* Jika status sudah Disetujui/Ditolak, tampilkan strip saja */
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
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg p-3" style={{ borderRadius: "16px" }}>
              <div className="modal-header border-0 pb-0">
                <h5 className="fw-bold">{isEditing ? "Edit Klaim" : "Ajukan Klaim Missing Miles"}</h5>
                <button type="button" className="btn-close" onClick={() => setShowFormModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit} className="modal-body p-4">
                <div className="mb-3">
                  <label className="form-label fw-semibold small">Maskapai</label>
                  <input type="text" className="form-control" value={formData.maskapai} onChange={(e) => setFormData({...formData, maskapai: e.target.value})} required />
                </div>
                <div className="row g-3 mb-3">
                  <div className="col-6"><label className="small fw-semibold">Asal (IATA)</label><input className="form-control" maxLength={3} value={formData.bandara_asal} onChange={(e) => setFormData({...formData, bandara_asal: e.target.value.toUpperCase()})} required /></div>
                  <div className="col-6"><label className="small fw-semibold">Tujuan (IATA)</label><input className="form-control" maxLength={3} value={formData.bandara_tujuan} onChange={(e) => setFormData({...formData, bandara_tujuan: e.target.value.toUpperCase()})} required /></div>
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

      {/* MODAL HAPUS (Presisi - image_faeabe) */}
      {showDeleteModal && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}>
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