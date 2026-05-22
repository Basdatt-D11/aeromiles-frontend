"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import Swal from 'sweetalert2'; 

export default function ProfileSettings() {
  const { user } = useAuth();
  
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  
  // ✅ Balikin state passwordAlert buat nampilin error di DALAM modal
  const [passwordAlert, setPasswordAlert] = useState<{message: string, type: string} | null>(null);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: 'Profil berhasil diperbarui.',
      confirmButtonColor: '#0A2463'
    });
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordAlert(null);

    // 1. Validasi Frontend Dasar
    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordAlert({ message: "Harap isi semua kolom password.", type: "danger" });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordAlert({ message: "Password baru dan konfirmasi tidak cocok.", type: "danger" });
      return;
    }
    if (newPassword === oldPassword) {
      setPasswordAlert({ message: "Password baru tidak boleh sama dengan password lama.", type: "warning" });
      return;
    }

    // 2. Tembak API ke Backend buat ngecek password asli
    try {
      const res = await fetch("/api/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user?.email,       // Kirim email user yang lagi login
          oldPassword: oldPassword, // Kirim password lama inputan user
          newPassword: newPassword  // Kirim password baru
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Kalau password lama bener dan berhasil di-update
        setShowPasswordModal(false);
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Password berhasil diubah.',
          confirmButtonColor: '#0A2463'
        });
        
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        // Kalau password lama salah (dilempar dari backend)
        setPasswordAlert({ message: data.message || "Gagal mengubah password.", type: "danger" });
      }
    } catch (error) {
      setPasswordAlert({ message: "Terjadi kesalahan sistem.", type: "danger" });
    }
  };

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <h3 className="fw-bold mb-4 text-center mt-3" style={{ color: "#0A2463" }}>Pengaturan Profil</h3>
          
          {/* Data Profil Card */}
          <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: "16px" }}>
            <div className="card-body p-4 p-md-5">
              <h5 className="fw-bold mb-4">Data Profil</h5>
              <form onSubmit={handleProfileSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold small">Email</label>
                  <input type="email" className="form-control bg-light" value={user?.email || ""} disabled style={{ borderRadius: "8px" }} />
                </div>

                {user?.role === 'MEMBER' && (
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Nomor Member</label>
                      <input type="text" className="form-control bg-light" value={user?.nomor_member || ""} disabled style={{ borderRadius: "8px" }} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Tanggal Bergabung</label>
                      <input type="text" className="form-control bg-light" value={user?.tanggal_bergabung ? new Date(user.tanggal_bergabung).toLocaleDateString('id-ID') : ""} disabled style={{ borderRadius: "8px" }} />
                    </div>
                  </div>
                )}
                
                {user?.role === 'STAFF' && (
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">ID Staf</label>
                    <input type="text" className="form-control bg-light" value={user?.id_staf || ""} disabled style={{ borderRadius: "8px" }} />
                  </div>
                )}

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">Salutation</label>
                    <select className="form-select" defaultValue={user?.salutation || "Mr."} required style={{ borderRadius: "8px" }}>
                      <option value="Mr.">Mr.</option>
                      <option value="Mrs.">Mrs.</option>
                      <option value="Ms.">Ms.</option>
                    </select>
                  </div>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">Nama Depan & Tengah</label>
                    <input type="text" className="form-control" defaultValue={user?.first_mid_name || ""} required style={{ borderRadius: "8px" }} />
                  </div>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">Nama Belakang</label>
                    <input type="text" className="form-control" defaultValue={user?.last_name || ""} required style={{ borderRadius: "8px" }} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">Kewarganegaraan</label>
                    <select className="form-select" defaultValue={user?.kewarganegaraan || "Indonesia"} required style={{ borderRadius: "8px" }}>
                      <option value="Indonesia">Indonesia</option>
                      <option value="Singapore">Singapore</option>
                      <option value="Malaysia">Malaysia</option>
                    </select>
                  </div>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">Country Code</label>
                    <select className="form-select" defaultValue={user?.country_code || "+62"} required style={{ borderRadius: "8px" }}>
                      <option value="+62">+62</option>
                      <option value="+65">+65</option>
                      <option value="+60">+60</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">Nomor HP</label>
                    <input type="text" className="form-control" defaultValue={user?.mobile_number || ""} required style={{ borderRadius: "8px" }} />
                  </div>
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">Tanggal Lahir</label>
                    <input type="date" className="form-control" defaultValue={user?.tanggal_lahir ? new Date(user.tanggal_lahir).toISOString().split('T')[0] : ""} required style={{ borderRadius: "8px" }} />
                  </div>
                  {user?.role === 'STAFF' && (
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Kode Maskapai</label>
                      <select className="form-select" defaultValue={user?.kode_maskapai || "GA"} required style={{ borderRadius: "8px" }}>
                        <option value="GA">GA - Garuda Indonesia</option>
                        <option value="JT">JT - Lion Air</option>
                        <option value="QZ">QZ - AirAsia</option>
                      </select>
                    </div>
                  )}
                </div>

                <button type="submit" className="btn btn-primary fw-semibold" style={{ backgroundColor: "#0A2463", borderColor: "#0A2463", padding: "10px 24px", borderRadius: "8px" }}>Simpan Perubahan</button>
              </form>
            </div>
          </div>

          {/* Ubah Password Card */}
          <div className="card shadow-sm border-0 mb-5" style={{ borderRadius: "16px" }}>
            <div className="card-body p-4 p-md-5">
              <h5 className="fw-bold mb-3">Ubah Password</h5>
              <button 
                type="button" 
                className="btn btn-outline-secondary fw-semibold" 
                onClick={() => setShowPasswordModal(true)}
                style={{ borderRadius: "8px" }}
              >
                Ubah Password
              </button>
            </div>
          </div>
        </div>

        {/* Modal Ubah Password */}
        {showPasswordModal && (
          <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1040, position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg p-3" style={{ borderRadius: "16px" }}>
                <div className="modal-header border-bottom-0 pb-0">
                  <h5 className="modal-title fw-bold">Ubah Password</h5>
                  <button type="button" className="btn-close" onClick={() => setShowPasswordModal(false)}></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handlePasswordSubmit}>
                    
                    {/* ✅ Alert ditaruh di sini biar rapi di dalem modal */}
                    {passwordAlert && (
                      <div className={`alert alert-${passwordAlert.type} py-2 small`} style={{ borderRadius: "8px" }}>
                        {passwordAlert.message}
                      </div>
                    )}

                    <div className="mb-3">
                      <label className="form-label fw-semibold small">Password Lama</label>
                      <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="form-control" style={{ borderRadius: "8px" }} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold small">Password Baru</label>
                      <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="form-control" style={{ borderRadius: "8px" }} required />
                    </div>
                    <div className="mb-4">
                      <label className="form-label fw-semibold small">Konfirmasi Password Baru</label>
                      <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="form-control" style={{ borderRadius: "8px" }} required />
                    </div>
                    
                    <button type="submit" className="btn btn-primary fw-semibold px-4" style={{ backgroundColor: "#0A2463", borderColor: "#0A2463", borderRadius: "8px" }}>Simpan</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}