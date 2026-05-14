"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  const [role, setRole] = useState("Member");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password")?.toString() || "";
    const confirmPassword = formData.get("confirm_password")?.toString() || "";

    if (password !== confirmPassword) {
      setError("Password dan konfirmasi password harus sama.");
      return;
    }

    const payload = {
      email: formData.get("email")?.toString() || "",
      password,
      salutation: formData.get("salutation")?.toString() || "",
      first_mid_name: formData.get("first_mid_name")?.toString() || "",
      last_name: formData.get("last_name")?.toString() || "",
      country_code: formData.get("country_code")?.toString() || "",
      mobile_number: formData.get("mobile_number")?.toString() || "",
      tanggal_lahir: formData.get("tanggal_lahir")?.toString() || "",
      kewarganegaraan: formData.get("kewarganegaraan")?.toString() || "",
      role
    };

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message);
        setIsSubmitting(false);
        return;
      }

      setSuccess("Registrasi berhasil. Silakan login.");
      setIsSubmitting(false);
      router.push("/auth/login");
    } catch (err) {
      console.error(err);
      setError("Terjadi error saat registrasi. Silakan coba lagi.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 text-slate-800 font-sans antialiased min-h-screen">
      <nav className="bg-brand-dark py-3">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-white font-bold text-lg">
            <i className="bi bi-airplane text-brand-accent"></i> AeroMiles
          </Link>
          <div className="flex gap-2">
            <Link href="/auth/login" className="flex items-center gap-2 px-4 py-2 text-slate-400 font-medium text-sm hover:text-white transition-colors">
              <i className="bi bi-person"></i> Login
            </Link>
            <Link href="/auth/register" className="flex items-center gap-2 px-4 py-2 text-white bg-white/10 rounded-md font-medium text-sm">
              <i className="bi bi-person-plus"></i> Registrasi
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto mt-12 flex flex-col items-center text-center px-4">
        <div className="w-16 h-16 bg-brand-iconBg text-white rounded-2xl inline-flex items-center justify-center text-3xl mb-4 shadow-sm">
          <i className="bi bi-airplane"></i>
        </div>
        <h2 className="text-2xl font-bold mb-2">Daftar Akun Baru</h2>
        <p className="text-slate-500 text-sm">Bergabung dengan program AeroMiles</p>
      </div>

      <div className="max-w-2xl mx-auto mb-16 mt-8 px-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-10">
          <form onSubmit={handleRegister}>
            <h5 className="text-lg font-bold mb-1">Registrasi</h5>
            <p className="text-slate-500 text-sm mb-6">Pilih peran dan lengkapi data Anda</p>

            <style dangerouslySetInnerHTML={{__html: `
              .segmented-control input[type="radio"]:checked + label {
                background-color: #ffffff;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                color: #0F172A;
              }
            `}} />

            <div className="segmented-control flex bg-slate-100 rounded-lg p-1 mb-6">
              <input type="radio" id="roleMember" name="role" value="Member" className="hidden" checked={role === "Member"} onChange={() => setRole("Member")} />
              <label htmlFor="roleMember" className="flex-1 text-center py-2.5 rounded-md cursor-pointer font-semibold text-sm text-slate-500 transition-all m-0">Member</label>
              
              <input type="radio" id="roleStaff" name="role" value="Staff" className="hidden" checked={role === "Staff"} onChange={() => setRole("Staff")} />
              <label htmlFor="roleStaff" className="flex-1 text-center py-2.5 rounded-md cursor-pointer font-semibold text-sm text-slate-500 transition-all m-0">Staf</label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="col-span-1 md:col-span-1">
                <label className="block font-semibold text-sm text-slate-800 mb-1.5">Email <span className="text-red-500">*</span></label>
                <input type="email" name="email" className="w-full rounded-lg border-slate-300 border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" required />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div>
                <label className="block font-semibold text-sm text-slate-800 mb-1.5">Password <span className="text-red-500">*</span></label>
                <input type="password" name="password" className="w-full rounded-lg border-slate-300 border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" required />
              </div>
              <div>
                <label className="block font-semibold text-sm text-slate-800 mb-1.5">Konfirmasi Password <span className="text-red-500">*</span></label>
                <input type="password" name="confirm_password" className="w-full rounded-lg border-slate-300 border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" required />
              </div>
            </div>

            {error && (
              <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 rounded-lg border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-700">
                {success}
              </div>
            )}

            <hr className="border-slate-200 my-6" />

            <h5 className="font-bold text-base text-slate-900 mb-4 mt-2">Data Pribadi</h5>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block font-semibold text-sm text-slate-800 mb-1.5">Salutation <span className="text-red-500">*</span></label>
                <select name="salutation" className="w-full rounded-lg border-slate-300 border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white" required>
                  <option value="">Pilih</option>
                  <option value="Mr">Mr.</option>
                  <option value="Mrs">Mrs.</option>
                  <option value="Ms">Ms.</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block font-semibold text-sm text-slate-800 mb-1.5">Nama Depan <span className="text-red-500">*</span></label>
                <input type="text" name="first_mid_name" className="w-full rounded-lg border-slate-300 border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" required />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block font-semibold text-sm text-slate-800 mb-1.5">Nama Belakang <span className="text-red-500">*</span></label>
                <input type="text" name="last_name" className="w-full rounded-lg border-slate-300 border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" required />
              </div>
              <div>
                <label className="block font-semibold text-sm text-slate-800 mb-1.5">Kewarganegaraan <span className="text-red-500">*</span></label>
                <select name="kewarganegaraan" className="w-full rounded-lg border-slate-300 border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white" required>
                  <option value="">Pilih negara</option>
                  <option value="ID">Indonesia</option>
                  <option value="SG">Singapore</option>
                  <option value="MY">Malaysia</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block font-semibold text-sm text-slate-800 mb-1.5">Country Code</label>
                <select name="country_code" className="w-full rounded-lg border-slate-300 border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white">
                  <option value="+62">+62</option>
                  <option value="+65">+65</option>
                  <option value="+60">+60</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-sm text-slate-800 mb-1.5">Nomor HP <span className="text-red-500">*</span></label>
                <input type="text" name="mobile_number" className="w-full rounded-lg border-slate-300 border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" required />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block font-semibold text-sm text-slate-800 mb-1.5">Tanggal Lahir <span className="text-red-500">*</span></label>
                <input type="date" name="tanggal_lahir" className="w-full rounded-lg border-slate-300 border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" required />
              </div>
            </div>

            {role === "Staff" && (
              <div id="dataStafSection">
                <hr className="border-slate-200 my-6" />
                <h5 className="font-bold text-base text-slate-900 mb-4 mt-2">Data Staf</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block font-semibold text-sm text-slate-800 mb-1.5">Kode Maskapai <span className="text-red-500">*</span></label>
                    <select name="airline_code" className="w-full rounded-lg border-slate-300 border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white" required>
                      <option value="">Pilih maskapai</option>
                      <option value="GA">Garuda Indonesia (GA)</option>
                      <option value="SQ">Singapore Airlines (SQ)</option>
                      <option value="AA">American Airlines (AA)</option>
                      <option value="EK">Emirates (EK)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8">
              <button type="submit" className="w-full bg-brand-primary hover:bg-brand-primaryHover text-white font-medium py-3 px-4 rounded-lg transition-colors">
                Daftar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
