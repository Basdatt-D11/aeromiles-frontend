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
      kewarganegaraan,
      role,
      airline_code
    } = body;

    await pool.query(
      `
      CALL register_user(
        $1,$2,$3,$4,$5,
        $6,$7,$8,$9,
        $10,$11
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
        kewarganegaraan,
        role,
        airline_code || null
      ]
    );

    return Response.json({
      success: true,
      message: "Register berhasil"
    });

  } catch (error: any) {

    console.error(error);

    return Response.json({
      success: false,
      message: error.message.replace("ERROR: ", "")
    });
  }
}