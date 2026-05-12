import { pool } from "@/lib/db";

export async function GET() {
  return Response.json({
    message: "Login endpoint active"
  });
}

export async function POST(req: Request) {

  try {

    const body = await req.json();

    const { email, password } = body;
    const normalizedEmail = email?.trim().toLowerCase();

    const result = await pool.query(
      `
      SELECT *
      FROM pengguna
      WHERE LOWER(email) = $1
      AND password = $2
      `,
      [normalizedEmail, password]
    );

    if (result.rows.length === 0) {

      return Response.json({
        success: false,
        message: "Email atau password salah, silakan coba lagi."
      });
    }

    return Response.json({
      success: true,
      message: "Login berhasil",
      user: result.rows[0]
    });

  } catch (error) {

    console.error(error);

    return Response.json({
      success: false,
      message: "Terjadi error"
    });
  }
}