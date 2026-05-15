"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export default function ProfileSettings() {
  const { user } = useAuth();
  
  const [profileAlert, setProfileAlert] = useState<{message: string, type: string} | null>(null);
  const [passwordAlert, setPasswordAlert] = useState<{message: string, type: string} | null>(null);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileAlert({ message: "Profil berhasil diperbarui.", type: "success" });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordAlert({ message: "Harap isi semua kolom password.", type: "danger" });
      return;
    }
    if (oldPassword !== "123456") {
      setPasswordAlert({ message: "Password lama salah. (Demo: password lama adalah 123456)", type: "danger" });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordAlert({ message: "Password baru dan konfirmasi tidak cocok.", type: "danger" });
      return;
    }
    if (newPassword === oldPassword) {
      setPasswordAlert({ message: "Password baru tidak boleh sama dengan password lama.", type: "danger" });
      return;
    }

    setPasswordAlert({ message: "Password berhasil diubah.", type: "success" });
    setTimeout(() => {
      const modalEl = document.getElementById('passwordModal');
      if (modalEl) {
        // @ts-ignore
        const modal = window.bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();
      }
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordAlert(null);
    }, 1500);
  };

  return (
    <div className="row justify-content-center">
      <div className="col-lg-8">
        <h3 className="fw-bold mb-4 text-center mt-3">Pengaturan Profil</h3>
        
        {/* Data Profil Card */}
        <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: "12px" }}>
          <div className="card-body p-4 p-md-5">
            <h5 className="fw-bold mb-4">Data Profil</h5>
            <form onSubmit={handleProfileSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold small">Email</label>
                <input type="email" className="form-control bg-light" value={user?.email || ""} disabled />
              </div>

              {user?.role === 'MEMBER' && (
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">Nomor Member</label>
                    <input type="text" className="form-control bg-light" value={user?.nomor_member || ""} disabled />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">Tanggal Bergabung</label>
                    <input type="text" className="form-control bg-light" value={user?.tanggal_bergabung ? new Date(user.tanggal_bergabung).toLocaleDateString('id-ID') : ""} disabled />
                  </div>
                </div>
              )}
              
              {user?.role === 'STAFF' && (
                <div className="mb-3">
                  <label className="form-label fw-semibold small">ID Staf</label>
                  <input type="text" className="form-control bg-light" value={user?.id_staf || ""} disabled />
                </div>
              )}

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold small">Salutation</label>
                  <select className="form-select" defaultValue={user?.salutation || "Mr."} required>
                    <option value="Mr.">Mr.</option>
                    <option value="Mrs.">Mrs.</option>
                    <option value="Ms.">Ms.</option>
                  </select>
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold small">Nama Depan & Tengah</label>
                  <input type="text" className="form-control" defaultValue={user?.first_mid_name || ""} required />
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold small">Nama Belakang</label>
                  <input type="text" className="form-control" defaultValue={user?.last_name || ""} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold small">Kewarganegaraan</label>
                  <select className="form-select" defaultValue={user?.kewarganegaraan || "Indonesia"} required>
                    <option value="Indonesia">Indonesia</option>
                    <option value="Singapore">Singapore</option>
                    <option value="Malaysia">Malaysia</option>
                  </select>
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold small">Country Code</label>
                  <select className="form-select" defaultValue={user?.country_code || "+62"} required>
                    <option value="+62">+62</option>
                    <option value="+65">+65</option>
                    <option value="+60">+60</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold small">Nomor HP</label>
                  <input type="text" className="form-control" defaultValue={user?.mobile_number || ""} required />
                </div>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label fw-semibold small">Tanggal Lahir</label>
                  <input type="date" className="form-control" defaultValue={user?.tanggal_lahir ? new Date(user.tanggal_lahir).toISOString().split('T')[0] : ""} required />
                </div>
                {user?.role === 'Staff' && (
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">Kode Maskapai</label>
                    <select className="form-select" defaultValue={user?.kode_maskapai || "GA"} required>
                      <option value="GA">GA - Garuda Indonesia</option>
                      <option value="JT">JT - Lion Air</option>
                      <option value="QZ">QZ - AirAsia</option>
                    </select>
                  </div>
                )}
              </div>

              {profileAlert && (
                <div className={`alert alert-${profileAlert.type} py-2 mt-3 small`}>
                  {profileAlert.message}
                </div>
              )}

              <button type="submit" className="btn btn-primary" style={{ backgroundColor: "#1E3A8A", borderColor: "#1E3A8A", padding: "10px 20px" }}>Simpan Perubahan</button>
            </form>
          </div>
        </div>

        {/* Ubah Password Card */}
        <div className="card shadow-sm border-0 mb-5" style={{ borderRadius: "12px" }}>
          <div className="card-body p-4 p-md-5">
            <h5 className="fw-bold mb-3">Ubah Password</h5>
            <button type="button" className="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#passwordModal">Ubah Password</button>
          </div>
        </div>
      </div>

      {/* Modal Ubah Password */}
      <div className="modal fade" id="passwordModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow" style={{ borderRadius: "12px" }}>
            <div className="modal-header border-bottom-0 pb-0">
              <h5 className="modal-title fw-bold">Ubah Password</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handlePasswordSubmit}>
                {passwordAlert && (
                  <div className={`alert alert-${passwordAlert.type} py-2 small`}>
                    {passwordAlert.message}
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label fw-semibold small">Password Lama</label>
                  <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="form-control" required />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold small">Password Baru</label>
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="form-control" required />
                </div>
                <div className="mb-4">
                  <label className="form-label fw-semibold small">Konfirmasi Password Baru</label>
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="form-control" required />
                </div>
                <button type="submit" className="btn btn-primary w-auto" style={{ backgroundColor: "#1E3A8A", borderColor: "#1E3A8A", padding: "8px 24px" }}>Simpan</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
