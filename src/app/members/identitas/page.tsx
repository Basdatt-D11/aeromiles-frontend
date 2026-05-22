"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function IdentitasSaya() {
  const { user } = useAuth();
  const [identitas, setIdentitas] = useState<any[]>([
    { no_dokumen: "A12345678", jenis: "Paspor", negara: "Indonesia", tgl_terbit: "2020-01-15", tgl_habis: "2030-01-15", status: "Aktif" },
    { no_dokumen: "B98765432", jenis: "KTP", negara: "Indonesia", tgl_terbit: "2023-06-01", tgl_habis: "2028-06-01", status: "Aktif" },
    { no_dokumen: "KTP-FATHAN-001", jenis: "KTP", negara: "Indonesia", tgl_terbit: "2026-05-06", tgl_habis: "2027-05-26", status: "Aktif" }
  ]);

  // State Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchIdentitas = async () => {
    try {
      const res = await fetch("/api/identitas");
      const data = await res.json();
      if (data.success) setIdentitas(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchIdentitas(); 
  }, []);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const payload = {
      no_dokumen: formData.get("no_dokumen"),
      jenis: formData.get("jenis"),
      negara: formData.get("negara"),
      tgl_terbit: formData.get("tgl_terbit"),
      tgl_habis: formData.get("tgl_habis"),
      nomor_member: user?.nomor_member // Sekarang aman!
    };
    payload.nomor_member = user?.nomor_member; 

    try {
      const res = await fetch("/api/identitas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowAddModal(false);
        await fetchIdentitas(); 
        alert("Identitas berhasil ditambahkan!");
      } else {
        const err = await res.json();
        alert(err.message || "Gagal menyimpan.");
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
      const idDokumen = selectedItem.no_dokumen || selectedItem.nomor;
      const res = await fetch(`/api/identitas?no_dokumen=${idDokumen}`, { 
        method: "DELETE" 
      });

      if (res.ok) {
        setShowDeleteModal(false);
        await fetchIdentitas(); 
      } else {
        alert("Gagal menghapus.");
      }
    } catch (error) {
      alert("Error sistem.");
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (item: any) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>
      
      <div className="card shadow-sm border-0" style={{ borderRadius: "16px" }}>
        <div className="card-header bg-white border-0 p-4 d-flex justify-content-between align-items-center" style={{ borderRadius: "16px 16px 0 0" }}>
          <div>
            <h4 className="fw-bold mb-1" style={{ color: "#0A2463" }}>Identitas Saya</h4>
            <p className="text-muted mb-0 small">Kelola dokumen identitas Anda untuk keperluan penerbangan dan klaim.</p>
          </div>
          <button onClick={() => setShowAddModal(true)} className="btn btn-primary fw-semibold px-4" style={{ backgroundColor: "#0A2463", borderRadius: "8px" }}>
            <i className="bi bi-plus-lg me-2"></i> Tambah Identitas
          </button>
        </div>
        
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="text-muted fw-semibold py-3 px-4">Nomor Dokumen</th>
                  <th className="text-muted fw-semibold py-3">Jenis</th>
                  <th className="text-muted fw-semibold py-3">Negara Penerbit</th>
                  <th className="text-muted fw-semibold py-3">Tanggal Terbit</th>
                  <th className="text-muted fw-semibold py-3">Tanggal Habis</th>
                  <th className="text-muted fw-semibold py-3">Status</th>
                  <th className="text-muted fw-semibold py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {identitas.length > 0 ? identitas.map((i, idx) => {
                  // Fallback pintar buat nanganin beda nama kolom dari DB dan Form
                  const noDokumen = i.nomor || i.no_dokumen;
                  const negara = i.negara_penerbit || i.negara;
                  const tglTerbit = i.tanggal_terbit || i.tgl_terbit;
                  const tglHabis = i.tanggal_habis || i.tgl_habis;
                  const status = i.status || "Aktif";
                  const isExpired = status.toLowerCase() === "kedaluwarsa";

                  return (
                    <tr key={idx}>
                      <td className="px-4 fw-bold text-dark">{noDokumen}</td>
                      <td>
                        <span className="badge bg-light text-dark border px-3 py-2">
                          <i className={`bi ${i.jenis === 'Paspor' ? 'bi-journal-bookmark-fill' : 'bi-person-vcard'} me-2 text-primary`}></i>
                          {i.jenis}
                        </span>
                      </td>
                      <td className="fw-medium text-muted">{negara}</td>
                      <td className="text-muted">{new Date(tglTerbit).toLocaleDateString('id-ID')}</td>
                      <td className="text-muted">{new Date(tglHabis).toLocaleDateString('id-ID')}</td>
                      <td>
                        <span className={`badge ${isExpired ? 'bg-danger' : 'bg-success'} bg-opacity-10 ${isExpired ? 'text-danger' : 'text-success'} px-3 py-2`} style={{ borderRadius: "6px" }}>
                          <i className={`bi ${isExpired ? 'bi-x-circle-fill' : 'bi-check-circle-fill'} me-1`}></i> {status}
                        </span>
                      </td>
                      <td className="px-4 text-center">
                        <button onClick={() => openDeleteModal(i)} className="btn btn-sm btn-light text-danger">
                          <i className="bi bi-trash3-fill"></i>
                        </button>
                      </td>
                    </tr>
                  )
                }) : (
                  <tr>
                    <td colSpan={7} className="text-center py-5 text-muted">Belum ada dokumen identitas yang didaftarkan.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL TAMBAH IDENTITAS */}
      {showAddModal && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(5px)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg p-2" style={{ borderRadius: "16px" }}>
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">Tambah Identitas Baru</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
              </div>
              <div className="modal-body p-4">
                <form onSubmit={handleSave}>
                  <div className="row g-3">
                    
                    <div className="col-md-6">
                      <label className="form-label text-muted fw-semibold small">Jenis Dokumen</label>
                      <select name="jenis" className="form-select" required>
                        <option value="KTP">KTP</option>
                        <option value="Paspor">Paspor</option>
                        <option value="SIM">SIM</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-muted fw-semibold small">Negara Penerbit</label>
                      <input type="text" name="negara_penerbit" className="form-control" defaultValue="Indonesia" required />
                    </div>

                    <div className="col-md-12">
                      <label className="form-label text-muted fw-semibold small">Nomor Dokumen</label>
                      <input type="text" name="nomor" className="form-control" placeholder="Masukkan nomor dokumen..." required />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-muted fw-semibold small">Tanggal Terbit</label>
                      <input type="date" name="tanggal_terbit" className="form-control" required />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-muted fw-semibold small">Tanggal Habis</label>
                      <input type="date" name="tanggal_habis" className="form-control" required />
                    </div>

                    <div className="col-12 text-end mt-4">
                      <button type="button" className="btn btn-light me-2 fw-semibold px-4" onClick={() => setShowAddModal(false)} style={{ borderRadius: "8px" }}>Batal</button>
                      <button type="submit" className="btn btn-primary px-4 fw-bold" disabled={loading} style={{ backgroundColor: "#0A2463", borderRadius: "8px" }}>
                        {loading ? "Menyimpan..." : "Simpan Identitas"}
                      </button>
                    </div>

                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL HAPUS IDENTITAS */}
      {showDeleteModal && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(5px)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg p-2" style={{ borderRadius: "16px" }}>
              <div className="modal-body text-center p-4">
                <div className="mb-4 d-flex justify-content-center">
                  <i className="bi bi-trash-fill text-danger" style={{ fontSize: "4rem" }}></i>
                </div>
                <h4 className="fw-bold mb-3">Hapus Identitas?</h4>
                <p className="text-muted px-2">Anda yakin ingin menghapus dokumen <b>{selectedItem?.jenis}</b> dengan nomor <b>{selectedItem?.nomor || selectedItem?.no_dokumen}</b>?</p>
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