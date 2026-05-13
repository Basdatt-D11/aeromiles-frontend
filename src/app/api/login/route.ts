import { pool } from "@/lib/db";

export async function GET() {
  return Response.json({
    message: "Login endpoint active"
  });
}

export async function POST(req: Request) {

  try {

    const body = await req.json();

    const {
      email,
      password
    } = body;

    const result = await pool.query(
      `
      SELECT *
      FROM verify_login(
        $1,
        $2
      )
      `,
      [
        email,
        password
      ]
    );

    return Response.json({
      success: true,
      message: "Login berhasil",
      user: result.rows[0]
    });

  } catch (error: any) {

    console.error(error);

    return Response.json({
      success: false,
      message: error.message.replace("ERROR: ", "")
    });
  }
}