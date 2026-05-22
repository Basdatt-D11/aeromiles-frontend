"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import Swal from 'sweetalert2'; 

export default function ProfileSettings() {
  const { user } = useAuth();
  
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordAlert, setPasswordAlert] = useState<{message: string, type: string} | null>(null);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [formData, setFormData] = useState({
    salutation: "",
    first_mid_name: "",
    last_name: "",
    kewarganegaraan: "Indonesia",
    country_code: "+62",
    mobile_number: "",
    tanggal_lahir: "",
    kode_maskapai: "GA"
  });

  // Sinkronisasi data user dari AuthContext ke form
  useEffect(() => {
    if (user) {
      setFormData({
        salutation: user.salutation || "Mr.",
        first_mid_name: user.first_mid_name || "",
        last_name: user.last_name || "",
        kewarganegaraan: user.kewarganegaraan || "Indonesia",
        country_code: user.country_code || "+62",
        mobile_number: user.mobile_number || "",
        tanggal_lahir: user.tanggal_lahir ? new Date(user.tanggal_lahir).toISOString().split('T')[0] : "",
        kode_maskapai: user.kode_maskapai || "GA"
      });
    }
  }, [user]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, email: user?.email, role: user?.role })
    });

    if (res.ok) {
      Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'Profil diperbarui.', confirmButtonColor: '#0A2463' });
    } else {
      Swal.fire({ icon: 'error', title: 'Error!', text: 'Gagal update profil.' });
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordAlert(null);

    if (newPassword !== confirmPassword) {
      setPasswordAlert({ message: "Password baru dan konfirmasi tidak cocok.", type: "danger" });
      return;
    }

    try {
      const res = await fetch("/api/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user?.email, oldPassword, newPassword }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setShowPasswordModal(false);
        Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'Password diubah.', confirmButtonColor: '#0A2463' });
        setOldPassword(""); setNewPassword(""); setConfirmPassword("");
      } else {
        setPasswordAlert({ message: data.message || "Gagal.", type: "danger" });
      }
    } catch (error) {
      setPasswordAlert({ message: "Terjadi kesalahan.", type: "danger" });
    }
  };

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <h3 className="fw-bold mb-4 text-center mt-3" style={{ color: "#0A2463" }}>Pengaturan Profil</h3>
          
          <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: "16px" }}>
            <div className="card-body p-4 p-md-5">
              <h5 className="fw-bold mb-4">Data Profil</h5>
              <form onSubmit={handleProfileSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold small">Email</label>
                  <input type="email" className="form-control bg-light" value={user?.email || ""} disabled />
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">Salutation</label>
                    <select className="form-select" value={formData.salutation} onChange={(e) => setFormData({...formData, salutation: e.target.value})}>
                      <option value="Mr.">Mr.</option><option value="Mrs.">Mrs.</option><option value="Ms.">Ms.</option>
                    </select>
                  </div>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">Nama Depan & Tengah</label>
                    <input type="text" className="form-control" value={formData.first_mid_name} onChange={(e) => setFormData({...formData, first_mid_name: e.target.value})} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">Nama Belakang</label>
                    <input type="text" className="form-control" value={formData.last_name} onChange={(e) => setFormData({...formData, last_name: e.target.value})} required />
                  </div>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">Kewarganegaraan</label>
                    <select className="form-select" value={formData.kewarganegaraan} onChange={(e) => setFormData({...formData, kewarganegaraan: e.target.value})}>
                      <option value="Indonesia">Indonesia</option><option value="Singapore">Singapore</option><option value="Malaysia">Malaysia</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">Nomor HP</label>
                    <input type="text" className="form-control" value={formData.mobile_number} onChange={(e) => setFormData({...formData, mobile_number: e.target.value})} required />
                  </div>
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">Tanggal Lahir</label>
                    <input type="date" className="form-control" value={formData.tanggal_lahir} onChange={(e) => setFormData({...formData, tanggal_lahir: e.target.value})} required />
                  </div>
                  {user?.role === 'STAFF' && (
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Kode Maskapai</label>
                      <select className="form-select" value={formData.kode_maskapai} onChange={(e) => setFormData({...formData, kode_maskapai: e.target.value})}>
                        <option value="GA">GA - Garuda Indonesia</option><option value="JT">JT - Lion Air</option><option value="QZ">QZ - AirAsia</option>
                      </select>
                    </div>
                  )}
                </div>

                <button type="submit" className="btn btn-primary fw-semibold" style={{ backgroundColor: "#0A2463", padding: "10px 24px" }}>Simpan Perubahan</button>
              </form>
            </div>
          </div>

          <div className="card shadow-sm border-0 mb-5" style={{ borderRadius: "16px" }}>
            <div className="card-body p-4 p-md-5">
              <h5 className="fw-bold mb-3">Ubah Password</h5>
              <button type="button" className="btn btn-outline-secondary fw-semibold" onClick={() => setShowPasswordModal(true)}>Ubah Password</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}