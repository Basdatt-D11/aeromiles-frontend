import { pool } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get("email");

    if (!email) {
      return Response.json(
        { success: false, message: "Email tidak boleh kosong." },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `
      SELECT *
      FROM member
      WHERE LOWER(email) = LOWER($1)
      LIMIT 1
      `,
      [email]
    );

    if (result.rows.length === 0) {
      return Response.json(
        { success: false, message: "Member tidak ditemukan." },
        { status: 404 }
      );
    }

    return Response.json({ success: true, member: result.rows[0] });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, message: "Terjadi error" }, { status: 500 });
  }
}
