"use client";

import { useEffect, useState } from "react";

export default function KelolaHadiah() {
  const [hadiah, setHadiah] = useState<any[]>([]);
  
  // State untuk ngatur Modal Form (Tambah/Edit) dan Modal Delete
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchHadiah = async () => {
    try {
      // ✅ Cuma nge-GET data dari API, nggak ada unsur DELETE di sini
      const res = await fetch("/api/hadiah"); 
      const data = await res.json();
      if (data.success) setHadiah(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchHadiah();
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
    const payload = Object.fromEntries(formData.entries());

    try {
      // Kalau edit pake PUT, kalau nambah pake POST
      const method = isEditing ? "PUT" : "POST";
      const res = await fetch("/api/hadiah", {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        fetchHadiah();
        setShowFormModal(false);
      } else {
        alert(data.message || "Gagal menyimpan data.");
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
    // Pastikan di sini lu pake 'kode' (sesuai nama kolom PK di DB)
    const res = await fetch(`/api/hadiah?kode=${selectedItem.kode}`, { 
      method: "DELETE" 
    });
    
    if (res.ok) {
      await fetchHadiah(); // Biar tabel auto-refresh
      setShowDeleteModal(false);
    }
  } catch (error) {
    alert("Gagal menghapus");
  } finally {
    setLoading(false);
  }
};

  // Helper biar tanggal ISO dari database bisa dipasang di <input type="date">
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    return dateString.split('T')[0];
  };

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>
      
      <div className="card shadow-sm border-0" style={{ borderRadius: "16px" }}>
        <div className="card-header bg-white border-0 p-4 d-flex justify-content-between align-items-center" style={{ borderRadius: "16px 16px 0 0" }}>
          <h4 className="fw-bold mb-0">Kelola Hadiah & Penyedia</h4>
          <button onClick={openAddModal} className="btn btn-primary fw-semibold px-4" style={{ backgroundColor: "#0A2463", borderRadius: "8px" }}>
            <i className="bi bi-plus-lg me-2"></i> Tambah Hadiah
          </button>
        </div>
        
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="text-muted fw-semibold py-3 px-4">Kode</th>
                  <th className="text-muted fw-semibold py-3">Nama</th>
                  <th className="text-muted fw-semibold py-3">Deskripsi</th>
                  <th className="text-muted fw-semibold py-3">ID Penyedia</th>
                  <th className="text-muted fw-semibold py-3">Miles</th>
                  <th className="text-muted fw-semibold py-3">Periode</th>
                  <th className="text-muted fw-semibold py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {hadiah.length > 0 ? hadiah.map((h, idx) => (
                  <tr key={idx}>
                    <td className="px-4 fw-bold">{h.kode || h.id}</td>     
                    <td className="fw-medium">{h.nama}</td>
                    <td><span className="d-inline-block text-truncate" style={{ maxWidth: "150px" }}>{h.deskripsi}</span></td>
                    <td>
                      <span className="badge bg-light text-dark border px-2 py-1">{h.id_penyedia}</span>
                    </td>
                    <td className="fw-bold text-success">{h.miles?.toLocaleString()}</td>
                    <td className="small text-muted">
                      {formatDateForInput(h.valid_start_date)} s/d <br/> {formatDateForInput(h.program_end)}
                    </td>
                    <td className="px-4 text-center">
                      <button onClick={() => openEditModal(h)} className="btn btn-sm btn-light me-2 text-primary">
                        <i className="bi bi-pencil-fill"></i>
                      </button>
                      <button onClick={() => openDeleteModal(h)} className="btn btn-sm btn-light text-danger">
                        <i className="bi bi-trash3-fill"></i>
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={7} className="text-center py-4 text-muted">Belum ada data hadiah.</td>
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
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg p-2" style={{ borderRadius: "16px" }}>
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">{isEditing ? "Edit Data Hadiah" : "Tambah Hadiah Baru"}</h5>
                <button type="button" className="btn-close" onClick={() => setShowFormModal(false)}></button>
              </div>
              <div className="modal-body p-4">
                <form onSubmit={handleSave}>
                  <div className="row g-3">
                    
                    {/* Kode Hadiah (Read-only saat Edit karena PK) */}
                    <div className="col-md-12 mb-2">
                      <label className="form-label text-muted fw-semibold small">Kode Hadiah</label>
                      <input 
                        type="text" 
                        name="kode" 
                        className={`form-control ${isEditing ? 'bg-light' : ''}`} 
                        defaultValue={selectedItem?.kode} 
                        readOnly={isEditing} 
                        placeholder="Contoh: RWD-001"
                        required 
                      />
                      {isEditing && <small className="text-danger" style={{fontSize: "0.75rem"}}>*Kode hadiah tidak dapat diubah</small>}
                    </div>

                    <div className="col-md-12">
                      <label className="form-label text-muted fw-semibold small">Nama Hadiah</label>
                      <input type="text" name="nama" className="form-control" defaultValue={selectedItem?.nama} required />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-muted fw-semibold small">ID Penyedia</label>
                      <input type="number" name="id_penyedia" className="form-control" defaultValue={selectedItem?.id_penyedia} required />
                    </div>
                    
                    <div className="col-md-6">
                      <label className="form-label text-muted fw-semibold small">Miles Dibutuhkan</label>
                      <input type="number" name="miles" className="form-control" defaultValue={selectedItem?.miles} required />
                    </div>

                    <div className="col-md-12">
                      <label className="form-label text-muted fw-semibold small">Deskripsi</label>
                      <textarea name="deskripsi" className="form-control" rows={3} defaultValue={selectedItem?.deskripsi} required></textarea>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-muted fw-semibold small">Valid Start</label>
                      <input type="date" name="valid_start_date" className="form-control" defaultValue={formatDateForInput(selectedItem?.valid_start_date)} required />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-muted fw-semibold small">Program End</label>
                      <input type="date" name="program_end" className="form-control" defaultValue={formatDateForInput(selectedItem?.program_end)} required />
                    </div>

                    <div className="col-12 text-end mt-4">
                      <button type="submit" className="btn btn-primary px-5 fw-bold" disabled={loading} style={{ backgroundColor: "#0A2463", borderRadius: "8px" }}>
                        {loading ? "Menyimpan..." : "Simpan"}
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
                  <i className="bi bi-exclamation-triangle-fill text-danger" style={{ fontSize: "4rem" }}></i>
                </div>
                <h4 className="fw-bold mb-3">Hapus Hadiah?</h4>
                <p className="text-muted px-2">Anda yakin ingin menghapus <b>{selectedItem?.nama}</b> ({selectedItem?.kode}) secara permanen? Data yang dihapus tidak dapat dikembalikan.</p>
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