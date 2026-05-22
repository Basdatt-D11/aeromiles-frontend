import { pool } from "@/lib/db";
import bcrypt from "bcryptjs"; // ✅ Pastikan bcryptjs udah di-import

export async function GET() {
  return Response.json({
    message: "Login endpoint active"
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // ✅ 1. Tarik data user berdasarkan email aja (jangan ngecek password di SQL)
    const result = await pool.query(
    `SELECT p.*, 
      m.nomor_member, m.tanggal_bergabung,
      s.id_staf, s.kode_maskapai,
      CASE 
        WHEN m.email IS NOT NULL THEN 'MEMBER'
        WHEN s.email IS NOT NULL THEN 'STAFF'
        ELSE 'GUEST'
      END as role,
      p.first_mid_name || ' ' || p.last_name as nama
    FROM pengguna p
    LEFT JOIN member m ON p.email = m.email
    LEFT JOIN staf s ON p.email = s.email
    WHERE p.email = $1`,
    [email] // Cukup masukin email aja di sini
  );

    if (result.rows.length === 0) {
      return Response.json({ 
        success: false, 
        message: "Email tidak terdaftar" 
      }, { status: 404 });
    }

    const user = result.rows[0];

    // ✅ 2. Bandingkan password ketikan user dengan hash dari database
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return Response.json({ 
        success: false, 
        message: "Password anda salah!" 
      }, { status: 401 });
    }

    // ✅ 3. Hapus password dari object sebelum dikirim ke frontend biar aman
    delete user.password;

    return Response.json({
      success: true,
      message: "Login berhasil",
      user: user
    });

  } catch (error: any) {
    console.error(error);
    return Response.json({
      success: false,
      message: error.message.replace("ERROR: ", "")
    }, { status: 500 });
  }
}