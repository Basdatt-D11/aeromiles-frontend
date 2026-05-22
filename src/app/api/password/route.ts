import { pool } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs"; // ✅ Import bcryptjs

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { email, oldPassword, newPassword } = body;

    if (!email || !oldPassword || !newPassword) {
      return NextResponse.json({ success: false, message: "Data tidak lengkap." }, { status: 400 });
    }

    const checkRes = await pool.query("SELECT password FROM PENGGUNA WHERE email = $1", [email]);

    if (checkRes.rowCount === 0) {
      return NextResponse.json({ success: false, message: "Akun tidak ditemukan." }, { status: 404 });
    }

    const passwordDiDatabase = checkRes.rows[0].password;

    // ✅ 1. BANDINGKAN PASSWORD INPUT DENGAN HASH DI DATABASE MENGGUNAKAN BCRYPT
    const isMatch = await bcrypt.compare(oldPassword, passwordDiDatabase);
    
    if (!isMatch) {
      return NextResponse.json({ success: false, message: "Password lama Anda salah!" }, { status: 400 });
    }

    // ✅ 2. HASH PASSWORD BARU SEBELUM DISIMPAN KE DATABASE
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // ✅ 3. SIMPAN PASSWORD YANG SUDAH DI-HASH
    await pool.query("UPDATE PENGGUNA SET password = $1 WHERE email = $2", [hashedNewPassword, email]);

    return NextResponse.json({ success: true, message: "Password berhasil diubah." });

  } catch (error: any) {
    console.error("Error ubah password:", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan pada server." }, { status: 500 });
  }
}