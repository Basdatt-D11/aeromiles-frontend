import { pool } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function GET() {
  return Response.json({
    message: "Login endpoint active"
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    const result = await pool.query(
    `SELECT p.*, 
      m.nomor_member, m.tanggal_bergabung,
      s.id_staf, s.kode_maskapai,
      CASE 
        WHEN m.email IS NOT NULL THEN 'MEMBER'
        WHEN s.email IS NOT NULL THEN 'STAFF'
        ELSE 'GUEST'
      END as role,
      p.first_mid_name || ' ' || p.last_name as nama,
      (p.password = crypt($2, p.password)) as is_password_valid
    FROM pengguna p
    LEFT JOIN member m ON p.email = m.email
    LEFT JOIN staf s ON p.email = s.email
    WHERE p.email = $1`,
    [email, password]
  );

    if (result.rows.length === 0) {
      return Response.json({ 
        success: false, 
        message: "Email tidak terdaftar" 
      }, { status: 404 });
    }

    const user = result.rows[0];

    if (!user.is_password_valid) {
      return Response.json({ 
        success: false, 
        message: "Password salah cuy!" 
      }, { status: 401 });
    }

    delete user.password;
    delete user.is_password_valid;

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