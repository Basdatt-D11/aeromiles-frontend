"use client";
import { useEffect, useState } from "react";

export default function ListMember() {
  const [members, setMembers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTier, setFilterTier] = useState("Semua Tier");

  // Modal States
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "", password: "", salutation: "Mr.",
    nama_depan: "", nama_belakang: "", kewarganegaraan: "Indonesia",
    country_code: "+62", nomor_hp: "", tanggal_lahir: ""
  });

  const fetchMembers = async () => {
    const res = await fetch("/api/member");
    const data = await res.json();
    if (data.success) setMembers(data.data);
  };

  useEffect(() => { fetchMembers(); }, []);

  // --- FILTER ---
  const filteredMembers = members.filter((m) => {
    const namaLengkap = `${m.first_mid_name} ${m.last_name}`.toLowerCase();
    const matchSearch =
      namaLengkap.includes(searchQuery.toLowerCase()) ||
      m.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.nomor_member?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchTier = filterTier === "Semua Tier" || m.id_tier === filterTier;
    return matchSearch && matchTier;
  });

  // --- MODAL HANDLERS ---
  const openAddModal = () => {
    setFormData({ email: "", password: "", salutation: "Mr.", nama_depan: "", nama_belakang: "", kewarganegaraan: "Indonesia", country_code: "+62", nomor_hp: "", tanggal_lahir: "" });
    setIsEditing(false);
    setShowFormModal(true);
  };

  const openEditModal = (item: any) => {
    setFormData({
      email: item.email || "",
      password: "",
      salutation: item.salutation || "Mr.",
      nama_depan: item.first_mid_name || "",
      nama_belakang: item.last_name || "",
      kewarganegaraan: item.kewarganegaraan || "Indonesia",
      country_code: item.country_code || "+62",
      nomor_hp: item.nomor_hp || "",
      tanggal_lahir: item.tanggal_lahir ? item.tanggal_lahir.split("T")[0] : ""
    });
    setSelectedItem(item);
    setIsEditing(true);
    setShowFormModal(true);
  };

  const openDeleteModal = (item: any) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  // --- SAVE (ADD/EDIT) ---
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const method = isEditing ? "PUT" : "POST";
    const payload = isEditing
      ? { ...formData, nomor_member: selectedItem?.nomor_member }
      : { ...formData };

    try {
      const res = await fetch("/api/member", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success) {
        setShowFormModal(false);
        fetchMembers();
      } else {
        alert(json.message || "Gagal menyimpan.");
      }
    } catch (err) {
      alert("Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  };

  // --- DELETE ---
  const executeDelete = async () => {
    if (!selectedItem) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/member?nomor_member=${selectedItem.nomor_member}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setShowDeleteModal(false);
        fetchMembers();
      } else {
        alert(json.message || "Gagal menghapus.");
      }
    } catch (err) {
      alert("Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Kelola Member</h2>
        <button className="btn btn-primary fw-semibold px-4" style={{ backgroundColor: "#0A2463", borderRadius: "8px" }} onClick={openAddModal}>
          <i className="bi bi-plus-lg me-2"></i>Tambah Member
        </button>
      </div>

      {/* SEARCH & FILTER */}
      <div className="card shadow-sm border-0 p-3 mb-4" style={{ borderRadius: "12px" }}>
        <div className="row g-2">
          <div className="col-md-9">
            <input className="form-control" placeholder="Cari nama, email, atau nomor member..."
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <div className="col-md-3">
            <select className="form-select" value={filterTier} onChange={(e) => setFilterTier(e.target.value)}>
              <option>Semua Tier</option>
              <option value="T01">Blue</option>
              <option value="T02">Silver</option>
              <option value="T03">Gold</option>
              <option value="T04">Platinum</option>
            </select>
          </div>
        </div>
      </div>

      {/* TABEL */}
      <div className="card shadow-sm border-0" style={{ borderRadius: "12px" }}>
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th className="px-4 py-3">No. Member</th>
              <th className="py-3">Nama</th>
              <th className="py-3">Email</th>
              <th className="py-3">Tier</th>
              <th className="py-3">Total Miles</th>
              <th className="py-3">Award</th>
              <th className="py-3">Bergabung</th>
              <th className="py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map((m, i) => (
              <tr key={i}>
                <td className="px-4 fw-bold">{m.nomor_member}</td>
                <td>{m.first_mid_name} {m.last_name}</td>
                <td>{m.email}</td>
                <td><span className="badge bg-secondary px-2 py-1">{m.id_tier}</span></td>
                <td>{m.total_miles?.toLocaleString()}</td>
                <td>{m.award_miles?.toLocaleString()}</td>
                <td>{new Date(m.tanggal_bergabung).toLocaleDateString()}</td>
                <td>
                  <button className="btn btn-sm btn-light me-1 text-primary" onClick={() => openEditModal(m)}>
                    <i className="bi bi-pencil-fill"></i>
                  </button>
                  <button className="btn btn-sm btn-light text-danger" onClick={() => openDeleteModal(m)}>
                    <i className="bi bi-trash3-fill"></i>
                  </button>
                </td>
              </tr>
            ))}
            {filteredMembers.length === 0 && (
              <tr><td colSpan={8} className="text-center py-4 text-muted">Tidak ada data member.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL TAMBAH / EDIT */}
      {showFormModal && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg p-2" style={{ borderRadius: "16px" }}>
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">{isEditing ? "Edit Member" : "Tambah Member Baru"}</h5>
                <button type="button" className="btn-close" onClick={() => setShowFormModal(false)}></button>
              </div>
              <div className="modal-body p-4">
                <form onSubmit={handleSave}>
                  <div className="row g-3">

                    <div className="col-md-6">
                      <label className="form-label text-muted fw-semibold small">Email</label>
                      <input type="email" className="form-control" value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-muted fw-semibold small">Password {isEditing && <span className="text-muted">(kosongkan jika tidak diganti)</span>}</label>
                      <input type="password" className="form-control" value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required={!isEditing} />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label text-muted fw-semibold small">Salutation</label>
                      <select className="form-select" value={formData.salutation}
                        onChange={(e) => setFormData({ ...formData, salutation: e.target.value })}>
                        <option>Mr.</option>
                        <option>Ms.</option>
                        <option>Mrs.</option>
                        <option>Dr.</option>
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label text-muted fw-semibold small">Nama Depan</label>
                      <input type="text" className="form-control" value={formData.nama_depan}
                        onChange={(e) => setFormData({ ...formData, nama_depan: e.target.value })} required />
                    </div>

                    <div className="col-md-5">
                      <label className="form-label text-muted fw-semibold small">Nama Belakang</label>
                      <input type="text" className="form-control" value={formData.nama_belakang}
                        onChange={(e) => setFormData({ ...formData, nama_belakang: e.target.value })} required />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-muted fw-semibold small">Kewarganegaraan</label>
                      <select className="form-select" value={formData.kewarganegaraan}
                        onChange={(e) => setFormData({ ...formData, kewarganegaraan: e.target.value })}>
                        <option>Indonesia</option>
                        <option>Malaysia</option>
                        <option>Singapore</option>
                        <option>Other</option>
                      </select>
                    </div>

                    <div className="col-md-2">
                      <label className="form-label text-muted fw-semibold small">Kode</label>
                      <select className="form-select" value={formData.country_code}
                        onChange={(e) => setFormData({ ...formData, country_code: e.target.value })}>
                        <option>+62</option>
                        <option>+60</option>
                        <option>+65</option>
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label text-muted fw-semibold small">Nomor HP</label>
                      <input type="text" className="form-control" value={formData.nomor_hp}
                        onChange={(e) => setFormData({ ...formData, nomor_hp: e.target.value })} />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-muted fw-semibold small">Tanggal Lahir</label>
                      <input type="date" className="form-control" value={formData.tanggal_lahir}
                        onChange={(e) => setFormData({ ...formData, tanggal_lahir: e.target.value })} />
                    </div>

                    <div className="col-12 text-end mt-2">
                      <button type="button" className="btn btn-light me-2 fw-semibold px-4" onClick={() => setShowFormModal(false)} style={{ borderRadius: "8px" }}>Batal</button>
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

      {/* MODAL HAPUS */}
      {showDeleteModal && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg p-2" style={{ borderRadius: "16px" }}>
              <div className="modal-body text-center p-4">
                <i className="bi bi-exclamation-triangle-fill text-danger mb-3" style={{ fontSize: "3.5rem" }}></i>
                <h5 className="fw-bold mb-2">Hapus Member?</h5>
                <p className="text-muted small">Anda yakin ingin menghapus <b>{selectedItem?.first_mid_name} {selectedItem?.last_name}</b>? Tindakan ini tidak dapat dibatalkan.</p>
                <div className="d-flex gap-2 justify-content-center mt-3">
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