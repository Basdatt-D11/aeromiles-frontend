"use client";

import { useEffect, useState } from "react";

export default function KelolaMitra() {
  const [mitra, setMitra] = useState<any[]>([]);

  // State UI System
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchMitra = async () => {
    try {
      const res = await fetch("/api/mitra");
      const data = await res.json();
      if (data.success) setMitra(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMitra();
  }, []);

  // --- TRIGGER MODAL ---
  const openAddModal = () => {
    setSelectedItem(null);
    setIsEditing(false);
    setShowFormModal(true);
  };

  const openEditModal = (item: any) => {
    setSelectedItem(item);
    setIsEditing(true);
    setShowFormModal(true);
  };

  const openDeleteModal = (item: any) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  // --- HANDLER ACTIONS ---
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoading(true);
  const formData = new FormData(e.currentTarget);
  
  // ✅ CARA YANG BENER: Bikin objek baru, jangan edit hasil Object.fromEntries
  const payload = {
    email: formData.get("email"),
    nama: formData.get("nama"),
    id_penyedia: parseInt(formData.get("id_penyedia") as string), // Konversi ke number
    tanggal_kerja_sama: formData.get("tanggal_kerja_sama")
  };

  try {
    const method = isEditing ? "PUT" : "POST";
    const res = await fetch("/api/mitra", {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload), // payload sekarang udah clean
    });
    
    const data = await res.json();
    
    if (res.ok) {
      fetchMitra();
      setShowFormModal(false);
    } else {
      alert(data.message || "Gagal menyimpan.");
    }
  } catch (error) {
    alert("Terjadi kesalahan sistem.");
  } finally {
    setLoading(false);
  }
};

  const executeDelete = async () => {
    if (!selectedItem) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/mitra?email=${selectedItem.email}`, { method: "DELETE" });
      if (res.ok) {
        fetchMitra();
        setShowDeleteModal(false);
      } else {
        alert("Gagal menghapus data mitra.");
      }
    } catch (error) {
      alert("Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  };

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    return dateString.split('T')[0];
  };

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>
      
      <div className="card shadow-sm border-0" style={{ borderRadius: "16px" }}>
        <div className="card-header bg-white border-0 p-4 d-flex justify-content-between align-items-center" style={{ borderRadius: "16px 16px 0 0" }}>
          <h4 className="fw-bold mb-0">Kelola Mitra</h4>
          <button onClick={openAddModal} className="btn btn-primary fw-semibold px-4" style={{ backgroundColor: "#0A2463", borderRadius: "8px" }}>
            <i className="bi bi-plus-lg me-2"></i> Tambah Mitra
          </button>
        </div>
        
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="text-muted fw-semibold py-3 px-4">Email Mitra</th>
                  <th className="text-muted fw-semibold py-3">Nama Mitra</th>
                  <th className="text-muted fw-semibold py-3">ID Penyedia</th>
                  <th className="text-muted fw-semibold py-3">Tanggal Kerja Sama</th>
                  <th className="text-muted fw-semibold py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {mitra.length > 0 ? mitra.map((m, idx) => (
                  <tr key={idx}>
                    <td className="px-4 fw-medium text-primary">{m.email}</td>
                    <td className="fw-bold">{m.nama}</td>
                    <td>
                      <span className="badge bg-light text-dark border px-3 py-1">{m.id_penyedia}</span>
                    </td>
                    <td className="text-muted">
                      {new Date(m.tanggal_kerja_sama).toLocaleDateString('id-ID', {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })}
                    </td>
                    <td className="px-4 text-center">
                      <button onClick={() => openEditModal(m)} className="btn btn-sm btn-light me-2 text-primary">
                        <i className="bi bi-pencil-fill"></i>
                      </button>
                      <button onClick={() => openDeleteModal(m)} className="btn btn-sm btn-light text-danger">
                        <i className="bi bi-trash3-fill"></i>
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-muted">Belum ada data mitra.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL FORM (TAMBAH & EDIT) */}
      {showFormModal && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(5px)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg p-2" style={{ borderRadius: "16px" }}>
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">{isEditing ? "Edit Data Mitra" : "Tambah Mitra Baru"}</h5>
                <button type="button" className="btn-close" onClick={() => setShowFormModal(false)}></button>
              </div>
              <div className="modal-body p-4">
                <form onSubmit={handleSave}>
                  <div className="row g-3">
                    
                    {/* Email Mitra (PK - Readonly saat Edit) */}
                    <div className="col-md-12 mb-2">
                      <label className="form-label text-muted fw-semibold small">Email Mitra</label>
                      <input 
                        type="email" 
                        name="email" 
                        className={`form-control ${isEditing ? 'bg-light' : ''}`} 
                        defaultValue={selectedItem?.email || selectedItem?.email}
                        readOnly={isEditing} 
                        placeholder="contoh: partner@traveloka.com"
                        required 
                      />
                      {isEditing && <small className="text-danger" style={{fontSize: "0.75rem"}}>*Email mitra tidak dapat diubah</small>}
                    </div>

                    <div className="col-md-12">
                      <label className="form-label text-muted fw-semibold small">Nama Mitra</label>
                      <input type="text" name="nama" className="form-control" defaultValue={selectedItem?.nama || selectedItem?.nama} placeholder="Contoh: TravelokaPartner" required />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-muted fw-semibold small">ID Penyedia</label>
                      <input type="number" name="id_penyedia" className="form-control" defaultValue={selectedItem?.id_penyedia} required />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-muted fw-semibold small">Tanggal Kerja Sama</label>
                      <input type="date" name="tanggal_kerja_sama" className="form-control" defaultValue={formatDateForInput(selectedItem?.tanggal_kerja_sama)} required />
                    </div>

                    <div className="col-12 text-end mt-4">
                      <button type="button" className="btn btn-light me-2 fw-semibold px-4" onClick={() => setShowFormModal(false)} style={{ borderRadius: "8px" }}>Batal</button>
                      <button type="submit" className="btn btn-primary px-4 fw-bold" disabled={loading} style={{ backgroundColor: "#0A2463", borderRadius: "8px" }}>
                        {loading ? "Menyimpan..." : "Simpan Mitra"}
                      </button>
                    </div>

                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL KONFIRMASI HAPUS */}
      {showDeleteModal && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(5px)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg p-2" style={{ borderRadius: "16px" }}>
              <div className="modal-body text-center p-4">
                <div className="mb-4 d-flex justify-content-center">
                  <i className="bi bi-building-x text-danger" style={{ fontSize: "4rem" }}></i>
                </div>
                <h4 className="fw-bold mb-3">Hapus Mitra?</h4>
                <p className="text-muted px-2">Anda yakin ingin memutuskan kerja sama dan menghapus data <b>{selectedItem?.nama}</b> ({selectedItem?.email})?</p>
                <div className="d-flex gap-2 justify-content-center mt-4">
                  <button className="btn btn-light px-4 fw-semibold" onClick={() => setShowDeleteModal(false)} style={{ borderRadius: "8px" }}>Batal</button>
                  <button className="btn btn-danger px-4 fw-semibold" disabled={loading} onClick={executeDelete} style={{ borderRadius: "8px" }}>
                    {loading ? "Menghapus..." : "Ya, Hapus!"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}