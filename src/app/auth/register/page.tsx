"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState("Member");
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({ message: "", isSuccess: false });
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        // Kalau sukses, set pesan dan munculin modal
        setModalData({ message: "Registrasi Berhasil! Akun Anda sudah siap digunakan.", isSuccess: true });
        setShowModal(true);
      } else {
        // Kalau gagal (misal email udah ada)
        setModalData({ message: data.message || "Registrasi gagal. Silakan periksa kembali data Anda.", isSuccess: false });
        setShowModal(true);
      }
    } catch (err) {
      setModalData({ message: "Terjadi kesalahan sistem.", isSuccess: false });
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="card shadow-sm border-0 mb-5" style={{ borderRadius: "16px", backgroundColor: "rgba(255, 255, 255, 0.95)", backdropFilter: "blur(10px)" }}>
          <div className="card-body p-5">
            <h3 className="fw-bold mb-4 text-center text-dark">Registrasi Akun Baru</h3>

            <form onSubmit={handleRegister}>
              <div className="row g-3">
                <div className="col-md-2">
                  <label className="form-label text-muted fw-semibold small">Title</label>
                  <select name="salutation" className="form-select" required>
                    <option value="Mr.">Mr.</option>
                    <option value="Mrs.">Mrs.</option>
                    <option value="Ms.">Ms.</option>
                  </select>
                </div>
                <div className="col-md-5">
                  <label className="form-label text-muted fw-semibold small">First & Mid Name</label>
                  <input type="text" name="first_mid_name" className="form-control" required />
                </div>
                <div className="col-md-5">
                  <label className="form-label text-muted fw-semibold small">Last Name</label>
                  <input type="text" name="last_name" className="form-control" required />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted fw-semibold small">Email</label>
                  <input type="email" name="email" className="form-control" required />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted fw-semibold small">Password</label>
                  <input type="password" name="password" className="form-control" required />
                </div>
                <div className="col-md-3">
                  <label className="form-label text-muted fw-semibold small">Kode Negara</label>
                  <select name="country_code" className="form-select" required>
                    <option value="+62">+62</option>
                    <option value="+65">+65</option>
                    <option value="+60">+60</option>
                  </select>
                </div>
                <div className="col-md-9">
                  <label className="form-label text-muted fw-semibold small">Nomor Telepon</label>
                  <input type="text" name="mobile_number" className="form-control" required />
                </div>
                <div className="col-md-4">
                  <label className="form-label text-muted fw-semibold small">Tanggal Lahir</label>
                  <input type="date" name="tanggal_lahir" className="form-control" required />
                </div>
                <div className="col-md-4">
                  <label className="form-label text-muted fw-semibold small">Kewarganegaraan</label>
                  <select name="kewarganegaraan" className="form-select" required>
                    <option value="Indonesia">Indonesia</option>
                    <option value="Singapore">Singapore</option>
                    <option value="Singapore">Malaysia</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label text-muted fw-semibold small">Mendaftar Sebagai</label>
                  <select 
                    name="role" 
                    className="form-select" 
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    required
                  >
                    <option value="Member">Member</option>
                    <option value="Staff">Staff</option>
                  </select>
                </div>
                {/* LOGIKA KONDISIONAL: Cuma muncul kalau Staff yang dipilih */}
                {selectedRole === "Staff" && (
                  <div className="col-md-12 mt-2">
                    <label className="form-label text-muted fw-semibold small">airline_code (Wajib untuk Staff)</label>
                    <input 
                      type="text" 
                      name="airline_code" 
                      className="form-control" 
                      placeholder="Enter airline_code (Contoh: GA, SQ, dll)" 
                      required 
                    />
                  </div>
                )}
                <div className="col-12 text-end mt-5">
                  <a href="/auth/login" className="btn btn-light me-2 fw-semibold px-4" style={{ borderRadius: "8px" }}>Batal</a>
                  <button type="submit" className="btn btn-primary px-4 fw-semibold" disabled={loading} style={{ backgroundColor: "#0A2463", borderRadius: "8px", border: "none" }}>
                    {loading ? "Memproses..." : "Daftar Sekarang"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* CUSTOM MODAL NOTIFIKASI */}
      {showModal && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(5px)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg p-3" style={{ borderRadius: "20px" }}>
              <div className="modal-body text-center p-4">
                
                {/* Ikon Sukses / Gagal */}
                <div className="mb-4 d-flex justify-content-center">
                  <i className={`bi ${modalData.isSuccess ? 'bi-check-circle-fill text-success' : 'bi-x-circle-fill text-danger'}`} style={{ fontSize: "4rem" }}></i>
                </div>
                
                {/* Judul & Pesan */}
                <h4 className="fw-bold mb-3">{modalData.isSuccess ? "Berhasil!" : "Gagal!"}</h4>
                <p className="text-muted px-2">{modalData.message}</p>
                
                {/* Tombol Aksi */}
                <button 
                  className={`btn ${modalData.isSuccess ? 'btn-primary' : 'btn-danger'} w-100 mt-4 py-2 fw-bold`}
                  style={{ borderRadius: "10px", backgroundColor: modalData.isSuccess ? "#0A2463" : "" }}
                  onClick={() => {
                    setShowModal(false);
                    if (modalData.isSuccess) {
                      router.push('/auth/login');
                    }
                  }}
                >
                  {modalData.isSuccess ? "Menuju Halaman Login" : "Tutup"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}