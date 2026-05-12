import { pool } from "@/lib/db";

export async function GET() {
  return Response.json({
    message: "Register endpoint active"
  });
}

export async function POST(req: Request) {

  try {

    const body = await req.json();

    const {
      email,
      password,
      salutation,
      first_mid_name,
      last_name,
      country_code,
      mobile_number,
      tanggal_lahir,
      kewarganegaraan
    } = body;

    const normalizedEmail = email?.trim().toLowerCase();

    const duplicate = await pool.query(
      `
      SELECT email
      FROM pengguna
      WHERE LOWER(email) = $1
      LIMIT 1
      `,
      [normalizedEmail]
    );

    if (duplicate.rows.length > 0) {
      return Response.json({
        success: false,
        message: `ERROR: Email "${email}" sudah terdaftar, silakan gunakan email lain.`
      });
    }

    await pool.query(
      `
      INSERT INTO pengguna (
        email,
        password,
        salutation,
        first_mid_name,
        last_name,
        country_code,
        mobile_number,
        tanggal_lahir,
        kewarganegaraan
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9
      )
      `,
      [
        email,
        password,
        salutation,
        first_mid_name,
        last_name,
        country_code,
        mobile_number,
        tanggal_lahir,
        kewarganegaraan
      ]
    );

    return Response.json({
      success: true,
      message: "Register berhasil"
    });

  } catch (error: any) {

    console.error(error);

    // duplicate email
    if (error.code === "23505") {

      return Response.json({
        success: false,
        message: `ERROR: Email "${error.detail}" sudah terdaftar, silakan gunakan email lain.`
      });
    }

    return Response.json({
      success: false,
      message: "Terjadi error"
    });
  }
}